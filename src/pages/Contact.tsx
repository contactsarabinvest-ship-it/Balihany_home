import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageMeta } from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MessageSquare, Instagram, Facebook, Linkedin } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(2000),
});

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactSchema.safeParse(form).success) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
        source: "contact",
      });
      if (error) {
        toast({ title: error.message, variant: "destructive" });
        return;
      }
      toast({ title: t("contact.success") as string });
      setForm({ name: "", email: "", subject: "", message: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="py-16 md:py-24">
      <PageMeta title={t("contact.title") as string} description={t("contact.subtitle") as string} />
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            {t("contact.title") as string}
          </h1>
          <p className="text-muted-foreground">{t("contact.subtitle") as string}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-3">
            <Card className="rounded-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <Input
                    placeholder={t("form.name") as string}
                    value={form.name}
                    onChange={e => update("name", e.target.value)}
                    required
                    className="rounded-lg"
                  />
                  <Input
                    type="email"
                    placeholder={t("form.email") as string}
                    value={form.email}
                    onChange={e => update("email", e.target.value)}
                    required
                    className="rounded-lg"
                  />
                  <Input
                    placeholder={t("contact.subject") as string}
                    value={form.subject}
                    onChange={e => update("subject", e.target.value)}
                    required
                    className="rounded-lg"
                  />
                  <Textarea
                    placeholder={t("form.message") as string}
                    value={form.message}
                    onChange={e => update("message", e.target.value)}
                    required
                    rows={5}
                    className="rounded-lg"
                  />
                  <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
                    {loading ? "..." : t("contact.send") as string}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="h-5 w-5 text-accent" />
                <span className="font-semibold">Email</span>
              </div>
              <a href="mailto:contact@balihany.com" className="text-muted-foreground hover:text-accent transition-colors">
                contact@balihany.com
              </a>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="h-5 w-5 text-accent" />
                <span className="font-semibold">WhatsApp</span>
              </div>
              <a
                href={`https://wa.me/212600000000?text=${encodeURIComponent("Bonjour, je suis intéressé par Balihany.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
              >
                {t("contact.whatsapp") as string}
              </a>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <span className="font-semibold block mb-3">Social</span>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/balihany.ma/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
                <a href="https://www.facebook.com/profile.php?id=61588372109062" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
