-- Run this in Supabase SQL Editor if you already created the reviews table
-- This allows admins to see pending reviews for moderation

DROP POLICY IF EXISTS "Public can view approved reviews" ON public.reviews;

CREATE POLICY "Public can view approved reviews"
ON public.reviews FOR SELECT
TO public
USING (
  status = 'approved'
  OR public.has_role(auth.uid(), 'admin'::app_role)
);
