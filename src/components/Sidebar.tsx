/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  BarChart3, 
  Building2, 
  Settings2, 
  Briefcase, 
  Workflow, 
  FileText, 
  Newspaper, 
  HelpCircle, 
  Mail, 
  RefreshCw, 
  ShieldCheck,
  User,
  Menu,
  X
} from "lucide-react";
import { motion } from "motion/react";
import { UserRole } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  layananCount: number;
  unresolvedMessages: number;
  userName: string;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  role,
  setRole,
  layananCount,
  unresolvedMessages,
  userName
}: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "profile", label: "Profil LPH", icon: Building2 },
    { id: "layanan", label: "Layanan Halal", icon: Briefcase, badge: layananCount },
    { id: "proses", label: "Proses & Tahapan", icon: Workflow },
    { id: "regulasi", label: "Regulasi JPH", icon: ShieldCheck },
    { id: "berita", label: "Berita & Edukasi", icon: Newspaper },
    { id: "faq", label: "FAQ Tanya Jawab", icon: HelpCircle },
    { id: "kontak", label: "Kontak Masuk", icon: Mail, badge: unresolvedMessages > 0 ? unresolvedMessages : undefined },
    { id: "sync", label: "Sinkronisasi API", icon: RefreshCw },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 bg-emerald-700 text-white rounded-lg shadow-lg hover:bg-emerald-800 transition"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Container */}
      <div 
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static top-0 left-0 h-screen w-72 bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col z-40 transition-transform duration-300 shadow-2xl border-r border-slate-800/80`}
      >
        {/* Branding Area */}
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="font-serif font-black text-white text-xl">AG</span>
          </div>
          <div>
            <h1 className="font-sans font-bold tracking-tight text-white text-base leading-tight">
              LPH Al-Ghazali
            </h1>
            <p className="text-[10px] text-emerald-400 font-mono tracking-wider">
              UNUGHA CILACAP
            </p>
          </div>
        </div>

        {/* User Role Switcher */}
        <div className="p-4 bg-slate-950/50 m-4 rounded-xl border border-slate-800 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
              <User size={14} className="text-slate-400" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">{userName}</p>
              <span className="text-[9px] bg-slate-800/80 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-slate-700/50 min-w-max">
                {role}
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">Ganti Role Otoritas:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans cursor-pointer hover:border-slate-700 transition"
            >
              <option value="Admin Manager">🔑 Admin Manager</option>
              <option value="Editor">✍️ Editor (Konten)</option>
              <option value="Auditor">⚖️ Auditor (Kepatuhan)</option>
              <option value="Staf">📬 Staf (Korespondensi)</option>
              <option value="User">👁️ User (Spectator)</option>
            </select>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition-all duration-150 group relative ${
                  isActive
                    ? "bg-emerald-600/15 text-emerald-300 border-l-4 border-emerald-500 font-semibold"
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent 
                    size={18} 
                    className={`${isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"} transition`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center font-bold ${
                    isActive ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-300"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info (humble, minimal, Indonesian) */}
        <div className="p-4 border-t border-slate-800/80 text-center">
          <p className="text-[10px] text-slate-500 font-mono">
            CMS LPH Al-Ghazali v1.0.0
          </p>
          <p className="text-[9px] text-slate-600 font-mono mt-0.5">
            Sistem Informasi Jaminan Halal
          </p>
        </div>
      </div>
    </>
  );
}
