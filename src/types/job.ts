export type WorkplaceType = "remote" | "hybrid" | "onsite";
export type ExperienceLevel = "intern" | "entry-level" | "associate" | "mid-level";
export type ApplicationStage = "saved" | "applied" | "oa" | "interview" | "offer" | "rejected";

export interface SkillMatch {
  name: string;
  category: "languages" | "frameworks" | "ml-ai" | "tools" | "fundamentals";
  matched: boolean;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  workplaceType: WorkplaceType;
  experienceLevel: ExperienceLevel;
  salaryRange: string;
  requirements: string[];
  completeDescription: string;
  requiredSkills: string[];
  matchingSkills: string[];
  missingSkills: string[];
  resumeSuitabilityScore: number;
  applicationDeadline: string;
  deadlineUrgency: "urgent" | "soon" | "open";
  postedDaysAgo: number;
  applyUrl: string;
  isSaved?: boolean;
}

export interface ApplicationTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface InterviewInfo {
  roundName: string;
  roundType: "Screening" | "Technical Coding" | "System Design" | "Behavioral / Leadership" | "Hiring Manager";
  date: string;
  time: string;
  meetingUrl?: string;
  interviewers?: string;
  notes?: string;
}

export interface JobApplication {
  id: string;
  jobId?: string;
  company: string;
  role: string;
  location: string;
  stage: ApplicationStage;
  resumeUsedName: string;
  resumeMatchScore: number;
  jobDescription?: string;
  notes: string;
  interviewInfo?: InterviewInfo;
  tasks: ApplicationTask[];
  deadlines: {
    applicationDeadline?: string;
    oaDeadline?: string;
    interviewDate?: string;
    offerDeadline?: string;
  };
  appliedDate: string;
  salaryOffered?: string;
}

export interface JobFilterState {
  search: string;
  location: string;
  experience: string;
  skill: string;
  company: string;
}
