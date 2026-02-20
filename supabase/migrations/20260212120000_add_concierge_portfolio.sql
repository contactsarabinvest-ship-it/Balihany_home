-- Add portfolio and photos columns to concierge_companies
ALTER TABLE public.concierge_companies
  ADD COLUMN IF NOT EXISTS portfolio_urls text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS portfolio_photos text[] NOT NULL DEFAULT '{}';
