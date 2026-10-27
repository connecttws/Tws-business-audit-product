"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Share2, Printer, Check, Copy, ArrowLeft, MessageSquare } from "lucide-react";

interface ReportHeaderProps {
  businessName: string;
  companyName?: string;
  auditId: string;
}

export function ReportHeader({ businessName, companyName, auditId }: ReportHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const reportUrl = `${origin}/r/${auditId}`;
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert(`Report Link: ${reportUrl}`);
    }
  };

  const handleShareWhatsApp = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const shortUrl = `${origin}/r/${auditId}`;
    const text =
      `*${companyName || "Team TWS"} • Business Digital Diagnostic Report*\n` +
      `*Business:* ${businessName}\n\n` +
      `View your complete diagnostic report: ${shortUrl}\n\n` +
      `_Prepared by ${companyName || "Team TWS"}._`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <header className="relative sm:sticky sm:top-0 z-30 bg-white/95 text-slate-900 border-b border-slate-200/90 shadow-xs backdrop-blur-md no-print">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-slate-950 flex items-center justify-center font-black text-white text-[11px] sm:text-xs tracking-wider shadow-sm shrink-0">
              TWS
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-900 truncate">
                  {businessName}
                </span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="hidden sm:inline-block text-[11px] font-mono text-emerald-600 font-bold shrink-0">
                  Verified Diagnostic
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                Ref: {auditId}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleShare}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Save PDF</span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-slate-950" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </header>
  );
}
