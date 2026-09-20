export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  degree: string;
  college: string;
  graduationYear: string;
  locationCity: string;
  linkedInUrl: string;
  githubUrl: string;
  portfolioUrl: string;
}

export interface SubjectPerformance {
  id: string;
  name: string;
  gradeOrScore: string; // e.g. "A+", "92%", "9.0"
  proficiency: "Proficient" | "Mastered" | "Learning";
}

export interface AcademicProfile {
  branch: string;
  semester: string;
  cgpa: string; // e.g. "8.8"
  gradingScale: "10.0" | "4.0" | "Percentage";
  tenthPercentage: string;
  twelfthPercentage: string;
  activeBacklogs: "0" | "1" | "2+";
  subjects: SubjectPerformance[];
}

export interface CareerPreferences {
  targetRoles: string[]; // e.g. ["Junior Full Stack Developer", "AI/ML Engineer"]
  primaryRole: string;
  preferredLocations: string[]; // e.g. ["Bengaluru", "Remote", "Hyderabad"]
  targetSalary: string; // e.g. "₹12 - ₹18 LPA"
  employmentTypes: string[]; // e.g. ["Full-time", "Internship", "Intern-to-PPO"]
  preferredIndustries: string[]; // e.g. ["FinTech", "AI & DeepTech", "SaaS"]
  earliestJoining: string; // e.g. "Immediate", "Within 1 month", "Post Graduation"
  dreamCompanies: string[]; // e.g. ["Google", "Microsoft", "Stripe"]
}

export type SkillProficiency = "Beginner" | "Intermediate" | "Advanced";

export interface SkillItem {
  id: string;
  name: string;
  category: "Programming" | "Development" | "AI/ML" | "Data" | "Cloud & DevOps" | "Other";
  proficiency: SkillProficiency;
}

export interface SkillsMatrix {
  programming: SkillItem[];
  development: SkillItem[];
  aiMl: SkillItem[];
  data: SkillItem[];
  cloudDevOps: SkillItem[];
  otherSkills: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  impactMetrics?: string; // e.g. "Processed 10k+ requests/day, 99.8% uptime"
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueYear: string;
  credentialUrl?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  skillsUsed: string[];
}

export interface CareerGoals {
  primaryObjective: string;
  weeklyStudyHours: string; // e.g. "15-20 hours/week"
  topFocusArea: string; // e.g. "System Design & LeetCode Mediums"
  leetcodeHandle?: string;
  problemsSolvedCount?: string;
}

export interface ResumeData {
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  fileUrl?: string;
  atsScore: number;
  extractedSkills: string[];
  readinessSummary: string;
}

export interface CompleteStudentProfile {
  personalInfo: PersonalInfo;
  academicProfile: AcademicProfile;
  careerPreferences: CareerPreferences;
  skills: SkillsMatrix;
  projects: ProjectItem[];
  certifications: CertificationItem[];
  experiences: ExperienceItem[];
  careerGoals: CareerGoals;
  resume: ResumeData | null;
  onboardingCompleted: boolean;
  completedAt?: string;
  calculatedReadiness: number;
}

export const DEFAULT_STUDENT_PROFILE: CompleteStudentProfile = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    degree: "B.Tech Computer Science & Engineering",
    college: "",
    graduationYear: "2025",
    locationCity: "",
    linkedInUrl: "",
    githubUrl: "",
    portfolioUrl: "",
  },
  academicProfile: {
    branch: "Computer Science & Engineering",
    semester: "Semester 7",
    cgpa: "",
    gradingScale: "10.0",
    tenthPercentage: "",
    twelfthPercentage: "",
    activeBacklogs: "0",
    subjects: [
      { id: "sub-1", name: "Data Structures & Algorithms", gradeOrScore: "A+", proficiency: "Mastered" },
      { id: "sub-2", name: "Database Management Systems", gradeOrScore: "A", proficiency: "Proficient" },
      { id: "sub-3", name: "Operating Systems", gradeOrScore: "A", proficiency: "Proficient" },
      { id: "sub-4", name: "Computer Networks", gradeOrScore: "B+", proficiency: "Proficient" },
    ],
  },
  careerPreferences: {
    targetRoles: ["Junior Full Stack Developer"],
    primaryRole: "Junior Full Stack Developer",
    preferredLocations: ["Bengaluru", "Remote"],
    targetSalary: "₹10 - ₹16 LPA",
    employmentTypes: ["Full-time", "Intern-to-PPO"],
    preferredIndustries: ["SaaS & Enterprise", "AI & DeepTech", "FinTech"],
    earliestJoining: "Post Graduation (2025)",
    dreamCompanies: ["Stripe", "Microsoft", "Swiggy"],
  },
  skills: {
    programming: [
      { id: "p-1", name: "TypeScript", category: "Programming", proficiency: "Advanced" },
      { id: "p-2", name: "Python", category: "Programming", proficiency: "Intermediate" },
      { id: "p-3", name: "Java", category: "Programming", proficiency: "Intermediate" },
    ],
    development: [
      { id: "d-1", name: "React / Next.js", category: "Development", proficiency: "Advanced" },
      { id: "d-2", name: "Node.js / Express", category: "Development", proficiency: "Intermediate" },
      { id: "d-3", name: "Tailwind CSS", category: "Development", proficiency: "Advanced" },
      { id: "d-4", name: "REST APIs", category: "Development", proficiency: "Advanced" },
    ],
    aiMl: [
      { id: "ai-1", name: "LangChain / LLM APIs", category: "AI/ML", proficiency: "Intermediate" },
      { id: "ai-2", name: "PyTorch Basics", category: "AI/ML", proficiency: "Beginner" },
    ],
    data: [
      { id: "dt-1", name: "PostgreSQL", category: "Data", proficiency: "Intermediate" },
      { id: "dt-2", name: "MongoDB", category: "Data", proficiency: "Intermediate" },
      { id: "dt-3", name: "Redis", category: "Data", proficiency: "Beginner" },
    ],
    cloudDevOps: [
      { id: "cd-1", name: "Git & GitHub", category: "Cloud & DevOps", proficiency: "Advanced" },
      { id: "cd-2", name: "Docker", category: "Cloud & DevOps", proficiency: "Intermediate" },
      { id: "cd-3", name: "AWS (S3, EC2)", category: "Cloud & DevOps", proficiency: "Beginner" },
    ],
    otherSkills: ["Agile/Scrum", "Postman", "Linux/Bash", "System Design Fundamentals"],
  },
  projects: [
    {
      id: "proj-1",
      title: "AI Career Copilot & Resume Matcher",
      role: "Lead Full Stack Developer",
      description: "Full-stack application analyzing resumes against job descriptions with real-time ATS scoring and skill gap analysis.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "OpenAI API"],
      liveUrl: "https://career-copilot.demo.dev",
      githubUrl: "https://github.com/student/career-copilot",
      impactMetrics: "Analyzed 1,200+ mock resumes with 94% parsing accuracy.",
    },
    {
      id: "proj-2",
      title: "Distributed Task Queue & Notification Engine",
      role: "Backend Developer",
      description: "Asynchronous task processing worker service handling delayed job schedules with Redis and PostgreSQL.",
      technologies: ["Node.js", "Express", "Redis", "PostgreSQL", "Docker"],
      githubUrl: "https://github.com/student/task-queue-engine",
      impactMetrics: "Benchmarked at 2,500 tasks/second with sub-10ms dequeue latency.",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      title: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      issueYear: "2024",
      credentialUrl: "https://aws.amazon.com/verification",
    },
    {
      id: "cert-2",
      title: "Meta Front-End Developer Professional Certificate",
      issuer: "Coursera / Meta",
      issueYear: "2023",
      credentialUrl: "https://coursera.org/verify",
    },
  ],
  experiences: [],
  careerGoals: {
    primaryObjective: "To land a high-impact Software Development Engineer role in a tier-1 product firm or high-growth tech startup, building scalable cloud systems and production AI integrations.",
    weeklyStudyHours: "15-20 hours/week",
    topFocusArea: "Mastering LeetCode Mediums (Graphs & DP) & System Design trade-offs",
    leetcodeHandle: "code_ninja25",
    problemsSolvedCount: "320+",
  },
  resume: null,
  onboardingCompleted: false,
  calculatedReadiness: 76,
};

export const SAMPLE_ONBOARDED_STUDENT: CompleteStudentProfile = {
  ...DEFAULT_STUDENT_PROFILE,
  personalInfo: {
    fullName: "Alex Rivera",
    email: "alex.rivera@university.edu",
    phone: "+91 98765 43210",
    degree: "B.Tech Computer Science & Engineering",
    college: "National Institute of Technology (NIT)",
    graduationYear: "2025",
    locationCity: "Bengaluru, India",
    linkedInUrl: "https://linkedin.com/in/alex-rivera",
    githubUrl: "https://github.com/alexrivera-dev",
    portfolioUrl: "https://alexrivera.dev",
  },
  academicProfile: {
    branch: "Computer Science & Engineering",
    semester: "Semester 7",
    cgpa: "8.85",
    gradingScale: "10.0",
    tenthPercentage: "94.2%",
    twelfthPercentage: "91.8%",
    activeBacklogs: "0",
    subjects: [
      { id: "sub-1", name: "Data Structures & Algorithms", gradeOrScore: "A+", proficiency: "Mastered" },
      { id: "sub-2", name: "Database Management Systems", gradeOrScore: "A+", proficiency: "Mastered" },
      { id: "sub-3", name: "Operating Systems", gradeOrScore: "A", proficiency: "Proficient" },
      { id: "sub-4", name: "Computer Networks", gradeOrScore: "A", proficiency: "Proficient" },
    ],
  },
  experiences: [
    {
      id: "exp-1",
      role: "Software Engineering Intern",
      company: "Tech Innovators Inc.",
      location: "Bengaluru, India (Hybrid)",
      startDate: "May 2025",
      endDate: "July 2025",
      current: false,
      description: "Engineered scalable asynchronous task pipelines and microservices for high-volume notification delivery. Integrated Redis caching layers and optimized PostgreSQL indexes, slashing average query response latency by 35%.",
      skillsUsed: ["Node.js", "Express", "PostgreSQL", "Redis", "Docker", "Jest"],
    },
  ],
  resume: {
    fileName: "Alex_Rivera_SDE_Resume.pdf",
    fileSize: "1.4 MB",
    uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    atsScore: 88,
    extractedSkills: ["React", "TypeScript", "Node.js", "Next.js", "PostgreSQL", "Docker", "Algorithms"],
    readinessSummary: "Strong project impact metrics, ATS score 88/100, excellent academic consistency with zero backlogs.",
  },
  onboardingCompleted: true,
  completedAt: new Date().toISOString(),
  calculatedReadiness: 84,
};
