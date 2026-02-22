import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogoUpload, PortfolioUpload } from "@/components/ImageUpload";
import { z } from "zod";
import { Building2, ChevronDown } from "lucide-react";
import { CityCombobox, CitiesCoveredCombobox } from "@/components/CityCombobox";
import { MOROCCAN_CITIES, CONCIERGE_SERVICES, MENAGE_SERVICES, DESIGNER_STYLES, EXPERIENCE_RANGES } from "@/lib/signupData";

const signupSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
  confirmPassword: z.string().min(1),
  displayName: z.string().trim().min(1).max(100),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const conciergeSchema = z.object({
  name: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100),
  description: z.string().trim().min(10).max(2000),
  services: z.array(z.string()).min(1),
  citiesCovered: z.array(z.string()).min(1),
  experience: z.string().min(1),
});
const menageSchema = z.object({
  name: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100),
  description: z.string().trim().min(10).max(2000),
  services: z.array(z.string()).min(1),
  citiesCovered: z.array(z.string()).min(1),
  experience: z.string().min(1),
});
const designerSchema = z.object({
  name: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100),
  description: z.string().trim().min(10).max(2000),
  styles: z.array(z.string()).min(1),
  experience: z.string().min(1),
});

const ConciergeSignup = () => {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profType, setProfType] = useState<"concierge" | "menage" | "designer">("concierge");
  const [premiumInterest, setPremiumInterest] = useState(false);

  const [auth, setAuth] = useState({ email: "", password: "", confirmPassword: "", displayName: "" });
  const [company, setCompany] = useState({
    name: "", city: "", description: "", budgetLevel: "mid-range",
    services: [] as string[], citiesCovered: [] as string[], styles: [] as string[],
    experience: "", portfolioUrls: "", portfolioPhotos: "", whatsapp: "",
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [portfolioPhotoUrls, setPortfolioPhotoUrls] = useState<string[]>([]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signupSchema.safeParse(auth);
    if (!parsed.success) {
      const msg = parsed.error.errors.find((e) => e.path[0] === "confirmPassword")
        ? t("form.passwordMismatch")
        : t("form.validationError");
      toast({ title: msg as string, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: auth.email,
      password: auth.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: auth.displayName },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    toast({ title: t("auth.signup.success") as string });
    setStep(2);
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const citiesCovered = [...company.citiesCovered];
    const toValidate = {
      ...company,
      citiesCovered: profType === "concierge" || profType === "menage" ? citiesCovered : [],
      experience: company.experience,
    };
    const schema = profType === "concierge" ? conciergeSchema : profType === "menage" ? menageSchema : designerSchema;
    if (!schema.safeParse(toValidate).success) {
      toast({ title: t("form.validationError") as string, variant: "destructive" });
      return;
    }
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: t("auth.confirmEmailFirst") as string, variant: "destructive" });
      setLoading(false);
      return;
    }

    const portfolioUrlsArr = company.portfolioUrls.split(",").map(s => s.trim()).filter(Boolean);
    const pastedPhotos = company.portfolioPhotos.split(",").map(s => s.trim()).filter(Boolean);
    const portfolioPhotosPending = [...portfolioPhotoUrls, ...pastedPhotos];

    if (profType === "concierge") {
      const servicesArr = company.services.map(id => CONCIERGE_SERVICES.find(s => s.id === id)?.fr ?? id);
      const citiesArr = citiesCovered;
      const { error } = await supabase.from("concierge_companies").insert({
        name: company.name,
        logo_url: logoUrl,
        city_fr: company.city,
        city_en: company.city,
        city_ar: company.city,
        description_fr: company.description,
        description_en: company.description,
        description_ar: company.description,
        services_fr: servicesArr,
        services_en: company.services.map(id => CONCIERGE_SERVICES.find(s => s.id === id)?.en ?? id),
        services_ar: company.services.map(id => CONCIERGE_SERVICES.find(s => s.id === id)?.ar ?? id),
        cities_covered_fr: citiesArr,
        cities_covered_en: citiesArr,
        cities_covered_ar: citiesArr,
        portfolio_urls: portfolioUrlsArr,
        portfolio_photos: [],
        portfolio_photos_pending: portfolioPhotosPending,
        experience_years: company.experience || null,
        whatsapp: company.whatsapp.trim() || null,
        status: "pending",
        user_id: user.id,
      });
      if (error) {
        toast({ title: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
    } else if (profType === "menage") {
      const servicesArr = company.services.map(id => MENAGE_SERVICES.find(s => s.id === id)?.fr ?? id);
      const citiesArr = citiesCovered;
      const { error } = await supabase.from("menage_companies").insert({
        name: company.name,
        logo_url: logoUrl,
        city_fr: company.city,
        city_en: company.city,
        city_ar: company.city,
        description_fr: company.description,
        description_en: company.description,
        description_ar: company.description,
        services_fr: servicesArr,
        services_en: company.services.map(id => MENAGE_SERVICES.find(s => s.id === id)?.en ?? id),
        services_ar: company.services.map(id => MENAGE_SERVICES.find(s => s.id === id)?.ar ?? id),
        cities_covered_fr: citiesArr,
        cities_covered_en: citiesArr,
        cities_covered_ar: citiesArr,
        portfolio_urls: portfolioUrlsArr,
        portfolio_photos: [],
        portfolio_photos_pending: portfolioPhotosPending,
        experience_years: company.experience || null,
        whatsapp: company.whatsapp.trim() || null,
        status: "pending",
        user_id: user.id,
      });
      if (error) {
        toast({ title: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
    } else {
      const budgetLevel = company.budgetLevel || "mid-range";
      const stylesArr = company.styles.map(id => DESIGNER_STYLES.find(s => s.id === id)?.fr ?? id);
      const stylesEn = company.styles.map(id => DESIGNER_STYLES.find(s => s.id === id)?.en ?? id);
      const stylesAr = company.styles.map(id => DESIGNER_STYLES.find(s => s.id === id)?.ar ?? id);
      const { error } = await supabase.from("designers").insert({
        name: company.name,
        logo_url: logoUrl,
        city_fr: company.city,
        city_en: company.city,
        city_ar: company.city,
        description_fr: company.description,
        description_en: company.description,
        description_ar: company.description,
        styles_fr: stylesArr,
        styles_en: stylesEn,
        styles_ar: stylesAr,
        portfolio_urls: portfolioUrlsArr,
        portfolio_photos: [],
        portfolio_photos_pending: portfolioPhotosPending,
        budget_level: budgetLevel,
        experience_years: company.experience || null,
        whatsapp: company.whatsapp.trim() || null,
        status: "pending",
        user_id: user.id,
      });
      if (error) {
        toast({ title: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    toast({ title: t("signup.companySubmitted") as string });
    navigate("/dashboard");
  };

  return (
    <main className="py-16 md:py-24">
      <div className="container max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <Building2 className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("auth.signup.title") as string}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("auth.signup.intro") as string}</p>
          <p className="mt-2 text-sm text-muted-foreground italic">{t("auth.signup.review") as string}</p>
        </div>

        {step === 1 && (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">{t("signup.step1") as string}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="grid gap-4">
                <Input
                  placeholder={t("form.name") as string}
                  value={auth.displayName}
                  onChange={(e) => setAuth(p => ({ ...p, displayName: e.target.value }))}
                  required
                  className="rounded-lg"
                />
                <Input
                  type="email"
                  placeholder={t("form.email") as string}
                  value={auth.email}
                  onChange={(e) => setAuth(p => ({ ...p, email: e.target.value }))}
                  required
                  className="rounded-lg"
                />
                <Input
                  type="password"
                  placeholder={t("form.password") as string}
                  value={auth.password}
                  onChange={(e) => setAuth(p => ({ ...p, password: e.target.value }))}
                  required
                  minLength={6}
                  className="rounded-lg"
                />
                <Input
                  type="password"
                  placeholder={t("form.confirmPassword") as string}
                  value={auth.confirmPassword}
                  onChange={(e) => setAuth(p => ({ ...p, confirmPassword: e.target.value }))}
                  required
                  minLength={6}
                  className="rounded-lg"
                />
                <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
                  {loading ? "..." : t("auth.signup.cta") as string}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  {t("auth.login.hasAccount") as string}{" "}
                  <Link to="/login" className="text-accent hover:underline">{t("nav.login") as string}</Link>
                </p>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">{t("signup.step2") as string}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCompanySubmit} className="grid gap-4">
                <div>
                  <Label className="mb-2 block text-sm font-medium">{t("signup.type") as string}</Label>
                  <Select value={profType} onValueChange={(v) => setProfType(v as any)}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concierge">{t("signup.type.concierge") as string}</SelectItem>
                      <SelectItem value="menage">{t("signup.type.menage") as string}</SelectItem>
                      <SelectItem value="designer">{t("signup.type.designer") as string}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  placeholder={t("form.companyName") as string}
                  value={company.name}
                  onChange={(e) => setCompany(p => ({ ...p, name: e.target.value }))}
                  required
                  className="rounded-lg"
                />
                <Input
                  type="tel"
                  placeholder={t("form.whatsapp") as string}
                  value={company.whatsapp}
                  onChange={(e) => setCompany(p => ({ ...p, whatsapp: e.target.value }))}
                  className="rounded-lg"
                />
                <p className="text-xs text-muted-foreground -mt-3">{t("form.whatsappHint") as string}</p>
                <div>
                  <Label className="mb-2 block text-sm font-medium">{t("form.city") as string}</Label>
                  <CityCombobox
                    value={company.city}
                    onChange={(v) => setCompany(p => ({ ...p, city: v }))}
                    placeholder={t("form.city") as string}
                    cities={MOROCCAN_CITIES}
                    required
                    className="rounded-lg"
                  />
                </div>
                <Textarea
                  placeholder={t("form.description") as string}
                  value={company.description}
                  onChange={(e) => setCompany(p => ({ ...p, description: e.target.value }))}
                  required
                  minLength={10}
                  rows={4}
                  className="rounded-lg"
                />
                {(profType === "concierge" || profType === "menage") && (
                  <>
                    <div>
                      <Label className="mb-3 block text-sm font-medium">{t("form.servicesList") as string}</Label>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {(profType === "concierge" ? CONCIERGE_SERVICES : MENAGE_SERVICES).map((s) => (
                          <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={company.services.includes(s.id)}
                              onCheckedChange={(checked) => {
                                setCompany((p) => ({
                                  ...p,
                                  services: checked ? [...p.services, s.id] : p.services.filter((id) => id !== s.id),
                                }));
                              }}
                            />
                            <span className="text-sm">{(s as Record<string, string>)[lang] || s.fr}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-medium">{t("form.citiesCovered") as string}</Label>
                      <CitiesCoveredCombobox
                        value={company.citiesCovered}
                        onChange={(v) => setCompany(p => ({ ...p, citiesCovered: v }))}
                        placeholder={t("form.citiesCovered") as string}
                        cities={MOROCCAN_CITIES}
                        addCityPlaceholder={t("form.addCity") as string}
                        className="rounded-lg"
                      />
                    </div>
                  </>
                )}
                <LogoUpload
                  value={logoUrl ?? undefined}
                  onChange={setLogoUrl}
                  label={t("form.logo") as string}
                  hint={t("form.logoHint") as string}
                />
                {(profType === "concierge" || profType === "menage") && (
                  <>
                    <PortfolioUpload
                      value={portfolioPhotoUrls}
                      onChange={setPortfolioPhotoUrls}
                      label={t("form.uploadPhotos") as string}
                      hint={t("form.uploadPhotosHint") as string}
                    />
                    <Input
                      placeholder={t("concierge.portfolio.urlsHint") as string}
                      value={company.portfolioUrls}
                      onChange={(e) => setCompany(p => ({ ...p, portfolioUrls: e.target.value }))}
                      className="rounded-lg"
                    />
                    <Input
                      placeholder={t("concierge.portfolio.photosHint") as string}
                      value={company.portfolioPhotos}
                      onChange={(e) => setCompany(p => ({ ...p, portfolioPhotos: e.target.value }))}
                      className="rounded-lg"
                    />
                  </>
                )}
                {profType === "designer" && (
                  <>
                    <div>
                      <Label className="mb-2 block text-sm font-medium">{t("designers.budget") as string}</Label>
                      <Select value={company.budgetLevel} onValueChange={(v) => setCompany(p => ({ ...p, budgetLevel: v }))}>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accessible">{t("designers.budget.accessible") as string}</SelectItem>
                          <SelectItem value="mid-range">{t("designers.budget.mid-range") as string}</SelectItem>
                          <SelectItem value="premium">{t("designers.budget.premium") as string}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-3 block text-sm font-medium">{t("form.styles") as string}</Label>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {DESIGNER_STYLES.map((s) => (
                          <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={company.styles.includes(s.id)}
                              onCheckedChange={(checked) => {
                                setCompany((p) => ({
                                  ...p,
                                  styles: checked ? [...p.styles, s.id] : p.styles.filter((id) => id !== s.id),
                                }));
                              }}
                            />
                            <span className="text-sm">{(s as Record<string, string>)[lang] || s.fr}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <PortfolioUpload
                      value={portfolioPhotoUrls}
                      onChange={setPortfolioPhotoUrls}
                      label={t("form.uploadPhotos") as string}
                      hint={t("form.uploadPhotosHint") as string}
                    />
                    <Input
                      placeholder={t("concierge.portfolio.urlsHint") as string}
                      value={company.portfolioUrls}
                      onChange={(e) => setCompany(p => ({ ...p, portfolioUrls: e.target.value }))}
                      className="rounded-lg"
                    />
                    <Input
                      placeholder={t("concierge.portfolio.photosHint") as string}
                      value={company.portfolioPhotos}
                      onChange={(e) => setCompany(p => ({ ...p, portfolioPhotos: e.target.value }))}
                      className="rounded-lg"
                    />
                  </>
                )}
                <div>
                  <Label className="mb-2 block text-sm font-medium">{t("form.experience") as string}</Label>
                  <Select value={company.experience || undefined} onValueChange={(v) => setCompany(p => ({ ...p, experience: v }))} required>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder={t("form.experience") as string} />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_RANGES.map((r) => (
                        <SelectItem key={r.id} value={r.id}>{(r as Record<string, string>)[lang] || r.fr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={premiumInterest} onCheckedChange={setPremiumInterest} />
                  <Label className="text-sm">{t("signup.premiumInterest") as string}</Label>
                </div>
                <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
                  {loading ? "..." : t("auth.signup.cta") as string}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default ConciergeSignup;
