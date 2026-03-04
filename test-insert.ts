import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log('Memulai test insert data pendaftaran...');

    const submissionId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'dummy-id-test-001';

    const dummyData = {
        id: submissionId,
        nomor_pendaftaran: 'PPDB-TEST-001',
        status: 'pending',
        nama_lengkap: 'Budi Test Script',
        nik: '3270000000001234',
        nisn: '1234567890',
        tempat_lahir: 'Jakarta',
        tanggal_lahir: '2010-05-15',
        jenis_kelamin: 'Laki-laki',
        agama: 'Islam',
        kebutuhan_khusus: 'Tidak ada',
        alamat: 'Jl. Merdeka No. 10',
        rt: '001',
        rw: '002',
        dusun: 'Melati',
        kelurahan: 'Sukamaju',
        kecamatan: 'Sukarame',
        kab_kota: 'Jakarta',
        kode_pos: '12345',
        jenis_tinggal: 'Bersama Orangtua',
        alat_transportasi: 'Kendaraan Umum',
        telepon: '0211234567',
        hp: '081234567890',
        no_whatsapp: '081234567890',
        email: 'budi@test.com',
        no_peserta_un: '0987654321',
        jarak_sekolah: 'Kurang dari 1 Kilometer',
        waktu_tempuh: 15,
        berat_badan: 50,
        tinggi_badan: 160,
        jumlah_saudara_kandung: 2,
        penerima_kip: 'Tidak',
        no_kip: null,
        ayah_nama: 'Asep Santoso',
        ayah_tahun_lahir: '1980',
        ayah_pendidikan: 'S1/S2/S3',
        ayah_pekerjaan: 'Wiraswasta',
        ayah_penghasilan: '> Rp 3.000.000',
        ayah_kebutuhan_khusus: '',
        ibu_nama: 'Siti Rohmah',
        ibu_tahun_lahir: '1982',
        ibu_pendidikan: 'SMA',
        ibu_pekerjaan: 'Ibu Rumah Tangga',
        ibu_penghasilan: '< Rp 1.000.000',
        ibu_kebutuhan_khusus: '',
        pas_foto_url: null, // Kita kosongkan dulu untuk text
        akte_url: null,
        kk_url: null,
        ktp_url: null
    };

    const { data, error } = await supabase.from('ppdb_submissions').insert([dummyData]);

    if (error) {
        console.error('❌ Gagal Insert Data:', error.message);
    } else {
        console.log('✅ BERHASIL! Data berhasil masuk ke Supabase tanpa UI Browser.');
        console.log('Silahkan cek halaman Dashboard Admin Anda, Budi Test Script harusnya sudah muncul!');
    }
}

testInsert();
