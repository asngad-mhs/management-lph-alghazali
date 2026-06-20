/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Regulasi } from "../types";
import { 
  ShieldCheck, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  BookOpen, 
  X,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RegulasiTabProps {
  regulasi: Regulasi[];
  onCreate: (item: Regulasi) => void;
  onUpdate: (item: Regulasi) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

export default function RegulasiTab({
  regulasi,
  onCreate,
  onUpdate,
  onDelete,
  isAdmin
}: RegulasiTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState<string>("Semua");
  
  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formItem, setFormItem] = useState<Partial<Regulasi>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const categories = ["Semua", "Undang-Undang", "SOP Internal", "Peraturan Menteri", "Keputusan BPJPH"];

  // Filter list
  const filteredList = regulasi.filter((item) => {
    const matchesSearch = 
      item.nomorAturan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tentang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedKategori === "Semua" || item.kategori === selectedKategori;
    return matchesSearch && matchesCategory;
  });

  const handleOpenForm = (item?: Regulasi) => {
    if (item) {
      setFormItem({ ...item });
    } else {
      setFormItem({
        id: "",
        nomorAturan: "",
        tentang: "",
        tahun: new Date().getFullYear(),
        sumber: "BPJPH Kemenag RI",
        kategori: "Keputusan BPJPH",
        statusBerlaku: true,
        linkDokumen: "#"
      });
    }
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formItem.nomorAturan || !formItem.tentang || !formItem.sumber) return;

    const payload = {
      ...(formItem as Regulasi),
      id: formItem.id || `reg_${Date.now()}`
    };

    if (formItem.id) {
      onUpdate(payload);
    } else {
      onCreate(payload);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search section */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="flex-1 max-w-md relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor aturan, tentang, atau penerbit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Categories Tab selector */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedKategori(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedKategori === cat
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
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg transition shrink-0 cursor-pointer"
            >
              <Plus size={14} /> Aturan Baru
            </button>
          )}
        </div>
      </div>

      {/* Table view list */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4 w-[250px]">Aturan / Nomor</th>
                <th className="p-4">Deskripsi / Tentang</th>
                <th className="p-4 w-[120px]">Penerbit</th>
                <th className="p-4 w-[110px] text-center">Status</th>
                <th className="p-4 w-[150px] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Tidak ditemukan data regulasi jaminan produk halal.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition">
                    {/* Aturan & Nomor */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-950 font-sans block leading-tight">
                          {item.nomorAturan}
                        </span>
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                          <span className="text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.2 rounded">
                            {item.kategori}
                          </span>
                          <span>•</span>
                          <span>Th. {item.tahun}</span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Tentang */}
                    <td className="p-4 text-slate-600 leading-relaxed font-sans font-medium">
                      {item.tentang}
                    </td>

                    {/* Penerbit Sumber */}
                    <td className="p-4 font-semibold text-slate-700 font-sans">
                      {item.sumber}
                    </td>

                    {/* Status Berlaku */}
                    <td className="p-4 text-center">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border inline-block ${
                        item.statusBerlaku 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {item.statusBerlaku ? "Aktid Berlaku" : "Tidak Berlaku"}
                      </span>
                    </td>

                    {/* Action Triggers */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 w-full">
                        {/* URL download link */}
                        {item.linkDokumen && item.linkDokumen !== "#" ? (
                          <a
                            href={item.linkDokumen}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 transition inline-flex items-center"
                            title="Unduh Dokumen Asli"
                          >
                            <ExternalLink size={13} />
                          </a>
                        ) : (
                          <span className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-300 cursor-not-allowed inline-block">
                            <BookOpen size={13} />
                          </span>
                        )}

                        {isAdmin && (
                          <>
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
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
                <h4 className="text-sm font-bold">Hapus Regulasi JPH?</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Tindakan ini permanen. Seluruh materi aturan jaminan halal ini akan dihilangkan seluruhnya dari basis referensi internal kita.
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
                  Ya, Hapus
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
                  {formItem.id ? "Ubah Regulasi Halal" : "Registrasi Aturan JPH Baru"}
                </h4>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-4 text-xs font-sans">
                {/* Aturan/Nomor */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Nomor Regulasi / Kode Aturan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Peraturan Pemerintah No. 39 Tahun 2021"
                    value={formItem.nomorAturan || ""}
                    onChange={(e) => setFormItem(prev => ({ ...prev, nomorAturan: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Kategori & Tahun */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Kategori Dokumen</label>
                    <select
                      value={formItem.kategori || "Keputusan BPJPH"}
                      onChange={(e) => setFormItem(prev => ({ ...prev, kategori: e.target.value as any }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Undang-Undang">Undang-Undang</option>
                      <option value="Peraturan Menteri">Peraturan Menteri</option>
                      <option value="Keputusan BPJPH">Keputusan BPJPH</option>
                      <option value="SOP Internal">SOP Internal</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Tahun Penerbitan</label>
                    <input
                      type="number"
                      required
                      min={1945}
                      max={2100}
                      value={formItem.tahun || new Date().getFullYear()}
                      onChange={(e) => setFormItem(prev => ({ ...prev, tahun: parseInt(e.target.value) }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Penerbit & URL */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Badan Penerbit / Penerbit</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: BPJPH Kemenag RI"
                      value={formItem.sumber || ""}
                      onChange={(e) => setFormItem(prev => ({ ...prev, sumber: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400">Link File Dokumen (PDF/Publik)</label>
                    <input
                      type="text"
                      placeholder="Contoh: https://jdih..."
                      value={formItem.linkDokumen || ""}
                      onChange={(e) => setFormItem(prev => ({ ...prev, linkDokumen: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                {/* Deskripsi Aturan */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Rangkuman / Inti Aturan (Materi Pokok)</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan rangkuman isi dan sasaran aturan jaminan halal ini bagi pelaku usaha serta tim pemeriksa..."
                    value={formItem.tentang || ""}
                    onChange={(e) => setFormItem(prev => ({ ...prev, tentang: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed font-sans"
                  />
                </div>

                {/* Status Aktif Berlaku */}
                <div className="flex items-center gap-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                  <input
                    type="checkbox"
                    id="statusBerlaku"
                    checked={formItem.statusBerlaku || false}
                    onChange={(e) => setFormItem(prev => ({ ...prev, statusBerlaku: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="statusBerlaku" className="font-bold text-slate-700 selection:bg-transparent">
                    Aturan ini masih AKTIF & BERLAKU saat pendaftaran audit halal
                  </label>
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
                    Simpan Aturan
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
