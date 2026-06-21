/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Proses, TanggungGugatRecord, TarifLayananRecord } from "../types";
import { 
  Workflow, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  UserCheck, 
  HelpCircle,
  AlertTriangle,
  Clock,
  Scale,
  Banknote,
  FileText,
  Search,
  Filter,
  ShieldAlert,
  Info,
  CheckCircle2,
  Landmark,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProsesTabProps {
  proses: Proses[];
  onCreate: (item: Proses) => void;
  onUpdate: (item: Proses) => void;
  onDelete: (id: string) => void;
  onReorder: (reordered: Proses[]) => void;
  tanggungGugat: TanggungGugatRecord[];
  onUpdateTanggungGugat: (data: TanggungGugatRecord[]) => void;
  tarifLayanan: TarifLayananRecord[];
  onUpdateTarifLayanan: (data: TarifLayananRecord[]) => void;
  isAdmin: boolean;
}

export default function ProsesTab({
  proses,
  onCreate,
  onUpdate,
  onDelete,
  onReorder,
  tanggungGugat,
  onUpdateTanggungGugat,
  tarifLayanan,
  onUpdateTarifLayanan,
  isAdmin
}: ProsesTabProps) {
  // Subtab Navigation
  const [activeSubtab, setActiveSubtab] = useState<"alur" | "tanggung_gugat" | "tarif">("alur");

  // ALUR SERTIFIKASI STATES
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formItem, setFormItem] = useState<Partial<Proses>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // TANGGUNG GUGAT STATES
  const [isTgFormOpen, setIsTgFormOpen] = useState(false);
  const [tgFormItem, setTgFormItem] = useState<Partial<TanggungGugatRecord>>({});
  const [confirmDeleteTgId, setConfirmDeleteTgId] = useState<string | null>(null);
  const [tgSearch, setTgSearch] = useState("");
  const [tgStatusFilter, setTgStatusFilter] = useState("SEMUA");
  const [expandedProcedureIndex, setExpandedProcedureIndex] = useState<number | null>(0);

  // TARIF LAYANAN STATES
  const [isTfFormOpen, setIsTfFormOpen] = useState(false);
  const [tfFormItem, setTfFormItem] = useState<Partial<TarifLayananRecord>>({});
  const [confirmDeleteTfId, setConfirmDeleteTfId] = useState<string | null>(null);
  const [tfSearch, setTfSearch] = useState("");
  const [tfScaleFilter, setTfScaleFilter] = useState("SEMUA");

  // --- 1. ALUR SERTIFIKASI ACTIONS ---
  const sortedProses = [...proses].sort((a, b) => a.langkah - b.langkah);

  const handleOpenForm = (item?: Proses) => {
    if (item) {
      setFormItem({ ...item });
    } else {
      setFormItem({
        id: "",
        langkah: sortedProses.length + 1,
        namaTahapan: "",
        deskripsi: "",
        penanggungJawab: "",
        estimasiWaktu: "1-2 Hari kerja",
        statusKritikal: "Sedang"
      });
    }
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formItem.namaTahapan || !formItem.penanggungJawab || !formItem.deskripsi) return;

    const payload = {
      ...(formItem as Proses),
      id: formItem.id || `pro_${Date.now()}`
    };

    if (formItem.id) {
      onUpdate(payload);
    } else {
      onCreate(payload);
    }
    setIsFormOpen(false);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...sortedProses];
    const tempLangkah = items[index].langkah;
    items[index].langkah = items[index - 1].langkah;
    items[index - 1].langkah = tempLangkah;
    onReorder(items);
  };

  const handleMoveDown = (index: number) => {
    if (index === sortedProses.length - 1) return;
    const items = [...sortedProses];
    const tempLangkah = items[index].langkah;
    items[index].langkah = items[index + 1].langkah;
    items[index + 1].langkah = tempLangkah;
    onReorder(items);
  };

  const handleDeleteStep = (id: string) => {
    const updated = sortedProses.filter(item => item.id !== id);
    const reindexed = updated.map((item, index) => ({
      ...item,
      langkah: index + 1
    }));
    onDelete(id);
    setTimeout(() => {
      onReorder(reindexed);
    }, 50);
  };


  // --- 2. TANGGUNG GUGAT ACTIONS (CRUD) ---
  const handleOpenTgForm = (item?: TanggungGugatRecord) => {
    if (item) {
      setTgFormItem({ ...item });
    } else {
      setTgFormItem({
        id: "",
        nomorKasus: `TG-2026-00${tanggungGugat.length + 1}`,
        subjek: "",
        deskripsi: "",
        tanggalPengajuan: new Date().toISOString().split("T")[0],
        pihakPelakuUsaha: "",
        status: "Diterima",
        tindakanLph: ""
      });
    }
    setIsTgFormOpen(true);
  };

  const handleSaveTgForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tgFormItem.subjek || !tgFormItem.deskripsi || !tgFormItem.pihakPelakuUsaha) return;

    if (tgFormItem.id) {
      // Edit mode
      const updated = tanggungGugat.map(item => item.id === tgFormItem.id ? { ...(tgFormItem as TanggungGugatRecord) } : item);
      onUpdateTanggungGugat(updated);
    } else {
      // Create mode
      const newRecord: TanggungGugatRecord = {
        ...(tgFormItem as TanggungGugatRecord),
        id: `tg_${Date.now()}`,
        nomorKasus: tgFormItem.nomorKasus || `TG-2026-0${Math.floor(100 + Math.random() * 900)}`
      };
      onUpdateTanggungGugat([newRecord, ...tanggungGugat]);
    }
    setIsTgFormOpen(false);
  };

  const handleDeleteTg = (id: string) => {
    const updated = tanggungGugat.filter(item => item.id !== id);
    onUpdateTanggungGugat(updated);
  };


  // --- 3. TARIF LAYANAN ACTIONS (CRUD) ---
  const handleOpenTfForm = (item?: TarifLayananRecord) => {
    if (item) {
      setTfFormItem({ ...item });
    } else {
      setTfFormItem({
        id: "",
        namaSkema: "",
        kategoriUsaha: "Usaha Mikro & Kecil (UMK)",
        tarifDasar: 350000,
        tarifTransportasi: 50000,
        keterangan: ""
      });
    }
    setIsTfFormOpen(true);
  };

  const handleSaveTfForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tfFormItem.namaSkema || tfFormItem.tarifDasar === undefined) return;

    if (tfFormItem.id) {
      // Edit mode
      const updated = tarifLayanan.map(item => item.id === tfFormItem.id ? { ...(tfFormItem as TarifLayananRecord) } : item);
      onUpdateTarifLayanan(updated);
    } else {
      // Create mode
      const newRecord: TarifLayananRecord = {
        ...(tfFormItem as TarifLayananRecord),
        id: `tf_${Date.now()}`
      };
      onUpdateTarifLayanan([...tarifLayanan, newRecord]);
    }
    setIsTfFormOpen(false);
  };

  const handleDeleteTf = (id: string) => {
    const updated = tarifLayanan.filter(item => item.id !== id);
    onUpdateTarifLayanan(updated);
  };

  // --- DATA FILTERING ---
  const filteredTanggungGugat = tanggungGugat.filter(item => {
    const matchesSearch = 
      item.subjek.toLowerCase().includes(tgSearch.toLowerCase()) || 
      item.nomorKasus.toLowerCase().includes(tgSearch.toLowerCase()) || 
      item.pihakPelakuUsaha.toLowerCase().includes(tgSearch.toLowerCase());
    
    if (tgStatusFilter === "SEMUA") return matchesSearch;
    return matchesSearch && item.status === tgStatusFilter;
  });

  const filteredTarif = tarifLayanan.filter(item => {
    const matchesSearch = 
      item.namaSkema.toLowerCase().includes(tfSearch.toLowerCase()) || 
      item.keterangan.toLowerCase().includes(tfSearch.toLowerCase());
    
    if (tfScaleFilter === "SEMUA") return matchesSearch;
    return matchesSearch && item.kategoriUsaha === tfScaleFilter;
  });

  // Written Procedure Steps for Tanggung Gugat Info Section
  const prosedurBanding = [
    {
      title: "1. Penyampaian Pengaduan / Keberatan",
      desc: "Pelaku usaha mengirimkan surat keberatan atau mengisi formulir Tanggung Gugat resmi dalam jangka waktu paling lambat 10 hari kerja sejak penetapan LHP (Laporan Hasil Pemeriksaan) dirilis."
    },
    {
      title: "2. Investigasi Lapangan & Verifikasi Berkas",
      desc: "Tim Mutu LPH akan melakukan verifikasi kebenaran berkas pengaduan, memanggil auditor yang bersangkutan untuk klarifikasi, serta meninjau ulang lembar audit dan hasil uji laboratorium."
    },
    {
      title: "3. Rapat Majelis Komite Tanggung Gugat",
      desc: "Kasus yang memenuhi syarat akan disidangkan dalam Rapat Majelis Banding di bawah koordinasi Kepala LPH dan Dewan Pakar untuk memutuskan apakah sanggahan diterima atau ditolak."
    },
    {
      title: "4. Penerbitan Berita Acara Keputusan",
      desc: "LPH mengeluarkan Berita Acara tertulis hasil verifikasi tanggung gugat yang memuat tindakan korektif, perbaikan rekomendasi fatwa, atau penolakan gugatan disertai argumentasi ilmiah murni."
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Subtab Navigation Pills */}
      <div className="bg-slate-100 p-1.5 rounded-xl flex gap-1 border border-slate-200">
        <button
          onClick={() => setActiveSubtab("alur")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubtab === "alur"
              ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
          }`}
        >
          <Workflow size={15} />
          Alur Sertifikasi
        </button>

        <button
          onClick={() => setActiveSubtab("tanggung_gugat")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubtab === "tanggung_gugat"
              ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
          }`}
        >
          <Scale size={15} />
          Prosedur Tanggung Gugat
        </button>

        <button
          onClick={() => setActiveSubtab("tarif")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubtab === "tarif"
              ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
          }`}
        >
          <Banknote size={15} />
          Tarif Layanan Resmi
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. VIEW: ALUR SERTIFIKASI */}
      {/* ========================================================= */}
      {activeSubtab === "alur" && (
        <div className="space-y-6">
          {/* Intro section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
                <Workflow size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight text-left">
                  Prosedur & Alur Sertifikasi Halal
                </h2>
                <p className="text-xs text-slate-500 font-sans mt-0.5 text-left">
                  Tata urutan audit pemeriksaan produk sesuai regulasi BPJPH Kementerian Agama RI.
                </p>
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={() => handleOpenForm()}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Plus size={14} /> Sisipkan Tahapan
              </button>
            )}
          </div>

          {/* Vertical timeline representation */}
          <div className="space-y-4 max-w-4xl mx-auto relative pl-4 md:pl-0">
            
            <div className="absolute left-[20px] md:left-1/2 top-4 bottom-4 w-0.5 bg-slate-200 -translate-x-1/2 hidden md:block" />
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200 md:hidden" />

            {sortedProses.map((step, idx) => {
              const isEven = idx % 2 === 0;
              const bgBadge = 
                step.statusKritikal === "Tinggi" ? "bg-rose-50 text-rose-700 border-rose-200" :
                step.statusKritikal === "Sedang" ? "bg-amber-50 text-amber-700 border-amber-200" :
                "bg-emerald-50 text-emerald-700 border-emerald-200";

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? "md:flex-row-reverse" : ""
                  } gap-6 md:gap-0`}
                >
                  
                  {/* Card blocks on side */}
                  <div className="w-full md:w-[46%]">
                    <div className="bg-white rounded-xl border border-slate-200/85 p-5 shadow-sm space-y-3.5 hover:shadow-md transition">
                      {/* Step metrics */}
                      <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                            {step.langkah}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 tracking-tight text-left">
                            {step.namaTahapan}
                          </h4>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${bgBadge}`}>
                            {step.statusKritikal}
                          </span>
                          {isAdmin && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleMoveUp(idx)}
                                disabled={idx === 0}
                                className={`p-1 rounded text-slate-400 hover:text-slate-700 bg-slate-50 border border-slate-100 ${
                                  idx === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-100"
                                }`}
                                title="Naikkan Langkah"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button
                                onClick={() => handleMoveDown(idx)}
                                disabled={idx === sortedProses.length - 1}
                                className={`p-1 rounded text-slate-400 hover:text-slate-700 bg-slate-50 border border-slate-100 ${
                                  idx === sortedProses.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-100"
                                }`}
                                title="Turunkan Langkah"
                              >
                                <ArrowDown size={12} />
                              </button>
                              <button
                                onClick={() => handleOpenForm(step)}
                                className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-50 border border-slate-100"
                                title="Edit"
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(step.id)}
                                className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-100"
                                title="Hapus"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Body text */}
                      <p className="text-[11px] text-slate-500 font-sans leading-relaxed text-left">
                        {step.deskripsi}
                      </p>

                      {/* Footers */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400 border-t border-slate-50/70 pt-2.5">
                        <div className="flex items-center gap-1">
                          <UserCheck size={12} className="text-slate-300" />
                          <span className="font-semibold text-slate-600">{step.penanggungJawab}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-300" />
                          <span className="font-medium text-indigo-600 bg-indigo-50/50 px-1 py-0.2 rounded font-mono">{step.estimasiWaktu}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Central Circle Pin */}
                  <div className="absolute left-[20px] md:left-1/2 top-7 md:-translate-x-1/2 z-10 hidden md:block">
                    <div className="w-8 h-8 rounded-full border-4 border-slate-100 bg-indigo-600 flex items-center justify-center text-white ring-4 ring-indigo-500/10 shadow-sm font-bold font-mono text-xs">
                      {step.langkah}
                    </div>
                  </div>
                  <div className="absolute left-6 top-8 -translate-x-1/2 z-10 md:hidden">
                    <div className="w-6 h-6 rounded-full border-2 border-slate-100 bg-indigo-600 flex items-center justify-center text-white font-mono text-2xs font-bold">
                      {step.langkah}
                    </div>
                  </div>

                  <div className="hidden md:block w-[46%]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. VIEW: PROSEDUR TANGGUNG GUGAT (Appeals / Sanggahan) */}
      {/* ========================================================= */}
      {activeSubtab === "tanggung_gugat" && (
        <div className="space-y-6">
          {/* Header Description */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center shrink-0 border border-orange-100">
                <Scale size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight text-left">
                  Layanan Banding & Tanggung Gugat LPH
                </h2>
                <p className="text-xs text-slate-500 font-sans mt-0.5 text-left">
                  Mekanisme resmi pelaku usaha menyampaikan keberatan atas hasil pemeriksaan material secara akuntabel.
                </p>
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={() => handleOpenTgForm()}
                className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Plus size={14} /> Daftarkan Gugatan Bersama
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Guide & Steps Accordion (Left column) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3">
                <div className="flex items-center gap-2 text-indigo-950">
                  <FileText size={16} className="text-indigo-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-left">
                    SOP Tanggung Gugat Resmi
                  </h3>
                </div>
                <p className="text-2xs text-slate-500 font-sans text-left leading-relaxed">
                  Semua sengketa, sanggatan, keputusan ketidaklulusan pemeriksaan kehalalan produk diproses secara objektif ilmiah oleh Majelis Etik & Laboratorium LPH Al-Ghazali. Klik tiap tahapan di bawah ini untuk melihat detail SOP:
                </p>

                {/* Steps Loop Accordion */}
                <div className="space-y-2 mt-3">
                  {prosedurBanding.map((proc, pIdx) => {
                    const isOpen = expandedProcedureIndex === pIdx;
                    return (
                      <div
                        key={pIdx}
                        className="bg-white rounded-lg border border-slate-200/80 overflow-hidden shadow-2xs"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedProcedureIndex(isOpen ? null : pIdx)}
                          className="w-full flex items-center justify-between p-3 text-left focus:outline-none hover:bg-slate-50 transition cursor-pointer"
                        >
                          <span className="text-xs font-bold text-slate-700">{proc.title}</span>
                          {isOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                            >
                              <div className="p-3 pt-0 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed font-sans text-left bg-slate-50/30">
                                {proc.desc}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legal Note Badge */}
              <div className="bg-orange-50/50 border border-orange-200 p-4 rounded-xl flex gap-3 text-left">
                <ShieldAlert size={18} className="text-orange-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-orange-900">Hak Pelaku Usaha Terjamin</h4>
                  <p className="text-[10px] text-orange-800 font-sans leading-relaxed">
                    Sesuai Peraturan Menag RI, pelaku usaha dilindungi hak hukumnya untuk memohon audit ulang jika ditemukan penyalahgunaan wewenang atau pelanggaran kode etik oleh auditor di lapangan.
                  </p>
                </div>
              </div>
            </div>

            {/* List & CRUD Management Area (Right column) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Filter Area */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari pelaku usaha, subjek, kasus..."
                    value={tgSearch}
                    onChange={(e) => setTgSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Filter size={14} className="text-slate-400" />
                  <select
                    value={tgStatusFilter}
                    onChange={(e) => setTgStatusFilter(e.target.value)}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="SEMUA">Semua Status</option>
                    <option value="Diterima">Diterima</option>
                    <option value="Proses Investigasi">Proses Investigasi</option>
                    <option value="Sidang Komite">Sidang Komite</option>
                    <option value="Selesai Solusi">Selesai Solusi</option>
                  </select>
                </div>
              </div>

              {/* Case Results List */}
              <div className="space-y-3">
                {filteredTanggungGugat.length === 0 ? (
                  <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 space-y-2">
                    <Info size={24} className="mx-auto text-slate-300" />
                    <p className="text-xs font-sans">Tidak ditemukan kasus tanggung gugat yang sesuai filter.</p>
                  </div>
                ) : (
                  filteredTanggungGugat.map((item, index) => {
                    const badgeStyles = 
                      item.status === "Selesai Solusi" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      item.status === "Sidang Komite" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      item.status === "Proses Investigasi" ? "bg-orange-50 text-orange-700 border-orange-200" :
                      "bg-indigo-50 text-indigo-700 border-indigo-200";

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="bg-white p-5 rounded-xl border border-slate-200/85 hover:border-slate-300 shadow-xs hover:shadow-sm transition text-left space-y-3"
                      >
                        {/* Title and Badge Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-50 pb-2.5">
                          <div className="space-y-0.5">
                            <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold mr-2">
                              {item.nomorKasus}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">Diajukan: {item.tanggalPengajuan}</span>
                            <h4 className="text-xs font-bold text-slate-800 tracking-tight mt-1">{item.subjek}</h4>
                          </div>
                          
                          <div className="flex items-center gap-1.5 self-start sm:self-center shrink-0">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${badgeStyles}`}>
                              {item.status}
                            </span>
                            
                            {isAdmin && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleOpenTgForm(item)}
                                  className="p-1 rounded text-slate-400 hover:text-orange-600 hover:bg-orange-50 border border-slate-100"
                                  title="Edit Gugatan"
                                >
                                  <Edit3 size={11} />
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteTgId(item.id)}
                                  className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-100"
                                  title="Hapus Record"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Description and Action Taken */}
                        <div className="space-y-2 text-[11px] font-sans">
                          <div>
                            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Pihak Penggugat / Pelaku Usaha:</span>
                            <span className="text-slate-700 font-bold">{item.pihakPelakuUsaha}</span>
                          </div>
                          
                          <div>
                            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Keterangan Sengketa:</span>
                            <p className="text-slate-600 leading-relaxed text-left mt-0.5">{item.deskripsi}</p>
                          </div>

                          {item.tindakanLph && (
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100/90 mt-1">
                              <span className="text-indigo-900 font-bold text-[10px] block mb-0.5">Tindakan Korektif LPH:</span>
                              <p className="text-indigo-950 italic">{item.tindakanLph}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. VIEW: TARIF LAYANAN RESMI */}
      {/* ========================================================= */}
      {activeSubtab === "tarif" && (
        <div className="space-y-6">
          {/* Header Action Banner */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                <Banknote size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight text-left">
                  Tarif Satuan Pemeriksaan & Audit LPH
                </h2>
                <p className="text-xs text-slate-500 font-sans mt-0.5 text-left">
                  Rincian batas atas dan batas bawah penetapan biaya pengujian akreditasi jaminan halal.
                </p>
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={() => handleOpenTfForm()}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Plus size={14} /> Daftarkan Skema Tarif Baru
              </button>
            )}
          </div>

          {/* Search, Filter Bar */}
          <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama skema tarif, keterangan biaya..."
                value={tfSearch}
                onChange={(e) => setTfSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Filter size={14} className="text-slate-400" />
              <select
                value={tfScaleFilter}
                onChange={(e) => setTfScaleFilter(e.target.value)}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="SEMUA">Semua Kategori</option>
                <option value="Usaha Mikro & Kecil (UMK)">Usaha Mikro & Kecil (UMK)</option>
                <option value="Usaha Menengah">Usaha Menengah</option>
                <option value="Usaha Besar">Usaha Besar</option>
                <option value="Luar Negeri / Internasional">Luar Negeri / Internasional</option>
              </select>
            </div>
          </div>

          {/* Tariffs Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTarif.length === 0 ? (
              <div className="col-span-1 md:col-span-2 bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400 space-y-2">
                <Info size={24} className="mx-auto text-slate-300" />
                <p className="text-xs font-sans">Skema tarif tidak ditemukan.</p>
              </div>
            ) : (
              filteredTarif.map((scheme, sIdx) => {
                const badgeColor = 
                  scheme.kategoriUsaha === "Usaha Mikro & Kecil (UMK)" ? "bg-emerald-50 text-emerald-700 border-emerald-150" :
                  scheme.kategoriUsaha === "Usaha Menengah" ? "bg-blue-50 text-blue-700 border-blue-150" :
                  scheme.kategoriUsaha === "Usaha Besar" ? "bg-amber-50 text-amber-700 border-amber-150" :
                  "bg-purple-50 text-purple-700 border-purple-150";

                const formatRupiah = (val: number) => {
                  return new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0
                  }).format(val);
                };

                return (
                  <motion.div
                    key={scheme.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: sIdx * 0.04 }}
                    className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition text-left relative overflow-hidden flex flex-col justify-between"
                  >
                    {/* Header line decoration */}
                    <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                    
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      {/* Name & Badge */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                            {scheme.kategoriUsaha}
                          </span>
                          
                          {isAdmin && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleOpenTfForm(scheme)}
                                className="p-1 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 border border-slate-100/80"
                                title="Edit Tarif"
                              >
                                <Edit3 size={11} />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteTfId(scheme.id)}
                                className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-100/80"
                                title="Hapus Tarif"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug tracking-tight">
                          {scheme.namaSkema}
                        </h4>
                      </div>

                      {/* Pricings */}
                      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-slate-400 uppercase font-semibold">Tarif Dasar Audit</span>
                          <span className="text-xs font-mono font-bold text-emerald-700 block">
                            {formatRupiah(scheme.tarifDasar)}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-slate-400 uppercase font-semibold">Akomodasi Lapangan</span>
                          <span className="text-xs font-mono font-bold text-slate-700 block">
                            {formatRupiah(scheme.tarifTransportasi)}
                          </span>
                        </div>
                      </div>

                      {/* Notes / T&C */}
                      {scheme.keterangan && (
                        <p className="text-[10px] text-slate-400 font-sans leading-relaxed text-left">
                          <span className="font-semibold text-slate-500">Ketentuan: </span>
                          {scheme.keterangan}
                        </p>
                      )}
                    </div>

                    {/* Footer decoration */}
                    <div className="bg-slate-50/70 border-t border-slate-100 p-2.5 px-5 flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <Landmark size={12} className="text-slate-300" />
                        <span>Sihalal BPJPH</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-900">
                        {formatRupiah(scheme.tarifDasar + scheme.tarifTransportasi)} <span className="text-[9px] font-sans font-medium text-slate-400">Total</span>
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* GLOBAL DELETE MODALS & CONFIRMATIONS */}
      {/* ========================================================= */}
      
      {/* 1. DELETE STEP TAHAPAN CONFIRM */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200"
            >
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle size={24} className="shrink-0 animate-bounce" />
                <h4 className="text-sm font-bold">Apakah Anda yakin?</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-sans text-left">
                Tindakan ini akan menggeser dan mengurutkan ulang angka tahapan langkah audit di sisa barisan proses secara dinamis.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (confirmDeleteId) handleDeleteStep(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Hapus & Urut Ulang
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. DELETE TANGGUNG GUGAT CONFIRM */}
      <AnimatePresence>
        {confirmDeleteTgId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200"
            >
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle size={24} className="shrink-0" />
                <h4 className="text-sm font-bold">Hapus Gugatan?</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-sans text-left">
                Apakah Anda benar-benar yakin ingin menghapus data kasus gugatan ini dari sistem kearsipan LPH?
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setConfirmDeleteTgId(null)}
                  className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (confirmDeleteTgId) handleDeleteTg(confirmDeleteTgId);
                    setConfirmDeleteTgId(null);
                  }}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Hapus Permanen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. DELETE TARIF LAYANAN CONFIRM */}
      <AnimatePresence>
        {confirmDeleteTfId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200"
            >
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle size={24} className="shrink-0" />
                <h4 className="text-sm font-bold">Hapus Skema Tarif?</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-sans text-left">
                Tindakan ini akan membuang pengelompokan jenis tarif standar ini dari database. Penggugurannya tidak mengubah penagihan pendaftaran reguler berjalan yang sudah diikat kontrak.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setConfirmDeleteTfId(null)}
                  className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (confirmDeleteTfId) handleDeleteTf(confirmDeleteTfId);
                    setConfirmDeleteTfId(null);
                  }}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Hapus Permanen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* GLOBAL CREATE / UPDATE FORM MODALS */}
      {/* ========================================================= */}

      {/* 1. FORM SINGLE TAHAPAN ALUR */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-800">
                  {formItem.id ? `Ubah Langkah #${formItem.langkah}` : "Penambahan Langkah Audit Baru"}
                </h4>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="space-y-1 text-left">
                    <label className="font-semibold text-slate-500 text-left block">Urutan Langkah</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formItem.langkah || 1}
                      onChange={(e) => setFormItem(prev => ({ ...prev, langkah: parseInt(e.target.value) }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="font-semibold text-slate-500 text-left block">Kekritisan Titik Halal</label>
                    <select
                      value={formItem.statusKritikal || "Sedang"}
                      onChange={(e) => setFormItem(prev => ({ ...prev, statusKritikal: e.target.value as any }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none"
                    >
                      <option value="Rendah">Rendah (Dokumen/Berkas)</option>
                      <option value="Sedang">Sedang (Tata Letak/Penetapan)</option>
                      <option value="Tinggi">Tinggi (Baku Bahan/Kritis Titik)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="font-semibold text-slate-500 text-left block">Nama Tahapan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sidang Penetapan Fatwa MUI"
                    value={formItem.namaTahapan || ""}
                    onChange={(e) => setFormItem(prev => ({ ...prev, namaTahapan: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="font-semibold text-slate-500 text-left block">Deskripsi Kegiatannya</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tuliskan secara lengkap rincian pemeriksaan dan verifikasi apa saja yang dilakukan..."
                    value={formItem.deskripsi || ""}
                    onChange={(e) => setFormItem(prev => ({ ...prev, deskripsi: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="space-y-1 text-left">
                    <label className="font-semibold text-slate-500 text-left block">Penanggung Jawab</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Tim Auditor Halal"
                      value={formItem.penanggungJawab || ""}
                      onChange={(e) => setFormItem(prev => ({ ...prev, penanggungJawab: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="font-semibold text-slate-500 text-left block">Lama Waktu Penggarapan</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 2-3 Hari kerja"
                      value={formItem.estimasiWaktu || ""}
                      onChange={(e) => setFormItem(prev => ({ ...prev, estimasiWaktu: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 transition cursor-pointer"
                  >
                    Simpan Tahapan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. FORM TANGGUNG GUGAT */}
      <AnimatePresence>
        {isTgFormOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-800">
                  {tgFormItem.id ? `Ubah Gugatan ${tgFormItem.nomorKasus}` : "Pendaftaran Kasus Keberatan Baru"}
                </h4>
                <button
                  onClick={() => setIsTgFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveTgForm} className="space-y-4 text-xs text-left">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 block">Nomor Kasus</label>
                    <input
                      type="text"
                      required
                      placeholder="TG-2026-00x"
                      value={tgFormItem.nomorKasus || ""}
                      onChange={(e) => setTgFormItem(prev => ({ ...prev, nomorKasus: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 block">Tanggal Gugatan</label>
                    <input
                      type="date"
                      required
                      value={tgFormItem.tanggalPengajuan || ""}
                      onChange={(e) => setTgFormItem(prev => ({ ...prev, tanggalPengajuan: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 block">Nama Pelaku Usaha / Penggugat</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bakso Sari Barokah Cilacap"
                    value={tgFormItem.pihakPelakuUsaha || ""}
                    onChange={(e) => setTgFormItem(prev => ({ ...prev, pihakPelakuUsaha: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 block">Subjek Permasalahan / Keberatan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Keterlambatan verifikasi titik kritis gelatin"
                    value={tgFormItem.subjek || ""}
                    onChange={(e) => setTgFormItem(prev => ({ ...prev, subjek: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 block">Deskripsi Kronologi Gugatan</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Uraikan secara lengkap dan jelas rincian kronologis keberatan yang diajukan oleh pelaku usaha..."
                    value={tgFormItem.deskripsi || ""}
                    onChange={(e) => setTgFormItem(prev => ({ ...prev, deskripsi: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-medium leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-left shadow-2xs p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 block">Status Kasus</label>
                    <select
                      value={tgFormItem.status || "Diterima"}
                      onChange={(e) => setTgFormItem(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none font-semibold text-slate-800"
                    >
                      <option value="Diterima">Diterima (Prosedur Pengarsipan)</option>
                      <option value="Proses Investigasi">Proses Investigasi</option>
                      <option value="Sidang Komite">Sidang Komite Mutu</option>
                      <option value="Selesai Solusi">Selesai Solusi (Closed)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 block">Tindakan LPH (Opsional)</label>
                    <input
                      type="text"
                      placeholder="Contoh: Menguji sampel produk ulang di lab..."
                      value={tgFormItem.tindakanLph || ""}
                      onChange={(e) => setTgFormItem(prev => ({ ...prev, tindakanLph: e.target.value }))}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsTgFormOpen(false)}
                    className="px-4 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-500 transition cursor-pointer"
                  >
                    Simpan Gugatan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. FORM TARIF LAYANAN */}
      <AnimatePresence>
        {isTfFormOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-800 text-left">
                  {tfFormItem.id ? "Modifikasi Skema Biaya Tarif" : "Registrasi Skema Tarif Resmi LPH Baru"}
                </h4>
                <button
                  onClick={() => setIsTfFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveTfForm} className="space-y-4 text-xs text-left">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 block">Nama Skema Layanan Tarif</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Audit Halul Komoditi Kosmetik & Obat"
                    value={tfFormItem.namaSkema || ""}
                    onChange={(e) => setTfFormItem(prev => ({ ...prev, namaSkema: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 block">Kategori Skala Usaha Pelaku</label>
                  <select
                    value={tfFormItem.kategoriUsaha || "Usaha Mikro & Kecil (UMK)"}
                    onChange={(e) => setTfFormItem(prev => ({ ...prev, kategoriUsaha: e.target.value as any }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none"
                  >
                    <option value="Usaha Mikro & Kecil (UMK)">Usaha Mikro & Kecil (UMK)</option>
                    <option value="Usaha Menengah">Usaha Menengah</option>
                    <option value="Usaha Besar">Usaha Besar</option>
                    <option value="Luar Negeri / Internasional">Luar Negeri / Internasional</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 block">Tarif Dasar Audit (IDR)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      placeholder="350000"
                      value={tfFormItem.tarifDasar || 0}
                      onChange={(e) => setTfFormItem(prev => ({ ...prev, tarifDasar: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none font-bold text-emerald-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 block">Estimasi Transport/Akomodasi (IDR)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      placeholder="150000"
                      value={tfFormItem.tarifTransportasi || 0}
                      onChange={(e) => setTfFormItem(prev => ({ ...prev, tarifTransportasi: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 block">Keterangan / Aturan Batasi</label>
                  <textarea
                    rows={3}
                    placeholder="Mencakup aturan batas wilayah cakupan, pengujian material wajib lab, ketentuan tambahan biaya dsb..."
                    value={tfFormItem.keterangan || ""}
                    onChange={(e) => setTfFormItem(prev => ({ ...prev, keterangan: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-medium leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsTfFormOpen(false)}
                    className="px-4 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 transition cursor-pointer"
                  >
                    Simpan Skema Tarif
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
