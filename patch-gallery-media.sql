-- 1. Tambah Kolom Baru di Tabel landing_settings untuk Video & Maps
ALTER TABLE public.landing_settings
ADD COLUMN IF NOT EXISTS youtube_video_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS google_maps_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS google_maps_embed TEXT;

-- (Opsional) Isi dengan nilai default jika sebelumnya belum pernah ada
UPDATE public.landing_settings
SET 
  youtube_video_url = 'https://www.youtube.com/watch?v=R9YgJ7UfJ3U',
  google_maps_url = 'https://maps.app.goo.gl/xxx',
  google_maps_embed = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521876402454!2d106.82496431525042!3d-6.194665495514808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4211111!2sSMA%20Bina%20Trampil!5e0!3m2!1sen!2sid!4v1650000000000!5m2!1sen!2sid" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
WHERE id IS NOT NULL;


-- 2. Buat Tabel Baru untuk Galeri Sekolah
CREATE TABLE IF NOT EXISTS public.landing_gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    "order" integer DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Izinkan akses publik untuk membaca Galeri (RLS Policies)
ALTER TABLE public.landing_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to landing_gallery" ON public.landing_gallery
    FOR SELECT USING (true);

-- 4. Masukkan data dummy awal ke Galeri agar langsung tampil
INSERT INTO public.landing_gallery (image_url, caption, "order")
VALUES 
    ('/images/kumpul.jpg', 'Keseruan Ekstrakurikuler di Lapangan Utama', 1),
    ('/images/dance-1.jpg', 'Pentas Seni & Tari Tradisional', 2),
    ('/images/teachers.jpg', 'Guru & Staf Pengajar Profesional', 3)
ON CONFLICT DO NOTHING;
