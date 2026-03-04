import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Tag, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '../src/supabase';

const fadeIn = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: 'easeOut' },
};

const categoryColor: Record<string, string> = {
    'Tips Akademik': 'bg-blue-50 text-blue-600 border-blue-100',
    'Pengembangan Diri': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Beasiswa: 'bg-amber-50 text-amber-600 border-amber-100',
};

const ArticleDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [related, setRelated] = useState<any[]>([]);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('slug', slug)
                    .eq('published', true)
                    .single();

                if (error) throw error;
                if (data) {
                    setArticle(data);

                    // Fetch related
                    const { data: relData } = await supabase
                        .from('articles')
                        .select('*')
                        .eq('published', true)
                        .neq('slug', slug)
                        .limit(2);
                    setRelated(relData || []);
                }
            } catch (err) {
                console.warn('Article not found', err);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-gold-500">
                <Loader2 size={40} className="animate-spin" />
            </div>
        );
    }

    if (!article) {
        return (
            <>
                <Helmet>
                    <title>Artikel Tidak Ditemukan – SMA Plus Bina Trampil</title>
                    <meta name="description" content="Halaman artikel yang Anda cari tidak ditemukan." />
                    <meta name="robots" content="noindex" />
                </Helmet>
                <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
                    <AlertTriangle size={56} className="text-amber-400 mb-6" />
                    <h1 className="text-3xl font-bold text-[#1a2340] mb-3">Artikel Tidak Ditemukan</h1>
                    <p className="text-gray-500 mb-8 max-w-md">
                        Artikel yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 bg-[#1a2340] text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-500 transition-colors"
                    >
                        <ArrowLeft size={16} /> Kembali ke Beranda
                    </button>
                </div>
            </>
        );
    }

    // Dynamic SEO
    const meta_title = article.seo_title || `${article.title} – SMA Plus Bina Trampil`;
    const meta_description = article.seo_description || article.excerpt || '';
    const meta_keywords = article.seo_keywords || 'sma plus bina trampil, artikel sekolah';
    const canonical_url = article.canonical_url || `https://smaplusbinatrampil.sch.id/artikel/${article.slug}`;

    return (
        <>
            <Helmet>
                <title>{meta_title}</title>
                <meta name="description" content={meta_description} />
                <meta name="keywords" content={meta_keywords} />
                <meta property="og:title" content={meta_title} />
                <meta property="og:description" content={meta_description} />

                <meta property="og:image" content={article.og_image || article.cover_image} />
                <meta property="og:type" content="article" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={meta_title} />
                <meta name="twitter:description" content={meta_description} />
                <meta name="twitter:image" content={article.og_image || article.cover_image} />
                <link rel="canonical" href={canonical_url} />
            </Helmet>

            <article className="bg-white min-h-screen">
                <div className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
                    {article.cover_image && (
                        <motion.img
                            src={article.cover_image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1.08 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a2340]/90 via-[#1a2340]/40 to-transparent" />
                    <div className="absolute top-8 left-6 md:left-10 z-10">
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                        >
                            <ArrowLeft size={15} /> Kembali
                        </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 md:px-16 z-10">
                        <div className="max-w-4xl mx-auto">
                            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-4 ${categoryColor[article.category] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                {article.category}
                            </span>
                            <motion.h1 {...fadeIn} className="text-2xl md:text-4xl font-bold text-white leading-snug">
                                {article.title}
                            </motion.h1>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 md:px-10 py-14">
                    <motion.div {...fadeIn} className="flex flex-wrap items-center gap-5 text-sm text-gray-400 mb-10 pb-8 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm shrink-0 uppercase">
                                {article.author_name?.charAt(0) || 'A'}
                            </div>
                            <div>
                                <p className="font-semibold text-[#1a2340] text-sm leading-tight">{article.author_name}</p>
                            </div>
                        </div>
                        <div className="w-px h-5 bg-gray-200 hidden sm:block" />
                        <span className="flex items-center gap-1.5"><Tag size={13} /> {new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><Clock size={13} /> {article.reading_time_minutes} min baca</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25, duration: 0.6 }}
                        className="prose prose-lg prose-slate max-w-none mx-auto"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mt-14 p-8 bg-gradient-to-r from-amber-50 to-cream-50 rounded-3xl border border-amber-100 text-center"
                    >
                        <p className="text-[#1a2340] font-bold text-lg mb-2">Tertarik bergabung di SMA Plus Bina Trampil?</p>
                        <p className="text-gray-500 text-sm mb-6">Hubungi kami sekarang dan dapatkan informasi SPMB 2026/2027 lengkap.</p>
                        <a
                            href="https://wa.me/6289506835889?text=Halo%2C%20saya%20ingin%20info%20SPMB%202026%2F2027%20SMA%20Plus%20Bina%20Trampil."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-full transition-colors shadow-lg shadow-amber-200"
                        >
                            💬 Chat WhatsApp Sekarang
                        </a>
                    </motion.div>
                </div>

                {related.length > 0 && (
                    <section className="bg-gray-50 py-16">
                        <div className="max-w-4xl mx-auto px-6 md:px-10">
                            <h2 className="text-2xl font-bold text-[#1a2340] mb-8">Artikel Terkait</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {related.map((rel: any) => (
                                    <Link key={rel.id} to={`/artikel/${rel.slug}`} className="group flex gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-250">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                                            {rel.cover_image && <img src={rel.cover_image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                                        </div>
                                        <div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryColor[rel.category] ?? 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                                {rel.category}
                                            </span>
                                            <h3 className="mt-2 font-bold text-[#1a2340] text-sm leading-snug group-hover:text-amber-500 transition-colors line-clamp-2">{rel.title}</h3>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(rel.published_at || rel.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </article>
        </>
    );
};

export default ArticleDetail;
