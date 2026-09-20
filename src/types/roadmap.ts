export type MilestoneStatus = "completed" | "current" | "upcoming";

export interface RoadmapTask {
  id: string;
  title: string;
  completed: boolean;
  estimatedHours?: string;
  isCustom?: boolean;
}

export interface RoadmapResource {
  id: string;
  title: string;
  type: "Course" | "Docs" | "Book" | "Video" | "Repo" | "Practice";
  url: string;
  duration?: string;
  provider: string;
  isFree: boolean;
}

export interface MilestoneSkill {
  name: string;
  targetProficiency: "Beginner" | "Intermediate" | "Advanced" | "Mastered";
  currentProficiency?: "Beginner" | "Intermediate" | "Advanced" | "Mastered";
}

export interface RoadmapMilestoneFull {
  id: string;
  stepNumber: number;
  title: string;
  stageName: string; // e.g. "Skills to Learn", "Projects", "DSA", "Resume", "Applications", "Interviews"
  status: MilestoneStatus;
  objective: string;
  skills: MilestoneSkill[];
  resources: RoadmapResource[];
  tasks: RoadmapTask[];
  completionPercentage: number;
  estimatedWeeks?: string;
  aiCoachNote?: string;
}

export interface CareerTimelineStage {
  id: string;
  label: string;
  shortLabel: string;
  milestoneIds: string[];
  status: "completed" | "current" | "upcoming";
}

export interface RoleRoadmap {
  roleId: string;
  roleTitle: string;
  description: string;
  estimatedTotalMonths: string;
  stages: CareerTimelineStage[];
  milestones: RoadmapMilestoneFull[];
}

export type RecalibrationPacing = "fast-track" | "balanced" | "placement-sprint";
