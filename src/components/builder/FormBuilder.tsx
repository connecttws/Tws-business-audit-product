"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Settings,
  Sliders,
  Check,
  Eye,
  AlertCircle,
  Loader2,
  ExternalLink,
  MapPin,
  Camera,
  Globe,
  Target,
  Zap,
  Edit3,
} from "lucide-react";
import {
  AuditFormData,
  SectionItem,
  QuestionItem,
  AnswerOption,
  ScoreBandItem,
} from "@/types/form";
import { DEFAULT_TWS_SECTIONS, DEFAULT_TWS_SCORE_BANDS } from "@/lib/default-template";

interface FormBuilderProps {
  initialData?: AuditFormData;
  isEditMode?: boolean;
}

const AVAILABLE_ICONS = ["MapPin", "Camera", "Globe", "Target", "Zap", "Sparkles", "Layers"];

export function FormBuilder({ initialData, isEditMode = false }: FormBuilderProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "Custom Business Digital Diagnostic");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(
    initialData?.description || "Comprehensive multi-pillar diagnostic audit assessing digital maturity and revenue gaps."
  );
  const [category, setCategory] = useState(initialData?.category || "Universal");
  const [themeColor, setThemeColor] = useState(initialData?.themeColor || "sky");
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);

  const [sections, setSections] = useState<SectionItem[]>(
    initialData?.sections || DEFAULT_TWS_SECTIONS
  );
  const [questions, setQuestions] = useState<QuestionItem[]>(
    initialData?.questions || []
  );
  const [scoreBands, setScoreBands] = useState<ScoreBandItem[]>(
    initialData?.scoreBands || DEFAULT_TWS_SCORE_BANDS
  );
  const [settings, setSettings] = useState(
    initialData?.settings || {
      companyName: "Team TWS",
      whatsappNumber: "",
      customCtaMessage: "Hi, I just reviewed my business audit report and want to schedule a strategy call.",
    }
  );

  const [activeTab, setActiveTab] = useState<"questions" | "bands" | "settings">("questions");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("all");
  const [showManagePillars, setShowManagePillars] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Auto-generate slug from title if empty
  const generatedSlug = useMemo(() => {
    if (slug) return slug;
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, [title, slug]);

  // Compute live total max score
  const totalMaxScore = useMemo(() => {
    return questions.reduce((sum, q) => {
      const maxOpt = Math.max(...(q.options?.map((o) => Number(o.points) || 0) || [0]), 0);
      return sum + maxOpt;
    }, 0);
  }, [questions]);

  // Filter questions based on selected section filter
  const filteredQuestions = useMemo(() => {
    if (selectedSectionId === "all") return questions;
    return questions.filter((q) => q.sectionId === selectedSectionId);
  }, [questions, selectedSectionId]);

  // --- Section Handlers ---
  const handleAddSection = () => {
    const newId = `sec_${Date.now().toString(36)}`;
    const newSection: SectionItem = {
      id: newId,
      name: `New Pillar ${sections.length + 1}`,
      icon: "Layers",
      maxPoints: 20,
    };
    setSections([...sections, newSection]);
    setSelectedSectionId(newId);
  };

  const handleUpdateSection = (id: string, updates: Partial<SectionItem>) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleDeleteSection = (id: string) => {
    if (sections.length <= 1) {
      alert("At least one audit pillar/category is required.");
      return;
    }
    const sec = sections.find((s) => s.id === id);
    const secQuestionsCount = questions.filter((q) => q.sectionId === id).length;
    let msg = `Are you sure you want to delete the pillar "${sec?.name || id}"?`;
    if (secQuestionsCount > 0) {
      msg += `\n\nWarning: All ${secQuestionsCount} question(s) inside this pillar will also be deleted!`;
    }

    if (confirm(msg)) {
      setSections(sections.filter((s) => s.id !== id));
      setQuestions(questions.filter((q) => q.sectionId !== id));
      if (selectedSectionId === id) setSelectedSectionId("all");
    }
  };

  // --- Global Scoring Handlers: 100 Max Points Divided Across ALL Questions (All Pillars Combined) ---

  // Pure function: divide 100 points evenly across ALL questions from all pillars combined
  const calculatePointsForAllQuestions = (qs: QuestionItem[]): QuestionItem[] => {
    const n = qs.length;
    if (n === 0) return [];

    const base = Math.floor(100 / n);
    const remainder = 100 % n;

    return qs.map((q, idx) => {
      // First remainder questions get base + 1 so total sum of ALL questions equals exactly 100
      const qPts = base + (idx < remainder ? 1 : 0);
      const newOpts = [...q.options];

      if (newOpts.length === 0) return q;

      // Option 1 = full max points for this question
      newOpts[0] = { ...newOpts[0], points: qPts };

      const lastIdx = newOpts.length - 1;
      // Last option = always zero points
      if (lastIdx > 0) {
        newOpts[lastIdx] = { ...newOpts[lastIdx], points: 0 };
      }

      // Option 2 (second option) = half of Option 1 floored (e.g. 10 -> 5, 9 -> 4, 7 -> 3, 6 -> 3)
      if (newOpts.length === 3) {
        newOpts[1] = { ...newOpts[1], points: Math.floor(qPts / 2) };
      } else if (newOpts.length > 3) {
        for (let i = 1; i < lastIdx; i++) {
          newOpts[i] = {
            ...newOpts[i],
            points: Math.floor((qPts * (lastIdx - i)) / lastIdx),
          };
        }
      }

      return { ...q, options: newOpts };
    });
  };

  // Sync each pillar's maxPoints dynamically to match the sum of its questions
  const syncSectionsWithQuestions = (qs: QuestionItem[], secs: SectionItem[]): SectionItem[] => {
    return secs.map((sec) => {
      const secQuestions = qs.filter((q) => q.sectionId === sec.id);
      const secMax = secQuestions.reduce((sum, q) => {
        const m = Math.max(...(q.options?.map((o) => Number(o.points) || 0) || [0]), 0);
        return sum + m;
      }, 0);
      return { ...sec, maxPoints: secMax };
    });
  };

  // Automatically calibrate points across ALL questions from all pillars to sum to 100
  const handleAutoCalibratePoints = () => {
    if (questions.length === 0) return;
    const n = questions.length;
    const updated = calculatePointsForAllQuestions(questions);
    const updatedSections = syncSectionsWithQuestions(updated, sections);

    setQuestions(updated);
    setSections(updatedSections);
    setMessage({
      type: "success",
      text: `Divided 100 points across all ${n} questions! (Option 1 = Max pts, Option 2 = Half floored, Last Option = 0).`,
    });
    setTimeout(() => setMessage(null), 3500);
  };

  // Adding a question automatically divides 100 points across ALL questions (all pillars combined)
  const handleAddQuestion = (sectionId?: string) => {
    const targetSection = sectionId || (selectedSectionId !== "all" ? selectedSectionId : sections[0]?.id || "maps");

    const newQ: QuestionItem = {
      id: `q_${Date.now().toString(36)}`,
      sectionId: targetSection,
      text: "New Diagnostic Question",
      description: "Explain why this checkpoint matters to the business owner",
      options: [
        { text: "Fully optimized and active", points: 0, hint: "Strong competitive advantage" },
        { text: "Partially implemented or outdated", points: 0, hint: "Moderate friction causes lead drop-off" },
        { text: "Not implemented / critical deficit", points: 0, hint: "Immediate revenue leak to competitors" },
      ],
    };

    const combinedQuestions = [...questions, newQ];
    // Automatically divide 100 points by the new total count of all questions
    const balancedQuestions = calculatePointsForAllQuestions(combinedQuestions);
    const updatedSections = syncSectionsWithQuestions(balancedQuestions, sections);

    setQuestions(balancedQuestions);
    setSections(updatedSections);
  };

  const handleUpdateQuestion = (qId: string, updates: Partial<QuestionItem>) => {
    setQuestions(questions.map((q) => (q.id === qId ? { ...q, ...updates } : q)));
  };

  // Deleting a question automatically re-divides 100 points across remaining questions
  const handleDeleteQuestion = (qId: string) => {
    const remaining = questions.filter((q) => q.id !== qId);
    if (remaining.length > 0) {
      const balanced = calculatePointsForAllQuestions(remaining);
      const updatedSections = syncSectionsWithQuestions(balanced, sections);
      setQuestions(balanced);
      setSections(updatedSections);
    } else {
      setQuestions([]);
    }
  };

  // --- Option Handlers ---
  const handleAddOption = (qId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        const newOpts = [
          ...q.options,
          { text: "New alternative checkpoint", points: 0, hint: "Review impact" },
        ];
        // Automatically ensure last option is 0
        newOpts[newOpts.length - 1].points = 0;
        return { ...q, options: newOpts };
      })
    );
  };

  const handleUpdateOption = (qId: string, optIndex: number, updates: Partial<AnswerOption>) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        const newOpts = q.options.map((opt, idx) => {
          if (idx !== optIndex) return opt;
          return { ...opt, ...updates };
        });

        // Enforce rule: if Option 1 (first option) points changed, automatically recalculate Option 2
        if (optIndex === 0 && updates.points !== undefined) {
          const firstPts = Number(updates.points) || 0;
          if (newOpts.length >= 3) {
            newOpts[1] = { ...newOpts[1], points: Math.floor(firstPts / 2) };
          }
          newOpts[newOpts.length - 1] = { ...newOpts[newOpts.length - 1], points: 0 };
        }

        return { ...q, options: newOpts };
      })
    );
  };

  const handleDeleteOption = (qId: string, optIndex: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        if (q.options.length <= 2) {
          alert("Each question must have at least 2 options.");
          return q;
        }
        const filtered = q.options.filter((_, idx) => idx !== optIndex);
        // Ensure last option is always 0
        if (filtered.length > 0) {
          filtered[filtered.length - 1].points = 0;
        }
        return { ...q, options: filtered };
      })
    );
  };

  // --- Save / Submit Form ---
  const handleSave = async () => {
    if (!title.trim()) {
      setMessage({ type: "error", text: "Please enter a form title." });
      return;
    }
    if (questions.length === 0) {
      setMessage({ type: "error", text: "Please add at least one question." });
      return;
    }

    setSaving(true);
    setMessage(null);

    const payload = {
      title: title.trim(),
      slug: generatedSlug,
      description: description.trim(),
      category: category.trim(),
      themeColor,
      isPublished,
      sections,
      questions,
      scoreBands,
      settings,
    };

    try {
      const endpoint = isEditMode && initialData?.id ? `/api/forms/${initialData.id}` : "/api/forms";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save audit form");
      }

      setMessage({ type: "success", text: "Audit form saved successfully!" });
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Error saving form" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] text-slate-900 font-sans">
      {/* Top Builder Nav */}
      <header className="relative sm:sticky sm:top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="min-w-0">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Audit Form Title..."
                className="bg-transparent font-black text-base sm:text-lg text-slate-950 border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none px-1 py-0.5 rounded transition-all w-full truncate"
              />
              <p className="text-[11px] font-mono text-slate-500 truncate">
                Public URL: <span className="text-sky-600 font-semibold">/audit/{generatedSlug}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Live Max Score Counter & Balance Status */}
            {totalMaxScore === 100 ? (
              <button
                type="button"
                onClick={handleAutoCalibratePoints}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-all shadow-sm"
                title="Total score is perfectly balanced at 100 points. Click to re-calibrate."
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>100 Pts (Balanced)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAutoCalibratePoints}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-all shadow-sm"
                title="Click to auto-balance all questions to 100 points total"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>{totalMaxScore}/100 Pts · Balance to 100</span>
              </button>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-sky-600/25 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditMode ? "Save Changes" : "Save & Publish"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-2 border-t border-slate-200/80">
          <button
            onClick={() => setActiveTab("questions")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "questions"
                ? "border-sky-600 text-sky-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Questions ({questions.length}) · Pillars ({sections.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("bands")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "bands"
                ? "border-sky-600 text-sky-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Score Bands & Diagnosis ({scoreBands.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "settings"
                ? "border-sky-600 text-sky-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Form Settings & CTA</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8">
        {/* Status Alerts */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 text-xs font-semibold animate-fadeIn ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {message.type === "success" ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* TAB 1: QUESTIONS & PILLARS */}
        {activeTab === "questions" && (
          <div className="space-y-6">
            {/* Pillars / Sections Manager Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Audit Pillars & Categories ({sections.length})
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Click any pillar to filter questions, rename the category, or delete it.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setShowManagePillars(!showManagePillars)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      showManagePillars
                        ? "bg-sky-600 text-white border-sky-600 shadow-sm shadow-sky-600/20"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                    <span>{showManagePillars ? "Done Managing" : "Manage All Pillars"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Pillar</span>
                  </button>
                </div>
              </div>

              {/* Pillar Selector Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSectionId("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSectionId === "all"
                      ? "bg-sky-600 text-white shadow-sm shadow-sky-600/30"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  All Questions ({questions.length})
                </button>

                {sections.map((sec) => {
                  const count = questions.filter((q) => q.sectionId === sec.id).length;
                  const isSelected = selectedSectionId === sec.id;
                  return (
                    <div
                      key={sec.id}
                      className={`inline-flex items-center rounded-xl border transition-all ${
                        isSelected
                          ? "bg-sky-600 border-sky-600 text-white shadow-sm shadow-sky-600/30"
                          : "bg-white border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-slate-50"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedSectionId(sec.id)}
                        className="px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
                      >
                        <span>{sec.name}</span>
                        <span className={`text-[10px] ${isSelected ? "text-sky-200" : "text-slate-400"}`}>
                          ({count})
                        </span>
                      </button>

                      {/* Direct Delete Button on Pill */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSection(sec.id);
                        }}
                        className={`p-1.5 rounded-r-xl hover:bg-rose-500 hover:text-white transition-colors ${
                          isSelected ? "text-sky-200" : "text-slate-400"
                        }`}
                        title={`Delete Pillar "${sec.name}"`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* ACTIVE PILLAR INLINE EDITOR (When a specific pillar is selected) */}
              {selectedSectionId !== "all" && (() => {
                const activeSec = sections.find((s) => s.id === selectedSectionId);
                if (!activeSec) return null;
                const activeCount = questions.filter((q) => q.sectionId === activeSec.id).length;

                return (
                  <div className="pt-3 border-t border-slate-100 mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Edit Selected Pillar
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          ({activeCount} question{activeCount === 1 ? "" : "s"} in this pillar)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteSection(activeSec.id)}
                        className="px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                        title="Delete this pillar"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Delete Pillar</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Pillar Category Name
                        </label>
                        <input
                          type="text"
                          value={activeSec.name}
                          onChange={(e) => handleUpdateSection(activeSec.id, { name: e.target.value })}
                          placeholder="e.g. Google Maps & Local Search"
                          className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Pillar Icon
                        </label>
                        <select
                          value={activeSec.icon || "Layers"}
                          onChange={(e) => handleUpdateSection(activeSec.id, { icon: e.target.value })}
                          className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-sky-500"
                        >
                          {AVAILABLE_ICONS.map((iconName) => (
                            <option key={iconName} value={iconName}>
                              {iconName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* EXPANDED MANAGE ALL PILLARS GRID */}
              {showManagePillars && (
                <div className="pt-3 border-t border-slate-100 mt-3 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                      All Pillars Overview & Bulk Edit
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Total: {sections.length} Pillars
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {sections.map((sec, idx) => {
                      const count = questions.filter((q) => q.sectionId === sec.id).length;
                      return (
                        <div
                          key={sec.id}
                          className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5 flex-1 w-full sm:w-auto">
                            <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={sec.name}
                              onChange={(e) => handleUpdateSection(sec.id, { name: e.target.value })}
                              placeholder="Pillar Name..."
                              className="flex-1 text-xs font-bold text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl focus:outline-none focus:border-sky-500"
                            />
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <select
                              value={sec.icon || "Layers"}
                              onChange={(e) => handleUpdateSection(sec.id, { icon: e.target.value })}
                              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-sky-500"
                            >
                              {AVAILABLE_ICONS.map((iconName) => (
                                <option key={iconName} value={iconName}>
                                  {iconName}
                                </option>
                              ))}
                            </select>

                            <span className="text-[11px] font-mono text-slate-600 px-2 py-1 bg-white border border-slate-200 rounded-lg">
                              {count} Qs
                            </span>

                            <button
                              type="button"
                              onClick={() => handleDeleteSection(sec.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Pillar"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-slate-950 text-base">
                    {selectedSectionId === "all"
                      ? "All Diagnostic Questions"
                      : `Questions in ${sections.find((s) => s.id === selectedSectionId)?.name}`}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Total {questions.length} questions · Max {totalMaxScore} pts
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoCalibratePoints}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-sky-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    title="Auto-distribute 100 points across all questions: Option 1 = Max, Option 2 = Half floored, Last = 0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    <span>Auto-Calibrate 100 Pts</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddQuestion()}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Question</span>
                  </button>
                </div>
              </div>

              {/* Informative Scoring Rule Banner */}
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex items-start gap-2.5 text-xs text-sky-900 shadow-sm">
                <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-950">Global Question Point Formula:</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-sky-200 text-sky-700 font-bold">
                      100 pts ÷ {questions.length} total questions = ~{questions.length > 0 ? Math.floor(100 / questions.length) : 0} pts each
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Points are divided strictly across <strong>all {questions.length} questions from all pillars combined</strong> (not by individual pillar).
                    <br />
                    • <strong>Option 1 = Full Max pts</strong> ({questions.length > 0 ? Math.floor(100 / questions.length) : 0} pts)
                    &nbsp;• <strong>Option 2 = Half pts floored</strong> ({questions.length > 0 ? Math.floor(Math.floor(100 / questions.length) / 2) : 0} pts, e.g. 9→4, 10→5)
                    &nbsp;• <strong>Last Option = 0 pts (Deficit)</strong>
                  </p>
                </div>
              </div>

              {filteredQuestions.length === 0 ? (
                <div className="bg-white p-10 rounded-3xl text-center border border-slate-200/90 shadow-sm">
                  <p className="text-sm font-semibold text-slate-700">No questions in this section yet.</p>
                  <button
                    onClick={() => handleAddQuestion()}
                    className="mt-3 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm shadow-sky-600/25"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create First Question</span>
                  </button>
                </div>
              ) : (
                filteredQuestions.map((q, qIndex) => {
                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:border-sky-300 hover:shadow-md transition-all space-y-4"
                    >
                      {/* Question Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 font-black text-xs flex items-center justify-center">
                            {qIndex + 1}
                          </span>
                          <select
                            value={q.sectionId}
                            onChange={(e) => handleUpdateQuestion(q.id, { sectionId: e.target.value })}
                            className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1 text-slate-700 font-semibold focus:outline-none focus:border-sky-500"
                          >
                            {sections.map((s) => (
                              <option key={s.id} value={s.id}>
                                Pillar: {s.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors self-end sm:self-auto"
                          title="Delete Question"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      </div>

                      {/* Question Text & Description */}
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={q.text}
                          onChange={(e) => handleUpdateQuestion(q.id, { text: e.target.value })}
                          placeholder="Question Title (e.g., Google Business Profile Verification Status)"
                          className="w-full font-bold text-sm text-slate-900 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl focus:bg-white focus:border-sky-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={q.description || ""}
                          onChange={(e) => handleUpdateQuestion(q.id, { description: e.target.value })}
                          placeholder="Question Context / Description explaining why it matters to the respondent"
                          className="w-full text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl focus:bg-white focus:border-sky-500 focus:outline-none"
                        />
                      </div>

                      {/* Options List */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Answer Options & Diagnostic Hints
                          </span>
                          <button
                            onClick={() => handleAddOption(q.id)}
                            className="text-[11px] text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Option</span>
                          </button>
                        </div>

                        {q.options.map((opt, optIdx) => {
                          const isFirst = optIdx === 0;
                          const isLast = optIdx === q.options.length - 1;
                          const isSecond = optIdx === 1 && q.options.length >= 3;

                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-2xl border space-y-2 transition-all ${
                                isFirst
                                  ? "bg-sky-50/50 border-sky-200/80"
                                  : isLast
                                  ? "bg-rose-50/40 border-rose-200/70"
                                  : "bg-slate-50 border-slate-200"
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-xs font-mono font-bold text-slate-400 w-4">
                                    {String.fromCharCode(65 + optIdx)}.
                                  </span>
                                  <input
                                    type="text"
                                    value={opt.text}
                                    onChange={(e) =>
                                      handleUpdateOption(q.id, optIdx, { text: e.target.value })
                                    }
                                    placeholder="Option label..."
                                    className="flex-1 text-xs text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl focus:outline-none focus:border-sky-500"
                                  />
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-2 pl-6 sm:pl-0">
                                  {/* Point Role Badge */}
                                  {isFirst && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                                      Max Pts
                                    </span>
                                  )}
                                  {isSecond && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                      Half (Floor)
                                    </span>
                                  )}
                                  {isLast && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                                      0 pts (Deficit)
                                    </span>
                                  )}

                                  <div className="flex items-center gap-1 shrink-0">
                                    {isLast ? (
                                      <input
                                        type="number"
                                        value={0}
                                        disabled
                                        className="w-16 text-center text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed px-2 py-1.5 rounded-xl"
                                        title="Last option is always 0 points (critical gap/deficit)"
                                      />
                                    ) : (
                                      <input
                                        type="number"
                                        value={opt.points}
                                        onChange={(e) =>
                                          handleUpdateOption(q.id, optIdx, {
                                            points: parseInt(e.target.value, 10) || 0,
                                          })
                                        }
                                        className={`w-16 text-center text-xs font-bold bg-white border border-slate-200 px-2 py-1.5 rounded-xl focus:outline-none focus:border-sky-500 ${
                                          isFirst ? "text-sky-700 font-black" : "text-blue-700"
                                        }`}
                                        title={
                                          isFirst
                                            ? "Max Points for question (Option 2 will auto-half)"
                                            : "Points Awarded"
                                        }
                                      />
                                    )}
                                    <span className="text-[10px] font-mono text-slate-400">pts</span>
                                  </div>

                                  <button
                                    onClick={() => handleDeleteOption(q.id, optIdx)}
                                    disabled={q.options.length <= 2}
                                    className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
                                    title="Delete Option"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Hint Input */}
                              <div className="pl-6">
                                <input
                                  type="text"
                                  value={opt.hint || ""}
                                  onChange={(e) =>
                                    handleUpdateOption(q.id, optIdx, { hint: e.target.value })
                                  }
                                  placeholder="Diagnostic Advice Hint (appears on final report takeaways)..."
                                  className="w-full text-[11px] text-slate-500 italic bg-white border border-slate-200 px-2.5 py-1 rounded-xl focus:outline-none focus:border-sky-500"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SCORE BANDS & DIAGNOSIS */}
        {activeTab === "bands" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-black text-slate-950 text-base">
                Diagnostic Score Thresholds & Bands
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                These thresholds automatically classify the audited business score (0–100) and prescribe the tailored action sprint.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {scoreBands.map((band, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="font-bold text-xs text-sky-700 uppercase tracking-wider">
                      Band {idx + 1}: {band.minScore}–{band.maxScore} Points
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Band Title
                      </label>
                      <input
                        type="text"
                        value={band.title}
                        onChange={(e) => {
                          const updated = [...scoreBands];
                          updated[idx].title = e.target.value;
                          setScoreBands(updated);
                        }}
                        className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Recommended Action Sprint
                      </label>
                      <input
                        type="text"
                        value={band.sprintRecommendation}
                        onChange={(e) => {
                          const updated = [...scoreBands];
                          updated[idx].sprintRecommendation = e.target.value;
                          setScoreBands(updated);
                        }}
                        className="w-full text-xs font-bold text-sky-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Headline Diagnosis
                    </label>
                    <input
                      type="text"
                      value={band.headline}
                      onChange={(e) => {
                        const updated = [...scoreBands];
                        updated[idx].headline = e.target.value;
                        setScoreBands(updated);
                      }}
                      className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Detailed Executive Explanation
                    </label>
                    <textarea
                      rows={2}
                      value={band.description}
                      onChange={(e) => {
                        const updated = [...scoreBands];
                        updated[idx].description = e.target.value;
                        setScoreBands(updated);
                      }}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS & CTA */}
        {activeTab === "settings" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm max-w-2xl space-y-5">
            <div>
              <h3 className="font-black text-slate-950 text-base">Form Branding & WhatsApp CTA</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize how your agency appears on final diagnostic reports.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  URL Slug (Shareable Link)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">/audit/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder={generatedSlug}
                    className="flex-1 text-xs text-slate-900 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Business Category Focus
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Universal / Cafe / Clinic / Real Estate"
                  className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Agency / Brand Name
                </label>
                <input
                  type="text"
                  value={settings.companyName || ""}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  placeholder="Team TWS / Growth Studio"
                  className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Agency WhatsApp Number (for Report Dispatch)
                </label>
                <input
                  type="text"
                  value={settings.whatsappNumber || ""}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  placeholder="919876543210"
                  className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-sky-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  10 or 12 digit number with country code. Used for 1-click WhatsApp consulting CTAs.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Publish Status
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-0 bg-white border-slate-300"
                  />
                  <span className="text-xs text-slate-700 font-semibold">
                    Published (Auditees can access and submit via public link)
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
