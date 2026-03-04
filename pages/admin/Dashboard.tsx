import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/supabase';
import {
    Search, FileText, X, ExternalLink, RefreshCw,
    MoreVertical, Edit, Trash2, Download, CheckCircle, FileWarning, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// --- Types ---
interface PpdbSubmission {
    id: string;
    nomor_pendaftaran: string;
    nama_lengkap: string; nik: string; nisn: string; tempat_lahir: string; tanggal_lahir: string;
    jenis_kelamin: string; agama: string; kebutuhan_khusus: string | null;
    alamat: string; rt: string; rw: string; dusun: string; kelurahan: string; kecamatan: string; kab_kota: string; kode_pos: string;
    jenis_tinggal: string; alat_transportasi: string; telepon: string | null; hp: string; no_whatsapp: string; email: string | null;
    no_peserta_un: string | null; jarak_sekolah: string | null; waktu_tempuh: number | null; berat_badan: number | null; tinggi_badan: number | null; jumlah_saudara_kandung: number | null;
    penerima_kip: string; no_kip: string | null;
    ayah_nama: string; ayah_tahun_lahir: string | null; ayah_pendidikan: string; ayah_pekerjaan: string; ayah_penghasilan: string; ayah_kebutuhan_khusus: string | null;
    ibu_nama: string; ibu_tahun_lahir: string | null; ibu_pendidikan: string; ibu_pekerjaan: string; ibu_penghasilan: string; ibu_kebutuhan_khusus: string | null;
    pas_foto_url: string | null; akte_url: string | null; kk_url: string | null; ktp_url: string | null;
    status: string; status_notes: string | null; created_at: string;
}

const getStatusBadge = (status: string) => {
    const norm = (status || '').toLowerCase();
    if (norm === 'pending') return <span className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Pending</span>;
    if (norm === 'lengkap') return <span className="bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Lengkap</span>;
    if (norm === 'tidak_lengkap') return <span className="bg-red-100 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Tdk Lengkap</span>;
    if (norm === 'diterima' || norm === 'approved' || norm === 'berhasil') return <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Berhasil</span>;
    return <span className="bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">{status || 'Draft'}</span>;
};

const formatDate = (dateStr: string) => {
    try { return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr)); } catch { return dateStr; }
};

export const Dashboard: React.FC = () => {
    const [data, setData] = useState<PpdbSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Bulk Actions
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkActionLoading, setBulkActionLoading] = useState(false);
    const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);

    // Modals
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<PpdbSubmission | null>(null);
    const [statusModalContent, setStatusModalContent] = useState<PpdbSubmission | null>(null);
    const [deleteModalContent, setDeleteModalContent] = useState<PpdbSubmission | null>(null);
    const [editModalContent, setEditModalContent] = useState<PpdbSubmission | null>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => { if (!(e.target as Element).closest('.action-menu-container')) setOpenMenuId(null); };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const fetchData = async () => {
        setLoading(true); setError(null);
        try {
            const { data: records, error: fetchErr } = await supabase.from('ppdb_submissions').select('*').order('created_at', { ascending: false });
            if (fetchErr) throw fetchErr;
            setData(records || []);
            setSelectedIds([]);
        } catch (err: any) { setError('Gagal memuat data pendaftar.'); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredData = React.useMemo(() => {
        return data.filter(item => {
            const matchSearch = (item.nama_lengkap || '').toLowerCase().includes(search.toLowerCase()) || (item.nik || '').includes(search) || (item.nomor_pendaftaran || '').toLowerCase().includes(search.toLowerCase());
            const matchStatus = filterStatus === 'All' ? true : (item.status || 'pending').toLowerCase() === filterStatus.toLowerCase();
            return matchSearch && matchStatus;
        });
    }, [data, search, filterStatus]);

    // Export PDF
    const exportPDF = (student: PpdbSubmission) => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold"); doc.setFontSize(16);
        doc.text("Formulir Pendaftaran Siswa (PPDB)", 14, 20);
        doc.setFontSize(10); doc.setFont("helvetica", "normal");
        doc.text(`No. Pendaftaran: ${student.nomor_pendaftaran || '-'}`, 14, 26);

        autoTable(doc, {
            startY: 32,
            head: [['Kategori', 'Data', 'Keterangan']],
            body: [
                ['A. PRIBADI', 'Nama Lengkap', student.nama_lengkap],
                ['', 'NIK / NISN', `${student.nik} / ${student.nisn}`],
                ['', 'Tempat, Tgl Lahir', `${student.tempat_lahir}, ${formatDate(student.tanggal_lahir)}`],
                ['', 'Jenis Kelamin / Agama', `${student.jenis_kelamin} / ${student.agama}`],
                ['B. DOMISILI', 'Alamat', `${student.alamat}, RT ${student.rt}/RW ${student.rw}, ${student.dusun}, ${student.kelurahan}, ${student.kecamatan}, ${student.kab_kota}`],
                ['', 'No. HP / Email', `${student.hp} / ${student.email || '-'}`],
                ['C. AKADEMIK', 'Asal / No UN', student.no_peserta_un || '-'],
                ['', 'Penerima KIP', `${student.penerima_kip} ${student.penerima_kip === 'Ya' ? '(' + student.no_kip + ')' : ''}`],
                ['D. ORANG TUA', 'Nama Ayah / Ibu', `${student.ayah_nama} / ${student.ibu_nama}`],
                ['', 'Pekerjaan Ayah / Ibu', `${student.ayah_pekerjaan} / ${student.ibu_pekerjaan}`],
                ['E. STATUS', 'Status Berkas', (student.status || 'Pending').toUpperCase()],
                ['', 'Catatan Admin', student.status_notes || '-']
            ],
            theme: 'grid', headStyles: { fillColor: [218, 165, 32] }, styles: { fontSize: 9, cellPadding: 3 }
        });

        doc.save(`Formulir_${student.nama_lengkap.replace(/\s+/g, '_')}.pdf`);
        setOpenMenuId(null);
    };

    // Export Excel
    const exportExcel = (student: PpdbSubmission) => {
        const dataRow = [{
            "No Pendaftaran": student.nomor_pendaftaran, "Nama Lengkap": student.nama_lengkap, "NIK": student.nik, "NISN": student.nisn,
            "Tempat Lahir": student.tempat_lahir, "Tanggal Lahir": formatDate(student.tanggal_lahir), "Jenis Kelamin": student.jenis_kelamin, "Agama": student.agama,
            "Alamat Lengkap": `${student.alamat}, RT ${student.rt}/RW ${student.rw}, Dusun ${student.dusun}, Kel ${student.kelurahan}, Kec ${student.kecamatan}, ${student.kab_kota}, ${student.kode_pos}`,
            "No HP/WA": student.hp, "Email": student.email,
            "Nama Ayah": student.ayah_nama, "Pekerjaan Ayah": student.ayah_pekerjaan, "Penghasilan Ayah": student.ayah_penghasilan,
            "Nama Ibu": student.ibu_nama, "Pekerjaan Ibu": student.ibu_pekerjaan, "Penghasilan Ibu": student.ibu_penghasilan,
            "Penerima KIP": student.penerima_kip, "No KIP": student.no_kip,
            "Status": (student.status || 'Pending').toUpperCase(), "Tgl Daftar": formatDate(student.created_at)
        }];
        const worksheet = XLSX.utils.json_to_sheet(dataRow);
        const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pendaftar");
        XLSX.writeFile(workbook, `Data_${student.nama_lengkap.replace(/\s+/g, '_')}.xlsx`);
        setOpenMenuId(null);
    };

    // Bulk Action Logic
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setSelectedIds(filteredData.map(item => item.id));
        else setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkDelete = async () => {
        setBulkActionLoading(true);
        try {
            const deletePromises = selectedIds.map(id =>
                supabase.from('ppdb_submissions').delete().eq('id', id).select('id')
            );

            const results = await Promise.all(deletePromises);

            const errors = results.filter(res => res.error);
            if (errors.length > 0) throw errors[0].error;

            const deletedRows = results.map(res => res.data).flat().filter(Boolean);
            if (deletedRows.length === 0) {
                alert('DATA TIDAK TERHAPUS DARI SERVER! Menandakan RLS tidak mengizinkan aksi hapus. Coba logout dan login kembali ke Dashboard Admin.');
            }

            setSelectedIds([]);
            setBulkDeleteModalOpen(false);
            await fetchData();
        } catch (err: any) { alert('Gagal menghapus data: ' + err.message); } finally { setBulkActionLoading(false); }
    };

    const exportBulkPDF = () => {
        const selectedData = filteredData.filter(item => selectedIds.includes(item.id));
        if (selectedData.length === 0) return;
        const doc = new jsPDF();
        selectedData.forEach((student, i) => {
            if (i > 0) doc.addPage();
            doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.text("Formulir Pendaftaran Siswa (PPDB)", 14, 20);
            doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.text(`No. Pendaftaran: ${student.nomor_pendaftaran || '-'}`, 14, 26);
            autoTable(doc, {
                startY: 32, head: [['Kategori', 'Data', 'Keterangan']],
                body: [
                    ['A. PRIBADI', 'Nama Lengkap', student.nama_lengkap], ['', 'NIK / NISN', `${student.nik} / ${student.nisn}`],
                    ['', 'Tempat, Tgl Lahir', `${student.tempat_lahir}, ${formatDate(student.tanggal_lahir)}`], ['', 'Jenis Kelamin / Agama', `${student.jenis_kelamin} / ${student.agama}`],
                    ['B. DOMISILI', 'Alamat', `${student.alamat}, RT ${student.rt}/RW ${student.rw}, ${student.dusun}, ${student.kelurahan}, ${student.kecamatan}, ${student.kab_kota}`],
                    ['', 'No. HP / Email', `${student.hp} / ${student.email || '-'}`], ['C. AKADEMIK', 'Asal / No UN', student.no_peserta_un || '-'],
                    ['', 'Penerima KIP', `${student.penerima_kip} ${student.penerima_kip === 'Ya' ? '(' + student.no_kip + ')' : ''}`],
                    ['D. ORANG TUA', 'Nama Ayah / Ibu', `${student.ayah_nama} / ${student.ibu_nama}`], ['', 'Pekerjaan Ayah / Ibu', `${student.ayah_pekerjaan} / ${student.ibu_pekerjaan}`],
                    ['E. STATUS', 'Status Berkas', (student.status || 'Pending').toUpperCase()], ['', 'Catatan Admin', student.status_notes || '-']
                ], theme: 'grid', headStyles: { fillColor: [218, 165, 32] }, styles: { fontSize: 9, cellPadding: 3 }
            });
        });
        doc.save(`Formulir_Massal_${selectedData.length}_Siswa.pdf`);
    };

    const exportBulkExcel = () => {
        const selectedData = filteredData.filter(item => selectedIds.includes(item.id));
        if (selectedData.length === 0) return;
        const dataRow = selectedData.map((student) => ({
            "No Pendaftaran": student.nomor_pendaftaran, "Nama Lengkap": student.nama_lengkap, "NIK": student.nik, "NISN": student.nisn,
            "Tempat Lahir": student.tempat_lahir, "Tanggal Lahir": formatDate(student.tanggal_lahir), "Jenis Kelamin": student.jenis_kelamin, "Agama": student.agama,
            "Alamat Lengkap": `${student.alamat}, RT ${student.rt}/RW ${student.rw}, Dusun ${student.dusun}, Kel ${student.kelurahan}, Kec ${student.kecamatan}, ${student.kab_kota}, ${student.kode_pos}`,
            "No HP/WA": student.hp, "Email": student.email, "Nama Ayah": student.ayah_nama, "Pekerjaan Ayah": student.ayah_pekerjaan, "Penghasilan Ayah": student.ayah_penghasilan,
            "Nama Ibu": student.ibu_nama, "Pekerjaan Ibu": student.ibu_pekerjaan, "Penghasilan Ibu": student.ibu_penghasilan, "Penerima KIP": student.penerima_kip, "No KIP": student.no_kip,
            "Status": (student.status || 'Pending').toUpperCase(), "Tgl Daftar": formatDate(student.created_at)
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataRow); const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pendaftar");
        XLSX.writeFile(workbook, `Data_Massal_${selectedData.length}_Siswa.xlsx`);
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Data Pendaftar PPDB</h2>
                    <p className="text-gray-500 text-sm tracking-wide">Kelola, verifikasi, dan ekspor pendaftaran siswa baru.</p>
                </div>
                <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm px-4 py-2 rounded-xl text-sm font-medium"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Segarkan</button>
            </div>

            {/* Filter */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Cari Nama, NIK, atau No. Daftar..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-gold-500 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none" />
                </div>
                <div className="flex gap-4">
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-gray-50 border border-gray-200 text-sm rounded-xl py-2.5 px-4 outline-none capitalize"><option value="All">Semua Status</option><option value="pending">Pending</option><option value="lengkap">Lengkap</option><option value="tidak_lengkap">Tidak Lengkap</option><option value="diterima">Berhasil / Diterima</option></select>
                    <div className="bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl text-sm font-semibold">{filteredData.length}</div>
                </div>
            </div>

            {/* Table */}
            {error ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center"><AlertCircle size={40} className="text-red-500 mx-auto mb-3" /><h3 className="text-red-700 font-bold">{error}</h3></div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 relative shadow-sm overflow-visible">
                    <div className="overflow-x-auto overflow-y-visible">
                        <table className="w-full text-left text-sm whitespace-nowrap min-h-[300px]">
                            <thead className="bg-[#FFF6E5] text-gray-600 uppercase tracking-widest text-[11px] font-bold sticky top-0">
                                <tr>
                                    <th className="px-6 py-4 w-10">
                                        <input type="checkbox" checked={filteredData.length > 0 && selectedIds.length === filteredData.length} onChange={handleSelectAll} className="w-4 h-4 text-gold-600 rounded border-gray-300 focus:ring-gold-500 cursor-pointer" />
                                    </th>
                                    <th className="px-6 py-4">Nomor & Nama</th>
                                    <th className="px-6 py-4">NIK / NISN</th>
                                    <th className="px-6 py-4">Kontak</th>
                                    <th className="px-6 py-4">Tanggal Daftar</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? <tr><td colSpan={7} className="px-6 py-10 text-center text-gray-400">Loading...</td></tr> : filteredData.length === 0 ? <tr><td colSpan={7} className="px-6 py-16 text-center text-gray-500">Belum ada pendaftar.</td></tr> : filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/80 group">
                                        <td className="px-6 py-4">
                                            <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} onClick={e => e.stopPropagation()} className="w-4 h-4 text-gold-600 rounded border-gray-300 focus:ring-gold-500 cursor-pointer" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-mono text-xs text-gold-600 font-bold mb-0.5">{item.nomor_pendaftaran || '-'}</p>
                                            <p className="font-semibold text-gray-900 truncate max-w-[200px]">{item.nama_lengkap}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700"><p>{item.nik}</p><p className="text-xs text-gray-500 font-mono mt-0.5">{item.nisn}</p></td>
                                        <td className="px-6 py-4 text-gray-700"><p>{item.hp}</p><p className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]">{item.email || '-'}</p></td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{formatDate(item.created_at)}</td>
                                        <td className="px-6 py-4 cursor-pointer" onClick={() => { setStatusModalContent(item); setOpenMenuId(null); }}>
                                            {getStatusBadge(item.status)}
                                            {item.status_notes && <p className="text-[10px] text-gray-400 mt-1 max-w-[120px] truncate" title={item.status_notes}>{item.status_notes}</p>}
                                        </td>
                                        <td className="px-6 py-4 text-center relative action-menu-container">
                                            <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === item.id ? null : item.id); }} className="p-2 text-gray-500 hover:text-gold-600 rounded-lg transition-colors border-transparent hover:border-gold-200 border relative z-20"><MoreVertical size={18} /></button>
                                            <AnimatePresence>
                                                {openMenuId === item.id && (
                                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-12 top-2 w-48 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[60] text-left">
                                                        <div className="py-1">
                                                            <button onClick={() => { setSelectedStudent(item); setOpenMenuId(null); }} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><FileText size={16} className="mr-3" /> Lihat Detail</button>
                                                            <button onClick={() => { setStatusModalContent(item); setOpenMenuId(null); }} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><CheckCircle size={16} className="mr-3" /> Ubah Status</button>
                                                            <button onClick={() => { setEditModalContent(item); setOpenMenuId(null); }} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><Edit size={16} className="mr-3" /> Edit Ringkas</button>
                                                            <div className="border-t border-gray-100 my-1"></div>
                                                            <button onClick={() => exportPDF(item)} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><Download size={16} className="mr-3" /> Unduh PDF</button>
                                                            <button onClick={() => exportExcel(item)} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><Download size={16} className="mr-3" /> Unduh Excel</button>
                                                            <div className="border-t border-gray-100 my-1"></div>
                                                            <button onClick={() => { setDeleteModalContent(item); setOpenMenuId(null); }} className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 size={16} className="mr-3" /> Hapus Data</button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {selectedStudent && <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} onChangeStatus={() => { setStatusModalContent(selectedStudent); setSelectedStudent(null); }} onEdit={() => { setEditModalContent(selectedStudent); setSelectedStudent(null); }} onExportPDF={() => exportPDF(selectedStudent)} onExportExcel={() => exportExcel(selectedStudent)} onDelete={() => { setDeleteModalContent(selectedStudent); setSelectedStudent(null); }} />}
                {statusModalContent && <StatusModal student={statusModalContent} onClose={() => setStatusModalContent(null)} onSave={() => { setStatusModalContent(null); fetchData(); }} />}
                {deleteModalContent && <DeleteModal student={deleteModalContent} onClose={() => setDeleteModalContent(null)} onDelete={() => { setDeleteModalContent(null); fetchData(); }} />}
                {editModalContent && <EditModal student={editModalContent} onClose={() => setEditModalContent(null)} onSave={() => { setEditModalContent(null); fetchData(); }} />}

                {bulkDeleteModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-gray-900/60" onClick={() => setBulkDeleteModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white w-full max-w-sm rounded-2xl p-6 text-center shadow-xl">
                            <AlertCircle className="mx-auto text-red-500 mb-3" size={48} />
                            <h3 className="font-bold text-lg mb-2 text-gray-900">Hapus {selectedIds.length} Data Sekaligus?</h3>
                            <p className="text-sm text-gray-500 mb-6">Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen dari database.</p>
                            <div className="flex gap-2">
                                <button onClick={() => setBulkDeleteModalOpen(false)} disabled={bulkActionLoading} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold transition-colors">Batal</button>
                                <button onClick={handleBulkDelete} disabled={bulkActionLoading} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md shadow-red-600/20 transition-all flex justify-center items-center gap-2">
                                    {bulkActionLoading ? <RefreshCw size={18} className="animate-spin" /> : <Trash2 size={18} />} Hapus
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Floating Bulk Action Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl p-2 flex items-center gap-2 sm:gap-4 text-white pl-4 sm:pl-6 max-w-[90vw] overflow-x-auto"
                    >
                        <span className="text-sm font-semibold whitespace-nowrap"><span className="text-gold-400">{selectedIds.length}</span> <span className="hidden sm:inline">data terpilih</span></span>
                        <div className="w-px h-6 bg-gray-700 shrink-0" />
                        <div className="flex gap-2">
                            <button onClick={exportBulkPDF} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"><FileText size={16} /> <span className="hidden sm:inline">Export PDF</span></button>
                            <button onClick={exportBulkExcel} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"><Download size={16} /> <span className="hidden sm:inline">Export Excel</span></button>
                            <button onClick={() => setBulkDeleteModalOpen(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"><Trash2 size={16} /> <span className="hidden sm:inline">Hapus</span></button>
                        </div>
                        <button onClick={() => setSelectedIds([])} className="p-2 ml-1 sm:ml-2 hover:bg-gray-800 rounded-xl transition-colors shrink-0"><X size={18} /></button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StudentModal: React.FC<{ student: PpdbSubmission, onClose: () => void, onChangeStatus: () => void, onEdit: () => void, onExportPDF: () => void, onExportExcel: () => void, onDelete: () => void }> = ({ student, onClose, onChangeStatus, onEdit, onExportPDF, onExportExcel, onDelete }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-5xl max-h-[95vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 shrink-0 gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 border-l-4 border-gold-500 pl-3 leading-tight">{student.nama_lengkap}</h3>
                        <p className="text-xs text-gray-500 pl-3 mt-1 font-mono">No. Daftar: <span className="text-gold-600 font-bold">{student.nomor_pendaftaran || '-'}</span></p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button onClick={onExportPDF} className="p-2 text-gray-600 hover:bg-white rounded-lg border border-gray-200 shadow-sm"><Download size={16} /></button>
                        <button onClick={onChangeStatus} className="px-3 py-2 text-xs font-medium text-gray-700 hover:text-gold-700 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-2"><CheckCircle size={14} /> Status</button>
                        <button onClick={onEdit} className="px-3 py-2 text-xs font-medium text-gray-700 hover:text-gold-700 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-2"><Edit size={14} /> Edit Mode</button>
                        <button onClick={onClose} className="p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 ml-2"><X size={18} /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white">
                    {student.status_notes && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-3 text-red-800"><FileWarning className="shrink-0 mt-0.5 text-red-600" size={18} /><div><h5 className="font-bold text-xs mb-1">Catatan Kekurangan:</h5><p className="text-xs">{student.status_notes}</p></div></div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Box 1 */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <h4 className="text-gold-600 font-bold text-[10px] uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">Informasi Pribadi</h4>
                            <DetailRow label="NIK" value={student.nik} />
                            <DetailRow label="NISN" value={student.nisn} />
                            <DetailRow label="Tempat, Tgl Lahir" value={`${student.tempat_lahir}, ${formatDate(student.tanggal_lahir)}`} />
                            <DetailRow label="Jenis Kelamin" value={student.jenis_kelamin} />
                            <DetailRow label="Agama" value={student.agama} />
                            <DetailRow label="Kebut. Khusus" value={student.kebutuhan_khusus} />
                        </div>
                        {/* Box 2 */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <h4 className="text-gold-600 font-bold text-[10px] uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">Alamat & Kontak</h4>
                            <DetailRow label="HP / WA" value={student.hp} />
                            <DetailRow label="Telp / Email" value={`${student.telepon || '-'} / ${student.email || '-'}`} />
                            <DetailRow label="Alamat" value={`${student.alamat}, RT ${student.rt}/RW ${student.rw}`} vertical />
                            <DetailRow label="Ds/Kel/Kec" value={`${student.dusun}, ${student.kelurahan}, Kec. ${student.kecamatan}`} vertical />
                            <DetailRow label="Kab / Kode Pos" value={`${student.kab_kota}, ${student.kode_pos}`} />
                        </div>
                        {/* Box 3 */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <h4 className="text-gold-600 font-bold text-[10px] uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">Data Akademik & Fisik</h4>
                            <DetailRow label="No. Ujian UN" value={student.no_peserta_un} />
                            <DetailRow label="Penerima KIP" value={`${student.penerima_kip} ${student.no_kip ? `(${student.no_kip})` : ''}`} />
                            <DetailRow label="Tinggi / Berat" value={`${student.tinggi_badan || '-'} cm / ${student.berat_badan || '-'} kg`} />
                            <DetailRow label="Jarak Sekolah" value={student.jarak_sekolah} />
                            <DetailRow label="Waktu Tempuh" value={`${student.waktu_tempuh || '-'} menit`} />
                            <DetailRow label="Sdr. Kandung" value={`${student.jumlah_saudara_kandung || '-'} orang`} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                            <h4 className="text-blue-800 font-bold text-[10px] uppercase tracking-widest mb-3 border-b border-blue-100 pb-2">Data Ayah</h4>
                            <DetailRow label="Nama" value={student.ayah_nama} />
                            <DetailRow label="Tahun Lahir" value={student.ayah_tahun_lahir} />
                            <DetailRow label="Pendidikan" value={student.ayah_pendidikan} />
                            <DetailRow label="Pekerjaan" value={student.ayah_pekerjaan} />
                            <DetailRow label="Penghasilan" value={student.ayah_penghasilan} />
                        </div>
                        <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100">
                            <h4 className="text-rose-800 font-bold text-[10px] uppercase tracking-widest mb-3 border-b border-rose-100 pb-2">Data Ibu</h4>
                            <DetailRow label="Nama" value={student.ibu_nama} />
                            <DetailRow label="Tahun Lahir" value={student.ibu_tahun_lahir} />
                            <DetailRow label="Pendidikan" value={student.ibu_pendidikan} />
                            <DetailRow label="Pekerjaan" value={student.ibu_pekerjaan} />
                            <DetailRow label="Penghasilan" value={student.ibu_penghasilan} />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h4 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-4">Dokumen Lampiran Pendaftar</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <DocViewer title="Pas Foto" path={student.pas_foto_url} />
                            <DocViewer title="Akte Kelahiran" path={student.akte_url} />
                            <DocViewer title="Kartu Keluarga" path={student.kk_url} />
                            <DocViewer title="KTP Ortu" path={student.ktp_url} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const DetailRow = ({ label, value, vertical = false }: { label: string, value: any, vertical?: boolean }) => (
    <div className={`text-xs mb-2 ${vertical ? 'flex flex-col gap-0.5' : 'grid grid-cols-[110px_1fr] items-start'}`}>
        <span className="text-gray-500">{label}</span>
        <span className="text-gray-900 font-semibold">{value || '-'}</span>
    </div>
);

const DocViewer = ({ title, path }: { title: string, path: string | null }) => {
    const [url, setUrl] = useState<string | null>(null);
    useEffect(() => { if (path) supabase.storage.from('ppdb-docs').createSignedUrl(path.replace(/^ppdb-docs\//, ''), 3600).then(({ data }) => setUrl(data?.signedUrl || null)); }, [path]);

    if (!path) return <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-3 flex flex-col items-center justify-center text-center h-40 opacity-70"><h5 className="font-semibold text-gray-500 text-xs mb-2">{title}</h5><span className="px-2 py-1 bg-gray-200 text-gray-500 rounded text-[9px] font-bold uppercase">X Kosong</span></div>;
    return (
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-3 flex flex-col h-40 group relative">
            <h5 className="font-bold text-gray-800 text-xs mb-2 z-10">{title}</h5>
            <div className="flex-1 flex items-center justify-center relative w-full rounded-lg overflow-hidden bg-gray-50">
                {url ? (path.endsWith('.pdf') ? <span className="text-blue-600 font-bold text-xs">PDF DOC</span> : <img src={url} className="w-full h-full object-cover" />) : <RefreshCw className="animate-spin text-gray-400 w-4 h-4" />}
            </div>
            {url && <a href={url} target="_blank" className="absolute top-2 right-2 p-1.5 bg-white rounded shadow text-gray-600 hover:text-gold-600 z-20"><ExternalLink size={12} /></a>}
        </div>
    );
};

// --- Status Modal ---
const StatusModal: React.FC<{ student: PpdbSubmission, onClose: () => void, onSave: () => void }> = ({ student, onClose, onSave }) => {
    const [status, setStatus] = useState(student.status || 'pending'), [notes, setNotes] = useState(student.status_notes || ''), [saving, setSaving] = useState(false);
    const handleSave = async () => { setSaving(true); try { await supabase.from('ppdb_submissions').update({ status, status_notes: status === 'tidak_lengkap' ? notes : null }).eq('id', student.id); onSave(); } finally { setSaving(false); } };
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white w-full max-w-sm rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Ubah Status: <span className="text-gold-600">{student.nama_lengkap}</span></h3>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm mb-4 outline-none"><option value="pending">🟡 Pending</option><option value="lengkap">🔵 Lengkap</option><option value="diterima">🟢 Berhasil/Diterima</option><option value="tidak_lengkap">🔴 Tidak Lengkap</option></select>
                {status === 'tidak_lengkap' && <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Catatan kekurangan berkas..." className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-4" />}
                <div className="flex gap-2 justify-end"><button onClick={onClose} className="px-4 py-2 border rounded-lg text-sm">Batal</button><button onClick={handleSave} className="px-4 py-2 bg-gold-600 text-white rounded-lg text-sm">{saving ? 'Simpan...' : 'Simpan'}</button></div>
            </motion.div>
        </div>
    );
};

// --- Edit Modal (Simple Mode) ---
const EditModal: React.FC<{ student: PpdbSubmission, onClose: () => void, onSave: () => void }> = ({ student, onClose, onSave }) => {
    const [formData, setFormData] = useState({ nama_lengkap: student.nama_lengkap, hp: student.hp, nik: student.nik, nisn: student.nisn });
    const [saving, setSaving] = useState(false);
    const handleSave = async () => { setSaving(true); try { await supabase.from('ppdb_submissions').update(formData).eq('id', student.id); onSave(); } finally { setSaving(false); } };
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60" onClick={onClose} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-white w-full max-w-md rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Edit Data Ringkas</h3>
                <div className="space-y-3">
                    <div><label className="text-xs font-semibold text-gray-600">Nama Lengkap</label><input type="text" value={formData.nama_lengkap} onChange={e => setFormData({ ...formData, nama_lengkap: e.target.value })} className="w-full border p-2 rounded-lg text-sm mt-1" /></div>
                    <div><label className="text-xs font-semibold text-gray-600">No. HP</label><input type="text" value={formData.hp} onChange={e => setFormData({ ...formData, hp: e.target.value })} className="w-full border p-2 rounded-lg text-sm mt-1" /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-xs font-semibold text-gray-600">NIK</label><input type="text" value={formData.nik} onChange={e => setFormData({ ...formData, nik: e.target.value })} className="w-full border p-2 rounded-lg text-sm mt-1" /></div>
                        <div><label className="text-xs font-semibold text-gray-600">NISN</label><input type="text" value={formData.nisn} onChange={e => setFormData({ ...formData, nisn: e.target.value })} className="w-full border p-2 rounded-lg text-sm mt-1" /></div>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-tight italic mt-2">*Untuk mengubah field lengkap selain 4 data di atas (seperti nama ortu, alamat RT/RW, dsb), wajib diubah menggunakan menu edit di Database Supabase langsung untuk mencegah kesalahan format data yang masif.</p>
                </div>
                <div className="mt-6 flex justify-end gap-2"><button onClick={onClose} className="px-4 py-2 text-sm border rounded-xl">Batal</button><button onClick={handleSave} className="px-4 py-2 text-sm bg-gold-600 text-white rounded-xl">Simpan</button></div>
            </motion.div>
        </div>
    );
};

// --- Delete Modal ---
const DeleteModal: React.FC<{ student: PpdbSubmission, onClose: () => void, onDelete: () => void }> = ({ student, onClose, onDelete }) => {
    const [deleting, setDeleting] = useState(false);
    const handleDelete = async () => {
        setDeleting(true);
        try {
            const { data, error } = await supabase.from('ppdb_submissions').delete().eq('id', student.id).select('id');
            if (error) throw error;
            if (!data || data.length === 0) {
                alert('Gagal dihapus: Ditolak oleh keamanan Database (RLS). Coba logout & login lagi.');
            }
            onDelete();
        } catch (err: any) {
            alert('Error: ' + err.message);
        } finally {
            setDeleting(false);
        }
    };
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white w-full max-w-sm rounded-2xl p-6 text-center">
                <Trash2 className="mx-auto text-red-500 mb-3" size={40} /><h3 className="font-bold text-lg mb-2">Hapus Data?</h3><p className="text-sm text-gray-500 mb-6">Yakin menghapus <strong>{student.nama_lengkap}</strong> secara permanen?</p>
                <div className="flex gap-2"><button onClick={onClose} className="flex-1 py-2 border rounded-xl text-sm font-medium">Batal</button><button onClick={handleDelete} className="flex-1 py-2 bg-red-600 text-white rounded-xl text-sm font-medium">{deleting ? 'Loading...' : 'Hapus'}</button></div>
            </motion.div>
        </div>
    );
};
