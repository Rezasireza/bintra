-- =========================================================
-- FIX RLS DELETE UNTUK ADMIN (DASHBOARD & GALLERY)
-- =========================================================

-- 1. Kembalikan hak akses penuh Admin untuk tabel ppdb_submissions
-- Ini penting karena jika setup.sql dijalankan ulang, kebijakan ini terhapus,
-- sehingga menghalangi admin untuk melakukan "Aksi Hapus" (DELETE) di Dashboard.
ALTER TABLE public.ppdb_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage ppdb submissions" ON public.ppdb_submissions;
CREATE POLICY "Admin can manage ppdb submissions" ON public.ppdb_submissions
    FOR ALL 
    USING (public.is_admin());

-- 2. Tambahkan hak akses penuh Admin untuk tabel landing_gallery
-- Tanpa kebijakan ini, Admin tidak bisa mengunggah ulang/menghapus foto di Editor Pengaturan Landing.
ALTER TABLE public.landing_gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage landing gallery" ON public.landing_gallery;
CREATE POLICY "Admin can manage landing gallery" ON public.landing_gallery
    FOR ALL 
    USING (public.is_admin());

-- Selesai. Silakan jalankan script ini di SQL Editor Supabase Anda.
