"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle } from "lucide-react";
import { AuditFindingResult } from "@/lib/audit-evaluator";

interface ReportFindingsProps {
  findings: AuditFindingResult[];
}

export function ReportFindings({ findings }: ReportFindingsProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "attention" | "passed">("all");

  const passedCount = findings.filter((f) => f.pointsAwarded === f.maxPoints && f.maxPoints > 0).length;
  const attentionCount = findings.filter((f) => f.pointsAwarded < f.maxPoints).length;

  const filteredFindings = findings.filter((item) => {
    const isMax = item.pointsAwarded === item.maxPoints && item.maxPoints > 0;
    if (activeFilter === "passed") return isMax;
    if (activeFilter === "attention") return !isMax;
    return true;
  });

  return (
    <div className="bg-white p-6 sm:p-9 rounded-3xl border border-slate-200/90 shadow-sm space-y-7">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-600 block mb-1">
            Complete Diagnostic Audit
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-sans">
            Itemized Diagnostic Findings
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Transparent breakdown of all evaluated digital checkpoints and strategic takeaways.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({findings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("attention")}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === "attention"
                ? "bg-amber-500 text-white shadow-xs font-bold"
                : "text-slate-600 hover:text-amber-700"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Attention ({attentionCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("passed")}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === "passed"
                ? "bg-sky-600 text-white shadow-xs font-bold"
                : "text-slate-600 hover:text-sky-700"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Optimal ({passedCount})</span>
          </button>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3.5">
        {filteredFindings.map((item, idx) => {
          const isMax = item.pointsAwarded === item.maxPoints && item.maxPoints > 0;
          const isZero = item.pointsAwarded === 0;

          return (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isMax
                  ? "bg-white border-slate-200/90 hover:border-slate-300"
                  : isZero
                  ? "bg-rose-50/40 border-rose-200/80"
                  : "bg-amber-50/40 border-amber-200/80"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {item.sectionName}
                    </span>
                    {isMax ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        <CheckCircle2 className="w-3 h-3 text-sky-600" />
                        <span>Optimized</span>
                      </span>
                    ) : isZero ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        <AlertOctagon className="w-3 h-3 text-rose-500" />
                        <span>Critical Deficit</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        <span>Partial / Friction</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug font-sans">
                    {item.questionText}
                  </h4>

                  <p className="text-xs sm:text-[13px] text-slate-700 font-medium">
                    Observed: <span className="italic font-normal">"{item.chosenOptionText}"</span>
                  </p>
                </div>

                <div className="shrink-0 self-start sm:self-auto text-right">
                  <span
                    className={`inline-block text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                      isMax
                        ? "bg-sky-50 text-sky-800 border-sky-200"
                        : isZero
                        ? "bg-rose-50 text-rose-800 border-rose-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    {item.pointsAwarded} / {item.maxPoints} pts
                  </span>
                </div>
              </div>

              {/* Actionable Strategic Hint */}
              {item.hint && (
                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-start gap-2 text-xs text-slate-600">
                  <span className="font-bold text-sky-700 shrink-0">Consultant Note:</span>
                  <p className="italic text-slate-600 text-[11.5px] leading-relaxed">
                    {item.hint}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
