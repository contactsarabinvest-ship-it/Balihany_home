import { useState } from "react";
import { PortfolioLightbox } from "@/components/PortfolioLightbox";
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
import { Building2, MapPin, Award, ArrowLeft, ExternalLink, MessageCircle } from "lucide-react";

const getInstagramUrl = (handle: string) => {
  const s = handle.trim().replace(/^@/, "").split(/[\s/]+/)[0];
  if (!s) return null;
  if (s.startsWith("http")) return s;
  return `https://instagram.com/${s}`;
};

const InstagramIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);
import { ReviewsSection } from "@/components/ReviewsSection";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5).max(20),
  message: z.string().trim().min(1).max(1000),
});

const ConciergeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data: company, isLoading } = useQuery({
    queryKey: ["concierge", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("concierge_companies")
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
      source: `concierge-${id}`,
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

  if (!company) {
    return (
      <main className="py-16">
        <div className="container text-center">
          <p className="text-muted-foreground">Not found</p>
          <Button asChild variant="outline" className="mt-4 rounded-full">
            <Link to="/concierge">{t("nav.concierge") as string}</Link>
          </Button>
        </div>
      </main>
    );
  }

  const services = lang === "ar" ? (company.services_ar?.length ? company.services_ar : company.services_fr) : lang === "en" ? company.services_en : company.services_fr;
  const cities = lang === "ar" ? (company.cities_covered_ar?.length ? company.cities_covered_ar : company.cities_covered_fr) : lang === "en" ? company.cities_covered_en : company.cities_covered_fr;

  return (
    <main className="py-16 md:py-24">
      <div className="container max-w-4xl">
        <Button asChild variant="ghost" className="mb-8 gap-2">
          <Link to="/concierge">
            <ArrowLeft className="h-4 w-4" />
            {t("nav.concierge") as string}
          </Link>
        </Button>

        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-3 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-accent/10">
                {company.logo_url ? (
                  <img src={company.logo_url} alt={company.name} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-8 w-8 text-accent" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{company.name}</h1>
                  {company.is_premium && (
                    <Badge className="bg-accent text-accent-foreground gap-1">
                      <Award className="h-3 w-3" />
                      {t("concierge.premium") as string}
                    </Badge>
                  )}
                </div>
                <p className="flex items-center gap-1 text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  {getLocal(company.city_fr, company.city_en, company.city_ar)}
                </p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {getLocal(company.description_fr, company.description_en, company.description_ar)}
            </p>

            <div>
              <h3 className="mb-3 text-lg font-bold">{t("concierge.services") as string}</h3>
              <div className="flex flex-wrap gap-2">
                {services?.map((s: string, i: number) => (
                  <Badge key={i} variant="secondary">{s}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-bold">{t("concierge.cities") as string}</h3>
              <div className="flex flex-wrap gap-2">
                {cities?.map((c: string, i: number) => (
                  <Badge key={i} variant="outline">{c}</Badge>
                ))}
              </div>
            </div>

            {/* Portfolio & photos section */}
            {(company.portfolio_urls?.length > 0 || company.portfolio_photos?.length > 0) ? (
              <div>
                <h3 className="mb-3 text-lg font-bold">{t("concierge.portfolio") as string}</h3>
                {company.portfolio_urls?.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">{t("concierge.portfolio.urls") as string}</p>
                    <div className="flex flex-wrap gap-2">
                      {company.portfolio_urls.map((url: string, i: number) => {
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
                {company.portfolio_photos?.length > 0 && (
                  <div>
                    <p className="mb-3 text-sm font-medium text-muted-foreground">{t("concierge.portfolio.photos") as string}</p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {company.portfolio_photos.map((photoUrl: string, i: number) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setLightboxIndex(i);
                            setLightboxOpen(true);
                          }}
                          className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted text-left"
                        >
                          <img
                            src={photoUrl.startsWith("http") ? photoUrl : `https://${photoUrl}`}
                            alt={`${company.name} - ${i + 1}`}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </button>
                      ))}
                    </div>
                    <PortfolioLightbox
                      open={lightboxOpen}
                      onOpenChange={setLightboxOpen}
                      photos={company.portfolio_photos}
                      initialIndex={lightboxIndex}
                      title={company.name}
                    />
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2 space-y-4">
            {company.whatsapp && (
              <a
                href={`https://wa.me/${company.whatsapp.replace(/[\s\-()]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-white font-semibold hover:bg-[#1fb855] transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                {t("profile.whatsapp") as string}
              </a>
            )}
            {company.instagram && (() => {
              const instaUrl = getInstagramUrl(company.instagram);
              return instaUrl ? (
                <a
                  href={instaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] px-6 py-3 text-white font-semibold hover:opacity-90 transition-opacity"
                  title={t("profile.instagram") as string}
                >
                  <InstagramIcon />
                  Instagram
                </a>
              ) : null;
            })()}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">{t("concierge.cta.contact") as string}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <Input placeholder={t("form.name") as string} value={form.name} onChange={(e) => update("name", e.target.value)} required className="rounded-lg" />
                  <Input type="email" placeholder={t("form.email") as string} value={form.email} onChange={(e) => update("email", e.target.value)} required className="rounded-lg" />
                  <Input placeholder={t("form.phone") as string} value={form.phone} onChange={(e) => update("phone", e.target.value)} required className="rounded-lg" />
                  <Textarea placeholder={t("form.message") as string} value={form.message} onChange={(e) => update("message", e.target.value)} required className="rounded-lg" />
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
                    {t("concierge.cta.contact") as string}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <ReviewsSection conciergeCompanyId={company.id} />
      </div>
    </main>
  );
};

export default ConciergeProfile;
