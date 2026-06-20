/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "Admin" | "User";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
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

export interface Proses {
  id: string;
  langkah: number;
  namaTahapan: string;
  deskripsi: string;
  penanggungJawab: string;
  estimasiWaktu: string;
  statusKritikal: "Tinggi" | "Sedang" | "Rendah";
}

export interface Regulasi {
  id: string;
  nomorAturan: string;
  tentang: string;
  tahun: number;
  sumber: string; // e.g., "UU RI", "PMA", "Keputusan Kepala BPJPH"
  kategori: "Undang-Undang" | "SOP Internal" | "Peraturan Menteri" | "Keputusan BPJPH";
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
  kategori: "Edukasi" | "Kegiatan" | "Pengumuman" | "Opini";
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
