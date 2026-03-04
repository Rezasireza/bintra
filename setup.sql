-- Enable UUID generator
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- DROP EXISTING POLICIES TO AVOID ERRORS
-- ==========================================
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %s ON public.%s;', r.policyname, r.tablename);
    END LOOP;
END $$;

-- ==========================================
-- TABLES CREATION
-- ==========================================

-- Admins Table (Ensuring it exists)
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Landing Settings (Single Row)
CREATE TABLE IF NOT EXISTS public.landing_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    -- Hero Section
    hero_title TEXT DEFAULT 'SMA PLUS | BINA TRAMPIL',
    hero_subtitle TEXT DEFAULT 'Siap Kerja. Siap Kuliah. Siap Wirausaha.',
    cta_text TEXT DEFAULT 'Hubungi WhatsApp',
    cta_whatsapp_number TEXT DEFAULT '6289506835889',
    badge_text TEXT DEFAULT 'SPMB 2026/2027',
    hero_background_pattern BOOLEAN DEFAULT true,
    -- SEO Global
    meta_title TEXT DEFAULT 'SMA Plus Bina Trampil | Pendaftaran',
    meta_description TEXT DEFAULT 'Website resmi SMA Plus Bina Trampil.',
    meta_keywords TEXT DEFAULT 'sma, bina trampil',
    og_title TEXT DEFAULT 'SMA Plus Bina Trampil',
    og_description TEXT DEFAULT 'Website resmi pendaftaran siswa baru.',
    og_image TEXT,
    canonical_url TEXT DEFAULT 'https://smaplusbinatrampil.sch.id',
    -- Pricing Texts Global
    pricing_badge TEXT DEFAULT 'AKREDITASI B',
    -- CTA Section
    bottom_cta_title TEXT DEFAULT 'Siap Bergabung di SMA PLUS BINA TRAMPIL?',
    bottom_cta_button TEXT DEFAULT 'Chat WhatsApp: Ibu Dwita',
    bottom_cta_whatsapp TEXT DEFAULT '6289506835889',
    bottom_cta_bg_color TEXT DEFAULT 'bg-cream-100',
    -- Footer
    school_name TEXT DEFAULT 'SMA Plus Bina Trampil',
    tagline TEXT DEFAULT 'Sekolah Berkualitas',
    about_text TEXT DEFAULT 'Mencetak generasi unggul yang siap kerja dan kuliah.',
    instagram_url TEXT DEFAULT 'https://instagram.com/smaplus',
    facebook_url TEXT DEFAULT 'https://facebook.com/smaplus',
    address TEXT DEFAULT 'Jl. Raya Pendidikan No.1',
    phone TEXT DEFAULT '+62 895 0683 5889',
    email TEXT DEFAULT 'info@smaplusbinatrampil.sch.id',
    copyright_text TEXT DEFAULT '© 2026 SMA Plus Bina Trampil. All rights reserved.',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Hero Cards (4 items)
CREATE TABLE IF NOT EXISTS public.hero_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    image_path TEXT NOT NULL,
    image_public_url TEXT,
    ratio TEXT DEFAULT '16:10', -- '16:10' or '4:5'
    "order" INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Registration Phases
CREATE TABLE IF NOT EXISTS public.registration_phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    academic_year TEXT,
    "order" INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Requirements
CREATE TABLE IF NOT EXISTS public.requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    "order" INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Pricing Cards
CREATE TABLE IF NOT EXISTS public.pricing_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pendaftaran_label TEXT DEFAULT 'Uang Pendaftaran',
    pendaftaran_value TEXT DEFAULT 'Gratis',
    pendaftaran_note TEXT,
    seragam_label TEXT DEFAULT 'Seragam',
    seragam_value TEXT DEFAULT 'Rp 550.000',
    seragam_note TEXT,
    spp_label TEXT DEFAULT 'SPP Bulanan',
    spp_value TEXT DEFAULT 'Rp 70.000',
    spp_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Facilities
CREATE TABLE IF NOT EXISTS public.facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'CheckCircle2',
    "order" INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Scholarships
CREATE TABLE IF NOT EXISTS public.scholarships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    "order" INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    quote TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    "order" INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Quick Links
CREATE TABLE IF NOT EXISTS public.quick_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    target_id TEXT NOT NULL,
    "order" INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Articles
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    category TEXT DEFAULT 'Umum',
    author_name TEXT DEFAULT 'Admin',
    reading_time_minutes INTEGER DEFAULT 3,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    cover_image TEXT,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    og_image TEXT,
    canonical_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- AUTO-UPDATE UPDATED_AT TRIGGER
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ DECLARE
    t TEXT;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('landing_settings', 'hero_cards', 'registration_phases', 'requirements', 'pricing_cards', 'facilities', 'scholarships', 'testimonials', 'quick_links', 'articles')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%I_modtime ON public.%I;', t, t);
        EXECUTE format('CREATE TRIGGER update_%I_modtime BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();', t, t);
    END LOOP;
END $$;

-- ==========================================
-- ENABLE ROW LEVEL SECURITY
-- ==========================================
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS POLICIES
-- ==========================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins WHERE email = auth.jwt() ->> 'email'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public READ Policies
CREATE POLICY "Public can read landing settings" ON public.landing_settings FOR SELECT USING (true);
CREATE POLICY "Public can read hero cards" ON public.hero_cards FOR SELECT USING (true);
CREATE POLICY "Public can read phases" ON public.registration_phases FOR SELECT USING (true);
CREATE POLICY "Public can read requirements" ON public.requirements FOR SELECT USING (true);
CREATE POLICY "Public can read pricing" ON public.pricing_cards FOR SELECT USING (true);
CREATE POLICY "Public can read facilities" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Public can read scholarships" ON public.scholarships FOR SELECT USING (true);
CREATE POLICY "Public can read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public can read quick links" ON public.quick_links FOR SELECT USING (true);
CREATE POLICY "Public can read published articles" ON public.articles FOR SELECT USING (published = true);

-- Admin ALL Policies
CREATE POLICY "Admin can manage landing settings" ON public.landing_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Admin can manage hero cards" ON public.hero_cards FOR ALL USING (public.is_admin());
CREATE POLICY "Admin can manage phases" ON public.registration_phases FOR ALL USING (public.is_admin());
CREATE POLICY "Admin can manage requirements" ON public.requirements FOR ALL USING (public.is_admin());
CREATE POLICY "Admin can manage pricing" ON public.pricing_cards FOR ALL USING (public.is_admin());
CREATE POLICY "Admin can manage facilities" ON public.facilities FOR ALL USING (public.is_admin());
CREATE POLICY "Admin can manage scholarships" ON public.scholarships FOR ALL USING (public.is_admin());
CREATE POLICY "Admin can manage testimonials" ON public.testimonials FOR ALL USING (public.is_admin());
CREATE POLICY "Admin can manage quick links" ON public.quick_links FOR ALL USING (public.is_admin());
CREATE POLICY "Admin can manage articles" ON public.articles FOR ALL USING (public.is_admin());

-- ==========================================
-- STORAGE SETUP
-- ==========================================

-- Create buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('landing-media', 'landing-media', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('articles', 'articles', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('ppdb-docs', 'ppdb-docs', false) ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public can read landing media" ON storage.objects;
DROP POLICY IF EXISTS "Admin can insert landing media" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update landing media" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete landing media" ON storage.objects;
DROP POLICY IF EXISTS "Public can read articles images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can insert articles images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update articles images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete articles images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can manage all docs" ON storage.objects;

-- Create storage policies
CREATE POLICY "Public can read landing media" ON storage.objects FOR SELECT USING (bucket_id = 'landing-media');
CREATE POLICY "Admin can insert landing media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'landing-media' AND auth.role() = 'authenticated' AND public.is_admin());
CREATE POLICY "Admin can update landing media" ON storage.objects FOR UPDATE USING (bucket_id = 'landing-media' AND auth.role() = 'authenticated' AND public.is_admin());
CREATE POLICY "Admin can delete landing media" ON storage.objects FOR DELETE USING (bucket_id = 'landing-media' AND auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "Public can read articles images" ON storage.objects FOR SELECT USING (bucket_id = 'articles');
CREATE POLICY "Admin can insert articles images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'articles' AND auth.role() = 'authenticated' AND public.is_admin());
CREATE POLICY "Admin can update articles images" ON storage.objects FOR UPDATE USING (bucket_id = 'articles' AND auth.role() = 'authenticated' AND public.is_admin());
CREATE POLICY "Admin can delete articles images" ON storage.objects FOR DELETE USING (bucket_id = 'articles' AND auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "Admin can manage all docs" ON storage.objects FOR ALL USING (bucket_id = 'ppdb-docs' AND auth.role() = 'authenticated' AND public.is_admin());

-- ==========================================
-- SEED DEFAULT DATA
-- ==========================================
INSERT INTO public.landing_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.hero_cards (title, image_path, ratio, "order") VALUES 
('Prestasi Akademik', '/images/student-certificate.jpg', '4:5', 1),
('Ekstrakurikuler', '/images/dance-1.jpg', '16:10', 2),
('Fasilitas', '/images/teachers.jpg', '16:10', 3),
('Lulusan', '/images/kumpul.jpg', '4:5', 4)
ON CONFLICT DO NOTHING;

INSERT INTO public.pricing_cards (pendaftaran_label) VALUES ('Uang Pendaftaran') ON CONFLICT DO NOTHING;
A L T E R   T A B L E   p u b l i c . a d m i n s   A D D   C O L U M N   I F   N O T   E X I S T S   f u l l _ n a m e   T E X T ;  
 A L T E R   T A B L E   p u b l i c . a d m i n s   A D D   C O L U M N   I F   N O T   E X I S T S   a v a t a r _ u r l   T E X T ;  
 