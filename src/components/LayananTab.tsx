/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Layanan, 
  PendaftaranSertifikatHalal, 
  SertifikatHalalRecord, 
  AuditJadwal 
} from "../types";
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
  AlertTriangle,
  FileText,
  Calendar,
  Building,
  Phone,
  MapPin,
  Award,
  CheckCircle,
  Hash
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LayananTabProps {
  layanan: Layanan[];
  onCreate: (item: Layanan) => void;
  onUpdate: (item: Layanan) => void;
  onDelete: (id: string) => void;
  
  pendaftaran: PendaftaranSertifikatHalal[];
  onUpdatePendaftaran: (data: PendaftaranSertifikatHalal[]) => void;
  
  sertifikatRecords: SertifikatHalalRecord[];
  onUpdateSertifikatRecords: (data: SertifikatHalalRecord[]) => void;
  
  auditJadwal: AuditJadwal[];
  onUpdateAuditJadwal: (data: AuditJadwal[]) => void;
  
  isAdmin: boolean;
  role?: string;
}

export default function LayananTab({
  layanan,
  onCreate,
  onUpdate,
  onDelete,
  
  pendaftaran,
  onUpdatePendaftaran,
  
  sertifikatRecords,
  onUpdateSertifikatRecords,
  
  auditJadwal,
  onUpdateAuditJadwal,
  
  isAdmin
}: LayananTabProps) {
  // Navigation for submenus inside Layanan
  const [subTab, setSubTab] = useState<"pendaftaran" | "ruang_lingkup" | "pencarian" | "daftar_audit">("pendaftaran");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedLayanan, setSelectedLayanan] = useState<Layanan | null>(null);

  // States for general modals
  const [isLayananFormOpen, setIsLayananFormOpen] = useState(false);
  const [layananFormItem, setLayananFormItem] = useState<Partial<Layanan>>({});
  const [newRequirement, setNewRequirement] = useState("");

  // States for Pendaftaran Modal
  const [isPendaftaranFormOpen, setIsPendaftaranFormOpen] = useState(false);
  const [pendaftaranFormItem, setPendaftaranFormItem] = useState<Partial<PendaftaranSertifikatHalal>>({});

  // States for Sertifikat Modal
  const [isSertifikatFormOpen, setIsSertifikatFormOpen] = useState(false);
  const [sertifikatFormItem, setSertifikatFormItem] = useState<Partial<SertifikatHalalRecord>>({});

  // States for Audit Modal
  const [isAuditFormOpen, setIsAuditFormOpen] = useState(false);
  const [auditFormItem, setAuditFormItem] = useState<Partial<AuditJadwal>>({});

  // Confirm delete states specifying the category
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteType, setConfirmDeleteType] = useState<"layanan" | "pendaftaran" | "sertifikat" | "audit" | null>(null);

  const categories = ["Semua", "Sertifikasi", "Pendampingan", "Pelatihan", "Konsultasi"];

  // Helper values to format cost
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // -----------------------------------------------------------------
  // CRUD CONTROLS - SUBMENU 1: PENDAFTARAN SERTIFIKAT HALAL
  // -----------------------------------------------------------------
  const handleOpenPendaftaranForm = (item?: PendaftaranSertifikatHalal) => {
    if (item) {
      setPendaftaranFormItem({ ...item });
    } else {
      setPendaftaranFormItem({
        id: "",
        namaPerusahaan: "",
        namaProduk: "",
        tanggalDaftar: new Date().toISOString().split("T")[0],
        jenisProduk: "Makanan Olahan",
        nomorKontak: "",
        status: "Draf"
      });
    }
    setIsPendaftaranFormOpen(true);
  };

  const handleSavePendaftaran = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendaftaranFormItem.namaPerusahaan || !pendaftaranFormItem.namaProduk) return;

    if (pendaftaranFormItem.id) {
      const updated = pendaftaran.map(x => x.id === pendaftaranFormItem.id ? (pendaftaranFormItem as PendaftaranSertifikatHalal) : x);
      onUpdatePendaftaran(updated);
    } else {
      const newItem: PendaftaranSertifikatHalal = {
        ...(pendaftaranFormItem as PendaftaranSertifikatHalal),
        id: `reg_${Date.now()}`
      };
      onUpdatePendaftaran([newItem, ...pendaftaran]);
    }
    setIsPendaftaranFormOpen(false);
  };

  const handleDeletePendaftaran = (id: string) => {
    const filtered = pendaftaran.filter(x => x.id !== id);
    onUpdatePendaftaran(filtered);
  };

  // -----------------------------------------------------------------
  // CRUD CONTROLS - SUBMENU 2: RUANG LINGKUP & LAYANAN PEMERIKSAAN
  // -----------------------------------------------------------------
  const handleOpenLayananForm = (item?: Layanan) => {
    if (item) {
      setLayananFormItem({ ...item });
    } else {
      setLayananFormItem({
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
    setIsLayananFormOpen(true);
  };

  const handleSaveLayanan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!layananFormItem.nama || !layananFormItem.kode || !layananFormItem.deskripsi) return;

    const payload = {
      ...(layananFormItem as Layanan),
      id: layananFormItem.id || `lay_${Date.now()}`
    };

    if (layananFormItem.id) {
      onUpdate(payload);
    } else {
      onCreate(payload);
    }
    setIsLayananFormOpen(false);
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      const requirements = layananFormItem.persyaratan || [];
      setLayananFormItem(prev => ({
        ...prev,
        persyaratan: [...requirements, newRequirement.trim()]
      }));
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (idx: number) => {
    setLayananFormItem(prev => ({
      ...prev,
      persyaratan: (prev.persyaratan || []).filter((_, i) => i !== idx)
    }));
  };

  // -----------------------------------------------------------------
  // CRUD CONTROLS - SUBMENU 3: PENCARIAN SERTIFIKASI HALAL RECORDS
  // -----------------------------------------------------------------
  const handleOpenSertifikatForm = (item?: SertifikatHalalRecord) => {
    if (item) {
      setSertifikatFormItem({ ...item });
    } else {
      setSertifikatFormItem({
        id: "",
        nomorSertifikat: `ID33${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
        namaPerusahaan: "",
        namaProduk: "",
        tanggalTerbit: new Date().toISOString().split("T")[0],
        tanggalKadaluarsa: new Date(new Date().setFullYear(new Date().getFullYear() + 4)).toISOString().split("T")[0],
        status: "Berlaku"
      });
    }
    setIsSertifikatFormOpen(true);
  };

  const handleSaveSertifikat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sertifikatFormItem.nomorSertifikat || !sertifikatFormItem.namaPerusahaan || !sertifikatFormItem.namaProduk) return;

    if (sertifikatFormItem.id) {
      const updated = sertifikatRecords.map(x => x.id === sertifikatFormItem.id ? (sertifikatFormItem as SertifikatHalalRecord) : x);
      onUpdateSertifikatRecords(updated);
    } else {
      const newItem: SertifikatHalalRecord = {
        ...(sertifikatFormItem as SertifikatHalalRecord),
        id: `cert_${Date.now()}`
      };
      onUpdateSertifikatRecords([newItem, ...sertifikatRecords]);
    }
    setIsSertifikatFormOpen(false);
  };

  const handleDeleteSertifikat = (id: string) => {
    const filtered = sertifikatRecords.filter(x => x.id !== id);
    onUpdateSertifikatRecords(filtered);
  };

  // -----------------------------------------------------------------
  // CRUD CONTROLS - SUBMENU 4: DAFTAR AUDIT
  // -----------------------------------------------------------------
  const handleOpenAuditForm = (item?: AuditJadwal) => {
    if (item) {
      setAuditFormItem({ ...item });
    } else {
      setAuditFormItem({
        id: "",
        namaPerusahaan: "",
        tanggalAudit: new Date().toISOString().split("T")[0],
        lokasi: "",
        auditorPenanggungJawab: "",
        status: "Terjadwal"
      });
    }
    setIsAuditFormOpen(true);
  };

  const handleSaveAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditFormItem.namaPerusahaan || !auditFormItem.lokasi || !auditFormItem.auditorPenanggungJawab) return;

    if (auditFormItem.id) {
      const updated = auditJadwal.map(x => x.id === auditFormItem.id ? (auditFormItem as AuditJadwal) : x);
      onUpdateAuditJadwal(updated);
    } else {
      const newItem: AuditJadwal = {
        ...(auditFormItem as AuditJadwal),
        id: `audj_${Date.now()}`
      };
      onUpdateAuditJadwal([newItem, ...auditJadwal]);
    }
    setIsAuditFormOpen(false);
  };

  const handleDeleteAudit = (id: string) => {
    const filtered = auditJadwal.filter(x => x.id !== id);
    onUpdateAuditJadwal(filtered);
  };

  // Universal handleDelete Router
  const triggerDeleteConfirm = (id: string, type: "layanan" | "pendaftaran" | "sertifikat" | "audit") => {
    setConfirmDeleteId(id);
    setConfirmDeleteType(type);
  };

  const executeDelete = () => {
    if (!confirmDeleteId || !confirmDeleteType) return;
    
    if (confirmDeleteType === "layanan") {
      onDelete(confirmDeleteId);
    } else if (confirmDeleteType === "pendaftaran") {
      handleDeletePendaftaran(confirmDeleteId);
    } else if (confirmDeleteType === "sertifikat") {
      handleDeleteSertifikat(confirmDeleteId);
    } else if (confirmDeleteType === "audit") {
      handleDeleteAudit(confirmDeleteId);
    }

    setConfirmDeleteId(null);
    setConfirmDeleteType(null);
  };

  // -----------------------------------------------------------------
  // FILTERING LOGIC PER SUB-MENU
  // -----------------------------------------------------------------
  const filteredLayananList = layanan.filter((item) => {
    const matchesSearch = 
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredPendaftaranList = pendaftaran.filter((item) => {
    return (
      item.namaPerusahaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaProduk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jenisProduk.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredSertifikatList = sertifikatRecords.filter((item) => {
    return (
      item.nomorSertifikat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaPerusahaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaProduk.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredAuditList = auditJadwal.filter((item) => {
    return (
      item.namaPerusahaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.auditorPenanggungJawab.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Dynamic Submenu Selector Tabs conforming to user requirements */}
      <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap gap-1">
        <button
          onClick={() => { setSubTab("pendaftaran"); setSearchQuery(""); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            subTab === "pendaftaran"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <FileText size={15} />
          Pendaftaran Sertifikat Halal
          <span className="text-[10px] ml-1 bg-black/10 px-1.5 py-0.5 rounded-full font-sans font-medium">
            {pendaftaran.length}
          </span>
        </button>

        <button
          onClick={() => { setSubTab("ruang_lingkup"); setSearchQuery(""); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            subTab === "ruang_lingkup"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Briefcase size={15} />
          Ruang Lingkup & Layanan Pemeriksaan Halal
          <span className="text-[10px] ml-1 bg-black/10 px-1.5 py-0.5 rounded-full font-sans font-medium">
            {layanan.length}
          </span>
        </button>

        <button
          onClick={() => { setSubTab("pencarian"); setSearchQuery(""); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            subTab === "pencarian"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Search size={15} />
          Pencarian Sertifikasi Halal
          <span className="text-[10px] ml-1 bg-black/10 px-1.5 py-0.5 rounded-full font-sans font-medium">
            {sertifikatRecords.length}
          </span>
        </button>

        <button
          onClick={() => { setSubTab("daftar_audit"); setSearchQuery(""); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            subTab === "daftar_audit"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Calendar size={15} />
          Daftar Audit Lapangan
          <span className="text-[10px] ml-1 bg-black/10 px-1.5 py-0.5 rounded-full font-sans font-medium">
            {auditJadwal.length}
          </span>
        </button>
      </div>

      {/* SEARCH AND ADD CONTROLS VIEW */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={
              subTab === "pendaftaran" ? "Cari nama perusahaan, produk..." :
              subTab === "ruang_lingkup" ? "Cari kode, nama, atau deskripsi layanan..." :
              subTab === "pencarian" ? "Cari No. Sertifikat, Perusahaan..." :
              "Cari Perusahaan, Lokasi, Auditor..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium font-sans"
          />
        </div>

        {/* Filter categories only for Ruang Lingkup catalog, else show CRUD creation actions */}
        <div className="flex flex-wrap items-center gap-2">
          {subTab === "ruang_lingkup" && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-slate-800 text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* ADD BUTTON TRIGGERS BASED ON ACTIVE SUB-MENU */}
          {isAdmin && (
            <>
              {subTab === "pendaftaran" && (
                <button
                  onClick={() => handleOpenPendaftaranForm()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-lg transition shadow-xs cursor-pointer"
                >
                  <Plus size={14} /> Tambah Pendaftaran
                </button>
              )}

              {subTab === "ruang_lingkup" && (
                <button
                  onClick={() => handleOpenLayananForm()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-lg transition shadow-xs cursor-pointer"
                >
                  <Plus size={14} /> Tambah Ruang Lingkup
                </button>
              )}

              {subTab === "pencarian" && (
                <button
                  onClick={() => handleOpenSertifikatForm()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-lg transition shadow-xs cursor-pointer"
                >
                  <Plus size={14} /> Terbitkan Sertifikat
                </button>
              )}

              {subTab === "daftar_audit" && (
                <button
                  onClick={() => handleOpenAuditForm()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-lg transition shadow-xs cursor-pointer"
                >
                  <Plus size={14} /> Jadwalkan Audit Baru
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* RENDER DYNAMIC SUB-MENU SHEETS */}
      <div className="space-y-4">
        
        {/* SUBMENU 1: PENDAFTARAN SERTIFIKAT HALAL */}
        {subTab === "pendaftaran" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
            {filteredPendaftaranList.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                Belum ada pendaftaran Sertifikasi Halal yang sesuai pencarian Anda.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider border-b border-slate-100">
                      <th className="p-4 pl-6">Pelaku Usaha / Perusahaan</th>
                      <th className="p-4">Daftar Merek Produk</th>
                      <th className="p-4">Kategori Produk</th>
                      <th className="p-4">Tanggal Masuk</th>
                      <th className="p-4 font-mono">Hubungi</th>
                      <th className="p-4">Status Alur</th>
                      {isAdmin && <th className="p-4 text-right pr-6">Tindakan</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredPendaftaranList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 pl-6 font-semibold text-slate-900">{item.namaPerusahaan}</td>
                        <td className="p-4 text-slate-600 max-w-xs truncate" title={item.namaProduk}>{item.namaProduk}</td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-md font-semibold text-[10px]">
                            {item.jenisProduk}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">{item.tanggalDaftar}</td>
                        <td className="p-4 font-mono text-slate-500">{item.nomorKontak || "-"}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.status === "Selesai" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                            item.status === "Diproses" ? "bg-blue-50 text-blue-700 border-blue-200" :
                            item.status === "Ditolak" ? "bg-red-50 text-red-700 border-red-200" :
                            "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="p-4 text-right pr-6">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenPendaftaranForm(item)}
                                className="p-1.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 rounded-md transition cursor-pointer"
                                title="Ubah"
                              >
                                <Edit size={13} />
                              </button>
                              <button
                                onClick={() => triggerDeleteConfirm(item.id, "pendaftaran")}
                                className="p-1.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-md transition cursor-pointer"
                                title="Hapus"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SUBMENU 2: RUANG LINGKUP & LAYANAN CATALOG */}
        {subTab === "ruang_lingkup" && (
          <div>
            {filteredLayananList.length === 0 ? (
              <div className="bg-white rounded-xl p-12 border border-slate-200 text-center text-slate-400 text-xs">
                Belum ada data layanan Halal yang cocok dengan pencarian Anda.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                {filteredLayananList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-slate-200/85 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between relative group overflow-hidden"
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
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleOpenLayananForm(item)}
                              className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 transition cursor-pointer"
                              title="Ubah"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => triggerDeleteConfirm(item.id, "layanan")}
                              className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition cursor-pointer"
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
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed font-sans font-medium">
                          {item.deskripsi}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-slate-500 font-semibold font-sans">
                        <div className="flex items-center gap-1">
                          <Clock size={13} className="text-slate-400" />
                          <span>~{item.estimasiHari} Hari Kerja</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag size={13} className="text-slate-400" />
                          <span className="font-bold text-slate-800">{formatRupiah(item.biayaNominal)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Requirement section triggers */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-sans font-medium">
                        {item.persyaratan.length} Dokumen Persyaratan
                      </span>
                      <button
                        onClick={() => setSelectedLayanan(item)}
                        className="text-[11px] font-bold text-emerald-600 hover:text-emerald-500 hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <Info size={13} /> Lihat Persyaratan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBMENU 3: PENCARIAN SERTIFIKASI HALAL */}
        {subTab === "pencarian" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
            <div className="p-5 bg-emerald-50/50 border-b border-slate-100 flex items-center gap-3">
              <Award className="text-emerald-600 shrink-0" size={20} />
              <div>
                <h4 className="text-xs font-bold text-slate-800">Direktori Publik Sertifikat Halal LPH Al-Ghazali</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Seluruh lembar ketetapan kehalalan produk yang diterbitkan resmi oleh BPJPH dengan pengujian di LPH UNUGHA Al-Ghazali.</p>
              </div>
            </div>

            {filteredSertifikatList.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                Tidak ada data sertifikasi halal terdaftar yang cocok dengan pencarian Anda.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider border-b border-slate-100">
                      <th className="p-4 pl-6 font-mono text-emerald-800">No. Sertifikat</th>
                      <th className="p-4">Pelaku Usaha (Produsen)</th>
                      <th className="p-4">Nama Produk / Rincian Ketetapan</th>
                      <th className="p-4">Terbit Resmi</th>
                      <th className="p-4">Berlaku Sampai</th>
                      <th className="p-4">Status Layanan</th>
                      {isAdmin && <th className="p-4 text-right pr-6">Tindakan</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredSertifikatList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 pl-6 font-mono font-bold text-slate-900 group">
                          <span className="flex items-center gap-1.5 text-emerald-700">
                            <Hash size={12} className="text-slate-400" />
                            {item.nomorSertifikat}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-slate-800">{item.namaPerusahaan}</td>
                        <td className="p-4 text-slate-600 max-w-sm font-sans">{item.namaProduk}</td>
                        <td className="p-4 text-slate-500">{item.tanggalTerbit}</td>
                        <td className="p-4 text-slate-500">
                          {item.tanggalKadaluarsa === "Selamanya" ? (
                            <span className="font-bold text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded border border-emerald-200">
                              Selamanya (UU Ciptaker)
                            </span>
                          ) : (
                            item.tanggalKadaluarsa
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 w-fit ${
                            item.status === "Berlaku" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                            "bg-rose-50 text-rose-700 border-rose-200"
                          }`}>
                            <CheckCircle size={10} />
                            {item.status}
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="p-4 text-right pr-6">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenSertifikatForm(item)}
                                className="p-1.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 rounded-md transition cursor-pointer"
                                title="Ubah"
                              >
                                <Edit size={13} />
                              </button>
                              <button
                                onClick={() => triggerDeleteConfirm(item.id, "sertifikat")}
                                className="p-1.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-md transition cursor-pointer"
                                title="Hapus"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SUBMENU 4: DAFTAR AUDIT */}
        {subTab === "daftar_audit" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
            {filteredAuditList.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                Tidak ada agenda audit lapangan yang cocok dengan pencarian Anda.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider border-b border-slate-100">
                      <th className="p-4 pl-6">Perusahaan / Pelaku Usaha</th>
                      <th className="p-4">Tanggal Rencana Audit</th>
                      <th className="p-4">Lokasi Pabrik / Kantor</th>
                      <th className="p-4">Auditor Penunjuk LPH</th>
                      <th className="p-4">Status Peninjauan</th>
                      {isAdmin && <th className="p-4 text-right pr-6">Tindakan</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredAuditList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-2">
                            <Building className="text-slate-400 shrink-0" size={14} />
                            <span className="font-semibold text-slate-900">{item.namaPerusahaan}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 font-mono font-bold flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          {item.tanggalAudit}
                        </td>
                        <td className="p-4 text-slate-600 max-w-xs truncate" title={item.lokasi}>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-slate-400 shrink-0" />
                            {item.lokasi}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-emerald-800">{item.auditorPenanggungJawab}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.status === "Laporan Selesai" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                            item.status === "Sedang Audit" ? "bg-blue-50 text-blue-700 border-blue-200 font-bold" :
                            "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="p-4 text-right pr-6">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenAuditForm(item)}
                                className="p-1.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 rounded-md transition cursor-pointer"
                                title="Ubah"
                              >
                                <Edit size={13} />
                              </button>
                              <button
                                onClick={() => triggerDeleteConfirm(item.id, "audit")}
                                className="p-1.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-md transition cursor-pointer"
                                title="Hapus"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* -----------------------------------------------------------------
          UNIVERSAL DELETE CONFIRMATION MODAL
         ----------------------------------------------------------------- */}
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
                <h4 className="text-sm font-bold">Hapus Data Permanen?</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                Tindakan menghapus data {confirmDeleteType === "layanan" ? "ruang lingkup pelayanan" : confirmDeleteType === "pendaftaran" ? "pendaftaran pelaku usaha" : confirmDeleteType === "sertifikat" ? "sertifikat halal terbit" : "jadwal audit lapangan"} ini bersifat permanen dan seketika dihapus dari memori database LPH Al-Ghazali.
              </p>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => { setConfirmDeleteId(null); setConfirmDeleteType(null); }}
                  className="px-3.5 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-bold cursor-pointer transition border border-slate-200"
                >
                  Batal
                </button>
                <button
                  onClick={executeDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold cursor-pointer transition"
                >
                  Hapus Permanen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -----------------------------------------------------------------
          SUBMENU 1: PENDAFTARAN MODAL FORM
         ----------------------------------------------------------------- */}
      <AnimatePresence>
        {isPendaftaranFormOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                  <FileText className="text-emerald-600" size={16} />
                  {pendaftaranFormItem.id ? "Ubah Berkas Pendaftaran UMKM" : "Form Registrasi Sertifikat Halal"}
                </h4>
                <button
                  onClick={() => setIsPendaftaranFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSavePendaftaran} className="space-y-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Nama Perusahaan / Pelaku Usaha</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: CV. Berkah Makmur Mendoan"
                    value={pendaftaranFormItem.namaPerusahaan || ""}
                    onChange={(e) => setPendaftaranFormItem(prev => ({ ...prev, namaPerusahaan: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Daftar Merek / Nama Produk</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Keripik Tempe Aneka Rasa"
                    value={pendaftaranFormItem.namaProduk || ""}
                    onChange={(e) => setPendaftaranFormItem(prev => ({ ...prev, namaProduk: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Kategori Produk</label>
                    <input
                      type="text"
                      required
                      placeholder="Makanan Olahan, dll"
                      value={pendaftaranFormItem.jenisProduk || ""}
                      onChange={(e) => setPendaftaranFormItem(prev => ({ ...prev, jenisProduk: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Hubungi (Kontak No)</label>
                    <input
                      type="text"
                      placeholder="0812-xxxx-xxxx"
                      value={pendaftaranFormItem.nomorKontak || ""}
                      onChange={(e) => setPendaftaranFormItem(prev => ({ ...prev, nomorKontak: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Tanggal Daftar</label>
                    <input
                      type="date"
                      required
                      value={pendaftaranFormItem.tanggalDaftar || ""}
                      onChange={(e) => setPendaftaranFormItem(prev => ({ ...prev, tanggalDaftar: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Status Alur Berkas</label>
                    <select
                      value={pendaftaranFormItem.status || "Draf"}
                      onChange={(e) => setPendaftaranFormItem(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Draf">Draf (Persiapan Dokumen)</option>
                      <option value="Diproses">Diproses (Penunjukan Auditor)</option>
                      <option value="Selesai">Selesai (Ketetapan Terbit)</option>
                      <option value="Ditolak">Ditolak (Bahan Kritis Bermasalah)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsPendaftaranFormOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg font-bold border border-slate-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition"
                  >
                    Simpan Registrasi
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -----------------------------------------------------------------
          SUBMENU 2: LAYANAN CATALOG REQUIREMENTS DETAIL MODAL
         ----------------------------------------------------------------- */}
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
                  <h4 className="text-xs font-bold text-slate-800 mt-1">{selectedLayanan.nama}</h4>
                </div>
                <button
                  onClick={() => setSelectedLayanan(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dokumen Persyaratan Wajib:</h5>
                <div className="space-y-2">
                  {selectedLayanan.persyaratan.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Pemeriksaan ini tidak memerlukan dokumen pendukung.</p>
                  ) : (
                    selectedLayanan.persyaratan.map((req, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-xs text-slate-650">
                        <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-sans font-medium leading-relaxed">{req}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex justify-end">
                <button
                  onClick={() => setSelectedLayanan(null)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-emerald-500 transition shadow-sm"
                >
                  Tutup Persyaratan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -----------------------------------------------------------------
          SUBMENU 2: LAYANAN MODAL FORM
         ----------------------------------------------------------------- */}
      <AnimatePresence>
        {isLayananFormOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                  <Briefcase size={15} className="text-emerald-600" />
                  {layananFormItem.id ? "Ubah Data Lingkup Pelayanan LPH" : "Pendaftaran Lingkup Layanan Baru"}
                </h4>
                <button
                  onClick={() => setIsLayananFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveLayanan} className="space-y-3.5 text-xs font-sans">
                {/* Kode & Kategori */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Kode Layanan</label>
                    <input
                      type="text"
                      required
                      value={layananFormItem.kode || ""}
                      onChange={(e) => setLayananFormItem(prev => ({ ...prev, kode: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Kategori</label>
                    <select
                      value={layananFormItem.kategori || "Sertifikasi"}
                      onChange={(e) => setLayananFormItem(prev => ({ ...prev, kategori: e.target.value as any }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                  <label className="font-bold text-slate-500">Nama Layanan / Skop Pemeriksaan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pemeriksaan Halal Makanan / Minuman Olahan Ringan"
                    value={layananFormItem.nama || ""}
                    onChange={(e) => setLayananFormItem(prev => ({ ...prev, nama: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Deskripsi */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Deskripsi Ringkas</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Tuliskan jangkauan bidang pengujian laboratorium atau audit lapangannya..."
                    value={layananFormItem.deskripsi || ""}
                    onChange={(e) => setLayananFormItem(prev => ({ ...prev, deskripsi: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                  />
                </div>

                {/* Duration & Budget */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Estimasi Hari Kerja</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={layananFormItem.estimasiHari || 14}
                      onChange={(e) => setLayananFormItem(prev => ({ ...prev, estimasiHari: parseInt(e.target.value) }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Tarif BPJPH (Nominal Rupiah)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={layananFormItem.biayaNominal || 0}
                      onChange={(e) => setLayananFormItem(prev => ({ ...prev, biayaNominal: parseInt(e.target.value) }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Requirements Checklist Manager */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <label className="font-bold text-slate-600 block">Daftar Persyaratan Dokumen ({layananFormItem.persyaratan?.length || 0})</label>
                  
                  <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                    {(layananFormItem.persyaratan || []).map((req, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-slate-50 border border-slate-100 p-2 rounded-lg justify-between text-[11px]">
                        <span className="truncate flex-1 font-semibold text-slate-700">{req}</span>
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
                      placeholder="Contoh: Lampiran Matriks Bahan, SJPH, NIB..."
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddRequirement}
                      className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg font-bold"
                    >
                      Sisipkan
                    </button>
                  </div>
                </div>

                {/* Submits */}
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsLayananFormOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 rounded-lg font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition"
                  >
                    Simpan Layanan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -----------------------------------------------------------------
          SUBMENU 3: SERTIFIKAT MODAL FORM
         ----------------------------------------------------------------- */}
      <AnimatePresence>
        {isSertifikatFormOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                  <Award className="text-emerald-600" size={16} />
                  {sertifikatFormItem.id ? "Ubah Keterangan Sertifikat" : "Terbitkan Sertifikat Halal Baru"}
                </h4>
                <button
                  onClick={() => setIsSertifikatFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveSertifikat} className="space-y-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Nomor Registrasi Sertifikat Halal (BPJPH)</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: ID33110000xxxxxxxxx"
                    value={sertifikatFormItem.nomorSertifikat || ""}
                    onChange={(e) => setSertifikatFormItem(prev => ({ ...prev, nomorSertifikat: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 text-emerald-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Nama Perusahaan Pemegang</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT. Roti Enak UNUGHA Cilacap"
                    value={sertifikatFormItem.namaPerusahaan || ""}
                    onChange={(e) => setSertifikatFormItem(prev => ({ ...prev, namaPerusahaan: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Detail Produk / Ruang Lingkup Sertifikasi</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Contoh: Roti Manis Isian Coklat, Keju, Stroberi, Blueberry..."
                    value={sertifikatFormItem.namaProduk || ""}
                    onChange={(e) => setSertifikatFormItem(prev => ({ ...prev, namaProduk: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Tanggal Terbit Kewenangan</label>
                    <input
                      type="date"
                      required
                      value={sertifikatFormItem.tanggalTerbit || ""}
                      onChange={(e) => setSertifikatFormItem(prev => ({ ...prev, tanggalTerbit: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Masa Berlaku Akhir</label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan Tanggal atau 'Selamanya'"
                      value={sertifikatFormItem.tanggalKadaluarsa || ""}
                      onChange={(e) => setSertifikatFormItem(prev => ({ ...prev, tanggalKadaluarsa: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Status Direktori</label>
                  <select
                    value={sertifikatFormItem.status || "Berlaku"}
                    onChange={(e) => setSertifikatFormItem(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Berlaku">Berlaku Aktif</option>
                    <option value="Kadaluarsa">Kadaluarsa / Perlu Pembaruan</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsSertifikatFormOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg font-bold border border-slate-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition"
                  >
                    Simpan Ketetapan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -----------------------------------------------------------------
          SUBMENU 4: AUDIT SCHEDULE MODAL FORM
         ----------------------------------------------------------------- */}
      <AnimatePresence>
        {isAuditFormOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                  <Calendar className="text-emerald-600" size={16} />
                  {auditFormItem.id ? "Ubah Jadwal Audit Lapangan" : "Form Agenda Audit Lapangan Baru"}
                </h4>
                <button
                  onClick={() => setIsAuditFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveAudit} className="space-y-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Nama Perusahaan / Objek Audit</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: CV. Rempah Sari Cilacap"
                    value={auditFormItem.namaPerusahaan || ""}
                    onChange={(e) => setAuditFormItem(prev => ({ ...prev, namaPerusahaan: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Rencana Kunjungan Lapangan (Tanggal)</label>
                  <input
                    type="date"
                    required
                    value={auditFormItem.tanggalAudit || ""}
                    onChange={(e) => setAuditFormItem(prev => ({ ...prev, tanggalAudit: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Alamat Lengkap Kunjungan Pabrik / Fasilitas</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jl. Slamet No. 10B, Cilacap Utara"
                    value={auditFormItem.lokasi || ""}
                    onChange={(e) => setAuditFormItem(prev => ({ ...prev, lokasi: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Auditor Utama Penanggung Jawab</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ir. H. Syarifuddin, M.Si"
                    value={auditFormItem.auditorPenanggungJawab || ""}
                    onChange={(e) => setAuditFormItem(prev => ({ ...prev, auditorPenanggungJawab: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Status Pemeriksaan Lapangan</label>
                  <select
                    value={auditFormItem.status || "Terjadwal"}
                    onChange={(e) => setAuditFormItem(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Terjadwal">Terjadwal (Belum Visitasi)</option>
                    <option value="Sedang Audit">Sedang Pengujian Lapangan</option>
                    <option value="Laporan Selesai">Laporan Selesai Sidang Fatwa</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAuditFormOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg font-bold border border-slate-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition"
                  >
                    Jadwalkan Audit
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
