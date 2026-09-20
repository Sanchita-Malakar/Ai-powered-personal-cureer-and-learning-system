export interface MentorAction {
  id: string;
  label: string;
  section: "jobs" | "resume" | "learning" | "dsa" | "interview" | "roadmap";
  paramId?: string;
  badgeText?: string;
}

export interface ReferencedContext {
  readinessPercentage?: number;
  atsScore?: number;
  targetRole?: string;
  topSkillGaps?: string[];
  activeJobMatches?: { company: string; match: string }[];
  weakDsaArea?: string;
  roadmapMilestone?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  timestamp: string;
  contentMarkdown: string;
  quickActions?: MentorAction[];
  referencedContext?: ReferencedContext;
}

export interface PromptPreset {
  id: string;
  query: string;
  category: "Jobs" | "Resume" | "Learning" | "Readiness" | "DSA" | "Interview";
  description: string;
}

export interface StudentGroundedContext {
  name: string;
  targetRole: string;
  overallReadiness: number;
  profileCompletion: number;
  college: string;
  cgpa: number;
  skills: {
    name: string;
    level: string;
    score: number;
  }[];
  atsResumeScore: number;
  resumeWeaknesses: string[];
  dsaWeakArea: string;
  dsaAccuracy: number;
  activeApplicationsCount: number;
  topJobOpportunities: {
    company: string;
    role: string;
    matchPercentage: number;
    status: string;
  }[];
  roadmapCurrentMilestone: string;
}
