import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { KeyRound, PenTool } from "lucide-react";

export function UserTypeModal() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const uid = session.user.id;
      setUserId(uid);

      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("user_id", uid)
        .maybeSingle();

      if (!profile?.user_type) {
        setOpen(true);
      }
    };

    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) check();
    });

    return () => subscription.unsubscribe();
  }, []);

  const select = async (type: "investor" | "professional") => {
    if (!userId) return;

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      await supabase.from("profiles").update({ user_type: type }).eq("user_id", userId);
    } else {
      await supabase.from("profiles").insert({ user_id: userId, user_type: type });
    }

    setOpen(false);

    if (type === "professional") {
      navigate("/concierge-signup?complete=1");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-background p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight">
          {t("userType.title") as string}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Investor / Host */}
          <button
            onClick={() => select("investor")}
            className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-border p-6 transition-all hover:border-accent hover:bg-accent/5"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-muted-foreground/20 transition-colors group-hover:border-accent/40">
              <KeyRound className="h-9 w-9 text-muted-foreground transition-colors group-hover:text-accent" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold">{t("userType.investor") as string}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {t("userType.investorDesc") as string}
              </p>
            </div>
          </button>

          {/* Professional */}
          <button
            onClick={() => select("professional")}
            className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-border p-6 transition-all hover:border-accent hover:bg-accent/5"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-muted-foreground/20 transition-colors group-hover:border-accent/40">
              <PenTool className="h-9 w-9 text-muted-foreground transition-colors group-hover:text-accent" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold">{t("userType.professional") as string}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {t("userType.professionalDesc") as string}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
