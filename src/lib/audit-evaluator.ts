import { AuditFormData, SectionItem, QuestionItem, ScoreBandItem } from "@/types/form";

export interface BusinessDetails {
  name: string;
  clientName?: string;
  category: string;
  locality: string;
  phone?: string;
  whatsappNumber?: string;
  mapsUrl?: string;
  auditorName?: string;
}

export interface SectionScoreResult {
  id: string;
  name: string;
  icon: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface AuditFindingResult {
  questionText: string;
  chosenOptionText: string;
  pointsAwarded: number;
  maxPoints: number;
  sectionName: string;
  hint?: string;
}

export interface EvaluatedAuditResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  band: ScoreBandItem;
  sectionScores: SectionScoreResult[];
  findings: AuditFindingResult[];
}

/**
 * Evaluates audit answers against a dynamic form template
 */
export function evaluateDynamicAudit(
  form: {
    sections: SectionItem[];
    questions: QuestionItem[];
    scoreBands?: ScoreBandItem[];
    totalMaxScore?: number;
  },
  answers: Record<string, number>
): EvaluatedAuditResult {
  const sections = form.sections || [];
  const questions = form.questions || [];
  const scoreBands = form.scoreBands || [];

  let overallTotalScore = 0;
  let overallMaxScore = 0;

  // 1. Calculate section scores
  const sectionScores: SectionScoreResult[] = sections.map((sec) => {
    let secScore = 0;
    let secMax = 0;

    const secQuestions = questions.filter((q) => q.sectionId === sec.id);

    secQuestions.forEach((q) => {
      const maxOpt = Math.max(...(q.options?.map((o) => Number(o.points) || 0) || [0]), 0);
      secMax += maxOpt;

      const chosenIdx = answers[q.id];
      if (chosenIdx !== undefined && q.options?.[chosenIdx]) {
        secScore += Number(q.options[chosenIdx].points) || 0;
      }
    });

    overallTotalScore += secScore;
    overallMaxScore += secMax;

    return {
      id: sec.id,
      name: sec.name,
      icon: sec.icon || "Layers",
      score: secScore,
      maxScore: secMax || sec.maxPoints || 20,
      percentage: secMax > 0 ? Math.round((secScore / secMax) * 100) : 0,
    };
  });

  if (overallMaxScore <= 0) {
    overallMaxScore = form.totalMaxScore || 100;
  }

  const percentage = Math.round((overallTotalScore / overallMaxScore) * 100);

  // 2. Determine matched score band
  let matchedBand: ScoreBandItem | null = null;
  if (scoreBands.length > 0) {
    matchedBand =
      scoreBands.find(
        (b) => overallTotalScore >= b.minScore && overallTotalScore <= b.maxScore
      ) || null;
  }

  if (!matchedBand) {
    if (percentage < 40) {
      matchedBand = {
        title: "High Leakage",
        minScore: 0,
        maxScore: 39,
        headline: "Critical Revenue Leakage & Low Online Visibility",
        description: "Significant digital touchpoints are disconnected. Prospective customers in your immediate locality are choosing competitors.",
        sprintRecommendation: "Turnaround Sprint",
      };
    } else if (percentage < 70) {
      matchedBand = {
        title: "Growth Opportunity",
        minScore: 40,
        maxScore: 69,
        headline: "Solid Foundation With Major Conversion Gaps",
        description: "Your business has baseline visibility, but high-intent inquiries are slipping through due to conversion friction.",
        sprintRecommendation: "Foundation Sprint",
      };
    } else if (percentage < 90) {
      matchedBand = {
        title: "Strong Foundation",
        minScore: 70,
        maxScore: 89,
        headline: "High Performing Presence Ready For Scaling",
        description: "You outperform most local competitors in visibility and trust. Fine-tuning conversion funnels will unlock immediate growth.",
        sprintRecommendation: "Scale & Domination Sprint",
      };
    } else {
      matchedBand = {
        title: "Optimized Leader",
        minScore: 90,
        maxScore: 100,
        headline: "Category Leader & Market Dominator",
        description: "Your digital presence operates as a high-performing acquisition engine.",
        sprintRecommendation: "Retention & VIP Retainer",
      };
    }
  }

  // 3. Compile itemized findings with explanatory hints
  const findings: AuditFindingResult[] = questions.map((q) => {
    const sec = sections.find((s) => s.id === q.sectionId);
    const chosenIdx = answers[q.id];
    const chosenOpt = chosenIdx !== undefined ? q.options?.[chosenIdx] : null;
    const maxOpt = Math.max(...(q.options?.map((o) => Number(o.points) || 0) || [0]), 0);

    return {
      questionText: q.text,
      chosenOptionText: chosenOpt ? chosenOpt.text : "Not answered / Skipped",
      pointsAwarded: chosenOpt ? Number(chosenOpt.points) || 0 : 0,
      maxPoints: maxOpt,
      sectionName: sec?.name || "General",
      hint: chosenOpt?.hint,
    };
  });

  return {
    totalScore: overallTotalScore,
    maxScore: overallMaxScore,
    percentage,
    band: matchedBand,
    sectionScores,
    findings,
  };
}
