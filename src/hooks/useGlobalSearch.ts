import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function buildSearchFilter(q: string) {
  const term = `%${q.trim()}%`;
  if (!term || term === "%%") return null;
  return `name.ilike.${term},description_fr.ilike.${term},description_en.ilike.${term},description_ar.ilike.${term},city_fr.ilike.${term},city_en.ilike.${term},city_ar.ilike.${term}`;
}

export function useGlobalSearch(query: string, options?: { limit?: number }) {
  const limit = options?.limit ?? 50;
  const filter = buildSearchFilter(query);

  const { data: concierge, isLoading: loadingConcierge } = useQuery({
    queryKey: ["search-concierge", query, limit],
    queryFn: async () => {
      if (!filter) return [];
      const { data, error } = await supabase
        .from("concierge_companies")
        .select("id, name, city_fr, city_en, city_ar")
        .eq("status", "approved")
        .or(filter)
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
    enabled: (query?.trim().length ?? 0) >= 2,
  });

  const { data: menage, isLoading: loadingMenage } = useQuery({
    queryKey: ["search-menage", query, limit],
    queryFn: async () => {
      if (!filter) return [];
      const { data, error } = await supabase
        .from("menage_companies")
        .select("id, name, city_fr, city_en, city_ar")
        .eq("status", "approved")
        .or(filter)
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
    enabled: (query?.trim().length ?? 0) >= 2,
  });

  const { data: designers, isLoading: loadingDesigners } = useQuery({
    queryKey: ["search-designers", query, limit],
    queryFn: async () => {
      if (!filter) return [];
      const { data, error } = await supabase
        .from("designers")
        .select("id, name, city_fr, city_en, city_ar")
        .eq("status", "approved")
        .or(filter)
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
    enabled: (query?.trim().length ?? 0) >= 2,
  });

  const isLoading = loadingConcierge || loadingMenage || loadingDesigners;
  const hasResults =
    (concierge?.length ?? 0) > 0 ||
    (menage?.length ?? 0) > 0 ||
    (designers?.length ?? 0) > 0;

  return {
    concierge: concierge ?? [],
    menage: menage ?? [],
    designers: designers ?? [],
    isLoading,
    hasResults,
  };
}
