/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Profile, 
  Layanan, 
  Proses, 
  Regulasi, 
  Berita, 
  FAQ, 
  Kontak, 
  SyncConfig, 
  SyncLog, 
  UserRole 
} from "./types";
import { 
  initialProfile, 
  initialLayanan, 
  initialProses, 
  initialRegulasi, 
  initialBerita, 
  initialFAQ, 
  initialKontak, 
  initialSyncLogs, 
  initialSyncConfig, 
  defaultUserSession 
} from "./mockData";

import Sidebar from "./components/Sidebar";
import StatsDashboard from "./components/StatsDashboard";
import ProfileTab from "./components/ProfileTab";
import LayananTab from "./components/LayananTab";
import ProsesTab from "./components/ProsesTab";
import RegulasiTab from "./components/RegulasiTab";
import BeritaTab from "./components/BeritaTab";
import FaqTab from "./components/FaqTab";
import KontakTab from "./components/KontakTab";
import SyncTab from "./components/SyncTab";

import { 
  Building2, 
  Briefcase, 
  Workflow, 
  ShieldCheck, 
  Newspaper, 
  HelpCircle, 
  Mail, 
  RefreshCw, 
  BarChart3,
  UserCheck
} from "lucide-react";

export default function App() {
  // Navigation & Simulation State
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [role, setRole] = useState<UserRole>("Admin");

  // Core CMS persistence states
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [layanan, setLayanan] = useState<Layanan[]>(initialLayanan);
  const [proses, setProses] = useState<Proses[]>(initialProses);
  const [regulasi, setRegulasi] = useState<Regulasi[]>(initialRegulasi);
  const [berita, setBerita] = useState<Berita[]>(initialBerita);
  const [faq, setFaq] = useState<FAQ[]>(initialFAQ);
  const [kontak, setKontak] = useState<Kontak[]>(initialKontak);
  const [syncConfig, setSyncConfig] = useState<SyncConfig>(initialSyncConfig);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(initialSyncLogs);

  // Load from local storage for durable persistence
  useEffect(() => {
    const keys = ["profile", "layanan", "proses", "regulasi", "berita", "faq", "kontak", "syncConfig", "syncLogs"];
    
    try {
      const storedProfile = localStorage.getItem("lph_profile");
      if (storedProfile) setProfile(JSON.parse(storedProfile));

      const storedLayanan = localStorage.getItem("lph_layanan");
      if (storedLayanan) setLayanan(JSON.parse(storedLayanan));

      const storedProses = localStorage.getItem("lph_proses");
      if (storedProses) setProses(JSON.parse(storedProses));

      const storedRegulasi = localStorage.getItem("lph_regulasi");
      if (storedRegulasi) setRegulasi(JSON.parse(storedRegulasi));

      const storedBerita = localStorage.getItem("lph_berita");
      if (storedBerita) setBerita(JSON.parse(storedBerita));

      const storedFaq = localStorage.getItem("lph_faq");
      if (storedFaq) setFaq(JSON.parse(storedFaq));

      const storedKontak = localStorage.getItem("lph_kontak");
      if (storedKontak) setKontak(JSON.parse(storedKontak));

      const storedSyncConfig = localStorage.getItem("lph_syncConfig");
      if (storedSyncConfig) setSyncConfig(JSON.parse(storedSyncConfig));

      const storedSyncLogs = localStorage.getItem("lph_syncLogs");
      if (storedSyncLogs) setSyncLogs(JSON.parse(storedSyncLogs));
    } catch (e) {
      console.error("Local storage parsing failed, using defaults", e);
    }
  }, []);

  // Save changes automatically
  const saveItem = (key: string, data: any) => {
    localStorage.setItem(`lph_${key}`, JSON.stringify(data));
  };

  // State update handlers + Persistence
  const handleUpdateProfile = (updated: Profile) => {
    setProfile(updated);
    saveItem("profile", updated);
  };

  // LAYANAN CRUD
  const handleCreateLayanan = (item: Layanan) => {
    const updated = [item, ...layanan];
    setLayanan(updated);
    saveItem("layanan", updated);
  };
  const handleUpdateLayanan = (item: Layanan) => {
    const updated = layanan.map(l => l.id === item.id ? item : l);
    setLayanan(updated);
    saveItem("layanan", updated);
  };
  const handleDeleteLayanan = (id: string) => {
    const updated = layanan.filter(l => l.id !== id);
    setLayanan(updated);
    saveItem("layanan", updated);
  };

  // PROSES CRUD
  const handleCreateProses = (item: Proses) => {
    const updated = [...proses, item];
    setProses(updated);
    saveItem("proses", updated);
  };
  const handleUpdateProses = (item: Proses) => {
    const updated = proses.map(p => p.id === item.id ? item : p);
    setProses(updated);
    saveItem("proses", updated);
  };
  const handleDeleteProses = (id: string) => {
    const updated = proses.filter(p => p.id !== id);
    setProses(updated);
    saveItem("proses", updated);
  };
  const handleReorderProses = (reordered: Proses[]) => {
    setProses(reordered);
    saveItem("proses", reordered);
  };

  // REGULASI CRUD
  const handleCreateRegulasi = (item: Regulasi) => {
    const updated = [item, ...regulasi];
    setRegulasi(updated);
    saveItem("regulasi", updated);
  };
  const handleUpdateRegulasi = (item: Regulasi) => {
    const updated = regulasi.map(r => r.id === item.id ? item : r);
    setRegulasi(updated);
    saveItem("regulasi", updated);
  };
  const handleDeleteRegulasi = (id: string) => {
    const updated = regulasi.filter(r => r.id !== id);
    setRegulasi(updated);
    saveItem("regulasi", updated);
  };

  // BERITA CRUD
  const handleCreateBerita = (item: Berita) => {
    const updated = [item, ...berita];
    setBerita(updated);
    saveItem("berita", updated);
  };
  const handleUpdateBerita = (item: Berita) => {
    const updated = berita.map(b => b.id === item.id ? item : b);
    setBerita(updated);
    saveItem("berita", updated);
  };
  const handleDeleteBerita = (id: string) => {
    const updated = berita.filter(b => b.id !== id);
    setBerita(updated);
    saveItem("berita", updated);
  };

  // FAQ CRUD
  const handleCreateFaq = (item: FAQ) => {
    const updated = [item, ...faq];
    setFaq(updated);
    saveItem("faq", updated);
  };
  const handleUpdateFaq = (item: FAQ) => {
    const updated = faq.map(f => f.id === item.id ? item : f);
    setFaq(updated);
    saveItem("faq", updated);
  };
  const handleDeleteFaq = (id: string) => {
    const updated = faq.filter(f => f.id !== id);
    setFaq(updated);
    saveItem("faq", updated);
  };

  // KONTAK CRUD
  const handleCreateKontak = (item: Kontak) => {
    const updated = [item, ...kontak];
    setKontak(updated);
    saveItem("kontak", updated);
  };
  const handleUpdateKontak = (item: Kontak) => {
    const updated = kontak.map(c => c.id === item.id ? item : c);
    setKontak(updated);
    saveItem("kontak", updated);
  };
  const handleDeleteKontak = (id: string) => {
    const updated = kontak.filter(c => c.id !== id);
    setKontak(updated);
    saveItem("kontak", updated);
  };

  // SYNC INTEGRATION CONTROLLERS
  const handleUpdateSyncConfig = (updated: SyncConfig) => {
    setSyncConfig(updated);
    saveItem("syncConfig", updated);
  };

  const handleAddSyncLog = (log: SyncLog) => {
    const updated = [log, ...syncLogs].slice(0, 50); // limit to 50 items
    setSyncLogs(updated);
    saveItem("syncLogs", updated);
  };

  // Simulated PULL Sync: injects fresh items from API if missing
  const handleTriggerPull = () => {
    // Simulated remote new records injection for demonstration
    const newRemoteLayanan: Layanan = {
      id: "remote_lay_05",
      kode: "SRV-REM-05",
      nama: "Laboratorium Mikrobiologi Cemaran Halal (Uji DNA)",
      deskripsi: "Pemeriksaan lab kuantitatif berbasis Real-Time PCR polymerase chain reaction untuk melacak cemaran babi pada gelatin.",
      kategori: "Sertifikasi",
      estimasiHari: 5,
      biayaNominal: 1500000,
      persyaratan: ["Log sampel 15g bahan", "Material safety data sheet (MSDS)"]
    };

    const newRemoteRegulasi: Regulasi = {
      id: "remote_reg_05",
      nomorAturan: "KMA No 1360 Tahun 2026",
      tentang: "Ketentuan Tarif Khusus Percepatan Pemeriksaan Halal bagi Penjual Kantin Madrasah dan Pesantren.",
      tahun: 2026,
      sumber: "Menteri Agama RI",
      kategori: "Peraturan Menteri",
      statusBerlaku: true,
      linkDokumen: "#"
    };

    // Prevent duplicates
    const hasLayanan = layanan.some(l => l.id === newRemoteLayanan.id);
    const hasRegulasi = regulasi.some(r => r.id === newRemoteRegulasi.id);

    let updatedLayanan = [...layanan];
    let updatedRegulasi = [...regulasi];

    if (!hasLayanan) updatedLayanan = [newRemoteLayanan, ...layanan];
    if (!hasRegulasi) updatedRegulasi = [newRemoteRegulasi, ...regulasi];

    setLayanan(updatedLayanan);
    saveItem("layanan", updatedLayanan);

    setRegulasi(updatedRegulasi);
    saveItem("regulasi", updatedRegulasi);

    setSyncConfig(prev => {
      const u = { ...prev, lastSyncedAt: new Date().toISOString().replace("T", " ").slice(0, 19) };
      saveItem("syncConfig", u);
      return u;
    });
  };

  const handleTriggerPush = () => {
    setSyncConfig(prev => {
      const u = { ...prev, lastSyncedAt: new Date().toISOString().replace("T", " ").slice(0, 19) };
      saveItem("syncConfig", u);
      return u;
    });
  };

  // Helper values
  const countUnreadMessages = kontak.filter(c => !c.telahDibaca).length;
  const isAdmin = role === "Admin";

  // Breadcrumb icon selector
  const getBreadcrumbIcon = () => {
    switch (activeTab) {
      case "profile": return <Building2 size={16} className="text-emerald-600" />;
      case "layanan": return <Briefcase size={16} className="text-emerald-600" />;
      case "proses": return <Workflow size={16} className="text-emerald-600" />;
      case "regulasi": return <ShieldCheck size={16} className="text-emerald-600" />;
      case "berita": return <Newspaper size={16} className="text-emerald-600" />;
      case "faq": return <HelpCircle size={16} className="text-emerald-600" />;
      case "kontak": return <Mail size={16} className="text-emerald-600" />;
      case "sync": return <RefreshCw size={16} className="text-emerald-600 animate-spin" />;
      default: return <BarChart3 size={16} className="text-emerald-600" />;
    }
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case "profile": return "Profil LPH";
      case "layanan": return "Layanan Halal";
      case "proses": return "Alur Proses";
      case "regulasi": return "Regulasi JPH";
      case "berita": return "Berita & Edukasi";
      case "faq": return "FAQ Tanya Jawab";
      case "kontak": return "Inbox Kontak";
      case "sync": return "Sinkronisasi API LPH";
      default: return "Dashboard Ringkasan";
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      
      {/* Col 1: Left Dashboard Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        role={role}
        setRole={setRole}
        layananCount={layanan.length}
        unresolvedMessages={countUnreadMessages}
        userName={defaultUserSession.name}
      />

      {/* Col 2: Central Content viewport */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-200 bg-white shadow-xs px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {getBreadcrumbIcon()}
            <span className="font-mono text-xs text-slate-400 font-bold">/</span>
            <span className="text-xs font-bold text-slate-900 tracking-tight">{getBreadcrumbTitle()}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Authority indicator */}
            <div className={`p-1 px-3.5 rounded-full border text-[10px] font-bold tracking-wide select-none ${
              isAdmin 
                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}>
              {isAdmin ? "ADMIN CONTROL CENTER" : "GUEST LEVEL VIEW"}
            </div>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 hidden sm:inline-block">
                {defaultUserSession.name}
              </span>
              <img 
                src={defaultUserSession.avatar} 
                alt="user avatar" 
                className="w-8 h-8 rounded-full border border-slate-200/80 shrink-0"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {/* Central main tabs area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          {activeTab === "dashboard" && (
            <StatsDashboard 
              layanan={layanan}
              proses={proses}
              regulasi={regulasi}
              berita={berita}
              faq={faq}
              kontak={kontak}
              onAddNewService={() => {
                setActiveTab("layanan");
              }}
              onGoToSync={() => setActiveTab("sync")}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === "profile" && (
            <ProfileTab 
              profile={profile}
              onUpdate={handleUpdateProfile}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === "layanan" && (
            <LayananTab 
              layanan={layanan}
              onCreate={handleCreateLayanan}
              onUpdate={handleUpdateLayanan}
              onDelete={handleDeleteLayanan}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === "proses" && (
            <ProsesTab 
              proses={proses}
              onCreate={handleCreateProses}
              onUpdate={handleUpdateProses}
              onDelete={handleDeleteProses}
              onReorder={handleReorderProses}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === "regulasi" && (
            <RegulasiTab 
              regulasi={regulasi}
              onCreate={handleCreateRegulasi}
              onUpdate={handleUpdateRegulasi}
              onDelete={handleDeleteRegulasi}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === "berita" && (
            <BeritaTab 
              berita={berita}
              onCreate={handleCreateBerita}
              onUpdate={handleUpdateBerita}
              onDelete={handleDeleteBerita}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === "faq" && (
            <FaqTab 
              faq={faq}
              onCreate={handleCreateFaq}
              onUpdate={handleUpdateFaq}
              onDelete={handleDeleteFaq}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === "kontak" && (
            <KontakTab 
              kontak={kontak}
              onUpdate={handleUpdateKontak}
              onDelete={handleDeleteKontak}
              onCreate={handleCreateKontak}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === "sync" && (
            <SyncTab 
              config={syncConfig}
              onUpdateConfig={handleUpdateSyncConfig}
              logs={syncLogs}
              onAddLog={handleAddSyncLog}
              allAppData={{
                profile,
                layanan,
                proses,
                regulasi,
                berita,
                faq,
                kontak
              }}
              onTriggerPull={handleTriggerPull}
              onTriggerPush={handleTriggerPush}
              isAdmin={isAdmin}
            />
          )}
        </main>

      </div>
    </div>
  );
}
