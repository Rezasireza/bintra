import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2 } from 'lucide-react';
import Section from '../components/ui/Section';
import { useLandingData } from '../src/hooks/useLandingData';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" }
};

const Beasiswa: React.FC = () => {
    const { scholarships, loading } = useLandingData();

    if (loading) {
        return <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">Memuat data...</div>;
    }

    const beasiswaData = scholarships.length > 0 ? scholarships : [
        { title: "Beasiswa Prestasi Akademik", description: "Bebas SPP 6 bulan untuk peringkat 1-3 paralel dari sekolah asal." },
        { title: "Beasiswa Tahfidz Quran", description: "Potongan 50% biaya pendaftaran untuk hafizh minimal 3 Juz." },
        { title: "Bantuan Pendidikan", description: "Keringanan biaya untuk siswa kurang mampu (sesuai S&K berlaku)." }
    ];

    return (
        <>
            <Helmet>
                <title>Program Beasiswa | SMA Plus Bina Trampil</title>
            </Helmet>

            <div className="pt-20">
                <div className="relative overflow-hidden bg-gradient-to-b from-white to-[#fdf7e8] border-b border-gray-100">
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        <motion.div
                            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                            transition={{ duration: 60, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                            className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"
                        />
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-400/10 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
                    </div>

                    <div className="max-w-[1200px] mx-auto px-6 pt-32 pb-24 relative z-10 text-center flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/60 backdrop-blur-md border border-gold-400/20 mb-8 shadow-sm"
                        >
                            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
                            <span className="text-primary-DEFAULT text-sm font-semibold tracking-widest uppercase">Pendidikan Terjangkau</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, letterSpacing: "0.02em" }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary-DEFAULT mb-6 leading-tight max-w-4xl"
                        >
                            Program <span className="text-gold-500">Beasiswa</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                            className="text-xl md:text-2xl text-primary-secondary max-w-2xl font-light leading-relaxed"
                        >
                            Kesempatan Emas untuk Siswa Berprestasi. <br className="hidden sm:block" />
                            <span className="font-semibold text-primary-DEFAULT">Tanpa Kendala Biaya.</span>
                        </motion.p>
                    </div>
                </div>

                {/* SECTION Beasiswa */}
                <Section bg="white" id="beasiswa">
                    <div className="max-w-4xl mx-auto">
                        <motion.div {...fadeInUp} className="mb-12 text-center">
                            <h2 className="text-3xl font-bold">Daftar Beasiswa & Bantuan</h2>
                            <p className="text-lg text-primary-secondary mt-2">Dukungan finansial dari Yayasan Bina Trampil</p>
                        </motion.div>

                        <div className="grid sm:grid-cols-2 gap-8">
                            {beasiswaData.map((b: any, idx: number) => (
                                <motion.div key={idx} whileHover={{ y: -5 }} className="bg-cream-50 p-8 rounded-2xl border border-cream-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-start relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl group-hover:bg-gold-100 transition-colors opacity-60"></div>
                                    <div className="flex items-start justify-between mb-4 relative z-10">
                                        <h3 className="text-xl font-bold text-primary-DEFAULT pr-4">{b.title}</h3>
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-gold-500">
                                            <CheckCircle2 size={24} />
                                        </div>
                                    </div>
                                    <p className="text-primary-secondary leading-relaxed relative z-10">{b.description || b.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div {...fadeInUp} className="mt-16 p-8 bg-blue-50/50 rounded-2xl border border-blue-100 text-center custom-shadow">
                            <h3 className="text-lg font-bold text-blue-900 mb-2">Informasi Penting</h3>
                            <p className="text-blue-800 text-sm max-w-2xl mx-auto leading-relaxed">
                                Keputusan pemberian beasiswa sepenuhnya hak mutlak pengurus Yayasan Bina Trampil dan Panitia SPMB.
                                Syarat pendukung seperti KIP, Surat Keterangan Tidak Mampu (SKTM) harus diserahkan secara utuh.
                            </p>
                        </motion.div>

                    </div>
                </Section>
            </div>
        </>
    );
};

export default Beasiswa;
