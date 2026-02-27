import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageMeta } from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, DollarSign, Percent, Download, Lightbulb, ShoppingBag, FileSpreadsheet } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().trim().email().max(255);

const DEBOUNCE_MS = 400;

const defaultExpenses = {
  conciergerie: "",
  menage: "",
  electricite: "",
  taxe: "",
  assurance: "",
  autre: "",
};

// Revenu exemple: 500 MAD/nuit × 30 nuits × 65% = 9 750 MAD. Conciergerie ≥ 20% du revenu. Ménage ≥ 200 MAD par passage (~10 passages/mois).
const exampleValues = {
  purchasePrice: "900000",
  nightlyRate: "500",
  occupancy: "65",
  expenses: {
    conciergerie: "1950", // 20% de 9 750
    menage: "2000",       // 10 passages × 200 MAD min
    electricite: "1500",
    taxe: "200",
    assurance: "200",
    autre: "100",
  },
};

const ProfitCalculator = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [inputs, setInputs] = useState({
    purchasePrice: "",
    nightlyRate: "",
    occupancy: "",
    ...defaultExpenses,
  });
  const [results, setResults] = useState<{
    monthlyRevenue: number;
    monthlyProfit: number;
    yearlyROI: number;
  } | null>(null);
  const [downloadEmail, setDownloadEmail] = useState("");
  const [downloadUnlocked, setDownloadUnlocked] = useState(false);

  const update = (field: string, value: string) =>
    setInputs((prev) => ({ ...prev, [field]: value }));

  // Ménage exclu du calcul du profit (payé par le client)
  const totalExpenses = (Object.keys(defaultExpenses) as (keyof typeof defaultExpenses)[])
    .filter((key) => key !== "menage")
    .reduce((sum, key) => {
      const v = parseFloat(inputs[key]);
      return sum + (Number.isFinite(v) ? v : 0);
    }, 0);
  const menageIndicative = Number.isFinite(parseFloat(inputs.menage)) ? parseFloat(inputs.menage) : 0;

  const computeResults = useCallback(() => {
    const price = parseFloat(inputs.purchasePrice);
    const nightly = parseFloat(inputs.nightlyRate);
    const occ = parseFloat(inputs.occupancy) / 100;
    if (!price || !nightly || price <= 0 || nightly <= 0) return null;
    if (!Number.isFinite(occ) || occ <= 0 || occ > 1) return null;
    const monthlyRevenue = nightly * 30 * occ;
    const monthlyProfit = monthlyRevenue - totalExpenses;
    const yearlyROI = (monthlyProfit * 12 / price) * 100;
    return { monthlyRevenue, monthlyProfit, yearlyROI };
  }, [inputs.purchasePrice, inputs.nightlyRate, inputs.occupancy, totalExpenses]);

  // Calcul en temps réel avec debounce
  useEffect(() => {
    const computed = computeResults();
    if (computed == null) {
      setResults(null);
      return;
    }
    const id = window.setTimeout(() => setResults(computed), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [computeResults]);

  const applyExample = () => {
    setInputs({
      purchasePrice: exampleValues.purchasePrice,
      nightlyRate: exampleValues.nightlyRate,
      occupancy: exampleValues.occupancy,
      ...exampleValues.expenses,
    });
    toast({ title: t("calc.exampleApplied") as string });
  };

  const formatMAD = (n: number) =>
    `${n.toLocaleString("fr-MA", { maximumFractionDigits: 0 })} MAD`;

  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSchema.safeParse(downloadEmail).success) return;
    const computed = computeResults();
    await supabase.from("calculator_leads").insert({
      email: downloadEmail,
      purchase_price: inputs.purchasePrice ? parseFloat(inputs.purchasePrice) || null : null,
      nightly_rate: inputs.nightlyRate ? parseFloat(inputs.nightlyRate) || null : null,
      occupancy_rate: inputs.occupancy ? parseFloat(inputs.occupancy) || null : null,
      monthly_expenses: Number.isFinite(totalExpenses) ? totalExpenses : null,
      estimated_monthly_profit: computed?.monthlyProfit ?? null,
      estimated_yearly_roi: computed?.yearlyROI ?? null,
    });
    setDownloadUnlocked(true);
    toast({ title: t("calc.downloadReady") as string });
  };

  return (
    <main className="py-16 md:py-24">
      <PageMeta title={t("calc.title") as string} description={t("calc.subtitle") as string} />
      <div className="container max-w-3xl">
        <div className="text-center mb-14">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
            <Calculator className="h-7 w-7 text-accent" />
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("calc.title") as string}
          </h1>
          <p className="mx-auto max-w-xl text-base text-muted-foreground md:text-lg leading-relaxed">
            {t("calc.subtitle") as string}
          </p>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  {t("calc.purchasePrice") as string}
                </label>
                <Input
                  type="number"
                  placeholder={t("calc.helper.price") as string}
                  value={inputs.purchasePrice}
                  onChange={(e) => update("purchasePrice", e.target.value)}
                  className="rounded-lg"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  {t("calc.nightlyRate") as string}
                </label>
                <Input
                  type="number"
                  placeholder={t("calc.helper.nightly") as string}
                  value={inputs.nightlyRate}
                  onChange={(e) => update("nightlyRate", e.target.value)}
                  className="rounded-lg"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  {t("calc.occupancy") as string}
                </label>
                <Input
                  type="number"
                  placeholder={t("calc.helper.occupancy") as string}
                  value={inputs.occupancy}
                  onChange={(e) => update("occupancy", e.target.value)}
                  min={0}
                  max={100}
                  className="rounded-lg"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("calc.occupancyRangeHint") as string}
                </p>
              </div>
              <div className="md:col-span-2 flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full"
                  onClick={applyExample}
                >
                  <Lightbulb className="h-4 w-4" />
                  {t("calc.applyExample") as string}
                </Button>
              </div>

              {/* Détail des charges */}
              <div className="md:col-span-2 border-t pt-6 mt-2">
                <p className="mb-3 text-sm font-medium text-muted-foreground">
                  {t("calc.expensesTotal") as string}
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      { key: "conciergerie", label: "calc.expensesConciergerie" },
                      { key: "menage", label: "calc.expensesMenage" },
                      { key: "electricite", label: "calc.expensesElectricite", placeholder: "calc.helper.expensesElectricite" },
                      { key: "taxe", label: "calc.expensesTaxe" },
                      { key: "assurance", label: "calc.expensesAssurance" },
                      { key: "autre", label: "calc.expensesOther" },
                    ] as const
                  ).map((item) => (
                      <div key={item.key}>
                        <label className="mb-1 block text-xs text-muted-foreground">
                          {t(item.label) as string}
                        </label>
                        <Input
                          type="number"
                          min={0}
                          placeholder={item.placeholder ? (t(item.placeholder) as string) : "0"}
                          value={inputs[item.key as keyof typeof inputs]}
                          onChange={(e) => update(item.key, e.target.value)}
                          className="rounded-lg h-9"
                        />
                      </div>
                    )
                  )}
                </div>
                <p className="mt-3 text-sm font-medium">
                  {t("calc.expensesTotalForProfit") as string} : {formatMAD(totalExpenses)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("calc.menageExcluded") as string}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-2xl border-accent/20 bg-green-light/50">
                <CardContent className="p-6 text-center">
                  <DollarSign className="mx-auto mb-2 h-8 w-8 text-accent" />
                  <p className="text-sm text-muted-foreground">
                    {t("calc.monthlyRevenue") as string}
                  </p>
                  <p className="text-2xl font-bold text-accent">
                    {formatMAD(results.monthlyRevenue)}
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-accent/20 bg-green-light/50">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="mx-auto mb-2 h-8 w-8 text-accent" />
                  <p className="text-sm text-muted-foreground">
                    {t("calc.monthlyProfit") as string}
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      results.monthlyProfit >= 0 ? "text-accent" : "text-destructive"
                    }`}
                  >
                    {formatMAD(results.monthlyProfit)}
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-accent/20 bg-green-light/50">
                <CardContent className="p-6 text-center">
                  <Percent className="mx-auto mb-2 h-8 w-8 text-accent" />
                  <p className="text-sm text-muted-foreground">
                    {t("calc.yearlyROI") as string}
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      results.yearlyROI >= 0 ? "text-accent" : "text-destructive"
                    }`}
                  >
                    {results.yearlyROI.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {t("calc.disclaimer") as string}
            </p>
          </motion.div>
        )}

        <Card className="mt-8 rounded-2xl border-dashed border-accent/30 bg-accent/5">
          <CardContent className="p-6">
            <div className="mb-3">
              <p className="font-medium">{t("calc.downloadExcel") as string}</p>
              <p className="text-sm text-muted-foreground">
                {t("calc.downloadExcelHint") as string}
              </p>
            </div>
            {downloadUnlocked ? (
              <Button asChild variant="outline" className="gap-2 rounded-full">
                <a href="/Balihany-Simulateur.xlsx" download>
                  <Download className="h-4 w-4" />
                  {t("calc.downloadExcel") as string}
                </a>
              </Button>
            ) : (
              <form onSubmit={handleDownloadSubmit} className="flex gap-3">
                <Input
                  type="email"
                  placeholder={t("calc.emailPlaceholder") as string}
                  value={downloadEmail}
                  onChange={(e) => setDownloadEmail(e.target.value)}
                  required
                  className="flex-1 rounded-full"
                />
                <Button
                  type="submit"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 rounded-full px-6 shrink-0"
                >
                  <Download className="h-4 w-4" />
                  {t("calc.downloadBtn") as string}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <ShopSection />
      </div>
    </main>
  );
};

/* ───── Digital Products Shop Section ───── */

function ShopSection() {
  const { lang, t } = useLanguage();
  const { toast } = useToast();
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [shopEmail, setShopEmail] = useState("");
  const [emailProductId, setEmailProductId] = useState<string | null>(null);

  const { data: products } = useQuery({
    queryKey: ["digital-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("digital_products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  if (!products?.length) return null;

  const getName = (p: typeof products[0]) =>
    lang === "ar" ? p.name_ar || p.name_fr : lang === "en" ? p.name_en : p.name_fr;

  const getDesc = (p: typeof products[0]) =>
    lang === "ar" ? p.description_ar || p.description_fr : lang === "en" ? p.description_en : p.description_fr;

  const formatPrice = (cents: number, currency: string) => {
    if (cents === 0) return t("shop.free") as string;
    return `${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)} ${currency.toUpperCase()}`;
  };

  const handleBuy = async (productId: string, email: string) => {
    if (!emailSchema.safeParse(email).success) return;
    setBuyingId(productId);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          product_id: productId,
          email,
          success_url: `${window.location.origin}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: window.location.href,
        },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast({ title: err.message || "Payment error", variant: "destructive" });
      setBuyingId(null);
    }
  };

  return (
    <div className="mt-14">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
          <ShoppingBag className="h-6 w-6 text-accent" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {t("shop.title") as string}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
          {t("shop.subtitle") as string}
        </p>
      </div>

      <div className={`grid gap-5 ${products.length === 1 ? "max-w-sm mx-auto" : products.length === 2 ? "sm:grid-cols-2 max-w-2xl mx-auto" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {products.map((product) => (
          <Card key={product.id} className="rounded-2xl overflow-hidden flex flex-col">
            {product.thumbnail_url && (
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={product.thumbnail_url}
                  alt={getName(product)}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <CardContent className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-foreground">{getName(product)}</h3>
                <span className="shrink-0 rounded-full bg-accent/10 px-3 py-1 text-sm font-bold text-accent">
                  {formatPrice(product.price_cents, product.currency)}
                </span>
              </div>
              {getDesc(product) && (
                <p className="text-sm text-muted-foreground mb-4 flex-1">{getDesc(product)}</p>
              )}
              <div className="mt-auto">
                {emailProductId === product.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleBuy(product.id, shopEmail);
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      type="email"
                      placeholder={t("form.email") as string}
                      value={shopEmail}
                      onChange={(e) => setShopEmail(e.target.value)}
                      required
                      className="flex-1 rounded-full h-9 text-sm"
                      autoFocus
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={buyingId === product.id}
                      className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-4 shrink-0"
                    >
                      {buyingId === product.id ? (t("shop.buyLoading") as string) : (t("shop.buy") as string)}
                    </Button>
                  </form>
                ) : (
                  <Button
                    className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full"
                    onClick={() => {
                      setEmailProductId(product.id);
                      setShopEmail("");
                    }}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    {t("shop.buy") as string}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ProfitCalculator;
