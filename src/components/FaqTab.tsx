/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FAQ } from "../types";
import { 
  HelpCircle, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  X,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FaqTabProps {
  faq: FAQ[];
  onCreate: (item: FAQ) => void;
  onUpdate: (item: FAQ) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

export default function FaqTab({
  faq,
  onCreate,
  onUpdate,
  onDelete,
  isAdmin
}: FaqTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modal form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formItem, setFormItem] = useState<Partial<FAQ>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const categories = ["Semua", "Sertifikasi", "Sihalal", "Biaya", "Proses Kontrak"];

  // Filter FAQ items
  const filteredList = faq.filter((item) => {
    const matchesSearch = 
      item.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jawaban.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenForm = (item?: FAQ) => {
    if (item) {
      setFormItem({ ...item });
    } else {
      setFormItem({
        id: "",
        pertanyaan: "",
        jawaban: "",
        kategori: "Sertifikasi",
        diperbarui: new Date().toISOString().split("T")[0]
      });
    }
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formItem.pertanyaan || !formItem.jawaban) return;

    const payload = {
      ...(formItem as FAQ),
      id: formItem.id || `faq_${Date.now()}`
    };

    if (formItem.id) {
      onUpdate(payload);
    } else {
      onCreate(payload);
    }
    setIsFormOpen(false);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Top bar search and filters */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-sm relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kata kunci dalam Tanya Jawab..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition ${
                selectedCategory === cat
                  ? "bg-slate-800 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {cat}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => handleOpenForm()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 text-xs px-3.5 py-1.5 rounded-lg transition cursor-pointer"
            >
              <Plus size={14} /> FAQ Baru
            </button>
          )}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5 max-w-3xl mx-auto">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-slate-200 text-center text-slate-400 text-xs">
            Tidak ada item FAQ terdaftar yang cocok dengan filter pencarian.
          </div>
        ) : (
          filteredList.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition overflow-hidden"
              >
                {/* Header title click area */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-4 flex justify-between items-center cursor-pointer select-none gap-4"
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle size={17} className="text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {item.pertanyaan}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Kategori: <span className="text-emerald-700 font-semibold">{item.kategori}</span> • Diupdate: {item.diperbarui}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2shrink-0">
                    {/* Admin Action Buttons */}
                    {isAdmin && (
                      <div 
                        className="flex gap-1"
                        onClick={(e) => e.stopPropagation()} // Stop accordion expand click
                      >
                        <button
                          onClick={() => handleOpenForm(item)}
                          className="p-1 text-slate-400 hover:text-emerald-600 rounded bg-slate-50 border border-slate-150 transition"
                          title="Ubah"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="p-1 text-slate-400 hover:text-red-700 rounded bg-slate-50 border border-slate-150 transition"
                          title="Hapus"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                    <span className="text-slate-400">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </div>
                </div>

                {/* Sub Body Answer expanding */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 bg-slate-50/50"
                    >
                      <p className="p-4.5 text-xs text-slate-600 leading-relaxed font-sans font-medium">
                        {item.jawaban}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
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
                <h4 className="text-sm font-bold">Hapus Butir FAQ?</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Tindakan ini permanen. Tanya jawab terpilih akan dihapus sepenuhnya dari bank data edukasi masyarakat.
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
                  Hapus FAQ
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
                  {formItem.id ? "Ubah Butir Tanya Jawab FAQ" : "Buat Butir FAQ Baru"}
                </h4>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-4 text-xs font-sans">
                {/* Kategori */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Kategori Faq</label>
                  <select
                    value={formItem.kategori || "Sertifikasi"}
                    onChange={(e) => setFormItem(prev => ({ ...prev, kategori: e.target.value as any }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Sertifikasi">Sertifikasi</option>
                    <option value="Sihalal">Sihalal</option>
                    <option value="Biaya">Biaya</option>
                    <option value="Proses Kontrak">Proses Kontrak</option>
                  </select>
                </div>

                {/* Pertanyaan */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Pertanyaan (Maks 120 huruf)</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Contoh: Berapa lamakah masa tenggang berkas pra-audit?"
                    value={formItem.pertanyaan || ""}
                    onChange={(e) => setFormItem(prev => ({ ...prev, pertanyaan: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                  />
                </div>

                {/* Jawaban */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Jawaban Edukasi</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tuliskan jawaban yang ringkas, berdasar undang-undang resmi, solutif dan mudah dipahami khalayak umum..."
                    value={formItem.jawaban || ""}
                    onChange={(e) => setFormItem(prev => ({ ...prev, jawaban: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium leading-relaxed"
                  />
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
                    Simpan FAQ
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
