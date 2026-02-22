import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ReviewStatsMap = Record<string, { avg: number; count: number }>;

export function useReviewStats(
  column: "concierge_company_id" | "designer_id" | "menage_company_id",
  ids: string[] | undefined,
) {
  return useQuery<ReviewStatsMap>({
    queryKey: ["review-stats", column, ids],
    queryFn: async () => {
      if (!ids?.length) return {};
      const { data, error } = await supabase
        .from("reviews")
        .select("rating, concierge_company_id, designer_id, menage_company_id")
        .eq("status", "approved")
        .in(column, ids);
      if (error) throw error;

      const map: ReviewStatsMap = {};
      for (const r of data ?? []) {
        const id = (r as any)[column] as string;
        if (!id) continue;
        if (!map[id]) map[id] = { avg: 0, count: 0 };
        map[id].count += 1;
        map[id].avg += r.rating;
      }
      for (const id of Object.keys(map)) {
        map[id].avg = map[id].avg / map[id].count;
      }
      return map;
    },
    enabled: !!ids?.length,
  });
}
