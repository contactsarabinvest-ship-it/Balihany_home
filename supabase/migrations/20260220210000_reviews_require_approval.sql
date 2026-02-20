-- Allow admins to see all reviews (including pending), public only sees approved

DROP POLICY IF EXISTS "Public can view approved reviews" ON public.reviews;

CREATE POLICY "Public can view approved reviews"
ON public.reviews FOR SELECT
TO public
USING (
  status = 'approved'
  OR public.has_role(auth.uid(), 'admin'::app_role)
);
