/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Berita } from "../types";
import { 
  Newspaper, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  BookOpen, 
  X,
  AlertTriangle,
  User,
  Eye,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BeritaTabProps {
  berita: Berita[];
  onCreate: (item: Berita) => void;
  onUpdate: (item: Berita) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

export default function BeritaTab({
  berita,
  onCreate,
  onUpdate,
  onDelete,
  isAdmin
}: BeritaTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedStatus, setSelectedStatus] = useState<string>("Semua");
  
  // Articles detail / edit state
  const [readingArticle, setReadingArticle] = useState<Berita | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formItem, setFormItem] = useState<Partial<Berita>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const categories = ["Semua", "Edukasi", "Kegiatan", "Pengumuman", "Opini"];
  
  // Filtered list
  const filteredList = berita.filter((item) => {
    const matchesSearch = 
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.konten.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.penulis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.kategori === selectedCategory;
    const matchesStatus = selectedStatus === "Semua" || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenForm = (item?: Berita) => {
    if (item) {
      setFormItem({ ...item });
    } else {
      setFormItem({
        id: "",
        judul: "",
        ringkasan: "",
        konten: "",
        penulis: "Admin Humas LPH",
        tanggalPublikasi: new Date().toISOString().split("T")[0],
        kategori: "Edukasi",
        status: "Draft",
        gambarUrl: "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=400",
        views: 0
      });
    }
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formItem.judul || !formItem.konten || !formItem.ringkasan) return;

    const payload = {
      ...(formItem as Berita),
      id: formItem.id || `news_${Date.now()}`
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
      {/* Search and Filters bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="flex-1 max-w-sm relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul artikel atau nama penulis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Tab Groups and Status filter */}
        <div className="flex flex-wrap items-center gap-3.5">
          {/* Categories select */}
          <div className="flex gap-1.5 flex-wrap">
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
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* Status select dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="Dipublikasikan">Dipublikasikan</option>
            <option value="Draft">Draft</option>
          </select>

          {isAdmin && (
            <button
              onClick={() => handleOpenForm()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 text-xs px-3.5 py-1.5 rounded-lg transition cursor-pointer"
            >
              <Plus size={14} /> Berita Baru
            </button>
          )}
        </div>
      </div>

      {/* Grid view of articles */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center text-slate-400 text-xs">
          Belum ada artikel atau konten edukasi terbit yang terdaftar.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col justify-between"
            >
              {/* Image banner area */}
              <div className="h-44 bg-slate-100 border-b border-slate-100 relative group overflow-hidden">
                {item.gambarUrl ? (
                  <img
                    src={item.gambarUrl}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Newspaper size={40} className="stroke-1" />
                  </div>
                )}
                
                {/* Category tag */}
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                  {item.kategori}
                </span>

                {/* Status indicator tag */}
                <span className={`absolute top-3 right-3 text-[9px] font-bold px-1.5 py-0.5 rounded shadow ${
                  item.status === "Dipublikasikan" 
                    ? "bg-emerald-500 text-white" 
                    : "bg-amber-500/90 text-white"
                }`}>
                  {item.status}
                </span>
              </div>

              {/* Body content info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {item.tanggalPublikasi}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-snug line-clamp-2">
                    {item.judul}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans line-clamp-3">
                    {item.ringkasan}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-sans font-medium">
                  <div className="flex items-center gap-1">
                    <User size={12} className="text-slate-300" />
                    <span className="truncate max-w-[100px]">{item.penulis}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <div className="flex items-center gap-0.5">
                      <Eye size={12} />
                      <span>{item.views}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action bar and read button */}
              <div className="border-t border-slate-50 p-4 bg-slate-50/50 flex justify-between items-center">
                <button
                  onClick={() => setReadingArticle(item)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-500 hover:underline flex items-center gap-1 py-1"
                >
                  <BookOpen size={13} /> Baca Rincian
                </button>

                {isAdmin && (
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenForm(item)}
                      className="p-1 text-slate-400 hover:text-emerald-600 bg-white border border-slate-200 rounded"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600 bg-white border border-slate-200 rounded"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
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
                <h4 className="text-sm font-bold">Hapus Artikel Berita?</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Tindakan ini permanen. Artikel syiar edukasi yang dihapus tidak akan ditampilkan lagi kepada khalayak umum.
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
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* READING VIEW MODAL */}
      <AnimatePresence>
        {readingArticle && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 border border-slate-200/80"
            >
              {/* Photo top */}
              {readingArticle.gambarUrl && (
                <div className="h-56 w-full rounded-lg overflow-hidden border border-slate-100">
                  <img
                    src={readingArticle.gambarUrl}
                    alt={readingArticle.judul}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100 font-mono">
                    {readingArticle.kategori}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{readingArticle.tanggalPublikasi}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {readingArticle.judul}
                </h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                  <span>Oleh: {readingArticle.penulis}</span>
                  <span>•</span>
                  <span>Dilihat: {readingArticle.views} Kali</span>
                </div>
              </div>

              {/* Rangkuman */}
              <div className="bg-slate-50 p-3 rounded-lg border-l-4 border-indigo-500 text-xs text-slate-600 font-sans leading-relaxed">
                <span className="font-bold text-slate-800 uppercase block text-[10px] tracking-wider mb-0.5">Sari Berita:</span>
                {readingArticle.ringkasan}
              </div>

              {/* Konten text */}
              <div className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-wrap max-h-[170px] overflow-y-auto pr-2 border-y border-slate-100 py-3.5">
                {readingArticle.konten}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setReadingArticle(null)}
                  className="px-4.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Selesai Membaca
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
              className="bg-white rounded-xl max-w-xl w-full p-6 space-y-4 border border-slate-200"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-800">
                  {formItem.id ? "Ubah Tulisan Berita" : "Tulis Berita Halal Baru"}
                </h4>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-3 xl:space-y-4 text-xs font-sans">
                {/* Judul artikel */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Judul Berita / Edukasi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sosialisasi Jaminan Produk Halal UMKM Cilacap"
                    value={formItem.judul || ""}
                    onChange={(e) => setFormItem(prev => ({ ...prev, judul: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Kategori, Penulis, tanggal */}
                <div className="grid grid-cols-3 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Kategori</label>
                    <select
                      value={formItem.kategori || "Edukasi"}
                      onChange={(e) => setFormItem(prev => ({ ...prev, kategori: e.target.value as any }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Edukasi">Edukasi</option>
                      <option value="Kegiatan">Kegiatan</option>
                      <option value="Pengumuman">Pengumuman</option>
                      <option value="Opini">Opini</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Penulis / Kontributor</label>
                    <input
                      type="text"
                      required
                      value={formItem.penulis || ""}
                      onChange={(e) => setFormItem(prev => ({ ...prev, penulis: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Tanggal Rilis</label>
                    <input
                      type="date"
                      required
                      value={formItem.tanggalPublikasi || ""}
                      onChange={(e) => setFormItem(prev => ({ ...prev, tanggalPublikasi: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                {/* Image url & Status */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Tautan Gambar Sampul (Visual URL)</label>
                    <input
                      type="text"
                      placeholder="Contoh: https://images.unsplash.com/photo..."
                      value={formItem.gambarUrl || ""}
                      onChange={(e) => setFormItem(prev => ({ ...prev, gambarUrl: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500">Status Terbitan</label>
                    <select
                      value={formItem.status || "Draft"}
                      onChange={(e) => setFormItem(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                    >
                      <option value="Draft">Draft (Simpan Sementara)</option>
                      <option value="Dipublikasikan">Dipublikasikan (Publikasi Langsung)</option>
                    </select>
                  </div>
                </div>

                {/* Ringkasan */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Sari/Ringkasan Ringkas (Feed Subtitle)</label>
                  <input
                    type="text"
                    required
                    maxLength={160}
                    placeholder="Inti satu sampai dua kalimat pengantar untuk feed sosial..."
                    value={formItem.ringkasan || ""}
                    onChange={(e) => setFormItem(prev => ({ ...prev, ringkasan: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                </div>

                {/* Konten Utama */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Isi Konten Berita</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Ketik liputan kegiatan, ulasan titik kritis syubhat bahan baku roti, bimbingan, dll secara edukatif di sini..."
                    value={formItem.konten || ""}
                    onChange={(e) => setFormItem(prev => ({ ...prev, konten: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium leading-relaxed font-sans"
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
                    Simpan Berita
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
