import { DashboardData } from "@/types/dashboard";

export const initialDashboardData: DashboardData = {
  profile: {
    name: "Alex",
    targetRole: "Junior Full-Stack Engineer",
    streakDays: 5,
    readinessPercentage: 78,
  },
  metrics: {
    careerGoal: {
      id: "career-goal",
      label: "Career goal readiness",
      value: 78,
      suffix: "%",
    },
    skillScore: {
      id: "skill-score",
      label: "Skill score",
      value: 84,
      suffix: "%",
      delta: {
        value: "+4% this month",
        isPositive: true,
      },
    },
    resumeScore: {
      id: "resume-score",
      label: "Resume score",
      value: "88/100",
      delta: {
        value: "+6 pts",
        isPositive: true,
      },
    },
    applications: {
      id: "applications-count",
      label: "Applications",
      value: "16 total",
      breakdown: {
        applied: 12,
        interview: 3,
        offer: 1,
      },
    },
  },
  aiPlan: {
    rationale:
      "You are within striking distance of the 80% readiness threshold for Junior Full-Stack positions. Today's primary leverage point is closing your containerization knowledge gap and validating database indexing concepts before your upcoming technical screens.",
    focusArea: "Containers, indexes & graph algorithms",
    items: [
      {
        id: "plan-1",
        title: "Complete Docker multi-stage build tutorial",
        duration: "45 min",
        category: "Skill",
        completed: false,
      },
      {
        id: "plan-2",
        title: "Solve 2 medium graph traversal problems in TypeScript",
        duration: "40 min",
        category: "DSA",
        completed: false,
      },
      {
        id: "plan-3",
        title: "Review B-Tree vs Hash index trade-offs for PostgreSQL",
        duration: "30 min",
        category: "Learning",
        completed: true,
      },
      {
        id: "plan-4",
        title: "Revise system design section in resume for Stripe submission",
        duration: "20 min",
        category: "Resume",
        completed: false,
      },
    ],
  },
  roadmap: {
    currentMilestoneIndex: 1,
    milestones: [
      {
        id: "m-1",
        stepNumber: 1,
        title: "CS Foundations & Data Structures",
        status: "completed",
      },
      {
        id: "m-2",
        stepNumber: 2,
        title: "Backend APIs & Database Optimization",
        status: "current",
        estimatedWeeks: "Week 3 of 4",
      },
      {
        id: "m-3",
        stepNumber: 3,
        title: "Frontend Architecture & Modern React",
        status: "upcoming",
      },
      {
        id: "m-4",
        stepNumber: 4,
        title: "Full-Stack System Design & DevOps",
        status: "upcoming",
      },
      {
        id: "m-5",
        stepNumber: 5,
        title: "Capstone Project & Technical Mock Interviews",
        status: "upcoming",
      },
    ],
  },
  progress: [
    {
      category: "Skills",
      currentScore: 84,
      deltaText: "+8% vs last month",
      trend: [
        { period: "W1", value: 68 },
        { period: "W2", value: 72 },
        { period: "W3", value: 76 },
        { period: "W4", value: 80 },
        { period: "Now", value: 84 },
      ],
    },
    {
      category: "DSA",
      currentScore: 76,
      deltaText: "+12 problems solved",
      trend: [
        { period: "W1", value: 50 },
        { period: "W2", value: 58 },
        { period: "W3", value: 64 },
        { period: "W4", value: 70 },
        { period: "Now", value: 76 },
      ],
    },
    {
      category: "Interview",
      currentScore: 70,
      deltaText: "2 mocks completed",
      trend: [
        { period: "W1", value: 45 },
        { period: "W2", value: 55 },
        { period: "W3", value: 60 },
        { period: "W4", value: 65 },
        { period: "Now", value: 70 },
      ],
    },
    {
      category: "Learning",
      currentScore: 82,
      deltaText: "4.5 hrs this week",
      trend: [
        { period: "W1", value: 60 },
        { period: "W2", value: 65 },
        { period: "W3", value: 72 },
        { period: "W4", value: 78 },
        { period: "Now", value: 82 },
      ],
    },
    {
      category: "Resume",
      currentScore: 88,
      deltaText: "+6 pts after revision",
      trend: [
        { period: "W1", value: 70 },
        { period: "W2", value: 74 },
        { period: "W3", value: 78 },
        { period: "W4", value: 82 },
        { period: "Now", value: 88 },
      ],
    },
  ],
  recommendedJobs: [
    {
      id: "job-1",
      title: "Junior Full-Stack Engineer",
      company: "Linear",
      location: "San Francisco, CA (Remote)",
      matchScore: 92,
      missingSkills: ["tRPC", "Prisma"],
      postedDaysAgo: 2,
      applyUrl: "#",
    },
    {
      id: "job-2",
      title: "Frontend Engineer — New Grad",
      company: "Stripe",
      location: "Seattle, WA",
      matchScore: 86,
      missingSkills: ["Next.js App Router", "Playwright"],
      postedDaysAgo: 4,
      applyUrl: "#",
    },
  ],
  alerts: [
    {
      id: "alert-1",
      text: "Resume has not been re-analyzed in 32 days",
      targetPage: "/resume",
      severity: "attention",
    },
    {
      id: "alert-2",
      text: "Full-Stack Intern role at Figma closes applications tomorrow",
      targetPage: "/job-tracker",
      severity: "attention",
    },
    {
      id: "alert-3",
      text: "PostgreSQL indexing quiz score is 15% below target role benchmark",
      targetPage: "/learning",
      severity: "attention",
    },
    {
      id: "alert-4",
      text: "Overdue DSA problem set: Dynamic Programming Part II",
      targetPage: "/dsa",
      severity: "action",
    },
  ],
  recentApplications: [
    {
      id: "app-1",
      company: "Stripe",
      role: "Backend Engineering Intern",
      appliedDate: "Oct 12",
      status: "interview",
    },
    {
      id: "app-2",
      company: "Vercel",
      role: "Solutions Engineer — Graduate",
      appliedDate: "Oct 08",
      status: "applied",
    },
    {
      id: "app-3",
      company: "Datadog",
      role: "Software Engineer Intern",
      appliedDate: "Sep 29",
      status: "rejected",
    },
  ],
};
