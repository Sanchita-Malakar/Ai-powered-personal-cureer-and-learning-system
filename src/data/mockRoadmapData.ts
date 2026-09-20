import { RoleRoadmap, CareerTimelineStage, RoadmapMilestoneFull } from "@/types/roadmap";

export const DEFAULT_TIMELINE_STAGES: CareerTimelineStage[] = [
  { id: "current-level", label: "Current Level", shortLabel: "Current", milestoneIds: ["m-1", "m-2"], status: "completed" },
  { id: "skills-to-learn", label: "Skills to Learn", shortLabel: "Skills", milestoneIds: ["m-3", "m-4", "m-5"], status: "current" },
  { id: "projects", label: "Projects", shortLabel: "Projects", milestoneIds: ["m-6"], status: "upcoming" },
  { id: "dsa", label: "DSA", shortLabel: "DSA", milestoneIds: ["m-7"], status: "current" },
  { id: "resume", label: "Resume", shortLabel: "Resume", milestoneIds: ["m-8"], status: "current" },
  { id: "applications", label: "Applications", shortLabel: "Apply", milestoneIds: ["m-9"], status: "upcoming" },
  { id: "interviews", label: "Interviews", shortLabel: "Interview", milestoneIds: ["m-10"], status: "upcoming" },
  { id: "target-role", label: "Target Role", shortLabel: "Job Offer", milestoneIds: ["m-11"], status: "upcoming" },
];

export const AIML_ENGINEER_ROADMAP: RoleRoadmap = {
  roleId: "ai-ml-engineer",
  roleTitle: "AI/ML Engineer",
  description: "End-to-end curriculum and execution pipeline for entry-level AI/ML Engineers and LLM specialists.",
  estimatedTotalMonths: "5-6 Months",
  stages: DEFAULT_TIMELINE_STAGES,
  milestones: [
    {
      id: "m-1",
      stepNumber: 1,
      title: "Python Foundations & Concurrency",
      stageName: "Current Level",
      status: "completed",
      objective: "Master core Python syntax, OOP, memory model, generator functions, and asynchronous concurrency for production services.",
      completionPercentage: 100,
      estimatedWeeks: "Weeks 1-3",
      aiCoachNote: "Completed with verified 88% benchmark score. Core syntax and OOP concepts locked.",
      skills: [
        { name: "Python 3.11+", targetProficiency: "Advanced", currentProficiency: "Advanced" },
        { name: "Object Oriented Design", targetProficiency: "Advanced", currentProficiency: "Advanced" },
        { name: "Asyncio & Threading", targetProficiency: "Intermediate", currentProficiency: "Intermediate" },
      ],
      resources: [
        { id: "res-1", title: "CS50P: Introduction to Programming with Python", provider: "Harvard / edX", type: "Course", url: "https://cs50.harvard.edu/python", isFree: true, duration: "30 hours" },
        { id: "res-2", title: "Fluent Python (2nd Edition)", provider: "O'Reilly", type: "Book", url: "https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/", isFree: false, duration: "20 hours" },
        { id: "res-3", title: "Real Python Asyncio Handbook", provider: "Real Python", type: "Docs", url: "https://realpython.com/async-io-python/", isFree: true, duration: "4 hours" },
      ],
      tasks: [
        { id: "t-1", title: "Build custom decorator framework for performance logging", completed: true },
        { id: "t-2", title: "Implement asynchronous worker queue using asyncio.Queue", completed: true },
        { id: "t-3", title: "Solve 15 algorithmic recursion & generator challenges", completed: true },
      ],
    },
    {
      id: "m-2",
      stepNumber: 2,
      title: "Statistics, Probability & Linear Algebra",
      stageName: "Current Level",
      status: "completed",
      objective: "Build rigorous mathematical intuition for gradients, matrix transformations, Bayes theorem, and statistical hypothesis testing.",
      completionPercentage: 100,
      estimatedWeeks: "Weeks 4-6",
      aiCoachNote: "Linear algebra and probability verified through academic coursework (Grade: A+).",
      skills: [
        { name: "Linear Algebra & SVD", targetProficiency: "Intermediate", currentProficiency: "Intermediate" },
        { name: "Probability & Bayes Rule", targetProficiency: "Intermediate", currentProficiency: "Intermediate" },
        { name: "NumPy Vectorized Ops", targetProficiency: "Advanced", currentProficiency: "Advanced" },
      ],
      resources: [
        { id: "res-4", title: "Essence of Linear Algebra", provider: "3Blue1Brown", type: "Video", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", isFree: true, duration: "15 videos" },
        { id: "res-5", title: "StatQuest with Josh Starmer", provider: "StatQuest", type: "Video", url: "https://statquest.org/", isFree: true, duration: "12 hours" },
        { id: "res-6", title: "Mathematics for Machine Learning", provider: "Cambridge Univ Press", type: "Book", url: "https://mml-book.github.io/", isFree: true, duration: "25 hours" },
      ],
      tasks: [
        { id: "t-4", title: "Implement matrix multiplication and PCA dimensionality reduction from scratch in NumPy", completed: true },
        { id: "t-5", title: "Conduct A/B test hypothesis significance test on synthetic traffic dataset", completed: true },
      ],
    },
    {
      id: "m-3",
      stepNumber: 3,
      title: "Machine Learning & Feature Engineering",
      stageName: "Skills to Learn",
      status: "completed",
      objective: "Implement, train, cross-validate, and tune classical algorithms (Random Forests, Gradient Boosting, SVMs) on structured tabular data.",
      completionPercentage: 100,
      estimatedWeeks: "Weeks 7-10",
      aiCoachNote: "Model validation and cross-validation pipelines completed. Scikit-learn fluency confirmed.",
      skills: [
        { name: "Scikit-learn", targetProficiency: "Advanced", currentProficiency: "Advanced" },
        { name: "Feature Scaling & Encoding", targetProficiency: "Advanced", currentProficiency: "Advanced" },
        { name: "XGBoost & LightGBM", targetProficiency: "Intermediate", currentProficiency: "Intermediate" },
      ],
      resources: [
        { id: "res-7", title: "Machine Learning Specialization", provider: "Andrew Ng / DeepLearning.AI", type: "Course", url: "https://www.coursera.org/specializations/machine-learning-introduction", isFree: true, duration: "40 hours" },
        { id: "res-8", title: "Hands-On Machine Learning with Scikit-Learn", provider: "Aurélien Géron", type: "Book", url: "https://github.com/ageron/handson-ml3", isFree: true, duration: "30 hours" },
      ],
      tasks: [
        { id: "t-6", title: "Train and compare Random Forest vs XGBoost on Kaggle customer churn dataset", completed: true },
        { id: "t-7", title: "Build Scikit-learn Pipeline with custom Imputer and OneHotEncoder", completed: true },
      ],
    },
    {
      id: "m-4",
      stepNumber: 4,
      title: "Deep Learning & Neural Architectures (PyTorch)",
      stageName: "Skills to Learn",
      status: "current",
      objective: "Train multi-layer perceptrons, convolutional networks (CNNs), and loss optimizers using GPU-accelerated PyTorch workflows.",
      completionPercentage: 75,
      estimatedWeeks: "Weeks 11-14 (In Progress)",
      aiCoachNote: "PyTorch tensor operations and backpropagation verified. Focus next on mixed-precision GPU training.",
      skills: [
        { name: "PyTorch & Torchvision", targetProficiency: "Advanced", currentProficiency: "Intermediate" },
        { name: "CNNs & Transfer Learning", targetProficiency: "Intermediate", currentProficiency: "Intermediate" },
        { name: "AdamW & Learning Rate Schedulers", targetProficiency: "Intermediate", currentProficiency: "Intermediate" },
      ],
      resources: [
        { id: "res-9", title: "Practical Deep Learning for Coders", provider: "Fast.ai", type: "Course", url: "https://course.fast.ai/", isFree: true, duration: "25 hours" },
        { id: "res-10", title: "PyTorch Deep Learning Bootcamp", provider: "PyTorch Org", type: "Docs", url: "https://pytorch.org/tutorials/", isFree: true, duration: "15 hours" },
      ],
      tasks: [
        { id: "t-8", title: "Implement ResNet-18 fine-tuning on custom 10-class vision dataset", completed: true },
        { id: "t-9", title: "Configure PyTorch DataLoader with Albumentations data augmentation", completed: true },
        { id: "t-10", title: "Benchmark inference latency with PyTorch JIT TorchScript & ONNX export", completed: false },
        { id: "t-11", title: "Implement custom multi-head attention module from scratch in PyTorch", completed: false },
      ],
    },
    {
      id: "m-5",
      stepNumber: 5,
      title: "NLP, Transformers & LLM Architectures",
      stageName: "Skills to Learn",
      status: "upcoming",
      objective: "Master Self-Attention, BERT/GPT architectures, Tokenizers, RAG (Retrieval Augmented Generation), and LangChain agent frameworks.",
      completionPercentage: 25,
      estimatedWeeks: "Weeks 15-18",
      aiCoachNote: "Next up after completing PyTorch ONNX milestone. High hiring demand for RAG engineers.",
      skills: [
        { name: "Hugging Face Transformers", targetProficiency: "Advanced", currentProficiency: "Beginner" },
        { name: "RAG & Vector Databases", targetProficiency: "Advanced", currentProficiency: "Intermediate" },
        { name: "LangChain / LlamaIndex", targetProficiency: "Intermediate", currentProficiency: "Beginner" },
      ],
      resources: [
        { id: "res-11", title: "Hugging Face NLP Course", provider: "Hugging Face", type: "Course", url: "https://huggingface.co/learn/nlp-course", isFree: true, duration: "20 hours" },
        { id: "res-12", title: "The Illustrated Transformer", provider: "Jay Alammar", type: "Docs", url: "https://jalammar.github.io/illustrated-transformer/", isFree: true, duration: "2 hours" },
        { id: "res-13", title: "Building Systems with ChatGPT API", provider: "DeepLearning.AI", type: "Course", url: "https://www.deeplearning.ai/", isFree: true, duration: "5 hours" },
      ],
      tasks: [
        { id: "t-12", title: "Build contextual document Q&A pipeline using LangChain, OpenAI, and Pinecone", completed: true },
        { id: "t-13", title: "Fine-tune LoRA adapter on Llama 3 8B model using Unsloth", completed: false },
        { id: "t-14", title: "Evaluate hallucination metrics with RAGAS evaluation framework", completed: false },
      ],
    },
    {
      id: "m-6",
      stepNumber: 6,
      title: "AI Production Projects & Serving",
      stageName: "Projects",
      status: "upcoming",
      objective: "Package machine learning models into high-throughput containerized FastAPI microservices with vector search and observability.",
      completionPercentage: 35,
      estimatedWeeks: "Weeks 19-21",
      aiCoachNote: "Your Resume already includes Project #1 (AI Career Copilot). Next step is deploying microservices with Docker.",
      skills: [
        { name: "FastAPI Async Serving", targetProficiency: "Advanced", currentProficiency: "Intermediate" },
        { name: "Docker Containerization", targetProficiency: "Intermediate", currentProficiency: "Beginner" },
        { name: "Pinecone / pgvector", targetProficiency: "Intermediate", currentProficiency: "Intermediate" },
      ],
      resources: [
        { id: "res-14", title: "Full Stack Deep Learning", provider: "FSDL Berkley", type: "Course", url: "https://fullstackdeeplearning.com/", isFree: true, duration: "30 hours" },
        { id: "res-15", title: "Made With ML (Production MLOps)", provider: "Goku Mohandas", type: "Repo", url: "https://madewithml.com/", isFree: true, duration: "15 hours" },
      ],
      tasks: [
        { id: "t-15", title: "Containerize semantic search API with Docker multi-stage build under 250MB", completed: false },
        { id: "t-16", title: "Deploy live demo to Vercel/Render with automated GitHub Actions CI/CD", completed: false },
        { id: "t-17", title: "Record 2-minute video walkthrough and benchmark latency (<50ms per query)", completed: false },
      ],
    },
    {
      id: "m-7",
      stepNumber: 7,
      title: "DSA & Problem Solving for Tech Screens",
      stageName: "DSA",
      status: "current",
      objective: "Solve 150+ LeetCode mediums across Graphs, Dynamic Programming, Trees, and Heaps to pass technical screening bars.",
      completionPercentage: 65,
      estimatedWeeks: "Continuous (Current Focus)",
      aiCoachNote: "CRITICAL: DSA score (68%) is your primary bottleneck for Tier-1 engineering shortlists. Prioritize Graphs & DP.",
      skills: [
        { name: "Graph BFS / DFS / Dijkstra", targetProficiency: "Advanced", currentProficiency: "Intermediate" },
        { name: "Dynamic Programming", targetProficiency: "Intermediate", currentProficiency: "Beginner" },
        { name: "Tree Traversals & BSTs", targetProficiency: "Advanced", currentProficiency: "Advanced" },
      ],
      resources: [
        { id: "res-16", title: "NeetCode 150 Blind Roadmap", provider: "NeetCode.io", type: "Practice", url: "https://neetcode.io/practice", isFree: true, duration: "60 hours" },
        { id: "res-17", title: "Striver's SDE Sheet", provider: "TakeUForward", type: "Practice", url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/", isFree: true, duration: "50 hours" },
      ],
      tasks: [
        { id: "t-18", title: "Complete 10 Medium Graph problems (Course Schedule, Clone Graph, Number of Islands)", completed: true },
        { id: "t-19", title: "Master 1D & 2D Dynamic Programming patterns (Coin Change, Longest Common Subsequence)", completed: false },
        { id: "t-20", title: "Participate in 2 consecutive LeetCode Biweekly Contests and solve at least 2 problems", completed: false },
      ],
    },
    {
      id: "m-8",
      stepNumber: 8,
      title: "Resume Preparation & ATS Optimization",
      stageName: "Resume",
      status: "current",
      objective: "Pass automated applicant tracking systems (ATS 85%+) with quantified metric achievements (XYZ formula).",
      completionPercentage: 88,
      estimatedWeeks: "Weeks 22-23",
      aiCoachNote: "Current ATS benchmark: 88/100. Project impact metrics verified.",
      skills: [
        { name: "ATS Single-Column Formatting", targetProficiency: "Mastered", currentProficiency: "Mastered" },
        { name: "XYZ Impact Quantification", targetProficiency: "Advanced", currentProficiency: "Intermediate" },
      ],
      resources: [
        { id: "res-18", title: "CareerOS Instant ATS Resume Scanner", provider: "CareerOS Tool", type: "Practice", url: "/#resume", isFree: true, duration: "1 hour" },
        { id: "res-19", title: "Tech Resume Guide by Gergely Orosz", provider: "Pragmatic Engineer", type: "Docs", url: "https://blog.pragmaticengineer.com/the-tech-resume-handbook/", isFree: false, duration: "3 hours" },
      ],
      tasks: [
        { id: "t-21", title: "Revise Project #1 bullet points to include exact latency percentage reductions", completed: true },
        { id: "t-22", title: "Run ATS keyword audit against 5 Stripe & Swiggy machine learning job descriptions", completed: true },
        { id: "t-23", title: "Export verified PDF format under 2MB with clickable live project demo links", completed: true },
      ],
    },
    {
      id: "m-9",
      stepNumber: 9,
      title: "Application Pipeline & Strategic Outreach",
      stageName: "Applications",
      status: "upcoming",
      objective: "Submit 25+ targeted campus placement registrations, cold referral requests, and high-match AI role applications.",
      completionPercentage: 20,
      estimatedWeeks: "Weeks 24-26",
      aiCoachNote: "3 matched roles ready in your Job Tracker (Stripe, Swiggy, Razorpay).",
      skills: [
        { name: "LinkedIn Networking & Referrals", targetProficiency: "Intermediate", currentProficiency: "Beginner" },
        { name: "Campus Placement Registration", targetProficiency: "Advanced", currentProficiency: "Intermediate" },
      ],
      resources: [
        { id: "res-20", title: "CareerOS Job Matcher & Tracker", provider: "CareerOS Tool", type: "Practice", url: "/#jobs", isFree: true, duration: "Ongoing" },
        { id: "res-21", title: "Cold Email & Referral Strategy for SDE Roles", provider: "CareerOS Guides", type: "Docs", url: "https://linkedin.com", isFree: true, duration: "2 hours" },
      ],
      tasks: [
        { id: "t-24", title: "Apply to Stripe Graduate Engineer drive before 48h deadline", completed: false },
        { id: "t-25", title: "Connect with 5 alumni engineers at target firms on LinkedIn with personalized notes", completed: false },
        { id: "t-26", title: "Log 10 applications with status in CareerOS Pipeline Tracker", completed: false },
      ],
    },
    {
      id: "m-10",
      stepNumber: 10,
      title: "Technical & Behavioral Mock Interviews",
      stageName: "Interviews",
      status: "upcoming",
      objective: "Perform realistic live coding mocks, system design architectural trade-off defenses, and STAR behavioral answers.",
      completionPercentage: 15,
      estimatedWeeks: "Weeks 27-29",
      aiCoachNote: "Scheduled mock technical screen on Thursday 4:00 PM.",
      skills: [
        { name: "System Design Fundamentals", targetProficiency: "Intermediate", currentProficiency: "Beginner" },
        { name: "STAR Method Behavioral Communication", targetProficiency: "Advanced", currentProficiency: "Intermediate" },
      ],
      resources: [
        { id: "res-22", title: "CareerOS AI Mock Interview Simulator", provider: "CareerOS Tool", type: "Practice", url: "/#interview", isFree: true, duration: "Ongoing" },
        { id: "res-23", title: "System Design Primer", provider: "Donne Martin / GitHub", type: "Repo", url: "https://github.com/donnemartin/system-design-primer", isFree: true, duration: "20 hours" },
      ],
      tasks: [
        { id: "t-27", title: "Complete AI Mock Interview on Distributed Rate Limiter with >80 score", completed: false },
        { id: "t-28", title: "Draft 5 STAR behavioral stories covering leadership, conflict, and technical failure", completed: false },
        { id: "t-29", title: "Conduct 1 live peer mock interview on Pramp or with a senior engineer", completed: false },
      ],
    },
    {
      id: "m-11",
      stepNumber: 11,
      title: "Offer Evaluation & Target Role Landing",
      stageName: "Target Role",
      status: "upcoming",
      objective: "Evaluate offers, compare compensation packages, and sign your dream AI/ML Engineering contract.",
      completionPercentage: 0,
      estimatedWeeks: "Weeks 30+",
      aiCoachNote: "Final destination. We will celebrate when you reach here!",
      skills: [
        { name: "Offer & Equity Evaluation", targetProficiency: "Intermediate", currentProficiency: "Beginner" },
      ],
      resources: [
        { id: "res-24", title: "Levels.fyi Engineering Compensation Benchmarks", provider: "Levels.fyi", type: "Docs", url: "https://www.levels.fyi", isFree: true, duration: "1 hour" },
      ],
      tasks: [
        { id: "t-30", title: "Review CTC breakdown (Base, Bonus, ESOPs) against market benchmarks", completed: false },
        { id: "t-31", title: "Sign offer letter and share celebration on CareerOS community!", completed: false },
      ],
    },
  ],
};

export const FULLSTACK_ROADMAP: RoleRoadmap = {
  ...AIML_ENGINEER_ROADMAP,
  roleId: "junior-full-stack-developer",
  roleTitle: "Junior Full Stack Developer",
  description: "Comprehensive engineering roadmap for React/Next.js frontend, Node/PostgreSQL backend, microservices, and campus placements.",
  milestones: AIML_ENGINEER_ROADMAP.milestones.map((m) => {
    if (m.id === "m-4") {
      return {
        ...m,
        title: "Frontend Mastery: Next.js App Router & State",
        objective: "Build responsive, server-rendered web applications with React 18, Server Components, and Tailwind CSS.",
        skills: [
          { name: "React / Next.js 14", targetProficiency: "Advanced", currentProficiency: "Advanced" },
          { name: "TypeScript", targetProficiency: "Advanced", currentProficiency: "Advanced" },
          { name: "Tailwind CSS", targetProficiency: "Advanced", currentProficiency: "Advanced" },
        ],
      };
    }
    if (m.id === "m-5") {
      return {
        ...m,
        title: "Backend Services, ORMs & Database Architecture",
        objective: "Design scalable REST & GraphQL APIs with Node.js, Express, PostgreSQL, Prisma, and Redis caching.",
        skills: [
          { name: "Node.js / Express", targetProficiency: "Advanced", currentProficiency: "Intermediate" },
          { name: "PostgreSQL & Prisma ORM", targetProficiency: "Advanced", currentProficiency: "Intermediate" },
          { name: "Redis Caching", targetProficiency: "Intermediate", currentProficiency: "Beginner" },
        ],
      };
    }
    return m;
  }),
};

export const ROLE_ROADMAPS: Record<string, RoleRoadmap> = {
  "ai-ml-engineer": AIML_ENGINEER_ROADMAP,
  "junior-full-stack-developer": FULLSTACK_ROADMAP,
};
