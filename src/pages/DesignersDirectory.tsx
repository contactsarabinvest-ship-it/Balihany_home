import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageMeta } from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Paintbrush, MapPin, Award, ArrowRight } from "lucide-react";
import { RatingBadge } from "@/components/RatingBadge";
import { useReviewStats } from "@/hooks/useReviewStats";

const DesignersDirectory = () => {
  const { lang, t } = useLanguage();
  const [cityFilter, setCityFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");

  const { data: designers, isLoading } = useQuery({
    queryKey: ["designers-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("designers")
        .select("*")
        .eq("status", "approved")
        .order("is_premium", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: reviewStats } = useReviewStats(
    "designer_id",
    designers?.map((d) => d.id),
  );

  const getCity = (d: any) => lang === "ar" ? (d.city_ar || d.city_fr) : lang === "en" ? d.city_en : d.city_fr;
  const getDesc = (d: any) => lang === "ar" ? (d.description_ar || d.description_fr) : lang === "en" ? d.description_en : d.description_fr;
  const getStyles = (d: any) => lang === "ar" ? (d.styles_ar?.length ? d.styles_ar : d.styles_fr) : lang === "en" ? d.styles_en : d.styles_fr;

  const allCities = [...new Set(designers?.map(d => getCity(d)) || [])];
  const filtered = designers?.filter(d => {
    if (cityFilter !== "all" && getCity(d) !== cityFilter) return false;
    if (budgetFilter !== "all" && d.budget_level !== budgetFilter) return false;
    return true;
  });

  const budgetLabel = (level: string) => {
    const key = `designers.budget.${level}` as any;
    return t(key) as string;
  };

  return (
    <main className="py-16 md:py-24">
      <PageMeta title={t("designers.title") as string} description={t("designers.subtitle") as string} />
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            {t("designers.title") as string}
          </h1>
          <p className="text-muted-foreground">{t("designers.subtitle") as string}</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-48 rounded-full">
              <SelectValue placeholder={t("concierge.filter.city") as string} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("concierge.filter.all") as string}</SelectItem>
              {allCities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={budgetFilter} onValueChange={setBudgetFilter}>
            <SelectTrigger className="w-48 rounded-full">
              <SelectValue placeholder={t("designers.filter.budget") as string} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("concierge.filter.all") as string}</SelectItem>
              <SelectItem value="accessible">{budgetLabel("accessible")}</SelectItem>
              <SelectItem value="mid-range">{budgetLabel("mid-range")}</SelectItem>
              <SelectItem value="premium">{budgetLabel("premium")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Card className={`h-full flex flex-col rounded-2xl transition-shadow hover:shadow-lg ${d.is_premium ? 'border-terracotta/30 bg-terracotta-light/30' : 'border-border'}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-terracotta-light">
                        {d.logo_url ? (
                          <img src={d.logo_url} alt={d.name} className="h-full w-full object-cover" />
                        ) : (
                          <Paintbrush className="h-6 w-6 text-terracotta" />
                        )}
                      </div>
                      {d.is_premium && (
                        <Badge className="bg-terracotta text-terracotta-foreground gap-1">
                          <Award className="h-3 w-3" />
                          {t("concierge.premium") as string}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mt-3 text-lg">{d.name}</CardTitle>
                    <div className="flex items-center gap-3">
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {getCity(d)}
                      </p>
                      {reviewStats?.[d.id] && (
                        <RatingBadge avg={reviewStats[d.id].avg} count={reviewStats[d.id].count} />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{getDesc(d)}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {getStyles(d)?.slice(0, 3).map((s: string, j: number) => (
                        <Badge key={j} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                    <Badge variant="outline" className="text-xs">{budgetLabel(d.budget_level)}</Badge>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full gap-2 rounded-full">
                      <Link to={`/designers/${d.id}`}>
                        {t("designers.cta.view") as string}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">{t("designers.empty") as string}</p>
            <Button asChild variant="outline" className="mt-4 rounded-full">
              <Link to="/contact">{t("nav.contact") as string}</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default DesignersDirectory;
