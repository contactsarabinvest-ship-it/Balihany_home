import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { LogoUpload, PortfolioUpload } from "@/components/ImageUpload";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Building2, Clock, CheckCircle, Pencil, ExternalLink, Paintbrush, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";

type ConciergeCompany = Database["public"]["Tables"]["concierge_companies"]["Row"];
type Designer = Database["public"]["Tables"]["designers"]["Row"];
type MenageCompany = Database["public"]["Tables"]["menage_companies"]["Row"];

type ConciergeEditForm = {
  name: string;
  city: string;
  description: string;
  services: string;
  citiesCovered: string;
  logoUrl: string | null;
  portfolioUrls: string;
  portfolioPhotos: string;
  portfolioPhotoUrls: string[];
  whatsapp: string;
};

type DesignerEditForm = {
  name: string;
  city: string;
  description: string;
  styles: string;
  budgetLevel: string;
  logoUrl: string | null;
  portfolioUrls: string;
  portfolioPhotos: string;
  portfolioPhotoUrls: string[];
  whatsapp: string;
};

type MenageEditForm = {
  name: string;
  city: string;
  description: string;
  services: string;
  citiesCovered: string;
  logoUrl: string | null;
  portfolioUrls: string;
  portfolioPhotos: string;
  portfolioPhotoUrls: string[];
  whatsapp: string;
};

const Dashboard = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<"concierge" | "designer" | "menage" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [conciergeForm, setConciergeForm] = useState<ConciergeEditForm | null>(null);
  const [designerForm, setDesignerForm] = useState<DesignerEditForm | null>(null);
  const [menageForm, setMenageForm] = useState<MenageEditForm | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/login");
      else setUserId(session.user.id);
    });
  }, [navigate]);

  const { data: companies } = useQuery({
    queryKey: ["my-companies", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("concierge_companies")
        .select("*")
        .eq("user_id", userId!);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: designers } = useQuery({
    queryKey: ["my-designers", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("designers")
        .select("*")
        .eq("user_id", userId!);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: menageCompanies } = useQuery({
    queryKey: ["my-menage", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menage_companies")
        .select("*")
        .eq("user_id", userId!);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const getLocalField = (fr: string, en: string, ar: string) => {
    if (lang === "ar") return ar || fr;
    if (lang === "en") return en || fr;
    return fr;
  };

  const startEditConcierge = (c: ConciergeCompany) => {
    setEditingType("concierge");
    setEditingId(c.id);
    const pending = c.portfolio_photos_pending ?? [];
    setConciergeForm({
      name: c.name,
      city: getLocalField(c.city_fr, c.city_en, c.city_ar),
      description: getLocalField(c.description_fr, c.description_en, c.description_ar),
      services: (c.services_fr ?? c.services_en ?? c.services_ar ?? []).join(", "),
      citiesCovered: (c.cities_covered_fr ?? c.cities_covered_en ?? c.cities_covered_ar ?? []).join(", "),
      logoUrl: c.logo_url,
      portfolioUrls: (c.portfolio_urls ?? []).join(", "),
      portfolioPhotos: "",
      portfolioPhotoUrls: pending,
      whatsapp: c.whatsapp ?? "",
    });
    setDesignerForm(null);
    setMenageForm(null);
  };

  const startEditDesigner = (d: Designer) => {
    setEditingType("designer");
    setEditingId(d.id);
    const pending = d.portfolio_photos_pending ?? [];
    setDesignerForm({
      name: d.name,
      city: getLocalField(d.city_fr, d.city_en, d.city_ar),
      description: getLocalField(d.description_fr, d.description_en, d.description_ar),
      styles: (d.styles_fr ?? d.styles_en ?? d.styles_ar ?? []).join(", "),
      budgetLevel: d.budget_level,
      logoUrl: d.logo_url,
      portfolioUrls: (d.portfolio_urls ?? []).join(", "),
      portfolioPhotos: "",
      portfolioPhotoUrls: pending,
      whatsapp: d.whatsapp ?? "",
    });
    setConciergeForm(null);
    setMenageForm(null);
  };

  const startEditMenage = (m: MenageCompany) => {
    setEditingType("menage");
    setEditingId(m.id);
    const pending = m.portfolio_photos_pending ?? [];
    setMenageForm({
      name: m.name,
      city: getLocalField(m.city_fr, m.city_en, m.city_ar),
      description: getLocalField(m.description_fr, m.description_en, m.description_ar),
      services: (m.services_fr ?? m.services_en ?? m.services_ar ?? []).join(", "),
      citiesCovered: (m.cities_covered_fr ?? m.cities_covered_en ?? m.cities_covered_ar ?? []).join(", "),
      logoUrl: m.logo_url,
      portfolioUrls: (m.portfolio_urls ?? []).join(", "),
      portfolioPhotos: "",
      portfolioPhotoUrls: pending,
      whatsapp: m.whatsapp ?? "",
    });
    setConciergeForm(null);
    setDesignerForm(null);
  };

  const cancelEdit = () => {
    setEditingType(null);
    setEditingId(null);
    setConciergeForm(null);
    setDesignerForm(null);
    setMenageForm(null);
  };

  const handleSaveConcierge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conciergeForm || !editingId) return;

    const servicesArr = conciergeForm.services.split(",").map((s) => s.trim()).filter(Boolean);
    const citiesArr = conciergeForm.citiesCovered.split(",").map((s) => s.trim()).filter(Boolean);
    const portfolioUrlsArr = conciergeForm.portfolioUrls.split(",").map((s) => s.trim()).filter(Boolean);
    const pastedPhotos = conciergeForm.portfolioPhotos.split(",").map((s) => s.trim()).filter(Boolean);
    const portfolioPhotosPending = [...conciergeForm.portfolioPhotoUrls, ...pastedPhotos];

    setSaving(true);
    const { error } = await supabase
      .from("concierge_companies")
      .update({
        name: conciergeForm.name,
        logo_url: conciergeForm.logoUrl,
        city_fr: conciergeForm.city,
        city_en: conciergeForm.city,
        city_ar: conciergeForm.city,
        description_fr: conciergeForm.description,
        description_en: conciergeForm.description,
        description_ar: conciergeForm.description,
        services_fr: servicesArr,
        services_en: servicesArr,
        services_ar: servicesArr,
        cities_covered_fr: citiesArr,
        cities_covered_en: citiesArr,
        cities_covered_ar: citiesArr,
        portfolio_urls: portfolioUrlsArr,
        portfolio_photos_pending: portfolioPhotosPending,
        whatsapp: conciergeForm.whatsapp.trim() || null,
      })
      .eq("id", editingId);

    setSaving(false);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    toast({ title: t("form.success") as string });
    queryClient.invalidateQueries({ queryKey: ["my-companies", userId] });
    queryClient.invalidateQueries({ queryKey: ["concierge", editingId] });
    cancelEdit();
  };

  const handleSaveDesigner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!designerForm || !editingId) return;

    const stylesArr = designerForm.styles.split(",").map((s) => s.trim()).filter(Boolean);
    const portfolioUrlsArr = designerForm.portfolioUrls.split(",").map((s) => s.trim()).filter(Boolean);
    const pastedPhotos = designerForm.portfolioPhotos.split(",").map((s) => s.trim()).filter(Boolean);
    const portfolioPhotosPending = [...designerForm.portfolioPhotoUrls, ...pastedPhotos];

    setSaving(true);
    const { error } = await supabase
      .from("designers")
      .update({
        name: designerForm.name,
        logo_url: designerForm.logoUrl,
        city_fr: designerForm.city,
        city_en: designerForm.city,
        city_ar: designerForm.city,
        description_fr: designerForm.description,
        description_en: designerForm.description,
        description_ar: designerForm.description,
        styles_fr: stylesArr,
        styles_en: stylesArr,
        styles_ar: stylesArr,
        budget_level: designerForm.budgetLevel,
        portfolio_urls: portfolioUrlsArr,
        portfolio_photos_pending: portfolioPhotosPending,
        whatsapp: designerForm.whatsapp.trim() || null,
      })
      .eq("id", editingId);

    setSaving(false);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    toast({ title: t("form.success") as string });
    queryClient.invalidateQueries({ queryKey: ["my-designers", userId] });
    queryClient.invalidateQueries({ queryKey: ["designer", editingId] });
    cancelEdit();
  };

  const handleSaveMenage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menageForm || !editingId) return;

    const servicesArr = menageForm.services.split(",").map((s) => s.trim()).filter(Boolean);
    const citiesArr = menageForm.citiesCovered.split(",").map((s) => s.trim()).filter(Boolean);
    const portfolioUrlsArr = menageForm.portfolioUrls.split(",").map((s) => s.trim()).filter(Boolean);
    const pastedPhotos = menageForm.portfolioPhotos.split(",").map((s) => s.trim()).filter(Boolean);
    const portfolioPhotosPending = [...menageForm.portfolioPhotoUrls, ...pastedPhotos];

    setSaving(true);
    const { error } = await supabase
      .from("menage_companies")
      .update({
        name: menageForm.name,
        logo_url: menageForm.logoUrl,
        city_fr: menageForm.city,
        city_en: menageForm.city,
        city_ar: menageForm.city,
        description_fr: menageForm.description,
        description_en: menageForm.description,
        description_ar: menageForm.description,
        services_fr: servicesArr,
        services_en: servicesArr,
        services_ar: servicesArr,
        cities_covered_fr: citiesArr,
        cities_covered_en: citiesArr,
        cities_covered_ar: citiesArr,
        portfolio_urls: portfolioUrlsArr,
        portfolio_photos_pending: portfolioPhotosPending,
        whatsapp: menageForm.whatsapp.trim() || null,
      })
      .eq("id", editingId);

    setSaving(false);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    toast({ title: t("form.success") as string });
    queryClient.invalidateQueries({ queryKey: ["my-menage", userId] });
    queryClient.invalidateQueries({ queryKey: ["menage", editingId] });
    cancelEdit();
  };

  useEffect(() => {
    if (editingType) return;
    if (!companies?.length && !designers?.length && !menageCompanies?.length) return;
    const firstPending = companies?.find((c) => c.status === "pending");
    if (firstPending) {
      startEditConcierge(firstPending);
      return;
    }
    const firstPendingMenage = menageCompanies?.find((m) => m.status === "pending");
    if (firstPendingMenage) {
      startEditMenage(firstPendingMenage);
      return;
    }
    const firstPendingDesigner = designers?.find((d) => d.status === "pending");
    if (firstPendingDesigner) {
      startEditDesigner(firstPendingDesigner);
    }
  }, [companies?.length, designers?.length, menageCompanies?.length]);

  const budgetLabel = (level: string) => {
    const key = `designers.budget.${level}` as "designers.budget.accessible" | "designers.budget.mid-range" | "designers.budget.premium";
    return t(key) as string;
  };

  const renderEditFormFields = (
    form: { name: string; city: string; description: string; logoUrl: string | null; portfolioUrls: string; portfolioPhotos: string; portfolioPhotoUrls: string[]; whatsapp: string },
    setForm: (fn: (prev: any) => any) => void,
    approvedPhotos: string[],
  ) => (
    <>
      <div>
        <Label className="mb-1.5 block text-sm">{t("form.companyName") as string}</Label>
        <Input value={form.name} onChange={(e) => setForm((f: any) => (f ? { ...f, name: e.target.value } : f))} required className="rounded-lg" />
      </div>
      <div>
        <Label className="mb-1.5 block text-sm">WhatsApp</Label>
        <Input
          type="tel"
          placeholder="+212 6XX XX XX XX"
          value={form.whatsapp}
          onChange={(e) => setForm((f: any) => (f ? { ...f, whatsapp: e.target.value } : f))}
          className="rounded-lg"
        />
        <p className="text-xs text-muted-foreground mt-1">{t("form.whatsappHint") as string}</p>
      </div>
      <div>
        <Label className="mb-1.5 block text-sm">{t("form.city") as string}</Label>
        <Input value={form.city} onChange={(e) => setForm((f: any) => (f ? { ...f, city: e.target.value } : f))} required className="rounded-lg" />
      </div>
      <div>
        <Label className="mb-1.5 block text-sm">{t("form.description") as string}</Label>
        <Textarea value={form.description} onChange={(e) => setForm((f: any) => (f ? { ...f, description: e.target.value } : f))} required rows={4} className="rounded-lg" />
      </div>
      <LogoUpload
        value={form.logoUrl ?? undefined}
        onChange={(url) => setForm((f: any) => (f ? { ...f, logoUrl: url } : f))}
        label={t("form.logo") as string}
        hint={t("form.logoHint") as string}
      />
      <PortfolioUpload
        value={form.portfolioPhotoUrls}
        onChange={(urls) => setForm((f: any) => (f ? { ...f, portfolioPhotoUrls: urls } : f))}
        label={t("form.uploadPhotos") as string}
        hint={t("form.uploadPhotosHint") as string}
      />
      <p className="text-xs text-muted-foreground">{t("dashboard.pendingPhotosHint") as string}</p>
      {approvedPhotos.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {t("dashboard.approvedPhotos") as string}: {approvedPhotos.length}
        </p>
      )}
      <div>
        <Label className="mb-1.5 block text-sm">{t("concierge.portfolio.urls") as string}</Label>
        <Input
          placeholder={t("concierge.portfolio.urlsHint") as string}
          value={form.portfolioUrls}
          onChange={(e) => setForm((f: any) => (f ? { ...f, portfolioUrls: e.target.value } : f))}
          className="rounded-lg"
        />
      </div>
      <div>
        <Label className="mb-1.5 block text-sm">{t("concierge.portfolio.photos") as string}</Label>
        <Input
          placeholder={t("concierge.portfolio.photosHint") as string}
          value={form.portfolioPhotos}
          onChange={(e) => setForm((f: any) => (f ? { ...f, portfolioPhotos: e.target.value } : f))}
          className="rounded-lg"
        />
      </div>
    </>
  );

  const renderSaveButtons = () => (
    <div className="flex gap-2">
      <Button type="submit" disabled={saving} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
        {saving ? "..." : t("dashboard.save") as string}
      </Button>
      <Button type="button" variant="outline" onClick={cancelEdit} className="rounded-full">
        {t("dashboard.cancel") as string}
      </Button>
    </div>
  );

  return (
    <main className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <h1 className="mb-8 font-display text-3xl font-bold text-foreground">
          {t("nav.dashboard") as string}
        </h1>

        {(companies?.length === 0 && designers?.length === 0 && menageCompanies?.length === 0) && (
          <Card className="rounded-2xl border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <p className="max-w-md text-muted-foreground">{t("dashboard.noProfile") as string}</p>
              <Button asChild className="rounded-full">
                <Link to="/concierge-signup?complete=1">{t("dashboard.completeSignup") as string}</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {companies && companies.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">{t("signup.type.concierge") as string}</h2>
            <div className="space-y-4">
          {companies.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-accent/10">
                      {c.logo_url ? (
                        <img src={c.logo_url} alt={c.name} className="h-full w-full object-cover" />
                      ) : (
                        <Building2 className="h-5 w-5 text-accent" />
                      )}
                    </div>
                    <CardTitle className="font-display text-lg">{c.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={c.status === "approved" ? "default" : "secondary"} className="gap-1">
                      {c.status === "approved" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {c.status === "approved" ? "Approved" : t("concierge.pending") as string}
                    </Badge>
                    {(editingType !== "concierge" || editingId !== c.id) && (
                      <>
                        <Button variant="outline" size="sm" className="gap-1.5 rounded-full" onClick={() => startEditConcierge(c)}>
                          <Pencil className="h-3.5 w-3.5" />
                          {t("dashboard.editProfile") as string}
                        </Button>
                        <Button variant="ghost" size="sm" asChild className="gap-1.5 rounded-full">
                          <Link to={`/concierge/${c.id}`}>
                            <ExternalLink className="h-3.5 w-3.5" />
                            {t("dashboard.viewProfile") as string}
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingType === "concierge" && editingId === c.id && conciergeForm ? (
                  <form onSubmit={handleSaveConcierge} className="space-y-4">
                    {c.status === "pending" && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        {t("dashboard.pendingBanner") as string}
                      </div>
                    )}
                    {renderEditFormFields(conciergeForm, setConciergeForm, c.portfolio_photos ?? [])}
                    <div>
                      <Label className="mb-1.5 block text-sm">{t("form.servicesList") as string}</Label>
                      <Input value={conciergeForm.services} onChange={(e) => setConciergeForm((f) => (f ? { ...f, services: e.target.value } : f))} required className="rounded-lg" />
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-sm">{t("form.citiesCovered") as string}</Label>
                      <Input value={conciergeForm.citiesCovered} onChange={(e) => setConciergeForm((f) => (f ? { ...f, citiesCovered: e.target.value } : f))} required className="rounded-lg" />
                    </div>
                    {renderSaveButtons()}
                  </form>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {getLocalField(c.description_fr, c.description_en, c.description_ar)}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
            </div>
          </div>
        )}

        {menageCompanies && menageCompanies.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">{t("signup.type.menage") as string}</h2>
            <div className="space-y-4">
              {menageCompanies.map((m) => (
                <Card key={m.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-accent/10">
                          {m.logo_url ? (
                            <img src={m.logo_url} alt={m.name} className="h-full w-full object-cover" />
                          ) : (
                            <Sparkles className="h-5 w-5 text-accent" />
                          )}
                        </div>
                        <CardTitle className="font-display text-lg">{m.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={m.status === "approved" ? "default" : "secondary"} className="gap-1">
                          {m.status === "approved" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {m.status === "approved" ? "Approved" : t("concierge.pending") as string}
                        </Badge>
                        {(editingType !== "menage" || editingId !== m.id) && (
                          <>
                            <Button variant="outline" size="sm" className="gap-1.5 rounded-full" onClick={() => startEditMenage(m)}>
                              <Pencil className="h-3.5 w-3.5" />
                              {t("dashboard.editProfile") as string}
                            </Button>
                            <Button variant="ghost" size="sm" asChild className="gap-1.5 rounded-full">
                              <Link to={`/menage/${m.id}`}>
                                <ExternalLink className="h-3.5 w-3.5" />
                                {t("dashboard.viewProfile") as string}
                              </Link>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingType === "menage" && editingId === m.id && menageForm ? (
                      <form onSubmit={handleSaveMenage} className="space-y-4">
                        {m.status === "pending" && (
                          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                            {t("dashboard.pendingBanner") as string}
                          </div>
                        )}
                        {renderEditFormFields(menageForm, setMenageForm, m.portfolio_photos ?? [])}
                        <div>
                          <Label className="mb-1.5 block text-sm">{t("form.servicesList") as string}</Label>
                          <Input value={menageForm.services} onChange={(e) => setMenageForm((f) => (f ? { ...f, services: e.target.value } : f))} required className="rounded-lg" />
                        </div>
                        <div>
                          <Label className="mb-1.5 block text-sm">{t("form.citiesCovered") as string}</Label>
                          <Input value={menageForm.citiesCovered} onChange={(e) => setMenageForm((f) => (f ? { ...f, citiesCovered: e.target.value } : f))} required className="rounded-lg" />
                        </div>
                        {renderSaveButtons()}
                      </form>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {getLocalField(m.description_fr, m.description_en, m.description_ar)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {designers && designers.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">{t("signup.type.designer") as string}</h2>
            <div className="space-y-4">
          {designers.map((d) => (
            <Card key={d.id} className={editingType === "designer" && editingId === d.id ? "border-terracotta/30" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-terracotta-light">
                      {d.logo_url ? (
                        <img src={d.logo_url} alt={d.name} className="h-full w-full object-cover" />
                      ) : (
                        <Paintbrush className="h-5 w-5 text-terracotta" />
                      )}
                    </div>
                    <CardTitle className="font-display text-lg">{d.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={d.status === "approved" ? "default" : "secondary"} className="gap-1">
                      {d.status === "approved" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {d.status === "approved" ? "Approved" : t("concierge.pending") as string}
                    </Badge>
                    {(editingType !== "designer" || editingId !== d.id) && (
                      <>
                        <Button variant="outline" size="sm" className="gap-1.5 rounded-full" onClick={() => startEditDesigner(d)}>
                          <Pencil className="h-3.5 w-3.5" />
                          {t("dashboard.editProfile") as string}
                        </Button>
                        <Button variant="ghost" size="sm" asChild className="gap-1.5 rounded-full">
                          <Link to={`/designers/${d.id}`}>
                            <ExternalLink className="h-3.5 w-3.5" />
                            {t("dashboard.viewProfile") as string}
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingType === "designer" && editingId === d.id && designerForm ? (
                  <form onSubmit={handleSaveDesigner} className="space-y-4">
                    {d.status === "pending" && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        {t("dashboard.pendingBanner") as string}
                      </div>
                    )}
                    {renderEditFormFields(designerForm, setDesignerForm, d.portfolio_photos ?? [])}
                    <div>
                      <Label className="mb-1.5 block text-sm">{t("form.styles") as string}</Label>
                      <Input value={designerForm.styles} onChange={(e) => setDesignerForm((f) => (f ? { ...f, styles: e.target.value } : f))} required placeholder="Modern, Minimalist, ..." className="rounded-lg" />
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-sm">{t("designers.budget") as string}</Label>
                      <Select value={designerForm.budgetLevel} onValueChange={(v) => setDesignerForm((f) => (f ? { ...f, budgetLevel: v } : f))}>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accessible">{budgetLabel("accessible")}</SelectItem>
                          <SelectItem value="mid-range">{budgetLabel("mid-range")}</SelectItem>
                          <SelectItem value="premium">{budgetLabel("premium")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {renderSaveButtons()}
                  </form>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {getLocalField(d.description_fr, d.description_en, d.description_ar)}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
