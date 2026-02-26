-- Add Instagram handle/URL to all professional tables (optional)
ALTER TABLE public.concierge_companies ADD COLUMN IF NOT EXISTS instagram text;
ALTER TABLE public.designers ADD COLUMN IF NOT EXISTS instagram text;
ALTER TABLE public.menage_companies ADD COLUMN IF NOT EXISTS instagram text;
