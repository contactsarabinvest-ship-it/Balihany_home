-- Add portfolio photos for designers (same flow as concierge: uploaded -> pending -> admin approval)
ALTER TABLE public.designers
ADD COLUMN IF NOT EXISTS portfolio_photos text[] NOT NULL DEFAULT '{}',
ADD COLUMN IF NOT EXISTS portfolio_photos_pending text[] NOT NULL DEFAULT '{}';
