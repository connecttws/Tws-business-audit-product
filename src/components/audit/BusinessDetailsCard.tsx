"use client";

import React from "react";
import { User, MapPin, Phone, Sparkles, ShieldCheck } from "lucide-react";
import { BusinessDetails } from "@/lib/audit-evaluator";

interface BusinessDetailsCardProps {
  business: BusinessDetails;
  onChange: (updates: Partial<BusinessDetails>) => void;
  defaultCategory?: string;
}

export function BusinessDetailsCard({
  business,
  onChange,
}: BusinessDetailsCardProps) {
  const currentName = business.clientName || business.name || "";
  const currentPhone = business.whatsappNumber || business.phone || "";

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-slate-300 shadow-[0_6px_24px_rgba(15,23,42,0.08)] space-y-6">
      {/* Step Header */}
      <div className="flex items-center justify-between gap-2.5 border-b-2 border-slate-100 pb-3 sm:pb-4">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-sky-600 text-white shadow-md flex items-center justify-center font-bold text-sm shrink-0">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-wider text-sky-800 block">
              Diagnostic Step 01
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-slate-950 tracking-tight leading-tight font-sans truncate">
              Client Information
            </h2>
          </div>
        </div>
        <span className="text-[11px] sm:text-xs font-mono font-bold text-white bg-slate-900 px-2.5 sm:px-3 py-1 rounded-xl shrink-0 shadow-xs">
          Step 1 of 2
        </span>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 font-medium">
        Please provide your contact details to generate and receive your personalized diagnostic assessment.
      </p>

      {/* Input Grid: 3 Clean Customer/Client Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* 1. Full Name / Client Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span>Full Name <strong className="text-rose-600 font-black">*</strong></span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono font-bold">Client / Customer</span>
          </label>
          <input
            type="text"
            required
            value={currentName}
            onChange={(e) =>
              onChange({
                clientName: e.target.value,
                name: e.target.value,
              })
            }
            placeholder="e.g. Rahul Sharma"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 bg-slate-50/70 hover:bg-white text-base sm:text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-sky-600 focus:ring-4 focus:ring-sky-500/15 focus:outline-none transition-all shadow-xs"
          />
        </div>

        {/* 2. Client WhatsApp / Phone */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-sky-600" />
              <span>WhatsApp / Contact Number <strong className="text-rose-600 font-black">*</strong></span>
            </span>
            <span className="text-[10px] text-emerald-700 font-mono font-bold">1-tap report</span>
          </label>
          <input
            type="tel"
            required
            value={currentPhone}
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

        {/* 3. Locality / City */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <span>City / Locality <strong className="text-rose-600 font-black">*</strong></span>
          </label>
          <input
            type="text"
            required
            value={business.locality}
            onChange={(e) => onChange({ locality: e.target.value })}
            placeholder="e.g. Bandra West, Mumbai"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 bg-slate-50/70 hover:bg-white text-base sm:text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-sky-600 focus:ring-4 focus:ring-sky-500/15 focus:outline-none transition-all shadow-xs"
          />
        </div>
      </div>
    </section>
  );
}
