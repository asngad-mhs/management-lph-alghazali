/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Profile, AuditorHalalItem, SDMSyariahItem, KerjasamaItem } from "../types";
import { 
  Building2, 
  Save, 
  Edit2, 
  ShieldAlert, 
  FileText, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Sparkles, 
  BookOpen, 
  Target, 
  Network, 
  Users, 
  UserCheck, 
  Handshake, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Calendar, 
  Image, 
  AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProfileTabProps {
  profile: Profile;
  onUpdate: (updated: Profile) => void;
  isAdmin: boolean;
}

type SubMenu = "umum" | "sejarah" | "visimisi" | "mutu" | "struktur" | "auditor" | "syariah" | "kerjasama";

export default function ProfileTab({ profile, onUpdate, isAdmin }: ProfileTabProps) {
  const [activeSubMenu, setActiveSubMenu] = useState<SubMenu>("umum");
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for profile and submenus
  const [edited, setEdited] = useState<Profile>({ ...profile });

  // Handle outside prop changes
  useEffect(() => {
    setEdited({ ...profile });
  }, [profile]);

  // Synchronize state back on edit
  const handleSaveAll = () => {
    onUpdate(edited);
    setIsEditing(false);
  };

  const handleCancelAll = () => {
    setEdited({ ...profile });
    setIsEditing(false);
  };

  // Helper change handler for flat inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEdited(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // -------------------------------------------------------------
  // Vision & Mission Management
  // -------------------------------------------------------------
  const [newMission, setNewMission] = useState("");
  const [editingMissionIdx, setEditingMissionIdx] = useState<number | null>(null);
  const [editingMissionText, setEditingMissionText] = useState("");

  const handleAddMission = () => {
    if (!newMission.trim()) return;
    setEdited(prev => {
      const copy = { ...prev };
      copy.mission = [...(copy.mission || []), newMission.trim()];
      return copy;
    });
    setNewMission("");
  };

  const handleRemoveMission = (idx: number) => {
    setEdited(prev => {
      const copy = { ...prev };
      copy.mission = (copy.mission || []).filter((_, i) => i !== idx);
      return copy;
    });
  };

  const handleStartEditMission = (idx: number, text: string) => {
    setEditingMissionIdx(idx);
    setEditingMissionText(text);
  };

  const handleSaveEditMission = (idx: number) => {
    if (!editingMissionText.trim()) return;
    setEdited(prev => {
      const copy = { ...prev };
      copy.mission = (copy.mission || []).map((m, i) => i === idx ? editingMissionText.trim() : m);
      return copy;
    });
    setEditingMissionIdx(null);
  };

  // -------------------------------------------------------------
  // Quality Policies & Targets (Kebijakan & Sasaran Mutu) Management
  // -------------------------------------------------------------
  const [newTarget, setNewTarget] = useState("");
  const [editingTargetIdx, setEditingTargetIdx] = useState<number | null>(null);
  const [editingTargetText, setEditingTargetText] = useState("");

  const handleAddTarget = () => {
    if (!newTarget.trim()) return;
    setEdited(prev => {
      const copy = { ...prev };
      copy.sasaranMutu = [...(copy.sasaranMutu || []), newTarget.trim()];
      return copy;
    });
    setNewTarget("");
  };

  const handleRemoveTarget = (idx: number) => {
    setEdited(prev => {
      const copy = { ...prev };
      copy.sasaranMutu = (copy.sasaranMutu || []).filter((_, i) => i !== idx);
      return copy;
    });
  };

  const handleStartEditTarget = (idx: number, text: string) => {
    setEditingTargetIdx(idx);
    setEditingTargetText(text);
  };

  const handleSaveEditTarget = (idx: number) => {
    if (!editingTargetText.trim()) return;
    setEdited(prev => {
      const copy = { ...prev };
      copy.sasaranMutu = (copy.sasaranMutu || []).map((t, i) => i === idx ? editingTargetText.trim() : t);
      return copy;
    });
    setEditingTargetIdx(null);
  };

  // -------------------------------------------------------------
  // Auditor Halal (Auditors) CRUD Management
  // -------------------------------------------------------------
  const [showAuditorForm, setShowAuditorForm] = useState(false);
  const [editingAuditorId, setEditingAuditorId] = useState<string | null>(null);
  const [auditorInput, setAuditorInput] = useState<{ nama: string; regNo: string; keahlian: string; status: "Aktif" | "Nonaktif" }>({
    nama: "",
    regNo: "",
    keahlian: "",
    status: "Aktif"
  });

  const handleOpenAddAuditor = () => {
    setEditingAuditorId(null);
    setAuditorInput({ nama: "", regNo: "", keahlian: "", status: "Aktif" });
    setShowAuditorForm(true);
  };

  const handleOpenEditAuditor = (aud: AuditorHalalItem) => {
    setEditingAuditorId(aud.id);
    setAuditorInput({ nama: aud.nama, regNo: aud.regNo, keahlian: aud.keahlian, status: aud.status });
    setShowAuditorForm(true);
  };

  const handleSaveAuditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditorInput.nama.trim() || !auditorInput.regNo.trim()) return;

    setEdited(prev => {
      const copy = { ...prev };
      const currentAuditors = copy.auditors || [];
      if (editingAuditorId) {
        copy.auditors = currentAuditors.map(a => a.id === editingAuditorId ? { ...a, ...auditorInput } : a);
      } else {
        const newAud: AuditorHalalItem = {
          id: `aud_${Date.now()}`,
          ...auditorInput
        };
        copy.auditors = [...currentAuditors, newAud];
      }
      return copy;
    });
    setShowAuditorForm(false);
    setEditingAuditorId(null);
  };

  const handleDeleteAuditor = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus auditor ini?")) {
      setEdited(prev => {
        const copy = { ...prev };
        copy.auditors = (copy.auditors || []).filter(a => a.id !== id);
        return copy;
      });
    }
  };

  // -------------------------------------------------------------
  // SDM Syariah CRUD Management
  // -------------------------------------------------------------
  const [showSyariahForm, setShowSyariahForm] = useState(false);
  const [editingSyariahId, setEditingSyariahId] = useState<string | null>(null);
  const [syariahInput, setSyariahInput] = useState<{ nama: string; peran: string; sertifikasi: string }>({
    nama: "",
    peran: "",
    sertifikasi: ""
  });

  const handleOpenAddSyariah = () => {
    setEditingSyariahId(null);
    setSyariahInput({ nama: "", peran: "", sertifikasi: "" });
    setShowSyariahForm(true);
  };

  const handleOpenEditSyariah = (sdm: SDMSyariahItem) => {
    setEditingSyariahId(sdm.id);
    setSyariahInput({ nama: sdm.nama, peran: sdm.peran, sertifikasi: sdm.sertifikasi });
    setShowSyariahForm(true);
  };

  const handleSaveSyariah = (e: React.FormEvent) => {
    e.preventDefault();
    if (!syariahInput.nama.trim() || !syariahInput.peran.trim()) return;

    setEdited(prev => {
      const copy = { ...prev };
      const currentSdm = copy.sdmSyariah || [];
      if (editingSyariahId) {
        copy.sdmSyariah = currentSdm.map(s => s.id === editingSyariahId ? { ...s, ...syariahInput } : s);
      } else {
        const newSdm: SDMSyariahItem = {
          id: `sdm_${Date.now()}`,
          ...syariahInput
        };
        copy.sdmSyariah = [...currentSdm, newSdm];
      }
      return copy;
    });
    setShowSyariahForm(false);
    setEditingSyariahId(null);
  };

  const handleDeleteSyariah = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus SDM Syariah ini?")) {
      setEdited(prev => {
        const copy = { ...prev };
        copy.sdmSyariah = (copy.sdmSyariah || []).filter(s => s.id !== id);
        return copy;
      });
    }
  };

  // -------------------------------------------------------------
  // Kerjasama CRUD Management
  // -------------------------------------------------------------
  const [showKerjasamaForm, setShowKerjasamaForm] = useState(false);
  const [editingKerjasamaId, setEditingKerjasamaId] = useState<string | null>(null);
  const [kerjasamaInput, setKerjasamaInput] = useState<{ instansi: string; jenis: string; tanggal: string; status: "Berjalan" | "Selesai" | "Draf" }>({
    instansi: "",
    jenis: "",
    tanggal: new Date().toISOString().split('T')[0],
    status: "Berjalan"
  });

  const handleOpenAddKerjasama = () => {
    setEditingKerjasamaId(null);
    setKerjasamaInput({ instansi: "", jenis: "", tanggal: new Date().toISOString().split('T')[0], status: "Berjalan" });
    setShowKerjasamaForm(true);
  };

  const handleOpenEditKerjasama = (ks: KerjasamaItem) => {
    setEditingKerjasamaId(ks.id);
    setKerjasamaInput({ instansi: ks.instansi, jenis: ks.jenis, tanggal: ks.tanggal, status: ks.status });
    setShowKerjasamaForm(true);
  };

  const handleSaveKerjasama = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kerjasamaInput.instansi.trim() || !kerjasamaInput.jenis.trim()) return;

    setEdited(prev => {
      const copy = { ...prev };
      const currentKs = copy.kerjasamaList || [];
      if (editingKerjasamaId) {
        copy.kerjasamaList = currentKs.map(k => k.id === editingKerjasamaId ? { ...k, ...kerjasamaInput } : k);
      } else {
        const newKs: KerjasamaItem = {
          id: `ks_${Date.now()}`,
          ...kerjasamaInput
        };
        copy.kerjasamaList = [...currentKs, newKs];
      }
      return copy;
    });
    setShowKerjasamaForm(false);
    setEditingKerjasamaId(null);
  };

  const handleDeleteKerjasama = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data kerjasama ini?")) {
      setEdited(prev => {
        const copy = { ...prev };
        copy.kerjasamaList = (copy.kerjasamaList || []).filter(k => k.id !== id);
        return copy;
      });
    }
  };


  // Submenus configuration
  const menus = [
    { id: "umum" as SubMenu, label: "Profil LPH Al-Ghazali", icon: <Building2 size={16} />, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { id: "sejarah" as SubMenu, label: "Sejarah & Latar Belakang", icon: <BookOpen size={16} />, color: "text-sky-600 bg-sky-50 border-sky-100" },
    { id: "visimisi" as SubMenu, label: "Visi & Misi", icon: <Sparkles size={16} />, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { id: "mutu" as SubMenu, label: "Kebijakan & Sasaran Mutu", icon: <Target size={16} />, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { id: "struktur" as SubMenu, label: "Struktur Organisasi", icon: <Network size={16} />, color: "text-teal-600 bg-teal-50 border-teal-100" },
    { id: "auditor" as SubMenu, label: "Auditor Halal", icon: <Users size={16} />, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { id: "syariah" as SubMenu, label: "SDM Syariah", icon: <UserCheck size={16} />, color: "text-purple-600 bg-purple-50 border-purple-100" },
    { id: "kerjasama" as SubMenu, label: "Kerjasama Kemitraan", icon: <Handshake size={16} />, color: "text-rose-600 bg-rose-50 border-rose-100" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Upper Status Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 shadow-xs">
            {menus.find(m => m.id === activeSubMenu)?.icon || <Building2 size={26} />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Informasi Kelembagaan LPH Al-Ghazali 1
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Pusat pengelolaan profil, kebijakan mutu, kualifikasi auditor, dan kemitraan LPH.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            isEditing ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelAll}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-200 transition-all cursor-pointer"
                >
                  <X size={14} /> Batalkan
                </button>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <Save size={14} /> Simpan Perubahan
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm border border-slate-700 transition-all cursor-pointer"
              >
                <Edit2 size={13} /> Edit Informasi Kelembagaan
              </button>
            )
          ) : (
            <div className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
              <ShieldAlert size={14} className="shrink-0" />
              <span>Akses Tinjau (Hubungi Admin Manager/Editor untuk Hak Tulis)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Multi-Tab Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sub-Menu Sidebar (Responsive Mobile Dropdown & Desktop List) */}
        <div className="lg:col-span-3 space-y-2">
          {/* Desktop Left Nav list */}
          <div className="hidden lg:block bg-white border border-slate-200 rounded-xl p-2 shadow-xs space-y-1">
            <div className="p-3 pb-1.5">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Sub Menu Profil</span>
            </div>
            {menus.map((m) => {
              const matches = activeSubMenu === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setActiveSubMenu(m.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs font-medium font-sans border transition-all cursor-pointer ${
                    matches 
                      ? "bg-slate-900 text-white border-slate-900 font-semibold shadow-xs" 
                      : "text-slate-600 bg-transparent border-transparent hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className={`p-1 rounded-sm ${matches ? 'text-white' : 'text-slate-500'}`}>{m.icon}</span>
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Select Navigation dropdown */}
          <div className="block lg:hidden">
            <label className="text-xs font-bold text-slate-500 mb-1.5 block">Pilih Sub Menu Profil:</label>
            <select
              value={activeSubMenu}
              onChange={(e) => setActiveSubMenu(e.target.value as SubMenu)}
              className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
            >
              {menus.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Active Working Content Area */}
        <div className="lg:col-span-9 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          
          {/* Section Indicator Bar */}
          <div className="px-6 py-4 bg-slate-50 border-b border-secondary-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold font-mono">Daftar Menu {`//`}</span>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide font-sans">
                {menus.find(m => m.id === activeSubMenu)?.label}
              </span>
            </div>
            {isEditing && (
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded animate-pulse uppercase">
                ⚙️ SEDANG DIUBAH
              </span>
            )}
          </div>

          {/* Selected Component Card Section */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSubMenu}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >

                {/* 1. SUB MENU: PROFIL UMUM LPH (AL-GHAZALI) */}
                {activeSubMenu === "umum" && (
                  <div className="space-y-5">
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      Detail legal, alamat, dan nomor kontak utama institusi resmi Lembaga Pemeriksa Halal Universitas Islam Al-Ghazali Cilacap yang terdaftar pada sistem Sihalal BPJPH.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1 text-xs">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">ID LPH</label>
                        <input
                          type="text"
                          disabled
                          value={edited.id}
                          className="w-full p-2.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg cursor-not-allowed font-mono"
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Nama Resmi LPH</label>
                        <input
                          type="text"
                          name="name"
                          disabled={!isEditing}
                          value={edited.name}
                          onChange={handleChange}
                          className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold ${
                            isEditing ? "bg-white border-emerald-300" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Nama Singkatan / Alias</label>
                        <input
                          type="text"
                          name="alias"
                          disabled={!isEditing}
                          value={edited.alias}
                          onChange={handleChange}
                          className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium ${
                            isEditing ? "bg-white border-emerald-300" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Akreditasi Kelas LPH</label>
                        <input
                          type="text"
                          name="vocation"
                          disabled={!isEditing}
                          value={edited.vocation}
                          onChange={handleChange}
                          className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium ${
                            isEditing ? "bg-white border-emerald-300" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Lembaga Naungan</label>
                        <input
                          type="text"
                          name="institution"
                          disabled={!isEditing}
                          value={edited.institution}
                          onChange={handleChange}
                          className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans ${
                            isEditing ? "bg-white border-emerald-300" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Nomor SK Ketetapan BPJPH</label>
                        <input
                          type="text"
                          name="decreeNumber"
                          disabled={!isEditing}
                          value={edited.decreeNumber}
                          onChange={handleChange}
                          className={`w-full p-2.5 font-mono border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                            isEditing ? "bg-white border-emerald-300" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Keterangan Sertifikasi Akreditasi resmi</label>
                        <input
                          type="text"
                          name="accreditation"
                          disabled={!isEditing}
                          value={edited.accreditation}
                          onChange={handleChange}
                          className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                            isEditing ? "bg-white border-emerald-300" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Tanggal Mulai Berdiri</label>
                        <input
                          type="date"
                          name="established"
                          disabled={!isEditing}
                          value={edited.established}
                          onChange={handleChange}
                          className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold ${
                            isEditing ? "bg-white border-emerald-300" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                        />
                      </div>

                      <div className="space-y-1 text-xs sm:col-span-2">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Alamat Kantor LPH</label>
                        <textarea
                          name="address"
                          rows={2}
                          disabled={!isEditing}
                          value={edited.address}
                          onChange={handleChange}
                          className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans ${
                            isEditing ? "bg-white border-emerald-300" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Telepon Kantor</label>
                        <input
                          type="text"
                          name="phone"
                          disabled={!isEditing}
                          value={edited.phone}
                          onChange={handleChange}
                          className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                            isEditing ? "bg-white border-emerald-300" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Situs Web Resmi</label>
                        <input
                          type="text"
                          name="website"
                          disabled={!isEditing}
                          value={edited.website}
                          onChange={handleChange}
                          className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold text-emerald-600 ${
                            isEditing ? "bg-white border-emerald-300" : "bg-slate-50 border-slate-200"
                          }`}
                        />
                      </div>

                    </div>
                  </div>
                )}

                {/* 2. SUB MENU: SEJARAH DAN LATAR BELAKANG */}
                {activeSubMenu === "sejarah" && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      Dokumentasi kronikal pendirian LPH Al-Ghazali di Cilacap sebagai bagian dari tridharma perguruan tinggi UNUGHA Cilacap.
                    </p>

                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Naskah Sejarah Lembaga</label>
                      {isEditing ? (
                        <textarea
                          name="sejarah"
                          rows={10}
                          value={edited.sejarah || ""}
                          onChange={handleChange}
                          placeholder="Masukkan teks sejarah dan latar belakang LPH..."
                          className="w-full text-xs p-3.5 bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed text-slate-700"
                        />
                      ) : (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs text-slate-700 font-sans leading-loose whitespace-pre-wrap">
                          {edited.sejarah || "Sejarah belum terisi. Tekan tombol 'Edit Informasi Kelembagaan' di atas untuk melengkapi naskah sejarah."}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. SUB MENU: VISI DAN MISI (CRUD) */}
                {activeSubMenu === "visimisi" && (
                  <div className="space-y-5">
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      Aspirasi masa depan dan butir-butir misi implementasi LPH Al-Ghazali yang mengakar pada syiar islam Ahlussunnah wal Jama'ah An-Nahdliyah.
                    </p>

                    <div className="space-y-3">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Naskah Visi Utama</label>
                      {isEditing ? (
                        <textarea
                          name="vision"
                          rows={4}
                          value={edited.vision}
                          onChange={handleChange}
                          className="w-full text-xs p-3 bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed text-slate-700"
                        />
                      ) : (
                        <div className="bg-emerald-50/50 border-l-4 border-emerald-600 rounded-r-xl p-4 text-slate-800 text-xs italic font-sans leading-relaxed">
                          &ldquo;{edited.vision}&rdquo;
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Butir Misi Operasional</label>
                      </div>

                      <div className="space-y-3">
                        {(edited.mission || []).map((m, idx) => (
                          <div key={idx} className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex items-start gap-4 text-xs">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div className="flex-1 font-sans text-slate-700 leading-relaxed">
                              {editingMissionIdx === idx ? (
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={editingMissionText}
                                    onChange={(e) => setEditingMissionText(e.target.value)}
                                    className="flex-1 p-1 bg-white border border-emerald-300 rounded text-xs"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSaveEditMission(idx)}
                                    className="px-2 py-1 bg-emerald-600 rounded text-white text-[10px] font-bold"
                                  >
                                    OK
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingMissionIdx(null)}
                                    className="px-2 py-1 bg-slate-300 rounded text-slate-700 text-[10px] font-bold"
                                  >
                                    Batal
                                  </button>
                                </div>
                              ) : (
                                <span>{m}</span>
                              )}
                            </div>
                            
                            {isEditing && editingMissionIdx !== idx && (
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditMission(idx, m)}
                                  className="text-[10px] font-bold text-slate-500 hover:text-slate-800 hover:underline px-1.5 py-0.5"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMission(idx)}
                                  className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:underline px-1.5 py-0.5"
                                >
                                  Hapus
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Add new mission if editing is active */}
                      {isEditing && (
                        <div className="flex gap-2 p-3 bg-emerald-50/40 border border-emerald-200 rounded-xl">
                          <input
                            type="text"
                            placeholder="Ketik butir misi baru..."
                            value={newMission}
                            onChange={(e) => setNewMission(e.target.value)}
                            className="flex-1 text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                          />
                          <button
                            type="button"
                            onClick={handleAddMission}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={14} /> Tambahkan Misi
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                )}

                {/* 4. SUB MENU: KEBIJAKAN & SASARAN MUTU (CRUD) */}
                {activeSubMenu === "mutu" && (
                  <div className="space-y-5">
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      Perumusan komitmen mutu kerja LPH serta target empiris (KPI) keandalan, ketepatan, dan kepatuhan auditor atas prosedur.
                    </p>

                    <div className="space-y-3">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Naskah Direksi Kebijakan Mutu</label>
                      {isEditing ? (
                        <textarea
                          name="kebijakanMutu"
                          rows={4}
                          value={edited.kebijakanMutu || ""}
                          onChange={handleChange}
                          className="w-full text-xs p-3 bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed text-slate-700"
                        />
                      ) : (
                        <div className="bg-amber-50/30 border border-amber-200/60 rounded-xl p-4 text-slate-700 text-xs font-sans leading-relaxed">
                          {edited.kebijakanMutu || "Naskah kebijakan mutu belum didefinisikan secara resmi."}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Butir Sasaran Mutu (KPI)</label>
                      </div>

                      <div className="space-y-3">
                        {(edited.sasaranMutu || []).map((t, idx) => (
                          <div key={idx} className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex items-start gap-4 text-xs">
                            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div className="flex-1 font-sans text-slate-700 leading-relaxed">
                              {editingTargetIdx === idx ? (
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={editingTargetText}
                                    onChange={(e) => setEditingTargetText(e.target.value)}
                                    className="flex-1 p-1 bg-white border border-amber-300 rounded text-xs"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSaveEditTarget(idx)}
                                    className="px-2 py-1 bg-amber-600 rounded text-white text-[10px] font-bold"
                                  >
                                    OK
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingTargetIdx(null)}
                                    className="px-2 py-1 bg-slate-300 rounded text-slate-700 text-[10px] font-bold"
                                  >
                                    Batal
                                  </button>
                                </div>
                              ) : (
                                <span>{t}</span>
                              )}
                            </div>
                            
                            {isEditing && editingTargetIdx !== idx && (
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditTarget(idx, t)}
                                  className="text-[10px] font-bold text-slate-500 hover:text-slate-800 hover:underline px-1.5 py-0.5"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTarget(idx)}
                                  className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:underline px-1.5 py-0.5"
                                >
                                  Hapus
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        {(edited.sasaranMutu || []).length === 0 && (
                          <p className="text-xs text-slate-400 font-sans italic">Belum ada sasaran mutu yang ditambahkan.</p>
                        )}
                      </div>

                      {/* Add new target if editing is active */}
                      {isEditing && (
                        <div className="flex gap-2 p-3 bg-amber-50/20 border border-amber-200 rounded-xl">
                          <input
                            type="text"
                            placeholder="Ketik sasaran mutu baru..."
                            value={newTarget}
                            onChange={(e) => setNewTarget(e.target.value)}
                            className="flex-1 text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                          />
                          <button
                            type="button"
                            onClick={handleAddTarget}
                            className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-4 py-2 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={14} /> Sasaran Baru
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                )}

                {/* 5. SUB MENU: STRUKTUR ORGANISASI */}
                {activeSubMenu === "struktur" && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      Representasi visual organ kepemimpinan LPH Al-Ghazali, dewan fatwa/syariah, penyelia halal, dan seksi fungsional penanggung jawab.
                    </p>

                    <div className="space-y-4">
                      
                      <div className="space-y-1 text-xs">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Gambar Skema Struktur (URL)</label>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              name="strukturOrganisasiImg"
                              value={edited.strukturOrganisasiImg || ""}
                              onChange={handleChange}
                              placeholder="Masukkan tautan gambar Unsplash atau lainnya..."
                              className="flex-1 p-2.5 bg-white border border-emerald-300 rounded-lg text-xs font-mono text-slate-600"
                            />
                          </div>
                        ) : (
                          <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-80 bg-slate-50">
                            {edited.strukturOrganisasiImg ? (
                              <img
                                src={edited.strukturOrganisasiImg}
                                alt="Struktur Organisasi LPH"
                                referrerPolicy="no-referrer"
                                className="w-full object-cover max-h-80"
                              />
                            ) : (
                              <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                                <Image size={32} className="text-slate-300 animate-pulse" />
                                <span className="text-xs font-sans">Belum ada gambar struktur organisasi yang diunggah.</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 text-xs pt-2">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Deskripsi Pembagian Alur Kerja</label>
                        {isEditing ? (
                          <textarea
                            name="strukturOrganisasiDesc"
                            rows={4}
                            value={edited.strukturOrganisasiDesc || ""}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans text-slate-700 text-xs"
                          />
                        ) : (
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 leading-relaxed font-sans">
                            {edited.strukturOrganisasiDesc || "Belum ada deskripsi penjelasan struktur organisasi."}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}

                {/* 6. SUB MENU: AUDITOR HALAL (CRUD GRID) */}
                {activeSubMenu === "auditor" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-1">
                      <div>
                        <p className="text-xs text-slate-500 leading-relaxed font-sans">
                          Sertifikat & registrasi resmi Dewan Auditor Halal yang dimiliki oleh LPH Al-Ghazali 1 untuk keabsahan survei lapangan.
                        </p>
                      </div>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={handleOpenAddAuditor}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                        >
                          <Plus size={13} /> Tambah Auditor
                        </button>
                      )}
                    </div>

                    {/* Auditor input Form Modal / block if shown */}
                    {showAuditorForm && (
                      <form onSubmit={handleSaveAuditor} className="bg-slate-50 border-2 border-dashed border-blue-200 rounded-xl p-4 text-xs space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-blue-150">
                          <span className="font-bold text-slate-800 text-xs">
                            {editingAuditorId ? "Edit Data Auditor" : "Pendaftaran Anggota Auditor Baru"}
                          </span>
                          <button type="button" onClick={() => setShowAuditorForm(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={16} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600">Nama Lengkap & Gelar</label>
                            <input
                              type="text"
                              value={auditorInput.nama}
                              onChange={(e) => setAuditorInput({ ...auditorInput, nama: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-250 rounded font-sans focus:ring-1 focus:ring-blue-500 text-xs"
                              placeholder="Ketik nama auditor..."
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600">No. Registrasi BPJPH Resmi</label>
                            <input
                              type="text"
                              value={auditorInput.regNo}
                              onChange={(e) => setAuditorInput({ ...auditorInput, regNo: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-250 rounded font-mono focus:ring-1 focus:ring-blue-500 text-xs"
                              placeholder="REG-AUD-BPJPH-xxxxx"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600">Bidang Keahlian / Rumpun</label>
                            <input
                              type="text"
                              value={auditorInput.keahlian}
                              onChange={(e) => setAuditorInput({ ...auditorInput, keahlian: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-250 rounded font-sans focus:ring-1 focus:ring-blue-500 text-xs"
                              placeholder="Contoh: Rumpun Makanan Olahan..."
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600">Status Penugasan</label>
                            <select
                              value={auditorInput.status}
                              onChange={(e) => setAuditorInput({ ...auditorInput, status: e.target.value as "Aktif" | "Nonaktif" })}
                              className="w-full p-1.5 bg-white border border-slate-250 rounded focus:ring-1 focus:ring-blue-500 text-xs"
                            >
                              <option value="Aktif">Aktif (Tersedia)</option>
                              <option value="Nonaktif">Nonaktif (Off Duty)</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setShowAuditorForm(false)}
                            className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded font-bold"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-1.5 rounded font-bold hover:bg-blue-505"
                          >
                            Simpan Anggota
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Auditors Display List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(edited.auditors || []).map((aud) => (
                        <div key={aud.id} className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-xs font-sans hover:shadow-2xs transition relative flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800 text-sm">{aud.nama}</span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                                aud.status === "Aktif" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                              }`}>
                                {aud.status}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block font-mono">NO REGISTRASI BPJPH:</span>
                              <span className="font-mono text-slate-700 text-xs font-bold bg-white px-1.5 py-0.5 rounded border border-slate-150 inline-block mt-0.5">
                                {aud.regNo}
                              </span>
                            </div>
                            <div className="pt-1">
                              <span className="text-[10px] text-slate-400 block pb-0.5">KEAHLIAN RUMPUN:</span>
                              <p className="text-slate-600 leading-relaxed text-xs">{aud.keahlian}</p>
                            </div>
                          </div>

                          {isEditing && (
                            <div className="flex gap-2 justify-end border-t border-slate-100 pt-3 mt-3">
                              <button
                                type="button"
                                onClick={() => handleOpenEditAuditor(aud)}
                                className="text-slate-600 hover:text-slate-900 font-bold hover:underline flex items-center gap-0.5"
                              >
                                <Edit size={10} /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAuditor(aud.id)}
                                className="text-red-500 hover:text-red-700 font-bold hover:underline flex items-center gap-0.5"
                              >
                                <Trash2 size={10} /> Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      {(edited.auditors || []).length === 0 && (
                        <div className="col-span-2 text-center p-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/40 text-slate-400">
                          <Users size={28} className="mx-auto text-slate-300 mb-1" />
                          <p>Belum ada daftar auditor halal yang diunggah.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 7. SUB MENU: SDM SYARIAH (CRUD) */}
                {activeSubMenu === "syariah" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-1">
                      <div>
                        <p className="text-xs text-slate-500 leading-relaxed font-sans">
                          Dewan fungsional, ahli hukum Islam / fikih halal, dan dewan pengawas komite syariah LPH.
                        </p>
                      </div>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={handleOpenAddSyariah}
                          className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                        >
                          <Plus size={13} /> Tambah Ahli Syariah
                        </button>
                      )}
                    </div>

                    {/* Syariah input Form Block */}
                    {showSyariahForm && (
                      <form onSubmit={handleSaveSyariah} className="bg-slate-50 border-2 border-dashed border-purple-200 rounded-xl p-4 text-xs space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-purple-150">
                          <span className="font-bold text-slate-800 text-xs">
                            {editingSyariahId ? "Edit Ahli Syariah" : "Pendaftaran Anggota Ahli Syariah Baru"}
                          </span>
                          <button type="button" onClick={() => setShowSyariahForm(false)} className="text-slate-400 hover:text-slate-600 animate-pulse">
                            <X size={16} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600">Nama Tokoh / Ahli</label>
                            <input
                              type="text"
                              value={syariahInput.nama}
                              onChange={(e) => setSyariahInput({ ...syariahInput, nama: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-250 rounded font-sans focus:ring-1 focus:ring-purple-500 text-xs"
                              placeholder="K.H. Nama Lengkap, Gelar..."
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600">Jabatan / Peran di LPH</label>
                            <input
                              type="text"
                              value={syariahInput.peran}
                              onChange={(e) => setSyariahInput({ ...syariahInput, peran: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-250 rounded focus:ring-1 focus:ring-purple-500 text-xs"
                              placeholder="Contoh: Komite Syariah LPH..."
                              required
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="font-bold text-slate-600">Keterangan Sertifikasi Syariah / Rekomendasi MUI</label>
                            <input
                              type="text"
                              value={syariahInput.sertifikasi}
                              onChange={(e) => setSyariahInput({ ...syariahInput, sertifikasi: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-250 rounded focus:ring-1 focus:ring-purple-500 text-xs"
                              placeholder="Sertifikat Kepengawasan DSN-MUI No..."
                              required
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setShowSyariahForm(false)}
                            className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded font-bold"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="bg-purple-600 text-white px-4 py-1.5 rounded font-bold hover:bg-purple-650"
                          >
                            Daftarkan Ahli
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Syariah List */}
                    <div className="space-y-3">
                      {(edited.sdmSyariah || []).map((sdm) => (
                        <div key={sdm.id} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans">
                          <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100 font-bold">
                              ☪️
                            </div>
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-800 text-sm block">{sdm.nama}</span>
                              <div className="flex items-center gap-2 flex-wrap text-slate-500 text-[11px]">
                                <span className="font-medium text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-sans uppercase text-[10px]">{sdm.peran}</span>
                                <span>{`//`}</span>
                                <span className="text-slate-600 italic font-mono">{sdm.sertifikasi}</span>
                              </div>
                            </div>
                          </div>

                          {isEditing && (
                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => handleOpenEditSyariah(sdm)}
                                className="text-slate-600 hover:text-slate-900 font-bold hover:underline flex items-center gap-0.5"
                              >
                                <Edit size={10} /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSyariah(sdm.id)}
                                className="text-red-500 hover:text-red-700 font-bold hover:underline flex items-center gap-0.5"
                              >
                                <Trash2 size={10} /> Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      {(edited.sdmSyariah || []).length === 0 && (
                        <div className="text-center p-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/40 text-slate-400">
                          <UserCheck size={28} className="mx-auto text-slate-300 mb-1" />
                          <p>Belum ada tokoh fungsional sdm syariah terdaftar.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 8. SUB MENU: KERJASAMA KEMITRAAN (CRUD) */}
                {activeSubMenu === "kerjasama" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-1">
                      <div>
                        <p className="text-xs text-slate-500 leading-relaxed font-sans">
                          Sinergi fasilitasi dengan dinas terkait, aliansi laboratorium pengujian, maupun kemitraan dengan paguyuban UMKM regional.
                        </p>
                      </div>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={handleOpenAddKerjasama}
                          className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                        >
                          <Plus size={13} /> Tambah Mitra
                        </button>
                      )}
                    </div>

                    {/* Kerjasama Input Form */}
                    {showKerjasamaForm && (
                      <form onSubmit={handleSaveKerjasama} className="bg-slate-50 border-2 border-dashed border-rose-200 rounded-xl p-4 text-xs space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-rose-150">
                          <span className="font-bold text-slate-800 text-xs">
                            {editingKerjasamaId ? "Edit Kerjasama" : "Pencatatan MoU Kerjasama Kemitraan Baru"}
                          </span>
                          <button type="button" onClick={() => setShowKerjasamaForm(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={16} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1 sm:col-span-2">
                            <label className="font-bold text-slate-600">Instansi / Lembaga Mitra</label>
                            <input
                              type="text"
                              value={kerjasamaInput.instansi}
                              onChange={(e) => setKerjasamaInput({ ...kerjasamaInput, instansi: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-250 rounded font-sans focus:ring-1 focus:ring-rose-500 text-xs"
                              placeholder="Nama Dinas, Industri, atau PT Mitra..."
                              required
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="font-bold text-slate-600">Bentuk Aliansi / Jenis Kerjasama</label>
                            <input
                              type="text"
                              value={kerjasamaInput.jenis}
                              onChange={(e) => setKerjasamaInput({ ...kerjasamaInput, jenis: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-250 rounded focus:ring-1 focus:ring-rose-500 text-xs"
                              placeholder="MOU pendaftaran gratis sehati / pemanfaatan lab pengujian..."
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600">Tanggal Mulai Berlaku</label>
                            <input
                              type="date"
                              value={kerjasamaInput.tanggal}
                              onChange={(e) => setKerjasamaInput({ ...kerjasamaInput, tanggal: e.target.value })}
                              className="w-full p-2 bg-white border border-slate-250 rounded font-semibold focus:ring-1 focus:ring-rose-500 text-xs"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-slate-600">Status Aliansi</label>
                            <select
                              value={kerjasamaInput.status}
                              onChange={(e) => setKerjasamaInput({ ...kerjasamaInput, status: e.target.value as "Berjalan" | "Selesai" | "Draf" })}
                              className="w-full p-1.5 bg-white border border-slate-250 rounded focus:ring-1 focus:ring-rose-500 text-xs"
                            >
                              <option value="Berjalan">Berjalan (Aktif)</option>
                              <option value="Selesai">Selesai (Arsip)</option>
                              <option value="Draf">Draf (Usulan)</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setShowKerjasamaForm(false)}
                            className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded font-bold"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="bg-rose-600 text-white px-4 py-1.5 rounded font-bold hover:bg-rose-650"
                          >
                            Catat Kerjasama
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Kerjasama Display List */}
                    <div className="space-y-3.5">
                      {(edited.kerjasamaList || []).map((ks) => (
                        <div key={ks.id} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-sans relative">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-slate-800 text-sm leading-snug">{ks.instansi}</span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                  ks.status === "Berjalan" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                                  ks.status === "Selesai" ? "bg-slate-200 text-slate-700 border border-slate-300" :
                                  "bg-amber-100 text-amber-800 border border-amber-200"
                                }`}>
                                  {ks.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-normal font-sans">{ks.jenis}</p>
                              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] bg-white border border-slate-100 rounded px-2 py-0.5 w-max">
                                <Calendar size={11} />
                                <span>MoU Sejak:</span>
                                <span className="font-semibold text-slate-600">{ks.tanggal}</span>
                              </div>
                            </div>

                            {isEditing && (
                              <div className="flex gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditKerjasama(ks)}
                                  className="text-slate-600 hover:text-slate-900 font-bold hover:underline"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteKerjasama(ks.id)}
                                  className="text-red-500 hover:text-red-700 font-bold hover:underline"
                                >
                                  Hapus
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {(edited.kerjasamaList || []).length === 0 && (
                        <div className="text-center p-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/40 text-slate-400">
                          <Handshake size={28} className="mx-auto text-slate-300 mb-1" />
                          <p>Belum ada kemitraan kerjasama yang dicatatkan.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}
