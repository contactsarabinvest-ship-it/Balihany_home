-- Run this in Supabase SQL Editor to fix: reviews must be inserted as 'pending' only
-- This ensures new reviews require admin approval before going public

-- 1. Change default so new rows are pending if status not specified
ALTER TABLE public.reviews ALTER COLUMN status SET DEFAULT 'pending';

-- 2. Update policy to only allow inserting as 'pending'
DROP POLICY IF EXISTS "Anyone can submit reviews" ON public.reviews;

CREATE POLICY "Anyone can submit reviews"
ON public.reviews FOR INSERT
TO public
WITH CHECK (status = 'pending');
