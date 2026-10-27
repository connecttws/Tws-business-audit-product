"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Share2,
  Copy,
  Check,
  Building,
  RotateCcw,
} from "lucide-react";

interface AuditSubmittedModalProps {
  auditId: string;
  reportUrl: string;
  businessName: string;
  totalScore: number;
  maxScore: number;
  bandTitle: string;
  bandHeadline: string;
  onReset: () => void;
}

export function AuditSubmittedModal({
  auditId,
  reportUrl,
  businessName,
  totalScore,
  maxScore,
  bandTitle,
  bandHeadline,
  onReset,
}: AuditSubmittedModalProps) {
  const [copied, setCopied] = useState(false);

  const fullReportUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${reportUrl}`
      : reportUrl;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullReportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert(`Report Link: ${fullReportUrl}`);
    }
  };

  const percentage = Math.round((totalScore / maxScore) * 100);

  return (
    <div className="bg-white max-w-xl w-full mx-auto p-7 sm:p-9 rounded-3xl border-2 border-slate-300 shadow-[0_12px_40px_rgba(15,23,42,0.1)] text-center space-y-6 animate-fadeIn">
      {/* Top Success Icon */}
      <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 border border-sky-300 shadow-sm flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Diagnostic Evaluation Generated</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Audit Complete for {businessName}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
          Your responses have been processed and your official digital health diagnostic report is ready.
        </p>
      </div>

      {/* Score Meter Banner */}
      <div className="p-6 rounded-2xl bg-slate-50 border-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500">
            Overall Digital Score
          </span>
          <div className="flex items-baseline justify-center sm:justify-start gap-1.5 mt-0.5">
            <span className="text-4xl font-black text-sky-600 font-mono">
              {totalScore}
            </span>
            <span className="text-sm font-bold text-slate-400 font-mono">/ {maxScore}</span>
            <span className="text-xs font-semibold text-slate-500 ml-1">({percentage}%)</span>
          </div>
        </div>

        <div className="text-center sm:text-right">
          <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
            {bandTitle}
          </span>
          <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] leading-tight line-clamp-2">
            {bandHeadline}
          </p>
        </div>
      </div>

      {/* Share / Copy Report Link */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-sky-600" />
            <span>Executive Report Share Link</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">Auditee Direct Access</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={fullReportUrl}
            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 truncate"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Link
          href={reportUrl}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.01]"
        >
          <span>View Executive Report</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-4 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Audit</span>
        </button>
      </div>
    </div>
  );
}
