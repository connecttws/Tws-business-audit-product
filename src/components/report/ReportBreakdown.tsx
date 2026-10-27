"use client";

import React from "react";
import {
  MapPin,
  Camera,
  Globe,
  Target,
  Zap,
  Sparkles,
  Layers,
  BarChart3,
} from "lucide-react";
import { SectionScoreResult } from "@/lib/audit-evaluator";

interface ReportBreakdownProps {
  sectionScores: SectionScoreResult[];
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  MapPin,
  Camera,
  Globe,
  Target,
  Zap,
  Sparkles,
  Layers,
};

export function ReportBreakdown({ sectionScores }: ReportBreakdownProps) {
  if (!sectionScores || sectionScores.length === 0) return null;

  return (
    <div className="bg-white p-6 sm:p-9 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 border border-sky-200/80 flex items-center justify-center shrink-0 shadow-xs">
          <BarChart3 className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-600">
            Multi-Pillar Evaluation
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
            Pillar-by-Pillar Diagnostic Breakdown
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sectionScores.map((sec) => {
          const SectionIcon = ICON_MAP[sec.icon] || Layers;
          const pct = sec.maxScore > 0 ? Math.round((sec.score / sec.maxScore) * 100) : 0;

          // Color based on percentage
          let barGradient = "from-rose-500 to-rose-600";
          let badgeClass = "bg-rose-50 text-rose-700 border-rose-200";
          let statusText = "Critical Deficit";

          if (pct >= 80) {
            barGradient = "from-sky-500 to-blue-600";
            badgeClass = "bg-sky-50 text-sky-700 border-sky-200";
            statusText = "Optimized";
          } else if (pct >= 50) {
            barGradient = "from-amber-500 to-orange-500";
            badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
            statusText = "Needs Focus";
          }

          return (
            <div
              key={sec.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
                    <SectionIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight font-sans">
                      {sec.name}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-500">
                      Score: <strong className="text-slate-800">{sec.score}</strong> / {sec.maxScore} pts
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badgeClass}`}>
                    {statusText}
                  </span>
                  <span className="font-mono font-black text-sm text-slate-900">{pct}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-200/80 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-700 ease-out`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
