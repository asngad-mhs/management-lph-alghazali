/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "Admin Manager" | "Editor" | "Auditor" | "Staf" | "User";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuditorHalalItem {
  id: string;
  nama: string;
  regNo: string;
  keahlian: string;
  status: "Aktif" | "Nonaktif";
}

export interface SDMSyariahItem {
  id: string;
  nama: string;
  peran: string;
  sertifikasi: string;
}

export interface KerjasamaItem {
  id: string;
  instansi: string;
  jenis: string;
  tanggal: string;
  status: "Berjalan" | "Selesai" | "Draf";
}

export interface Profile {
  id: string;
  name: string;
  alias: string;
  vocation: string; // e.g. "Lembaga Pemeriksa Halal"
  institution: string; // e.g. "Yayasan Universitas Islam Al-Ghazali"
  established: string;
  decreeNumber: string; // SK penetapan
  accreditation: string; // Status akreditasi
  address: string;
  phone: string;
  email: string;
  website: string;
  vision: string;
  mission: string[];
  sejarah?: string;
  kebijakanMutu?: string;
  sasaranMutu?: string[];
  strukturOrganisasiDesc?: string;
  strukturOrganisasiImg?: string;
  auditors?: AuditorHalalItem[];
  sdmSyariah?: SDMSyariahItem[];
  kerjasamaList?: KerjasamaItem[];
}

export interface Layanan {
  id: string;
  kode: string;
  nama: string;
  deskripsi: string;
  kategori: "Sertifikasi" | "Pendampingan" | "Pelatihan" | "Konsultasi";
  estimasiHari: number;
  biayaNominal: number;
  persyaratan: string[]; // List of requirements
}

export interface PendaftaranSertifikatHalal {
  id: string;
  namaPerusahaan: string;
  namaProduk: string;
  tanggalDaftar: string;
  jenisProduk: string;
  nomorKontak: string;
  status: "Draf" | "Diproses" | "Selesai" | "Ditolak";
}

export interface SertifikatHalalRecord {
  id: string;
  nomorSertifikat: string;
  namaPerusahaan: string;
  namaProduk: string;
  tanggalTerbit: string;
  tanggalKadaluarsa: string;
  status: "Berlaku" | "Kadaluarsa";
}

export interface AuditJadwal {
  id: string;
  namaPerusahaan: string;
  tanggalAudit: string;
  lokasi: string;
  auditorPenanggungJawab: string;
  status: "Terjadwal" | "Sedang Audit" | "Laporan Selesai";
}

export interface Proses {
  id: string;
  langkah: number;
  namaTahapan: string;
  deskripsi: string;
  penanggungJawab: string;
  estimasiWaktu: string;
  statusKritikal: "Tinggi" | "Sedang" | "Rendah";
}

export interface TanggungGugatRecord {
  id: string;
  nomorKasus: string;
  subjek: string;
  deskripsi: string;
  tanggalPengajuan: string;
  pihakPelakuUsaha: string;
  status: "Diterima" | "Proses Investigasi" | "Sidang Komite" | "Selesai Solusi";
  tindakanLph?: string;
}

export interface TarifLayananRecord {
  id: string;
  namaSkema: string;
  kategoriUsaha: "Usaha Mikro & Kecil (UMK)" | "Usaha Menengah" | "Usaha Besar" | "Luar Negeri / Internasional";
  tarifDasar: number;
  tarifTransportasi: number;
  keterangan: string;
}

export interface Regulasi {
  id: string;
  nomorAturan: string;
  tentang: string;
  tahun: number;
  sumber: string; // e.g., "UU RI", "PMA", "Keputusan Kepala BPJPH"
  kategori: 
    | "Undang-undang RI" 
    | "Peraturan Pemerintah" 
    | "Keputusan Menteri Agama" 
    | "Keputusan Kepala BPJPH" 
    | "Peraturan BPOM" 
    | "Standar Nasional (SNI)" 
    | "Fatwa MUI" 
    | "Undang-Undang" 
    | "SOP Internal" 
    | "Peraturan Menteri";
  statusBerlaku: boolean;
  linkDokumen: string;
}

export interface Berita {
  id: string;
  judul: string;
  ringkasan: string;
  konten: string;
  penulis: string;
  tanggalPublikasi: string;
  kategori: "Berita utama" | "Kegiatan" | "Agenda" | "Edukasi" | "Pengumuman" | "Opini";
  status: "Dipublikasikan" | "Draft";
  gambarUrl?: string;
  views: number;
}

export interface FAQ {
  id: string;
  pertanyaan: string;
  jawaban: string;
  kategori: "Sertifikasi" | "Sihalal" | "Biaya" | "Proses Kontrak";
  diperbarui: string;
}

export interface Kontak {
  id: string;
  namaPengirim: string;
  emailPengirim: string;
  subjek: string;
  pesan: string;
  tanggalKirim: string;
  telahDibaca: boolean;
  balasan?: string;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  tipeOperasi: "PUSH" | "PULL" | "TEST_CONNECTION";
  entitas: string; // e.g. "Layanan", "Semua Data", "Berita"
  status: "Berhasil" | "Gagal" | "Tertunda";
  pesan: string;
  responsePayload?: string;
}

export interface SyncConfig {
  apiUrl: string;
  apiKey: string;
  clientSecret: string;
  autoSync: boolean;
  syncIntervalMinutes: number;
  lastSyncedAt?: string;
}
