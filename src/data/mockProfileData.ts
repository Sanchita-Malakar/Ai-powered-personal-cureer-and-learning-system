import {
  AiRecommendationFeederInfo,
  TargetRoleDetail,
  ProfileCompletenessPillar,
} from "@/types/profile";

export const DEFAULT_AI_FEEDER_INFO: AiRecommendationFeederInfo = {
  mentorGrounded: {
    fidelityScore: 96,
    lastSynced: "Live real-time sync active",
    description: "AI Career Assistant directly references your 8.85 CGPA, Python proficiency (88%), DSA Tree gap (43%), and Stripe/Swiggy applications.",
    activeSignals: [
      "NIT Computer Science Senior (Semester 7)",
      "Zero active backlogs with A+ in DSA and DBMS",
      "LeetCode 320+ problems solved with Graph & DP focus",
      "16 active pipeline jobs in Job Tracker",
    ],
  },
  jobTracker: {
    matchAccuracy: 92,
    recommendedJobsCount: 16,
    topAlignedRole: "Swiggy ML Platform Intern (92% Match)",
    description: "Calculates live job suitability scores by comparing your verified skills (Python, PyTorch, Docker) against employer JD requirements.",
  },
  roadmap: {
    calibratedMilestone: "Milestone 3: Machine Learning & Deep Learning Foundations",
    curriculumAlignment: 94,
    description: "Adapts remaining roadmap phases directly according to your target role as an AI/ML Engineer and current 78% readiness.",
  },
  dsaTrainer: {
    difficultyTarget: "Medium to Hard",
    priorityTopic: "Tree Level-Order Traversal & Dynamic Programming",
    description: "Calibrates problem recommendations to close the 43% Trees accuracy bottleneck identified in mock performance.",
  },
  resumeAts: {
    currentScore: 88,
    targetBenchmark: 95,
    description: "ATS parser checks your uploaded resume against industry standards, highlighting missing keywords (Docker, Redis, SQL Indexing).",
  },
};

export const DEFAULT_TARGET_ROLES: TargetRoleDetail[] = [
  {
    id: "role-aiml",
    title: "AI/ML Engineer",
    category: "Machine Learning & AI",
    matchPercentage: 78,
    isPrimary: true,
    marketDemand: "Very High",
    salaryRange: "₹14 - ₹22 LPA",
    matchingSkills: ["Python (88%)", "NumPy & Pandas", "LangChain & LLMs", "PyTorch Basics", "REST APIs"],
    missingSkills: ["Deep Learning Transformers", "Vector DB Optimization", "Model Deployment (FastAPI/Triton)"],
    recommendedAction: "Complete Milestone 3 in Career Roadmap to boost role readiness to 85%.",
  },
  {
    id: "role-fullstack",
    title: "Junior Full-Stack Developer",
    category: "Software Engineering",
    matchPercentage: 84,
    isPrimary: false,
    marketDemand: "High",
    salaryRange: "₹10 - ₹16 LPA",
    matchingSkills: ["React / Next.js", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL"],
    missingSkills: ["GraphQL", "Micro-frontend architectures", "End-to-End Testing (Cypress/Playwright)"],
    recommendedAction: "Apply directly to Stripe & Swiggy through Job Tracker.",
  },
  {
    id: "role-backend",
    title: "Backend Software Engineer",
    category: "Systems & Infrastructure",
    matchPercentage: 74,
    isPrimary: false,
    marketDemand: "High",
    salaryRange: "₹12 - ₹18 LPA",
    matchingSkills: ["Node.js / Express", "PostgreSQL", "Redis", "Docker", "Database Indexing"],
    missingSkills: ["Go or Java Spring Boot", "Kafka Event Streaming", "Kubernetes Clustering"],
    recommendedAction: "Complete SQL Query Optimization module in Learning Center.",
  },
];

export const DEFAULT_COMPLETENESS_PILLARS: ProfileCompletenessPillar[] = [
  { label: "Personal & Social", percentage: 100, status: "complete", fieldCount: "8/8 fields" },
  { label: "Academic Profile", percentage: 100, status: "complete", fieldCount: "7/7 fields" },
  { label: "Skills Matrix", percentage: 92, status: "strong", fieldCount: "16 skills verified" },
  { label: "Projects & Impact", percentage: 90, status: "strong", fieldCount: "2 featured projects" },
  { label: "Work Experience", percentage: 85, status: "strong", fieldCount: "1 internship logged" },
  { label: "Certifications", percentage: 100, status: "complete", fieldCount: "2 verified credentials" },
  { label: "Career Preferences", percentage: 100, status: "complete", fieldCount: "6 preferences set" },
  { label: "ATS Resume", percentage: 88, status: "strong", fieldCount: "88/100 ATS score" },
];
