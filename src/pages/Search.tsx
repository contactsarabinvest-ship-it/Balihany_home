import { useSearchParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageMeta } from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { Building2, Sparkles, Paintbrush, MapPin, ArrowRight } from "lucide-react";
import { RatingBadge } from "@/components/RatingBadge";
import { useReviewStats } from "@/hooks/useReviewStats";

const Search = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const { lang, t } = useLanguage();
  const { concierge, menage, designers, isLoading, hasResults } = useGlobalSearch(q, { limit: 50 });

  const { data: reviewStatsConcierge } = useReviewStats("concierge_company_id", concierge.map((c) => c.id));
  const { data: reviewStatsMenage } = useReviewStats("menage_company_id", menage.map((m) => m.id));
  const { data: reviewStatsDesigners } = useReviewStats("designer_id", designers.map((d) => d.id));

  const getCity = (row: { city_fr?: string; city_en?: string; city_ar?: string }) =>
    lang === "ar" ? (row.city_ar || row.city_fr) : lang === "en" ? row.city_en : row.city_fr;

  const totalCount = concierge.length + menage.length + designers.length;

  return (
    <main className="py-16 md:py-24">
      <PageMeta title={t("search.title") as string} description="" />
      <div className="container">
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          {t("search.title") as string}
        </h1>
        <p className="mb-8 text-muted-foreground">
          {q
            ? `« ${q} » — ${totalCount === 1 ? (t("search.resultCount") as string).replace("{count}", "1") : (t("search.resultCount_other") as string).replace("{count}", String(totalCount))}`
            : (t("nav.searchPlaceholder") as string)}
        </p>

        {!q || q.trim().length < 2 ? (
          <p className="text-muted-foreground">{t("search.noResults") as string}</p>
        ) : isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : !hasResults ? (
          <p className="text-muted-foreground">{t("search.noResults") as string}</p>
        ) : (
          <div className="space-y-10">
            {concierge.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Building2 className="h-5 w-5 text-accent" />
                  {t("nav.concierge") as string}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {concierge.map((c) => (
                    <Card key={c.id} className="rounded-2xl overflow-hidden">
                      <CardHeader className="flex flex-row items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accent/10">
                          <Building2 className="h-6 w-6 text-accent" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{c.name}</p>
                          {getCity(c) && (
                            <p className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              {getCity(c)}
                            </p>
                          )}
                          {reviewStatsConcierge?.[c.id] && (
                            <RatingBadge avg={reviewStatsConcierge[c.id].avg} count={reviewStatsConcierge[c.id].count} />
                          )}
                        </div>
                      </CardHeader>
                      <CardFooter>
                        <Button asChild variant="outline" size="sm" className="w-full gap-2 rounded-full">
                          <Link to={`/concierge/${c.id}`}>
                            {t("dashboard.viewProfile") as string}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {menage.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Sparkles className="h-5 w-5 text-accent" />
                  {t("nav.menage") as string}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {menage.map((m) => (
                    <Card key={m.id} className="rounded-2xl overflow-hidden">
                      <CardHeader className="flex flex-row items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accent/10">
                          <Sparkles className="h-6 w-6 text-accent" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{m.name}</p>
                          {getCity(m) && (
                            <p className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              {getCity(m)}
                            </p>
                          )}
                          {reviewStatsMenage?.[m.id] && (
                            <RatingBadge avg={reviewStatsMenage[m.id].avg} count={reviewStatsMenage[m.id].count} />
                          )}
                        </div>
                      </CardHeader>
                      <CardFooter>
                        <Button asChild variant="outline" size="sm" className="w-full gap-2 rounded-full">
                          <Link to={`/menage/${m.id}`}>
                            {t("dashboard.viewProfile") as string}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {designers.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Paintbrush className="h-5 w-5 text-terracotta" />
                  {t("nav.designers") as string}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {designers.map((d) => (
                    <Card key={d.id} className="rounded-2xl overflow-hidden border-terracotta/20">
                      <CardHeader className="flex flex-row items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-terracotta-light">
                          <Paintbrush className="h-6 w-6 text-terracotta" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{d.name}</p>
                          {getCity(d) && (
                            <p className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              {getCity(d)}
                            </p>
                          )}
                          {reviewStatsDesigners?.[d.id] && (
                            <RatingBadge avg={reviewStatsDesigners[d.id].avg} count={reviewStatsDesigners[d.id].count} />
                          )}
                        </div>
                      </CardHeader>
                      <CardFooter>
                        <Button asChild variant="outline" size="sm" className="w-full gap-2 rounded-full">
                          <Link to={`/designers/${d.id}`}>
                            {t("dashboard.viewProfile") as string}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Search;
