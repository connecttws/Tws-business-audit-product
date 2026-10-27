"use client";

import React from "react";
import { Sparkles, MapPin, Calendar, ShieldCheck, Zap, TrendingUp, AlertTriangle } from "lucide-react";

interface ReportCoverProps {
  businessName: string;
  clientName?: string;
  locality: string;
  category: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  bandTitle: string;
  bandHeadline: string;
  sprintDetails?: string;
  createdAt: string;
  formTitle?: string;
}

export function ReportCover({
  businessName,
  clientName,
  locality,
  category,
  totalScore,
  maxScore,
  percentage,
  bandTitle,
  bandHeadline,
  sprintDetails,
  createdAt,
  formTitle,
}: ReportCoverProps) {
  // Determine dynamic tier theme
  const getTheme = (score: number) => {
    if (score >= 90) {
      return {
        badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        strokeColor: "#10B981",
        glowColor: "rgba(16, 185, 129, 0.25)",
        pillBg: "bg-emerald-500 text-slate-950",
        alertIcon: Sparkles,
        statusLabel: "Optimal Digital Footprint",
      };
    }
    if (score >= 70) {
      return {
        badgeBg: "bg-sky-500/10 text-sky-400 border-sky-500/30",
        strokeColor: "#0EA5E9",
        glowColor: "rgba(14, 165, 233, 0.25)",
        pillBg: "bg-sky-500 text-slate-950",
        alertIcon: TrendingUp,
        statusLabel: "Strong Foundation · Scaling Ready",
      };
    }
    if (score >= 40) {
      return {
        badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        strokeColor: "#F59E0B",
        glowColor: "rgba(245, 158, 11, 0.25)",
        pillBg: "bg-amber-500 text-slate-950",
        alertIcon: AlertTriangle,
        statusLabel: "Moderate Conversion Friction",
      };
    }
    return {
      badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
      strokeColor: "#EF4444",
      glowColor: "rgba(239, 68, 68, 0.25)",
      pillBg: "bg-rose-500 text-white",
      alertIcon: AlertTriangle,
      statusLabel: "Critical Revenue Leakage",
    };
  };

  const theme = getTheme(totalScore);
  const StatusIcon = theme.alertIcon;

  // Radial progress calculations for SVG gauge
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-10 shadow-2xl border border-slate-800/90">
      {/* Subtle ambient lighting glow */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-30"
        style={{ backgroundColor: theme.strokeColor }}
      />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-sky-600/15" />

      <div className="relative z-10 space-y-7">
        {/* Top Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/80 pb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-200 font-mono text-[11px] font-bold uppercase tracking-wider shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official TWS Digital Audit</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedDate}</span>
            </span>
          </div>
        </div>

        {/* Hero Main: Business Details + Radial Gauge */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-1">
          <div className="space-y-4 flex-1">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/90 border border-slate-800 text-slate-300">
                {category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${theme.badgeBg}`}>
                {bandTitle}
              </span>
            </div>

            {/* Title & Locality */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans">
                {businessName}
              </h1>
              <p className="text-sm text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{locality}</span>
                {clientName && (
                  <>
                    <span className="text-slate-600">·</span>
                    <span>Client: {clientName}</span>
                  </>
                )}
              </p>
            </div>

            {/* Diagnostic Assessment Box */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 space-y-1.5">
              <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs uppercase tracking-wider">
                <StatusIcon className="w-4 h-4" />
                <span>Diagnostic Assessment</span>
              </div>
              <p className="font-extrabold text-white text-base sm:text-lg leading-snug">
                {bandHeadline}
              </p>
            </div>

            {/* Recommended Sprint */}
            {sprintDetails && (
              <div className="flex items-start gap-2 text-xs text-slate-300 pt-1">
                <div className="w-5 h-5 rounded-md bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-3 h-3" />
                </div>
                <div>
                  <span className="font-bold text-sky-400 uppercase tracking-wider text-[11px] block">
                    Recommended Action Sprint:
                  </span>
                  <span>{sprintDetails}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Radial SVG Score Dial */}
          <div className="self-center lg:self-auto shrink-0 flex flex-col items-center">
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full flex items-center justify-center bg-slate-900/80 border border-slate-800 shadow-2xl p-4">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 130 130">
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  className="text-slate-800/80"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  stroke={theme.strokeColor}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white leading-none">
                  {totalScore}
                </span>
                <span className="text-xs font-bold text-slate-400 font-mono mt-1">
                  OUT OF {maxScore}
                </span>
                <span className="text-[10px] font-mono font-bold text-sky-400 mt-0.5">
                  {percentage}% SCORE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
