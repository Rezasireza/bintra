-- 1. Pastikan tabel ppdb_submissions memiliki kolom untuk menampung URL dokumen
ALTER TABLE public.ppdb_submissions ADD COLUMN IF NOT EXISTS akte_url text;
ALTER TABLE public.ppdb_submissions ADD COLUMN IF NOT EXISTS kk_url text;
ALTER TABLE public.ppdb_submissions ADD COLUMN IF NOT EXISTS ktp_url text;

-- 2. Pastikan Storage Bucket 'ppdb-docs' menerima UPLOAD dari publik (anon / unauthenticated)
-- karena form pendaftaran PSBB diakses tanpa login.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('ppdb-docs', 'ppdb-docs', false) 
ON CONFLICT (id) DO NOTHING;

-- Hapus policy lama jika ada untuk menghindari duplikat (opsional tapi aman)
DROP POLICY IF EXISTS "Public can upload docs" ON storage.objects;

-- Buat policy yang membolehkan siapa saja untuk upload ke folder ppdb-docs, 
-- namun HANYA admin yang bisa membaca/mengelolanya (karena bucket-nya private).
CREATE POLICY "Public can upload docs" ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'ppdb-docs');
