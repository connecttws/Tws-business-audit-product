"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface AuditTopNavProps {
  formTitle: string;
  companyName?: string;
  currentScore: number;
  maxScore: number;
  answeredCount: number;
  totalQuestions: number;
}

export function AuditTopNav({
  formTitle,
  companyName,
  currentScore,
  maxScore = 100,
  answeredCount,
  totalQuestions,
}: AuditTopNavProps) {
  const progressPercent =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  // Dynamic score color matching reference
  const getScoreColor = (s: number) => {
    if (s >= 90) return "text-emerald-400";
    if (s >= 70) return "text-sky-400";
    if (s >= 40) return "text-amber-400";
    return "text-rose-400";
  };

  const scoreColor = getScoreColor(currentScore);

  return (
    <header className="relative z-20 bg-slate-950 text-white border-b border-slate-800 shadow-md no-print">
      {/* Top Thin Progress Bar */}
      <div className="w-full bg-slate-900 h-1 overflow-hidden">
        <div
          className="bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2.5 sm:gap-3">
        {/* Left: Branding & Audit Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center font-black text-white text-[11px] sm:text-xs tracking-wider shrink-0 shadow-sm">
            TWS
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white block truncate">
                {formTitle || "Business Digital Diagnostic"}
              </span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
              {companyName ? `Diagnostic by ${companyName}` : "Official Digital Presence Audit"}
            </p>
          </div>
        </div>

        {/* Right: Live Score Gauge Pill & Progress */}
        <div className="flex items-center shrink-0">
          {/* Desktop Version: Full 2-stat pill */}
          <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
            <div className="text-right">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block leading-none">
                Live Score
              </span>
              <div className="flex items-baseline gap-0.5 leading-none mt-1">
                <span className={`text-xl font-black tracking-tight font-mono ${scoreColor}`}>
                  {currentScore}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 font-mono">
                  /{maxScore}
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            {/* Answer count */}
            <div className="text-right">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block leading-none">
                Progress
              </span>
              <span className="text-sm font-bold text-slate-200 font-mono leading-none mt-1 block">
                {answeredCount}/{totalQuestions}
              </span>
            </div>
          </div>

          {/* Mobile Version: Compact, perfectly aligned badge */}
          <div className="sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/95 border border-slate-800 shadow-inner">
            <div className="text-right leading-none">
              <div className="flex items-baseline justify-end gap-0.5">
                <span className={`text-xs font-black font-mono ${scoreColor}`}>
                  {currentScore}
                </span>
                <span className="text-[9px] font-semibold text-slate-500 font-mono">
                  /{maxScore}
                </span>
              </div>
              <span className="text-[8px] font-mono font-bold text-slate-400 block mt-0.5">
                {answeredCount}/{totalQuestions} Qs
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
