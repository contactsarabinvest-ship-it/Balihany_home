-- Le propriétaire du profil peut voir les avis en attente sur son propre profil

DROP POLICY IF EXISTS "Public can view approved reviews" ON public.reviews;

CREATE POLICY "Public can view approved reviews"
ON public.reviews FOR SELECT
TO public
USING (
  status = 'approved'
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR (
    concierge_company_id IS NOT NULL
    AND auth.uid() IN (SELECT user_id FROM public.concierge_companies WHERE id = concierge_company_id)
  )
  OR (
    designer_id IS NOT NULL
    AND auth.uid() IN (SELECT user_id FROM public.designers WHERE id = designer_id)
  )
  OR (
    menage_company_id IS NOT NULL
    AND auth.uid() IN (SELECT user_id FROM public.menage_companies WHERE id = menage_company_id)
  )
);
