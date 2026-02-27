import { useState, useRef, useEffect } from "react";
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
import { Paintbrush, MapPin, Award, ArrowLeft, ExternalLink, MessageCircle, Share2, Bookmark, BookmarkCheck, Phone, Globe } from "lucide-react";
import { ReviewsSection } from "@/components/ReviewsSection";
import { PageMeta } from "@/components/PageMeta";
import { useSaveProfile } from "@/hooks/useSaveProfile";
import { z } from "zod";

const getInstagramUrl = (handle: string) => {
  const s = handle.trim().replace(/^@/, "").split(/[\s/]+/)[0];
  if (!s) return null;
  if (s.startsWith("http")) return s;
  return `https://instagram.com/${s}`;
};

const InstagramIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5).max(20),
  message: z.string().trim().min(1).max(1000),
});

const TABS = ["about", "styles", "portfolio", "business", "credentials", "reviews"] as const;

const DesignerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("about");
  const { saved, toggle: toggleSave } = useSaveProfile("designer", id);
  const tabsRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id.replace("section-", ""));
          }
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );
    for (const tab of TABS) {
      const el = document.getElementById(`section-${tab}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [designer]);

  const scrollTo = (tab: string) => {
    const el = document.getElementById(`section-${tab}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: designer?.name, url });
        toast({ title: t("profile.shared") as string });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: t("profile.linkCopied") as string });
    }
  };

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
        <div className="container max-w-5xl space-y-6">
          <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
          <div className="flex gap-5">
            <div className="h-20 w-20 animate-pulse rounded-2xl bg-muted" />
            <div className="flex-1 space-y-3">
              <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
              <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <div className="h-px bg-border" />
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <div className="h-40 animate-pulse rounded-xl bg-muted" />
              <div className="h-24 animate-pulse rounded-xl bg-muted" />
            </div>
            <div className="h-80 animate-pulse rounded-2xl bg-muted" />
          </div>
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
  const metaDesc = `${designer.name} — ${getLocal(designer.city_fr, designer.city_en, designer.city_ar)}. ${getLocal(designer.description_fr, designer.description_en, designer.description_ar).slice(0, 120)}`;
  const instaUrl = designer.instagram ? getInstagramUrl(designer.instagram) : null;
  const hasPortfolio = ((designer.portfolio_photos?.length ?? 0) > 0 || (designer.portfolio_urls?.length ?? 0) > 0);
  const hasCredentials = (designer.credentials?.length ?? 0) > 0;
  const hasBusinessInfo = designer.phone || designer.website;

  const visibleTabs = TABS.filter((tab) => {
    if (tab === "portfolio" && !hasPortfolio) return false;
    if (tab === "credentials" && !hasCredentials) return false;
    if (tab === "business" && !hasBusinessInfo) return false;
    return true;
  });

  return (
    <main className="py-10 md:py-16">
      <PageMeta title={designer.name} description={metaDesc} />
      <div className="container max-w-5xl">

        <Button asChild variant="ghost" size="sm" className="mb-6 gap-2 text-muted-foreground">
          <Link to="/designers">
            <ArrowLeft className="h-4 w-4" />
            {t("nav.designers") as string}
          </Link>
        </Button>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-terracotta-light shadow-sm">
            {designer.logo_url ? (
              <img src={designer.logo_url} alt={designer.name} className="h-full w-full object-cover" />
            ) : (
              <Paintbrush className="h-10 w-10 text-terracotta" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{designer.name}</h1>
              {designer.is_premium && (
                <Badge className="bg-terracotta text-terracotta-foreground gap-1">
                  <Award className="h-3 w-3" />
                  {t("concierge.premium") as string}
                </Badge>
              )}
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
              <span className="text-sm font-medium">{t("nav.designers") as string}</span>
              <span className="text-muted-foreground/40">·</span>
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-sm">{getLocal(designer.city_fr, designer.city_en, designer.city_ar)}</span>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {designer.whatsapp && (
                <a
                  href={`https://wa.me/${designer.whatsapp.replace(/[\s\-()]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#1fb855] transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              )}
              {instaUrl && (
                <a
                  href={instaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] px-4 py-1.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                >
                  <InstagramIcon className="h-3.5 w-3.5" />
                  Instagram
                </a>
              )}
              <div className="ml-auto flex gap-1.5">
                <button onClick={handleShare} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                  <Share2 className="h-3.5 w-3.5" />
                  {t("profile.share") as string}
                </button>
                <button onClick={toggleSave} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${saved ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:bg-muted"}`}>
                  {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                  {saved ? t("profile.saved") as string : t("profile.save") as string}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div ref={tabsRef} className="sticky top-16 z-20 -mx-4 mt-6 overflow-x-auto border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <nav className="flex gap-1">
            {visibleTabs.map((tab) => (
              <button key={tab} onClick={() => scrollTo(tab)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {t(`profile.tab.${tab}`) as string}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2 space-y-10">

            <section id="section-about" className="scroll-mt-28">
              <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">{t("profile.tab.about") as string}</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {getLocal(designer.description_fr, designer.description_en, designer.description_ar)}
              </p>
            </section>

            <section id="section-styles" className="scroll-mt-28">
              <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">{t("designers.styles") as string}</h2>
              <div className="flex flex-wrap gap-2">
                {styles?.map((s: string, i: number) => (
                  <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">{s}</Badge>
                ))}
              </div>
            </section>

            {hasPortfolio && (
              <section id="section-portfolio" className="scroll-mt-28">
                <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">
                  {t("concierge.portfolio") as string}
                  {(designer.portfolio_photos?.length ?? 0) > 0 ? (
                    <span className="ml-2 text-base font-normal text-muted-foreground">{designer.portfolio_photos!.length} {lang === "fr" ? "photo(s)" : lang === "ar" ? "صورة" : "photo(s)"}</span>
                  ) : null}
                </h2>
                {(designer.portfolio_photos?.length ?? 0) > 0 && (
                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {(designer.portfolio_photos ?? []).map((photoUrl: string, i: number) => (
                        <button key={i} type="button" onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted text-left">
                          <img src={photoUrl.startsWith("http") ? photoUrl : `https://${photoUrl}`} alt={`${designer.name} - ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        </button>
                      ))}
                    </div>
                    <PortfolioLightbox open={lightboxOpen} onOpenChange={setLightboxOpen} photos={designer.portfolio_photos ?? []} initialIndex={lightboxIndex} title={designer.name} />
                  </div>
                )}
                {(designer.portfolio_urls?.length ?? 0) > 0 && (
                  <div>
                    <p className="mb-3 text-sm font-medium text-muted-foreground">{t("concierge.portfolio.urls") as string}</p>
                    <div className="flex flex-wrap gap-2">
                      {designer.portfolio_urls.map((url: string, i: number) => {
                        const href = url.startsWith("http") ? url : `https://${url}`;
                        let label = url;
                        try { label = new URL(href).hostname; } catch { label = url.length > 30 ? `${url.slice(0, 27)}...` : url; }
                        return (
                          <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                            <ExternalLink className="h-3.5 w-3.5" />
                            {label}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            )}

            {hasBusinessInfo && (
              <section id="section-business" className="scroll-mt-28">
                <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">{t("profile.businessDetails") as string}</h2>
                <div className="space-y-3">
                  {designer.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${designer.phone}`} className="text-sm hover:underline">{designer.phone}</a>
                    </div>
                  )}
                  {designer.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={designer.website.startsWith("http") ? designer.website : `https://${designer.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">{designer.website}</a>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{getLocal(designer.city_fr, designer.city_en, designer.city_ar)}</span>
                  </div>
                </div>
              </section>
            )}

            {hasCredentials && (
              <section id="section-credentials" className="scroll-mt-28">
                <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold">{t("profile.credentials") as string}</h2>
                <div className="flex flex-wrap gap-2">
                  {designer.credentials!.map((cred: string, i: number) => (
                    <Badge key={i} variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
                      <Award className="h-3.5 w-3.5 text-amber-500" />
                      {cred}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <section id="section-reviews" className="scroll-mt-28">
              <ReviewsSection designerId={designer.id} />
            </section>
          </div>

          <div className="md:col-span-1">
            <div className="md:sticky md:top-24 space-y-4">
              <Card className="rounded-2xl shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{t("designers.cta.contact") as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="grid gap-3">
                    <Input placeholder={t("form.name") as string} value={form.name} onChange={(e) => update("name", e.target.value)} required className="rounded-lg" />
                    <Input type="email" placeholder={t("form.email") as string} value={form.email} onChange={(e) => update("email", e.target.value)} required className="rounded-lg" />
                    <Input placeholder={t("form.phone") as string} value={form.phone} onChange={(e) => update("phone", e.target.value)} required className="rounded-lg" />
                    <Textarea placeholder={t("form.message") as string} value={form.message} onChange={(e) => update("message", e.target.value)} required rows={3} className="rounded-lg" />
                    <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">{t("designers.cta.contact") as string}</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DesignerProfile;
