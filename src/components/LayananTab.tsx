/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Layanan } from "../types";
import { 
  Briefcase, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  Tag, 
  Info, 
  Check, 
  X,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LayananTabProps {
  layanan: Layanan[];
  onCreate: (item: Layanan) => void;
  onUpdate: (item: Layanan) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

export default function LayananTab({
  layanan,
  onCreate,
  onUpdate,
  onDelete,
  isAdmin
}: LayananTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedLayanan, setSelectedLayanan] = useState<Layanan | null>(null);
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formItem, setFormItem] = useState<Partial<Layanan>>({});
  const [newRequirement, setNewRequirement] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const categories = ["Semua", "Sertifikasi", "Pendampingan", "Pelatihan", "Konsultasi"];

  // Filtered list
  const filteredList = layanan.filter((item) => {
    const matchesSearch = 
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenForm = (item?: Layanan) => {
    if (item) {
      setFormItem({ ...item });
    } else {
      setFormItem({
        id: "",
        kode: `SRV-${Math.floor(100 + Math.random() * 900)}`,
        nama: "",
        deskripsi: "",
        kategori: "Sertifikasi",
        estimasiHari: 14,
        biayaNominal: 500000,
        persyaratan: []
      });
    }
    setNewRequirement("");
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formItem.nama || !formItem.kode || !formItem.deskripsi) return;

    const payload = {
      ...(formItem as Layanan),
      id: formItem.id || `lay_${Date.now()}`
    };

    if (formItem.id) {
      onUpdate(payload);
    } else {
      onCreate(payload);
    }
    setIsFormOpen(false);
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      const requirements = formItem.persyaratan || [];
      setFormItem(prev => ({
        ...prev,
        persyaratan: [...requirements, newRequirement.trim()]
      }));
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (idx: number) => {
    setFormItem(prev => ({
      ...prev,
      persyaratan: (prev.persyaratan || []).filter((_, i) => i !== idx)
    }));
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Top filter section */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kode, nama, atau deskripsi layanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {cat}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => handleOpenForm()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 text-xs px-3.5 py-1.5 rounded-lg transition"
            >
              <Plus size={14} /> Baru
            </button>
          )}
        </div>
      </div>

      {/* Grid listing */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center text-slate-400 text-xs">
          Belum ada data layanan Halal yang cocok dengan pencarian Anda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between relative group overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {/* Kode & Kategori Badges */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200/30">
                      {item.kode}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.kategori === "Sertifikasi" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      item.kategori === "Pendampingan" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                      item.kategori === "Pelatihan" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                      "bg-purple-50 text-purple-700 border border-purple-100"
                    }`}>
                      {item.kategori}
                    </span>
                  </div>

                  {/* Actions buttons for Admin */}
                  {isAdmin && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenForm(item)}
                        className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 transition"
                        title="Ubah"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition"
                        title="Hapus"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-snug group-hover:text-emerald-700 transition">
                    {item.nama}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.deskripsi}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
                  <div className="flex items-center gap-1">
                    <Clock size={13} className="text-slate-400" />
                    <span>~{item.estimasiHari} Hari Kerja</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag size={13} className="text-slate-400" />
                    <span className="font-semibold text-slate-800">{formatRupiah(item.biayaNominal)}</span>
                  </div>
                </div>
              </div>

              {/* Requirement section triggers */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-sans">
                  {item.persyaratan.length} Dokumen Persyaratan
                </span>
                <button
                  onClick={() => setSelectedLayanan(item)}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-500 hover:underline flex items-center gap-1.5"
                >
                  <Info size={13} /> Persyaratan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
                <h4 className="text-sm font-bold">Konfirmasi Hapus Layanan?</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Tindakan ini permanen. Seluruh data kode dan requirements yang berkaitan dengannya akan dihapus dari sistem memori lokal.
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
                    if (confirmDeleteId) onDelete(confirmDeleteId);
                    setConfirmDeleteId(null);
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

      {/* REQUIREMENT DETAIL MODAL */}
      <AnimatePresence>
        {selectedLayanan && (
          <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl max-w-md w-full p-6 space-y-5 border border-slate-200"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                    {selectedLayanan.kode}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-1">{selectedLayanan.nama}</h4>
                </div>
                <button
                  onClick={() => setSelectedLayanan(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-500 uppercase">Dokumen Persyaratan Wajib:</h5>
                <div className="space-y-2">
                  {selectedLayanan.persyaratan.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Pemeriksaan ini tidak memerlukan dokumen pendukung.</p>
                  ) : (
                    selectedLayanan.persyaratan.map((req, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-xs text-slate-600">
                        <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-sans leading-relaxed">{req}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex justify-end">
                <button
                  onClick={() => setSelectedLayanan(null)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-emerald-500 transition"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE & EDIT FORM MODAL */}
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
                  {formItem.id ? "Ubah Data Layanan LPH" : "Pendaftaran Layanan Baru"}
                </h4>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
                {/* Kode & Kategori */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Kode Layanan</label>
                    <input
                      type="text"
                      required
                      value={formItem.kode || ""}
                      onChange={(e) => setFormItem(prev => ({ ...prev, kode: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Kategori</label>
                    <select
                      value={formItem.kategori || "Sertifikasi"}
                      onChange={(e) => setFormItem(prev => ({ ...prev, kategori: e.target.value as any }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Sertifikasi">Sertifikasi</option>
                      <option value="Pendampingan">Pendampingan</option>
                      <option value="Pelatihan">Pelatihan</option>
                      <option value="Konsultasi">Konsultasi</option>
                    </select>
                  </div>
                </div>

                {/* Nama Layanan */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Nama Layanan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pemeriksaan Halal Pelaku Usaha Mikro"
                    value={formItem.nama || ""}
                    onChange={(e) => setFormItem(prev => ({ ...prev, nama: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Deskripsi */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Deskripsi Ringkas</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Deskripsikan ruang lingkup pemeriksaan di laboratorium maupun lapangan..."
                    value={formItem.deskripsi || ""}
                    onChange={(e) => setFormItem(prev => ({ ...prev, deskripsi: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                  />
                </div>

                {/* Duration & Budget */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Estimasi Hari Kerja</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formItem.estimasiHari || 14}
                      onChange={(e) => setFormItem(prev => ({ ...prev, estimasiHari: parseInt(e.target.value) }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Tarif Resmi BPJPH (Rupiah)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formItem.biayaNominal || 0}
                      onChange={(e) => setFormItem(prev => ({ ...prev, biayaNominal: parseInt(e.target.value) }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Requirements Checklist Manager */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <label className="font-semibold text-slate-600 block">Daftar Persyaratan Dokumen ({formItem.persyaratan?.length || 0})</label>
                  
                  <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                    {(formItem.persyaratan || []).map((req, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-slate-50 border border-slate-100 p-2 rounded-lg justify-between">
                        <span className="truncate flex-1 font-sans font-medium text-slate-700">{req}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRequirement(idx)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Masukkan nama dokumen (contoh: SJPH, NIB)..."
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddRequirement}
                      className="bg-slate-800 text-white px-3 py-2 rounded-lg hover:bg-slate-700 transition font-bold"
                    >
                      Sisipkan
                    </button>
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
                    Simpan Layanan
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
