import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import { MapPin, Phone, User, Send, CheckCircle2, Loader2 } from 'lucide-react';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" }
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HubungiKami: React.FC = () => {
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [pesan, setPesan] = useState('');
    const [touched, setTouched] = useState({ nama: false, email: false, pesan: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const emailValid = emailRegex.test(email);
    const isFormValid = nama.trim() !== '' && emailValid && pesan.trim() !== '';

    const errors = {
        nama: touched.nama && nama.trim() === '' ? 'Nama lengkap wajib diisi' : '',
        email: touched.email && email.trim() === ''
            ? 'Email wajib diisi'
            : touched.email && !emailValid
                ? 'Format email tidak valid'
                : '',
        pesan: touched.pesan && pesan.trim() === '' ? 'Pesan wajib diisi' : '',
    };

    const handleBlur = (field: 'nama' | 'email' | 'pesan') => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ nama: true, email: true, pesan: true });
        if (!isFormValid) return;

        setIsSubmitting(true);
        // Simulate sending (replace with actual API call if needed)
        await new Promise((res) => setTimeout(res, 1800));
        setIsSubmitting(false);
        setIsSuccess(true);
        setNama(''); setEmail(''); setPesan('');
        setTouched({ nama: false, email: false, pesan: false });
    };

    const InputError = ({ msg }: { msg: string }) => (
        <AnimatePresence>
            {msg && (
                <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-red-500 text-xs mt-1.5 font-medium"
                >
                    {msg}
                </motion.p>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <Helmet>
                <title>Hubungi Kami | SMA Plus Bina Trampil</title>
            </Helmet>

            <div className="pt-20">
                {/* Hero Header */}
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
                            <span className="text-primary-DEFAULT text-sm font-semibold tracking-widest uppercase">Pusat Bantuan</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, letterSpacing: "0.02em" }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary-DEFAULT mb-6 leading-tight max-w-4xl"
                        >
                            Hubungi <span className="text-gold-500">Kami</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                            className="text-xl md:text-2xl text-primary-secondary max-w-2xl font-light leading-relaxed"
                        >
                            Informasi Pendaftaran dan Layanan Sekolah <br className="hidden sm:block" />
                            <span className="font-semibold text-primary-DEFAULT">Tim SMA Bina Trampil siap membantu Anda.</span>
                        </motion.p>
                    </div>
                </div>

                {/* SECTION Kontak */}
                <Section bg="cream" id="kontak-info">
                    <motion.div {...fadeInUp} className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-primary-DEFAULT mb-4">Layanan Cepat</h2>
                        <p className="text-lg text-primary-secondary">Kirim pesan WhatsApp atau kunjungi lokasi kami.</p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">

                        {/* Info Side */}
                        <motion.div {...fadeInUp} className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col gap-8">
                            <h2 className="text-2xl font-bold text-primary-DEFAULT">Informasi Kontak</h2>

                            <div className="flex items-start gap-4 p-5 bg-cream-50 rounded-2xl hover:bg-cream-100 transition-colors">
                                <Phone className="w-6 h-6 text-gold-500 mt-1 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-primary-DEFAULT mb-1">WhatsApp Pendaftaran</h3>
                                    <p className="text-primary-secondary text-lg font-medium">+62 895-0683-5889</p>
                                    <Button size="sm" className="mt-4 shadow-md shadow-gold-500/20" onClick={() => window.open('https://wa.me/6289506835889', '_blank')}>
                                        Chat Sekarang
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                <User className="w-6 h-6 text-gold-500 mt-1 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-primary-DEFAULT mb-1">Contact Person</h3>
                                    <p className="text-primary-secondary">Ibu Dwita Anggareni</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                <MapPin className="w-6 h-6 text-gold-500 mt-1 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-primary-DEFAULT mb-1">Alamat Sekolah</h3>
                                    <p className="text-primary-secondary leading-relaxed">Kp. Lame RT 02/04 Desa Sukasari, Kecamatan Rumpin, Kabupaten Bogor</p>
                                    <button className="text-gold-600 font-bold text-sm mt-3 hover:underline flex items-center gap-1" onClick={() => window.open('https://maps.google.com/?q=SMA+PLUS+BINA+TRAMPIL+Rumpin+Bogor', '_blank')}>
                                        Buka Panduan Maps &rarr;
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Form Side */}
                        <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-gray-100">
                            <h2 className="text-2xl font-bold text-primary-DEFAULT mb-6 text-center">Tinggalkan Pesan</h2>

                            {/* Success banner */}
                            <AnimatePresence>
                                {isSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-3 p-4 mb-6 bg-green-50 border border-green-200 rounded-xl"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                        <p className="text-green-700 font-semibold text-sm">Pesan berhasil dikirim. Kami akan segera menghubungi Anda!</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Nama */}
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-primary-DEFAULT">
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={nama}
                                            onChange={(e) => setNama(e.target.value)}
                                            onBlur={() => handleBlur('nama')}
                                            className={`w-full px-5 py-3.5 bg-gray-50/50 rounded-xl border transition-all outline-none
                                                ${errors.nama ? 'border-red-400 focus:ring-1 focus:ring-red-300' : 'border-gray-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-200'}`}
                                            placeholder="Nama Anda"
                                        />
                                        <InputError msg={errors.nama} />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-primary-DEFAULT">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onBlur={() => handleBlur('email')}
                                            className={`w-full px-5 py-3.5 bg-gray-50/50 rounded-xl border transition-all outline-none
                                                ${errors.email ? 'border-red-400 focus:ring-1 focus:ring-red-300' : 'border-gray-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-200'}`}
                                            placeholder="email@anda.com"
                                        />
                                        <InputError msg={errors.email} />
                                    </div>
                                </div>

                                {/* Pesan */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-primary-DEFAULT">
                                        Pesan / Pertanyaan <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows={6}
                                        value={pesan}
                                        onChange={(e) => setPesan(e.target.value)}
                                        onBlur={() => handleBlur('pesan')}
                                        className={`w-full px-5 py-3.5 bg-gray-50/50 rounded-xl border transition-all outline-none resize-none
                                            ${errors.pesan ? 'border-red-400 focus:ring-1 focus:ring-red-300' : 'border-gray-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-200'}`}
                                        placeholder="Tuliskan masalah atau pertanyaan yang ingin disampaikan..."
                                    />
                                    <InputError msg={errors.pesan} />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !isFormValid}
                                    className={`w-full flex items-center justify-center gap-2 h-14 text-base font-semibold rounded-xl shadow-lg transition-all duration-200
                                        ${isFormValid && !isSubmitting
                                            ? 'bg-gold-500 hover:bg-gold-600 text-white shadow-gold-500/20 cursor-pointer'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60 shadow-none'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <><Loader2 size={18} className="animate-spin" /> Mengirim...</>
                                    ) : (
                                        <><Send size={18} /> Kirim Pesan Sekarang</>
                                    )}
                                </button>

                                <p className="text-center text-xs text-gray-400">
                                    Field bertanda <span className="text-red-500 font-bold">*</span> wajib diisi
                                </p>
                            </form>
                        </motion.div>

                    </div>
                </Section>
            </div>
        </>
    );
};

export default HubungiKami;
