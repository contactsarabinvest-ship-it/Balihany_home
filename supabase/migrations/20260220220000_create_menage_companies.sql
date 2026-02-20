-- Table menage_companies (services de ménage) - same structure as concierge_companies
CREATE TABLE public.menage_companies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  logo_url text,
  city_fr text NOT NULL,
  city_en text NOT NULL,
  city_ar text NOT NULL DEFAULT '',
  description_fr text NOT NULL,
  description_en text NOT NULL,
  description_ar text NOT NULL DEFAULT '',
  services_fr text[] NOT NULL DEFAULT '{}',
  services_en text[] NOT NULL DEFAULT '{}',
  services_ar text[] NOT NULL DEFAULT '{}',
  cities_covered_fr text[] NOT NULL DEFAULT '{}',
  cities_covered_en text[] NOT NULL DEFAULT '{}',
  cities_covered_ar text[] NOT NULL DEFAULT '{}',
  portfolio_urls text[] NOT NULL DEFAULT '{}',
  portfolio_photos text[] NOT NULL DEFAULT '{}',
  portfolio_photos_pending text[] NOT NULL DEFAULT '{}',
  experience_years text,
  is_premium boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'approved',
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.menage_companies ENABLE ROW LEVEL SECURITY;

-- Public read for approved companies
CREATE POLICY "View approved or own menage companies"
  ON public.menage_companies FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

-- Users can insert their own pending company (for future signup)
CREATE POLICY "Users can insert own menage company"
  ON public.menage_companies FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Users can update their own company
CREATE POLICY "Users can update own menage company"
  ON public.menage_companies FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can update/delete any
CREATE POLICY "Admins can update any menage company"
  ON public.menage_companies FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete any menage company"
  ON public.menage_companies FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Extend reviews to support menage_company_id
ALTER TABLE public.reviews
  ADD COLUMN menage_company_id uuid REFERENCES public.menage_companies(id) ON DELETE CASCADE;

-- Drop old constraint and add new one
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_one_target;

ALTER TABLE public.reviews ADD CONSTRAINT reviews_one_target CHECK (
  (concierge_company_id IS NOT NULL AND designer_id IS NULL AND menage_company_id IS NULL) OR
  (concierge_company_id IS NULL AND designer_id IS NOT NULL AND menage_company_id IS NULL) OR
  (concierge_company_id IS NULL AND designer_id IS NULL AND menage_company_id IS NOT NULL)
);

CREATE INDEX idx_reviews_menage ON public.reviews(menage_company_id) WHERE menage_company_id IS NOT NULL;
