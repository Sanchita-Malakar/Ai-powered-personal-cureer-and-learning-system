export type InterviewCategory = "technical" | "behavioral";
export type TechnicalTopic = "python" | "dsa" | "dbms" | "ml";
export type BehavioralTopic = "intro" | "strengths_weaknesses" | "leadership" | "conflict";
export type InterviewDifficulty = "easy" | "medium" | "hard";

export interface EvaluationDimensions {
  accuracy: number; // 0 - 100
  relevance: number;
  clarity: number;
  structure: number;
  confidence: number;
  technicalDepth: number;
}

export interface QuestionEvaluation {
  dimensions: EvaluationDimensions;
  overallScore: number;
  feedback: string;
  strongPoints: string[];
  improvementPoints: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  topic: TechnicalTopic | BehavioralTopic;
  category: InterviewCategory;
  difficulty: InterviewDifficulty;
  contextHint?: string;
  modelAnswer: string;
  keyCriteria: string[];
  studentAnswer?: string;
  evaluation?: QuestionEvaluation;
}

export interface InterviewConfig {
  targetRole: string;
  companyType: string;
  difficulty: InterviewDifficulty;
  category: InterviewCategory;
  topic: TechnicalTopic | BehavioralTopic;
  questionCount: number;
}

export interface InterviewReportData {
  sessionId: string;
  completedAt: string;
  targetRole: string;
  companyType: string;
  category: InterviewCategory;
  topic: string;
  difficulty: InterviewDifficulty;
  overallScore: number;
  dimensionAverages: EvaluationDimensions;
  strongAreas: string[];
  weakAreas: string[];
  questionsAnswered: InterviewQuestion[];
  weakestQuestion: InterviewQuestion;
  improvementSuggestions: string[];
  progressBoost: number;
}
