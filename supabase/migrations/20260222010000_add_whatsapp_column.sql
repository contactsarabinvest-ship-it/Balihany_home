-- Add WhatsApp phone number to all professional tables
ALTER TABLE public.concierge_companies ADD COLUMN IF NOT EXISTS whatsapp text;
ALTER TABLE public.designers ADD COLUMN IF NOT EXISTS whatsapp text;
ALTER TABLE public.menage_companies ADD COLUMN IF NOT EXISTS whatsapp text;
