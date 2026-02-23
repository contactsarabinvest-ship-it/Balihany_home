-- Les avis doivent être insérés en 'pending' uniquement
-- Modération admin obligatoire avant publication

ALTER TABLE public.reviews ALTER COLUMN status SET DEFAULT 'pending';

DROP POLICY IF EXISTS "Anyone can submit reviews" ON public.reviews;

CREATE POLICY "Anyone can submit reviews"
ON public.reviews FOR INSERT
TO public
WITH CHECK (status = 'pending');
