import { ResumeAnalysisState, JobSpecificComparison } from "@/types/resume";

export const INITIAL_RESUME_ANALYSIS: ResumeAnalysisState = {
  fileName: "Alex_Rivera_AI_ML_Resume_v3.pdf",
  fileSize: "184 KB",
  uploadedAt: "Analyzed today at 11:42 PM",
  overallAtsScore: 78,
  dimensions: {
    resumeStructure: {
      name: "Resume Structure",
      score: 82,
      label: "Standard Single-Column",
      description: "Clean layout, standard section headers, no complex multi-column parsing traps.",
    },
    skills: {
      name: "Skills",
      score: 80,
      label: "High Python Depth",
      description: "Strong core language presence, though missing relational database and backend tools.",
    },
    education: {
      name: "Education",
      score: 90,
      label: "Accredited & Formatted",
      description: "Clear university degree, expected graduation year (2026), and 8.7 CGPA clearly visible.",
    },
    projects: {
      name: "Projects",
      score: 72,
      label: "Needs Metric Quantification",
      description: "Projects are technically sound but suffer from passive descriptions lacking quantified metrics.",
    },
    experience: {
      name: "Experience",
      score: 68,
      label: "Academic Focus",
      description: "Internship and freelance contributions need more emphasis on team collaboration & scale.",
    },
    keywords: {
      name: "Keywords",
      score: 65,
      label: "Keyword Gaps Detected",
      description: "High frequency of 'Python' and 'ML', but critically missing SQL, Docker, and API terms.",
    },
    jobRelevance: {
      name: "Job Relevance",
      score: 74,
      label: "Strong SDE/AI Alignment",
      description: "Matches 74% of common requirements for junior software and AI engineering job descriptions.",
    },
    atsCompatibility: {
      name: "ATS Compatibility",
      score: 85,
      label: "High Machine Readability",
      description: "Parsed 100% of text cleanly with no unreadable image fonts or unsupported character sets.",
    },
  },
  strengths: [
    "Strong project section featuring frontier AI and full-stack implementations",
    "Relevant Python skills with deep library references (NumPy, Pandas, Scikit-Learn)",
    "Clean single-column chronological structure that passes 100% of standard ATS parsers",
    "Clear academic timeline highlighting accredited B.Tech and 8.7 CGPA",
  ],
  weaknesses: [
    "Missing SQL keywords (PostgreSQL, indexing, query optimization, schemas)",
    "Weak project descriptions lacking business impact and latency benchmarks",
    "Under-represented containerization tools (Docker, Kubernetes) and cloud infrastructure",
    "Passive action verbs ('Worked on', 'Helped build') instead of assertive leadership verbs",
  ],
  bulletRewrites: [
    {
      id: "rewrite-1",
      originalBullet: "Worked on machine learning model for image classification.",
      rewrittenBullet:
        "Architected a ResNet-50 PyTorch pipeline achieving 94.2% top-1 accuracy on 50k images with 35% inference speedup via TensorRT quantization.",
      impactExplanation: "Replaced passive verb with 'Architected', quantified accuracy (94.2%), dataset scale (50k), and performance optimization (35% speedup).",
      applied: false,
    },
    {
      id: "rewrite-2",
      originalBullet: "Built full-stack web application with React and Node.js for student notes.",
      rewrittenBullet:
        "Engineered a full-stack Next.js/Node.js web application handling 10,000+ monthly active requests with Redis caching under 45ms P99 latency.",
      impactExplanation: "Added user traffic volume (10,000+ requests) and quantifiable response speed (45ms P99) with caching architecture details.",
      applied: false,
    },
    {
      id: "rewrite-3",
      originalBullet: "Used SQL database to store user transactions and order history.",
      rewrittenBullet:
        "Designed normalized PostgreSQL schema with composite indexes, reducing p95 query latency by 42% across 250,000+ transactional records.",
      impactExplanation: "Directly solves the missing SQL keyword gap while highlighting schema design, indexing, and 42% query latency reduction.",
      applied: false,
    },
  ],
  measurableTips: [
    {
      id: "tip-scale",
      section: "User / Data Scale",
      guidance: "Quantify the data volume, user count, or throughput your code handled.",
      exampleFormula: "Handled [X] daily active users / processed [Y] MB/sec of streaming telemetry data.",
    },
    {
      id: "tip-perf",
      section: "System Performance",
      guidance: "Highlight execution speedup, memory footprint reduction, or latency drops.",
      exampleFormula: "Decreased p99 API response time by [X]% from [Y]ms to [Z]ms through indexing.",
    },
    {
      id: "tip-accuracy",
      section: "Model Benchmarking",
      guidance: "Always cite baseline comparison and specific evaluation metrics (F1-score, BLEU, latency).",
      exampleFormula: "Improved F1-score from 0.76 to 0.89 while maintaining sub-50ms inference time.",
    },
  ],
  missingSkills: [
    {
      id: "sk-sql",
      name: "SQL (PostgreSQL / Indexing)",
      category: "database",
      importance: "critical",
      frequencyInJobs: "Appears in 88% of target job descriptions",
      added: false,
    },
    {
      id: "sk-docker",
      name: "Docker & Containerization",
      category: "tools",
      importance: "critical",
      frequencyInJobs: "Appears in 76% of target job descriptions",
      added: false,
    },
    {
      id: "sk-fastapi",
      name: "FastAPI / Microservices",
      category: "frameworks",
      importance: "recommended",
      frequencyInJobs: "Appears in 68% of target job descriptions",
      added: false,
    },
    {
      id: "sk-dist",
      name: "Distributed Systems & Caching (Redis)",
      category: "architecture",
      importance: "recommended",
      frequencyInJobs: "Appears in 62% of target job descriptions",
      added: false,
    },
    {
      id: "sk-test",
      name: "Unit Testing & CI/CD (GitHub Actions)",
      category: "tools",
      importance: "bonus",
      frequencyInJobs: "Appears in 54% of target job descriptions",
      added: false,
    },
  ],
};

export const JOB_SPECIFIC_COMPARISONS: Record<string, JobSpecificComparison> = {
  "job-stripe-intern": {
    jobId: "job-stripe-intern",
    jobTitle: "Software Engineer Intern",
    company: "Stripe",
    matchScore: 87,
    matchingKeywords: ["Python", "DSA", "SQL", "REST APIs", "Git", "Object-Oriented Programming"],
    missingKeywords: ["Distributed Systems", "Idempotency", "Microservices"],
    tailoringSuggestions: [
      "Add mention of API idempotency keys or transactional consistency in your backend project bullets.",
      "Highlight concurrency handling or unit testing coverage (Stripe emphasizes developer velocity and test rigor).",
      "Include experience with relational database transactions and ACID compliance.",
    ],
  },
  "job-swiggy-aiml": {
    jobId: "job-swiggy-aiml",
    jobTitle: "Junior AI/ML Engineer",
    company: "Swiggy",
    matchScore: 92,
    matchingKeywords: ["Python", "Machine Learning", "FastAPI", "Statistics", "Pandas", "Scikit-Learn"],
    missingKeywords: ["PyTorch", "Docker", "Model Deployment"],
    tailoringSuggestions: [
      "Move PyTorch model training directly to the top skills strip above Scikit-Learn.",
      "Highlight low-latency model inference (sub-50ms) to align with Swiggy's real-time dispatch requirements.",
      "Mention Docker containerization for your FastAPI recommendation service.",
    ],
  },
  "job-razorpay-fs": {
    jobId: "job-razorpay-fs",
    jobTitle: "Full Stack Developer Intern",
    company: "Razorpay",
    matchScore: 84,
    matchingKeywords: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js"],
    missingKeywords: ["PostgreSQL", "Webhooks", "Payment Gateways"],
    tailoringSuggestions: [
      "Add PostgreSQL schema normalization to your database bullets.",
      "Emphasize webhook handling and state management in your frontend architecture.",
      "Showcase web performance vitals (Lighthouse score, bundle optimization).",
    ],
  },
  "job-google-ml": {
    jobId: "job-google-ml",
    jobTitle: "Machine Learning Engineer - Graduate",
    company: "Google / DeepMind",
    matchScore: 89,
    matchingKeywords: ["Python", "Transformers", "NLP", "DSA", "Statistics"],
    missingKeywords: ["PyTorch", "C++", "Distributed Training"],
    tailoringSuggestions: [
      "Emphasize empirical benchmark results and research rigor in your transformer projects.",
      "Detail multi-GPU training or model quantization (8-bit / 4-bit) techniques.",
      "Link directly to clean, documented GitHub research repositories.",
    ],
  },
  "job-cred-be": {
    jobId: "job-cred-be",
    jobTitle: "Backend Software Engineer",
    company: "CRED",
    matchScore: 81,
    matchingKeywords: ["Python", "FastAPI", "SQL", "Git"],
    missingKeywords: ["Redis", "Kafka", "System Design"],
    tailoringSuggestions: [
      "Mention message queue architectures or asynchronous event handling (Kafka/RabbitMQ).",
      "Highlight Redis caching strategies and TTL cache invalidation.",
      "Describe how your services handle sudden spikes in concurrent transaction volume.",
    ],
  },
};
