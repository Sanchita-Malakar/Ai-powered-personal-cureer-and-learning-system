import {
  StudentGroundedContext,
  PromptPreset,
  ChatMessage,
} from "@/types/mentor";

export const STUDENT_GROUNDED_CONTEXT: StudentGroundedContext = {
  name: "Alex",
  targetRole: "AI/ML Engineer & Full-Stack Developer",
  overallReadiness: 78,
  profileCompletion: 94,
  college: "National Institute of Technology (NIT), Computer Science",
  cgpa: 8.7,
  skills: [
    { name: "Python", level: "Strong", score: 88 },
    { name: "DSA", level: "Intermediate", score: 68 },
    { name: "SQL", level: "Needs Improvement", score: 52 },
    { name: "Machine Learning", level: "Beginner", score: 42 },
  ],
  atsResumeScore: 78,
  resumeWeaknesses: [
    "Missing SQL & database optimization keywords",
    "Weak project metrics (no latency or scale numbers)",
    "Missing Docker / Containerization keywords",
  ],
  dsaWeakArea: "Trees (43% Accuracy)",
  dsaAccuracy: 77,
  activeApplicationsCount: 16,
  topJobOpportunities: [
    {
      company: "Swiggy",
      role: "Machine Learning Intern",
      matchPercentage: 92,
      status: "OA Shortlisted",
    },
    {
      company: "Stripe",
      role: "Software Engineer Intern",
      matchPercentage: 87,
      status: "Applied (Closes in 48h)",
    },
    {
      company: "Razorpay",
      role: "Backend Engineering Intern",
      matchPercentage: 85,
      status: "Interview Scheduled",
    },
  ],
  roadmapCurrentMilestone: "Milestone 3: Machine Learning & Deep Learning Foundations",
};

export const PROMPT_PRESETS: PromptPreset[] = [
  {
    id: "p1",
    query: "Which jobs should I apply for?",
    category: "Jobs",
    description: "Evaluates 16 roles against your 78% readiness and skill match",
  },
  {
    id: "p2",
    query: "Why is my resume score low?",
    category: "Resume",
    description: "Pinpoints the exact keyword deficits dragging your ATS score to 78/100",
  },
  {
    id: "p3",
    query: "What should I learn this week?",
    category: "Learning",
    description: "Prioritizes your 52% SQL gap and Stripe's 48h deadline",
  },
  {
    id: "p4",
    query: "Am I ready for an AI internship?",
    category: "Readiness",
    description: "Benchmarks your portfolio against Tier-1 80% qualification criteria",
  },
  {
    id: "p5",
    query: "Explain this DSA problem.",
    category: "DSA",
    description: "Walkthrough of Subarray Sum Equals K and BFS Queue level traversal",
  },
  {
    id: "p6",
    query: "Prepare me for a Python interview.",
    category: "Interview",
    description: "Simulates screening questions on the Python GIL, asyncio, and generators",
  },
];

export const INITIAL_CHAT_HISTORY: ChatMessage[] = [
  {
    id: "msg-init-1",
    sender: "assistant",
    timestamp: "Just now",
    contentMarkdown: `👋 Hello Alex! I am your **Interactive AI Career Mentor**.

Unlike generic assistants, I am directly plugged into your real-time career profile:
- **Target Goal**: \`AI/ML Engineer & Full-Stack Developer\`
- **Current Role Readiness**: \`78%\` *(within 2 points of 80% Tier-1 qualification benchmark)*
- **ATS Resume Score**: \`78 / 100\` *(Missing SQL & Containerization keywords)*
- **Skill Focus**: \`Python (88% Strong)\`, \`DSA (68%)\`, \`SQL (52% Needs Improvement)\`, \`Trees (43% Weak Area)\`

How can I coach your placement strategy today? Choose a question below or ask me anything!`,
    quickActions: [
      {
        id: "act-init-jobs",
        label: "Check Recommended Jobs",
        section: "jobs",
        badgeText: "Swiggy 92%",
      },
      {
        id: "act-init-resume",
        label: "Improve Resume ATS Score",
        section: "resume",
        badgeText: "78 → 88",
      },
    ],
  },
];

export function generatePersonalizedMentorResponse(
  query: string,
  context: StudentGroundedContext = STUDENT_GROUNDED_CONTEXT
): ChatMessage {
  const q = query.toLowerCase().trim();
  const timestamp = "Just now";

  // SCENARIO 1: "Which jobs should I apply for?"
  if (q.includes("which job") || q.includes("apply for") || q.includes("recommend job")) {
    return {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      timestamp,
      contentMarkdown: `### 🎯 Targeted Job Application Recommendations

Based on your **78% Role Readiness** and your **88% Python strength**, here is your personalized job strategy:

#### 1. Primary Recommendation: **Swiggy — Machine Learning Intern**
- **Match Score**: \`92%\` (Highest match in your pipeline)
- **Why You Fit**: Your PyTorch capstone project and strong Python depth fulfill 95% of their screening rubric.
- **Action**: You are already shortlisted for the Online Assessment (OA). Focus on BFS/DFS traversal questions.

#### 2. Secondary Recommendation: **Stripe — Software Engineer Intern**
- **Match Score**: \`87%\`
- **Urgency**: ⏰ **Application closes in 48 hours!**
- **Action Required**: Stripe requires idempotency and database transactional integrity. Tailor your resume project bullets to highlight Redis and transactional consistency.

#### 🚨 Roles to Avoid Right Now:
- **Google / Meta Senior SDE**: Postpone until your **DSA Tree accuracy (currently 43%)** and Dynamic Programming increase above 75%.

Would you like to review these positions in your Job Tracker?`,
      quickActions: [
        {
          id: "act-jobs-swiggy",
          label: "View Swiggy in Job Tracker",
          section: "jobs",
          paramId: "job-swiggy-ml",
          badgeText: "92% Match",
        },
        {
          id: "act-jobs-stripe",
          label: "Apply to Stripe (48h left)",
          section: "jobs",
          paramId: "job-stripe-intern",
          badgeText: "87% Match",
        },
        {
          id: "act-jobs-resume",
          label: "Tailor Resume for Stripe",
          section: "resume",
          paramId: "job-stripe-intern",
          badgeText: "Targeted Scan",
        },
      ],
      referencedContext: {
        readinessPercentage: context.overallReadiness,
        activeJobMatches: [
          { company: "Swiggy", match: "92%" },
          { company: "Stripe", match: "87%" },
        ],
      },
    };
  }

  // SCENARIO 2: "Why is my resume score low?"
  if (q.includes("resume") && (q.includes("low") || q.includes("score") || q.includes("why"))) {
    return {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      timestamp,
      contentMarkdown: `### 📄 Resume Diagnosis: Why Your ATS Score is 78/100

Your resume parsed cleanly with an accredited NIT B.Tech profile, but ATS algorithms flag three specific deficits:

| Dimension | Score | Status |
|---|---|---|
| **Education & Credentials** | \`90 / 100\` | Excellent (8.7 CGPA) |
| **Resume Structure** | \`82 / 100\` | Clean chronological layout |
| **Projects & Depth** | \`72 / 100\` | Needs quantified performance metrics |
| **Keywords & Density** | \`65 / 100\` | ⚠️ **Critical Deficit** |

#### The 3 Fixes That Will Boost You to 88/100:
1. **Missing SQL Keywords**: Relational databases are only mentioned once. Add \`PostgreSQL\`, \`B-Tree Indexing\`, and \`Query Optimization\` to match your 52% skill track.
2. **Missing Containerization**: Tier-1 screeners filter for \`Docker\` and \`CI/CD Pipelines\`.
3. **Quantify Project Metrics**:
   - *Current*: "Worked on machine learning model for image classification."
   - *AI Rewrite*: *"Architected a ResNet-50 PyTorch pipeline achieving 94.2% top-1 accuracy on 50k images with 35% inference speedup via TensorRT quantization."*

Click below to apply these suggestions inside the Resume Analyzer:`,
      quickActions: [
        {
          id: "act-res-analyzer",
          label: "Open Resume Analyzer",
          section: "resume",
          badgeText: "Score: 78/100",
        },
        {
          id: "act-res-apply",
          label: "Apply AI Bullet Rewrites (+10 pts)",
          section: "resume",
          badgeText: "Boost to 88%",
        },
      ],
      referencedContext: {
        atsScore: context.atsResumeScore,
        topSkillGaps: context.resumeWeaknesses,
      },
    };
  }

  // SCENARIO 3: "What should I learn this week?"
  if (q.includes("learn this week") || q.includes("what should i learn") || q.includes("study plan")) {
    return {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      timestamp,
      contentMarkdown: `### 🗓️ High-Yield Study Plan for This Week

Grounded in your upcoming deadlines and current skill ratings:
- ⏰ **Deadline**: Stripe closes in 48 hours.
- 📉 **Lowest Skill Rating**: SQL (\`52%\` — Needs Improvement).
- 📉 **Lowest DSA Topic**: Trees (\`43%\` — Weak Area).

#### Your 3 Priority Milestones for the Next 5 Days:

1. **Day 1–2: Eliminate the SQL Bottleneck (2h 15m)**
   - Complete the **SQL Relational Query Optimization** module.
   - Master B-Tree composite indexes, execution plans (\`EXPLAIN ANALYZE\`), and ACID isolation anomalies.

2. **Day 3–4: Solve 2 Medium Tree Problems in DSA Arena (1h 30m)**
   - Solve **Binary Tree Level Order Traversal** and **Lowest Common Ancestor**.
   - Focus on BFS queue snapshot sizing to lift your Tree accuracy above 65%.

3. **Day 5: Python Concurrency Review (45m)**
   - Review Global Interpreter Lock (GIL) and AsyncIO event loops before your mock technical screen.

Ready to start? Pick an action below:`,
      quickActions: [
        {
          id: "act-learn-sql",
          label: "Start SQL Optimization Module",
          section: "learning",
          paramId: "learn-sql-opt",
          badgeText: "Fix 52% Gap",
        },
        {
          id: "act-dsa-trees",
          label: "Solve Tree Level Order in DSA",
          section: "dsa",
          paramId: "dsa-tree-level-order",
          badgeText: "Fix 43% Gap",
        },
        {
          id: "act-roadmap",
          label: "View Full Career Roadmap",
          section: "roadmap",
          badgeText: "Milestone 3",
        },
      ],
      referencedContext: {
        weakDsaArea: "Trees (43%)",
        topSkillGaps: ["SQL (52%)", "ML (42%)"],
      },
    };
  }

  // SCENARIO 4: "Am I ready for an AI internship?"
  if (q.includes("ready for") || q.includes("ai internship") || q.includes("internship ready")) {
    return {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      timestamp,
      contentMarkdown: `### 📊 AI Internship Readiness Assessment

**Overall Readiness**: \`78 / 100\`
*(Tier-1 Tech Benchmark is \`80%\` — You are just **2 points** away!)*

#### 🟢 Strengths (Green Flags for Recruiters):
- **Python Proficiency**: \`88%\` (Strong) — You understand OOP, decorators, and memory references.
- **Resume & Projects**: \`88%\` — Solid capstone project and accredited 8.7 CGPA.
- **Academic Foundation**: Completed 7th semester Computer Science curriculum.

#### 🟡 Remaining Gaps to Close:
- **DSA Problem Solving**: \`65%\` — Your Array and Stack drills are good (85%), but **Trees (43%)** and Dynamic Programming (38%) risk failing technical screens.
- **Deep Learning Theory**: \`42%\` — You need to comfortably derive Transformer Scaled Dot-Product Attention $\\frac{QK^T}{\\sqrt{d_k}}$ and explain L1 vs L2 weight decay.

#### 💡 Verdict:
You are **Placement-Ready for fast-scaling startups** (like Swiggy and Razorpay). With 1 week of focused practice on Trees and SQL, you will clear the Tier-1 bar for Google and Stripe.`,
      quickActions: [
        {
          id: "act-mock-screen",
          label: "Take AI Mock Interview",
          section: "interview",
          badgeText: "Verify Bar",
        },
        {
          id: "act-learn-ml",
          label: "Complete ML Foundations Track",
          section: "learning",
          paramId: "learn-ml-found",
          badgeText: "42% → 85%",
        },
      ],
      referencedContext: {
        readinessPercentage: 78,
        targetRole: "AI/ML Engineer",
      },
    };
  }

  // SCENARIO 5: "Explain this DSA problem."
  if (q.includes("explain") && (q.includes("dsa") || q.includes("problem") || q.includes("algorithm"))) {
    return {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      timestamp,
      contentMarkdown: `### 🧠 Algorithmic Deep Dive: Subarray Sum Equals K

Given an array \`nums\` and integer \`k\`, return the count of continuous subarrays whose sum equals \`k\`.

#### 1. Naive Brute Force: $O(N^2)$ Time
Iterating all pairs \`(i, j)\` and computing sums takes $O(N^2)$ time. This causes Time Limit Exceeded (TLE) on $N = 20,000$.

#### 2. Optimal Approach: Prefix Sum + Hash Map in $O(N)$ Time
Let $P[i]$ be the sum of elements from index $0$ to $i$. The sum of elements between $j+1$ and $i$ is:
$$\\text{Subarray Sum} = P[i] - P[j]$$
If we want this subarray sum to equal $k$, then:
$$P[i] - P[j] = k \\iff P[j] = P[i] - k$$

As we iterate, we maintain a running \`prefix_sum\` and query our hash map:
1. Check if \`prefix_sum - k\` exists in our hash map. If yes, add its frequency to our count.
2. Store the current \`prefix_sum\` into the map.
3. Initialize the map with \`{0: 1}\` to catch subarrays starting at index 0.

- **Time Complexity**: $O(N)$ single pass
- **Space Complexity**: $O(N)$ hash table

Would you like to code this in the DSA Coding Workspace?`,
      quickActions: [
        {
          id: "act-dsa-subk",
          label: "Open Subarray Sum in Workspace",
          section: "dsa",
          paramId: "dsa-arr-subarray-k",
          badgeText: "Solve in Python",
        },
        {
          id: "act-dsa-trees-rev",
          label: "Solve Level Order Traversal",
          section: "dsa",
          paramId: "dsa-tree-level-order",
          badgeText: "Weak Area",
        },
      ],
    };
  }

  // SCENARIO 6: "Prepare me for a Python interview."
  if (q.includes("python interview") || q.includes("prepare me for python") || q.includes("interview prep")) {
    return {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      timestamp,
      contentMarkdown: `### 🎙️ Mock Python Technical Screen

Let's simulate a Senior Backend & AI screening loop. Top interviewers probe your understanding of Python's memory model and runtime architecture.

#### Key Questions Interviewers Ask:
1. **The GIL**: *"How does the Global Interpreter Lock impact CPU-bound multithreaded code vs I/O-bound code?"*
   - *Key Criterion*: Explain reference counting mutex; contrast \`multiprocessing\` with threading.
2. **Mutable Default Arguments**: *"Why is \`def add_item(item, items=[])\` dangerous in production?"*
   - *Key Criterion*: Default arguments are evaluated once at function definition time, not upon invocation.
3. **Generators vs Lists**: *"How does \`yield\` optimize memory when processing a 10GB dataset?"*
   - *Key Criterion*: Lazy iterator evaluation consumes $O(1)$ memory vs $O(N)$ memory.

I have configured a live simulation room with real-time 6-dimension evaluation for you:`,
      quickActions: [
        {
          id: "act-interview-py",
          label: "Launch Python Interview Simulator",
          section: "interview",
          badgeText: "Medium Difficulty",
        },
        {
          id: "act-learn-py",
          label: "Review Python Advanced Track",
          section: "learning",
          paramId: "learn-py-adv",
          badgeText: "75% Complete",
        },
      ],
      referencedContext: {
        targetRole: "Python & AI Systems",
      },
    };
  }

  // GENERAL / FALLBACK QUERY
  return {
    id: `msg-${Date.now()}`,
    sender: "assistant",
    timestamp,
    contentMarkdown: `I analyzed your inquiry against your career profile (**${context.targetRole}**, **${context.overallReadiness}% Readiness**):

Regarding **"${query}"**:
- Your strongest asset is your **Python proficiency (88%)** and accredited academic track record.
- Your primary bottlenecks remain **SQL Query Optimization (52%)** and **DSA Tree Traversal (43%)**.
- To reach the 80% Tier-1 placement qualification benchmark, prioritize completing your pending curriculum lessons and applying the quantified ATS bullet rewrites.

How else can I guide your preparation today?`,
    quickActions: [
      {
        id: "act-fallback-roadmap",
        label: "Check Career Roadmap",
        section: "roadmap",
        badgeText: "Milestone 3",
      },
      {
        id: "act-fallback-jobs",
        label: "Review Job Opportunities",
        section: "jobs",
        badgeText: "16 Applications",
      },
    ],
  };
}
