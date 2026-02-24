import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Paintbrush, MapPin, Award, ArrowLeft, ExternalLink, MessageCircle } from "lucide-react";
import { ReviewsSection } from "@/components/ReviewsSection";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5).max(20),
  message: z.string().trim().min(1).max(1000),
});

const DesignerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const { data: designer, isLoading } = useQuery({
    queryKey: ["designer", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("designers")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactSchema.safeParse(form).success) return;

    await supabase.from("contact_submissions").insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      source: `designer-${id}`,
    });

    toast({ title: t("form.success") as string });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const getLocal = (fr: string, en: string, ar: string) => {
    if (lang === "ar") return ar || fr;
    if (lang === "en") return en || fr;
    return fr;
  };

  if (isLoading) {
    return (
      <main className="py-16">
        <div className="container max-w-4xl">
          <div className="h-96 animate-pulse rounded-2xl bg-muted" />
        </div>
      </main>
    );
  }

  if (!designer) {
    return (
      <main className="py-16">
        <div className="container text-center">
          <p className="text-muted-foreground">Not found</p>
          <Button asChild variant="outline" className="mt-4 rounded-full">
            <Link to="/designers">{t("nav.designers") as string}</Link>
          </Button>
        </div>
      </main>
    );
  }

  const styles = lang === "ar" ? (designer.styles_ar?.length ? designer.styles_ar : designer.styles_fr) : lang === "en" ? designer.styles_en : designer.styles_fr;

  return (
    <main className="py-16 md:py-24">
      <div className="container max-w-4xl">
        <Button asChild variant="ghost" className="mb-8 gap-2">
          <Link to="/designers">
            <ArrowLeft className="h-4 w-4" />
            {t("nav.designers") as string}
          </Link>
        </Button>

        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-3 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-terracotta-light">
                {designer.logo_url ? (
                  <img src={designer.logo_url} alt={designer.name} className="h-full w-full object-cover" />
                ) : (
                  <Paintbrush className="h-8 w-8 text-terracotta" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{designer.name}</h1>
                  {designer.is_premium && (
                    <Badge className="bg-terracotta text-terracotta-foreground gap-1">
                      <Award className="h-3 w-3" />
                      {t("concierge.premium") as string}
                    </Badge>
                  )}
                </div>
                <p className="flex items-center gap-1 text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  {getLocal(designer.city_fr, designer.city_en, designer.city_ar)}
                </p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {getLocal(designer.description_fr, designer.description_en, designer.description_ar)}
            </p>

            <div>
              <h3 className="mb-3 text-lg font-bold">{t("designers.styles") as string}</h3>
              <div className="flex flex-wrap gap-2">
                {styles?.map((s: string, i: number) => (
                  <Badge key={i} variant="secondary">{s}</Badge>
                ))}
              </div>
            </div>

            {/* Portfolio section */}
            {((designer.portfolio_photos?.length ?? 0) > 0 || (designer.portfolio_urls?.length ?? 0) > 0) && (
              <div>
                <h3 className="mb-3 text-lg font-bold">{t("concierge.portfolio") as string}</h3>
                {(designer.portfolio_photos?.length ?? 0) > 0 && (
                  <div className="mb-4">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">{t("concierge.portfolio.photos") as string}</p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {(designer.portfolio_photos ?? []).map((photoUrl: string, i: number) => (
                        <a
                          key={i}
                          href={photoUrl.startsWith("http") ? photoUrl : `https://${photoUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
                        >
                          <img
                            src={photoUrl.startsWith("http") ? photoUrl : `https://${photoUrl}`}
                            alt={`${designer.name} - ${i + 1}`}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {(designer.portfolio_urls?.length ?? 0) > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">{t("concierge.portfolio.urls") as string}</p>
                    <div className="flex flex-wrap gap-2">
                      {designer.portfolio_urls.map((url: string, i: number) => {
                        const href = url.startsWith("http") ? url : `https://${url}`;
                        let label = url;
                        try {
                          label = new URL(href).hostname;
                        } catch {
                          label = url.length > 30 ? `${url.slice(0, 27)}...` : url;
                        }
                        return (
                          <a
                            key={i}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            {label}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-4">
            {designer.whatsapp && (
              <a
                href={`https://wa.me/${designer.whatsapp.replace(/[\s\-()]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-white font-semibold hover:bg-[#1fb855] transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                {t("profile.whatsapp") as string}
              </a>
            )}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">{t("designers.cta.contact") as string}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <Input placeholder={t("form.name") as string} value={form.name} onChange={(e) => update("name", e.target.value)} required className="rounded-lg" />
                  <Input type="email" placeholder={t("form.email") as string} value={form.email} onChange={(e) => update("email", e.target.value)} required className="rounded-lg" />
                  <Input placeholder={t("form.phone") as string} value={form.phone} onChange={(e) => update("phone", e.target.value)} required className="rounded-lg" />
                  <Textarea placeholder={t("form.message") as string} value={form.message} onChange={(e) => update("message", e.target.value)} required className="rounded-lg" />
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
                    {t("designers.cta.contact") as string}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <ReviewsSection designerId={designer.id} />
      </div>
    </main>
  );
};

export default DesignerProfile;
