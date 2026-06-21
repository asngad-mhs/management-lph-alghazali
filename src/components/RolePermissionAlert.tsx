import React from "react";
import { 
  Shield, 
  Edit3, 
  ClipboardCheck, 
  Inbox, 
  Eye, 
  Lock, 
  Unlock, 
  AlertCircle,
  CheckCircle2,
  HelpCircle
} from "lucide-react";
import { UserRole } from "../types";

interface RolePermissionProps {
  role: UserRole;
  activeTab: string;
}

export default function RolePermissionAlert({ role, activeTab }: RolePermissionProps) {
  // Determine permission details dynamically
  const getPermissionSpecs = () => {
    switch (activeTab) {
      case "dashboard":
        return {
          title: "Dashboard Statistika",
          desc: role === "Admin Manager" 
            ? "Melihat seluruh grafik perkembangan, log mutasi operasional, dan bypass data master secara real-time."
            : role === "Editor"
            ? "Meninjau diagram statistika LPH sebagai referensi dalam penulisan berita, FAQ, dan profil publik."
            : role === "Auditor"
            ? "Menganalisis matriks kepatuhan, kuantitas regulasi JPH, dan durasi rata-rata proses sertifikasi."
            : role === "Staf"
            ? "Memantau inbox konsultasi masuk, grafik kesiapan pelayanan, dan volume balasan pesan UMKM."
            : "Melihat visualisasi ringkasan kinerja LPH Al-Ghazali.",
          status: "Read-Only (Interaktif)",
          colorClass: "bg-slate-50 border-slate-200 text-slate-800",
          icon: <CheckCircle2 size={15} className="text-emerald-600" />,
          badge: "bg-slate-100 text-slate-700",
          allowed: true
        };

      case "profile":
        const hasProfileEdit = role === "Admin Manager" || role === "Editor";
        return {
          title: "Profil & Hak Akses Penuh Submenu Kelembagaan",
          desc: hasProfileEdit
            ? "Anda memiliki hak akses CRUD penuh untuk delapan sub-layanan: Profil LPH, Sejarah, Visi Misi, Kebijakan/Sasaran Mutu, Struktur Organisasi, Auditor Halal, SDM Syariah, dan partner Kerjasama."
            : `Mode Tinjau. Perubahan 8 submenu profil hanya diperbolehkan untuk Admin Manager atau Editor (saat ini Anda sebagai ${role}).`,
          status: hasProfileEdit ? "Akses Edit Aktif" : "Read-Only (Tergembok)",
          colorClass: hasProfileEdit
            ? "bg-emerald-50/50 border-emerald-500/20 text-emerald-950"
            : "bg-amber-50/50 border-amber-500/25 text-amber-900",
          icon: hasProfileEdit ? <Unlock size={15} className="text-emerald-600" /> : <Lock size={15} className="text-amber-600" />,
          badge: hasProfileEdit ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-850",
          allowed: hasProfileEdit
        };

      case "layanan":
        const hasLayananEdit = role === "Admin Manager" || role === "Auditor";
        return {
          title: "Layanan Halal & Hak Akses Penuh Submenu",
          desc: hasLayananEdit
            ? "Anda memiliki hak akses penuh untuk melakukan semua manajemen CRUD di empat sub-layanan: Pendaftaran Sertifikat Halal, Ruang Lingkup & Layanan Pemeriksaan Halal, Pencarian Sertifikasi Halal, dan Daftar Audit."
            : `Mode Tinjau. Perubahan 4 submenu layanan halal hanya diperbolehkan untuk Admin Manager atau Auditor (saat ini Anda sebagai ${role}).`,
          status: hasLayananEdit ? "Akses Edit Aktif" : "Read-Only (Tergembok)",
          colorClass: hasLayananEdit
            ? "bg-emerald-50/50 border-emerald-500/20 text-emerald-950"
            : "bg-amber-50/50 border-amber-500/25 text-amber-900",
          icon: hasLayananEdit ? <Unlock size={15} className="text-emerald-600" /> : <Lock size={15} className="text-amber-600" />,
          badge: hasLayananEdit ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-850",
          allowed: hasLayananEdit
        };

      case "proses":
        const hasProsesEdit = role === "Admin Manager" || role === "Auditor";
        return {
          title: "Proses, Tahapan, Tanggung Gugat & Tarif Layanan",
          desc: hasProsesEdit
            ? "Anda memiliki hak akses penuh untuk melakukan semua CRUD di sub-menu Alur Sertifikasi, Prosedur Tanggung Gugat, dan Tarif Layanan Resmi."
            : `Mode Tinjau. Perubahan 3 submenu proses & tahapan hanya diperbolehkan untuk Admin Manager atau Auditor (saat ini Anda sebagai ${role}).`,
          status: hasProsesEdit ? "Akses Edit Aktif" : "Read-Only (Tergembok)",
          colorClass: hasProsesEdit
            ? "bg-emerald-50/50 border-emerald-500/20 text-emerald-950"
            : "bg-amber-50/50 border-amber-500/25 text-amber-900",
          icon: hasProsesEdit ? <Unlock size={15} className="text-emerald-600" /> : <Lock size={15} className="text-amber-600" />,
          badge: hasProsesEdit ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-850",
          allowed: hasProsesEdit
        };

      case "regulasi":
        const hasRegulasiEdit = true;
        return {
          title: "Sistem Regulasi JPH & 7 Sub-Menu",
          desc: "Anda memiliki hak akses penuh ke semua sistem untuk melakukan semua tindakan CRUD (Tambah, Edit, Hapus) di sub-menu Undang-undang RI, Peraturan Pemerintah, Keputusan Menteri Agama, Keputusan Kepala BPJPH, Peraturan BPOM, Standar Nasional (SNI), dan Fatwa MUI.",
          status: "Akses Edit Penuh Aktif",
          colorClass: "bg-emerald-50/50 border-emerald-500/20 text-emerald-950",
          icon: <Unlock size={15} className="text-emerald-600" />,
          badge: "bg-emerald-100 text-emerald-800",
          allowed: true
        };

      case "berita":
        const hasBeritaEdit = true;
        return {
          title: "Portal Berita & Edukasi Syiar",
          desc: "Anda memiliki hak akses penuh ke semua sistem untuk melakukan semua tindakan CRUD (Tambah, Edit, Hapus) di sub-menu Berita utama, Kegiatan, dan Agenda.",
          status: "Akses Edit Penuh Aktif",
          colorClass: "bg-emerald-50/50 border-emerald-500/20 text-emerald-950",
          icon: <Unlock size={15} className="text-emerald-600" />,
          badge: "bg-emerald-100 text-emerald-800",
          allowed: true
        };

      case "faq":
        const hasFaqEdit = role === "Admin Manager" || role === "Editor";
        return {
          title: "Kumpulan Tanya Jawab (FAQ)",
          desc: hasFaqEdit
            ? "Akses editor aktif. Anda memiliki otorisasi penuh untuk menyunting tanya-jawab seputar pendaftaran Sihalal."
            : `Mode Tinjau. Modifikasi bank soal FAQ dibatasi khusus untuk Admin Manager atau tim Editor Konten LPH.`,
          status: hasFaqEdit ? "Akses Edit Aktif" : "Read-Only (Tergembok)",
          colorClass: hasFaqEdit
            ? "bg-emerald-50/50 border-emerald-500/20 text-emerald-950"
            : "bg-amber-50/50 border-amber-500/25 text-amber-900",
          icon: hasFaqEdit ? <Unlock size={15} className="text-emerald-600" /> : <Lock size={15} className="text-amber-600" />,
          badge: hasFaqEdit ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-850",
          allowed: hasFaqEdit
        };

      case "kontak":
        const hasKontakEdit = role === "Admin Manager" || role === "Staf";
        return {
          title: "Inbox Hubungan Masyarakat & Konsultasi",
          desc: hasKontakEdit
            ? "Anda terdaftar sebagai Operator Kontak. Anda berhak membalas, menandai dibaca, atau menambahkan respon tanggapan."
            : `Mode Tinjau. Pengelolaan korespondensi dan balasan pesan secara eksklusif dikerjakan oleh Admin atau Staf LPH.`,
          status: hasKontakEdit ? "Akses Operator Aktif" : "Read-Only (Tergembok)",
          colorClass: hasKontakEdit
            ? "bg-emerald-50/50 border-emerald-500/20 text-emerald-950"
            : "bg-amber-50/50 border-amber-500/25 text-amber-900",
          icon: hasKontakEdit ? <Unlock size={15} className="text-emerald-600" /> : <Lock size={15} className="text-amber-600" />,
          badge: hasKontakEdit ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-850",
          allowed: hasKontakEdit
        };

      case "sync":
        const hasSyncEdit = role === "Admin Manager";
        return {
          title: "Dashboard Sinkronisasi Database API",
          desc: hasSyncEdit
            ? "Gerbang Sinkronisasi Terbuka. Anda memiliki hak administratif mutlak untuk mendorong API atau mengganti konfigurasi."
            : `Akses Terbatas. Berkas database.json dan sinkronisasi real-time landing page hanya dikelola oleh Admin Manager.`,
          status: hasSyncEdit ? "Akses Admin Aktif" : "Modul Terkunci (Developer Only)",
          colorClass: hasSyncEdit
            ? "bg-emerald-50/50 border-emerald-500/20 text-emerald-950"
            : "bg-red-50/50 border-red-500/20 text-red-950",
          icon: hasSyncEdit ? <Unlock size={15} className="text-emerald-600" /> : <Lock size={15} className="text-red-650" />,
          badge: hasSyncEdit ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800",
          allowed: hasSyncEdit
        };

      default:
        return null;
    }
  };

  const specs = getPermissionSpecs();
  if (!specs) return null;

  // Render role icon
  const getRoleIcon = () => {
    switch (role) {
      case "Admin Manager": return <Shield size={14} className="text-emerald-600 shrink-0" />;
      case "Editor": return <Edit3 size={14} className="text-purple-600 shrink-0" />;
      case "Auditor": return <ClipboardCheck size={14} className="text-blue-600 shrink-0" />;
      case "Staf": return <Inbox size={14} className="text-amber-600 shrink-0" />;
      default: return <Eye size={14} className="text-slate-500 shrink-0" />;
    }
  };

  return (
    <div className={`mb-5 p-4 rounded-xl border ${specs.colorClass} flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs animate-fadeIn`}>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-100 flex items-center justify-center shrink-0">
          {getRoleIcon()}
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-800 font-sans">{specs.title}</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono ${specs.badge}`}>
              {specs.status}
            </span>
          </div>
          <p className="text-slate-500 text-[11px] font-sans leading-relaxed">
            {specs.desc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 self-start sm:self-center shrink-0 bg-white/60 p-1.5 px-2.5 rounded-lg border border-slate-200">
        <span className="text-[10px] text-slate-400 font-medium">Otoritas Anda:</span>
        <span className="font-bold text-slate-700 text-[10px] font-mono flex items-center gap-1">
          {specs.icon}
          {role.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
