"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Layers,
  Share2,
  CheckCircle2,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Background Soft Sky Blue Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-sky-200/40 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-200/35 blur-[130px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 p-[1px] shadow-sm">
              <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
                <span className="font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
                  TWS
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-900">
                Business Audit
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                Pro
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {!loading && user ? (
              <Link
                href="/dashboard"
                className="px-3 sm:px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-1.5 sm:gap-2 transition-all shadow-sm shadow-sky-600/30"
              >
                <span className="hidden sm:inline">Go to Dashboard</span>
                <span className="sm:hidden font-bold">Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-2.5 sm:px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-sky-600/25"
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden font-bold">Start</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-200 bg-sky-50/90 text-sky-700 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>The Modern Dynamic Business Audit & Diagnostic Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 leading-[1.15] max-w-3xl">
          Build Custom Diagnostic Audits.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700">
            Collect High-Value Leads.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
          Create tailored audit questionnaires with custom pillars, questions, point weights, and diagnostic hints. Generate shareable client links and automated executive diagnostic reports.
        </p>

        {/* CTA Group */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-600/25 transition-all hover:scale-[1.02]"
          >
            Create Your First Audit Form
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-sm transition-all"
          >
            Sign In to Dashboard
          </Link>
        </div>

        {/* Core Value Pillars Grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-5 w-full text-left">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:border-sky-300 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Custom Question Builder
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Define your own audit sections, multiple choice questions, point weights, and explanatory action advice.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:border-sky-300 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mb-4">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Instant Shareable Links
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generate sleek, branded audit links with live calculating score meters for respondents to complete anywhere.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:border-sky-300 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Executive Reports & WhatsApp
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Auto-generate radar breakdowns, score bands, and 1-tap WhatsApp consultation dispatch messages.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
        <p>© {new Date().getFullYear()} TWS Business Audit Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
