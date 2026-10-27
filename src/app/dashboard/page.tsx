"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Plus,
  Layers,
  FileText,
  Users,
  BarChart3,
  ExternalLink,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building,
  Copy,
  Check,
  Edit3,
  Trash2,
  Clock,
  Loader2,
  Share2,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  role: string;
}

interface FormSummary {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category: string;
  themeColor: string;
  isPublished: boolean;
  totalMaxScore: number;
  submissionCount: number;
  viewsCount: number;
  questionCount: number;
  sectionCount: number;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [forms, setForms] = useState<FormSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchForms = async () => {
    try {
      const res = await fetch("/api/forms");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.forms)) {
          setForms(data.forms);
        }
      }
    } catch (err) {
      console.error("Failed to fetch forms:", err);
    }
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          return fetchForms();
        } else {
          router.push("/login");
        }
      })
      .catch(() => {
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // 1-Click Clone TWS Default Template
  const handleCloneDefault = async () => {
    setCloning(true);
    try {
      const res = await fetch("/api/forms/clone-default", { method: "POST" });
      const data = await res.json();
      if (data.success && data.form) {
        await fetchForms();
      } else {
        alert(data.error || "Failed to clone default audit");
      }
    } catch (err: any) {
      alert(err?.message || "Error cloning template");
    } finally {
      setCloning(false);
    }
  };

  // Copy shareable link
  const handleCopyLink = async (slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${origin}/audit/${slug}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2500);
    } catch {
      alert(`Shareable Link: ${fullUrl}`);
    }
  };

  // Delete Form
  const handleDeleteForm = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This will also remove any audit leads tied to this form.`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/forms/${id}`, { method: "DELETE" });
      if (res.ok) {
        setForms((prev) => prev.filter((f) => f.id !== id));
      } else {
        alert("Failed to delete form");
      }
    } catch (err: any) {
      alert(err?.message || "Error deleting form");
    } finally {
      setDeletingId(null);
    }
  };

  const totalSubmissions = forms.reduce((sum, f) => sum + (f.submissionCount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          <p className="text-xs font-mono text-slate-500">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] text-slate-900 font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Left: Branding */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Link href="/dashboard" className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 p-[1px] shadow-sm">
                <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
                  <span className="font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
                    TWS
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-900">
                  Audit Product
                </span>
                <span className="hidden md:inline-block text-[9px] uppercase font-bold tracking-wider text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded-full border border-sky-200">
                  Pro
                </span>
              </div>
            </Link>
          </div>

          {/* Center (Desktop only): Navigation Tabs */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-white text-sky-700 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>My Forms ({forms.length})</span>
            </Link>
            <Link
              href="/dashboard/submissions"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Submissions CRM</span>
            </Link>
          </div>

          {/* Right: User Profile & Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-2 text-right">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-sky-600 to-blue-600 flex items-center justify-center font-bold text-[11px] sm:text-xs text-white uppercase shadow-sm">
                {user?.name ? user.name.slice(0, 2) : "US"}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">{user?.name}</p>
                <p className="text-[10px] text-slate-500 leading-tight truncate max-w-[120px]">
                  {user?.companyName || user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile-only Segmented Navigation Bar */}
        <div className="sm:hidden px-3 pb-2.5 pt-0.5">
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-white text-sky-700 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>My Forms ({forms.length})</span>
            </Link>
            <Link
              href="/dashboard/submissions"
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-600 hover:text-slate-900"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Submissions CRM</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 border-2 border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.06)] mb-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-100 border border-sky-300 text-sky-800 text-[11px] font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Form Builder & Link Generator Ready</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Welcome, {user?.name} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-medium">
                Create, customize, and publish digital presence audits. Share links with prospective clients and collect high-value leads.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleCloneDefault}
                disabled={cloning}
                className="px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border-2 border-sky-200 font-bold text-xs flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 shadow-xs"
                title="Instantly clones all 16 questions and 5 pillars"
              >
                {cloning ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Cloning Template...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    <span>Clone TWS Default 5-Pillar</span>
                  </>
                )}
              </button>

              <Link
                href="/dashboard/forms/new"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-sky-600/25 transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Build New Form</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total Audit Forms</span>
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-950 mt-2">{forms.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">Active diagnostic templates</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Auditee Submissions</span>
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-950 mt-2">{totalSubmissions}</p>
            <p className="text-[11px] text-slate-500 mt-1">Total leads collected across links</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Agency Status</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-950 mt-2">Active</p>
            <p className="text-[11px] text-slate-500 mt-1">{user?.companyName || "Standard Tier"}</p>
          </div>
        </div>

        {/* Audit Forms Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950 tracking-tight">Your Audit Forms</h2>
              <p className="text-xs text-slate-600">
                Manage forms, copy shareable public links, or edit questions and diagnostic hints.
              </p>
            </div>
          </div>

          {forms.length === 0 ? (
            /* Empty State */
            <div className="bg-white p-12 rounded-3xl text-center border-2 border-slate-200 shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 border border-sky-300 text-sky-700 flex items-center justify-center mx-auto">
                <Layers className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="font-extrabold text-slate-950 text-base">No Audit Forms Created Yet</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Get started in seconds! Clone the battle-tested TWS 5-Pillar Template with 16 calibrated questions, or build a custom questionnaire from scratch.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleCloneDefault}
                  disabled={cloning}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-sky-600/25 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Clone TWS Default 5-Pillar Audit</span>
                </button>
                <Link
                  href="/dashboard/forms/new"
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs"
                >
                  Build Custom Form
                </Link>
              </div>
            </div>
          ) : (
            /* Forms Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {forms.map((form) => {
                const isCopied = copiedSlug === form.slug;
                return (
                  <div
                    key={form.id}
                    className="bg-white rounded-2xl p-5 border-2 border-slate-200/90 hover:border-sky-400 shadow-[0_4px_16px_rgba(15,23,42,0.06)] hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      {/* Form Top Row */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 border border-sky-300 text-sky-800">
                          {form.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-700 font-mono font-bold">
                          <span>{form.questionCount} Questions</span>
                          <span>·</span>
                          <span className="text-sky-700 font-black">{form.totalMaxScore} Pts</span>
                        </div>
                      </div>

                      <h3 className="font-black text-slate-950 text-base group-hover:text-sky-600 transition-colors">
                        {form.title}
                      </h3>
                      {form.description && (
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {form.description}
                        </p>
                      )}
                    </div>

                    {/* Shareable Link Box */}
                    <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Share2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="text-xs font-mono font-medium text-slate-700 truncate">
                          /audit/{form.slug}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopyLink(form.slug)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shrink-0 ${
                          isCopied
                            ? "bg-emerald-600 text-white"
                            : "bg-sky-600 hover:bg-sky-700 text-white shadow-xs"
                        }`}
                        title="Copy Public Link"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-semibold">{form.submissionCount} Submissions</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/forms/${form.id}/edit`}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>

                        <button
                          onClick={() => handleDeleteForm(form.id, form.title)}
                          disabled={deletingId === form.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                          title="Delete Form"
                        >
                          {deletingId === form.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
