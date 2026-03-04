import React, { useState, useEffect } from 'react';
import Section from '../components/ui/Section';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

const DUMMY_SLIDES = [
  {
    id: 1,
    image: '/images/kumpul.jpg',
    title: 'Keseruan Ekstrakurikuler',
    desc: 'Wadah bagi siswa untuk mengembangkan bakat dan minat mereka di luar jam pelajaran kelas.'
  },
  {
    id: 2,
    image: '/images/dance-1.jpg',
    title: 'Seni Tari Tradisional',
    desc: 'Melestarikan budaya bangsa melalui ekstrakurikuler seni tari yang aktif tampil di berbagai acara.'
  },
  {
    id: 3,
    image: '/images/teachers.jpg',
    title: 'Pengajar Profesional',
    desc: 'Didukung oleh jajaran guru yang berkompeten, ramah, dan berdedikasi tinggi terhadap pendidikan.'
  },
  {
    id: 4,
    image: '/images/student-certificate.jpg',
    title: 'Siswa Berprestasi',
    desc: 'Mencetak generasi unggul yang siap bersaing dalam berbagai ajang kompetisi akademik maupun non-akademik.'
  }
];

const PhotoSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DUMMY_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % DUMMY_SLIDES.length);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + DUMMY_SLIDES.length) % DUMMY_SLIDES.length);
  };

  return (
    <div className="bg-white rounded-3xl p-4 shadow-xl border border-gray-100">
      <div
        className="relative aspect-video sm:aspect-[21/9] bg-gray-900 rounded-2xl overflow-hidden group"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={DUMMY_SLIDES[currentIndex].image}
            alt={DUMMY_SLIDES[currentIndex].title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent pointer-events-none flex flex-col justify-end p-6 md:p-10 z-10">
          <motion.div
            key={`text-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-3 py-1 bg-gold-500 text-white text-xs font-bold tracking-wider rounded-full mb-3 shadow-lg">
              GALERI SEKOLAH
            </span>
            <h3 className="text-white text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
              {DUMMY_SLIDES[currentIndex].title}
            </h3>
            <p className="text-gray-200 text-sm md:text-base max-w-2xl text-shadow">
              {DUMMY_SLIDES[currentIndex].desc}
            </p>
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-gold-500 text-white backdrop-blur-md rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 shadow-lg border border-white/20 hover:border-gold-500"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-gold-500 text-white backdrop-blur-md rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 shadow-lg border border-white/20 hover:border-gold-500"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 right-6 flex gap-2 z-20">
          {DUMMY_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIsPlaying(false); setCurrentIndex(i); }}
              className={`h-2 rounded-full transition-all duration-300 ease-out ${i === currentIndex ? 'bg-gold-500 w-8 shadow-md' : 'bg-white/40 w-2 hover:bg-white'} `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const About: React.FC = () => {
  return (
    <div className="pt-20">
      <div className="relative overflow-hidden bg-gradient-to-b from-white to-[#fdf7e8] border-b border-gray-100">
        {/* Background Visual Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"]
            }}
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
            <span className="text-primary-DEFAULT text-sm font-semibold tracking-widest uppercase">Tentang Kami</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.02em" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary-DEFAULT mb-6 leading-tight max-w-4xl"
          >
            SMA PLUS <span className="text-gold-500">BINA TRAMPIL</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-primary-secondary max-w-2xl font-light leading-relaxed"
          >
            Pendidikan Berkualitas di Bawah Naungan <br className="hidden sm:block" />
            <span className="font-semibold text-primary-DEFAULT">Yayasan Bina Trampil</span>
          </motion.p>
        </div>
      </div>

      <Section>
        <div className="max-w-5xl mx-auto space-y-24">

          {/* Profil Singkat */}
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="lg:col-span-4 space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-DEFAULT relative">
                Profil Singkat
                <span className="block w-16 h-1.5 bg-gold-500 rounded-full mt-4"></span>
              </h2>
            </motion.div>
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border-l-4 border-l-gold-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300"
              >
                <p className="text-lg text-primary-secondary leading-relaxed mb-6">
                  SMA Plus Bina Trampil adalah lembaga pendidikan menengah atas yang berkomitmen untuk mencetak generasi muda yang tidak hanya unggul secara akademis, tetapi juga memiliki keterampilan praktis yang relevan dengan kebutuhan dunia kerja dan industri.
                </p>
                <p className="text-lg text-primary-secondary leading-relaxed">
                  Berdiri di bawah Yayasan Bina Trampil, kami percaya bahwa pendidikan adalah jembatan menuju masa depan. Oleh karena itu, program kami dirancang khusus dengan memastikan setiap lulusan memiliki opsi karir yang menjanjikan.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Nilai & Budaya */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-primary-DEFAULT mb-4">Nilai & Budaya Sekolah</h2>
              <p className="text-primary-secondary text-lg">Prinsip dasar yang membentuk karakter peserta didik kami.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Disiplin', desc: 'Fondasi utama kemandirian siswa.', icon: '🏆' },
                { title: 'Keterampilan', desc: 'Sikap proaktif dalam dunia kerja.', icon: '💼' },
                { title: 'Akhlak Mulia', desc: 'Adab di atas ilmu pengetahuan.', icon: '🤲' },
                { title: 'Prestasi', desc: 'Mengejar keunggulan di segala bidang.', icon: '🌟' }
              ].map((val, idx) => (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                  whileHover={{ scale: 1.04 }}
                  className="bg-white p-8 rounded-xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgb(0,0,0,0.08)] text-center group cursor-default relative overflow-hidden flex flex-col items-center transition-all duration-300"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.15, y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="text-4xl mb-5"
                  >
                    {val.icon}
                  </motion.div>
                  <h3 className="font-bold text-primary-DEFAULT text-xl mb-2">{val.title}</h3>
                  <p className="text-sm text-primary-secondary">{val.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Komitmen Digital */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-gradient-to-b from-[#fdf7e8] to-[#fffaf1] p-10 md:p-14 rounded-[2.5rem] text-center space-y-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 border border-gold-200/40 rounded-[2.5rem] pointer-events-none z-10"></div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/60 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary-DEFAULT relative z-10">Komitmen Pembelajaran Digital</h2>
            <p className="text-lg md:text-xl text-primary-secondary max-w-3xl mx-auto leading-relaxed relative z-10">
              Kami terus berinovasi mengejar perkembangan zaman secara teknologi. Penggunaan{' '}
              <span
                className="inline-block font-semibold text-gold-600 bg-white px-3 py-1 rounded shadow-[0_2px_10px_rgb(200,162,74,0.15)] border border-gold-100 mx-1"
              >
                Smart TV Modern
              </span>
              {' '}di setiap ruang kelas, fasilitas{' '}
              <span
                className="inline-block font-semibold text-gold-600 bg-white px-3 py-1 rounded shadow-[0_2px_10px_rgb(200,162,74,0.15)] border border-gold-100 mx-1"
              >
                Laboratorium Komputer
              </span>
              , serta sistem absensi interaktif menjadikan kami yang terdepan.
            </p>
          </motion.div>

          {/* Dynamic Gallery Slider */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-10 pb-10"
          >
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-primary-DEFAULT mb-4">Galeri Dokumentasi</h2>
              <p className="text-primary-secondary text-lg">Momen berharga dan fasilitas yang mendukung kreativitas anak didik.</p>
            </div>
            <PhotoSlider />
          </motion.div>

        </div>
      </Section>
    </div>
  );
};

export default About;