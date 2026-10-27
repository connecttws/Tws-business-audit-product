"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Filter,
  ExternalLink,
  MessageSquare,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Download,
  Loader2,
  AlertCircle,
  Building,
  MapPin,
  User,
  LogOut,
  FileText,
} from "lucide-react";

interface SubmissionItem {
  id: string;
  businessName: string;
  clientName?: string;
  category: string;
  locality: string;
  phone?: string;
  whatsappNumber?: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  bandTitle: string;
  status: string;
  formTitle: string;
  formSlug: string;
  formId: string;
  createdAt: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  role: string;
}

export default function SubmissionsCrmPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formFilter, setFormFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/audits");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.submissions)) {
          setSubmissions(data.submissions);
        }
      }
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setLoading(false);
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
        }
      })
      .catch(() => {});

    fetchSubmissions();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Update Status
  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/audits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Distinct forms list for filter
  const formsList = useMemo(() => {
    const map = new Map<string, string>();
    submissions.forEach((s) => map.set(s.formId, s.formTitle));
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [submissions]);

  // Filtered submissions
  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      const matchSearch =
        !search.trim() ||
        s.businessName.toLowerCase().includes(search.toLowerCase()) ||
        s.locality.toLowerCase().includes(search.toLowerCase()) ||
        (s.phone && s.phone.includes(search)) ||
        (s.clientName && s.clientName.toLowerCase().includes(search.toLowerCase()));

      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchForm = formFilter === "all" || s.formId === formFilter;

      return matchSearch && matchStatus && matchForm;
    });
  }, [submissions, search, statusFilter, formFilter]);

  // Export to CSV
  const handleExportCsv = () => {
    if (filtered.length === 0) return;
    const headers = [
      "ID",
      "Business Name",
      "Client Contact",
      "Locality",
      "Category",
      "Phone / WhatsApp",
      "Digital Score",
      "Max Score",
      "Percentage",
      "Band Diagnosis",
      "Status",
      "Form Title",
      "Submitted Date",
    ];

    const rows = filtered.map((s) => [
      s.id,
      `"${s.businessName.replace(/"/g, '""')}"`,
      `"${(s.clientName || "").replace(/"/g, '""')}"`,
      `"${s.locality.replace(/"/g, '""')}"`,
      `"${s.category.replace(/"/g, '""')}"`,
      s.whatsappNumber || s.phone || "",
      s.totalScore,
      s.maxScore,
      `${s.percentage}%`,
      `"${s.bandTitle}"`,
      s.status,
      `"${s.formTitle.replace(/"/g, '""')}"`,
      new Date(s.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit-leads-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const newLeadsCount = submissions.filter((s) => s.status === "new").length;
  const convertedCount = submissions.filter((s) => s.status === "converted").length;

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
                  CRM
                </span>
              </div>
            </Link>
          </div>

          {/* Center (Desktop only): Navigation Tabs */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>My Forms</span>
            </Link>
            <Link
              href="/dashboard/submissions"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-white text-sky-700 shadow-xs"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Submissions CRM ({submissions.length})</span>
            </Link>
          </div>

          {/* Right: User Profile & Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-2 text-right">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-sky-600 to-blue-600 flex items-center justify-center font-bold text-[11px] sm:text-xs text-white uppercase shadow-sm">
                {user?.name ? user.name.slice(0, 2) : "US"}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">{user?.name || "Admin"}</p>
                <p className="text-[10px] text-slate-500 leading-tight truncate max-w-[120px]">
                  {user?.companyName || user?.email || "Workspace"}
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
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-600 hover:text-slate-900"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>My Forms</span>
            </Link>
            <Link
              href="/dashboard/submissions"
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-white text-sky-700 shadow-xs"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Submissions CRM ({submissions.length})</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-4 py-6 sm:py-8 space-y-5">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Audit Submissions & Leads CRM
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Track incoming business diagnostics, review scores, and contact leads via 1-click WhatsApp.
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            disabled={filtered.length === 0}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2 self-start sm:self-auto disabled:opacity-40 shadow-sm"
          >
            <Download className="w-4 h-4 text-sky-600" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Quick Stats Grid: Compact on Mobile */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border-2 border-slate-200/90 shadow-sm">
            <span className="text-[11px] sm:text-xs font-bold text-slate-600 block">Total Leads</span>
            <p className="text-xl sm:text-2xl font-black text-slate-950 mt-1">{submissions.length}</p>
            <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block mt-0.5">Across all links</p>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border-2 border-rose-200/80 shadow-sm">
            <span className="text-[11px] sm:text-xs font-bold text-rose-700 block">● New Leads</span>
            <p className="text-xl sm:text-2xl font-black text-rose-600 mt-1">{newLeadsCount}</p>
            <p className="text-[10px] sm:text-[11px] text-rose-600/70 hidden sm:block mt-0.5">Needs outreach</p>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border-2 border-emerald-200/80 shadow-sm">
            <span className="text-[11px] sm:text-xs font-bold text-emerald-700 block">Converted</span>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">{convertedCount}</p>
            <p className="text-[10px] sm:text-[11px] text-emerald-600/70 hidden sm:block mt-0.5">Closed retainers</p>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-72 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search business, city, phone..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto">
            {/* Form Filter */}
            {formsList.length > 0 && (
              <select
                value={formFilter}
                onChange={(e) => setFormFilter(e.target.value)}
                className="bg-slate-50 border-2 border-slate-200 text-xs px-2.5 py-2 rounded-xl text-slate-800 font-semibold focus:bg-white focus:border-sky-500 focus:outline-none"
              >
                <option value="all">
                  All Forms ({formsList.length})
                </option>
                {formsList.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.title}
                  </option>
                ))}
              </select>
            )}

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border-2 border-slate-200 text-xs px-2.5 py-2 rounded-xl text-slate-800 font-semibold focus:bg-white focus:border-sky-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="new">● New</option>
              <option value="contacted">● Contacted</option>
              <option value="converted">● Converted</option>
              <option value="archived">● Archived</option>
            </select>
          </div>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border-2 border-slate-200 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-sky-600 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center space-y-3 border-2 border-slate-200 shadow-sm">
            <p className="text-base font-bold text-slate-900">No submissions found.</p>
            <p className="text-xs text-slate-600">
              Share your public audit links (`/audit/[slug]`) with business owners to collect diagnostic leads.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((item) => {
              const phone = item.whatsappNumber || item.phone;
              const cleanPhone = phone ? phone.replace(/[^0-9]/g, "") : "";
              const waUrl = cleanPhone
                ? `https://wa.me/${cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone}?text=${encodeURIComponent(
                    `Hi ${item.clientName || item.businessName}, I reviewed your diagnostic audit for ${item.businessName} (Score: ${item.totalScore}/${item.maxScore} - ${item.bandTitle}). Let's discuss your action plan.`
                  )}`
                : null;

              const statusColor =
                item.status === "new"
                  ? "bg-rose-100 text-rose-800 border-rose-300"
                  : item.status === "contacted"
                  ? "bg-amber-100 text-amber-800 border-amber-300"
                  : item.status === "converted"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : "bg-slate-200 text-slate-700 border-slate-300";

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border-2 border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.06)] hover:border-sky-400 transition-all p-4 sm:p-5 space-y-3.5"
                >
                  {/* Top Row: Category, Date, and Status Selector */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-100 border border-sky-300 text-sky-800">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Status Dropdown */}
                    <select
                      value={item.status}
                      disabled={updatingId === item.id}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl border-2 focus:outline-none cursor-pointer ${statusColor}`}
                    >
                      <option value="new">● New</option>
                      <option value="contacted">● Contacted</option>
                      <option value="converted">● Converted</option>
                      <option value="archived">● Archived</option>
                    </select>
                  </div>

                  {/* Middle: Business Identity */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight leading-tight">
                      {item.businessName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      via {item.formTitle}
                    </p>
                  </div>

                  {/* Contact Badges Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg font-medium">
                      <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>{item.locality || "Local Area"}</span>
                    </span>

                    {item.clientName && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg font-medium">
                        <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{item.clientName}</span>
                      </span>
                    )}

                    {phone && (
                      <a
                        href={`tel:${cleanPhone}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-lg hover:bg-sky-100 transition-colors"
                        title="Click to Call"
                      >
                        <Phone className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>{phone}</span>
                      </a>
                    )}
                  </div>

                  {/* Score & Band Diagnosis Box */}
                  <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          Digital Score:
                        </span>
                        <span className="font-black text-base sm:text-lg text-slate-950 font-mono">
                          {item.totalScore}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          / {item.maxScore} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-32 sm:w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full"
                          style={{ width: `${Math.min(item.percentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                        Diagnosis
                      </span>
                      <span className="text-xs font-black text-sky-700 uppercase">
                        {item.bandTitle}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Actions: 2 Full-Width Buttons on Mobile */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {waUrl ? (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4 shrink-0" />
                        <span>WhatsApp</span>
                      </a>
                    ) : (
                      <button
                        disabled
                        className="py-2.5 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed"
                      >
                        <MessageSquare className="w-4 h-4 shrink-0" />
                        <span>No Phone</span>
                      </button>
                    )}

                    <Link
                      href={`/r/${item.id}`}
                      target="_blank"
                      className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      title="View Report"
                    >
                      <span>View Report</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
