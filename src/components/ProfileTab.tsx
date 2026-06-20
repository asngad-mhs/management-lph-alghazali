/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Profile } from "../types";
import { Building2, Save, Edit2, ShieldAlert, FileText, MapPin, Phone, Mail, Globe, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface ProfileTabProps {
  profile: Profile;
  onUpdate: (updated: Profile) => void;
  isAdmin: boolean;
}

export default function ProfileTab({ profile, onUpdate, isAdmin }: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState<Profile>({ ...profile });
  const [newMissionItem, setNewMissionItem] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEdited(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onUpdate(edited);
    setIsEditing(false);
  };

  const handleAddMission = () => {
    if (newMissionItem.trim()) {
      setEdited(prev => ({
        ...prev,
        mission: [...prev.mission, newMissionItem.trim()]
      }));
      setNewMissionItem("");
    }
  };

  const handleRemoveMission = (idx: number) => {
    setEdited(prev => ({
      ...prev,
      mission: prev.mission.filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header card with quick credentials */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <Building2 size={26} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Profil Kelembagaan LPH
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Status Akreditasi & Izin Penyelenggaraan Pemeriksaan Halal Resmi
            </p>
          </div>
        </div>
        <div>
          {isAdmin ? (
            isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <Save size={14} /> Simpan Perubahan
              </button>
            ) : (
              <button
                onClick={() => {
                  setEdited({ ...profile });
                  setIsEditing(true);
                }}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm border border-slate-700 transition-all cursor-pointer"
              >
                <Edit2 size={13} /> Edit Profil LPH
              </button>
            )
          ) : (
            <div className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
              <ShieldAlert size={14} className="shrink-0" />
              <span>Role Saat Ini View Only (User)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Core Administrative Info */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm lg:col-span-7 space-y-5">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            Detail Administrasi LPH
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Nama Lembaga</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={edited.name}
                  onChange={handleChange}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              ) : (
                <p className="text-xs font-semibold text-slate-800">{profile.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Alias singkatan</label>
              {isEditing ? (
                <input
                  type="text"
                  name="alias"
                  value={edited.alias}
                  onChange={handleChange}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              ) : (
                <p className="text-xs font-semibold text-slate-800">{profile.alias}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Status Vokasi</label>
              {isEditing ? (
                <input
                  type="text"
                  name="vocation"
                  value={edited.vocation}
                  onChange={handleChange}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              ) : (
                <p className="text-xs font-semibold text-emerald-700 bg-emerald-50/70 border border-emerald-100 px-2 py-0.5 rounded w-max">{profile.vocation}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Institusi Naungan</label>
              {isEditing ? (
                <input
                  type="text"
                  name="institution"
                  value={edited.institution}
                  onChange={handleChange}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              ) : (
                <p className="text-xs font-semibold text-slate-800">{profile.institution}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">No. SK Penetapan (BPJPH)</label>
              {isEditing ? (
                <input
                  type="text"
                  name="decreeNumber"
                  value={edited.decreeNumber}
                  onChange={handleChange}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              ) : (
                <p className="text-xs font-mono text-slate-700 font-semibold">{profile.decreeNumber}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Tahun Berdiri</label>
              {isEditing ? (
                <input
                  type="date"
                  name="established"
                  value={edited.established}
                  onChange={handleChange}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              ) : (
                <p className="text-xs font-semibold text-slate-800">{profile.established}</p>
              )}
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Akreditasi & Tingkat</label>
              {isEditing ? (
                <input
                  type="text"
                  name="accreditation"
                  value={edited.accreditation}
                  onChange={handleChange}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              ) : (
                <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <FileText size={14} className="text-emerald-600" />
                  {profile.accreditation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info Widget Grid */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            Hubungan Komunikasi
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5 text-slate-500">
                <MapPin size={15} />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat Kantor</label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    name="address"
                    value={edited.address}
                    onChange={handleChange}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                ) : (
                  <p className="text-slate-700 leading-relaxed font-sans">{profile.address}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5 text-slate-500">
                <Phone size={15} />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Telepon / WhatsApp</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={edited.phone}
                    onChange={handleChange}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                ) : (
                  <p className="text-slate-800 font-semibold">{profile.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5 text-slate-500">
                <Mail size={15} />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Email Korespondensi</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={edited.email}
                    onChange={handleChange}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                ) : (
                  <p className="text-slate-700 font-mono">{profile.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5 text-slate-500">
                <Globe size={15} />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Situs Web Utama</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="website"
                    value={edited.website}
                    onChange={handleChange}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                ) : (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-semibold hover:underline flex items-center gap-1">
                    {profile.website}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision and Mission Cards */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <Sparkles size={16} className="text-emerald-600" />
          Visi & Misi Keislaman
        </h3>

        <div className="space-y-4">
          <div className="space-y-1 text-xs">
            <label className="text-xs font-bold text-slate-500 uppercase">Visi LPH Al-Ghazali</label>
            {isEditing ? (
              <textarea
                rows={3}
                name="vision"
                value={edited.vision}
                onChange={handleChange}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed font-sans"
              />
            ) : (
              <p className="text-slate-700 leading-relaxed italic border-l-4 border-emerald-500 pl-3.5 text-sm py-1 font-sans">
                &ldquo;{profile.vision}&rdquo;
              </p>
            )}
          </div>

          <div className="space-y-2 text-xs">
            <label className="text-xs font-bold text-slate-500 uppercase block">Misi Operasional</label>
            
            <div className="space-y-2.5">
              {(isEditing ? edited.mission : profile.mission).map((item, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1 text-slate-600 font-sans text-xs pt-0.5">
                    {item}
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveMission(idx)}
                      className="text-xs text-red-500 hover:text-red-700 shrink-0 hover:underline"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="Tambahkan butir misi baru..."
                  value={newMissionItem}
                  onChange={(e) => setNewMissionItem(e.target.value)}
                  className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  onClick={handleAddMission}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-lg font-bold transition"
                >
                  Tambah Misi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
