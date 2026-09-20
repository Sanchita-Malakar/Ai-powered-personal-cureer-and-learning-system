import { ProgressPageData } from "@/types/progress";

export const MOCK_PROGRESS_DATA: ProgressPageData = {
  career: {
    overallReadiness: 78,
    readinessDelta30Days: 14,
    qualificationCutoff: 80,
    roadmapCompletionPercentage: 42,
    completedMilestones: 3,
    totalMilestones: 8,
    activeMilestoneTitle: "Milestone 3: Machine Learning & Deep Learning Foundations",
  },
  skills: [
    {
      skill: "Python",
      category: "Language",
      currentScore: 88,
      previousScore: 76,
      deltaPercentage: 12,
      level: "Strong",
      highlight: "Mastered GIL internals, coroutines, and OOP decorators.",
    },
    {
      skill: "DSA",
      category: "Algorithms",
      currentScore: 68,
      previousScore: 50,
      deltaPercentage: 18,
      level: "Intermediate",
      highlight: "Improved 18% over the last month via prefix sum & array drills.",
    },
    {
      skill: "SQL",
      category: "Database",
      currentScore: 58,
      previousScore: 52,
      deltaPercentage: 6,
      level: "Focus Area",
      highlight: "Gained B-Tree composite indexing & query plan comprehension.",
    },
    {
      skill: "AI/ML",
      category: "Data Science",
      currentScore: 48,
      previousScore: 38,
      deltaPercentage: 10,
      level: "Beginner",
      highlight: "Understood bias-variance tradeoff & PyTorch tensor fundamentals.",
    },
  ],
  skillTrajectory: [
    { month: "Apr", Python: 60, DSA: 35, SQL: 40, AIML: 25 },
    { month: "May", Python: 68, DSA: 42, SQL: 45, AIML: 28 },
    { month: "Jun", Python: 72, DSA: 48, SQL: 48, AIML: 32 },
    { month: "Jul", Python: 76, DSA: 50, SQL: 52, AIML: 38 },
    { month: "Aug", Python: 82, DSA: 58, SQL: 54, AIML: 42 },
    { month: "Sep", Python: 88, DSA: 68, SQL: 58, AIML: 48 },
  ],
  learning: {
    activeCourses: 4,
    completedCourses: 3,
    topicsCompleted: 14,
    totalTopics: 24,
    testsTaken: 8,
    avgTestScore: 87,
    learningHours: 14.5,
  },
  interview: {
    mockInterviewsTaken: 6,
    latestScore: 84,
    avgScore30Days: 79,
    technicalScore: 88,
    behavioralScore: 68,
    weakAreas: [
      "Behavioral STAR answers remain weaker than technical answers",
      "Hesitation when declaring recursive tree auxiliary space",
    ],
    recentSessions: [
      { id: "s-1", topic: "Python GIL & Concurrency", score: 86, date: "Today" },
      { id: "s-2", topic: "DSA Prefix Sum & Hash Maps", score: 81, date: "3 days ago" },
      { id: "s-3", topic: "Leadership & Behavioral Screen", score: 68, date: "1 week ago" },
    ],
  },
  jobs: {
    applicationsCount: 16,
    oaCount: 4,
    interviewsCount: 3,
    offersCount: 1,
    responseRatePercentage: 43.8,
    topStages: [
      { company: "Swiggy", role: "Machine Learning Intern", stage: "OA Shortlist", matchPercentage: 92 },
      { company: "Stripe", role: "Software Engineer Intern", stage: "Applied (48h left)", matchPercentage: 87 },
      { company: "Razorpay", role: "Backend Engineering Intern", stage: "Interview Round 1", matchPercentage: 85 },
    ],
  },
  aiTrends: [
    {
      id: "trend-dsa-18",
      type: "positive",
      headline: "Rapid Algorithmic Growth",
      quote: "Your DSA score improved 18% over the last month.",
      detailedAnalysis:
        "Consistent drills in Prefix Sum arrays, Kadane's maximum subarray, and sliding window string patterns boosted your problem accuracy from 50% to 68%. Keep practicing Tree BFS/DFS to close the remaining gap.",
      recommendedAction: {
        label: "Solve Tree Level Order in DSA Arena",
        section: "dsa",
        paramId: "dsa-tree-level-order",
      },
    },
    {
      id: "trend-beh-gap",
      type: "attention",
      headline: "Interview Format Disparity",
      quote:
        "Interview performance is improving, but behavioral answers remain weaker than technical answers.",
      detailedAnalysis:
        "Your technical depth is in the top 10% (88% on Python & Systems), but behavioral delivery scored 68%. Interviewers look for concrete business impact and metrics in the 'Result' phase of the STAR framework.",
      recommendedAction: {
        label: "Practice Behavioral STAR Simulation",
        section: "interview",
      },
    },
    {
      id: "trend-job-funnel",
      type: "strategic",
      headline: "Strong Recruiter Conversion",
      quote:
        "Your 43.8% response rate significantly exceeds the campus baseline.",
      detailedAnalysis:
        "Out of 16 applications, 4 progressed to Online Assessments and 3 reached technical interviews. Prioritize preparing for your upcoming Swiggy OA and Stripe application deadline.",
      recommendedAction: {
        label: "Review Active Pipeline in Job Tracker",
        section: "jobs",
      },
    },
  ],
};
