import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { BookOpen, Laptop, GraduationCap, ArrowLeft, MessageCircle, Sparkles } from 'lucide-react';

const WA_NUMBER = '6289506835889';

// Rotating subheadline words
const rotatingTexts = [
    'Sedang kami siapkan — segera hadir.',
    'Dalam tahap pengembangan aktif.',
    'Coming soon for students & teachers.',
];

const PortalELearningComingSoon: React.FC = () => {
    const [textIdx, setTextIdx] = useState(0);
    const [visible, setVisible] = useState(true);

    // Word loop animation
    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setTextIdx((prev) => (prev + 1) % rotatingTexts.length);
                setVisible(true);
            }, 500);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Mouse parallax for blobs (desktop only)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        mouseX.set((e.clientX - centerX) / centerX * 20);
        mouseY.set((e.clientY - centerY) / centerY * 20);
    };

    const features = [
        { icon: BookOpen, label: 'Materi & Tugas', desc: 'Akses materi pelajaran & kumpulkan tugas secara digital.' },
        { icon: Laptop, label: 'Absensi Online', desc: 'Sistem kehadiran modern langsung dari perangkat siswa.' },
        { icon: GraduationCap, label: 'Forum Diskusi', desc: 'Ruang tanya jawab interaktif antara siswa dan guru.' },
    ];

    return (
        <>
            <Helmet>
                <title>Portal E-Learning – Coming Soon | SMA Plus Bina Trampil</title>
                <meta name="description" content="Portal E-Learning SMA Plus Bina Trampil sedang dalam tahap pengembangan. Segera hadir untuk siswa dan guru." />
            </Helmet>

            <div
                className="min-h-screen w-full relative overflow-hidden flex flex-col"
                onMouseMove={handleMouseMove}
                style={{ background: 'linear-gradient(135deg, #fffdf7 0%, #fdf5e0 40%, #fffbf0 100%)' }}
            >
                {/* ─── Decorative grain overlay ─── */}
                <div
                    className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px',
                    }}
                />

                {/* ─── Glow blobs ─── */}
                <motion.div
                    className="pointer-events-none absolute rounded-full blur-[120px] opacity-30 z-0"
                    style={{
                        width: 600, height: 600, background: 'radial-gradient(circle, #f8d77c 0%, transparent 70%)',
                        top: '-120px', left: '50%', translateX: '-50%',
                        x: springX, y: springY,
                    }}
                    animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.35, 0.25] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="pointer-events-none absolute rounded-full blur-[100px] opacity-20 z-0"
                    style={{ width: 400, height: 400, background: 'radial-gradient(circle, #fde9a4 0%, transparent 70%)', bottom: '80px', right: '-60px' }}
                    animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.28, 0.18] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                />
                <motion.div
                    className="pointer-events-none absolute rounded-full blur-[80px] opacity-15 z-0"
                    style={{ width: 300, height: 300, background: 'radial-gradient(circle, #e8c97d 0%, transparent 70%)', bottom: '200px', left: '-40px' }}
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />

                {/* ─── Floating decorative icons ─── */}
                <motion.div
                    className="pointer-events-none absolute z-0 text-gold-400/20"
                    style={{ top: '15%', right: '8%' }}
                    animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <BookOpen size={64} strokeWidth={1} />
                </motion.div>
                <motion.div
                    className="pointer-events-none absolute z-0 text-gold-400/15"
                    style={{ bottom: '22%', left: '6%' }}
                    animate={{ y: [0, 12, 0], rotate: [0, -6, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                >
                    <GraduationCap size={80} strokeWidth={1} />
                </motion.div>
                <motion.div
                    className="pointer-events-none absolute z-0 text-gold-300/10"
                    style={{ top: '55%', right: '4%' }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                    <Laptop size={56} strokeWidth={1} />
                </motion.div>

                {/* ─── Nav strip ─── */}
                <div className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
                    <Link to="/" className="flex items-center gap-2 text-primary-DEFAULT/60 hover:text-gold-600 transition-colors text-sm font-semibold">
                        <ArrowLeft size={16} /> Kembali ke Beranda
                    </Link>
                    <span className="text-xs font-bold tracking-widest text-primary-DEFAULT/30 uppercase">SMA Plus Bina Trampil</span>
                </div>

                {/* ─── MAIN HERO ─── */}
                <main className="flex-1 flex flex-col items-center justify-center relative z-10 text-center px-5 py-16 md:py-24">

                    {/* Badge pill */}
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gold-200/60 shadow-sm mb-8 text-sm font-bold text-gold-600 tracking-wider"
                    >
                        <Sparkles size={14} className="text-gold-500" />
                        Segera Hadir
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-primary-DEFAULT leading-[1.05] tracking-tight mb-6 max-w-4xl"
                    >
                        Portal{' '}
                        <span
                            className="text-transparent bg-clip-text"
                            style={{ backgroundImage: 'linear-gradient(135deg, #C8A24A 0%, #f8d77c 50%, #A08035 100%)' }}
                        >
                            E-Learning
                        </span>
                    </motion.h1>

                    {/* Rotating subheadline */}
                    <div className="h-10 flex items-center justify-center mb-8">
                        <motion.p
                            key={textIdx}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -8 }}
                            transition={{ duration: 0.4 }}
                            className="text-lg md:text-xl text-primary-secondary font-medium max-w-xl"
                        >
                            {rotatingTexts[textIdx]}
                        </motion.p>
                    </div>

                    {/* Body copy */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-base text-primary-DEFAULT/60 max-w-md mx-auto leading-relaxed mb-10"
                    >
                        Fitur pembelajaran online untuk siswa & guru sedang dalam tahap pengembangan.
                        Pantau <em>update</em> melalui website ini atau hubungi kami.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.45 }}
                        className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16"
                    >
                        <Link
                            to="/"
                            aria-label="Kembali ke Beranda"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-gold-400/30"
                            style={{ background: 'linear-gradient(135deg, #C8A24A 0%, #A08035 100%)', boxShadow: '0 8px 30px rgba(200,162,74,0.30)' }}
                        >
                            <ArrowLeft size={18} /> Kembali ke Beranda
                        </Link>
                        <a
                            href={`https://wa.me/${WA_NUMBER}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Hubungi WhatsApp"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-primary-DEFAULT bg-white/80 backdrop-blur-sm border border-gold-200/60 text-base shadow-sm hover:shadow-md hover:scale-105 hover:border-gold-400 transition-all duration-200"
                        >
                            <MessageCircle size={18} className="text-green-500" /> Hubungi WhatsApp
                        </a>
                    </motion.div>

                    {/* Feature pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full"
                    >
                        {features.map((f, idx) => (
                            <motion.div
                                key={f.label}
                                whileHover={{ y: -4, scale: 1.02 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="bg-white/70 backdrop-blur-sm border border-gold-100/80 rounded-2xl px-6 py-5 text-center shadow-sm hover:shadow-md hover:border-gold-300 transition-all duration-200 flex flex-col items-center gap-2"
                            >
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-1"
                                    style={{ background: 'linear-gradient(135deg, #fdf5e0 0%, #fde9a4 100%)' }}
                                >
                                    <f.icon size={22} className="text-gold-600" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-bold text-primary-DEFAULT text-sm">{f.label}</h3>
                                <p className="text-xs text-primary-secondary leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </main>

                {/* ─── Footer strip ─── */}
                <div className="relative z-10 text-center pb-8 px-4">
                    <p className="text-sm text-primary-DEFAULT/40 font-medium">
                        Terima kasih sudah menunggu 🙌
                    </p>
                </div>
            </div>
        </>
    );
};

export default PortalELearningComingSoon;
