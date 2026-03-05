import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Section from '../components/ui/Section';
import { useLandingData } from '../src/hooks/useLandingData';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemAnim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const InformasiPPDB: React.FC = () => {
    const { phases, requirements, pricing, loading, settings } = useLandingData();

    if (loading) {
        return <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">Memuat data...</div>;
    }

    const displayPhases = phases.length > 0 ? phases : [
        { label: 'FASE 1', start_date: '23 Mar', end_date: '22 Apr 2026' },
        { label: 'FASE 2', start_date: '25 Mei', end_date: '17 Jun 2026' }
    ];

    const requirementsData = requirements.length > 0 ? requirements : [
        { title: "Formulir Pendaftaran" }, { title: "Fotocopy Surat Kelulusan" },
        { title: "Fotocopy IJAZAH" }, { title: "Fotocopy Akte Kelahiran" },
        { title: "Fotocopy Kartu Keluarga" }, { title: "Fotocopy KTP Orang Tua" },
        { title: "Foto 3x4 (4 lembar)" }
    ];

    const pricingData = pricing.length > 0 ? pricing[0] : {
        pendaftaran_label: 'Uang Pendaftaran', pendaftaran_value: 'Gratis',
        seragam_label: 'Seragam', seragam_value: 'Rp 550.000',
        spp_label: 'SPP Bulanan', spp_value: 'Rp 70.000'
    };

    return (
        <>
            <Helmet>
                <title>Informasi PPDB | SMA Plus Bina Trampil</title>
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
                            <span className="text-primary-DEFAULT text-sm font-semibold tracking-widest uppercase">Penerimaan Siswa Baru</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, letterSpacing: "0.02em" }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary-DEFAULT mb-6 leading-tight max-w-4xl"
                        >
                            Informasi <span className="text-gold-500">PPDB</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                            className="text-xl md:text-2xl text-primary-secondary max-w-2xl font-light leading-relaxed"
                        >
                            Pendaftaran mudah dan terjangkau untuk masa depan yang lebih baik. <br className="hidden sm:block" />
                            <span className="font-semibold text-primary-DEFAULT">Mari bergabung bersama kami.</span>
                        </motion.p>
                    </div>
                </div>

                {/* SECTION Pendaftaran */}
                <Section bg="white" id="pendaftaran">
                    <motion.div {...fadeInUp} className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Periode Pendaftaran</h2>
                        <p className="text-primary-secondary">Jangan lewatkan kesempatan bergabung bersama kami.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {displayPhases.map((item, idx) => (
                            <motion.div key={idx} whileHover={{ y: -5 }} className="bg-white rounded-2xl p-8 border border-primary-DEFAULT/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                                <span className="inline-block px-3 py-1 bg-cream-100 text-gold-600 font-bold text-sm tracking-widest rounded-full mb-4">{item.label}</span>
                                <h3 className="text-2xl md:text-3xl font-bold text-primary-DEFAULT">{item.start_date} – {item.end_date}</h3>
                            </motion.div>
                        ))}
                    </div>
                </Section>

                {/* SECTION Persyaratan */}
                <Section bg="cream" id="syarat">
                    <div className="grid lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
                        <div className="lg:col-span-5">
                            <motion.div {...fadeInUp}>
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-DEFAULT">Persyaratan Pendaftaran</h2>
                                <p className="text-primary-secondary text-lg leading-relaxed mb-8">
                                    Pastikan dokumen lengkap untuk memperlancar administrasi.
                                </p>
                            </motion.div>
                        </div>
                        <div className="lg:col-span-7">
                            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                                <ul className="space-y-4">
                                    {requirementsData.map((req, idx) => (
                                        <motion.li variants={itemAnim} key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-100 text-gold-600 font-bold flex items-center justify-center text-sm">{idx + 1}</span>
                                            <span className="font-medium text-primary-DEFAULT text-lg">{req.title}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </Section>

                {/* SECTION Biaya */}
                <Section className="bg-white" id="biaya">
                    <div className="max-w-6xl mx-auto">
                        <motion.div {...fadeInUp} className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 text-center md:text-left">
                            <div>
                                <h2 className="text-3xl font-bold mb-3">Biaya Pendidikan</h2>
                                <p className="text-primary-secondary">Transparan dan terjangkau.</p>
                            </div>
                            <div className="px-6 py-2 bg-cream-100 rounded-lg text-gold-600 font-bold tracking-wide">{settings.pricing_badge || 'AKREDITASI B'}</div>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <motion.div whileHover={{ y: -8 }} className="bg-white p-8 rounded-2xl border-2 border-gold-500 relative shadow-lg shadow-gold-100 flex flex-col items-center text-center">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Best Value</div>
                                <h3 className="text-gray-500 font-medium mb-4">{pricingData.pendaftaran_label}</h3>
                                <p className="text-4xl font-bold text-primary-DEFAULT">{pricingData.pendaftaran_value}</p>
                            </motion.div>
                            <motion.div whileHover={{ y: -8 }} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center">
                                <h3 className="text-gray-500 font-medium mb-4">{pricingData.seragam_label}</h3>
                                <p className="text-4xl font-bold text-primary-DEFAULT">{pricingData.seragam_value}</p>
                            </motion.div>
                            <motion.div whileHover={{ y: -8 }} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center">
                                <h3 className="text-gray-500 font-medium mb-4">{pricingData.spp_label}</h3>
                                <p className="text-4xl font-bold text-primary-DEFAULT">{pricingData.spp_value}</p>
                            </motion.div>
                        </div>
                    </div>
                </Section>

            </div>
        </>
    );
};

export default InformasiPPDB;
