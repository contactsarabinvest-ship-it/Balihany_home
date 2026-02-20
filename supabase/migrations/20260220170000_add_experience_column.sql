-- Add experience_years to concierge_companies and designers

ALTER TABLE public.concierge_companies
ADD COLUMN IF NOT EXISTS experience_years text;

ALTER TABLE public.designers
ADD COLUMN IF NOT EXISTS experience_years text;
