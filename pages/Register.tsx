import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Upload, X,
  Loader2, User, MapPin, Phone, FileText, AlertCircle, Users, FileImage
} from 'lucide-react';

import { supabase } from '../src/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FileState {
  file: File | null;
  preview: string;
  error: string;
}

const emptyFile = (): FileState => ({ file: null, preview: '', error: '' });

interface FormData {
  // Step 1
  nik: string;
  nisn: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  agama: string;
  kebutuhanKhusus: string;
  // Step 2
  alamat: string;
  rt: string;
  rw: string;
  dusun: string;
  kelurahan: string;
  kecamatan: string;
  kabKota: string;
  kodePos: string;
  jenisTinggal: string;
  alatTransportasi: string;
  telepon: string;
  hp: string;
  email: string;
  // Step 3
  noPesertaUn: string;
  jarakSekolah: string;
  waktuTempuh: string;
  beratBadan: string;
  tinggiBadan: string;
  jumlahSaudaraKandung: string;
  penerimaKip: string;
  noKip: string;
  ayahNama: string;
  ayahTahunLahir: string;
  ayahPendidikan: string;
  ayahPekerjaan: string;
  ayahPenghasilan: string;
  ayahKebutKhusus: string;
  ibuNama: string;
  ibuTahunLahir: string;
  ibuPendidikan: string;
  ibuPekerjaan: string;
  ibuPenghasilan: string;
  ibuKebutKhusus: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Data Pribadi', icon: User },
  { id: 2, label: 'Alamat & Kontak', icon: MapPin },
  { id: 3, label: 'Data Akademik & Ortu', icon: Users },
  { id: 4, label: 'Upload Dokumen', icon: FileImage },
];

const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2 MB

// ─── Helpers ────────────────────────────────────────────────────────────────────

const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-[#1a2340] placeholder-gray-400 ' +
  'focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all duration-200 text-[16px] min-h-[48px]';

const labelCls = 'block text-sm font-semibold text-[#1a2340] mb-1.5';

const Field: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}> = ({ label, required, children, hint }) => (
  <div className="space-y-1">
    <label className={labelCls}>
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
    {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
  </div>
);

// ─── File Upload Widget ───────────────────────────────────────────────────────

const FileUpload: React.FC<{
  label: string;
  state: FileState;
  onChange: (fs: FileState) => void;
  id: string;
  required?: boolean;
}> = ({ label, state, onChange, id, required = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = (file: File) => {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      onChange({ file: null, preview: '', error: 'Ukuran file melebihi 2 MB.' });
      return;
    }
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      onChange({ file: null, preview: '', error: 'Format harus JPG, PNG, atau PDF.' });
      return;
    }
    const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
    onChange({ file, preview, error: '' });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const file = e.dataTransfer?.files?.[0];
      if (file) handle(file);
    } catch (err) { }
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (state.preview) URL.revokeObjectURL(state.preview);
    } catch { }
    onChange(emptyFile());
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target?.files?.[0];
      if (file) handle(file);
    } catch (err) { }
  };

  return (
    <div className="space-y-1.5 flex-1 w-full">
      <label className={labelCls}>
        {label}
        {required ? <span className="text-red-400 ml-1">*</span> : <span className="text-gray-400 text-[10px] lowercase font-normal ml-1">(opsional)</span>}
      </label>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !state.file && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 h-32
          transition-all duration-200 cursor-pointer group w-full
          ${state.error ? 'border-red-300 bg-red-50' : state.file ? 'border-gold-400 bg-amber-50 cursor-default' : 'border-gray-200 bg-gray-50 hover:border-gold-400 hover:bg-amber-50/30'}`}
      >
        <input ref={inputRef} id={id} type="file" accept="image/jpeg,image/png,application/pdf" className="hidden" onChange={handleFileInput} />
        {state.file ? (
          <>
            {state.preview ? <img src={state.preview} alt="preview" className="h-16 w-auto rounded-lg object-cover" /> : <FileText size={24} className="text-gold-500" />}
            <p className="text-[11px] font-medium text-[#1a2340] text-center truncate w-full px-2">{state.file.name}</p>
            <button type="button" onClick={clear} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors"><X size={12} /></button>
          </>
        ) : (
          <>
            <Upload size={24} className="text-gray-400 group-hover:text-gold-500 transition-colors" />
            <p className="text-[11px] text-gray-500 text-center"><span className="font-semibold text-gold-600">Klik upload</span> atau drag</p>
          </>
        )}
      </div>
      {state.error && <p className="flex items-center gap-1.5 text-[10px] text-red-500"><AlertCircle size={10} /> {state.error}</p>}
    </div>
  );
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
    <motion.div className="h-full bg-gradient-to-r from-gold-500 to-amber-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
  </div>
);

// ─── Step Indicator ───────────────────────────────────────────────────────────

const StepIndicator: React.FC<{ current: number }> = ({ current }) => (
  <div className="flex items-center gap-0 mb-8 max-w-full overflow-x-auto custom-scrollbar pb-2">
    {STEPS.map((s, i) => {
      const done = current > s.id;
      const active = current === s.id;
      const Icon = s.icon;
      return (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center gap-1.5 md:min-w-[80px] min-w-[60px]">
            <motion.div
              animate={active ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.4 }}
              className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                ${done ? 'bg-green-500 text-white' : active ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30' : 'bg-gray-100 text-gray-400'}`}
            >
              {done ? <CheckCircle2 size={18} /> : <Icon size={18} />}
            </motion.div>
            <span className={`hidden md:block text-xs font-semibold whitespace-nowrap text-center ${active ? 'text-gold-600' : done ? 'text-green-600' : 'text-gray-400'}`}>
              {s.label}
            </span>
            <span className={`md:hidden text-[10px] font-semibold whitespace-nowrap text-center ${active ? 'text-gold-600' : done ? 'text-green-600' : 'text-gray-400'}`}>
              Langkah {s.id}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mt-[-18px] md:mt-[-20px] mx-1 md:mx-2 transition-colors duration-500 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Supabase Upload Helper ─────────────────────────────────────────────────────

async function uploadDocument(fileState: FileState, submissionId: string, docType: string): Promise<string | null> {
  if (!fileState.file) return null;
  try {
    const ext = fileState.file.name.split('.').pop();
    const path = `${submissionId}/${docType}.${ext}`;
    const { error } = await supabase.storage.from('ppdb-docs').upload(path, fileState.file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    return path;
  } catch (err: any) {
    throw new Error(`Upload ${docType} gagal: ${err.message || 'Unknown error'}`);
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stepReady, setStepReady] = useState(true);

  React.useEffect(() => {
    setStepReady(false);
    const timer = setTimeout(() => setStepReady(true), 600);
    return () => clearTimeout(timer);
  }, [step]);

  const [form, setForm] = useState<FormData>({
    nik: '', nisn: '', namaLengkap: '', tempatLahir: '', tanggalLahir: '', jenisKelamin: '', agama: '', kebutuhanKhusus: '',
    alamat: '', rt: '', rw: '', dusun: '', kelurahan: '', kecamatan: '', kabKota: '', kodePos: '', jenisTinggal: '', alatTransportasi: '', telepon: '', hp: '', email: '',
    noPesertaUn: '', jarakSekolah: '', waktuTempuh: '', beratBadan: '', tinggiBadan: '', jumlahSaudaraKandung: '', penerimaKip: '', noKip: '',
    ayahNama: '', ayahTahunLahir: '', ayahPendidikan: '', ayahPekerjaan: '', ayahPenghasilan: '', ayahKebutKhusus: '',
    ibuNama: '', ibuTahunLahir: '', ibuPendidikan: '', ibuPekerjaan: '', ibuPenghasilan: '', ibuKebutKhusus: ''
  });

  const [pasFoto, setPasFoto] = useState<FileState>(emptyFile());
  const [akteLahir, setAkteLahir] = useState<FileState>(emptyFile());
  const [kartuKeluarga, setKartuKeluarga] = useState<FileState>(emptyFile());
  const [ktpOrtu, setKtpOrtu] = useState<FileState>(emptyFile());

  const stepVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const validateStep = (s: number): boolean => {
    if (s === 1) return !!(form.nik.trim() && form.nisn.trim() && form.namaLengkap.trim() && form.tempatLahir.trim() && form.tanggalLahir && form.jenisKelamin && form.agama);
    if (s === 2) return !!(form.alamat.trim() && form.rt.trim() && form.rw.trim() && form.kelurahan.trim() && form.kecamatan.trim() && form.kabKota.trim() && form.hp.trim() && form.jenisTinggal && form.alatTransportasi);
    if (s === 3) return !!(form.ayahNama.trim() && form.ibuNama.trim() && form.jarakSekolah && form.penerimaKip);
    if (s === 4) return !!(pasFoto.file && !pasFoto.error && !akteLahir.error && !kartuKeluarga.error && !ktpOrtu.error);
    return false;
  };

  const generateNomorPendaftaran = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `PPDB-${year}-${randomNum}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepReady) return;
    if (step < 4) { goNext(); return; }
    if (!validateStep(4)) { alert("Mohon pastikan Pas Foto sudah diupload sebelum submit."); return; }

    setLoading(true); setSubmitError(''); setUploadProgress(10);

    try {
      const submissionId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); });
      const noPendaftaran = generateNomorPendaftaran();

      let fotoPath = null, aktePath = null, kkPath = null, ktpPath = null;
      setUploadProgress(30);

      const [uFoto, uAkte, uKk, uKtp] = await Promise.all([
        uploadDocument(pasFoto, submissionId, 'pasfoto'),
        uploadDocument(akteLahir, submissionId, 'akte'),
        uploadDocument(kartuKeluarga, submissionId, 'kk'),
        uploadDocument(ktpOrtu, submissionId, 'ktp')
      ]);
      fotoPath = uFoto; aktePath = uAkte; kkPath = uKk; ktpPath = uKtp;

      setUploadProgress(70);

      const { error: insertError } = await supabase.from('ppdb_submissions').insert({
        id: submissionId,
        nomor_pendaftaran: noPendaftaran,
        status: 'pending',
        // Step 1
        nama_lengkap: form.namaLengkap, nik: form.nik, nisn: form.nisn, tempat_lahir: form.tempatLahir,
        tanggal_lahir: form.tanggalLahir, jenis_kelamin: form.jenisKelamin, agama: form.agama, kebutuhan_khusus: form.kebutuhanKhusus,
        // Step 2
        alamat: form.alamat, rt: form.rt, rw: form.rw, dusun: form.dusun, kelurahan: form.kelurahan, kecamatan: form.kecamatan,
        kab_kota: form.kabKota, kode_pos: form.kodePos, jenis_tinggal: form.jenisTinggal, alat_transportasi: form.alatTransportasi,
        telepon: form.telepon, hp: form.hp, no_whatsapp: form.hp, email: form.email,
        // Step 3
        no_peserta_un: form.noPesertaUn, jarak_sekolah: form.jarakSekolah, waktu_tempuh: form.waktuTempuh ? parseInt(form.waktuTempuh) : null,
        berat_badan: form.beratBadan ? parseInt(form.beratBadan) : null, tinggi_badan: form.tinggiBadan ? parseInt(form.tinggiBadan) : null,
        jumlah_saudara_kandung: form.jumlahSaudaraKandung ? parseInt(form.jumlahSaudaraKandung) : null, penerima_kip: form.penerimaKip, no_kip: form.noKip,
        ayah_nama: form.ayahNama, ayah_tahun_lahir: form.ayahTahunLahir, ayah_pendidikan: form.ayahPendidikan, ayah_pekerjaan: form.ayahPekerjaan, ayah_penghasilan: form.ayahPenghasilan, ayah_kebutuhan_khusus: form.ayahKebutKhusus,
        ibu_nama: form.ibuNama, ibu_tahun_lahir: form.ibuTahunLahir, ibu_pendidikan: form.ibuPendidikan, ibu_pekerjaan: form.ibuPekerjaan, ibu_penghasilan: form.ibuPenghasilan, ibu_kebutuhan_khusus: form.ibuKebutKhusus,
        // Step 4
        pas_foto_url: fotoPath, akte_url: aktePath, kk_url: kkPath, ktp_url: ktpPath
      });

      if (insertError) throw insertError;
      setUploadProgress(100); setSuccess(true);
    } catch (err: any) {
      setSubmitError('Gagal menyimpan data: ' + (err.message || 'Terjadi kesalahan sistem.'));
    } finally {
      setLoading(false); setTimeout(() => setUploadProgress(0), 400);
    }
  };

  const goNext = () => { if (!validateStep(step)) return; setDirection(1); setStep(s => s + 1); };
  const goPrev = () => { setDirection(-1); setStep(s => s - 1); };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-2xl shadow-gray-200 p-10 max-w-md w-full text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }} className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} className="text-green-500" /></motion.div>
          <h2 className="text-2xl font-bold text-[#1a2340] mb-3">Pendaftaran Berhasil! 🎉</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">Data PPDB Anda telah kami terima dengan aman.</p>
          <div className="bg-amber-50 rounded-xl p-4 mb-8">
            <p className="text-xs text-amber-700 font-bold uppercase tracking-widest mb-1">Nomor Pendaftaran:</p>
            <p className="text-lg font-mono font-bold text-[#1a2340]">Otomatis Dikirim Via WA</p>
          </div>
          <div className="flex flex-col gap-3">
            <a href={`https://wa.me/6289506835889?text=Halo%20saya%20${encodeURIComponent(form.namaLengkap)}%20baru%20saja%20mendaftar%20PPDB%20SMA%20Plus%20Bina%20Trampil.%20Mohon%20info%20Nomor%20Pendaftarannya.`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-green-200">
              💬 Konfirmasi via WhatsApp
            </a>
            <button onClick={() => navigate('/')} className="w-full py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors">Kembali ke Beranda</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[35%] bg-gradient-to-br from-[#1a2340] to-[#0f1520] flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#C8A24A 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full border border-gold-500/10" />
        <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full border border-gold-500/5" />
        <div className="relative z-10"><Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium text-sm transition-colors"><ArrowLeft size={16} /> Kembali ke Beranda</Link></div>
        <div className="relative z-10 space-y-5">
          <div className="inline-flex px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-bold tracking-widest uppercase">SPMB 2026/2027</div>
          <h1 className="text-3xl font-bold text-white leading-snug">Formulir<br />Pendaftaran<br /><span className="text-gold-400">Siswa Baru</span></h1>
          <p className="text-white/50 text-xs leading-relaxed max-w-xs">Isi formulir pendaftaran ini dengan melengkapi 4 tahap yang sudah disediakan dengan benar.</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-[65%] bg-white flex flex-col h-screen overflow-y-auto custom-scrollbar relative">
        <div className="flex-1 flex flex-col py-8 px-4 sm:px-5 md:px-8 max-w-xl mx-auto w-full pb-[env(safe-area-inset-bottom,2rem)] md:pb-12">
          <Link to="/" className="lg:hidden inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a2340] mb-6 self-start"><ArrowLeft size={15} /> Beranda</Link>
          <div className="mb-6">
            <p className="text-gold-600 text-xs font-bold tracking-widest uppercase mb-1">Langkah {step} dari {STEPS.length}</p>
            <h2 className="text-2xl font-bold text-[#1a2340] mb-1">{STEPS[step - 1].label}</h2>
            <p className="text-gray-400 text-xs">Pastikan informasi diisi sesuai dengan dokumen resmi Anda.</p>
          </div>
          <StepIndicator current={step} />

          <form onSubmit={(e) => e.preventDefault()} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} noValidate className="pb-28">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={step} custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeInOut' }} className="space-y-4">

                {/* STEP 1: PRIBADI */}
                {step === 1 && (
                  <>
                    <Field label="Nama Lengkap" required><input type="text" value={form.namaLengkap} onChange={set('namaLengkap')} className={inputCls} placeholder="Contoh: Budi Santoso" /></Field>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="NIK (16 Digit)" required><input type="text" value={form.nik} onChange={set('nik')} className={inputCls} maxLength={16} placeholder="Sesuai KK" /></Field>
                      <Field label="NISN" required><input type="text" value={form.nisn} onChange={set('nisn')} className={inputCls} placeholder="Sesuai Dapodik" /></Field>
                      <Field label="Tempat Lahir" required><input type="text" value={form.tempatLahir} onChange={set('tempatLahir')} className={inputCls} placeholder="Kota/Kab" /></Field>
                      <Field label="Tanggal Lahir" required><input type="date" value={form.tanggalLahir} onChange={set('tanggalLahir')} className={inputCls} max={new Date().toISOString().split('T')[0]} /></Field>
                      <Field label="Jenis Kelamin" required>
                        <select value={form.jenisKelamin} onChange={set('jenisKelamin')} className={inputCls}><option value="">-- Pilih --</option><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option></select>
                      </Field>
                      <Field label="Agama" required>
                        <select value={form.agama} onChange={set('agama')} className={inputCls}><option value="">-- Pilih --</option><option value="Islam">Islam</option><option value="Kristen Protestan">Kristen Protestan</option><option value="Katolik">Katolik</option><option value="Hindu">Hindu</option><option value="Budha">Budha</option><option value="Lainnya">Lainnya</option></select>
                      </Field>
                    </div>
                    <Field label="Kebutuhan Khusus"><input type="text" value={form.kebutuhanKhusus} onChange={set('kebutuhanKhusus')} className={inputCls} placeholder="Jika ada (contoh: Tuna Netra, dll). Kosongkan jika tidak ada." /></Field>
                  </>
                )}

                {/* STEP 2: ALAMAT */}
                {step === 2 && (
                  <>
                    <Field label="Alamat Lengkap Jalan / Perumahan" required><textarea rows={2} value={form.alamat} onChange={set('alamat')} className={`${inputCls} resize-none`} placeholder="Contoh: Jl. Merdeka No 10" /></Field>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Field label="RT" required><input type="text" value={form.rt} onChange={set('rt')} className={inputCls} placeholder="001" /></Field>
                      <Field label="RW" required><input type="text" value={form.rw} onChange={set('rw')} className={inputCls} placeholder="002" /></Field>
                      <Field label="Dusun/Kampung" required><input type="text" value={form.dusun} onChange={set('dusun')} className={inputCls} placeholder="Dusun A" /></Field>
                      <Field label="Kode Pos"><input type="text" value={form.kodePos} onChange={set('kodePos')} className={inputCls} placeholder="42xxx" /></Field>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Field label="Kelurahan" required><input type="text" value={form.kelurahan} onChange={set('kelurahan')} className={inputCls} /></Field>
                      <Field label="Kecamatan" required><input type="text" value={form.kecamatan} onChange={set('kecamatan')} className={inputCls} /></Field>
                      <Field label="Kab/Kota" required><input type="text" value={form.kabKota} onChange={set('kabKota')} className={inputCls} /></Field>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Jenis Tinggal" required><select value={form.jenisTinggal} onChange={set('jenisTinggal')} className={inputCls}><option value="">-- Pilih --</option><option value="Bersama Orangtua">Bersama Orangtua</option><option value="Bersama Wali">Bersama Wali</option><option value="Lainnya">Lainnya</option></select></Field>
                      <Field label="Transportasi" required><select value={form.alatTransportasi} onChange={set('alatTransportasi')} className={inputCls}><option value="">-- Pilih --</option><option value="Jalan Kaki">Jalan Kaki</option><option value="Motor">Sepeda Motor</option><option value="Angkutan Umum">Angkutan Umum</option><option value="Lainnya">Lainnya</option></select></Field>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Field label="No. HP / WhatsApp" required hint="Wajib untuk komunikasi"><input type="tel" value={form.hp} onChange={set('hp')} className={inputCls} placeholder="08xxx" /></Field>
                      <Field label="No. Telepon Rumah"><input type="tel" value={form.telepon} onChange={set('telepon')} className={inputCls} placeholder="Jika ada" /></Field>
                      <Field label="E-Mail Pribadi"><input type="email" value={form.email} onChange={set('email')} className={inputCls} placeholder="budi@gmail.com" /></Field>
                    </div>
                  </>
                )}

                {/* STEP 3: AKADEMIK & ORANG TUA */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                      <h3 className="font-bold text-sm text-[#1a2340]">Data Akademik & Fisik</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="No. Peserta UN/Ujian"><input type="text" value={form.noPesertaUn} onChange={set('noPesertaUn')} className={inputCls} placeholder="Nomor Ujian (Opsional)" /></Field>
                        <Field label="Jumlah Saudara Kandung"><input type="number" value={form.jumlahSaudaraKandung} onChange={set('jumlahSaudaraKandung')} className={inputCls} placeholder="Contoh: 2" /></Field>
                        <Field label="Tinggi Badan (cm)"><input type="number" value={form.tinggiBadan} onChange={set('tinggiBadan')} className={inputCls} placeholder="cm" /></Field>
                        <Field label="Berat Badan (kg)"><input type="number" value={form.beratBadan} onChange={set('beratBadan')} className={inputCls} placeholder="kg" /></Field>
                        <Field label="Jarak Rumah ke Sekolah" required><select value={form.jarakSekolah} onChange={set('jarakSekolah')} className={inputCls}><option value="">-- Pilih --</option><option value="Kurang dari 1 Kilometer">Kurang dari 1 Km</option><option value="Lebih dari 1 Kilometer">Lebih dari 1 Km</option></select></Field>
                        <Field label="Waktu Tempuh (Menit)"><input type="number" value={form.waktuTempuh} onChange={set('waktuTempuh')} className={inputCls} placeholder="Mnt" /></Field>
                        <Field label="Penerima KIP" required><select value={form.penerimaKip} onChange={set('penerimaKip')} className={inputCls}><option value="">-- Pilih --</option><option value="Ya">Ya</option><option value="Tidak">Tidak</option></select></Field>
                        {form.penerimaKip === 'Ya' && <Field label="Nomor KIP"><input type="text" value={form.noKip} onChange={set('noKip')} className={inputCls} placeholder="Masukkan nomor KIP" /></Field>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Data Ayah */}
                      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-4">
                        <h3 className="font-bold text-sm text-blue-900 border-b border-blue-100 pb-2">Data Ayah</h3>
                        <Field label="Nama Ayah" required><input type="text" value={form.ayahNama} onChange={set('ayahNama')} className={inputCls} /></Field>
                        <Field label="Tahun Lahir (Contoh: 1980)"><input type="number" value={form.ayahTahunLahir} onChange={set('ayahTahunLahir')} className={inputCls} /></Field>
                        <Field label="Pendidikan Terakhir"><select value={form.ayahPendidikan} onChange={set('ayahPendidikan')} className={inputCls}><option value="">-- Pilih --</option><option value="Tidak Sekolah">Tidak Sekolah</option><option value="SD">SD</option><option value="SMP">SMP</option><option value="SMA">SMA</option><option value="D1/D2/D3">D1/D2/D3</option><option value="S1/S2/S3">S1/S2/S3</option></select></Field>
                        <Field label="Pekerjaan"><input type="text" value={form.ayahPekerjaan} onChange={set('ayahPekerjaan')} className={inputCls} /></Field>
                        <Field label="Penghasilan / Bulan"><select value={form.ayahPenghasilan} onChange={set('ayahPenghasilan')} className={inputCls}><option value="">-- Pilih --</option><option value="< Rp 1.000.000">{'< Rp 1.000.000'}</option><option value="Rp 1.000.000 - Rp 3.000.000">Rp 1.000.000 - Rp 3.000.000</option><option value="> Rp 3.000.000">{'> Rp 3.000.000'}</option></select></Field>
                        <Field label="Kebutuhan Khusus"><input type="text" value={form.ayahKebutKhusus} onChange={set('ayahKebutKhusus')} className={inputCls} placeholder="Jika ada" /></Field>
                      </div>

                      {/* Data Ibu */}
                      <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 space-y-4">
                        <h3 className="font-bold text-sm text-rose-900 border-b border-rose-100 pb-2">Data Ibu</h3>
                        <Field label="Nama Ibu" required><input type="text" value={form.ibuNama} onChange={set('ibuNama')} className={inputCls} /></Field>
                        <Field label="Tahun Lahir (Contoh: 1982)"><input type="number" value={form.ibuTahunLahir} onChange={set('ibuTahunLahir')} className={inputCls} /></Field>
                        <Field label="Pendidikan Terakhir"><select value={form.ibuPendidikan} onChange={set('ibuPendidikan')} className={inputCls}><option value="">-- Pilih --</option><option value="Tidak Sekolah">Tidak Sekolah</option><option value="SD">SD</option><option value="SMP">SMP</option><option value="SMA">SMA</option><option value="D1/D2/D3">D1/D2/D3</option><option value="S1/S2/S3">S1/S2/S3</option></select></Field>
                        <Field label="Pekerjaan"><input type="text" value={form.ibuPekerjaan} onChange={set('ibuPekerjaan')} className={inputCls} /></Field>
                        <Field label="Penghasilan / Bulan"><select value={form.ibuPenghasilan} onChange={set('ibuPenghasilan')} className={inputCls}><option value="">-- Pilih --</option><option value="< Rp 1.000.000">{'< Rp 1.000.000'}</option><option value="Rp 1.000.000 - Rp 3.000.000">Rp 1.000.000 - Rp 3.000.000</option><option value="> Rp 3.000.000">{'> Rp 3.000.000'}</option></select></Field>
                        <Field label="Kebutuhan Khusus"><input type="text" value={form.ibuKebutKhusus} onChange={set('ibuKebutKhusus')} className={inputCls} placeholder="Jika ada" /></Field>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: UPLOAD */}
                {step === 4 && (
                  <>
                    <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 mb-4 flex gap-3">
                      <AlertCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Pas Foto berwarna <strong>Wajib</strong> diupload. Dokumen Akte, KK, & KTP bersifat <strong>opsional</strong>. Format diperbolehkan JPG, PNG, atau PDF (maks 2MB/file).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <FileUpload required label="Pas Foto (Wajib)" id="foto" state={pasFoto} onChange={setPasFoto} />
                      <FileUpload label="Akte Kelahiran" id="akte" state={akteLahir} onChange={setAkteLahir} />
                      <FileUpload label="Kartu Keluarga" id="kk" state={kartuKeluarga} onChange={setKartuKeluarga} />
                      <FileUpload label="KTP Ortu" id="ktp" state={ktpOrtu} onChange={setKtpOrtu} />
                    </div>

                    {loading && uploadProgress > 0 && <div className="space-y-2 mt-4"><div className="flex justify-between text-xs text-gray-500"><span>Menyimpan data...</span><span>{uploadProgress}%</span></div><ProgressBar progress={uploadProgress} /></div>}
                    {submitError && <div className="flex items-start gap-2 p-4 rounded-xl bg-red-50 border border-red-100 mt-4"><AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" /><p className="text-sm text-red-600">{submitError}</p></div>}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </form>

          {/* BUTTON FOOTER */}
          <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col-reverse md:flex-row gap-3 md:justify-between sticky bottom-0 bg-white/95 backdrop-blur-sm z-50 pb-[env(safe-area-inset-bottom,16px)] md:pb-0">
            {step > 1 ? (
              <button type="button" onClick={goPrev} disabled={loading || !stepReady} className="w-full md:w-auto justify-center px-5 py-3 md:py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"><ArrowLeft size={16} /> Kembali</button>
            ) : (
              <div className="hidden md:block"></div>
            )}
            {step < 4 ? (
              <button type="button" onClick={goNext} disabled={!validateStep(step) || !stepReady} className="w-full md:w-auto justify-center px-8 py-3 md:py-2.5 rounded-xl bg-[#1a2340] text-white text-sm font-bold hover:bg-gold-500 transition-all duration-200 disabled:opacity-40 shadow-lg shadow-gray-900/20 flex items-center gap-2">Lanjut <ArrowRight size={16} /></button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading || !validateStep(4) || !stepReady} className="w-full md:w-auto justify-center px-8 py-3 md:py-2.5 rounded-xl bg-gold-500 text-white text-sm font-bold hover:bg-gold-600 transition-all duration-200 disabled:opacity-40 shadow-lg shadow-gold-500/30 flex items-center gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Proses...</> : <><CheckCircle2 size={16} /> Daftar Sekarang</>}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;