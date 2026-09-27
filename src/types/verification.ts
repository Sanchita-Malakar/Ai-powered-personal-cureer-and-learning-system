export type VerificationStatus =
  | "NOT_VERIFIED"
  | "AWAITING_PERMISSION"
  | "AUTHENTICATING"
  | "QUEUED"
  | "CONNECTING"
  | "FETCHING_REPOSITORY"
  | "ANALYZING"
  | "ANALYZING_STRUCTURE"
  | "ANALYZING_CODE"
  | "ANALYZING_AI"
  | "AI_ANALYSIS"
  | "SCORING"
  | "VERIFIED"
  | "COMPLETED"
  | "FAILED"
  | "REVOKED"
  | "REQUIRES_REAUTHORIZATION";

export type ProficiencyLevel =
  | "Exposure"
  | "Beginner"
  | "Developing"
  | "Intermediate"
  | "Advanced"
  | "Highly Proficient";

export interface ProjectMetrics {
  technologyDepth: number; // 0-100
  architectureQuality: number; // 0-100
  implementationComplexity: number; // 0-100
  engineeringPractices: number; // 0-100
  testingPractices: number; // 0-100
  documentationPractices: number; // 0-100
  codebaseSizeScore: number; // 0-100
}

export interface DetectedTechnology {
  name: string;
  category: "Language" | "Framework" | "Database" | "DevOps" | "Library" | "Testing";
  score: number; // 0-100
  filesCount: number;
  signals: string[];
}

export interface AiAnalysisSummary {
  architecturalPattern: string;
  codeQualityTier: "Production-ready" | "Substantial Prototype" | "Learning / Tutorial" | "Minimal / Incomplete";
  keyHighlights: string[];
  engineeringStrengths: string[];
  recommendations: string[];
}

export interface SkillImpact {
  skillName: string;
  previousPercentage: number;
  newPercentage: number;
  previousLevel: ProficiencyLevel;
  newLevel: ProficiencyLevel;
  changeReason: string;
}

export interface ProjectVerificationReport {
  id: string;
  projectId: string;
  userId?: string;
  repoOwner: string;
  repoName: string;
  commitSha?: string;
  analysisVersion: string;
  overallScore: number; // 0-100
  metrics: ProjectMetrics;
  detectedTechnologies: DetectedTechnology[];
  aiAnalysisSummary: AiAnalysisSummary;
  skillImpacts: SkillImpact[];
  status: VerificationStatus;
  errorMessage?: string;
  rootPath?: string;
  verifiedAt: string;
}

export interface SkillEvidenceItem {
  id: string;
  userId: string;
  skillName: string;
  projectId: string;
  projectTitle: string;
  evidenceScore: number;
  fileCount: number;
  signals: string[];
  createdAt: string;
}

export interface SkillHistoryEntry {
  id: string;
  userId?: string;
  skillName: string;
  previousPercentage: number;
  newPercentage: number;
  previousLevel: ProficiencyLevel;
  newLevel: ProficiencyLevel;
  changeReason: string;
  projectId?: string;
  projectTitle?: string;
  createdAt: string;
}

export interface StructuredSkillVerification {
  skill: string;
  claimed: boolean;
  claimedLevel: "Beginner" | "Intermediate" | "Advanced";
  verified: boolean;
  proficiency: number; // 0-100
  level: ProficiencyLevel;
  evidenceProjects: number;
  confidence: number; // 0.0 - 1.0
  lastVerified?: string;
  relevantProjects: {
    projectId: string;
    projectTitle: string;
    evidenceScore: number;
  }[];
}

// ==============================================================================
// GitHub App Multi-Student Architecture Types
// ==============================================================================

export interface GithubConnection {
  id: string;
  studentId: string;
  githubUserId?: string;
  githubUsername: string;
  installationId: number;
  connectionStatus: "connected" | "suspended" | "revoked";
  createdAt: string;
  updatedAt: string;
}

export interface GithubPermittedRepo {
  id: string;
  studentId: string;
  githubConnectionId: string;
  githubRepositoryId: number;
  ownerLogin: string;
  repositoryName: string;
  fullName: string;
  defaultBranch: string;
  private: boolean;
  htmlUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectGithubConnection {
  id: string;
  projectId: string;
  studentId: string;
  githubRepositoryId: number;
  rootPath?: string | null;
  branch?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AsynchronousVerificationStep {
  step: "CONNECTING" | "FETCHING_REPOSITORY" | "ANALYZING_CODE" | "ANALYZING_AI" | "SCORING" | "COMPLETED";
  label: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  timestamp?: string;
}
