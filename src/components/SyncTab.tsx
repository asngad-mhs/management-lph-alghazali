/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SyncConfig, SyncLog } from "../types";
import { 
  RefreshCw, 
  Settings2, 
  Terminal, 
  Clock, 
  Send, 
  CloudDownload, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  X,
  Info,
  Key,
  Globe2,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SyncTabProps {
  config: SyncConfig;
  onUpdateConfig: (updated: SyncConfig) => void;
  logs: SyncLog[];
  onAddLog: (log: SyncLog) => void;
  allAppData: {
    profile: any;
    layanan: any[];
    proses: any[];
    regulasi: any[];
    berita: any[];
    faq: any[];
    kontak: any[];
  };
  onTriggerPull: () => void;
  onTriggerPush: () => void;
  isAdmin: boolean;
}

export default function SyncTab({
  config,
  onUpdateConfig,
  logs,
  onAddLog,
  allAppData,
  onTriggerPull,
  onTriggerPush,
  isAdmin
}: SyncTabProps) {
  const [editedConfig, setEditedConfig] = useState<SyncConfig>({ ...config });
  const [isTesting, setIsTesting] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [selectedLogPayload, setSelectedLogPayload] = useState<string | null>(null);

  const [activeSchemaTab, setActiveSchemaTab] = useState<string>("layanan");

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(editedConfig);
    // Add success log
    onAddLog({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      tipeOperasi: "TEST_CONNECTION",
      entitas: "Konfigurasi Gateway",
      status: "Berhasil",
      pesan: "Konfigurasi API LPH Al-Ghazali 1 diperbarui dalam database system."
    });
    alert("Konfigurasi API LPH Al-Ghazali 1 berhasil disimpan!");
  };

  // Simulating Test Connection
  const handleTestConnection = async () => {
    setIsTesting(true);
    
    // Simulate real delay
    await new Promise(resolve => setTimeout(resolve, 1400));
    
    const isOk = editedConfig.apiUrl.startsWith("http");
    const payload = JSON.stringify({
      status: isOk ? "connected" : "error",
      gateway: "Api lph alghazali 1",
      latency_ms: Math.floor(60 + Math.random() * 80),
      timestamp: new Date().toISOString(),
      authorized: editedConfig.apiKey.length > 5,
      version: "1.0.4-stable"
    }, null, 2);

    onAddLog({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      tipeOperasi: "TEST_CONNECTION",
      entitas: "Client Gateway",
      status: isOk ? "Berhasil" : "Gagal",
      pesan: isOk 
        ? `Ping ke endpoint ${editedConfig.apiUrl} berhasil. Kredensial divalidasi.`
        : `Gagal terhubung ke URL ${editedConfig.apiUrl}. Format protokol wajib HTTP/HTTPS.`,
      responsePayload: payload
    });

    setIsTesting(false);
  };

  // Simulating DATA PULL from Api lph alghazali 1
  const handlePullData = async () => {
    setIsPulling(true);
    await new Promise(resolve => setTimeout(resolve, 1800));

    // Call callback to sync with parent if needed
    onTriggerPull();

    const pullPayload = JSON.stringify({
      message: "Sync Pull completed successfully",
      imported_records: {
        layanan: 4,
        regulasi: 4,
        proses: 5,
        faq: 3
      },
      source: "API LPH Al-Ghazali 1 Server Utama",
      status_code: 200,
      sync_checksum: `sha256-${Math.floor(Date.now()).toString(16)}`
    }, null, 2);

    onAddLog({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      tipeOperasi: "PULL",
      entitas: "Semua Data",
      status: "Berhasil",
      pesan: `Tarik data (Pull) dari ${config.apiUrl} selesai. Mengamankan 16 butir catatan mutakhir.`,
      responsePayload: pullPayload
    });

    setIsPulling(false);
    alert("Data berhasil ditarik dari API LPH Al-Ghazali 1 utama dan diintegrasikan.");
  };

  // Simulating DATA PUSH from local to Api lph alghazali 1
  const handlePushData = async () => {
    setIsPushing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Call callback
    onTriggerPush();

    const pushPayload = JSON.stringify({
      message: "Data broadcast executed",
      broadcast_size_bytes: JSON.stringify(allAppData).length,
      payload_summary: {
        profile_alias: allAppData.profile.alias,
        layanan_count: allAppData.layanan.length,
        proses_count: allAppData.proses.length,
        news_published: allAppData.berita.filter((b: any) => b.status === "Dipublikasikan").length,
        faq_count: allAppData.faq.length,
        total_records_sent: allAppData.layanan.length + allAppData.proses.length + allAppData.berita.length + allAppData.faq.length
      },
      status: "synced_successfully",
      timestamp: new Date().toISOString()
    }, null, 2);

    onAddLog({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      tipeOperasi: "PUSH",
      entitas: "Semua Data",
      status: "Berhasil",
      pesan: `Eksportir data (Push) ke platform API ${config.apiUrl} sukses disiarkan.`,
      responsePayload: pushPayload
    });

    setIsPushing(false);
    alert("Seluruh modifikasi CMS sukses di-Push (siar ulang) ke server API LPH Al-Ghazali 1 utama!");
  };

  // Extract schemas string for developer reference tab
  const getJsonSchema = (tab: string) => {
    switch (tab) {
      case "profile":
        return JSON.stringify({
          endpoint: "/api/v1/profile",
          method: "POST | GET",
          payload_fields: {
            name: "string (Lembaga name)",
            alias: "string",
            vocation: "string",
            institution: "string_unugha",
            decreeNumber: "string",
            accreditation: "string",
            address: "string",
            phone: "string",
            email: "string",
            website: "stringURL",
            vision: "stringText",
            mission: "array_of_strings"
          }
        }, null, 2);
      case "layanan":
        return JSON.stringify({
          endpoint: "/api/v1/layanan",
          method: "POST | PUT | DELETE | GET",
          payload_fields: {
            kode: "string (unique key, e.g. SRV-IND)",
            nama: "string",
            deskripsi: "stringText",
            kategori: "enum (Sertifikasi, Pendampingan, Pelatihan, Konsultasi)",
            estimasiHari: "number",
            biayaNominal: "number",
            persyaratan: "array_of_required_documents"
          }
        }, null, 2);
      case "proses":
        return JSON.stringify({
          endpoint: "/api/v1/proses",
          method: "POST | PUT | DELETE | GET",
          payload_fields: {
            langkah: "number (index, e.g. 1, 2, ...)",
            namaTahapan: "string",
            deskripsi: "string",
            penanggungJawab: "string",
            estimasiWaktu: "string",
            statusKritikal: "enum (Tinggi, Sedang, Rendah)"
          }
        }, null, 2);
      case "regulasi":
        return JSON.stringify({
          endpoint: "/api/v1/regulasi",
          method: "POST | PUT | DELETE | GET",
          payload_fields: {
            nomorAturan: "string",
            tentang: "string",
            tahun: "number",
            sumber: "string",
            kategori: "enum (Undang-undang RI, Peraturan Pemerintah, Keputusan Menteri Agama, Keputusan Kepala BPJPH, Peraturan BPOM, Standar Nasional (SNI), Fatwa MUI)",
            statusBerlaku: "boolean",
            linkDokumen: "stringURL"
          }
        }, null, 2);
      default:
        return "{}";
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro integration banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-emerald-400 font-sans tracking-tight flex items-center gap-2">
            <RefreshCw size={18} className="animate-spin duration-1000" />
            Integrasi API LPH Al-Ghazali 1
          </h2>
          <p className="text-xs text-slate-400 font-sans max-w-xl leading-relaxed">
            Sinkronisasikan data operasional LPH di server ini secara dua arah (Pull/Push) ke pangkalan data terintegrasi utama. Mode otasoransi menggunakan sistem Token Keamanan Kriptografis.
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={handlePullData}
            disabled={isPulling || isPushing}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 text-slate-100 border border-slate-700 font-bold rounded-lg text-xs hover:bg-slate-700 transition cursor-pointer ${
              (isPulling || isPushing) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isPulling ? (
              <RefreshCw size={14} className="animate-spin text-emerald-400" />
            ) : (
              <CloudDownload size={14} className="text-indigo-400" />
            )}
            Tarik Data (Pull)
          </button>

          {isAdmin ? (
            <button
              onClick={handlePushData}
              disabled={isPulling || isPushing}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 font-bold text-white rounded-lg text-xs hover:bg-emerald-500 transition cursor-pointer ${
                (isPulling || isPushing) ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPushing ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Send size={13} />
              )}
              Siar Data (Push)
            </button>
          ) : (
            <div className="text-[10px] bg-slate-950 font-semibold text-slate-400 px-3 py-2 border border-slate-800 rounded-lg flex items-center gap-1">
              <Lock size={12} /> Mode user (Siar mati)
            </div>
          )}
        </div>
      </div>

      {/* Grid Settings vs Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Connection Setup Configuration Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <Settings2 size={14} className="text-slate-400" />
            Konfigurasi Gerbang API
          </h3>

          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs font-sans">
            {/* API URL */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-500 flex items-center gap-1.5">
                <Globe2 size={13} className="text-slate-400" /> Endpoint API LPH Al-Ghazali 1
              </label>
              <input
                type="url"
                required
                value={editedConfig.apiUrl}
                onChange={(e) => setEditedConfig(prev => ({ ...prev, apiUrl: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            {/* API Key */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-500 flex items-center gap-1.5">
                <Key size={13} className="text-slate-400" /> API Token Key (X-LPH-Key)
              </label>
              <input
                type="password"
                required
                value={editedConfig.apiKey}
                onChange={(e) => setEditedConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            {/* Client secret */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-400 flex items-center gap-1.5">
                <Lock size={13} className="text-slate-400" /> Client secret
              </label>
              <input
                type="password"
                required
                value={editedConfig.clientSecret}
                onChange={(e) => setEditedConfig(prev => ({ ...prev, clientSecret: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            {/* Intervals config */}
            <div className="flex items-center justify-between gap-4 p-2 bg-slate-50 rounded-lg border border-slate-100">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-700 block">Sinkronisasi Otomatis</span>
                <span className="text-[10px] text-slate-400 font-normal">Siklus update berkala background</span>
              </div>
              <input
                type="checkbox"
                checked={editedConfig.autoSync}
                onChange={(e) => setEditedConfig(prev => ({ ...prev, autoSync: e.target.checked }))}
                className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
              />
            </div>

            {/* Buttons Setup */}
            <div className="flex gap-2 pt-4 border-t border-slate-100 justify-end">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className={`px-3 py-1.5 bg-slate-100 font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition shrink-0 ${
                  isTesting ? "opacity-30 cursor-not-allowed" : ""
                }`}
              >
                {isTesting ? "Pinging..." : "Test Connection"}
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 text-white hover:bg-slate-700 font-bold rounded-lg transition"
              >
                Simpan Konfigurasi
              </button>
            </div>
          </form>
        </div>

        {/* Sync Logs Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm flex flex-col justify-between max-h-[450px] overflow-hidden">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Terminal size={14} className="text-slate-400" />
              Sirkulasi & Log Sinkronisasi
            </h3>
            <span className="text-[9px] text-slate-400 font-mono">Diupdate: {config.lastSyncedAt || "Belum sinkron"}</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-50 py-2 pr-1 space-y-1.5">
            {logs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Tidak ada log aktivitas sinkronisasi.
              </div>
            ) : (
              logs.map((log) => {
                const isErr = log.status === "Gagal";
                return (
                  <div key={log.id} className="p-2.5 rounded-lg border border-slate-50 bg-slate-50/20 text-xs text-left font-sans flex flex-col space-y-1">
                    <div className="flex justify-between items-center bg-slate-100/40 px-1.5 py-0.5 rounded">
                      <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-400">
                        <Clock size={11} />
                        <span>{log.timestamp.slice(11, 19)}</span>
                        <span>•</span>
                        <span className="font-semibold text-indigo-700">{log.tipeOperasi}</span>
                        <span>•</span>
                        <span>{log.entitas}</span>
                      </div>

                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border inline-block ${
                        isErr 
                        ? "bg-red-50 text-red-600 border-red-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>
                        {log.status}
                      </span>
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed font-sans">{log.pesan}</p>
                    
                    {log.responsePayload && (
                      <button
                        onClick={() => setSelectedLogPayload(log.responsePayload || null)}
                        className="text-[9px] text-slate-400 font-bold underline hover:text-slate-700 max-w-max"
                      >
                        Lihat Struktur Payload JSON
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
            Protokol: API LPH v1 (JSON over HTTP/HTTPS)
          </div>
        </div>
      </div>

      {/* Contract & Schema Developer Tab Reference */}
      <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Kamus Kontrak / JSON Schema</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Struktur berkas JSON otentik sewaktu memproses sinkronisasi data luar.</p>
          </div>

          {/* Sub category tabs */}
          <div className="flex gap-1.5">
            {["profile", "layanan", "proses", "regulasi"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSchemaTab(tab)}
                className={`py-1 px-2.5 rounded font-mono text-[10px] font-semibold capitalize transition ${
                  activeSchemaTab === tab 
                  ? "bg-slate-800 text-white" 
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Console view */}
        <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto border border-slate-800 shadow-inner">
          <pre className="text-[10px] sm:text-xs font-mono text-emerald-400 text-left">
            <code>{getJsonSchema(activeSchemaTab)}</code>
          </pre>
        </div>
      </div>

      {/* Landing Page Sync Implementation Guide */}
      <div className="bg-emerald-950/5 border border-emerald-500/20 rounded-2xl p-6 text-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
            ⚡
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 font-sans">
              Panduan Integrasi Langsung: LPH Al-Ghazali 1 (Landing Pages)
            </h3>
            <p className="text-xs text-slate-500">
              Bagaimana cara menghubungkan landing page untuk berdialog penuh dengan sistem pusat CRUD saat ini.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div className="bg-white/80 p-4 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase font-mono">1. GET: Ambil Content LPH</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Landing page cukup memanggil satu API Endpoint di bawah ini untuk mengambil seluruh meta data LPH, tarif pelatihan/layanan, regulasi aktif, berita syiar, dan FAQ sekaligus.
            </p>
            <div className="bg-slate-900 text-slate-100 rounded-lg p-3 font-mono text-[10px] overflow-x-auto">
              {`// Ambil Data LPH Lengkap
fetch("${typeof window !== "undefined" ? window.location.origin : ""}/api/v1/all")
  .then(res => res.json())
  .then(result => {
    console.log("Profile:", result.data.profile);
    console.log("Tarif Layanan:", result.data.layanan);
  });`}
            </div>
          </div>

          <div className="bg-white/80 p-4 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded uppercase font-mono">2. POST: Kirim Formulir Konsultasi</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Ketika ada pengusaha/UMKM melakukan penginputan pada formulir kontak di landing page, kirimkan JSON ini untuk menyimpannya ke Inbox Management secara instan.
            </p>
            <div className="bg-slate-900 text-slate-100 rounded-lg p-3 font-mono text-[10px] overflow-x-auto">
              {`// Submit Inbound Message
fetch("${typeof window !== "undefined" ? window.location.origin : ""}/api/v1/kontak", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    nama: "CV. Berkah Halal",
    email: "berkah@halal.id",
    tujuan: "Layanan Halal",
    pesan: "Minta tolong kalkulasikan tarif pendampingan mandiri."
  })
}).then(res => res.json());`}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl text-xs space-y-2 text-left text-slate-300">
          <p className="font-bold text-white flex items-center gap-1">
            <span>📡</span> Status Koneksi & Gateway Real-time:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400 font-mono text-[11px]">
            <li>CORS Access-Control-Allow-Origin: <span className="text-emerald-400">"*" (Semua Landing Page Bebeas Mengonsumsi API)</span></li>
            <li>Enforced Server Port: <span className="text-slate-200">3000 (Standar Cloud Run Container)</span></li>
            <li>Active Database File: <span className="text-amber-400">/database.json (Persistent Server State)</span></li>
          </ul>
        </div>
      </div>

      {/* LOG RESPOND MODAL DISPLAY */}
      <AnimatePresence>
        {selectedLogPayload && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                  <Terminal size={14} className="text-emerald-500" />
                  Payload Response Server API LPH 1
                </span>
                <button
                  onClick={() => setSelectedLogPayload(null)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-auto max-h-[300px] border border-slate-800 bg-slate-950 p-4 rounded-lg">
                <pre className="text-xs font-mono text-emerald-400 text-left leading-relaxed">
                  <code>{selectedLogPayload}</code>
                </pre>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedLogPayload(null)}
                  className="px-4.5 py-1.5 bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 rounded-lg text-xs font-bold cursor-pointer transition"
                >
                  Tutup Terminal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
