
-- Create concierge_companies table with bilingual fields
CREATE TABLE public.concierge_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  city_fr TEXT NOT NULL,
  city_en TEXT NOT NULL,
  description_fr TEXT NOT NULL,
  description_en TEXT NOT NULL,
  services_fr TEXT[] NOT NULL DEFAULT '{}',
  services_en TEXT[] NOT NULL DEFAULT '{}',
  cities_covered_fr TEXT[] NOT NULL DEFAULT '{}',
  cities_covered_en TEXT[] NOT NULL DEFAULT '{}',
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public read, no write from client)
ALTER TABLE public.concierge_companies ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth needed for directory)
CREATE POLICY "Anyone can view concierge companies"
  ON public.concierge_companies
  FOR SELECT
  USING (true);
