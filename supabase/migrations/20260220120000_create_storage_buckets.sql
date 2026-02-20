-- Create storage buckets for logos and portfolio images
-- Buckets are public so images can be displayed without signed URLs

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('logos', 'logos', true, 5242880)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('portfolio', 'portfolio', true, 10485760)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage.objects
-- Authenticated users can upload to their own folder (path = user_id/filename)
-- Public read is handled by bucket being public

-- Logos: authenticated users can upload to logos/{user_id}/
CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Logos: users can update/delete their own files
CREATE POLICY "Users can update own logos"
ON storage.objects FOR UPDATE
TO authenticated
USING ((storage.foldername(name))[1] = auth.uid()::text AND bucket_id = 'logos');

CREATE POLICY "Users can delete own logos"
ON storage.objects FOR DELETE
TO authenticated
USING ((storage.foldername(name))[1] = auth.uid()::text AND bucket_id = 'logos');

-- Portfolio: authenticated users can upload to portfolio/{user_id}/
CREATE POLICY "Authenticated users can upload portfolio images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'portfolio'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own portfolio images"
ON storage.objects FOR UPDATE
TO authenticated
USING ((storage.foldername(name))[1] = auth.uid()::text AND bucket_id = 'portfolio');

CREATE POLICY "Users can delete own portfolio images"
ON storage.objects FOR DELETE
TO authenticated
USING ((storage.foldername(name))[1] = auth.uid()::text AND bucket_id = 'portfolio');
