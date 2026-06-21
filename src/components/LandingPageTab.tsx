/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Profile, 
  Layanan, 
  Regulasi, 
  Berita, 
  FAQ, 
  Kontak 
} from "../types";
import { 
  Globe, 
  Laptop, 
  Smartphone, 
  Send, 
  CheckCircle, 
  Search, 
  FileText, 
  HelpCircle, 
  Calendar, 
  ArrowRight, 
  Info, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  Zap,
  Building2,
  Clock,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LandingPageTabProps {
  profile: Profile;
  layanan: Layanan[];
  regulasi: Regulasi[];
  berita: Berita[];
  faq: FAQ[];
  onSubmitMessage: (msg: Kontak) => void;
  isAdmin: boolean;
}

export default function LandingPageTab({
  profile,
  layanan,
  regulasi,
  berita,
  faq,
  onSubmitMessage,
  isAdmin
}: LandingPageTabProps) {
  // Simulator configuration
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [currentSection, setCurrentSection] = useState<string>("home");
  
  // Landing Page Interactive States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegulasiKategori, setSelectedRegulasiKategori] = useState("Semua");
  const [faqExpanded, setFaqExpanded] = useState<Record<string, boolean>>({});
  
  // Kontak form
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactOption, setContactOption] = useState("Layanan Halal");
  const [contactMessage, setContactMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Sync animation notification trigger
  const [syncPulse, setSyncPulse] = useState(false);

  useEffect(() => {
    // Pulse indicator on data modification
    setSyncPulse(true);
    const timer = setTimeout(() => setSyncPulse(false), 2000);
    return () => clearTimeout(timer);
  }, [profile, layanan, regulasi, berita, faq]);

  // Handle contact form submit (Real-time integration via fetch endpoint)
  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setIsSending(true);
    
    const newMsgPayload: Kontak = {
      id: `msg_${Date.now()}`,
      namaPengirim: contactName,
      emailPengirim: contactEmail,
      subjek: contactOption,
      pesan: contactMessage,
      telahDibaca: false,
      tanggalKirim: new Date().toISOString().split("T")[0],
      balasan: ""
    };

    try {
      // Simulate real API fetch or proceed directly to server
      const response = await fetch("/api/v1/kontak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsgPayload)
      });
      
      const resData = await response.json();
      
      if (resData && resData.status === "success" && resData.data) {
        // Integrate locally in real-time as well
        onSubmitMessage(resData.data);
      } else {
        // Fallback local integration if server is offline/failing
        onSubmitMessage(newMsgPayload);
      }
      
      setSendSuccess(true);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      
      setTimeout(() => {
        setSendSuccess(false);
      }, 5000);
    } catch (err) {
      console.warn("Backend server not reached, performing client-side fallback integration", err);
      // Client fall-back
      onSubmitMessage(newMsgPayload);
      setSendSuccess(true);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      setTimeout(() => setSendSuccess(false), 5000);
    } finally {
      setIsSending(false);
    }
  };

  // Filtered Services based on search
  const filteredServices = layanan.filter(s => 
    s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered Regulations
  const filteredRegulasi = regulasi.filter(r => 
    selectedRegulasiKategori === "Semua" || r.kategori === selectedRegulasiKategori
  );

  const categoriesRegulasiArr = [
    "Semua",
    "Undang-undang RI",
    "Peraturan Pemerintah",
    "Keputusan Menteri Agama",
    "Keputusan Kepala BPJPH",
    "Peraturan BPOM",
    "Standar Nasional (SNI)",
    "Fatwa MUI"
  ];

  const toggleFaq = (id: string) => {
    setFaqExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2.5xl text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${syncPulse ? "duration-300 scale-200" : ""}`}></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <h2 className="text-base font-bold text-emerald-400 font-sans tracking-tight flex items-center gap-1.5">
              Landing Page Simulator: Al-Ghazali 1
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-xl">
            Menampilkan antarmuka web publik LPH Al-Ghazali yang terhubung dan sinkron secara <span className="text-emerald-300 font-medium">real-time</span> 2 arah dengan semua sub-menu CRUD Anda.
          </p>
        </div>

        {/* View togglers */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-between border-t border-slate-800 pt-3 md:pt-0 md:border-0">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`p-2 rounded-md transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                deviceMode === "desktop" ? "bg-slate-800 text-emerald-400" : "text-slate-400 hover:text-white"
              }`}
              title="Laptop/Desktop View"
            >
              <Laptop size={14} /> Desk
            </button>
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`p-2 rounded-md transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                deviceMode === "mobile" ? "bg-slate-800 text-emerald-400" : "text-slate-400 hover:text-white"
              }`}
              title="Mobile View"
            >
              <Smartphone size={14} /> M-Phone
            </button>
          </div>

          <div className="text-[10px] bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 font-mono py-1.5 px-3 rounded-lg font-semibold flex items-center gap-1.5">
            <Zap size={11} className="animate-bounce" /> Sync: REAL-TIME
          </div>
        </div>
      </div>

      {/* Simulator Frame Wrapper */}
      <div className="flex justify-center transition-all duration-300">
        <div 
          className={`w-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-xl transition-all duration-500 ${
            deviceMode === "mobile" ? "max-w-[400px] aspect-[9/19] h-[780px] border-8 border-slate-850 shadow-2xl relative" : "max-w-full"
          }`}
        >
          {/* Mock URL Bar for Desktop, or Status indicators for Mobile */}
          {deviceMode === "desktop" ? (
            <div className="bg-slate-200/90 py-2.5 px-4 border-b border-slate-300 flex items-center gap-2">
              <div className="flex gap-1.5 shrink-0">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
              </div>
              <div className="flex-1 max-w-xl mx-auto bg-white/95 text-[11px] font-mono text-slate-500 py-1.5 px-4 rounded-full border border-slate-300/60 shadow-inner flex items-center justify-between">
                <span className="truncate">https://alghazali1-lph.unugha.ac.id/services_sync_active</span>
                <Globe size={11} className="text-slate-400 shrink-0 ml-1" />
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 text-slate-300 py-2 px-6 flex justify-between items-center text-[11px] font-mono select-none sticky top-0 z-30">
              <span className="font-bold text-slate-200">09:41</span>
              <div className="bg-slate-800 w-24 h-5 rounded-full border border-slate-700 mx-auto hidden sm:block"></div>
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <span className="w-4 h-2 rounded-xs border border-slate-400 bg-emerald-500 inline-block"></span>
              </div>
            </div>
          )}

          {/* PUBLIC WEB PORTAL RENDER CANVAS */}
          <div className="bg-slate-50 overflow-y-auto w-full h-full max-h-[700px] text-slate-800 text-left font-sans flex flex-col relative">
            
            {/* Navigasi Header Landing Page */}
            <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 z-20 py-3.5 px-6 flex justify-between items-center shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  AG
                </div>
                <div>
                  <h1 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-none">
                    LPH Al-Ghazali 1
                  </h1>
                  <span className="text-[8px] font-mono text-emerald-600 font-bold block mt-0.5 tracking-wider">
                    SINKRON LIVE
                  </span>
                </div>
              </div>

              {/* Responsive Menu Links for Simulator */}
              {deviceMode === "desktop" && (
                <nav className="flex items-center gap-5 text-xs text-slate-600 font-medium">
                  <a href="#home" onClick={() => setCurrentSection("home")} className={`hover:text-emerald-600 transition ${currentSection === "home" ? "text-emerald-600 font-bold" : ""}`}>Beranda</a>
                  <a href="#layanan" onClick={() => setCurrentSection("layanan")} className={`hover:text-emerald-600 transition ${currentSection === "layanan" ? "text-emerald-600 font-bold" : ""}`}>Layanan Halal</a>
                  <a href="#regulasi" onClick={() => setCurrentSection("regulasi")} className={`hover:text-emerald-600 transition ${currentSection === "regulasi" ? "text-emerald-600 font-bold" : ""}`}>Regulasi JPH</a>
                  <a href="#berita" onClick={() => setCurrentSection("berita")} className={`hover:text-emerald-600 transition ${currentSection === "berita" ? "text-emerald-600 font-bold" : ""}`}>Berita / Syiar</a>
                  <a href="#faq" onClick={() => setCurrentSection("faq")} className={`hover:text-emerald-600 transition ${currentSection === "faq" ? "text-emerald-600 font-bold" : ""}`}>FAQ</a>
                  <a href="#kontak" onClick={() => setCurrentSection("kontak")} className={`bg-emerald-600 text-white font-bold py-1.5 px-3 rounded-md hover:bg-emerald-500 transition`}>Hubungi Us</a>
                </nav>
              )}
            </header>

            {/* SYNC NOTIFIER OVERLAY IN SIMULATOR */}
            <AnimatePresence>
              {syncPulse && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-16 left-4 right-4 bg-emerald-600 text-white border border-emerald-500 p-2.5 rounded-xl shadow-lg text-[10px] font-mono flex items-center gap-2 z-40 justify-center"
                >
                  <Sparkles size={13} className="animate-spin" />
                  <span>Real-time Sync Selesai: Data {profile.alias} mutakhir dimuat!</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* HERO SECTION / BERANDA */}
            <section className="bg-gradient-to-br from-emerald-950/5 via-white to-slate-100 py-10 px-6 sm:px-10 border-b border-slate-100 flex flex-col gap-6 relative">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 font-semibold text-emerald-800 rounded-full text-[9px] uppercase tracking-wider">
                  <ShieldCheck size={11} /> Surat Keputusan {profile.decreeNumber || "Pusat BPJPH"}
                </div>
                <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-slate-900 leading-tight">
                  {profile.name} <span className="text-emerald-600">UNUGHA Cilacap</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {profile.vocation} yang didirikan secara sinergis di bawah naungan {profile.institution}. Bersertifikat akreditasi <strong className="text-emerald-700">{profile.accreditation}</strong> dengan otoritas audit berskala nasional.
                </p>
              </div>

              {/* Quick Profile Cards */}
              <div className="grid grid-cols-2 gap-3 max-w-lg">
                <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl space-y-1 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">AKREDITASI</span>
                  <p className="text-xs font-bold text-emerald-700">{profile.accreditation}</p>
                </div>
                <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl space-y-1 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">KEDUDUKAN</span>
                  <p className="text-xs font-bold text-slate-800 truncate">{profile.institution}</p>
                </div>
              </div>

              {/* Mission list */}
              <div className="space-y-2 mt-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">Visi & Misi LPH:</span>
                <p className="text-xs font-serif italic text-slate-700 font-semibold bg-emerald-50/50 p-2 rounded-lg border-l-2 border-emerald-500">"{profile.vision}"</p>
                <div className="space-y-1 pl-1">
                  {profile.mission?.slice(0, 3).map((m: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-start text-[11px] text-slate-600">
                      <span className="text-emerald-600 shrink-0 mt-0.5">•</span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* TAB-LIKE DYNAMIC SUB-VIEWS based on Nav clicks */}
            
            {/* SECTION 2: LAYANAN HALAL */}
            <section className="bg-white py-10 px-6 sm:px-10 border-b border-slate-100 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-indigo-50 pb-4">
                <div className="space-y-0.5">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 font-mono">
                    <Briefcase size={14} className="text-emerald-600" />
                    Layanan Sertifikasi Halal
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Sistem tarif transparan untuk usaha mikro, menengah, dan korporasi.
                  </p>
                </div>

                <div className="relative w-full sm:w-48">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search layanan..."
                    className="w-full pl-7 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 text-[11px] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                  <Search size={12} className="absolute left-2.5 top-2 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredServices.length === 0 ? (
                  <p className="col-span-2 py-6 text-center text-slate-400 text-xs">Layanan tidak ditemukan.</p>
                ) : (
                  filteredServices.map(srv => (
                    <div key={srv.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 shadow-xs flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-mono text-[9px] bg-slate-200/60 px-2 py-0.5 rounded text-slate-600 font-semibold">{srv.kode}</span>
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-1.5 py-0.2 rounded">{srv.kategori}</span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 tracking-tight leading-snug">{srv.nama}</h3>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-sans line-clamp-2">{srv.deskripsi}</p>
                      </div>

                      <div className="pt-2.5 border-t border-slate-205/60 flex justify-between items-center">
                        <div className="text-left">
                          <span className="text-[8px] text-slate-400 block font-mono">TARIF RESMI</span>
                          <span className="text-xs font-extrabold text-emerald-700 font-mono">
                            {srv.biayaNominal === 0 ? "Gratis (Sehati)" : `Rp ${srv.biayaNominal.toLocaleString("id-ID")}`}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] text-slate-400 block font-mono">DURASI</span>
                          <span className="text-[10px] font-bold text-slate-700 font-mono">{srv.estimasiHari} hari kerja</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* SECTION 3: REGULASI HUKUM JPH (WITH ALL 7 SUBMEMUS) */}
            <section className="bg-slate-50 py-10 px-6 sm:px-10 border-b border-slate-100 space-y-6">
              <div className="space-y-1.5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 font-mono">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Kepatuhan Regulasi JPH Aktif
                </h2>
                <p className="text-[11px] text-slate-500">
                  Landasan hukum integrasi sistem sertifikasi jaminan halal sesuai rujukan Undang-Undang RI.
                </p>
              </div>

              {/* Category tabs filters */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
                {categoriesRegulasiArr.map((catKategori) => (
                  <button
                    key={catKategori}
                    onClick={() => setSelectedRegulasiKategori(catKategori)}
                    className={`shrink-0 py-1 px-2.5 rounded font-mono text-[9px] font-bold transition whitespace-nowrap border ${
                      selectedRegulasiKategori === catKategori 
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" 
                        : "bg-white border-slate-205/60 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {catKategori}
                  </button>
                ))}
              </div>

              <div className="space-y-2.5">
                {filteredRegulasi.length === 0 ? (
                  <p className="py-6 text-center text-slate-400 text-xs bg-white border border-slate-200 rounded-xl">Dokumen hukum tidak tersedia.</p>
                ) : (
                  filteredRegulasi.map(reg => (
                    <div key={reg.id} className="p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-xs text-xs space-y-2">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[9px] font-mono text-indigo-700 font-bold bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">{reg.kategori}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded border ${
                          reg.statusBerlaku 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                            : "bg-red-50 text-red-650 border-red-200"
                        }`}>
                          {reg.statusBerlaku ? "BERLAKU" : "DICABUT"}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="font-bold text-slate-800 text-[11px] leading-snug">{reg.nomorAturan}</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-sans">{reg.tentang}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[9px] font-mono">
                        <span className="text-slate-400">Sumber: <strong className="text-slate-600">{reg.sumber}</strong></span>
                        <a 
                          href={reg.linkDokumen} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-emerald-600 hover:underline font-bold flex items-center gap-0.5 shrink-0"
                        >
                          Unduh Dokumen <ExternalLink size={8} />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* SECTION 4: BERITA SYIAR & AGENDA */}
            <section className="bg-white py-10 px-6 sm:px-10 border-b border-slate-100 space-y-5">
              <div className="space-y-0.5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 font-mono">
                  <Calendar size={14} className="text-emerald-600" />
                  Syiar Berita & Agenda LPH
                </h2>
                <p className="text-[11px] text-slate-500">
                  Liputan berita utama, dokumentasi kegiatan, dan jadwal agenda terbaru Humas Al-Ghazali.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {berita.filter(b => b.status === "Dipublikasikan" || b.status === "Draft").slice(0, 4).map(post => (
                  <div key={post.id} className="bg-slate-50 border border-slate-205/60 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
                    {post.gambarUrl && (
                      <div className="h-28 overflow-hidden relative">
                        <img 
                          src={post.gambarUrl} 
                          alt="post header" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 left-2 text-[9px] bg-emerald-600 text-white font-mono font-bold px-1.5 py-0.5 rounded shadow-sm">
                          {post.kategori}
                        </span>
                      </div>
                    )}

                    <div className="p-3.5 space-y-2 flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-mono italic block">{post.tanggalPublikasi} • Oleh {post.penulis}</span>
                        <h4 className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-2">{post.judul}</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-sans line-clamp-3">{post.konten}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/50 flex justify-between items-center text-[9px] font-mono">
                        <span className="text-slate-400 flex items-center gap-1">👁️ {post.views} views</span>
                        <span className="text-emerald-600 font-bold hover:underline cursor-pointer flex items-center gap-0.5">Baca Selengkapnya →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 5: FAQ ACCORDION */}
            <section className="bg-slate-50 py-10 px-6 sm:px-10 border-b border-slate-100 space-y-5">
              <div className="space-y-0.5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 font-mono">
                  <HelpCircle size={14} className="text-emerald-600" />
                  FAQ Tanya Jawab Halal
                </h2>
                <p className="text-[11px] text-slate-500">
                  Informasi tepercaya mengenai proses sertifikasi, rujukan regulasi, dan permohonan audit.
                </p>
              </div>

              <div className="space-y-2">
                {faq.slice(0, 5).map(item => {
                  const isExpanded = !!faqExpanded[item.id];
                  return (
                    <div key={item.id} className="bg-white rounded-xl border border-slate-200/85 shadow-2xs overflow-hidden">
                      <button
                        onClick={() => toggleFaq(item.id)}
                        className="w-full p-3.5 text-left flex justify-between items-center gap-3 font-semibold text-slate-800 text-[11px] sm:text-xs hover:bg-slate-50/50 transition"
                      >
                        <span className="leading-snug">{item.pertanyaan}</span>
                        <ChevronDown size={13} className={`text-slate-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-slate-100"
                          >
                            <div className="p-4 bg-slate-50/50 text-[10.5px] text-slate-600 leading-relaxed font-sans text-left space-y-1">
                              <p>{item.jawaban}</p>
                              <div className="text-[8px] font-mono text-slate-400 pt-1 flex items-center gap-1">
                                <span>Kategori:</span> <span className="bg-slate-200 px-1 rounded text-slate-600 font-semibold">{item.kategori}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECTION 6: HUBUNGI KAMI FORM (SAVES LIVE LANDING MESSAGES IN MANAGEMENT INBOX) */}
            <section className="bg-white py-10 px-6 sm:px-10 border-b border-slate-100 space-y-5">
              <div className="space-y-0.5 text-center sm:text-left">
                <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-700 flex items-center justify-center sm:justify-start gap-1.5 font-mono">
                  <Mail size={14} className="text-emerald-600" />
                  Hubungi Pengurus / Konsultasi
                </h2>
                <p className="text-[11px] text-slate-500">
                  Punya pertanyaan jaminan halal? Layangkan formulir konsultasi ini untuk dibaca di CMS Admin kami.
                </p>
              </div>

              {/* Grid Form vs Contacts */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Form */}
                <form onSubmit={handleSubmitContact} className="md:col-span-12 space-y-3 font-sans max-w-lg mx-auto w-full text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-500 block">Nama Badan Usaha / UMKM</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Contoh: CV. Berkah"
                        className="w-full p-2 bg-slate-50 border border-slate-220 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[11px] font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-500 block">Email Aktif</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder=" Contoh: berkah@halal.id"
                        className="w-full p-2 bg-slate-50 border border-slate-220 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[11px] font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 block">Tujuan Pertanyaan</label>
                    <select
                      value={contactOption}
                      onChange={(e) => setContactOption(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-220 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[11px] font-medium text-slate-700"
                    >
                      <option value="Layanan Halal">Sertifikasi Halal Baru / Perpanjangan</option>
                      <option value="Biaya Tarif">Pertanyaan Biaya & Tarif Layanan</option>
                      <option value="Tanya Regulasi">Konsultasi Rujukan Undang-Undang JPH</option>
                      <option value="Sertifikasi Al-Ghazali">Informasi Akademik LSP / Pendampingan</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 block">Tulis Pesan Konsultasi Anda</label>
                    <textarea
                      required
                      rows={3}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Tulis sedalam mungkin bahan makanan, kemasan, atau proses kritis apa yang ingin ditanyakan..."
                      className="w-full p-2 bg-slate-50 border border-slate-220 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[11px] font-normal leading-relaxed text-slate-700"
                    />
                  </div>

                  {/* Submission success popup inside landing */}
                  <AnimatePresence>
                    {sendSuccess && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg font-sans text-[10.5px] leading-relaxed flex items-center gap-1.5"
                      >
                        <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                        <span>Sikron Berhasil! Pesan Anda masuk ke antrean inbox CMS Admin kami.</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={isSending}
                    className={`w-full py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSending ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    <Send size={11} /> {isSending ? "Mengirimkan..." : "Sampaikan Formulir"}
                  </button>
                </form>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-slate-900 text-white py-12 px-6 sm:px-10 flex flex-col items-center gap-6 border-t border-slate-800 text-xs font-sans">
              <div className="flex flex-col sm:flex-row justify-between w-full max-w-5xl gap-6 text-slate-400">
                <div className="space-y-2 max-w-xs">
                  <span className="font-bold text-slate-200">LPH Al-Ghazali 1 UNUGHA</span>
                  <p className="text-[11px] leading-relaxed">
                    Sistem Manajemen jaminan halal terakreditasi Badan Penyelenggara Jaminan Produk Halal (BPJPH).
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-200">Alamat Korespondensi</span>
                  <div className="space-y-1 text-[11px] leading-relaxed">
                    <p className="flex items-center gap-1.5"><MapPin size={11} className="text-emerald-400" /> {profile.address || "Jl. Kemerdekaan Timur No. 9, Cilacap"}</p>
                    <p className="flex items-center gap-1.5"><Phone size={11} className="text-emerald-400" /> {profile.phone || "+62 813-1111-2222"}</p>
                    <p className="flex items-center gap-1.5"><Mail size={11} className="text-emerald-400" /> {profile.email || "lph@unugha.ac.id"}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 w-full pt-6 text-center text-[10px] text-slate-500 font-mono">
                © {new Date().getFullYear()} LPH Al-Ghazali UNUGHA Cilacap. All rights reserved. • Terintegrasi API LPH 1
              </div>
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
}
