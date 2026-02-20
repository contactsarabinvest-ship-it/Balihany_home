-- Add portfolio_photos_pending for photos awaiting admin approval
-- portfolio_photos = approved, shown publicly
-- portfolio_photos_pending = uploaded by user, awaiting approval

ALTER TABLE public.concierge_companies
ADD COLUMN IF NOT EXISTS portfolio_photos_pending text[] NOT NULL DEFAULT '{}';

-- Migrate existing portfolio_photos to approved (they're already visible)
-- No change needed - existing photos stay in portfolio_photos as approved
