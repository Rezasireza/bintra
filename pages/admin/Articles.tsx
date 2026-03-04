import React, { useEffect, useState } from 'react';
import { supabase } from '../../src/supabase';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';
import { ConfirmDeleteModal } from '../../components/ui/ConfirmDeleteModal';
import { SystemNotice, NoticeVariant } from '../../components/ui/SystemNotice';

export const Articles = () => {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const [notice, setNotice] = useState<{ open: boolean, variant: NoticeVariant, title: string, message: string }>({ open: false, variant: 'info', title: '', message: '' });
    const [deleteTarget, setDeleteTarget] = useState<{ id: string, title: string } | null>(null);

    const showNotice = (variant: NoticeVariant, title: string, message: string) => {
        setNotice({ open: true, variant, title, message });
    };

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('updated_at', { ascending: false });
            if (error) throw error;
            setArticles(data || []);
        } catch (err: any) {
            showNotice('danger', 'Gagal', 'Gagal memuat artikel: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const requestDelete = (id: string, title: string) => {
        setDeleteTarget({ id, title });
    };

    const performDelete = async () => {
        if (!deleteTarget) return;
        try {
            const { error } = await supabase.from('articles').delete().eq('id', deleteTarget.id);
            if (error) throw error;
            setArticles(prev => prev.filter(a => a.id !== deleteTarget.id));
            showNotice('success', 'Berhasil', 'Data berhasil dihapus.');
        } catch (err: any) {
            showNotice('danger', 'Gagal', 'Gagal menghapus data. Coba lagi: ' + err.message);
        } finally {
            setDeleteTarget(null);
        }
    };

    const filtered = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Artikel</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola postingan blog dan berita</p>
                </div>
                <button
                    onClick={() => navigate('/admin/articles/new')}
                    className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                    <Plus size={18} /> Tambah Artikel
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari artikel..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-10 flex justify-center">
                            <Loader2 className="animate-spin text-gold-500" size={32} />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">Tidak ada artikel ditemukan.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-white border-b border-gray-100 text-gray-500 text-sm">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Judul</th>
                                    <th className="px-6 py-4 font-medium">Kategori</th>
                                    <th className="px-6 py-4 font-medium">Penulis</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Update Terakhir</th>
                                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900 line-clamp-1">{item.title}</p>
                                            <p className="text-xs text-gray-500 truncate mt-1">/{item.slug}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.author_name}</td>
                                        <td className="px-6 py-4">
                                            {item.published ? (
                                                <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium border border-green-200">Terbit</span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-medium border border-amber-200">Draf</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(item.updated_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => navigate(`/admin/articles/edit/${item.id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => requestDelete(item.id, item.title)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
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

            <ConfirmDeleteModal
                open={!!deleteTarget}
                itemLabel={deleteTarget?.title}
                onConfirm={performDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
};
