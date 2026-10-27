"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ReportHeader } from "@/components/report/ReportHeader";
import { ReportCover } from "@/components/report/ReportCover";
import { ReportBreakdown } from "@/components/report/ReportBreakdown";
import { ReportFindings } from "@/components/report/ReportFindings";
import { ReportWhatsAppCta } from "@/components/report/ReportWhatsAppCta";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

function ReportViewer() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [audit, setAudit] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No audit ID specified in URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/audits/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Diagnostic report not found");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.audit) {
          setAudit(data.audit);
        } else {
          setError(data.error || "Report not found");
        }
      })
      .catch((err) => {
        setError(err?.message || "Failed to load audit report");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          <p className="text-xs font-mono font-medium text-slate-500">Loading diagnostic intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Report Not Found</h2>
          <p className="text-xs text-slate-600">{error || "The requested audit report could not be found."}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] text-slate-900 font-sans">
      {/* Sticky Header with Share & Print */}
      <ReportHeader
        businessName={audit.businessName}
        companyName={audit.agencySettings?.companyName || "Team TWS"}
        auditId={audit.id}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-10 space-y-8">
        {/* 1. Executive Cover Banner with Score Dial */}
        <ReportCover
          businessName={audit.businessName}
          clientName={audit.clientName}
          locality={audit.locality}
          category={audit.category}
          totalScore={audit.totalScore}
          maxScore={audit.maxScore}
          percentage={audit.percentage}
          bandTitle={audit.bandTitle}
          bandHeadline={audit.bandHeadline}
          sprintDetails={audit.sprintDetails}
          createdAt={audit.createdAt}
        />

        {/* 2. Five Pillar Diagnostic Breakdown */}
        <ReportBreakdown sectionScores={audit.sectionScores || []} />

        {/* 3. Itemized Checkpoint Findings */}
        <ReportFindings findings={audit.findings || []} />

        {/* 4. Instant WhatsApp Share & Consultation */}
        <ReportWhatsAppCta
          auditId={audit.id}
          businessName={audit.businessName}
          clientName={audit.clientName}
          locality={audit.locality}
          category={audit.category}
          totalScore={audit.totalScore}
          maxScore={audit.maxScore}
          percentage={audit.percentage}
          bandTitle={audit.bandTitle}
          bandHeadline={audit.bandHeadline}
          sectionScores={audit.sectionScores || []}
          clientPhone={audit.phone || audit.whatsappNumber}
          agencyPhone={audit.agencySettings?.whatsappNumber}
        />

        {/* Confidential Report Footer */}
        <footer className="text-center py-8 text-xs text-slate-500 font-mono space-y-1 border-t border-slate-200">
          <p className="font-bold text-slate-600">
            {audit.agencySettings?.companyName || "Team TWS"} · Business Intelligence Diagnostic Report
          </p>
          <p className="text-[11px] text-slate-400">
            Report Reference ID: {audit.id} · Generated on {new Date(audit.createdAt).toLocaleDateString()}
          </p>
        </footer>
      </main>
    </div>
  );
}

export default function CustomerReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
        </div>
      }
    >
      <ReportViewer />
    </Suspense>
  );
}
