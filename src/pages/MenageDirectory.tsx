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
import { Sparkles, MapPin, Award, ArrowRight } from "lucide-react";
import { RatingBadge } from "@/components/RatingBadge";
import { useReviewStats } from "@/hooks/useReviewStats";

const MenageDirectory = () => {
  const { lang, t } = useLanguage();
  const [cityFilter, setCityFilter] = useState("all");

  const { data: companies, isLoading } = useQuery({
    queryKey: ["menage-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menage_companies")
        .select("*")
        .eq("status", "approved")
        .order("is_premium", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: reviewStats } = useReviewStats(
    "menage_company_id",
    companies?.map((c) => c.id),
  );

  const getCity = (c: any) => lang === "ar" ? (c.city_ar || c.city_fr) : lang === "en" ? c.city_en : c.city_fr;
  const getDesc = (c: any) => lang === "ar" ? (c.description_ar || c.description_fr) : lang === "en" ? c.description_en : c.description_fr;
  const getServices = (c: any) => lang === "ar" ? (c.services_ar?.length ? c.services_ar : c.services_fr) : lang === "en" ? c.services_en : c.services_fr;

  const allCities = [...new Set(companies?.map(c => getCity(c)) || [])];
  const filtered = cityFilter === "all" ? companies : companies?.filter(c => getCity(c) === cityFilter);

  return (
    <main className="py-16 md:py-24">
      <PageMeta title={t("menage.title") as string} description={t("menage.subtitle") as string} />
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            {t("menage.title") as string}
          </h1>
          <p className="text-muted-foreground">{t("menage.subtitle") as string}</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-48 rounded-full">
              <SelectValue placeholder={t("menage.filter.city") as string} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("menage.filter.all") as string}</SelectItem>
              {allCities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Card className={`h-full flex flex-col rounded-2xl transition-shadow hover:shadow-lg ${c.is_premium ? 'border-accent/30 bg-green-light/30' : 'border-border'}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accent/10">
                        {c.logo_url ? (
                          <img src={c.logo_url} alt={c.name} className="h-full w-full object-cover" />
                        ) : (
                          <Sparkles className="h-6 w-6 text-accent" />
                        )}
                      </div>
                      {c.is_premium && (
                        <Badge className="bg-accent text-accent-foreground gap-1">
                          <Award className="h-3 w-3" />
                          {t("menage.premium") as string}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mt-3 text-lg uppercase">{c.name}</CardTitle>
                    <div className="flex items-center gap-3">
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {getCity(c)}
                      </p>
                      {reviewStats?.[c.id] && (
                        <RatingBadge avg={reviewStats[c.id].avg} count={reviewStats[c.id].count} />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{getDesc(c)}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {getServices(c)?.slice(0, 3).map((s: string, j: number) => (
                        <Badge key={j} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full gap-2 rounded-full">
                      <Link to={`/menage/${c.id}`}>
                        {t("menage.cta.view") as string}
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
            <p className="text-muted-foreground">{t("menage.empty") as string}</p>
            <Button asChild variant="outline" className="mt-4 rounded-full">
              <Link to="/contact">{t("nav.contact") as string}</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default MenageDirectory;
