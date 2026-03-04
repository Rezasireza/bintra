import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { supabase } from '../src/supabase';

// ─── Animation Variants ─────────────────────────────────────────────────────

const sectionFadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, ease: 'easeOut' },
};

const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.15, ease: 'easeOut' },
    }),
};

// ─── Category Badge Colors ───────────────────────────────────────────────────

const categoryColor: Record<string, string> = {
    'Tips Akademik': 'bg-blue-50 text-blue-600 border-blue-100',
    'Pengembangan Diri': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Beasiswa: 'bg-amber-50 text-amber-600 border-amber-100',
};

// ─── ArticleSection ──────────────────────────────────────────────────────────

const ArticleSection: React.FC = () => {
    const [latestArticles, setLatestArticles] = useState<any[]>([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const { data } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('published', true)
                    .order('published_at', { ascending: false, nullsFirst: false })
                    .limit(3);
                if (data) setLatestArticles(data);
            } catch (err) {
                console.warn(err);
            }
        };
        fetchArticles();
    }, []);

    if (latestArticles.length === 0) return null;

    return (
        <section className="py-24 bg-white" id="artikel">
            <div className="max-w-[1200px] mx-auto px-6">

                {/* Section Header */}
                <motion.div
                    {...sectionFadeUp}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
                >
                    <div>
                        <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-500 mb-3">
                            Berita &amp; Blog
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#1a2340] leading-tight">
                            Artikel &amp; Informasi
                            <br className="hidden md:block" />
                            <span className="text-amber-500"> Terkini</span>
                        </h2>
                        <p className="mt-4 text-gray-500 text-lg max-w-xl leading-relaxed">
                            Tips akademik, kegiatan sekolah, dan informasi beasiswa yang kami
                            hadirkan untuk mendukung perjalanan belajar Anda.
                        </p>
                    </div>

                    {/* "Lihat Semua" link */}
                    <Link
                        to="/artikel"
                        className="group inline-flex items-center gap-2 text-[#1a2340] font-semibold hover:text-amber-500 transition-colors shrink-0"
                    >
                        Lihat Semua Artikel
                        <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform duration-200"
                        />
                    </Link>
                </motion.div>

                {/* Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestArticles.map((article, i) => (
                        <motion.article
                            key={article.id}
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            whileHover={{ y: -6, transition: { duration: 0.25 } }}
                            className="group bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)] border border-gray-100 hover:shadow-[0_12px_40px_rgba(0,0,0,0.13)] transition-shadow duration-300 flex flex-col"
                        >
                            {/* Image */}
                            <div className="relative overflow-hidden h-52 bg-gray-100">
                                {article.cover_image && (
                                    <motion.img
                                        src={article.cover_image}
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                        whileHover={{ scale: 1.06 }}
                                        transition={{ duration: 0.45, ease: 'easeOut' }}
                                    />
                                )}
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                                {/* Category Badge */}
                                <span
                                    className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full border ${categoryColor[article.category] ??
                                        'bg-gray-50 text-gray-600 border-gray-200'
                                        }`}
                                >
                                    {article.category}
                                </span>
                            </div>

                            {/* Body */}
                            <div className="flex flex-col flex-1 p-7">
                                {/* Meta: date + read time */}
                                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                                    <span className="flex items-center gap-1.5">
                                        <Tag size={12} />
                                        {new Date(article.published_at || article.created_at).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={12} />
                                        {article.reading_time_minutes} menit baca
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-[#1a2340] leading-snug mb-3 group-hover:text-amber-500 transition-colors duration-200 line-clamp-2">
                                    {article.title}
                                </h3>

                                {/* Excerpt */}
                                <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">
                                    {article.excerpt}
                                </p>

                                {/* Author row + CTA */}
                                <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold shrink-0 uppercase">
                                            {article.author_name?.charAt(0) || 'A'}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-[#1a2340] leading-tight">
                                                {article.author_name}
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/artikel/${article.slug}`}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors group/btn"
                                        aria-label={`Baca artikel: ${article.title}`}
                                    >
                                        Baca
                                        <ArrowRight
                                            size={13}
                                            className="group-hover/btn:translate-x-0.5 transition-transform"
                                        />
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ArticleSection;
