"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  AuditTopNav,
} from "@/components/audit/AuditTopNav";
import {
  BusinessDetailsCard,
} from "@/components/audit/BusinessDetailsCard";
import {
  DynamicQuestionnaire,
} from "@/components/audit/DynamicQuestionnaire";
import {
  AuditSubmittedModal,
} from "@/components/audit/AuditSubmittedModal";
import {
  evaluateDynamicAudit,
  BusinessDetails,
} from "@/lib/audit-evaluator";
import { AuditFormData } from "@/types/form";
import {
  Loader2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

export default function PublicAuditPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [form, setForm] = useState<AuditFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [business, setBusiness] = useState<BusinessDetails>({
    name: "",
    clientName: "",
    category: "Cafe / Restaurant",
    locality: "",
    phone: "",
    whatsappNumber: "",
  });

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completedData, setCompletedData] = useState<{
    auditId: string;
    reportUrl: string;
    totalScore: number;
    maxScore: number;
    bandTitle: string;
    bandHeadline: string;
  } | null>(null);

  // Fetch form configuration
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/forms/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Audit form not found or inactive");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.form) {
          setForm(data.form);
          if (data.form.category) {
            setBusiness((prev) => ({ ...prev, category: data.form.category }));
          }
        } else {
          setError(data.error || "Audit form not found");
        }
      })
      .catch((err) => {
        setError(err?.message || "Failed to load audit form");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Compute live score dynamically as answers are selected
  const liveEvaluation = useMemo(() => {
    if (!form) return { totalScore: 0, maxScore: 100, percentage: 0 };
    return evaluateDynamicAudit(
      {
        sections: form.sections || [],
        questions: form.questions || [],
        scoreBands: form.scoreBands || [],
        totalMaxScore: form.totalMaxScore,
      },
      answers
    );
  }, [form, answers]);

  const totalQuestions = form?.questions?.length || 0;
  const answeredCount = Object.keys(answers).length;

  const handleBusinessChange = (updates: Partial<BusinessDetails>) => {
    setBusiness((prev) => ({ ...prev, ...updates }));
    if (submitError) setSubmitError(null);
  };

  const handleAnswer = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    if (submitError) setSubmitError(null);
  };

  // Submit Audit and Create Permanent Lead + Report Record
  const handleSubmitAudit = async () => {
    setSubmitError(null);

    // 1. Validation
    if (!business.name.trim()) {
      setSubmitError("Please fill in your Business Name in Step 01.");
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }
    if (!business.locality.trim()) {
      setSubmitError("Please enter your Locality / City in Step 01.");
      window.scrollTo({ top: 150, behavior: "smooth" });
      return;
    }

    // Require at least 50% answered or confirm
    if (answeredCount === 0) {
      setSubmitError("Please answer at least one diagnostic question.");
      return;
    }

    setSubmitting(true);

    try {
      if (!form?.id) throw new Error("Missing form identifier");

      const payload = {
        businessName: business.name.trim(),
        clientName: business.clientName?.trim() || undefined,
        category: business.category,
        locality: business.locality.trim(),
        phone: business.phone?.trim() || undefined,
        whatsappNumber: business.whatsappNumber?.trim() || business.phone?.trim() || undefined,
        answers,
      };

      const res = await fetch(`/api/forms/${form.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit audit");
      }

      setCompletedData({
        auditId: data.auditId,
        reportUrl: data.reportUrl || `/r/${data.auditId}`,
        totalScore: data.totalScore,
        maxScore: data.maxScore,
        bandTitle: data.bandTitle,
        bandHeadline: data.bandHeadline,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setSubmitError(err?.message || "Error submitting diagnostic audit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCompletedData(null);
    setSubmitError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          <p className="text-xs font-mono font-bold text-slate-600">Loading diagnostic questionnaire...</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border-2 border-slate-300 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-950">Audit Unavailable</h2>
          <p className="text-xs text-slate-600 font-medium">
            {error || "This audit questionnaire is currently not published or does not exist."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-sm"
          >
            <span>Visit Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] text-slate-950 font-sans">
      {/* Top Navigation */}
      <AuditTopNav
        formTitle={form.title}
        companyName={form.settings?.companyName}
        currentScore={liveEvaluation.totalScore}
        maxScore={liveEvaluation.maxScore}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
      />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 sm:py-8">
        {!completedData ? (
          <div className="space-y-8">
            {/* Header Introduction */}
            <div className="text-center space-y-2 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-100 border border-sky-300 text-sky-800 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Confidential Business Presence Diagnostic</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-sans">
                {form.title}
              </h1>
              {form.description && (
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed font-medium">
                  {form.description}
                </p>
              )}
            </div>

            {/* Error Notification */}
            {submitError && (
              <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-start gap-2.5 text-xs text-rose-800 font-bold animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Step 1: Business Profile Card */}
            <BusinessDetailsCard
              business={business}
              onChange={handleBusinessChange}
              defaultCategory={form.category}
            />

            {/* Step 2: Dynamic Questionnaire Header & Checkpoints */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 py-1">
                <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  2
                </div>
                <div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500 block">
                    Diagnostic Step 02
                  </span>
                  <h3 className="font-black text-slate-950 text-xl tracking-tight font-sans">
                    Digital Checkpoints & Scoring
                  </h3>
                </div>
              </div>

              <DynamicQuestionnaire
                sections={form.sections}
                questions={form.questions}
                answers={answers}
                onAnswer={handleAnswer}
              />
            </div>

            {/* Bottom Generate Report CTA Bar */}
            <div className="bg-white border-2 border-slate-300 shadow-[0_10px_35px_rgba(15,23,42,0.12)] p-4 sm:p-5 rounded-3xl sticky bottom-4 z-30 text-center space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left w-full sm:w-auto">
                  <p className="text-xs sm:text-sm font-black text-slate-950">
                    Ready for your Executive Diagnostic Report?
                  </p>
                  <p className="text-[11px] font-mono font-bold text-slate-600 mt-0.5">
                    Answered {answeredCount} of {totalQuestions} questions ({Math.round((answeredCount / (totalQuestions || 1)) * 100)}%)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSubmitAudit}
                  disabled={submitting}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Diagnostic...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Diagnostic Report</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Step 3: Completed Screen */
          <AuditSubmittedModal
            auditId={completedData.auditId}
            reportUrl={completedData.reportUrl}
            businessName={business.name}
            totalScore={completedData.totalScore}
            maxScore={completedData.maxScore}
            bandTitle={completedData.bandTitle}
            bandHeadline={completedData.bandHeadline}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
