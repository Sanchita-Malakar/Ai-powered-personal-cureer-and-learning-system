export type DsaCategory =
  | "Arrays"
  | "Strings"
  | "Linked Lists"
  | "Stack"
  | "Queue"
  | "Trees"
  | "Graphs"
  | "Dynamic Programming"
  | "Algorithms";

export type DsaDifficulty = "Easy" | "Medium" | "Hard";

export type SupportedLanguage = "python" | "javascript" | "cpp" | "java";

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface DsaProblem {
  id: string;
  title: string;
  category: DsaCategory;
  difficulty: DsaDifficulty;
  acceptanceRate: string;
  companies: string[];
  problemStatement: string;
  examples: ProblemExample[];
  constraints: string[];
  starterCode: Record<SupportedLanguage, string>;
  solutionCode: Record<SupportedLanguage, string>;
  testCases: TestCase[];
  hints: string[];
  optimalApproach: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface TestCaseResult {
  testCaseId: string;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  runtimeMs?: number;
}

export interface SubmissionResult {
  status: "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error";
  passedCount: number;
  totalCount: number;
  runtimeMs: number;
  runtimePercentile: number;
  memoryMb: number;
  memoryPercentile: number;
  testCaseResults: TestCaseResult[];
  submittedAt: string;
  feedback: string;
}

export interface TopicMastery {
  category: DsaCategory;
  solvedCount: number;
  totalCount: number;
  accuracy: number; // 0 - 100 percentage e.g. Arrays 85%, Strings 72%, Trees 43%
  avgTimeMinutes: number;
  attemptsCount: number;
  status: "Mastered" | "Intermediate" | "Weak Area";
}

export interface DsaUserStats {
  totalSolved: number;
  totalAttempts: number;
  overallAccuracy: number;
  totalTimeSpentMinutes: number;
  difficultyCounts: {
    easy: number;
    medium: number;
    hard: number;
  };
  topicMastery: Record<DsaCategory, TopicMastery>;
  weakAreas: DsaCategory[];
  aiRecommendation: string;
  prerequisiteReasoning: string;
  recommendedProblemId: string;
}
