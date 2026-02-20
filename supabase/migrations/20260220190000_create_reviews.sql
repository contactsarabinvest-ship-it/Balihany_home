-- Reviews / comments from clients after using a concierge or designer service

CREATE TABLE public.reviews (
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

CREATE INDEX idx_reviews_concierge ON public.reviews(concierge_company_id) WHERE concierge_company_id IS NOT NULL;
CREATE INDEX idx_reviews_designer ON public.reviews(designer_id) WHERE designer_id IS NOT NULL;
CREATE INDEX idx_reviews_status ON public.reviews(status);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved reviews
CREATE POLICY "Public can view approved reviews"
ON public.reviews FOR SELECT
USING (status = 'approved');

-- Anyone can insert (clients leave reviews)
CREATE POLICY "Anyone can submit reviews"
ON public.reviews FOR INSERT
TO public
WITH CHECK (true);

-- Admins can update/delete (moderation)
CREATE POLICY "Admins can update reviews"
ON public.reviews FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete reviews"
ON public.reviews FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));
