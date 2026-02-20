-- Update storage bucket file size limits: logo 10MB, portfolio 100MB

UPDATE storage.buckets
SET file_size_limit = 10485760  -- 10 MB
WHERE id = 'logos';

UPDATE storage.buckets
SET file_size_limit = 104857600 -- 100 MB
WHERE id = 'portfolio';
