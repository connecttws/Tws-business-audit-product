import { SectionItem, QuestionItem, ScoreBandItem, AuditFormData } from "@/types/form";

export const DEFAULT_TWS_SECTIONS: SectionItem[] = [
  {
    id: "maps",
    name: "Google Maps & Local Search",
    icon: "MapPin",
    maxPoints: 28,
  },
  {
    id: "visuals",
    name: "Visual Trust & Content Shoots",
    icon: "Camera",
    maxPoints: 18,
  },
  {
    id: "web",
    name: "Web & Lead Funnel",
    icon: "Globe",
    maxPoints: 18,
  },
  {
    id: "ads",
    name: "Paid Ads & Market Positioning",
    icon: "Target",
    maxPoints: 18,
  },
  {
    id: "speed",
    name: "Speed-to-Lead & Retention",
    icon: "Zap",
    maxPoints: 18,
  },
];

export const DEFAULT_TWS_QUESTIONS: QuestionItem[] = [
  // Total 16 questions across all pillars: 100 / 16 => 4 questions @ 7 pts, 12 questions @ 6 pts = 100 pts
  // 1. Maps & Local Search (4 questions @ 7 pts = 28 pts)
  {
    id: "q1",
    sectionId: "maps",
    text: "Google Business Profile (GBP) status",
    description: "Is the official Google Maps profile claimed, phone/address verified, and kept up-to-date?",
    options: [
      { text: "Claimed & Verified with complete hours & photos", points: 7, hint: "Fully optimized profile helps rank in local map packs" },
      { text: "Incomplete / Outdated info or photos", points: 3, hint: "Missing crucial business details leads to customer drop-off" },
      { text: "Unclaimed / Profile not found on Maps", points: 0, hint: "Critical gap: nearby customers cannot easily locate the business" },
    ],
  },
  {
    id: "q2",
    sectionId: "maps",
    text: "Review count and rating volume",
    description: "How many authentic customer reviews does the business have, and is the rating above 4.2 stars?",
    options: [
      { text: "50+ reviews with strong 4.2★+ rating", points: 7, hint: "Strong social proof builds immediate trust" },
      { text: "20–50 reviews or rating between 3.8★–4.2★", points: 3, hint: "Moderate proof, but easily outranked by top competitors" },
      { text: "Fewer than 20 reviews or rating under 3.8★", points: 0, hint: "Severe credibility gap; customer hesitation is high" },
    ],
  },
  {
    id: "q3",
    sectionId: "maps",
    text: "Owner review response consistency",
    description: "Does the management respond to reviews (both positive & negative) within 48 hours?",
    options: [
      { text: "Replies to all reviews consistently within 48h", points: 7, hint: "Active engagement signals attentive customer service to Google algorithms" },
      { text: "Occasional replies / only responds to complaints", points: 3, hint: "Inconsistent engagement lowers local search ranking momentum" },
      { text: "Never replies to reviews", points: 0, hint: "Missed opportunity to demonstrate active hospitality and care" },
    ],
  },
  {
    id: "q4",
    sectionId: "maps",
    text: "Local 3-Pack Map ranking",
    description: "When searching category keywords nearby (e.g. 'best cafe near me'), does the business show in the Top 3?",
    options: [
      { text: "Ranks in Top 3 Local Map Pack for core keywords", points: 7, hint: "Captures 70%+ of high-intent local search clicks" },
      { text: "Ranks between positions 4–10 (requires clicking 'More Places')", points: 3, hint: "Visible but losing majority of high-converting traffic" },
      { text: "Page 2 or below / Not ranking for relevant queries", points: 0, hint: "Practically invisible to local searchers searching for solutions" },
    ],
  },

  // 2. Visual Trust & Content Shoots (3 questions @ 6 pts = 18 pts)
  {
    id: "q5",
    sectionId: "visuals",
    text: "Photography quality, lighting & ambience",
    description: "Are photos on Google Maps, Instagram, and web professional, high-res, and appetizing/appealing?",
    options: [
      { text: "Studio-grade photography with vibrant lighting & aesthetics", points: 6, hint: "Exceptional visual appetite appeal and instant premium perception" },
      { text: "Staff mobile phone photos with mixed lighting", points: 3, hint: "Passable but fails to wow new customers or convey premium value" },
      { text: "Dull, blurry, dark or very limited photos", points: 0, hint: "Customers judge business quality primarily on visual presentation" },
    ],
  },
  {
    id: "q6",
    sectionId: "visuals",
    text: "Reels & short-form video consistency",
    description: "Does the business publish engaging short-form video content showing ambience, menu, or behind-the-scenes?",
    options: [
      { text: "3+ reels per week with good hook & audio", points: 6, hint: "Regular viral discovery in the local community feed" },
      { text: "1–2 videos per month sporadically", points: 3, hint: "Irregular activity fails to build algorithm momentum" },
      { text: "No video content published", points: 0, hint: "Missing the highest-reach digital acquisition channel today" },
    ],
  },
  {
    id: "q7",
    sectionId: "visuals",
    text: "Visual identity and aesthetic cohesion",
    description: "Is the logo, color palette, typography, and menu design consistent and distinctly branded?",
    options: [
      { text: "Cohesive, modern, and memorable brand identity", points: 6, hint: "Builds long-term brand recall and allows charging premium prices" },
      { text: "Disjointed, outdated or cluttered aesthetic", points: 0, hint: "Dilutes brand value and feels generic against competitors" },
    ],
  },

  // 3. Web & Lead Funnel (3 questions @ 6 pts = 18 pts)
  {
    id: "q8",
    sectionId: "web",
    text: "Mobile landing page experience & speed",
    description: "Does the business have a mobile-first page that loads in under 2 seconds with a clear call-to-action?",
    options: [
      { text: "Fast mobile page (<2s) with clear primary CTA", points: 6, hint: "Seamless customer conversion with zero friction" },
      { text: "Slow, clunky, or desktop-focused website", points: 3, hint: "High bounce rate; up to 50% of visitors abandon slow pages" },
      { text: "No dedicated website or landing page", points: 0, hint: "100% reliance on third-party aggregators or direct walk-ins" },
    ],
  },
  {
    id: "q9",
    sectionId: "web",
    text: "One-tap direct WhatsApp booking/inquiry flow",
    description: "Can a mobile visitor initiate a WhatsApp chat with a prefilled greeting in one tap?",
    options: [
      { text: "Direct 1-tap WhatsApp button with prefilled message", points: 6, hint: "Highest converting channel in local commerce" },
      { text: "Plain phone number displayed (requires manually dialing)", points: 3, hint: "Adds friction; mobile users drop off" },
      { text: "No WhatsApp link or chat options available", points: 0, hint: "Major obstacle for spontaneous client inquiries" },
    ],
  },
  {
    id: "q10",
    sectionId: "web",
    text: "Menu / pricing / service catalogue accessibility",
    description: "Can visitors instantly view prices, services, or food menu on mobile without downloading heavy PDFs?",
    options: [
      { text: "Instant, responsive, mobile-friendly digital menu/catalogue", points: 6, hint: "Instant gratification speeds up buying decisions" },
      { text: "Heavy PDF download or must call to inquire about pricing", points: 0, hint: "Customers abandon rather than downloading cumbersome PDFs" },
    ],
  },

  // 4. Paid Ads & Market Positioning (3 questions @ 6 pts = 18 pts)
  {
    id: "q11",
    sectionId: "ads",
    text: "Targeted hyperlocal radius advertising (3–5 km)",
    description: "Are Meta (Instagram/Facebook) or Google radius campaigns actively running to nearby residents?",
    options: [
      { text: "Active, targeted radius campaigns running consistently", points: 6, hint: "Predictable customer flow and constant local mindshare" },
      { text: "Occasional boosted posts without structured targeting", points: 3, hint: "Wasted ad budget without conversion optimization" },
      { text: "No active paid ads running", points: 0, hint: "Completely dependent on passive organic foot-traffic" },
    ],
  },
  {
    id: "q12",
    sectionId: "ads",
    text: "Offer & promotion clarity with tracking",
    description: "Does the business promote a compelling hook/offer (e.g., first visit discount, package deal) with tracking?",
    options: [
      { text: "Irresistible offer with tracked WhatsApp/coupon codes", points: 6, hint: "Clear ROI measurement on marketing spend" },
      { text: "Generic offer without clear tracking or urgency", points: 3, hint: "Leaves money on the table; hard to measure what converts" },
      { text: "No clear promotion or offer", points: 0, hint: "Zero incentive for fence-sitters to choose you over a competitor" },
    ],
  },
  {
    id: "q13",
    sectionId: "ads",
    text: "Competitor differentiation & signature USP",
    description: "Does the business clearly stand out with a signature hook, atmosphere, or unique value proposition?",
    options: [
      { text: "Distinct positioning & clear signature identity", points: 6, hint: "Customers know exactly why to choose this brand" },
      { text: "Similar to nearby competitors with no distinct hook", points: 0, hint: "Forced to compete purely on price and convenience" },
    ],
  },

  // 5. Speed-to-Lead & Retention (3 questions @ 6 pts = 18 pts)
  {
    id: "q14",
    sectionId: "speed",
    text: "First response time to new customer inquiries",
    description: "How quickly does the team answer an online message, DM, or web inquiry?",
    options: [
      { text: "Under 5 minutes (automated greeting + rapid human reply)", points: 6, hint: "78% of leads buy from the business that responds first" },
      { text: "Within 30–60 minutes during business hours", points: 3, hint: "Lead starts cooling down and contacting nearby rivals" },
      { text: "Over 1 hour, next day, or often missed completely", points: 0, hint: "Catastrophic revenue leak: high-intent customers go elsewhere" },
    ],
  },
  {
    id: "q15",
    sectionId: "speed",
    text: "Structured lead follow-up & CRM tracking",
    description: "Is there a systematic process to follow up with inquiries who did not immediately book or buy?",
    options: [
      { text: "Consistent follow-up sequence via WhatsApp/CRM", points: 6, hint: "Recovers 20–35% of indecisive prospective customers" },
      { text: "Ad-hoc manual follow-ups when staff has free time", points: 3, hint: "Leads slip through the cracks without accountability" },
      { text: "Zero follow-up system (one inquiry, then forgotten)", points: 0, hint: "Huge marketing waste; acquiring new leads without maximizing them" },
    ],
  },
  {
    id: "q16",
    sectionId: "speed",
    text: "Repeat customer & retention re-engagement",
    description: "Does the business have a customer database for festival broadcasts, VIP loyalty, or win-back campaigns?",
    options: [
      { text: "Active database with regular segmented re-engagement", points: 6, hint: "Drives high lifetime value (LTV) at zero customer acquisition cost" },
      { text: "No defined retention process or customer list", points: 0, hint: "Constantly paying to re-acquire customers who have already visited" },
    ],
  },
];

export const DEFAULT_TWS_SCORE_BANDS: ScoreBandItem[] = [
  {
    title: "High Leakage",
    minScore: 0,
    maxScore: 39,
    headline: "Critical Revenue Leakage & Low Online Visibility",
    description: "Significant digital touchpoints are disconnected. Prospective customers in your immediate locality are choosing competitors simply because your digital presence has major discovery and conversion friction.",
    sprintRecommendation: "TWS Local Turnaround Sprint",
  },
  {
    title: "Growth Opportunity",
    minScore: 40,
    maxScore: 69,
    headline: "Solid Foundation With Major Conversion Gaps",
    description: "Your business has baseline visibility, but high-intent inquiries are slipping through the cracks due to slow response times, missing mobile funnels, and inconsistent visual storytelling.",
    sprintRecommendation: "TWS Foundation Sprint",
  },
  {
    title: "Strong Foundation",
    minScore: 70,
    maxScore: 89,
    headline: "High Performing Presence Ready For Scaling",
    description: "You outperform most local competitors in visibility and trust. Fine-tuning paid radius campaigns and customer retention workflows will unlock immediate incremental margin.",
    sprintRecommendation: "TWS Scale & Domination Sprint",
  },
  {
    title: "Optimized Leader",
    minScore: 90,
    maxScore: 100,
    headline: "Category Leader & Market Dominator",
    description: "Your digital presence operates as a well-oiled customer acquisition engine. Maintain review velocity, experiment with brand storytelling, and protect your top market positioning.",
    sprintRecommendation: "TWS Retention & VIP Retainer",
  },
];

export const DEFAULT_TEMPLATE: Omit<AuditFormData, "id" | "userId"> = {
  title: "TWS Local Business Digital Health Audit",
  slug: "tws-local-business-audit",
  description: "Comprehensive 5-pillar digital diagnostic assessing Google Maps rank, visual appetite appeal, speed-to-lead, and local paid marketing.",
  category: "Universal / Local Business",
  themeColor: "indigo",
  isPublished: true,
  sections: DEFAULT_TWS_SECTIONS,
  questions: DEFAULT_TWS_QUESTIONS,
  scoreBands: DEFAULT_TWS_SCORE_BANDS,
  settings: {
    companyName: "Team TWS",
    whatsappNumber: "919999999999",
    customCtaMessage: "Hi, I just reviewed my business digital audit report and would like to schedule a growth consultation.",
  },
  totalMaxScore: 100,
};
