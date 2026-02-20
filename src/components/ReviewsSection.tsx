import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";

const reviewSchema = z.object({
  author_name: z.string().trim().min(1).max(100),
  rating: z.number().min(1).max(5),
  comment: z.string().trim().min(10).max(2000),
});

interface ReviewsSectionProps {
  conciergeCompanyId?: string;
  designerId?: string;
}

export function ReviewsSection({ conciergeCompanyId, designerId }: ReviewsSectionProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ author_name: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const column = conciergeCompanyId ? "concierge_company_id" : "designer_id";
  const targetId = conciergeCompanyId ?? designerId ?? "";

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", column, targetId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq(column, targetId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!targetId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = reviewSchema.safeParse(form);
    if (!parsed.success) {
      toast({ title: t("form.validationError") as string, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert({
        concierge_company_id: conciergeCompanyId || null,
        designer_id: designerId || null,
        author_name: parsed.data.author_name,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
      });
      if (error) throw error;
      toast({ title: t("form.success") as string });
      setForm({ author_name: "", rating: 5, comment: "" });
      queryClient.invalidateQueries({ queryKey: ["reviews", column, targetId] });
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : err instanceof Error ? err.message : (t("reviews.submitError") as string);
      toast({ title: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="mt-12 pt-8 border-t">
      <h2 className="text-xl font-bold mb-6">{t("reviews.title") as string}</h2>

      {avgRating && (
        <div className="flex items-center gap-2 mb-6">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn("h-5 w-5", star <= Math.round(Number(avgRating)) ? "fill-amber-400 text-amber-400" : "text-muted-foreground")}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{avgRating} ({reviews.length} {t("reviews.count") as string})</span>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t("reviews.empty") as string}</p>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="rounded-xl">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{review.author_name}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn("h-4 w-4", star <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground")}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(review.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">{t("reviews.submitTitle") as string}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("reviews.submitHint") as string}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="mb-2 block">{t("form.name") as string}</Label>
              <Input
                value={form.author_name}
                onChange={(e) => setForm((p) => ({ ...p, author_name: e.target.value }))}
                placeholder={t("form.name") as string}
                required
                className="rounded-lg"
              />
            </div>
            <div>
              <Label className="mb-2 block">{t("reviews.rating") as string}</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, rating: star }))}
                    className="p-1 rounded hover:bg-muted transition-colors"
                    aria-label={`${star} stars`}
                  >
                    <Star
                      className={cn("h-8 w-8 transition-colors", star <= form.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground")}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">{t("reviews.comment") as string}</Label>
              <Textarea
                value={form.comment}
                onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
                placeholder={t("reviews.comment") as string}
                required
                minLength={10}
                rows={4}
                className="rounded-lg"
              />
            </div>
            <Button type="submit" disabled={submitting} className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              {submitting ? "..." : t("reviews.submit") as string}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
