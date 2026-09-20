export type LearningDifficulty = "Beginner" | "Intermediate" | "Advanced";

export type LearningResourceType =
  | "video"
  | "interactive_doc"
  | "cheatsheet"
  | "sandbox"
  | "github";

export interface LearningResource {
  id: string;
  title: string;
  type: LearningResourceType;
  durationOrPages: string;
  url?: string;
  provider?: string;
}

export interface InteractiveCheck {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  hint: string;
}

export interface CodeSnippet {
  language: string;
  title: string;
  code: string;
  explanation: string;
}

export interface LearningLesson {
  id: string;
  title: string;
  durationMinutes: number;
  summary: string;
  contentMarkdown: string;
  codeSnippet?: CodeSnippet;
  keyTakeaways: string[];
  conceptCheck?: InteractiveCheck;
}

export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface LearningItem {
  id: string;
  topic: string;
  category: "Programming" | "Database" | "AI/ML" | "Algorithms" | "Systems";
  careerGoalAlignment: string;
  skillGapAddressed: string;
  difficulty: LearningDifficulty;
  estimatedTime: string;
  resources: LearningResource[];
  progress: number; // 0 - 100
  isCompleted: boolean;
  lessons: LearningLesson[];
  quiz: QuizQuestion[];
  nextRecommendedTopicId: string;
  nextRecommendationReason: string;
}

export interface QuizEvaluationResult {
  score: number; // 0 - 100
  correctCount: number;
  totalCount: number;
  passed: boolean;
  feedback: string;
  strengths: string[];
  reviewTopics: string[];
  progressBoost: number;
  nextRecommendation: {
    topicId: string;
    topicTitle: string;
    reason: string;
  };
}

export interface LearningEngineStats {
  careerGoal: string;
  targetRole: string;
  hoursInvested: number;
  completedModulesCount: number;
  totalModulesCount: number;
  overallProgressPercentage: number;
  topSkillGaps: {
    skill: string;
    currentScore: number;
    targetScore: number;
    urgency: "high" | "medium";
  }[];
  activeRecommendationHeadline: string;
  activeRecommendationReason: string;
}
