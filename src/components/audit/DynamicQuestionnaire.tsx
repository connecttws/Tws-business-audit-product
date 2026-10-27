"use client";

import React from "react";
import {
  SectionItem,
  QuestionItem,
  AnswerOption,
} from "@/types/form";
import {
  MapPin,
  Camera,
  Globe,
  Target,
  Zap,
  Sparkles,
  Layers,
  Check,
  AlertCircle,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";

interface DynamicQuestionnaireProps {
  sections: SectionItem[];
  questions: QuestionItem[];
  answers: Record<string, number>;
  onAnswer: (questionId: string, optionIndex: number) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  MapPin,
  Camera,
  Globe,
  Target,
  Zap,
  Sparkles,
  Layers,
};

export function DynamicQuestionnaire({
  sections,
  questions,
  answers,
  onAnswer,
}: DynamicQuestionnaireProps) {
  let globalQuestionCounter = 1;
  const totalQuestions = questions.length;

  return (
    <div className="space-y-10">
      {sections.map((section, sIdx) => {
        const secQuestions = questions.filter((q) => q.sectionId === section.id);
        if (secQuestions.length === 0) return null;

        const SectionIcon = ICON_MAP[section.icon || "Layers"] || Layers;

        const secMax = secQuestions.reduce((sum, q) => {
          const maxOpt = Math.max(...(q.options?.map((o) => Number(o.points) || 0) || [0]), 0);
          return sum + maxOpt;
        }, 0);

        return (
          <div key={section.id} className="space-y-5">
            {/* High-Contrast Pillar Section Hero Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-md flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                  <SectionIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-sky-400 block">
                    Pillar 0{sIdx + 1} · {secQuestions.length} Checkpoints
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight truncate">
                    {section.name}
                  </h2>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-slate-900 bg-white px-3 py-1.5 rounded-xl shrink-0 shadow-sm">
                {secMax} Pts Max
              </span>
            </div>

            {/* Questions in this Section */}
            <div className="space-y-5">
              {secQuestions.map((question) => {
                const qNum = globalQuestionCounter++;
                const chosenOptIndex = answers[question.id];
                const isAnswered = chosenOptIndex !== undefined;
                const maxOptPts = Math.max(...(question.options?.map((o) => Number(o.points) || 0) || [0]), 0);

                return (
                  <article
                    key={question.id}
                    id={`question-${qNum}`}
                    className={`bg-white rounded-3xl border-2 transition-all p-5 sm:p-7 shadow-[0_6px_20px_rgba(15,23,42,0.06)] space-y-4 ${
                      isAnswered
                        ? "border-sky-400 ring-2 ring-sky-100"
                        : "border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    {/* Top Meta Line: Question Number & Points Status */}
                    <div className="flex items-center justify-between gap-2 border-b-2 border-slate-100 pb-3">
                      <span className="text-xs font-mono font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-slate-900 text-white shadow-xs">
                        Question {qNum < 10 ? `0${qNum}` : qNum} of {totalQuestions}
                      </span>

                      <div className="shrink-0 text-right">
                        {isAnswered ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300 shadow-xs">
                            <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3.5]" />
                            <span>Awarded: +{question.options[chosenOptIndex].points} pts</span>
                          </span>
                        ) : (
                          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                            Weight: {maxOptPts} pts max
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Title */}
                    <h3 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight leading-snug font-sans">
                      {question.text}
                    </h3>

                    {/* Context / Why this matters callout */}
                    {question.description && (
                      <div className="bg-slate-50 border-l-4 border-sky-500 pl-3.5 pr-3 py-2 rounded-r-xl">
                        <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-medium">
                          {question.description}
                        </p>
                      </div>
                    )}

                    {/* Options List */}
                    <div className="space-y-3 pt-1">
                      {question.options.map((option, optIdx) => {
                        const isSelected = chosenOptIndex === optIdx;
                        const isMax = Number(option.points) === maxOptPts && maxOptPts > 0;
                        const isZero = Number(option.points) === 0;
                        const letter = String.fromCharCode(65 + optIdx);

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => {
                              onAnswer(question.id, optIdx);
                            }}
                            className={`w-full p-4 rounded-2xl border-2 text-left flex items-start gap-3.5 transition-all duration-150 cursor-pointer ${
                              isSelected
                                ? "bg-sky-50 border-sky-600 shadow-md ring-2 ring-sky-500/25"
                                : "bg-slate-50/80 hover:bg-white border-slate-200 hover:border-slate-300 text-slate-900"
                            }`}
                          >
                            {/* Option Letter Indicator */}
                            <div
                              className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                                isSelected
                                  ? "bg-sky-600 text-white shadow-xs"
                                  : "bg-white border-2 border-slate-300 text-slate-700"
                              }`}
                            >
                              {isSelected ? (
                                <Check className="w-4 h-4 text-white stroke-[3.5]" />
                              ) : (
                                <span>{letter}</span>
                              )}
                            </div>

                            {/* Option Content & Point Pill */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`text-sm sm:text-base leading-snug ${isSelected ? "font-black text-slate-950" : "font-bold text-slate-800"}`}>
                                  {option.text}
                                </span>

                                <span
                                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md shrink-0 shadow-xs ${
                                    isSelected
                                      ? "bg-sky-600 text-white font-black"
                                      : isMax
                                      ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                      : isZero
                                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                                      : "bg-white border border-slate-300 text-slate-700"
                                  }`}
                                >
                                  +{option.points} pts
                                </span>
                              </div>

                              {/* Diagnostic Hint */}
                              {option.hint && (
                                <div className={`mt-2 p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 ${
                                  isSelected
                                    ? "bg-sky-100/90 text-sky-950 border border-sky-300 font-semibold"
                                    : "bg-white border border-slate-200 text-slate-600"
                                }`}>
                                  <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                  <span>{option.hint}</span>
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
