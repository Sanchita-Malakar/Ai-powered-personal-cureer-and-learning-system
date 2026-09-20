export type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected' | 'at risk' | 'on track' | 'overdue';

export type ModuleType = 'dsa' | 'resume' | 'jobs' | 'learning' | 'interview';

export interface StudentProfile {
  name: string;
  targetRole: string;
  streakDays: number;
  readinessPercentage: number;
  profileCompletionPercentage?: number;
  targetSalary?: string;
  dreamCompanies?: string[];
  college?: string;
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

export interface TodayTaskItem {
  id: string;
  title: string;
  category: 'DSA' | 'Resume' | 'ML' | 'Jobs' | 'Learning';
  durationText: string;
  completed: boolean;
  moduleTarget: ModuleType;
}

export interface SkillOverviewItem {
  id: string;
  name: string;
  level: 'Strong' | 'Intermediate' | 'Needs Improvement' | 'Beginner';
  score: number;
  color: string;
  category: string;
}

export interface UpcomingItem {
  id: string;
  title: string;
  type: 'Interview' | 'Application deadline' | 'Learning milestone' | 'Scheduled practice';
  dateText: string;
  timeRemaining?: string;
  urgency: 'high' | 'medium' | 'normal';
  actionLabel?: string;
  moduleTarget: ModuleType;
}

export interface AiInsight {
  quote: string;
  context: string;
  recommendedAction: string;
  targetModule: ModuleType;
}

export interface RecommendedActionItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  iconName: 'dsa' | 'resume' | 'jobs' | 'learning' | 'interview';
  moduleTarget: ModuleType;
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
  careerProgressPillars: {
    skills: number;
    dsa: number;
    resume: number;
    interview: number;
  };
  todaysTasks: TodayTaskItem[];
  skillsOverview: SkillOverviewItem[];
  upcomingItems: UpcomingItem[];
  aiInsight: AiInsight;
  recommendedActions: RecommendedActionItem[];
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
