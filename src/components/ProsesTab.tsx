/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Proses } from "../types";
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
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProsesTabProps {
  proses: Proses[];
  onCreate: (item: Proses) => void;
  onUpdate: (item: Proses) => void;
  onDelete: (id: string) => void;
  onReorder: (reordered: Proses[]) => void;
  isAdmin: boolean;
}

export default function ProsesTab({
  proses,
  onCreate,
  onUpdate,
  onDelete,
  onReorder,
  isAdmin
}: ProsesTabProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formItem, setFormItem] = useState<Partial<Proses>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Sort processes by "langkah"
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

  // Re-order functions
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...sortedProses];
    // Swap "langkah" value
    const tempLangkah = items[index].langkah;
    items[index].langkah = items[index - 1].langkah;
    items[index - 1].langkah = tempLangkah;

    onReorder(items);
  };

  const handleMoveDown = (index: number) => {
    if (index === sortedProses.length - 1) return;
    const items = [...sortedProses];
    // Swap "langkah" value
    const tempLangkah = items[index].langkah;
    items[index].langkah = items[index + 1].langkah;
    items[index + 1].langkah = tempLangkah;

    onReorder(items);
  };

  const handleDeleteStep = (id: string) => {
    // Perform delete and then re-index remaining langkah indices
    const updated = sortedProses.filter(item => item.id !== id);
    // Reindex starting from 1
    const reindexed = updated.map((item, index) => ({
      ...item,
      langkah: index + 1
    }));
    
    // First trigger delete in parent
    onDelete(id);
    // Then update the order list
    setTimeout(() => {
      onReorder(reindexed);
    }, 50);
  };

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
            <Workflow size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Prosedur & Alur Sertifikasi Halal
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Tata urutan audit pemeriksaan produk sesuai regulasi BPJPH Kementerian Agama RI.
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => handleOpenForm()}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus size={14} /> Sisipkan Tahapan
          </button>
        )}
      </div>

      {/* Vertical timeline representation */}
      <div className="space-y-4 max-w-4xl mx-auto relative pl-4 md:pl-0">
        
        {/* The visual central timeline column (desktop) */}
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
                      <span className="w-6 h-6 rounded bg-emerald-600 text-white font-mono text-xs font-bold flex items-center justify-center">
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
                            className="p-1 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 border border-slate-100"
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
                <div className="w-8 h-8 rounded-full border-4 border-slate-100 bg-emerald-600 flex items-center justify-center text-white ring-4 ring-emerald-500/10 shadow-sm font-bold font-mono text-xs">
                  {step.langkah}
                </div>
              </div>
              <div className="absolute left-6 top-8 -translate-x-1/2 z-10 md:hidden">
                <div className="w-6 h-6 rounded-full border-2 border-slate-100 bg-emerald-600 flex items-center justify-center text-white font-mono text-2xs font-bold">
                  {step.langkah}
                </div>
              </div>

              {/* Dummy spacing block on the other side */}
              <div className="hidden md:block w-[46%]" />
            </motion.div>
          );
        })}
      </div>

      {/* CONFIRM DELETE MODAL */}
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
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
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

      {/* FORM MODAL */}
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
                {/* Langkah number */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Urutan Langkah</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formItem.langkah || 1}
                      onChange={(e) => setFormItem(prev => ({ ...prev, langkah: parseInt(e.target.value) }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Kekritisan Titik Halal</label>
                    <select
                      value={formItem.statusKritikal || "Sedang"}
                      onChange={(e) => setFormItem(prev => ({ ...prev, statusKritikal: e.target.value as any }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Rendah">Rendah (Dokumen/Berkas)</option>
                      <option value="Sedang">Sedang (Tata Letak/Penetapan)</option>
                      <option value="Tinggi">Tinggi (Baku Bahan/Kritis Titik)</option>
                    </select>
                  </div>
                </div>

                {/* Nama Tahapan */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Nama Tahapan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sidang Penetapan Fatwa MUI"
                    value={formItem.namaTahapan || ""}
                    onChange={(e) => setFormItem(prev => ({ ...prev, namaTahapan: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Deskripsi */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Deskripsi Kegiatannya</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tuliskan secara lengkap rincian pemeriksaan dan verifikasi apa saja yang dilakukan..."
                    value={formItem.deskripsi || ""}
                    onChange={(e) => setFormItem(prev => ({ ...prev, deskripsi: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                  />
                </div>

                {/* Penanggung Jawab & Estimasi Waktu */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Penanggung Jawab</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Tim Auditor Halal"
                      value={formItem.penanggungJawab || ""}
                      onChange={(e) => setFormItem(prev => ({ ...prev, penanggungJawab: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Lama Waktu Penggarapan</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 2-3 Hari kerja"
                      value={formItem.estimasiWaktu || ""}
                      onChange={(e) => setFormItem(prev => ({ ...prev, estimasiWaktu: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                {/* Submits */}
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
                    className="px-4.5 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 transition cursor-pointer"
                  >
                    Simpan Tahapan
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
