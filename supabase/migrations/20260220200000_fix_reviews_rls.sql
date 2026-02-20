-- Fix reviews RLS: ensure INSERT works for anonymous and authenticated users

DROP POLICY IF EXISTS "Anyone can submit reviews" ON public.reviews;

-- Explicit policy for both anon and authenticated to insert
CREATE POLICY "Anyone can submit reviews"
ON public.reviews FOR INSERT
TO public
WITH CHECK (true);
