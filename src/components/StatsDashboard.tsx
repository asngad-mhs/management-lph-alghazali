/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Layanan, Proses, Regulasi, Berita, Kontak, FAQ } from "../types";
import { 
  Briefcase, 
  Workflow, 
  ShieldCheck, 
  Mail, 
  ArrowUpRight, 
  Plus, 
  Zap, 
  HelpCircle, 
  Rss 
} from "lucide-react";
import { motion } from "motion/react";

interface StatsDashboardProps {
  layanan: Layanan[];
  proses: Proses[];
  regulasi: Regulasi[];
  berita: Berita[];
  faq: FAQ[];
  kontak: Kontak[];
  onAddNewService: () => void;
  onGoToSync: () => void;
  isAdmin: boolean;
}

export default function StatsDashboard({
  layanan,
  proses,
  regulasi,
  berita,
  faq,
  kontak,
  onAddNewService,
  onGoToSync,
  isAdmin
}: StatsDashboardProps) {
  // Calculations
  const resolvedMessagesCount = kontak.filter(c => c.telahDibaca).length;
  const pendingMessagesCount = kontak.length - resolvedMessagesCount;
  
  const categoriesLayanan = layanan.reduce((acc, curr) => {
    acc[curr.kategori] = (acc[curr.kategori] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeRegulationsCount = regulasi.filter(r => r.statusBerlaku).length;
  const publishedNewsCount = berita.filter(b => b.status === "Dipublikasikan").length;

  const quickStats = [
    {
      label: "Layanan Halal",
      val: layanan.length,
      desc: "Layanan Aktif",
      icon: Briefcase,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      label: "Tahapan Proses",
      val: proses.length,
      desc: "Alur Audit Halal",
      icon: Workflow,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      label: "Regulasi JPH",
      val: regulasi.length,
      desc: `${activeRegulationsCount} Berlaku Aktif`,
      icon: ShieldCheck,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-600 dark:text-amber-400"
    },
    {
      label: "Pesan Inbox",
      val: kontak.length,
      desc: `${pendingMessagesCount} Perlu Balasan`,
      icon: Mail,
      color: "from-rose-500 to-pink-600",
      textColor: "text-rose-600 dark:text-rose-400"
    }
  ];

  // For Custom SVG Chart rendering
  const maxLayananCount = Math.max(...Object.values(categoriesLayanan), 1);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-6 rounded-2xl text-white shadow-lg border border-emerald-700/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-sans font-bold tracking-tight">
              Sistem Manajemen LPH Al-Ghazali
            </h2>
            <p className="text-emerald-200 text-sm mt-1.5 max-w-2xl font-sans leading-relaxed">
              Selamat datang kembali di panel administrasi digital LPH Al-Ghazali UNUGHA Cilacap. Kelola data layanan sertifikasi, berita syiar halal, sirkulasi regulasi pemerintah, serta sinkronisasikan data eksternal secara terpadu.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            {isAdmin && (
              <button 
                onClick={onAddNewService}
                className="flex items-center gap-1 bg-emerald-500 text-white hover:bg-emerald-400 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <Plus size={15} /> Layanan Baru
              </button>
            )}
            <button 
              onClick={onGoToSync}
              className="flex items-center gap-1.5 bg-slate-800 text-slate-100 hover:bg-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg border border-slate-700 hover:border-slate-600 shadow-sm transition-all cursor-pointer"
            >
              <Zap size={14} className="text-emerald-400 animate-pulse" /> Sinkronisasi API
            </button>
          </div>
        </div>
      </div>

      {/* Grid Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {quickStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between group"
            >
              <div className="space-y-1.5">
                <span className="text-xs text-slate-500 font-medium block">
                  {stat.label}
                </span>
                <h3 className="text-3xl font-sans font-black text-slate-900 tracking-tight">
                  {stat.val}
                </h3>
                <span className="text-xs text-slate-400 block font-sans">
                  {stat.desc}
                </span>
              </div>
              <div className={`p-3.5 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-inner flex items-center justify-center transform group-hover:scale-105 transition`}>
                <Icon size={22} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics & Content Ratios Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Custom SVG Distribution Chart (Layanan Category) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm lg:col-span-7 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              Sebaran Kategori Pelayanan LPH
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Rasio program sertifikasi, pelatihan, pendampingan, dan pra-audit yang saat ini aktif dijalankan.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {["Sertifikasi", "Pendampingan", "Pelatihan", "Konsultasi"].map((cat) => {
              const val = categoriesLayanan[cat] || 0;
              const percentage = Math.round((val / (layanan.length || 1)) * 100);
              const barWidth = `${(val / maxLayananCount) * 100}%`;
              const colorCode = 
                cat === "Sertifikasi" ? "bg-emerald-600" :
                cat === "Pendampingan" ? "bg-blue-600" :
                cat === "Pelatihan" ? "bg-amber-500" : "bg-purple-600";
              
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700">{cat}</span>
                    <span className="text-slate-900 font-mono">
                      {val} Layanan <span className="text-slate-400 font-normal">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                    <div 
                      className={`${colorCode} h-full rounded-full transition-all duration-1000`} 
                      style={{ width: barWidth }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Total Kategori: 4 Kelompok</span>
            <span>Rata-rata Estimasi: {Math.round(layanan.reduce((sum, item) => sum + item.estimasiHari, 0) / (layanan.length || 1))} Hari Kerja</span>
          </div>
        </div>

        {/* LPH Halal Process Steps Indicator Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 tracking-tight">
              Status Alur Pemeriksaan
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Kelola {proses.length} tahapan verifikasi produk halal dari hulu hingga penetapan fatwa.
            </p>
          </div>

          {/* Minimal list showing process flow */}
          <div className="my-5 divide-y divide-slate-100">
            {proses.slice(0, 4).map((p) => {
              const bgBadge = 
                p.statusKritikal === "Tinggi" ? "bg-rose-50 text-rose-700 border-rose-200" :
                p.statusKritikal === "Sedang" ? "bg-amber-50 text-amber-700 border-amber-200" :
                "bg-emerald-50 text-emerald-700 border-emerald-200";

              return (
                <div key={p.id} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      {p.langkah}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-slate-800 truncate">{p.namaTahapan}</p>
                      <p className="text-[10px] text-slate-500 font-sans truncate">{p.penanggungJawab}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${bgBadge} shrink-0`}>
                    {p.statusKritikal}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-sans text-slate-500">
            <span className="text-[11px]">Metodologi ISO/IEC 17065</span>
            <span className="text-[11px] font-semibold text-emerald-600">Alur Standar BPJPH</span>
          </div>
        </div>

      </div>

      {/* Grid Secondary Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Message Inbox */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 tracking-tight">
                Pesan Kontak Masuk Baru
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Pertanyaan konsultasi pelaku usaha langsung dari formulas situs publik.
              </p>
            </div>
            <span className="text-xs bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-full border border-red-100 animate-pulse">
              {pendingMessagesCount} Tertunda
            </span>
          </div>

          <div className="space-y-3.5 flex-1 max-h-[240px] overflow-y-auto pr-1">
            {kontak.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Tidak ada pesan masuk.
              </div>
            ) : (
              kontak.slice(0, 3).map((item) => (
                <div 
                  key={item.id} 
                  className={`p-3 rounded-lg border text-xs transition ${
                    item.telahDibaca 
                      ? "bg-slate-50/50 border-slate-100" 
                      : "bg-amber-50/45 border-amber-200"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span className="truncate">{item.namaPengirim}</span>
                    <span className="text-[9px] text-slate-400 font-mono font-normal">
                      {item.tanggalKirim}
                    </span>
                  </div>
                  <div className="text-slate-500 font-mono text-[10px] mt-0.5 truncate">{item.emailPengirim}</div>
                  <div className="text-slate-600 mt-1.5 font-sans font-medium line-clamp-1">{item.subjek}</div>
                  <p className="text-slate-500 mt-1 line-clamp-2 leading-relaxed text-[11px]">{item.pesan}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Informative LPH Quick Facts of Syiar & News */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 tracking-tight">
                Edukasi & Ringkasan Berita
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Daftar syiar halal dan bimbingan teknis yang siap tayang di kanal terintegrasi.
              </p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
              {publishedNewsCount} Berita Aktif
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {berita.slice(0, 3).map((b) => (
              <div key={b.id} className="flex gap-3 items-center text-xs">
                {b.gambarUrl ? (
                  <img 
                    src={b.gambarUrl} 
                    alt={b.judul}
                    className="w-12 h-12 rounded object-cover border border-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 rounded border border-slate-200">
                    <Rss size={16} />
                  </div>
                )}
                <div className="overflow-hidden flex-1">
                  <h5 className="font-semibold text-slate-800 truncate">{b.judul}</h5>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                    <span className="text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded font-semibold text-[9px]">{b.kategori}</span>
                    <span>•</span>
                    <span>Views: {b.views}</span>
                    <span>•</span>
                    <span className={b.status === "Dipublikasikan" ? "text-emerald-500" : "text-amber-500 font-semibold"}>
                      {b.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
            <span>Komunitas Pembaca: UMKM Banyumas & Cilacap</span>
            <span>Total FAQ Tersedia: {faq.length} Item</span>
          </div>
        </div>
      </div>
    </div>
  );
}
