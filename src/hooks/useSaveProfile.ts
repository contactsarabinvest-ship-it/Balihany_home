import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthModal } from "@/contexts/AuthModalContext";

export function useSaveProfile(profileType: "concierge" | "menage" | "designer", profileId: string | undefined) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { open: openLogin } = useAuthModal();
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId || !profileId) return;

    supabase
      .from("saved_profiles")
      .select("id")
      .eq("user_id", userId)
      .eq("profile_type", profileType)
      .eq("profile_id", profileId)
      .maybeSingle()
      .then(({ data }) => {
        setSaved(!!data);
      });
  }, [userId, profileId, profileType]);

  const performSave = useCallback(async (uid: string) => {
    if (!profileId) return;
    setLoading(true);
    await supabase.from("saved_profiles").insert({
      user_id: uid,
      profile_type: profileType,
      profile_id: profileId,
    });
    setSaved(true);
    toast({ title: t("profile.saved") as string });
    setLoading(false);
  }, [profileId, profileType, toast, t]);

  const toggle = async () => {
    if (!profileId) return;

    if (!userId) {
      openLogin(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUserId(session.user.id);
          await performSave(session.user.id);
        }
      });
      return;
    }

    setLoading(true);

    if (saved) {
      await supabase
        .from("saved_profiles")
        .delete()
        .eq("user_id", userId)
        .eq("profile_type", profileType)
        .eq("profile_id", profileId);
      setSaved(false);
    } else {
      await supabase.from("saved_profiles").insert({
        user_id: userId,
        profile_type: profileType,
        profile_id: profileId,
      });
      setSaved(true);
      toast({ title: t("profile.saved") as string });
    }

    setLoading(false);
  };

  return { saved, toggle, loading };
}
