import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/supabase';
import { Save, Loader2, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { processAndCropImage } from '../../src/utils/imageUtils';
import { ConfirmDeleteModal } from '../../components/ui/ConfirmDeleteModal';
import { SystemNotice, NoticeVariant } from '../../components/ui/SystemNotice';

export const LandingSettingsEditor = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('Global');

    const [settings, setSettings] = useState<any>({});
    const [heroCards, setHeroCards] = useState<any[]>([]);
    const [phases, setPhases] = useState<any[]>([]);
    const [requirements, setRequirements] = useState<any[]>([]);
    const [pricing, setPricing] = useState<any>({});
    const [facilities, setFacilities] = useState<any[]>([]);
    const [scholarships, setScholarships] = useState<any[]>([]);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [quickLinks, setQuickLinks] = useState<any[]>([]);
    const [gallery, setGallery] = useState<any[]>([]);

    const [notice, setNotice] = useState<{ open: boolean, variant: NoticeVariant, title: string, message: string }>({ open: false, variant: 'info', title: '', message: '' });
    const [deleteTarget, setDeleteTarget] = useState<{ table: string, id: string, name: string } | null>(null);

    const showNotice = (variant: NoticeVariant, title: string, message: string) => {
        setNotice({ open: true, variant, title, message });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [
                sRes, hcRes, pRes, rRes, prRes, fRes, scRes, tRes, qlRes, gRes
            ] = await Promise.all([
                supabase.from('landing_settings').select('*').limit(1).single(),
                supabase.from('hero_cards').select('*').order('order'),
                supabase.from('registration_phases').select('*').order('order'),
                supabase.from('requirements').select('*').order('order'),
                supabase.from('pricing_cards').select('*').limit(1).maybeSingle(),
                supabase.from('facilities').select('*').order('order'),
                supabase.from('scholarships').select('*').order('order'),
                supabase.from('testimonials').select('*').order('order'),
                supabase.from('quick_links').select('*').order('order'),
                supabase.from('landing_gallery').select('*').order('order'),
            ]);

            setSettings(sRes.data || {});
            setHeroCards(hcRes.data || []);
            setPhases(pRes.data || []);
            setRequirements(rRes.data || []);
            setPricing(prRes.data || {});
            setFacilities(fRes.data || []);
            setScholarships(scRes.data || []);
            setTestimonials(tRes.data || []);
            setQuickLinks(qlRes.data || []);
            setGallery(gRes.data || []);
        } catch (err: any) {
            console.error(err);
            showNotice('danger', 'Gagal', 'Gagal memuat data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            const { error } = await supabase.from('landing_settings').upsert({ id: 1, ...settings });
            if (error) throw error;

            if (pricing && Object.keys(pricing).length > 0) {
                const { error: pErr } = pricing.id
                    ? await supabase.from('pricing_cards').update(pricing).eq('id', pricing.id)
                    : await supabase.from('pricing_cards').insert([pricing]);
                if (pErr) throw pErr;
            }
            showNotice('success', 'Berhasil', 'Pengaturan berhasil disimpan');
        } catch (err: any) {
            showNotice('danger', 'Gagal', 'Gagal menyimpan pengaturan: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    // Generic Crud Helpers
    const handleArrayUpdate = async (table: string, item: any, stateSetter: any, items: any[]) => {
        try {
            setSaving(true);
            if (item.id && !item.id.startsWith('new_')) {
                const { error } = await supabase.from(table).update(item).eq('id', item.id);
                if (error) throw error;
            } else {
                const { id, ...payload } = item;
                const { data, error } = await supabase.from(table).insert([payload]).select().single();
                if (error) throw error;
                item = data;
            }
            stateSetter(items.map((i: any) => i.id === item.id ? item : i));
            showNotice('success', 'Berhasil', 'Data berhasil diperbarui');
        } catch (error: any) {
            showNotice('danger', 'Gagal', 'Pembaruan gagal: ' + error.message);
        } finally {
            setSaving(false);
            fetchData();
        }
    };

    const removeLocally = (table: string, id: string) => {
        if (table === 'registration_phases') setPhases(phases.filter(i => i.id !== id));
        else if (table === 'hero_cards') setHeroCards(heroCards.filter(i => i.id !== id));
        else if (table === 'requirements') setRequirements(requirements.filter(i => i.id !== id));
        else if (table === 'facilities') setFacilities(facilities.filter(i => i.id !== id));
        else if (table === 'scholarships') setScholarships(scholarships.filter(i => i.id !== id));
        else if (table === 'testimonials') setTestimonials(testimonials.filter(i => i.id !== id));
        else if (table === 'landing_gallery') setGallery(gallery.filter(i => i.id !== id));
        else if (table === 'quick_links') setQuickLinks(quickLinks.filter(i => i.id !== id));
    };

    const requestDelete = (table: string, id: string, name: string) => {
        if (id.startsWith('new_')) {
            removeLocally(table, id);
            return;
        }
        setDeleteTarget({ table, id, name });
    };

    const performDelete = async () => {
        if (!deleteTarget) return;
        try {
            const { error } = await supabase.from(deleteTarget.table).delete().eq('id', deleteTarget.id);
            if (error) throw error;

            removeLocally(deleteTarget.table, deleteTarget.id);
            setNotice({ open: true, variant: 'success', title: 'Berhasil', message: 'Data berhasil dihapus.' });
            setDeleteTarget(null);
        } catch (error: any) {
            setNotice({ open: true, variant: 'danger', title: 'Gagal', message: 'Penghapusan gagal: ' + error.message });
        }
    };

    const handleUpload = async (file: File, table: string, id: string, ratio: string, field: string) => {
        try {
            setSaving(true);
            const cropped = await processAndCropImage(file, ratio);
            const fileName = `landing-${Date.now()}.webp`;

            const { error } = await supabase.storage.from('landing-media').upload(fileName, cropped, { upsert: true, contentType: 'image/webp' });
            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage.from('landing-media').getPublicUrl(fileName);

            if (!id.startsWith('new_')) {
                await supabase.from(table).update({ [field]: publicUrl }).eq('id', id);
                fetchData();
            } else {
                return publicUrl;
            }
        } catch (err: any) {
            showNotice('danger', 'Gagal', 'Unggah gagal: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const renderTabs = () => (
        <div className="flex flex-wrap gap-2 mb-6 p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
            {['Global', 'Kartu Hero', 'Fase', 'Persyaratan', 'Fasilitas', 'Beasiswa', 'Testimoni', 'Galeri', 'Footer', 'Akses Cepat'].map(tab => (
                <button
                    key={tab} type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === tab ? 'bg-gold-500 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-gold-500" size={32} /></div>;

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-6 text-gray-800">
            <h1 className="text-2xl font-bold">Manajer Halaman Utama</h1>
            {renderTabs()}

            {activeTab === 'Global' && (
                <form onSubmit={handleSaveSettings} className="space-y-8">
                    {/* SEO section */}
                    <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
                        <h2 className="text-lg font-bold border-b pb-2">SEO & Metadata</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Judul Meta</label>
                                <input className="w-full border p-2 rounded" value={settings.meta_title || ''} onChange={e => setSettings({ ...settings, meta_title: e.target.value })} />
                                <p className="text-xs text-gray-500 mt-1">Panjang disarankan 50-60 karakter</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Deskripsi Meta</label>
                                <input className="w-full border p-2 rounded" value={settings.meta_description || ''} onChange={e => setSettings({ ...settings, meta_description: e.target.value })} />
                                <p className="text-xs text-gray-500 mt-1">Panjang disarankan 140-160 karakter</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-1">Kata Kunci</label>
                                <input className="w-full border p-2 rounded" value={settings.meta_keywords || ''} onChange={e => setSettings({ ...settings, meta_keywords: e.target.value })} />
                                <p className="text-xs text-gray-500 mt-1">Dipisahkan dengan koma</p>
                            </div>
                        </div>
                    </div>

                    {/* Hero Texts */}
                    <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
                        <h2 className="text-lg font-bold border-b pb-2">Teks Bagian Hero</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Judul</label>
                                <input className="w-full border p-2 rounded" value={settings.hero_title || ''} onChange={e => setSettings({ ...settings, hero_title: e.target.value })} />
                                <p className="text-xs text-gray-500 mt-1">Gunakan | untuk memisah baris seperti "SMA PLUS | BINA TRAMPIL"</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Subjudul</label>
                                <input className="w-full border p-2 rounded" value={settings.hero_subtitle || ''} onChange={e => setSettings({ ...settings, hero_subtitle: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Teks Lencana</label>
                                <input className="w-full border p-2 rounded" value={settings.badge_text || ''} onChange={e => setSettings({ ...settings, badge_text: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Teks Tombol CTA</label>
                                <input className="w-full border p-2 rounded" value={settings.cta_text || ''} onChange={e => setSettings({ ...settings, cta_text: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">WhatsApp CTA</label>
                                <input className="w-full border p-2 rounded" value={settings.cta_whatsapp_number || ''} onChange={e => setSettings({ ...settings, cta_whatsapp_number: e.target.value })} />
                                <p className="text-xs text-gray-500 mt-1">Format: 628xxx</p>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Config */}
                    <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
                        <h2 className="text-lg font-bold border-b pb-2">Kartu Biaya</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="border p-4 rounded-lg bg-gray-50">
                                <label className="block text-xs font-bold mb-1">Label Kartu 1</label>
                                <input className="w-full border p-1 rounded mb-2 text-sm" value={pricing.pendaftaran_label || ''} onChange={e => setPricing({ ...pricing, pendaftaran_label: e.target.value })} />
                                <label className="block text-xs font-bold mb-1">Nilai</label>
                                <input className="w-full border p-1 rounded text-sm font-bold text-gold-600" value={pricing.pendaftaran_value || ''} onChange={e => setPricing({ ...pricing, pendaftaran_value: e.target.value })} />
                            </div>
                            <div className="border p-4 rounded-lg bg-gray-50">
                                <label className="block text-xs font-bold mb-1">Label Kartu 2</label>
                                <input className="w-full border p-1 rounded mb-2 text-sm" value={pricing.seragam_label || ''} onChange={e => setPricing({ ...pricing, seragam_label: e.target.value })} />
                                <label className="block text-xs font-bold mb-1">Nilai</label>
                                <input className="w-full border p-1 rounded text-sm font-bold text-gold-600" value={pricing.seragam_value || ''} onChange={e => setPricing({ ...pricing, seragam_value: e.target.value })} />
                            </div>
                            <div className="border p-4 rounded-lg bg-gray-50">
                                <label className="block text-xs font-bold mb-1">Label Kartu 3</label>
                                <input className="w-full border p-1 rounded mb-2 text-sm" value={pricing.spp_label || ''} onChange={e => setPricing({ ...pricing, spp_label: e.target.value })} />
                                <label className="block text-xs font-bold mb-1">Nilai</label>
                                <input className="w-full border p-1 rounded text-sm font-bold text-gold-600" value={pricing.spp_value || ''} onChange={e => setPricing({ ...pricing, spp_value: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* Media Setup */}
                    <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
                        <h2 className="text-lg font-bold border-b pb-2">Media Profil & Lokasi</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Link Video Profil YouTube</label>
                                <input className="w-full border p-2 rounded" value={settings.youtube_video_url || ''} onChange={e => setSettings({ ...settings, youtube_video_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Link Arahkan Google Maps</label>
                                <input className="w-full border p-2 rounded" value={settings.google_maps_url || ''} onChange={e => setSettings({ ...settings, google_maps_url: e.target.value })} placeholder="Buka di HP..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-1">Kode Embed Iframe Google Maps (Opsional)</label>
                                <textarea rows={3} className="w-full border p-2 rounded" value={settings.google_maps_embed || ''} onChange={e => setSettings({ ...settings, google_maps_embed: e.target.value })} placeholder="<iframe src=... >" />
                                <p className="text-xs text-gray-500 mt-1">Gunakan fitur 'Share -&gt; Embed a map' pada Google Maps.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button disabled={saving} type="submit" className="px-6 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg shadow font-medium flex gap-2 disabled:opacity-50">
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Simpan Pengaturan Global
                        </button>
                    </div>
                </form>
            )}

            {activeTab === 'Kartu Hero' && (
                <div className="bg-white p-6 border rounded-xl shadow-sm space-y-6">
                    <p className="text-sm text-gray-500">Kelola hingga 6 gambar yang muncul di sisi kanan bagian hero.</p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {heroCards.map((card, idx) => (
                            <div key={card.id || idx} className="border border-gray-200 p-4 rounded-xl flex gap-4 bg-gray-50 items-center">
                                <div className="w-32 h-32 bg-gray-200 border border-gray-300 rounded overflow-hidden shrink-0 flex items-center justify-center relative group">
                                    {card.image_path && <img src={card.image_public_url || card.image_path} alt="Hero" className="w-full h-full object-cover" />}
                                    <label className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-xs font-bold">
                                        <ImageIcon size={20} className="mb-1" />
                                        Unggah
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                            if (e.target.files?.[0]) handleUpload(e.target.files[0], 'hero_cards', card.id, card.ratio, 'image_public_url');
                                        }} />
                                    </label>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <input className="w-full border p-2 rounded text-sm font-bold" value={card.title} onChange={e => {
                                        const next = [...heroCards]; next[idx].title = e.target.value; setHeroCards(next);
                                    }} />
                                    <p className="text-xs text-gray-500">Rasio: {card.ratio} <br /> Urutan: {card.order}</p>
                                    <button onClick={() => handleArrayUpdate('hero_cards', card, setHeroCards, heroCards)} className="px-3 py-1 bg-gray-200 hover:bg-gold-500 hover:text-white rounded text-sm transition-colors mt-2">
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {heroCards.length < 6 && (
                        <button onClick={() => setHeroCards([...heroCards, { id: `new_${Date.now()}`, title: 'Kartu Baru', ratio: '4:5', order: heroCards.length + 1 }])} className="px-4 py-2 border-2 border-dashed rounded-xl w-full hover:bg-gray-50 flex justify-center items-center gap-2 text-gray-500">
                            <Plus size={18} /> Tambah Slot Kartu Hero
                        </button>
                    )}
                </div>
            )}

            {/* Other list-based tabs rendered similarly */}
            {activeTab === 'Fase' && (
                <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
                    <p className="text-sm text-gray-500">Kelola fase pendaftaran.</p>
                    {phases.map((p, idx) => (
                        <div key={p.id} className="flex gap-2 items-center">
                            <input className="w-20 border p-2 rounded" type="number" value={p.order} onChange={e => { const next = [...phases]; next[idx].order = parseInt(e.target.value); setPhases(next); }} placeholder="Urutan" />
                            <input className="w-1/4 border p-2 rounded" value={p.label} onChange={e => { const next = [...phases]; next[idx].label = e.target.value; setPhases(next); }} placeholder="FASE 1" />
                            <input className="w-1/4 border p-2 rounded" value={p.start_date || ''} onChange={e => { const next = [...phases]; next[idx].start_date = e.target.value; setPhases(next); }} placeholder="23 Mar" />
                            <input className="w-1/4 border p-2 rounded" value={p.end_date || ''} onChange={e => { const next = [...phases]; next[idx].end_date = e.target.value; setPhases(next); }} placeholder="22 Apr 2026" />
                            <button onClick={() => handleArrayUpdate('registration_phases', p, setPhases, phases)} className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"><Save size={18} /></button>
                            <button onClick={() => requestDelete('registration_phases', p.id, p.label || 'Fase ini')} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"><Trash2 size={18} /></button>
                        </div>
                    ))}
                    <button onClick={() => setPhases([...phases, { id: `new_${Date.now()}`, label: 'Fase Baru', order: phases.length + 1 }])} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium">Tambah Fase</button>
                </div>
            )}

            {activeTab === 'Persyaratan' && (
                <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
                    {requirements.map((r, idx) => (
                        <div key={r.id} className="flex gap-2 items-center">
                            <input className="w-20 border p-2 rounded" type="number" value={r.order} onChange={e => { const next = [...requirements]; next[idx].order = parseInt(e.target.value); setRequirements(next); }} placeholder="Urutan" />
                            <input className="flex-1 border p-2 rounded" value={r.title} onChange={e => { const next = [...requirements]; next[idx].title = e.target.value; setRequirements(next); }} placeholder="Syarat..." />
                            <button onClick={() => handleArrayUpdate('requirements', r, setRequirements, requirements)} className="p-2 bg-blue-50 text-blue-600 rounded"><Save size={18} /></button>
                            <button onClick={() => requestDelete('requirements', r.id, r.title || 'Syarat ini')} className="p-2 bg-red-50 text-red-600 rounded"><Trash2 size={18} /></button>
                        </div>
                    ))}
                    <button onClick={() => setRequirements([...requirements, { id: `new_${Date.now()}`, title: '', order: requirements.length + 1 }])} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium">Tambah Persyaratan</button>
                </div>
            )}

            {activeTab === 'Fasilitas' && (
                <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
                    {facilities.map((f, idx) => (
                        <div key={f.id} className="flex gap-2 items-start border p-4 rounded-lg bg-gray-50">
                            <input className="w-20 border p-2 rounded" type="number" value={f.order} onChange={e => { const next = [...facilities]; next[idx].order = parseInt(e.target.value); setFacilities(next); }} placeholder="Urutan" />
                            <div className="flex-1 space-y-2">
                                <input className="w-full border p-2 rounded" value={f.title} onChange={e => { const next = [...facilities]; next[idx].title = e.target.value; setFacilities(next); }} placeholder="Judul" />
                                <input className="w-full border p-2 rounded" value={f.description || ''} onChange={e => { const next = [...facilities]; next[idx].description = e.target.value; setFacilities(next); }} placeholder="Deskripsi" />
                                <input className="w-full border p-2 rounded" value={f.icon || ''} onChange={e => { const next = [...facilities]; next[idx].icon = e.target.value; setFacilities(next); }} placeholder="Ikon (contoh: Monitor, Copy)" />
                                <p className="text-xs text-gray-400">Ikon yang didukung: Users, Tv, Monitor, Trophy, Briefcase, Building2, Music, Coffee, Wifi, Calendar, CheckCircle2</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => handleArrayUpdate('facilities', f, setFacilities, facilities)} className="p-2 bg-blue-50 text-blue-600 rounded"><Save size={18} /></button>
                                <button onClick={() => requestDelete('facilities', f.id, f.title || 'Fasilitas ini')} className="p-2 bg-red-50 text-red-600 rounded"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => setFacilities([...facilities, { id: `new_${Date.now()}`, title: '', order: facilities.length + 1 }])} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium">Tambah Fasilitas</button>
                </div>
            )}

            {activeTab === 'Beasiswa' && (
                <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
                    {scholarships.map((s, idx) => (
                        <div key={s.id} className="flex gap-2 items-start border p-4 rounded-lg bg-gray-50">
                            <input className="w-20 border p-2 rounded" type="number" value={s.order} onChange={e => { const next = [...scholarships]; next[idx].order = parseInt(e.target.value); setScholarships(next); }} placeholder="Urutan" />
                            <div className="flex-1 space-y-2">
                                <input className="w-full border p-2 rounded" value={s.title} onChange={e => { const next = [...scholarships]; next[idx].title = e.target.value; setScholarships(next); }} placeholder="Judul" />
                                <input className="w-full border p-2 rounded" value={s.description || ''} onChange={e => { const next = [...scholarships]; next[idx].description = e.target.value; setScholarships(next); }} placeholder="Deskripsi" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => handleArrayUpdate('scholarships', s, setScholarships, scholarships)} className="p-2 bg-blue-50 text-blue-600 rounded"><Save size={18} /></button>
                                <button onClick={() => requestDelete('scholarships', s.id, s.title || 'Beasiswa ini')} className="p-2 bg-red-50 text-red-600 rounded"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => setScholarships([...scholarships, { id: `new_${Date.now()}`, title: '', order: scholarships.length + 1 }])} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium">Tambah Beasiswa</button>
                </div>
            )}

            {activeTab === 'Testimoni' && (
                <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
                    {testimonials.map((t, idx) => (
                        <div key={t.id} className="flex gap-2 items-start border p-4 rounded-lg bg-gray-50">
                            <input className="w-20 border p-2 rounded" type="number" value={t.order} onChange={e => { const next = [...testimonials]; next[idx].order = parseInt(e.target.value); setTestimonials(next); }} placeholder="Urutan" />
                            {/* No Avatar Upload needed per layout, but supported if want to expand */}
                            <div className="flex-1 space-y-2">
                                <input className="w-full border p-2 rounded" value={t.name} onChange={e => { const next = [...testimonials]; next[idx].name = e.target.value; setTestimonials(next); }} placeholder="Nama" />
                                <input className="w-full border p-2 rounded" value={t.role} onChange={e => { const next = [...testimonials]; next[idx].role = e.target.value; setTestimonials(next); }} placeholder="Peran (misal: Alumni)" />
                                <textarea className="w-full border p-2 rounded" rows={2} value={t.quote} onChange={e => { const next = [...testimonials]; next[idx].quote = e.target.value; setTestimonials(next); }} placeholder="Kutipan" />
                                <input className="w-24 border p-2 rounded" type="number" min={1} max={5} value={t.rating || 5} onChange={e => { const next = [...testimonials]; next[idx].rating = parseInt(e.target.value); setTestimonials(next); }} placeholder="Rating 1-5" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => handleArrayUpdate('testimonials', t, setTestimonials, testimonials)} className="p-2 bg-blue-50 text-blue-600 rounded"><Save size={18} /></button>
                                <button onClick={() => requestDelete('testimonials', t.id, t.name || 'Testimoni ini')} className="p-2 bg-red-50 text-red-600 rounded"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => setTestimonials([...testimonials, { id: `new_${Date.now()}`, name: '', role: '', quote: '', order: testimonials.length + 1 }])} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium">Tambah Testimoni</button>
                </div>
            )}

            {activeTab === 'Galeri' && (
                <div className="bg-white p-6 border rounded-xl shadow-sm space-y-6">
                    <p className="text-sm text-gray-500">Kelola foto-foto Galeri Ekstrakurikuler dan Fasilitas Sekolah.</p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {gallery.map((g, idx) => (
                            <div key={g.id || idx} className="border border-gray-200 p-4 rounded-xl flex gap-4 bg-gray-50 items-center">
                                <div className="w-32 h-32 bg-gray-200 border border-gray-300 rounded overflow-hidden shrink-0 flex items-center justify-center relative group">
                                    {g.image_url && <img src={g.image_url} alt="Gallery" className="w-full h-full object-cover" />}
                                    <label className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-xs font-bold">
                                        <ImageIcon size={20} className="mb-1" />
                                        Unggah Foto
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                            if (e.target.files?.[0]) handleUpload(e.target.files[0], 'landing_gallery', g.id, '16:9', 'image_url').then(url => { if (url) { const next = [...gallery]; next[idx].image_url = url; setGallery(next); } });
                                        }} />
                                    </label>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <p className="text-xs font-bold text-gray-500">Keterangan / Caption Foto</p>
                                    <input className="w-full border p-2 rounded text-sm font-bold" value={g.caption || ''} onChange={e => {
                                        const next = [...gallery]; next[idx].caption = e.target.value; setGallery(next);
                                    }} placeholder="Futsal / Pramuka" />
                                    <div className="flex gap-2 items-center">
                                        <label className="text-xs font-bold text-gray-500">Urutan: </label>
                                        <input type="number" className="w-16 border p-1 rounded text-xs" value={g.order} onChange={e => {
                                            const next = [...gallery]; next[idx].order = parseInt(e.target.value); setGallery(next);
                                        }} />
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => handleArrayUpdate('landing_gallery', g, setGallery, gallery)} className="px-3 py-1 bg-blue-50 hover:bg-blue-500 text-blue-600 hover:text-white rounded text-sm transition-colors flex-1 flex items-center justify-center gap-1">
                                            <Save size={14} /> Simpan
                                        </button>
                                        <button onClick={() => requestDelete('landing_gallery', g.id, g.caption || 'Foto Galeri')} className="px-3 py-1 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded text-sm transition-colors flex items-center justify-center">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setGallery([...gallery, { id: `new_${Date.now()}`, caption: '', order: gallery.length + 1 }])} className="px-4 py-2 border-2 border-dashed rounded-xl w-full hover:bg-gray-50 flex justify-center items-center gap-2 text-gray-500">
                        <Plus size={18} /> Tambah Foto Galeri Baru
                    </button>
                </div>
            )}

            {activeTab === 'Footer' && (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
                        <h2 className="text-lg font-bold border-b pb-2">Pengaturan Footer</h2>

                        <div>
                            <label className="block text-sm font-bold mb-1">Deskripsi Yayasan (Bio)</label>
                            <textarea rows={3} className="w-full border p-2 rounded" value={settings.about_text || ''} onChange={e => setSettings({ ...settings, about_text: e.target.value })} placeholder="Membangun generasi muda..." />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Alamat Lengkap</label>
                                <textarea rows={2} className="w-full border p-2 rounded" value={settings.address || ''} onChange={e => setSettings({ ...settings, address: e.target.value })} placeholder="Jl. Raya..." />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Nomor Telepon / WhatsApp</label>
                                    <input className="w-full border p-2 rounded" value={settings.phone || ''} onChange={e => setSettings({ ...settings, phone: e.target.value })} placeholder="+62..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Email</label>
                                    <input className="w-full border p-2 rounded" type="email" value={settings.email || ''} onChange={e => setSettings({ ...settings, email: e.target.value })} placeholder="info@..." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Link Instagram</label>
                                <input className="w-full border p-2 rounded" value={settings.instagram_url || ''} onChange={e => setSettings({ ...settings, instagram_url: e.target.value })} placeholder="https://instagram.com/..." />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Link Facebook</label>
                                <input className="w-full border p-2 rounded" value={settings.facebook_url || ''} onChange={e => setSettings({ ...settings, facebook_url: e.target.value })} placeholder="https://facebook.com/..." />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button disabled={saving} type="submit" className="px-6 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg shadow font-medium flex gap-2 disabled:opacity-50">
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Simpan Pengaturan Footer
                        </button>
                    </div>
                </form>
            )}

            {activeTab === 'Akses Cepat' && (
                <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
                    <p className="text-sm text-gray-500">Kelola link navigasi cepat (Akses Cepat) yang muncul di footer.</p>
                    {quickLinks.map((ql, idx) => (
                        <div key={ql.id} className="flex gap-2 items-start border p-4 rounded-lg bg-gray-50">
                            <input className="w-20 border p-2 rounded" type="number" value={ql.order} onChange={e => { const next = [...quickLinks]; next[idx].order = parseInt(e.target.value); setQuickLinks(next); }} placeholder="Urutan" />
                            <div className="flex-1 space-y-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Nama Link</label>
                                    <input className="w-full border p-2 rounded text-sm" value={ql.label} onChange={e => { const next = [...quickLinks]; next[idx].label = e.target.value; setQuickLinks(next); }} placeholder="Program Sekolah" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Target URL (contoh: /#program)</label>
                                    <input className="w-full border p-2 rounded text-sm" value={ql.target_id || ''} onChange={e => { const next = [...quickLinks]; next[idx].target_id = e.target.value; setQuickLinks(next); }} placeholder="/#program" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 mt-5">
                                <button onClick={() => handleArrayUpdate('quick_links', ql, setQuickLinks, quickLinks)} className="p-2 bg-blue-50 text-blue-600 rounded"><Save size={18} /></button>
                                <button onClick={() => requestDelete('quick_links', ql.id, ql.label || 'Link ini')} className="p-2 bg-red-50 text-red-600 rounded"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => setQuickLinks([...quickLinks, { id: `new_${Date.now()}`, label: '', target_id: '', order: quickLinks.length + 1 }])} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium">Tambah Link Akses Cepat</button>
                </div>
            )}

            <SystemNotice
                open={notice.open}
                variant={notice.variant}
                title={notice.title}
                message={notice.message}
                onClose={() => setNotice(prev => ({ ...prev, open: false }))}
                autoCloseMs={3000}
            />

            <ConfirmDeleteModal
                open={!!deleteTarget}
                itemLabel={deleteTarget?.name}
                onConfirm={performDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
};
