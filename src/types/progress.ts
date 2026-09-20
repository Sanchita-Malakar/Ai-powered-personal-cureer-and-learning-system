export interface CareerProgressStats {
  overallReadiness: number;
  readinessDelta30Days: number;
  qualificationCutoff: number;
  roadmapCompletionPercentage: number;
  completedMilestones: number;
  totalMilestones: number;
  activeMilestoneTitle: string;
}

export interface SkillTrajectoryPoint {
  month: string;
  Python: number;
  DSA: number;
  SQL: number;
  AIML: number;
}

export interface SkillProgressItem {
  skill: string;
  category: string;
  currentScore: number;
  previousScore: number;
  deltaPercentage: number;
  level: "Strong" | "Intermediate" | "Focus Area" | "Beginner";
  highlight?: string;
}

export interface LearningProgressStats {
  activeCourses: number;
  completedCourses: number;
  topicsCompleted: number;
  totalTopics: number;
  testsTaken: number;
  avgTestScore: number;
  learningHours: number;
}

export interface InterviewProgressStats {
  mockInterviewsTaken: number;
  latestScore: number;
  avgScore30Days: number;
  technicalScore: number;
  behavioralScore: number;
  weakAreas: string[];
  recentSessions: {
    id: string;
    topic: string;
    score: number;
    date: string;
  }[];
}

export interface JobProgressStats {
  applicationsCount: number;
  oaCount: number;
  interviewsCount: number;
  offersCount: number;
  responseRatePercentage: number;
  topStages: {
    company: string;
    role: string;
    stage: string;
    matchPercentage: number;
  }[];
}

export interface AiTrendInsight {
  id: string;
  type: "positive" | "attention" | "strategic";
  headline: string;
  quote: string;
  detailedAnalysis: string;
  recommendedAction: {
    label: string;
    section: "roadmap" | "dsa" | "interview" | "learning" | "jobs" | "resume";
    paramId?: string;
  };
}

export interface ProgressPageData {
  career: CareerProgressStats;
  skills: SkillProgressItem[];
  skillTrajectory: SkillTrajectoryPoint[];
  learning: LearningProgressStats;
  interview: InterviewProgressStats;
  jobs: JobProgressStats;
  aiTrends: AiTrendInsight[];
}
