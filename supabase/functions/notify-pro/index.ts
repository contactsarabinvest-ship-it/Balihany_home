// Supabase Edge Function: notify-pro
// Sends an email to the professional when a client contacts them via the profile form.
//
// DEPLOYMENT:
//   1. Install Supabase CLI: npm i -g supabase
//   2. Link project: supabase link --project-ref <your-project-ref>
//   3. Set secrets:
//        supabase secrets set RESEND_API_KEY=re_xxxxx
//        supabase secrets set NOTIFICATION_FROM_EMAIL=noreply@balihany.com
//   4. Deploy: supabase functions deploy notify-pro
//   5. Run the SQL in SETUP_EMAIL_NOTIFICATIONS.sql in the Supabase SQL Editor
//
// The function is called automatically by a database trigger on contact_submissions INSERT.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = Deno.env.get("NOTIFICATION_FROM_EMAIL") || "noreply@balihany.com";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  source: string;
}

Deno.serve(async (req) => {
  try {
    const { record } = (await req.json()) as { record: ContactSubmission };
    const source = record.source || "";

    // Only process pro profile contact forms (concierge-xxx, menage-xxx, designer-xxx)
    const match = source.match(/^(concierge|menage|designer)-(.+)$/);
    if (!match) {
      return new Response(JSON.stringify({ skipped: true }), { status: 200 });
    }

    const [, type, proId] = match;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Look up the professional's email via their user_id → auth.users
    const table =
      type === "concierge"
        ? "concierge_companies"
        : type === "menage"
          ? "menage_companies"
          : "designers";

    const { data: pro } = await supabase
      .from(table)
      .select("name, user_id")
      .eq("id", proId)
      .single();

    if (!pro?.user_id) {
      return new Response(JSON.stringify({ skipped: true, reason: "no user_id" }), { status: 200 });
    }

    const { data: authUser } = await supabase.auth.admin.getUserById(pro.user_id);
    const proEmail = authUser?.user?.email;

    if (!proEmail) {
      return new Response(JSON.stringify({ skipped: true, reason: "no email" }), { status: 200 });
    }

    // Send email via Resend
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `BaliHany <${FROM_EMAIL}>`,
        to: [proEmail],
        subject: `Nouveau message de ${record.name} — BaliHany`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
            <h2 style="color:#2d6a4f">Nouveau message client</h2>
            <p>Bonjour <strong>${pro.name}</strong>,</p>
            <p>Un client vous a contacté via votre profil BaliHany :</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              <tr><td style="padding:8px 0;color:#666">Nom</td><td style="padding:8px 0"><strong>${record.name}</strong></td></tr>
              <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${record.email}">${record.email}</a></td></tr>
              ${record.phone ? `<tr><td style="padding:8px 0;color:#666">Téléphone</td><td style="padding:8px 0">${record.phone}</td></tr>` : ""}
              ${record.message ? `<tr><td style="padding:8px 0;color:#666;vertical-align:top">Message</td><td style="padding:8px 0">${record.message}</td></tr>` : ""}
            </table>
            <p>Répondez directement à ce client en utilisant les coordonnées ci-dessus.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
            <p style="font-size:12px;color:#999">Cet email a été envoyé automatiquement par BaliHany.</p>
          </div>
        `,
      }),
    });

    const emailResult = await emailRes.json();
    return new Response(JSON.stringify({ sent: true, emailResult }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
