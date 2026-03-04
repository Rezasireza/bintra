import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/supabase';
import { useAdmin } from '../../src/admin/AdminGuard';
import { Save, User, Key, Loader2, AlertCircle, UploadCloud } from 'lucide-react';
import { SystemNotice, NoticeVariant } from '../../components/ui/SystemNotice';
import { processAndCropImage } from '../../src/utils/imageUtils';

export const MyProfile: React.FC = () => {
    const { user } = useAdmin();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const [profile, setProfile] = useState({
        full_name: '',
        email: user?.email || '',
        avatar_url: ''
    });

    const [passwordData, setPasswordData] = useState({
        new_password: '',
        confirm_password: ''
    });

    const [notice, setNotice] = useState<{ open: boolean, variant: NoticeVariant, title: string, message: string }>({
        open: false,
        variant: 'info',
        title: '',
        message: ''
    });

    const showNotice = (variant: NoticeVariant, title: string, message: string) => {
        setNotice({ open: true, variant, title, message });
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user?.email) return;

            try {
                const { data, error } = await supabase
                    .from('admins')
                    .select('full_name, avatar_url')
                    .eq('email', user.email)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error("Error fetching profile", error);
                }

                if (data) {
                    setProfile(prev => ({
                        ...prev,
                        full_name: data.full_name || '',
                        avatar_url: data.avatar_url || ''
                    }));
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setFetching(false);
            }
        };

        fetchProfileData();
    }, [user]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Check if user exists in admins table first to update
            const { error } = await supabase
                .from('admins')
                .update({
                    full_name: profile.full_name,
                    avatar_url: profile.avatar_url
                })
                .eq('email', profile.email);

            if (error) throw error;

            showNotice('success', 'Berhasil', 'Profil Anda telah disimpa.');
        } catch (error: any) {
            showNotice('danger', 'Gagal', 'Tidak dapat menyimpan profil: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingAvatar(true);
            const croppedImage = await processAndCropImage(file, '1:1'); // Auto crop to square

            const fileExt = croppedImage.name.split('.').pop();
            const fileName = `avatar-${user?.id || Date.now()}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('landing-media')
                .upload(filePath, croppedImage, { upsert: true });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('landing-media')
                .getPublicUrl(filePath);

            setProfile(prev => ({ ...prev, avatar_url: data.publicUrl }));
            showNotice('success', 'Berhasil', 'Foto berhasil diunggah. Tekan tombol Simpan Profil Utama untuk menerapkan.');
        } catch (err: any) {
            showNotice('danger', 'Gagal', 'Gagal mengunggah foto: ' + err.message);
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.new_password.length < 6) {
            showNotice('danger', 'Validasi', 'Password baru minimal 6 karakter.');
            return;
        }

        if (passwordData.new_password !== passwordData.confirm_password) {
            showNotice('danger', 'Validasi', 'Konfirmasi password tidak cocok dengan password baru.');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordData.new_password
            });

            if (error) throw error;

            showNotice('success', 'Berhasil', 'Password Anda berhasil diperbarui.');
            setPasswordData({ new_password: '', confirm_password: '' });
        } catch (error: any) {
            showNotice('danger', 'Gagal', 'Kesalahan saat mengubah password: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name: string, email: string) => {
        if (name) {
            const parts = name.split(' ');
            return parts.slice(0, 2).map(p => p.charAt(0)).join('').toUpperCase();
        }
        return email.charAt(0).toUpperCase();
    };

    if (fetching) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-gold-500" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Kelola Akun Anda</h1>
                <p className="text-gray-500 text-sm mt-1">Perbarui detail profil diri dan keamanan kata sandi.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">

                {/* Profile Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gold-600 font-semibold">
                            <div className="p-2 bg-gold-50 rounded-lg">
                                <User size={20} />
                            </div>
                            <h3>Informasi Profil</h3>
                        </div>
                    </div>

                    <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
                        <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gold-500 to-amber-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-gold-500/20 shrink-0 border-4 border-white object-cover overflow-hidden">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    getInitials(profile.full_name, profile.email)
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Foto Profil</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        disabled={uploadingAvatar || loading}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gold-50 file:text-gold-700 hover:file:bg-gold-100 transition-all cursor-pointer border border-gray-200 rounded-xl outline-none"
                                    />
                                    {uploadingAvatar && (
                                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center gap-2 rounded-xl backdrop-blur-sm border border-gold-200">
                                            <Loader2 size={16} className="animate-spin text-gold-600" />
                                            <span className="text-xs font-bold text-gold-700">Mengompres & Memotong Gambar...</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1.5">*Gambar otomatis dipotong rasio kotak (1:1) dan dioptimasi ke WebP</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
                            <input
                                type="text"
                                value={profile.full_name}
                                onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                                placeholder="Cth: Bapak Budi Santoso"
                                className="w-full border border-gray-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Alamat Email Login <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-xl px-4 py-2.5 text-sm outline-none cursor-not-allowed"
                            />
                            <p className="text-[10px] text-gray-400 mt-1.5 text-orange-600 font-medium">*Email otentikasi tidak dapat diganti manual demi keamanan sesi.</p>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gold-500 hover:bg-gold-600 focus:ring-4 focus:ring-gold-500/20 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-md shadow-gold-500/10"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Simpan Profil Utama
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-red-600 font-semibold">
                            <div className="p-2 bg-red-50 rounded-lg">
                                <Key size={20} />
                            </div>
                            <h3>Keamanan Akun</h3>
                        </div>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="p-6 space-y-5">

                        <div className="bg-orange-50/50 border border-orange-100 p-3 rounded-xl flex gap-3 text-orange-800 text-xs mb-2">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <p>Sesi Anda akan otomatis diperbarui. Harap catat password baru ini baik-baik sebelum menekan tombol simpan.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password Baru</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={passwordData.new_password}
                                onChange={e => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                placeholder="Minimal 6 karakter..."
                                className="w-full border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
                            <input
                                type="password"
                                required
                                value={passwordData.confirm_password}
                                onChange={e => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                placeholder="Ulangi password di atas..."
                                className="w-full border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading || !passwordData.new_password}
                                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-500/20 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                            >
                                {loading && <Loader2 size={18} className="animate-spin" />}
                                Update Password Sekarang
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <SystemNotice
                open={notice.open}
                variant={notice.variant}
                title={notice.title}
                message={notice.message}
                onClose={() => setNotice(prev => ({ ...prev, open: false }))}
                autoCloseMs={4000}
            />
        </div>
    );
};
