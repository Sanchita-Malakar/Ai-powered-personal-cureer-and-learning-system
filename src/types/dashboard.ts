export type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected' | 'at risk' | 'on track' | 'overdue';

export interface StudentProfile {
  name: string;
  targetRole: string;
  streakDays: number;
  readinessPercentage: number;
}

export interface MetricItem {
  id: string;
  label: string;
  value: string | number;
  suffix?: string;
  delta?: {
    value: string;
    isPositive: boolean;
  };
  breakdown?: {
    applied: number;
    interview: number;
    offer: number;
  };
}

export interface DailyPlanItem {
  id: string;
  title: string;
  duration: string;
  category: 'DSA' | 'Skill' | 'Resume' | 'Interview' | 'Job' | 'Learning';
  completed: boolean;
}

export interface AiPlan {
  rationale: string;
  focusArea: string;
  items: DailyPlanItem[];
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  stepNumber: number;
  status: 'completed' | 'current' | 'upcoming';
  estimatedWeeks?: string;
}

export interface ProgressTrendPoint {
  period: string;
  value: number;
}

export interface ProgressCategory {
  category: 'Skills' | 'DSA' | 'Interview' | 'Learning' | 'Resume';
  currentScore: number;
  deltaText: string;
  trend: ProgressTrendPoint[];
}

export interface RecommendedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  matchScore: number;
  missingSkills: string[];
  postedDaysAgo: number;
  applyUrl: string;
}

export interface NeedsAttentionAlert {
  id: string;
  text: string;
  targetPage: string;
  severity: 'attention' | 'action';
}

export interface RecentApplication {
  id: string;
  company: string;
  role: string;
  appliedDate: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
}

export interface DashboardData {
  profile: StudentProfile;
  metrics: {
    careerGoal: MetricItem;
    skillScore: MetricItem;
    resumeScore: MetricItem;
    applications: MetricItem;
  };
  aiPlan: AiPlan;
  roadmap: {
    currentMilestoneIndex: number;
    milestones: RoadmapMilestone[];
  };
  progress: ProgressCategory[];
  recommendedJobs: RecommendedJob[];
  alerts: NeedsAttentionAlert[];
  recentApplications: RecentApplication[];
}
