export type ProfileTabId =
  | "all"
  | "personal"
  | "education"
  | "skills"
  | "projects"
  | "experience"
  | "certifications"
  | "preferences"
  | "resume"
  | "targetRoles";

export interface AiRecommendationFeederInfo {
  mentorGrounded: {
    fidelityScore: number;
    lastSynced: string;
    description: string;
    activeSignals: string[];
  };
  jobTracker: {
    matchAccuracy: number;
    recommendedJobsCount: number;
    topAlignedRole: string;
    description: string;
  };
  roadmap: {
    calibratedMilestone: string;
    curriculumAlignment: number;
    description: string;
  };
  dsaTrainer: {
    difficultyTarget: string;
    priorityTopic: string;
    description: string;
  };
  resumeAts: {
    currentScore: number;
    targetBenchmark: number;
    description: string;
  };
}

export interface TargetRoleDetail {
  id: string;
  title: string;
  category: string;
  matchPercentage: number;
  isPrimary: boolean;
  marketDemand: "High" | "Very High" | "Emerging";
  salaryRange: string;
  matchingSkills: string[];
  missingSkills: string[];
  recommendedAction: string;
}

export interface ProfileCompletenessPillar {
  label: string;
  percentage: number;
  status: "complete" | "strong" | "needs_attention";
  fieldCount: string;
}
