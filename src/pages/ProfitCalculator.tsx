import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, DollarSign, Percent } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().trim().email().max(255);

const ProfitCalculator = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [inputs, setInputs] = useState({ purchasePrice: "", nightlyRate: "", occupancy: "", expenses: "" });
  const [results, setResults] = useState<{ monthlyRevenue: number; monthlyProfit: number; yearlyROI: number } | null>(null);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

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
    setEmailSent(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSchema.safeParse(email).success || !results) return;

    await supabase.from("calculator_leads").insert({
      email,
      purchase_price: parseFloat(inputs.purchasePrice),
      nightly_rate: parseFloat(inputs.nightlyRate),
      occupancy_rate: parseFloat(inputs.occupancy),
      monthly_expenses: parseFloat(inputs.expenses),
      estimated_monthly_profit: results.monthlyProfit,
      estimated_yearly_roi: results.yearlyROI,
    });

    setEmailSent(true);
    toast({ title: t("calc.sent") as string });
  };

  const formatMAD = (n: number) => `${n.toLocaleString("fr-MA", { maximumFractionDigits: 0 })} MAD`;

  return (
    <main className="py-16 md:py-24">
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

            {!emailSent && (
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">{t("calc.emailCTA") as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEmailSubmit} className="flex gap-3">
                    <Input
                      type="email"
                      placeholder={t("calc.emailPlaceholder") as string}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="flex-1 rounded-full"
                    />
                    <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6">
                      {t("calc.send") as string}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default ProfitCalculator;
