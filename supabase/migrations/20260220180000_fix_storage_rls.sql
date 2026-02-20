-- Fix storage RLS: allow unconfirmed users (anon with auth.uid) and add SELECT/UPDATE for upsert

-- Drop existing logo policies to recreate
DROP POLICY IF EXISTS "Authenticated users can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own logos" ON storage.objects;

-- Logos: INSERT - allow both authenticated and anon (unconfirmed signup users have anon role)
CREATE POLICY "Users can upload logos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Logos: SELECT - required for upsert to check existing file
CREATE POLICY "Users can view own logos"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Logos: UPDATE - required for upsert when file exists
CREATE POLICY "Users can update own logos"
ON storage.objects FOR UPDATE
TO public
USING (
  bucket_id = 'logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Logos: DELETE
CREATE POLICY "Users can delete own logos"
ON storage.objects FOR DELETE
TO public
USING (
  bucket_id = 'logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Portfolio: same fixes
DROP POLICY IF EXISTS "Authenticated users can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own portfolio images" ON storage.objects;

CREATE POLICY "Users can upload portfolio images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'portfolio'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own portfolio images"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'portfolio'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own portfolio images"
ON storage.objects FOR UPDATE
TO public
USING (
  bucket_id = 'portfolio'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own portfolio images"
ON storage.objects FOR DELETE
TO public
USING (
  bucket_id = 'portfolio'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
