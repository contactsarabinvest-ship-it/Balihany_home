-- Run this script in Supabase Dashboard > SQL Editor to create the reviews table
-- Copy-paste the entire content and click "Run"

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  concierge_company_id uuid REFERENCES public.concierge_companies(id) ON DELETE CASCADE,
  designer_id uuid REFERENCES public.designers(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  status text NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reviews_one_target CHECK (
    (concierge_company_id IS NOT NULL AND designer_id IS NULL) OR
    (concierge_company_id IS NULL AND designer_id IS NOT NULL)
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_concierge ON public.reviews(concierge_company_id) WHERE concierge_company_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reviews_designer ON public.reviews(designer_id) WHERE designer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running (ignore errors on first run)
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can submit reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;

-- Create RLS policies
-- Public sees only approved; admins see all (including pending for moderation)
CREATE POLICY "Public can view approved reviews"
ON public.reviews FOR SELECT
TO public
USING (
  status = 'approved'
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- Users can ONLY insert with status 'pending' (admin approval required before public display)
CREATE POLICY "Anyone can submit reviews"
ON public.reviews FOR INSERT
TO public
WITH CHECK (status = 'pending');

CREATE POLICY "Admins can update reviews"
ON public.reviews FOR UPDATE
TO public
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete reviews"
ON public.reviews FOR DELETE
TO public
USING (public.has_role(auth.uid(), 'admin'::app_role));
