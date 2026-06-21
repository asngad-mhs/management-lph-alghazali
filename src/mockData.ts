/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Profile, Layanan, Proses, Regulasi, Berita, FAQ, Kontak, SyncConfig, SyncLog, UserSession, PendaftaranSertifikatHalal, SertifikatHalalRecord, AuditJadwal, TanggungGugatRecord, TarifLayananRecord } from "./types";

export const initialProfile: Profile = {
  id: "prof_01",
  name: "Lembaga Pemeriksa Halal Al-Ghazali",
  alias: "LPH Al-Ghazali",
  vocation: "Lembaga Pemeriksa Halal (LPH) Pratama",
  institution: "Yayasan Universitas Islam Al-Ghazali (UNUGHA) Cilacap",
  established: "2023-08-15",
  decreeNumber: "SK-BPJPH/2023/X/0541",
  accreditation: "Terakreditasi Pratama oleh BPJPH Kemenag RI",
  address: "Jl. Kemerdekaan No. 12 Rawalo, Cilacap, Jawa Tengah 53272",
  phone: "+62 812-3456-7890",
  email: "lph.alghazali@unugha.ac.id",
  website: "https://lph.alghazali.or.id",
  vision: "Menjadi Lembaga Pemeriksa Halal yang profesional, kredibel, terpercaya, dan berbasis nilai-nilai keislaman Ahlussunnah wal Jama'ah An-Nahdliyah untuk mendukung Indonesia sebagai pusat industri halal dunia.",
  mission: [
    "Menyelenggarakan pemeriksaan kehalalan produk secara profesional, objektif, dan akuntabel sesuai syariat Islam.",
    "Mengembangkan kapasitas laboratorium pendukung uji kehalalan yang mutakhir.",
    "Memberikan pelayanan prima dan edukasi sertifikasi halal kepada pelaku usaha (UMKM) maupun industri besar.",
    "Bekerja sama dengan berbagai stakeholders dalam mendorong percepatan ekosistem halal nasional."
  ],
  sejarah: "Lembaga Pemeriksa Halal (LPH) Al-Ghazali didirikan sebagai wujud kepedulian sivitas akademika Universitas Islam Al-Ghazali (UNUGHA) Cilacap terhadap percepatan program jaminan produk halal di Indonesia. Berdiri resmi pada Agustus 2023 melalui SK Penetapan Badan Penyelenggara Jaminan Produk Halal (BPJPH), LPH Al-Ghazali berkomitmen melayani pemeriksaan dan pendampingan halal yang akuntabel, independen, dan terpercaya bagi sektor usaha mikro, kecil, menengah (UMKM) maupun industri manufaktur skala nasional.",
  kebijakanMutu: "LPH Al-Ghazali menerapkan Sistem Jaminan Mutu Pemeriksaan Halal yang berorientasi pada kepatuhan syariat, integritas ilmiah, kejujuran profesional, kerahasiaan data pelanggan, serta kecepatan proses layanan tanpa kompromi demi mewujudkan kepuasan pelaku usaha dan ketenteraman umat.",
  sasaranMutu: [
    "Ketepatan waktu penyelesaian laporan audit lapangan maksimal 14 hari kerja sejak penunjukan.",
    "Tingkat nilai kepuasan pelaku usaha (UMKM) terhadap keramahan dan kejelasan layanan minimal 92%.",
    "Nol keluhan perilaku tidak etis atau pelanggaran integritas (gratifikasi/suap) oleh seluruh personil LPH.",
    "Pelaksanaan bimbingan teknik dan sosialiasi edukasi halal minimal 4 kali dalam satu tahun operasional."
  ],
  strukturOrganisasiDesc: "Struktur kepengurusan LPH Al-Ghazali disusun secara profesional dan ramping untuk menjamin efisiensi alur kerja. Struktur dipimpin oleh Kepala LPH, dikontrol oleh Komite Syariat / Komite Fatwa, Auditor Kepala, Bidang Operasional Administrasi & Pelayanan, serta didukung oleh Peneliti Laboratorium Terpadu UNUGHA.",
  strukturOrganisasiImg: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
  auditors: [
    {
      id: "aud_01",
      nama: "Ir. H. Syarifuddin, M.Si",
      regNo: "REG-AUD-BPJPH-2512941",
      keahlian: "Rumpun Makanan Olahan, Kimia, Bahan Tambahan Makanan (BTM)",
      status: "Aktif"
    },
    {
      id: "aud_02",
      nama: "Dr. Hj. Siti Aminah, M.Pd",
      regNo: "REG-AUD-BPJPH-2301102",
      keahlian: "Rumpun Pertanian, Produk Hewani, Ritel & Logistik",
      status: "Aktif"
    },
    {
      id: "aud_03",
      nama: "Kurniawan Azis, S.TP, M.Sc",
      regNo: "REG-AUD-BPJPH-2615438",
      keahlian: "Teknologi Hasil Pertanian, Rumpun Minuman & Herbal, Kosmetik",
      status: "Aktif"
    }
  ],
  sdmSyariah: [
    {
      id: "sdm_01",
      nama: "K.H. Dr. Sahal Ghazali, Lc, M.A",
      peran: "Dewan Kehormatan / Komite Syariat LPH",
      sertifikasi: "Rekomendasi Dewan Syariah Nasional (DSN-MUI) No. DSN-493/DPS/XII/2022"
    },
    {
      id: "sdm_02",
      nama: "Ahmad Musthofa, M.H.I",
      peran: "Ahli Fikih Produk Halal / Perumus Kebijakan",
      sertifikasi: "Sertifikasi Kompetensi Ahli Syariah Jaminan Produk Halal JPH-SYR-031"
    }
  ],
  kerjasamaList: [
    {
      id: "ks_01",
      instansi: "Dinas Koperasi, Usaha Kecil Menengah dan Perdagangan Kab. Cilacap",
      jenis: "Penyelenggaraan Sertifikasi Halal Gratis (SEHATI) Reguler UMKM Binaan Daerah",
      tanggal: "2024-02-15",
      status: "Berjalan"
    },
    {
      id: "ks_02",
      instansi: "Lembaga Pemeriksa Halal (LPH) Universitas Airlangga (UNAIR)",
      jenis: "Aliansi Pengujian Laboratorium Kimia & Titik Kritis Enzimatis",
      tanggal: "2024-05-18",
      status: "Berjalan"
    },
    {
      id: "ks_03",
      instansi: "Asosiasi Industri UMKM Pengolah Makanan Eks-Karesidenan Banyumas",
      jenis: "Edukasi Berkelanjutan, Pelatihan Penyelia Halal, & Konsultasi Pra-Audit",
      tanggal: "2024-09-01",
      status: "Berjalan"
    }
  ]
};

export const initialLayanan: Layanan[] = [
  {
    id: "lay_01",
    kode: "SRV-MICRO",
    nama: "Pemeriksaan Halal Produk Makanan / Minuman (Mikro & Kecil)",
    deskripsi: "Pemeriksaan dan sertifikasi proses perolehan halal bagi pelaku usaha berskala mikro dan kecil jalur reguler.",
    kategori: "Sertifikasi",
    estimasiHari: 12,
    biayaNominal: 350000,
    persyaratan: [
      "NIB (Nomor Induk Berusaha)",
      "KTP Pemilik Usaha",
      "Dokumen Sistem Jaminan Produk Halal (SJPH)",
      "Daftar bahan baku & matriks produk",
      "Diagram alur proses produksi"
    ]
  },
  {
    id: "lay_02",
    kode: "SRV-IND",
    nama: "Pemeriksaan Halal Industri Menengah & Besar",
    deskripsi: "Pemeriksaan dokumen, kesesuaian bahan, dan verifikasi pabrik (on-site audit) produk olahan kelas industri menengah dan manufaktur besar.",
    kategori: "Sertifikasi",
    estimasiHari: 21,
    biayaNominal: 3000000,
    persyaratan: [
      "NIB terdaftar",
      "Manual SJPH (Sistem Jaminan Produk Halal) lengkap",
      "Dokumen asal-usul bahan baku & sertifikat halal bahan penolong",
      "Izin Edar BPOM atau PIRT (jika ada)",
      "Peta tata letak ruangan produksi"
    ]
  },
  {
    id: "lay_03",
    kode: "SRV-TRAIN",
    nama: "Sosialisasi & Pelatihan Penyelia Halal",
    deskripsi: "Pelatihan teknis bagi calon Penyelia Halal di internal perusahaan agar memahami tata cara pendaftaran, manual SJPH, dan audit internal.",
    kategori: "Pelatihan",
    estimasiHari: 3,
    biayaNominal: 750000,
    persyaratan: [
      "Curriculum Vitae (CV) peserta",
      "Ijazah minimal SMA/Sederajat",
      "Surat rekomendasi dari manajemen perusahaan"
    ]
  },
  {
    id: "lay_04",
    kode: "SRV-CONS",
    nama: "Konsultasi Kesiapan Audit Halal (Pre-Audit)",
    deskripsi: "Layanan pendampingan konsultatif untuk meninjau kecukupan dokumen bahan baku dan alur fasilitas produksi sebelum didaftarkan ke Sihalal.",
    kategori: "Konsultasi",
    estimasiHari: 5,
    biayaNominal: 500000,
    persyaratan: [
      "Data daftar bahan baku sementara",
      "Pertanyaan spesifik terkait titik kritis bahan"
    ]
  }
];

export const initialProses: Proses[] = [
  {
    id: "pro_01",
    langkah: 1,
    namaTahapan: "Pengajuan & Verifikasi Dokumen",
    deskripsi: "Pelaku usaha mendaftar via aplikasi Sihalal BPJPH, memilih LPH Al-Ghazali. Admin memverifikasi keaslian dan kelengkapan berkas pendaftaran.",
    penanggungJawab: "Admin LPH & Sekretariat",
    estimasiWaktu: "1-2 Hari kerja",
    statusKritikal: "Rendah"
  },
  {
    id: "pro_02",
    langkah: 2,
    namaTahapan: "Penetapan Tim Auditor Halal",
    deskripsi: "LPH Al-Ghazali menunjuk auditor halal kompeten (minimal 2 orang auditor) yang sesuai dengan kategori rumpun produk yang diajukan.",
    penanggungJawab: "Kepala LPH Al-Ghazali",
    estimasiWaktu: "1 Hari kerja",
    statusKritikal: "Sedang"
  },
  {
    id: "pro_03",
    langkah: 3,
    namaTahapan: "Audit Lapangan (On-Site Audit)",
    deskripsi: "Auditor mendatangi fasilitas produksi pelaku usaha untuk mencocokkan bahan baku, tata tertib sanitasi, alat pemotongan/pengolahan, dan penyimpanan.",
    penanggungJawab: "Tim Auditor Halal",
    estimasiWaktu: "1-3 Hari kerja",
    statusKritikal: "Tinggi"
  },
  {
    id: "pro_04",
    langkah: 4,
    namaTahapan: "Rapat Komisi Fatwa & Laporan Hasil",
    deskripsi: "Auditor mengompilasi laporan hasil pemeriksaan. Jika ada bahan kritis, dilakukan pengujian lab terlebih dahulu. Selanjutnya sidang penetapan kehalalan.",
    penanggungJawab: "Tim Auditor & Komisi Fatwa MUI/BPJPH",
    estimasiWaktu: "3-5 Hari kerja",
    statusKritikal: "Tinggi"
  },
  {
    id: "pro_05",
    langkah: 5,
    namaTahapan: "Penerbitan Ketetapan Halal",
    deskripsi: "Sertifikasi kehalalan produk ditandatangani dan ketetapan halal diunggah kembali ke sistem BPJPH untuk penerbitan Sertifikat Halal resmi.",
    penanggungJawab: "BPJPH Kemenag RI / Admin LPH",
    estimasiWaktu: "2-4 Hari kerja",
    statusKritikal: "Sedang"
  }
];

export const initialRegulasi: Regulasi[] = [
  {
    id: "reg_01",
    nomorAturan: "Undang-Undang No. 33 Tahun 2014",
    tentang: "Jaminan Produk Halal (JPH) yang mewajibkan seluruh produk yang beredar di wilayah RI bersertifikasi halal secara bertahap.",
    tahun: 2014,
    sumber: "Pemerintah RI / DPR-RI",
    kategori: "Undang-Undang",
    statusBerlaku: true,
    linkDokumen: "https://jdih.kemenag.go.id/Files/Regulasi/UU_33_2014.pdf"
  },
  {
    id: "reg_02",
    nomorAturan: "Peraturan Pemerintah No. 39 Tahun 2021",
    tentang: "Penyelenggaraan Bidang Jaminan Produk Halal, merinci peran LPH, tata cara registrasi, dan tarif pendaftaran sanksi.",
    tahun: 2021,
    sumber: "Presiden RI",
    kategori: "Peraturan Menteri",
    statusBerlaku: true,
    linkDokumen: "https://jdih.setkab.go.id/PUUdoc-176395-PP_Nomor_39_Tahun_2021.pdf"
  },
  {
    id: "reg_03",
    nomorAturan: "SK Kepala BPJPH No. 150 Tahun 2022",
    tentang: "Pedoman Modul Penilaian Akreditasi Lembaga Pemeriksa Halal (LPH) Pratama, Madya, dan Utama.",
    tahun: 2022,
    sumber: "Badan Penyelenggara Jaminan Produk Halal",
    kategori: "Keputusan BPJPH",
    statusBerlaku: true,
    linkDokumen: "https://halal.go.id/dokumen/Keputusan_Kepala_BPJPH_150_2022.pdf"
  },
  {
    id: "reg_04",
    nomorAturan: "SOP-LPHAG-002 Rev.1",
    tentang: "Prosedur Hubungan Industrial dan Penanganan Konflik Kepentingan Auditor LPH Al-Ghazali.",
    tahun: 2023,
    sumber: "SOP Internal LPH Al-Ghazali",
    kategori: "SOP Internal",
    statusBerlaku: true,
    linkDokumen: "#"
  }
];

export const initialBerita: Berita[] = [
  {
    id: "news_01",
    judul: "LPH Al-Ghazali UNUGHA Cilacap Selenggarakan Bimbingan Teknis Penyelia Halal UMKM Jateng",
    ringkasan: "Sebanyak 50 UMKM binaan mendapatkan pendampingan jaminan produk halal secara gratis dan penyusunan manual SJPH.",
    konten: "CILACAP - Lembaga Pemeriksa Halal (LPH) Al-Ghazali yang berada di bawah naungan Universitas Islam Al-Ghazali (UNUGHA) Cilacap menggelar bimbingan teknis penyusunan dokumen sertifikasi halal secara mandiri bagi para industri rumahan mikro di Jawa Tengah. Acara ini dihadiri oleh para pegiat ekosistem makanan olahan cilacap dan didukung oleh dinas koperasi setempat.\n\nKetua LPH Al-Ghazali menyampaikan, pendampingan ini dilakukan sebagai bakti kampus dalam menopang kewajiban sertifikasi halal tahap pertama Oktober 2026. Melalui kegiatan ini diharapkan para pelaku usaha paham titik kritis cemaran babi, bangkai, khamr, maupun kelengkapan berkas administrasi seperti NIB dan SJPH. Peserta dibimbing langsung oleh Auditor LPH secara bergiliran hingga dokumen siap unggah di portal SiHalal.",
    penulis: "Admin Humas",
    tanggalPublikasi: "2026-05-12",
    kategori: "Kegiatan",
    status: "Dipublikasikan",
    gambarUrl: "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=400",
    views: 245
  },
  {
    id: "news_02",
    judul: "Mengenal Titik Kritis Kehalalan pada Produk Bakery Tradisional",
    ringkasan: "Edukasi penting mengenai pemilihan khamir, kuas bulu binatang, rhum perisa, serta bahan pelembut kue dari turunan lemak.",
    konten: "Bahan pembuatan kue atau roti (bakery) sekilas tampak tidak memiliki titik kritis karena didominasi tepung dan gula. Namun, dalam tinjauan LPH Al-Ghazali, terdapat beberapa bahan yang sangat kritis:\n\n1. Ragi/Khamir (Yeast): Terkadang membutuhkan nutrisi yang diaktifkan dengan enzim dari usus hewan.\n2. Kuas pengoles mentega (Kuas bulu): Sering kali kuas bulu impor berbahan babi (bristle). Gantilah dengan kuas silikon.\n3. Pewarna makanan & Emulsifier: Pelembut kue lecithin sering diekstrak dari jaringan babi atau sapi non-syar'i.\n\nDisarankan para pelaku usaha teliti memilih merk ragi dan margarin yang sudah jelas memiliki ketetapan halal dari BPJPH demi ketenangan rohani konsumen.",
    penulis: "Ustadz H. Ahmad Amin, M.Si (Auditor)",
    tanggalPublikasi: "2026-06-05",
    kategori: "Edukasi",
    status: "Dipublikasikan",
    gambarUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400",
    views: 412
  },
  {
    id: "news_03",
    judul: "Pengumuman Jadwal Audit Lapangan Kolektif UMKM Selama Bulan Ramadhan",
    ringkasan: "Penyesuaian tata letak kunjungan luar kota serta komitmen akreditasi tetap beroperasi prima tanpa libur.",
    konten: "Menyambut bulan suci Ramadhan, pengurus LPH Al-Ghazali memberitahukan penyesuaian jadwal operasional auditor. Seluruh kegiatan klarifikasi bahan baku dan visitasi pabrik tetap dilangsungkan dengan penyesuaian jam kerja mulai pukul 08.00 hingga 14.30 WIB.\n\nPendaftaran melingkupi UMKM wilayah eks-Karesidenan Banyumas dapat menyertakan berkas koordinasi agar kunjungan auditor dilakukan secara serentak, mengurangi beban transportasi pendaftaran mandiri pelaku usaha.",
    penulis: "Sekretariat LPH",
    tanggalPublikasi: "2026-06-18",
    kategori: "Pengumuman",
    status: "Draft",
    gambarUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=400",
    views: 0
  }
];

export const initialFAQ: FAQ[] = [
  {
    id: "faq_01",
    pertanyaan: "Berapakah lama masa berlaku Sertifikat Halal yang diterbitkan saat ini?",
    jawaban: "Sesuai dengan Undang-Undang No. 6 Tahun 2023 (UU Cipta Kerja), Sertifikat Halal berlaku SELAMANYA atau sepanjang tidak ada perubahan proses produksi, formulasi bahan, maupun nama brand dari produk tersebut.",
    kategori: "Sertifikasi",
    diperbarui: "2026-01-10"
  },
  {
    id: "faq_02",
    pertanyaan: "Bagaimana cara menentukan apakah fasilitas produksi saya memenuhi syarat higienis halal?",
    jawaban: "Prinsip dasar fasilitas halal adalah bebas dari cemaran bahan najis. Alat produksi dilarang digunakan bergantian antara daging babi dengan bahan halal lainnya. Penyimpanan bahan baku babi sekecil apapun harus terpisah total.",
    kategori: "Proses Kontrak",
    diperbarui: "2026-02-20"
  },
  {
    id: "faq_03",
    pertanyaan: "Berapa biaya pemeriksaan halal untuk UKM Reguler di LPH Al-Ghazali?",
    jawaban: "Sesuai ketentuan tarif resmi dari BPJPH, biaya penanganan pemeriksaan halal mikro reguler berkisar Rp 350.000,- (belum termasuk biaya transportasi & akomodasi auditor jika berada di lokasi terpencil di luar radius standar pelayanan).",
    kategori: "Biaya",
    diperbarui: "2026-04-15"
  }
];

export const initialKontak: Kontak[] = [
  {
    id: "kon_01",
    namaPengirim: "CV. Makmur Kuliner Salaman",
    emailPengirim: "makmurkuliner@gmail.com",
    subjek: "Pertanyaan Kelayakan Ragi Tepung Asing",
    pesan: "Halo LPH Al-Ghazali, kami mempunyai produk ragi instan buatan China yang berlogo halal asing, namun tidak terdaftar di daftar BPJPH. Apakah bahan ini bisa lolos tahap regular audit?",
    tanggalKirim: "2026-06-18 10:20:00",
    telahDibaca: true,
    balasan: "Yth. CV Makmur Kuliner, jika logo halal asing dikeluarkan oleh Lembaga Halal Luar Negeri yang telah melakukan Mutual Recognition Agreement (MRA) dengan BPJPH, maka bahan tersebut bisa diterima langsung tanpa sertifikat halal tambahan. Jika tidak dalam daftar MRA, maka Anda wajib menyertakan sertifikasi uji lab independen atau mengganti merk ragi."
  },
  {
    id: "kon_02",
    namaPengirim: "Ibu Hartati (Katering Berkah)",
    emailPengirim: "hartatikatering@yahoo.co.id",
    subjek: "Permohonan Kunjungan Pendampingan",
    pesan: "Kami memiliki katering yang rutin menyuplai instansi PNS di Cilacap dan diwajibkan menyertakan sertifikat halal. Kapan bimbingan dari LPH UNUGHA Al-Ghazali diadakan kembali?",
    tanggalKirim: "2026-06-19 15:45:00",
    telahDibaca: false
  }
];

export const initialSyncLogs: SyncLog[] = [
  {
    id: "log_01",
    timestamp: "2026-06-20T05:10:00-07:00",
    tipeOperasi: "TEST_CONNECTION",
    entitas: "System Client Gateway",
    status: "Berhasil",
    pesan: "Berhasil terhubung ke Endpoint API LPH Al-Ghazali 1. Latensi 120ms. Status Kode 200 OK."
  },
  {
    id: "log_02",
    timestamp: "2026-06-20T05:15:00-07:00",
    tipeOperasi: "PULL",
    entitas: "Semua Data",
    status: "Berhasil",
    pesan: "Sinkronisasi selesai: 4 Layanan diperbarui, 3 Regulasi diimpor baru dari Server LPH Pusat."
  }
];

export const initialSyncConfig: SyncConfig = {
  apiUrl: "https://api.lph-alghazali.com/v1",
  apiKey: "lph_agh_secret_token_2026",
  clientSecret: "client_secret_unugha_indonesia",
  autoSync: false,
  syncIntervalMinutes: 30,
  lastSyncedAt: "2026-06-20 05:15:00"
};

export const defaultUserSession: UserSession = {
  id: "session_01",
  name: "",
  email: "",
  role: "Admin Manager"
};

export const initialPendaftaran: PendaftaranSertifikatHalal[] = [
  {
    id: "reg_01",
    namaPerusahaan: "Rempah Sari Barokah",
    namaProduk: "Sambal Pecel Blitar & Serundeng Gurih",
    tanggalDaftar: "2026-06-05",
    jenisProduk: "Makanan Olahan",
    nomorKontak: "0813-9876-5432",
    status: "Diproses"
  },
  {
    id: "reg_02",
    namaPerusahaan: "Susu Kedelai Al-Barokah UNUGHA",
    namaProduk: "Sari Kedelai Rasa Melon & Cokelat",
    tanggalDaftar: "2026-06-12",
    jenisProduk: "Minuman Kemasan",
    nomorKontak: "0857-4444-2222",
    status: "Diproses"
  },
  {
    id: "reg_03",
    namaPerusahaan: "Bakso Krikil Mas Prianto",
    namaProduk: "Bakso Sapi Beku & Bumbu Kaldu Kuah",
    tanggalDaftar: "2026-06-18",
    jenisProduk: "Daging & Produk Olahan",
    nomorKontak: "0821-3355-7799",
    status: "Draf"
  },
  {
    id: "reg_04",
    namaPerusahaan: "Krupuk Tengiri Maju Lestari",
    namaProduk: "Krupuk Tengiri Renyah Khas Cilacap",
    tanggalDaftar: "2026-05-20",
    jenisProduk: "Makanan Olahan / Snacking",
    nomorKontak: "0899-7777-8888",
    status: "Selesai"
  }
];

export const initialSertifikatRecords: SertifikatHalalRecord[] = [
  {
    id: "cert_01",
    nomorSertifikat: "ID33110000456210323",
    namaPerusahaan: "Ayam Goreng Penyet Bu Laras",
    namaProduk: "Ayam Goreng, Bebek Bakar, Sambal Bawang",
    tanggalTerbit: "2024-03-24",
    tanggalKadaluarsa: "2028-03-24",
    status: "Berlaku"
  },
  {
    id: "cert_02",
    nomorSertifikat: "ID33210001890450524",
    namaPerusahaan: "Kopi Robusta Lereng Slamet",
    namaProduk: "Kopi Bubuk Murni Robusta & Arabika",
    tanggalTerbit: "2024-05-12",
    tanggalKadaluarsa: "2028-05-12",
    status: "Berlaku"
  },
  {
    id: "cert_03",
    nomorSertifikat: "ID33120000109981123",
    namaPerusahaan: "Catering Berkah Barokah",
    namaProduk: "Nasi Box, Tumpeng Kuning, Kue Basah Layanan",
    tanggalTerbit: "2023-11-15",
    tanggalKadaluarsa: "2027-11-15",
    status: "Berlaku"
  }
];

export const initialAuditJadwal: AuditJadwal[] = [
  {
    id: "audj_01",
    namaPerusahaan: "Rempah Sari Barokah",
    tanggalAudit: "2026-06-25",
    lokasi: "Jl. Diponegoro No. 84, Cilacap",
    auditorPenanggungJawab: "Ir. H. Syarifuddin, M.Si",
    status: "Terjadwal"
  },
  {
    id: "audj_02",
    namaPerusahaan: "Susu Kedelai Al-Barokah UNUGHA",
    tanggalAudit: "2026-06-23",
    lokasi: "Kantin Terpadu Kampus UNUGHA Cilacap",
    auditorPenanggungJawab: "Kurniawan Azis, S.TP, M.Sc",
    status: "Terjadwal"
  },
  {
    id: "audj_03",
    namaPerusahaan: "Krupuk Tengiri Maju Lestari",
    tanggalAudit: "2026-05-25",
    lokasi: "SDA Industri Nelayan Cilacap Selatan",
    auditorPenanggungJawab: "Dr. Hj. Siti Aminah, M.Pd",
    status: "Laporan Selesai"
  }
];

export const initialTanggungGugat: TanggungGugatRecord[] = [
  {
    id: "tg_01",
    nomorKasus: "TG-2026-001",
    subjek: "Keterlambatan Pengiriman Laporan Hasil Pemeriksaan",
    deskripsi: "Pelaku usaha menyatakan keberatan karena hasil evaluasi kecocokan bahan kritis memakan waktu 3 minggu melebihi SOP 14 hari.",
    tanggalPengajuan: "2026-06-10",
    pihakPelakuUsaha: "CV. Makmur Kuliner Nusantara",
    status: "Proses Investigasi",
    tindakanLph: "Sedang diklarifikasi dengan Lab mitra pengujian biologi molekuler halal rujukan."
  },
  {
    id: "tg_02",
    nomorKasus: "TG-2026-002",
    subjek: "Ketidaksesuaian Hasil Rekomendasi Auditor",
    deskripsi: "Keberatan atas status penundaan akibat temuan kuas bulu babi pada panggangan roti yang diklaim pelaku usaha sebagai kuas nilon sintetis.",
    tanggalPengajuan: "2026-06-15",
    pihakPelakuUsaha: "Sari Roti Barokah Cilacap",
    status: "Sidang Komite",
    tindakanLph: "Dilakukan pengujian sampel kuas di laboratorium independen universitas untuk uji FTIR protein keratin bulu hewan."
  },
  {
    id: "tg_03",
    nomorKasus: "TG-2026-003",
    subjek: "Keberatan Selisih Biaya Akomodasi Lapangan",
    deskripsi: "Komplain mengenai penagihan tambahan biaya transportasi penyeberangan kapal ke Pulau Nusakambangan yang tidak tercantum di rincian awal.",
    tanggalPengajuan: "2026-05-18",
    pihakPelakuUsaha: "Koperasi Nelayan Mina Bahari",
    status: "Selesai Solusi",
    tindakanLph: "LPH menyetujui penghapusan biaya tambahan selisih penyeberangan karena kelalaian administrasi estimasi awal."
  }
];

export const initialTarifLayanan: TarifLayananRecord[] = [
  {
    id: "tf_01",
    namaSkema: "Sertifikasi Halal Reguler - Jalur Mandiri",
    kategoriUsaha: "Usaha Mikro & Kecil (UMK)",
    tarifDasar: 350000,
    tarifTransportasi: 150000,
    keterangan: "Tarif resmi BPJPH sesuai PMK No.57/2021 untuk pendaftaran mandiri non-subsidi."
  },
  {
    id: "tf_02",
    namaSkema: "Pemeriksaan Halal Bahan Olahan Hewani",
    kategoriUsaha: "Usaha Menengah",
    tarifDasar: 1500000,
    tarifTransportasi: 500000,
    keterangan: "Mencakup pemetaan rumah potong hewan asal dan verifikasi halal 3 lapis rantai pasok bumbu hidrolisat protein."
  },
  {
    id: "tf_03",
    namaSkema: "Pemeriksaan Halal Multi-Plant & Produk Kompleks",
    kategoriUsaha: "Usaha Besar",
    tarifDasar: 3000000,
    tarifTransportasi: 1000000,
    keterangan: "Audit lini pabrik otomatis terpisah, pengujian sampel PCR wajib unt kandungan babi / alkohol tinggi, & 5+ cabang distribusi."
  },
  {
    id: "tf_04",
    namaSkema: "Pemeriksaan Halal RPH / RPU Sertifikasi Ekspor",
    kategoriUsaha: "Luar Negeri / Internasional",
    tarifDasar: 5000000,
    tarifTransportasi: 2500000,
    keterangan: "Audit pemeriksaan rumah sembelih hewan skala ekspor dengan standar AS/NZS & ISO/IEC 17025."
  }
];

