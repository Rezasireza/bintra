-- 1. Buat Tabel ppdb_submissions Pendaftaran (JIKA BELUM ADA)
CREATE TABLE IF NOT EXISTS public.ppdb_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_lengkap TEXT NOT NULL,
    nik TEXT NOT NULL,
    nisn TEXT NOT NULL,
    tempat_lahir TEXT NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin TEXT NOT NULL,
    alamat TEXT NOT NULL,
    kecamatan TEXT NOT NULL,
    kab_kota TEXT NOT NULL,
    no_whatsapp TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    akte_url TEXT,
    kk_url TEXT,
    ktp_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Trigger auto-update `updated_at`
DO $$ BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column'
    ) THEN
        DROP TRIGGER IF EXISTS update_ppdb_submissions_modtime ON public.ppdb_submissions;
        CREATE TRIGGER update_ppdb_submissions_modtime BEFORE UPDATE ON public.ppdb_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 3. Akftifkan RLS dan atur Permissions (Anonymous BISA INSERT, Admin BISA SEMUA)
ALTER TABLE public.ppdb_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert ppdb submissions" ON public.ppdb_submissions;
CREATE POLICY "Public can insert ppdb submissions" ON public.ppdb_submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can manage ppdb submissions" ON public.ppdb_submissions;
CREATE POLICY "Admin can manage ppdb submissions" ON public.ppdb_submissions FOR ALL USING (public.is_admin());

-- 4. Pengaturan Storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('ppdb-docs', 'ppdb-docs', false) 
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can upload docs" ON storage.objects;
CREATE POLICY "Public can upload docs" ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'ppdb-docs');

DROP POLICY IF EXISTS "Admin can manage all docs" ON storage.objects;
CREATE POLICY "Admin can manage all docs" ON storage.objects 
FOR ALL 
USING (bucket_id = 'ppdb-docs' AND auth.role() = 'authenticated' AND public.is_admin());
