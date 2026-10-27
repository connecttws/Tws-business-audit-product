export interface AnswerOption {
  text: string;
  points: number;
  hint?: string; // Actionable advice that appears on the final diagnostic report
}

export interface QuestionItem {
  id: string;
  sectionId: string;
  text: string;
  description?: string;
  options: AnswerOption[];
}

export interface SectionItem {
  id: string;
  name: string;
  icon: string; // e.g. "MapPin", "Camera", "Globe", "Target", "Zap", "Sparkles"
  maxPoints: number;
}

export interface ScoreBandItem {
  title: string;
  minScore: number;
  maxScore: number;
  headline: string;
  description: string;
  sprintRecommendation: string;
}

export interface FormSettings {
  whatsappNumber?: string;
  companyName?: string;
  customCtaMessage?: string;
}

export interface AuditFormData {
  id?: string;
  userId?: string;
  title: string;
  slug: string;
  description?: string;
  category: string;
  themeColor: string;
  isPublished: boolean;
  sections: SectionItem[];
  questions: QuestionItem[];
  scoreBands: ScoreBandItem[];
  settings?: FormSettings;
  totalMaxScore?: number;
  submissionCount?: number;
  viewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
