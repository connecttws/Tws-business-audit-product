"use client";

import React, { useState } from "react";
import { Building, MapPin, Phone, User, Sparkles, Check } from "lucide-react";
import { BusinessDetails } from "@/lib/audit-evaluator";

interface BusinessDetailsCardProps {
  business: BusinessDetails;
  onChange: (updates: Partial<BusinessDetails>) => void;
  defaultCategory?: string;
}

const STANDARD_CATEGORIES = [
  { name: "Cafe / Restaurant", icon: "☕" },
  { name: "Clinic / Healthcare", icon: "✚" },
  { name: "Gym / Fitness Studio", icon: "✦" },
  { name: "Salon / Beauty & Spa", icon: "✧" },
  { name: "Retail / Boutiques", icon: "🛍️" },
  { name: "Real Estate / Property", icon: "🏢" },
  { name: "Coaching / Education", icon: "📚" },
  { name: "Professional Services", icon: "💼" },
  { name: "Auto Spa / Garage", icon: "🚗" },
  { name: "Other Local Business", icon: "🏬" },
];

export function BusinessDetailsCard({
  business,
  onChange,
  defaultCategory,
}: BusinessDetailsCardProps) {
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    const formatted = trimmed
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    if (!customCategories.includes(formatted)) {
      setCustomCategories([...customCategories, formatted]);
    }
    onChange({ category: formatted });
    setCustomInput("");
    setShowAddCustom(false);
  };

  const selectedCat = business.category || defaultCategory || "Cafe / Restaurant";

  return (
    <section className="bg-white rounded-3xl p-4 sm:p-8 border-2 border-slate-300 shadow-[0_6px_24px_rgba(15,23,42,0.08)] space-y-6">
      {/* Step Header */}
      <div className="flex items-center justify-between gap-2.5 border-b-2 border-slate-100 pb-3 sm:pb-4">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-sky-600 text-white shadow-md flex items-center justify-center font-bold text-sm shrink-0">
            <Building className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-wider text-sky-800 block">
              Diagnostic Step 01
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-slate-950 tracking-tight leading-tight font-sans truncate">
              Business Information
            </h2>
          </div>
        </div>
        <span className="text-[11px] sm:text-xs font-mono font-bold text-white bg-slate-900 px-2.5 sm:px-3 py-1 rounded-xl shrink-0 shadow-xs">
          Step 1 of 2
        </span>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* 1. Business Name */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-sky-600" />
            <span>Business Name <strong className="text-rose-600 font-black">*</strong></span>
          </label>
          <input
            type="text"
            required
            value={business.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. Copper Chimney Cafe"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 bg-slate-50/70 hover:bg-white text-base sm:text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-sky-600 focus:ring-4 focus:ring-sky-500/15 focus:outline-none transition-all shadow-xs"
          />
        </div>

        {/* 2. Owner / Contact Name */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span>Contact Person Name</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono font-bold">Owner / Manager</span>
          </label>
          <input
            type="text"
            value={business.clientName || ""}
            onChange={(e) => onChange({ clientName: e.target.value })}
            placeholder="e.g. Rahul Sharma"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 bg-slate-50/70 hover:bg-white text-base sm:text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-sky-600 focus:ring-4 focus:ring-sky-500/15 focus:outline-none transition-all shadow-xs"
          />
        </div>

        {/* 3. Locality / City */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <span>Locality / City <strong className="text-rose-600 font-black">*</strong></span>
          </label>
          <input
            type="text"
            required
            value={business.locality}
            onChange={(e) => onChange({ locality: e.target.value })}
            placeholder="e.g. Connaught Place, Central Delhi"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 bg-slate-50/70 hover:bg-white text-base sm:text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-sky-600 focus:ring-4 focus:ring-sky-500/15 focus:outline-none transition-all shadow-xs"
          />
        </div>

        {/* 4. Client WhatsApp */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-sky-600" />
              <span>Client Phone / WhatsApp</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-mono font-bold">1-tap report delivery</span>
          </label>
          <input
            type="tel"
            value={business.whatsappNumber || business.phone || ""}
            onChange={(e) =>
              onChange({
                whatsappNumber: e.target.value,
                phone: e.target.value,
              })
            }
            placeholder="e.g. 98765 43210"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 bg-slate-50/70 hover:bg-white text-base sm:text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-sky-600 focus:ring-4 focus:ring-sky-500/15 focus:outline-none transition-all shadow-xs font-mono"
          />
        </div>
      </div>

      {/* Industry Category Section */}
      <div className="space-y-3 pt-2 border-t-2 border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-900">
            Select Business Category
          </label>
          <span className="text-xs font-mono font-bold text-slate-600">
            Current: <strong className="text-sky-800 font-black">{selectedCat}</strong>
          </span>
        </div>

        {/* High-Contrast Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {STANDARD_CATEGORIES.map((cat) => {
            const isSelected = selectedCat === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => {
                  onChange({ category: cat.name });
                  setShowAddCustom(false);
                }}
                className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-sky-600 border-sky-600 text-white shadow-md"
                    : "bg-slate-50 hover:bg-white border-slate-200 hover:border-slate-300 text-slate-800"
                }`}
              >
                <span className="text-base shrink-0">{cat.icon}</span>
                <span className="text-xs font-bold truncate flex-1">{cat.name}</span>
                {isSelected && <Check className="w-4 h-4 text-white shrink-0 stroke-[3]" />}
              </button>
            );
          })}

          {customCategories.map((catName) => {
            const isSelected = selectedCat === catName;
            return (
              <button
                key={catName}
                type="button"
                onClick={() => {
                  onChange({ category: catName });
                  setShowAddCustom(false);
                }}
                className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-sky-600 border-sky-600 text-white shadow-md"
                    : "bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-900 font-bold"
                }`}
              >
                <span className="text-base shrink-0">✦</span>
                <span className="text-xs font-bold truncate flex-1">{catName}</span>
                {isSelected && <Check className="w-4 h-4 text-white shrink-0 stroke-[3]" />}
              </button>
            );
          })}

          {/* "+ Other Category" Action */}
          {!showAddCustom ? (
            <button
              type="button"
              onClick={() => setShowAddCustom(true)}
              className="p-3 rounded-2xl border-2 border-dashed border-sky-400 bg-sky-50/60 hover:bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>+ Add Other</span>
            </button>
          ) : (
            <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5 animate-fadeIn">
              <input
                type="text"
                autoFocus
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustom();
                  } else if (e.key === "Escape") {
                    setShowAddCustom(false);
                  }
                }}
                placeholder="Category name..."
                className="w-full px-3 py-2.5 rounded-xl border-2 border-sky-500 bg-white text-xs font-bold text-slate-950 placeholder:text-slate-400 focus:outline-none shadow-xs"
              />
              <button
                type="button"
                onClick={handleAddCustom}
                className="px-3 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs shrink-0 cursor-pointer"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddCustom(false)}
                className="px-2 py-2.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
