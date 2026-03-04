export interface Article {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    authorRole: string;
    date: string;
    readTime: string;
    image: string;
    metaDescription: string;
}

export const articles: Article[] = [
    {
        id: 1,
        slug: "tips-sukses-masuk-perguruan-tinggi-negeri",
        title: "Tips Sukses Masuk Perguruan Tinggi Negeri untuk Lulusan SMA",
        excerpt:
            "Pelajari strategi jitu dan persiapan matang agar peluang lolos SNBP dan UTBK semakin besar. Dari manajemen waktu hingga latihan soal intensif.",
        content: `
      <p>Masuk ke Perguruan Tinggi Negeri (PTN) adalah impian banyak siswa di Indonesia. Persaingan yang semakin ketat menuntut persiapan yang matang dan strategi yang tepat sejak dini.</p>

      <h2>1. Kenali Jalur Masuk PTN</h2>
      <p>Ada <strong>tiga jalur utama</strong> masuk PTN yang wajib kamu pahami:</p>
      <ul>
        <li><strong>SNBP</strong> — Seleksi Nasional Berdasarkan Prestasi (menggunakan nilai rapor)</li>
        <li><strong>SNBT</strong> — Seleksi Nasional Berdasarkan Tes (ujian tulis berbasis komputer)</li>
        <li><strong>Seleksi Mandiri</strong> — Jalur khusus yang diselenggarakan masing-masing PTN</li>
      </ul>
      <p>Memahami perbedaan ketiga jalur ini akan membantu kamu menyusun strategi yang lebih terarah.</p>

      <h2>2. Perkuat Nilai Rapor Sejak Kelas X</h2>
      <p>Untuk jalur SNBP, nilai rapor semester 1–5 sangat menentukan. Pastikan nilai mata pelajaran utama — terutama yang sesuai jurusan incaran — selalu <strong>konsisten tinggi</strong> dan terus meningkat dari semester ke semester.</p>

      <h2>3. Latihan Soal UTBK Secara Intensif</h2>
      <p>Gunakan aplikasi dan buku latihan UTBK secara rutin setiap hari. Fokuslah pada dua komponen utama:</p>
      <ul>
        <li><strong>TPS (Tes Potensi Skolastik)</strong> — kemampuan penalaran umum, kuantitatif, dan literasi</li>
        <li><strong>TKA (Tes Kemampuan Akademik)</strong> — materi sesuai rumpun ilmu yang dipilih</li>
      </ul>

      <h2>4. Manajemen Waktu yang Disiplin</h2>
      <p>Buat jadwal belajar yang konsisten dan realistis. Kombinasikan antara belajar mandiri, bimbel, dan diskusi kelompok untuk mendapatkan pemahaman yang lebih menyeluruh dan hasil yang optimal.</p>

      <h3>Tips Tambahan dari Guru SMA Plus Bina Trampil</h3>
      <p>Di SMA Plus Bina Trampil, kami menyediakan <strong>program persiapan PTN intensif</strong> dengan bimbingan guru berpengalaman. Program ini mencakup try-out rutin, konsultasi jurusan, dan pendampingan pendaftaran SNBP maupun SNBT untuk membantu siswa meraih impian mereka.</p>
    `,
        category: "Tips Akademik",
        author: "Tim Akademik SMA Plus",
        authorRole: "Guru Senior",
        date: "15 Februari 2026",
        readTime: "5 menit",
        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&q=80",
        metaDescription:
            "Pelajari tips dan strategi sukses masuk Perguruan Tinggi Negeri (PTN) melalui jalur SNBP dan UTBK untuk lulusan SMA. Panduan lengkap dari SMA Plus Bina Trampil.",
    },
    {
        id: 2,
        slug: "kegiatan-ekstrakurikuler-terbaik-pengembangan-diri",
        title: "5 Kegiatan Ekstrakurikuler Terbaik untuk Pengembangan Diri Siswa",
        excerpt:
            "Ekstrakurikuler bukan sekadar pengisi waktu luang. Temukan bagaimana kegiatan ekskul yang tepat bisa membentuk karakter dan membuka peluang karir yang lebih luas.",
        content: `
      <p>Kegiatan ekstrakurikuler memiliki peran penting dalam membentuk karakter dan mengembangkan potensi siswa di luar akademik. Memilih ekskul yang tepat bisa menjadi <strong>investasi berharga</strong> untuk masa depan dan membedakanmu di mata kampus maupun perusahaan.</p>

      <h2>1. OSIS — Melatih Jiwa Pemimpin</h2>
      <p>OSIS (Organisasi Siswa Intra Sekolah) melatih kemampuan kepemimpinan, manajemen waktu, komunikasi publik, dan kerja sama tim — keterampilan yang sangat dicari dunia kerja dan PTN terbaik di Indonesia.</p>

      <h2>2. Pramuka — Membangun Karakter Kuat</h2>
      <p>Pramuka membentuk kemandirian, kedisiplinan, dan jiwa gotong royong. Nilai-nilai ini menjadi fondasi karakter yang kuat dan tahan banting menghadapi berbagai tantangan di masa depan.</p>

      <h2>3. Seni Tari &amp; Musik — Ekspresi dan Kepercayaan Diri</h2>
      <p>Kegiatan seni mengasah kreativitas dan rasa percaya diri secara signifikan. Siswa juga mendapat kesempatan berharga untuk tampil di berbagai festival dan kompetisi mulai dari tingkat daerah hingga nasional.</p>

      <h2>4. Olahraga Kompetitif — Sportivitas dan Kerja Tim</h2>
      <p>Basket, futsal, voli, atau bulu tangkis melatih kerja tim, sportivitas, dan ketahanan fisik maupun mental. Prestasi olahraga juga bisa menjadi jalur beasiswa yang sangat menjanjikan.</p>

      <h2>5. Club Teknologi &amp; Coding — Siap Era Digital</h2>
      <p>Di era digital seperti sekarang, keterampilan <em>coding</em> dan teknologi adalah nilai tambah yang sangat signifikan di dunia kerja. Club ini mempersiapkan siswa untuk:</p>
      <ul>
        <li>Kompetisi Olimpiade Sains Nasional (OSN) bidang Informatika</li>
        <li>Hackathon dan lomba pemrograman antar sekolah</li>
        <li>Karir di bidang teknologi informasi dan startup digital</li>
      </ul>

      <h3>Ekskul di SMA Plus Bina Trampil</h3>
      <p>SMA Plus Bina Trampil menyediakan berbagai pilihan ekstrakurikuler yang aktif dan berprestasi, mulai dari seni tari, pramuka, hingga olahraga kompetitif. Daftarkan dirimu dan temukan passionmu bersama kami!</p>
    `,
        category: "Pengembangan Diri",
        author: "Ibu Dewi Rahayu",
        authorRole: "Pembina Ekstrakurikuler",
        date: "10 Februari 2026",
        readTime: "4 menit",
        image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&auto=format&q=80",
        metaDescription:
            "Temukan 5 kegiatan ekstrakurikuler terbaik yang membantu pengembangan diri siswa SMA. Dari OSIS hingga teknologi, pilih ekskul yang sesuai minat dan bakat.",
    },
    {
        id: 3,
        slug: "program-beasiswa-siswa-berprestasi-2026",
        title: "Program Beasiswa 2026 untuk Siswa Berprestasi dan Kurang Mampu",
        excerpt:
            "SMA Plus Bina Trampil membuka berbagai jalur beasiswa. Tidak ada alasan finansial untuk menghentikan langkah menuju pendidikan berkualitas.",
        content: `
      <p>Pendidikan berkualitas adalah hak semua anak bangsa. SMA Plus Bina Trampil berkomitmen untuk memastikan tidak ada siswa berbakat yang terhalang oleh keterbatasan biaya dalam meraih pendidikan terbaik.</p>

      <h2>Beasiswa Prestasi Akademik</h2>
      <p>Diberikan kepada siswa yang meraih <strong>peringkat 1–5</strong> di sekolah asal (dibuktikan dengan raport dan surat keterangan kepala sekolah). Meliputi:</p>
      <ul>
        <li>Pembebasan biaya SPP selama bersekolah</li>
        <li>Fasilitas buku dan alat tulis</li>
        <li>Prioritas mengikuti program unggulan sekolah</li>
      </ul>

      <h2>Beasiswa Tahfidz Al-Qur'an</h2>
      <p>Program istimewa bagi siswa yang telah menghafal <strong>minimal 3 Juz Al-Qur'an</strong>. Beasiswa ini mencerminkan komitmen kami dalam mengintegrasikan nilai-nilai keagamaan yang kuat dengan pendidikan modern yang relevan.</p>

      <h2>Bantuan Pendidikan Keluarga Kurang Mampu</h2>
      <p>Bagi keluarga yang membutuhkan, tersedia keringanan biaya SPP dengan persyaratan dan proses verifikasi yang <em>transparan dan adil</em>. Kami percaya bahwa keterbatasan ekonomi bukan alasan untuk berhenti belajar.</p>

      <h2>Beasiswa Yatim &amp; Piatu</h2>
      <p>Gratis biaya pendidikan penuh bagi siswa <strong>yatim atau piatu</strong> sebagai bentuk kepedulian sosial dan tanggung jawab sekolah terhadap generasi penerus bangsa.</p>

      <h3>Cara Mendaftar Beasiswa</h3>
      <p>Pendaftaran beasiswa sangat mudah. Kamu bisa:</p>
      <ul>
        <li>Datang langsung ke kantor administrasi sekolah pada hari kerja</li>
        <li>Menghubungi kami via WhatsApp untuk konsultasi dan panduan pendaftaran</li>
        <li>Menyiapkan dokumen pendukung sesuai jenis beasiswa yang dipilih</li>
      </ul>
      <p>Jangan biarkan biaya menjadi penghalang. Hubungi kami sekarang dan kami akan bantu sepenuh hati.</p>
    `,
        category: "Beasiswa",
        author: "Bagian Kesiswaan",
        authorRole: "SMA Plus Bina Trampil",
        date: "5 Februari 2026",
        readTime: "6 menit",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&q=80",
        metaDescription:
            "Informasi lengkap program beasiswa SMA Plus Bina Trampil 2026 untuk siswa berprestasi, tahfidz, kurang mampu, dan yatim piatu. Pendidikan berkualitas untuk semua.",
    },
];

export const getArticleBySlug = (slug: string): Article | undefined => {
    return articles.find((a) => a.slug === slug);
};
