/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Kontak } from "../types";
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  Send, 
  Search, 
  MessageSquareCode, 
  X,
  AlertTriangle,
  User,
  Inbox,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface KontakTabProps {
  kontak: Kontak[];
  onUpdate: (item: Kontak) => void;
  onDelete: (id: string) => void;
  onCreate: (item: Kontak) => void; // For simulating incoming questions
  isAdmin: boolean;
}

export default function KontakTab({
  kontak,
  onUpdate,
  onDelete,
  onCreate,
  isAdmin
}: KontakTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInboxId, setSelectedInboxId] = useState<string | null>(
    kontak.length > 0 ? kontak[0].id : null
  );

  // States for simulating new inbound inquiry
  const [isSimulatingInbound, setIsSimulatingInbound] = useState(false);
  const [simName, setSimName] = useState("");
  const [simEmail, setSimEmail] = useState("");
  const [simSubject, setSimSubject] = useState("");
  const [simMessage, setSimMessage] = useState("");

  // Reply state
  const [replyText, setReplyText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filter list
  const filteredList = kontak.filter(c => 
    c.namaPengirim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subjek.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.pesan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMessage = kontak.find(c => c.id === selectedInboxId) || null;

  const handleSelectMessage = (id: string) => {
    setSelectedInboxId(id);
    const msg = kontak.find(c => c.id === id);
    if (msg && !msg.telahDibaca) {
      onUpdate({ ...msg, telahDibaca: true });
    }
    // Pre-fill existing reply if any or clear it
    if (msg) {
      setReplyText(msg.balasan || "");
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;

    onUpdate({
      ...selectedMessage,
      balasan: replyText.trim(),
      telahDibaca: true
    });
    // Visual prompt
    alert(`Balasan simulasi terkirim ke email: ${selectedMessage.emailPengirim}`);
  };

  const handleSimulateInboundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simName || !simEmail || !simSubject || !simMessage) return;

    const newInbound: Kontak = {
      id: `kon_${Date.now()}`,
      namaPengirim: simName,
      emailPengirim: simEmail,
      subjek: simSubject,
      pesan: simMessage,
      tanggalKirim: new Date().toISOString().replace("T", " ").slice(0, 19),
      telahDibaca: false
    };

    onCreate(newInbound);
    setSelectedInboxId(newInbound.id);
    setReplyText("");
    
    // Reset form
    setSimName("");
    setSimEmail("");
    setSimSubject("");
    setSimMessage("");
    setIsSimulatingInbound(false);
  };

  const deleteInboxMessage = (id: string) => {
    onDelete(id);
    // Auto-select another message
    const remaining = kontak.filter(m => m.id !== id);
    if (remaining.length > 0) {
      setSelectedInboxId(remaining[0].id);
      setReplyText(remaining[0].balasan || "");
    } else {
      setSelectedInboxId(null);
      setReplyText("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controller */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-sm relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama pengirim, subjek atau pesan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsSimulatingInbound(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-lg transition shrink-0 cursor-pointer"
          >
            <MessageSquareCode size={15} /> Simulasi Kirim Kontak Masuk
          </button>
        </div>
      </div>

      {/* Inbox Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[500px]">
        {/* Inbox Sidebar List */}
        <div className="lg:col-span-4 bg-white border border-slate-200/85 rounded-xl flex flex-col max-h-[550px] overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Inbox size={14} className="text-slate-400" />
              Inbox Kotak Pesan
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-100">
              {kontak.length} Total
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {filteredList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Tidak ada korespondensi.
              </div>
            ) : (
              filteredList.map((msg) => {
                const isActive = msg.id === selectedInboxId;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg.id)}
                    className={`p-3 rounded-lg text-left text-xs cursor-pointer transition flex flex-col justify-between space-y-1.5 relative ${
                      isActive 
                        ? "bg-emerald-50/70 border-l-4 border-emerald-600" 
                        : "hover:bg-slate-50/75 border-l-4 border-transparent"
                    }`}
                  >
                    {!msg.telahDibaca && (
                      <span className="absolute top-3.5 right-3 w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    )}
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-900 truncate max-w-[130px]">{msg.namaPengirim}</span>
                      <span className="text-[9px] text-slate-400 font-normal font-mono shrink-0">
                        {msg.tanggalKirim.split(" ")[0]}
                      </span>
                    </div>
                    <div className="text-slate-500 truncate text-[10px] pr-4">{msg.subjek}</div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 pr-2">{msg.pesan}</p>
                    
                    {msg.balasan && (
                      <span className="text-[8.5px] bg-indigo-50 text-indigo-700 px-1 py-0.1 rounded font-bold max-w-max mt-1 font-mono">
                        Sudah Dibalas
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Message View Area */}
        <div className="lg:col-span-8 bg-white border border-slate-200/85 rounded-xl flex flex-col max-h-[550px] overflow-hidden justify-between">
          {selectedMessage ? (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              
              {/* Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                      {selectedMessage.namaPengirim.charAt(0)}
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {selectedMessage.namaPengirim}
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Dari: {selectedMessage.emailPengirim} • Tgl: {selectedMessage.tanggalKirim}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                    selectedMessage.telahDibaca 
                    ? "bg-slate-100 text-slate-600 border-slate-200/60" 
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}>
                    {selectedMessage.telahDibaca ? "Sudah Dibaca" : "Baru"}
                  </span>

                  {isAdmin && (
                    <button
                      onClick={() => setConfirmDeleteId(selectedMessage.id)}
                      className="p-1.5 bg-slate-50 border border-slate-150 rounded text-slate-400 hover:text-red-600 transition"
                      title="Hapus surat masuk"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Message Payload Body */}
              <div className="p-5 space-y-4 flex-1 overflow-y-auto font-sans text-xs">
                {/* Subject banner */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-150">
                  <span className="text-[9px] block text-slate-400 font-bold uppercase tracking-wider mb-0.5">Subjek / Masalah pokok:</span>
                  <p className="font-bold text-slate-800 text-xs">{selectedMessage.subjek}</p>
                </div>

                {/* Message Body */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Isi Surat:</span>
                  <p className="text-slate-600 font-medium whitespace-pre-wrap leading-relaxed text-xs p-2 rounded bg-slate-50/50">
                    {selectedMessage.pesan}
                  </p>
                </div>

                {/* Reply section overview if exists */}
                {selectedMessage.balasan && (
                  <div className="bg-emerald-50/50 rounded-lg p-4 border border-emerald-150/70 space-y-1.5 animate-fadeIn">
                    <span className="text-[9px] block text-emerald-700 font-bold uppercase tracking-wider font-mono">
                      Balasan Terkirim (Ghazali Mail Gateway):
                    </span>
                    <p className="text-slate-700 leading-relaxed font-sans">{selectedMessage.balasan}</p>
                  </div>
                )}
              </div>

              {/* Reply Compose Form (Admin has direct email simulation form) */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                {isAdmin ? (
                  <form onSubmit={handleSendReply} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase">
                        {selectedMessage.balasan ? "Perbarui Balasan" : "Draft Balas Pesan (Simulasi Email)"}
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Ketik rincian panduan sertifikasi, saran ragi halal, atau jadwal visitasi..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium leading-relaxed font-sans"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-sm cursor-pointer"
                      >
                        <Send size={12} /> {selectedMessage.balasan ? "Update Balasan" : "Kirim Email Balasan"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-[10px] text-slate-400 italic text-center py-2">
                    Formulir balasan dinonaktifkan untuk Guest User. Aktifkan mode Admin untuk membalas email.
                  </p>
                )}
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400">
              <MailOpen size={36} className="stroke-1 mb-2.5" />
              <p className="text-xs">Pilihlah salah satu korespondensi surat masuk.</p>
            </div>
          )}
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
                <h4 className="text-sm font-bold">Hapus Korespondensi Ini?</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Tindakan ini permanen. Seluruh isi surat dari pengirim bersangkutan akan dieliminasi dari sistem manajemen.
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
                    if (confirmDeleteId) deleteInboxMessage(confirmDeleteId);
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

      {/* INBOUND SIMULATION FORM MODAL */}
      <AnimatePresence>
        {isSimulatingInbound && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles size={16} className="text-indigo-600 animate-pulse" />
                  Simulasi Kirim Surat Masuk (Testing)
                </h4>
                <button
                  onClick={() => setIsSimulatingInbound(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSimulateInboundSubmit} className="space-y-3.5 text-xs font-sans">
                {/* Nama & Email */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Nama Pengirim</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT. Roti Barokah Cilacap"
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Email Pengirim</label>
                  <input
                    type="email"
                    required
                    placeholder="Contoh: rotibarokah@gmail.com"
                    value={simEmail}
                    onChange={(e) => setSimEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Subjek */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Subjek Masalah</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rencana On-site Audit Minggu Depan"
                    value={simSubject}
                    onChange={(e) => setSimSubject(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Isi Pesan */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Isi Surat / Pesan Pertanyaan</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan pertanyaan simulasi, saran tentang pelayan ragi rabi kue, dll..."
                    value={simMessage}
                    onChange={(e) => setSimMessage(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed font-sans"
                  />
                </div>

                {/* Submits */}
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsSimulatingInbound(false)}
                    className="px-3.5 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg font-bold transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition shadow-sm cursor-pointer"
                  >
                    Kirim Surat Masuk
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
