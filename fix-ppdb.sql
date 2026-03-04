-- =========================================================
-- SOLUSI FINAL RLS PPDB BINA TRAMPIL
-- =========================================================

-- Masalahnya bukan pada kodenya, tapi karena browser Anda "mengingat" login Admin (ada session di localStorage).
-- Script ChatGPT sebelumnya membatasi INSERT hanya khusus untuk "anon" (tamu murni).
-- Akibatnya, jika Anda tes di browser yang sama tempat Anda log in Admin, Anda dianggap "authenticated",
-- sehingga policy "anon" tidak berlaku untuk Anda, dan Anda jadi terblokir (RLS Violation).

-- SOLUSI: Kita ubah target policy dari "to anon" menjadi "to public" (semua orang, baik login maupun tidak).

-- 1. Perbaiki Tabel PPDB
DROP POLICY IF EXISTS "ppdb: anon insert" ON public.ppdb_submissions;
CREATE POLICY "ppdb: public insert" ON public.ppdb_submissions
FOR INSERT
TO public
WITH CHECK (true);

-- 2. Perbaiki Folder Dokumen (Storage)
DROP POLICY IF EXISTS "storage: anon upload ppdb-docs" ON storage.objects;
CREATE POLICY "storage: public upload ppdb-docs" ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'ppdb-docs'
  AND (name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/')
);
