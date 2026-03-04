import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../src/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { processAndCropImage } from '../../src/utils/imageUtils';
import { SystemNotice, NoticeVariant } from '../../components/ui/SystemNotice';

export const ArticleEdit = () => {
    const { id } = useParams();
    const isNew = !id;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '', slug: '', excerpt: '', content: '',
        category: 'Umum', author_name: 'Admin',
        reading_time_minutes: 3, published: false,
        cover_image: '', seo_title: '', seo_description: '',
        seo_keywords: '', og_image: '', canonical_url: ''
    });

    const [notice, setNotice] = useState<{ open: boolean, variant: NoticeVariant, title: string, message: string }>({ open: false, variant: 'info', title: '', message: '' });

    const showNotice = (variant: NoticeVariant, title: string, message: string) => {
        setNotice({ open: true, variant, title, message });
    };

    useEffect(() => {
        if (!isNew) {
            fetchArticle();
        }
    }, [id]);

    const fetchArticle = async () => {
        try {
            const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
            if (error) throw error;
            if (data) setFormData(data);
        } catch (err: any) {
            showNotice('danger', 'Gagal', 'Gagal memuat artikel: ' + err.message);
            setTimeout(() => navigate('/admin/articles'), 1500);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'title' && isNew && !formData.slug) {
            setFormData(prev => ({
                ...prev,
                title: value,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'cover_image' | 'og_image', ratio: string) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setSaving(true);
        try {
            const file = e.target.files[0];
            const cropped = await processAndCropImage(file, ratio);

            const fileName = `article-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}.webp`;
            const { data, error } = await supabase.storage
                .from('articles')
                .upload(fileName, cropped, { upsert: true, contentType: 'image/webp' });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage.from('articles').getPublicUrl(fileName);
            setFormData(prev => ({ ...prev, [fieldName]: publicUrl }));
            showNotice('success', 'Berhasil', 'Gambar berhasil diunggah');
        } catch (error: any) {
            showNotice('danger', 'Gagal', 'Unggah gagal: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // prepare payload
            const payload = { ...formData };
            if (payload.published && !payload.published_at) {
                (payload as any).published_at = new Date().toISOString();
            }

            if (isNew) {
                const { error } = await supabase.from('articles').insert([payload]);
                if (error) throw error;
                showNotice('success', 'Berhasil', 'Artikel berhasil dibuat');
                setTimeout(() => navigate('/admin/articles'), 1000);
            } else {
                const { error } = await supabase.from('articles').update(payload).eq('id', id);
                if (error) throw error;
                showNotice('success', 'Berhasil', 'Artikel berhasil diperbarui');
                setTimeout(() => navigate('/admin/articles'), 1000);
            }
        } catch (err: any) {
            showNotice('danger', 'Gagal', 'Simpan gagal: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-gold-500" size={32} /></div>;

    return (
        <form onSubmit={handleSave} className="space-y-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button type="button" onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'Create Article' : 'Edit Article'}</h1>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-bold shadow-md shadow-gold-500/20 disabled:opacity-50"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? 'Saving...' : 'Save Article'}
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-5">
                        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Basic Info</h2>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (URL)</label>
                            <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" />
                            <p className="text-xs text-gray-500 mt-1">Unique identifier for url (e.g. why-choose-bina-trampil)</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt</label>
                            <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Content (Markdown / HTML ok)</label>
                            <textarea required name="content" value={formData.content} onChange={handleChange} rows={15} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 outline-none font-mono text-sm" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-5">
                        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">SEO Meta</h2>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">SEO Title</label>
                            <input type="text" name="seo_title" value={formData.seo_title} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 outline-none" placeholder="Optimized title (50-60 chars)" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">SEO Description</label>
                            <textarea name="seo_description" value={formData.seo_description} onChange={handleChange} rows={2} className="w-full p-2.5 rounded-lg border border-gray-300 outline-none" placeholder="140-160 chars" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">SEO Keywords</label>
                            <input type="text" name="seo_keywords" value={formData.seo_keywords} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 outline-none" placeholder="sekolah, terbaik, bandung" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Canonical URL</label>
                            <input type="text" name="canonical_url" value={formData.canonical_url} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">OG Image (1200x630, optional)</label>
                            <div className="flex gap-4 items-center">
                                {formData.og_image && <img src={formData.og_image} alt="OG" className="h-16 w-32 object-cover rounded shadow" />}
                                <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-medium flex gap-2">
                                    <ImageIcon size={16} /> Upload OG Image
                                    <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={e => handleUpload(e, 'og_image', '1200:630')} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-5">
                        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Publishing</h2>

                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="published" name="published" checked={formData.published} onChange={handleChange} className="w-5 h-5 text-gold-500 rounded focus:ring-gold-500" />
                            <label htmlFor="published" className="text-sm font-bold text-gray-900 cursor-pointer">Published to Public</label>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                            <input required type="text" name="category" value={formData.category} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Author Name</label>
                            <input required type="text" name="author_name" value={formData.author_name} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Reading Time (mins)</label>
                            <input required type="number" name="reading_time_minutes" value={formData.reading_time_minutes} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 outline-none" min={1} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-5">
                        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Cover Image</h2>

                        {formData.cover_image && (
                            <img src={formData.cover_image} alt="Cover" className="w-full aspect-video object-cover rounded-xl border border-gray-200 mb-4" />
                        )}
                        <label className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 bg-cream-50 hover:bg-cream-100 border border-gold-200 text-gold-600 rounded-xl font-medium transition-colors">
                            <ImageIcon size={18} /> {formData.cover_image ? 'Replace Image' : 'Upload Cover (16:9)'}
                            <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={e => handleUpload(e, 'cover_image', '16:9')} />
                        </label>
                        <p className="text-xs text-center text-gray-500">Auto-crops to 16:9</p>
                    </div>
                </div>
            </div>

            <SystemNotice
                open={notice.open}
                variant={notice.variant}
                title={notice.title}
                message={notice.message}
                onClose={() => setNotice(prev => ({ ...prev, open: false }))}
                autoCloseMs={3000}
            />
        </form>
    );
};
