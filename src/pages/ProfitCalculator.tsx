import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageMeta } from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, DollarSign, Percent, Download } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().trim().email().max(255);

const ProfitCalculator = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [inputs, setInputs] = useState({ purchasePrice: "", nightlyRate: "", occupancy: "", expenses: "" });
  const [results, setResults] = useState<{ monthlyRevenue: number; monthlyProfit: number; yearlyROI: number } | null>(null);
  const [downloadEmail, setDownloadEmail] = useState("");
  const [downloadUnlocked, setDownloadUnlocked] = useState(false);

  const update = (field: string, value: string) => setInputs(prev => ({ ...prev, [field]: value }));

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(inputs.purchasePrice);
    const nightly = parseFloat(inputs.nightlyRate);
    const occ = parseFloat(inputs.occupancy) / 100;
    const exp = parseFloat(inputs.expenses);

    if (!price || !nightly || !occ || isNaN(exp)) return;

    const monthlyRevenue = nightly * 30 * occ;
    const monthlyProfit = monthlyRevenue - exp;
    const yearlyROI = ((monthlyProfit * 12) / price) * 100;

    setResults({ monthlyRevenue, monthlyProfit, yearlyROI });
  };

  const formatMAD = (n: number) => `${n.toLocaleString("fr-MA", { maximumFractionDigits: 0 })} MAD`;

  return (
    <main className="py-16 md:py-24">
      <PageMeta title={t("calc.title") as string} description={t("calc.subtitle") as string} />
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <Calculator className="h-8 w-8 text-accent" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            {t("calc.title") as string}
          </h1>
          <p className="text-muted-foreground">{t("calc.subtitle") as string}</p>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-8">
            <form onSubmit={calculate} className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">{t("calc.purchasePrice") as string}</label>
                <Input
                  type="number"
                  placeholder={t("calc.helper.price") as string}
                  value={inputs.purchasePrice}
                  onChange={e => update("purchasePrice", e.target.value)}
                  required
                  className="rounded-lg"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">{t("calc.nightlyRate") as string}</label>
                <Input
                  type="number"
                  placeholder={t("calc.helper.nightly") as string}
                  value={inputs.nightlyRate}
                  onChange={e => update("nightlyRate", e.target.value)}
                  required
                  className="rounded-lg"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">{t("calc.occupancy") as string}</label>
                <Input
                  type="number"
                  placeholder={t("calc.helper.occupancy") as string}
                  value={inputs.occupancy}
                  onChange={e => update("occupancy", e.target.value)}
                  required
                  min="0"
                  max="100"
                  className="rounded-lg"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">{t("calc.expenses") as string}</label>
                <Input
                  type="number"
                  placeholder={t("calc.helper.expenses") as string}
                  value={inputs.expenses}
                  onChange={e => update("expenses", e.target.value)}
                  required
                  className="rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
                  {t("calc.calculate") as string}
                </Button>
              </div>
            </form>
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
                  <p className="text-sm text-muted-foreground">{t("calc.monthlyRevenue") as string}</p>
                  <p className="text-2xl font-bold text-accent">{formatMAD(results.monthlyRevenue)}</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-accent/20 bg-green-light/50">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="mx-auto mb-2 h-8 w-8 text-accent" />
                  <p className="text-sm text-muted-foreground">{t("calc.monthlyProfit") as string}</p>
                  <p className={`text-2xl font-bold ${results.monthlyProfit >= 0 ? 'text-accent' : 'text-destructive'}`}>
                    {formatMAD(results.monthlyProfit)}
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-accent/20 bg-green-light/50">
                <CardContent className="p-6 text-center">
                  <Percent className="mx-auto mb-2 h-8 w-8 text-accent" />
                  <p className="text-sm text-muted-foreground">{t("calc.yearlyROI") as string}</p>
                  <p className={`text-2xl font-bold ${results.yearlyROI >= 0 ? 'text-accent' : 'text-destructive'}`}>
                    {results.yearlyROI.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
            </div>

            <p className="text-xs text-muted-foreground text-center">{t("calc.disclaimer") as string}</p>

          </motion.div>
        )}

        <Card className="mt-8 rounded-2xl border-dashed border-accent/30 bg-accent/5">
          <CardContent className="p-6">
            <div className="mb-3">
              <p className="font-medium">{t("calc.downloadExcel") as string}</p>
              <p className="text-sm text-muted-foreground">{t("calc.downloadExcelHint") as string}</p>
            </div>
            {downloadUnlocked ? (
              <Button asChild variant="outline" className="gap-2 rounded-full">
                <a href="/Balihany-Simulateur.xlsx" download>
                  <Download className="h-4 w-4" />
                  {t("calc.downloadExcel") as string}
                </a>
              </Button>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!emailSchema.safeParse(downloadEmail).success) return;
                  await supabase.from("calculator_leads").insert({ email: downloadEmail });
                  setDownloadUnlocked(true);
                  toast({ title: t("calc.downloadReady") as string });
                }}
                className="flex gap-3"
              >
                <Input
                  type="email"
                  placeholder={t("calc.emailPlaceholder") as string}
                  value={downloadEmail}
                  onChange={(e) => setDownloadEmail(e.target.value)}
                  required
                  className="flex-1 rounded-full"
                />
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 rounded-full px-6 shrink-0">
                  <Download className="h-4 w-4" />
                  {t("calc.downloadBtn") as string}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ProfitCalculator;
