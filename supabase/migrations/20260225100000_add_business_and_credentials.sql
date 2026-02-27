-- Add website, phone, and credentials to all professional tables (optional)
ALTER TABLE public.concierge_companies ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE public.concierge_companies ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.concierge_companies ADD COLUMN IF NOT EXISTS credentials text[];

ALTER TABLE public.designers ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE public.designers ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.designers ADD COLUMN IF NOT EXISTS credentials text[];

ALTER TABLE public.menage_companies ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE public.menage_companies ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.menage_companies ADD COLUMN IF NOT EXISTS credentials text[];
