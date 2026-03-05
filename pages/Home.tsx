import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  CheckCircle2, Monitor, Briefcase, Trophy, Tv, Wifi,
  Users, Music, Coffee, Building2, Calendar, Phone, Loader2,
  ChevronLeft, ChevronRight, Play, MapPin
} from 'lucide-react';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import TypewriterHeadline from '../components/TypewriterHeadline';
import AnimatedGridPattern from '../components/ui/animated-grid-pattern';
import ArticleSection from '../components/ArticleSection';
import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToId } from '../src/utils/scroll';
import { useLandingData } from '../src/hooks/useLandingData';

// Map string icon names from JSON to Lucide icons
const iconMap: Record<string, React.FC<any>> = {
  Users, Tv, Monitor, Trophy, Briefcase, Building2, Music, Coffee, Wifi, Calendar, CheckCircle2
};

interface ImageCardProps { src: string; alt: string; className?: string; }
const ImageCard: React.FC<ImageCardProps> = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-12deg", "12deg"]);
  const shadowX = useTransform(mouseX, [-0.5, 0.5], ["-20px", "20px"]);
  const shadowY = useTransform(mouseY, [-0.5, 0.5], ["-20px", "20px"]);
  const shadowBlur = useTransform(mouseY, [-0.5, 0.5], ["30px", "50px"]);
  const glowX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(((e.clientX - rect.left) / rect.width) - 0.5);
    y.set(((e.clientY - rect.top) / rect.height) - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      className={`relative z-10 group perspective-1000 ${className || ''}`}
      ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative w-full h-full rounded-3xl overflow-hidden bg-white"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", boxShadow: `0 20px 40px rgba(0,0,0,0.2)` }}
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          className="absolute inset-0 z-0 bg-black/20 blur-xl rounded-full opacity-60"
          style={{ x: shadowX, y: shadowY, filter: `blur(${shadowBlur})`, opacity: useTransform(mouseY, [-0.5, 0, 0.5], [0.4, 0.2, 0.4]) }}
        />
        {error ? (
          <div className="absolute inset-0 z-10 w-full h-full bg-gray-200 flex items-center justify-center p-4 text-center border-2 border-red-400">
            <p className="text-red-500 font-bold text-xs">Image not found:<br />{src}</p>
          </div>
        ) : (
          <img src={src} alt={alt} onError={() => setError(true)} className="absolute inset-0 w-full h-full object-cover z-10" />
        )}
        <div className="absolute inset-0 z-20 bg-black/10 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none" />
        <div className="absolute inset-0 z-30 flex items-end p-6 pointer-events-none">
          <span className="text-white font-medium text-lg relative drop-shadow-md translate-z-20" style={{ transform: "translateZ(30px)" }}>{alt}</span>
        </div>
        <motion.div
          className="absolute inset-0 z-40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: useTransform([glowX, glowY], ([xVal, yVal]) => `radial-gradient(circle at ${xVal} ${yVal}, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)`),
            mixBlendMode: "overlay"
          }}
        />
      </motion.div>
    </motion.div>
  );
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};
const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemAnim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const GalleryCarousel: React.FC<{ items: any[] }> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const interval = setInterval(() => {
      goNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl group border-[6px] border-white/50">
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={items[currentIndex].image_url}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover"
            alt={items[currentIndex].caption || "Gallery image"}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent pointer-events-none flex items-end p-6 md:p-10 z-10">
          <motion.h3
            key={`text-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-white text-xl md:text-3xl font-bold drop-shadow-lg"
          >
            {items[currentIndex].caption}
          </motion.h3>
        </div>
      </div>

      <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-white/20 hover:bg-white text-white hover:text-primary-DEFAULT backdrop-blur-md rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 shadow-lg">
        <ChevronLeft size={28} />
      </button>
      <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-white/20 hover:bg-white text-white hover:text-primary-DEFAULT backdrop-blur-md rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 shadow-lg">
        <ChevronRight size={28} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {items.map((_, i) => (
          <button key={i} onClick={() => setCurrentIndex(i)} className={`h-2.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-gold-500 w-8 shadow-md' : 'bg-white/50 w-2.5 hover:bg-white'} `} />
        ))}
      </div>
    </div>
  );
}

const YoutubeEmbed: React.FC<{ url: string }> = ({ url }) => {
  if (!url) return null;
  let videoId = "";

  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtube.com")) {
      videoId = urlObj.searchParams.get("v") || "";
    } else if (urlObj.hostname.includes("youtu.be")) {
      videoId = urlObj.pathname.slice(1);
    }
  } catch (err) {
    const fallbackMatch = url.match(/[?&]v=([^&]+)/);
    if (fallbackMatch) videoId = fallbackMatch[1];
  }

  // Fallback ID for display test if extracting fails completely but we need to show something
  if (!videoId || videoId.length < 10) return null;

  return (
    <div className="w-full max-w-4xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-[8px] border-white relative group bg-gray-900">
      <iframe
        className="absolute inset-0 w-full h-full z-10"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

const Home: React.FC = () => {
  const {
    settings: data, heroCards, phases, requirements,
    pricing, facilities, scholarships, testimonials,
    quickLinks, gallery, loading
  } = useLandingData();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      const state = location.state as { scrollTarget?: string };
      const query = new URLSearchParams(location.search);
      let target = state?.scrollTarget || query.get('scroll');

      if (target) {
        scrollToId(target);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [loading, location, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 overflow-hidden flex flex-col">
        <div className="max-w-[1200px] w-full mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center flex-1">
          {/* Text Area Skeleton */}
          <div className="space-y-8 animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded-full" />
            <div className="space-y-4">
              <div className="h-16 lg:h-20 w-full bg-gray-200 rounded-2xl" />
              <div className="h-16 lg:h-20 w-3/4 bg-gray-200 rounded-2xl" />
            </div>
            <div className="h-8 w-2/3 bg-gray-200 rounded-lg mt-6" />
            <div className="flex gap-4 pt-4">
              <div className="h-14 w-40 bg-gray-200 rounded-xl" />
              <div className="h-14 w-40 bg-gray-200 rounded-xl" />
            </div>
          </div>

          {/* Visuals Skeleton */}
          <div className="hidden lg:block h-[600px] relative animate-pulse">
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full relative p-4">
              <div className="w-full h-full bg-gray-200 rounded-3xl mt-12 transform translate-y-8" />
              <div className="w-full h-full bg-gray-200 rounded-3xl mb-8 transform -translate-y-4" />
              <div className="w-full h-full bg-gray-200 rounded-3xl transform translate-x-4" />
              <div className="w-full h-full bg-gray-200 rounded-3xl mt-8 transform -translate-x-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallbacks
  const heroLines = (data.hero_title || 'SMA PLUS | BINA TRAMPIL').split('|');
  const line1 = heroLines[0]?.trim() || 'SMA PLUS';
  const line2 = heroLines[1]?.trim() || 'BINA TRAMPIL';
  const subtitle = data.hero_subtitle || 'Siap Kerja. Siap Kuliah. Siap Wirausaha.';
  const cta = data.cta_text || 'Hubungi WhatsApp';
  const badge_text = data.badge_text || 'SPMB 2026/2027';

  const meta_title = data.meta_title || 'SMA Plus Bina Trampil | Pendaftaran Siswa Baru';
  const meta_desc = data.meta_description || 'Website resmi pendaftaran siswa baru SMA Plus Bina Trampil. Sekolah berkualitas dengan biaya terjangkau.';
  const meta_kw = data.meta_keywords || 'sma, sma swasta, sma plus bina trampil, pendaftaran siswa baru, ppdb';

  // For visual backwards compatibility, let's keep hardcoded if the table is totally empty and it's 1st run.
  // Actually hook guarantees [] if table is empty.
  const displayPhases = phases.length > 0 ? phases : [
    { label: 'FASE 1', start_date: '23 Mar', end_date: '22 Apr 2026' },
    { label: 'FASE 2', start_date: '25 Mei', end_date: '17 Jun 2026' }
  ];

  const pricingData = pricing.length > 0 ? pricing[0] : {
    pendaftaran_label: 'Uang Pendaftaran', pendaftaran_value: 'Gratis',
    seragam_label: 'Seragam', seragam_value: 'Rp 550.000',
    spp_label: 'SPP Bulanan', spp_value: 'Rp 70.000'
  };

  const fasilitasData = facilities.length > 0 ? facilities : [
    { icon: "Users", title: "Guru Profesional", description: "Tenaga pengajar berpengalaman." },
    { icon: "Tv", title: "Ruang Kelas Plus Smart TV", description: "Pembelajaran interaktif." },
    { icon: "Monitor", title: "Lab Komputer", description: "Fasilitas praktikum." }
  ];

  const beasiswaData = scholarships.length > 0 ? scholarships : [
    { title: "Beasiswa Prestasi Akademik", description: "Full beasiswa untuk peringkat 1–5 dari sekolah asal." },
    { title: "Bantuan Pendidikan", description: "Keringanan biaya untuk siswa kurang mampu (sesuai ketentuan)." }
  ];

  const requirementsData = requirements.length > 0 ? requirements : [
    { title: "Formulir Pendaftaran" }, { title: "Fotocopy Surat Kelulusan" },
    { title: "Fotocopy IJAZAH" }, { title: "Fotocopy Akte Kelahiran" },
    { title: "Fotocopy Kartu Keluarga" }, { title: "Fotocopy KTP Orang Tua" },
    { title: "Foto 3x4 (4 lembar)" }
  ];

  return (
    <>
      <Helmet>
        <title>{meta_title}</title>
        <meta name="description" content={meta_desc} />
        <meta name="keywords" content={meta_kw} />
        <meta property="og:title" content={meta_title} />
        <meta property="og:description" content={meta_desc} />
      </Helmet>

      {/* SECTION Hero */}
      <section id="program" className="min-h-[92vh] pt-32 pb-20 bg-white relative overflow-hidden flex items-center">
        <AnimatedGridPattern
          className="opacity-40 skew-y-12 rotate-[-5deg] scale-110 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
          numSquares={60} width={32} height={32} maxOpacity={0.3} duration={3.2} repeatDelay={0.9}
        />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-cream-100/40 to-transparent pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="space-y-8 relative z-10">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-cream-100 border border-primary-DEFAULT/10 text-primary-DEFAULT text-sm font-semibold tracking-wide">
              {badge_text}
            </div>
            <TypewriterHeadline line1={line1} line2={line2} speed={75} startDelay={200}
              className="text-5xl md:text-6xl lg:text-[4.25rem] font-bold leading-[1.1] tracking-tight text-primary-DEFAULT"
              line2ClassName="text-gold-500" />

            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold text-primary-secondary">{subtitle}</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={() => window.open(`https://wa.me/${data.cta_whatsapp_number || '6289506835889'}`, '_blank')} className="shadow-xl shadow-gold-500/20">{cta}</Button>
              <Button variant="secondary" onClick={() => document.getElementById('syarat')?.scrollIntoView({ behavior: 'smooth' })}>
                Lihat Persyaratan
              </Button>
            </div>
          </motion.div>

          {/* Visuals */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative h-[600px] hidden lg:block z-10">
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full relative p-4">
              <div className="absolute top-10 right-10 w-24 h-24 bg-cream-100 rounded-full blur-2xl opacity-60 z-0" />
              <div className="absolute bottom-20 left-10 w-32 h-32 bg-gold-400/10 rounded-full blur-3xl z-0" />
              {heroCards.length > 0 ? (
                heroCards.map((card, idx) => {
                  let cls = '';
                  if (idx === 0) cls = "mt-12 transform translate-y-8";
                  else if (idx === 1) cls = "mb-8 transform -translate-y-4";
                  else if (idx === 2) cls = "transform translate-x-4";
                  else if (idx === 3) cls = "mt-8 transform -translate-x-4";
                  return <ImageCard key={card.id || idx} src={card.image_public_url || card.image_path} alt={card.title} className={cls} />
                })
              ) : (
                <>
                  <ImageCard src="/images/student-certificate.jpg" alt="Prestasi Siswa" className="mt-12 transform translate-y-8" />
                  <ImageCard src="/images/dance-1.jpg" alt="Seni Tari" className="mb-8 transform -translate-y-4" />
                  <ImageCard src="/images/teachers.jpg" alt="Guru & Staff" className="transform translate-x-4" />
                  <ImageCard src="/images/kumpul.jpg" alt="Ekstrakurikuler" className="mt-8 transform -translate-x-4" />
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION Pendaftaran */}
      <Section bg="cream" id="pendaftaran">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Periode Pendaftaran</h2>
          <p className="text-primary-secondary">Jangan lewatkan kesempatan bergabung bersama kami.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {displayPhases.map((item, idx) => (
            <motion.div key={idx} whileHover={{ y: -5 }} className="bg-white rounded-2xl p-8 border border-primary-DEFAULT/5 shadow-sm text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <span className="inline-block px-3 py-1 bg-cream-100 text-gold-600 font-bold text-sm tracking-widest rounded-full mb-4">{item.label}</span>
              <h3 className="text-2xl md:text-3xl font-bold text-primary-DEFAULT">{item.start_date} – {item.end_date}</h3>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SECTION Persyaratan */}
      <Section id="syarat">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <motion.div {...fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-DEFAULT">Persyaratan Pendaftaran</h2>
              <p className="text-primary-secondary text-lg leading-relaxed mb-8">
                Pastikan dokumen lengkap untuk memperlancar administrasi.
              </p>
            </motion.div>
          </div>
          <div className="lg:col-span-7">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-100 border border-gray-100">
              <ul className="space-y-4">
                {requirementsData.map((req, idx) => (
                  <motion.li variants={itemAnim} key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cream-100 text-gold-600 font-bold flex items-center justify-center text-sm">{idx + 1}</span>
                    <span className="font-medium text-primary-DEFAULT text-lg">{req.title}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* SECTION Biaya */}
      <Section className="bg-gray-50" id="biaya">
        <motion.div {...fadeInUp} className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 text-center md:text-left">
          <div>
            <h2 className="text-3xl font-bold mb-3">Biaya Pendidikan</h2>
            <p className="text-primary-secondary">Transparan dan terjangkau.</p>
          </div>
          <div className="px-6 py-2 bg-cream-100 rounded-lg text-gold-600 font-bold tracking-wide">{data.pricing_badge || 'AKREDITASI B'}</div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -8 }} className="bg-white p-8 rounded-2xl border-2 border-gold-500 relative shadow-lg shadow-gold-100 flex flex-col items-center text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Best Value</div>
            <h3 className="text-gray-500 font-medium mb-4">{pricingData.pendaftaran_label}</h3>
            <p className="text-4xl font-bold text-primary-DEFAULT">{pricingData.pendaftaran_value}</p>
          </motion.div>
          <motion.div whileHover={{ y: -8 }} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
            <h3 className="text-gray-500 font-medium mb-4">{pricingData.seragam_label}</h3>
            <p className="text-4xl font-bold text-primary-DEFAULT">{pricingData.seragam_value}</p>
          </motion.div>
          <motion.div whileHover={{ y: -8 }} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
            <h3 className="text-gray-500 font-medium mb-4">{pricingData.spp_label}</h3>
            <p className="text-4xl font-bold text-primary-DEFAULT">{pricingData.spp_value}</p>
          </motion.div>
        </div>
      </Section>

      {/* SECTION Fasilitas */}
      <Section id="fasilitas">
        <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Fasilitas Sekolah</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {fasilitasData.map((item: any, idx: number) => {
            const IconComp = iconMap[item.icon || item.iconName] || CheckCircle2;
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} viewport={{ once: true }} className="flex gap-4 group">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-cream-50 text-gold-600 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-white transition-colors duration-300">
                  <IconComp size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary-DEFAULT mb-1">{item.title}</h3>
                  <p className="text-sm text-primary-secondary leading-relaxed">{item.description || item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* SECTION Beasiswa */}
      <Section bg="cream" id="beasiswa">
        <motion.div {...fadeInUp} className="mb-12 text-center md:text-left">
          <h2 className="text-3xl font-bold">Program Beasiswa</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          {beasiswaData.map((b: any, idx: number) => (
            <motion.div key={idx} whileHover={{ scale: 1.01 }} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white shadow-sm flex flex-col justify-center">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-primary-DEFAULT pr-4">{b.title}</h3>
                <CheckCircle2 className="text-gold-500 shrink-0" size={24} />
              </div>
              <p className="text-primary-secondary leading-relaxed">{b.description || b.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SECTION Testimoni */}
      {testimonials.length > 0 && (
        <Section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Kata Mereka</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((t: any, i: number) => (
              <div key={i} className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating || 5 }).map((_, rIdx) => <div key={rIdx} className="text-gold-400 text-sm">★</div>)}
                  </div>
                  <p className="text-primary-secondary italic mb-6">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-3">
                  {t.avatar_url ? (
                    <img src={t.avatar_url} className="w-10 h-10 rounded-full object-cover shadow-sm bg-gray-100" alt="Avatar" />
                  ) : (
                    <div className="w-10 h-10 bg-cream-50 text-gold-600 rounded-full flex items-center justify-center font-bold">{t.name.charAt(0)}</div>
                  )}
                  <div>
                    <p className="font-bold text-sm text-primary-DEFAULT">{t.name}</p>
                    <p className="text-xs text-primary-tertiary">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* SECTION Media (Gallery & Video) */}
      <Section bg="white" id="galeri">
        <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-primary-DEFAULT">Galeri & Aktivitas</h2>
          <p className="text-primary-secondary">Intip keseruan kegiatan dan fasilitas belajar di sekolah kami.</p>
        </motion.div>

        {gallery && gallery.length > 0 ? (
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-20">
            <GalleryCarousel items={gallery} />
          </motion.div>
        ) : (
          /* Placeholder Dummy Gallery jika kosong di CMS */
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-20">
            <GalleryCarousel items={[
              { image_url: '/images/kumpul.jpg', caption: 'Keseruan Ekstrakurikuler di Lapangan Utama' },
              { image_url: '/images/dance-1.jpg', caption: 'Pentas Seni & Tari Tradisional' },
              { image_url: '/images/teachers.jpg', caption: 'Guru & Staf Pengajar Profesional' }
            ]} />
          </motion.div>
        )}

        {/* Video YouTube Section */}
        <motion.div {...fadeInUp} className="text-center mt-24 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-bold tracking-widest uppercase mb-4">
            <Play size={16} fill="currentColor" /> Video Profil
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-primary-DEFAULT">Lihat Kami Lebih Dekat</h3>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <YoutubeEmbed url={data.youtube_video_url || 'https://www.youtube.com/watch?v=R9YgJ7UfJ3U'} />
        </motion.div>
      </Section>

      {/* SECTION Articles */}
      <div id="tentang">
        <ArticleSection />
      </div>

      {/* SECTION CTA & MAPS */}
      <section id="kontak" className={`${data.bottom_cta_bg_color || 'bg-cream-100'} pt-20 pb-10 relative overflow-hidden`}>
        <div className="max-w-6xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary-DEFAULT leading-tight">{data.bottom_cta_title || 'Siap Bergabung di SMA PLUS BINA TRAMPIL?'}</h2>
            <p className="text-primary-secondary text-lg mb-8">Pendaftaran cepat, mudah, dan transparan. Wujudkan impian masa depanmu bersama kami sekarang juga.</p>
            <Button size="lg" className="shadow-xl shadow-gold-500/20 w-full sm:w-auto" onClick={() => window.open(`https://wa.me/${data.bottom_cta_whatsapp || '6289506835889'}`, '_blank')}>
              {data.bottom_cta_button || 'Chat WhatsApp: Ibu Dwita'}
            </Button>
          </div>

          {/* MINI MAPS PREVIEW */}
          <div className="relative w-full aspect-video md:aspect-[4/3] bg-gray-200 rounded-3xl overflow-hidden shadow-2xl border-[6px] border-white group">
            {data.google_maps_embed ? (
              <div dangerouslySetInnerHTML={{ __html: data.google_maps_embed }} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" />
            ) : (
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521876402454!2d106.82496431525042!3d-6.194665495514808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4211111!2sSMA%20Bina%20Trampil!5e0!3m2!1sen!2sid!4v1650000000000!5m2!1sen!2sid" className="w-full h-full border-0" allowFullScreen loading="lazy"></iframe>
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
              <button onClick={() => window.open(data.google_maps_url || 'https://maps.google.com', '_blank')} className="pointer-events-auto bg-white hover:bg-gold-500 hover:text-white px-6 py-3 rounded-xl font-bold text-primary-DEFAULT flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                <MapPin size={18} /> Buka di Aplikasi Google Maps
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;