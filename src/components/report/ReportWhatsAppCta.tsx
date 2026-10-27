"use client";

import React, { useState } from "react";
import { Send, Phone, MessageSquare, Copy, Check } from "lucide-react";
import { SectionScoreResult } from "@/lib/audit-evaluator";

interface ReportWhatsAppCtaProps {
  auditId: string;
  businessName: string;
  clientName?: string;
  locality: string;
  category: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  bandTitle: string;
  bandHeadline: string;
  sectionScores: SectionScoreResult[];
  clientPhone?: string;
  agencyPhone?: string;
}

export function ReportWhatsAppCta({
  auditId,
  businessName,
  clientName,
  locality,
  category,
  totalScore,
  maxScore,
  percentage,
  bandTitle,
  bandHeadline,
  sectionScores,
  clientPhone,
  agencyPhone,
}: ReportWhatsAppCtaProps) {
  const [targetPhone, setTargetPhone] = useState(
    clientPhone || agencyPhone || ""
  );
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const reportUrl = `${origin}/r/${auditId}`;

  // Formatted WhatsApp Message
  const generateMessage = () => {
    let msg = `*TWS Business Digital Diagnostic*\n\n`;
    msg += `*Business:* ${businessName}${clientName ? ` (Contact: ${clientName})` : ""}\n`;
    msg += `*Locality:* ${locality} (${category})\n`;
    msg += `*Digital Health Score:* ${totalScore} / ${maxScore} (${percentage}%) — ${bandTitle}\n`;
    msg += `*Diagnosis:* ${bandHeadline}\n\n`;

    if (sectionScores && sectionScores.length > 0) {
      msg += `*Pillar Breakdown:*\n`;
      sectionScores.forEach((s) => {
        msg += `• ${s.name}: ${s.score}/${s.maxScore} pts (${s.percentage}%)\n`;
      });
      msg += `\n`;
    }

    msg += `*View Complete Online Diagnostic Report:*\n${reportUrl}\n\n`;
    msg += `_Prepared via TWS Business Audit Suite._`;
    return msg;
  };

  const handleOpenWhatsApp = () => {
    const rawNumber = targetPhone.replace(/\D/g, "");
    const encodedText = encodeURIComponent(generateMessage());

    let waUrl = `https://wa.me/?text=${encodedText}`;
    if (rawNumber.length >= 10) {
      const finalNumber = rawNumber.length === 10 ? `91${rawNumber}` : rawNumber;
      waUrl = `https://wa.me/${finalNumber}?text=${encodedText}`;
    }

    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(generateMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("Please copy text manually.");
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-200/90 shadow-sm space-y-5 no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base tracking-tight font-sans">
              Share Full Diagnostic Report via WhatsApp
            </h3>
            <p className="text-xs text-slate-500">
              Instant 1-click dispatch to the business owner or lead consultant
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyMessage}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy Text</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Phone className="w-4 h-4" />
          </div>
          <input
            type="tel"
            value={targetPhone}
            onChange={(e) => setTargetPhone(e.target.value)}
            placeholder="Recipient Mobile (e.g. 9876543210)"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-base sm:text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono shadow-xs"
          />
        </div>

        <button
          onClick={handleOpenWhatsApp}
          className="w-full py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Send via WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
