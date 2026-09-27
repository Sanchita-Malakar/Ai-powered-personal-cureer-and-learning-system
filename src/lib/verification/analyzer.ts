import { GithubRepoSnapshot } from "./githubService";
import { DetectedTechnology, ProjectMetrics } from "@/types/verification";

interface TechSignature {
  name: string;
  category: "Language" | "Framework" | "Database" | "DevOps" | "Library" | "Testing";
  filePatterns?: RegExp[];
  manifestKeywords?: string[];
  importKeywords?: RegExp[];
  configFiles?: string[];
  weight: number;
}

const TECH_SIGNATURES: TechSignature[] = [
  // Languages
  {
    name: "TypeScript",
    category: "Language",
    filePatterns: [/\.tsx?$/i],
    manifestKeywords: ["typescript", "@types/node"],
    importKeywords: [/import\s+type\b/, /interface\s+\w+/, /type\s+\w+\s*=/],
    weight: 1.0,
  },
  {
    name: "JavaScript",
    category: "Language",
    filePatterns: [/\.jsx?$/i],
    weight: 0.9,
  },
  {
    name: "Python",
    category: "Language",
    filePatterns: [/\.py$/i],
    manifestKeywords: ["python"],
    importKeywords: [/(?:import\s+\w+|from\s+\w+\s+import)/],
    weight: 1.0,
  },
  {
    name: "Java",
    category: "Language",
    filePatterns: [/\.java$/i],
    configFiles: ["pom.xml", "build.gradle"],
    weight: 1.0,
  },
  {
    name: "Go",
    category: "Language",
    filePatterns: [/\.go$/i],
    configFiles: ["go.mod"],
    weight: 1.0,
  },
  {
    name: "Rust",
    category: "Language",
    filePatterns: [/\.rs$/i],
    configFiles: ["Cargo.toml"],
    weight: 1.0,
  },
  {
    name: "C++",
    category: "Language",
    filePatterns: [/\.(?:cpp|cc|cxx|hpp)$/i],
    configFiles: ["CMakeLists.txt", "Makefile"],
    weight: 1.0,
  },
  {
    name: "SQL",
    category: "Language",
    filePatterns: [/\.sql$/i],
    importKeywords: [/SELECT\s+.*\s+FROM/i, /CREATE\s+TABLE/i],
    weight: 0.8,
  },

  // Frameworks - Web / Fullstack
  {
    name: "React",
    category: "Framework",
    manifestKeywords: ["react", "react-dom"],
    importKeywords: [/from\s+['"]react['"]/, /import\s+.*useState/],
    filePatterns: [/\.tsx?$/, /\.jsx?$/],
    weight: 1.0,
  },
  {
    name: "Next.js",
    category: "Framework",
    manifestKeywords: ["next"],
    filePatterns: [/app\/.*page\.[jt]sx?/, /pages\/.*[jt]sx?/, /next\.config/],
    importKeywords: [/from\s+['"]next\//],
    configFiles: ["next.config.js", "next.config.mjs", "next.config.ts"],
    weight: 1.1,
  },
  {
    name: "Node.js",
    category: "Framework",
    configFiles: ["package.json"],
    manifestKeywords: ["express", "fastify", "koa", "nest"],
    importKeywords: [/require\(['"]fs['"]\)/, /from\s+['"]node:/],
    weight: 0.9,
  },
  {
    name: "Express",
    category: "Framework",
    manifestKeywords: ["express"],
    importKeywords: [/require\(['"]express['"]\)/, /from\s+['"]express['"]/],
    weight: 0.9,
  },
  {
    name: "NestJS",
    category: "Framework",
    manifestKeywords: ["@nestjs/core", "@nestjs/common"],
    importKeywords: [/from\s+['"]@nestjs\//],
    weight: 1.1,
  },
  {
    name: "FastAPI",
    category: "Framework",
    manifestKeywords: ["fastapi"],
    importKeywords: [/from\s+fastapi\s+import/, /import\s+fastapi/],
    weight: 1.1,
  },
  {
    name: "Django",
    category: "Framework",
    manifestKeywords: ["django"],
    configFiles: ["manage.py"],
    importKeywords: [/from\s+django\b/],
    weight: 1.1,
  },
  {
    name: "Flask",
    category: "Framework",
    manifestKeywords: ["flask"],
    importKeywords: [/from\s+flask\s+import/],
    weight: 0.9,
  },
  {
    name: "Spring Boot",
    category: "Framework",
    manifestKeywords: ["spring-boot"],
    importKeywords: [/org\.springframework\.boot/],
    weight: 1.1,
  },

  // Databases & ORMs
  {
    name: "PostgreSQL",
    category: "Database",
    manifestKeywords: ["pg", "postgres", "psycopg2", "asyncpg"],
    importKeywords: [/from\s+['"]pg['"]/, /import\s+psycopg2/, /postgresql:\/\//],
    weight: 1.0,
  },
  {
    name: "MongoDB",
    category: "Database",
    manifestKeywords: ["mongodb", "mongoose", "pymongo"],
    importKeywords: [/from\s+['"]mongoose['"]/, /import\s+pymongo/],
    weight: 0.9,
  },
  {
    name: "Redis",
    category: "Database",
    manifestKeywords: ["redis", "ioredis"],
    importKeywords: [/from\s+['"]ioredis['"]/, /import\s+redis/],
    weight: 0.9,
  },
  {
    name: "Prisma",
    category: "Database",
    manifestKeywords: ["@prisma/client", "prisma"],
    filePatterns: [/schema\.prisma$/],
    importKeywords: [/from\s+['"]@prisma\/client['"]/],
    weight: 1.0,
  },
  {
    name: "Supabase",
    category: "Database",
    manifestKeywords: ["@supabase/supabase-js", "supabase"],
    importKeywords: [/from\s+['"]@supabase\/supabase-js['"]/],
    weight: 0.9,
  },

  // AI & ML
  {
    name: "LangChain",
    category: "Library",
    manifestKeywords: ["langchain", "@langchain/core"],
    importKeywords: [/from\s+langchain/, /from\s+['"]@langchain\//],
    weight: 1.1,
  },
  {
    name: "PyTorch",
    category: "Library",
    manifestKeywords: ["torch", "torchvision"],
    importKeywords: [/import\s+torch\b/],
    weight: 1.2,
  },
  {
    name: "TensorFlow",
    category: "Library",
    manifestKeywords: ["tensorflow"],
    importKeywords: [/import\s+tensorflow\b/],
    weight: 1.2,
  },
  {
    name: "Scikit-learn",
    category: "Library",
    manifestKeywords: ["scikit-learn", "sklearn"],
    importKeywords: [/from\s+sklearn\b/, /import\s+sklearn\b/],
    weight: 1.0,
  },

  // DevOps & Cloud
  {
    name: "Docker",
    category: "DevOps",
    configFiles: ["Dockerfile", "docker-compose.yml", "docker-compose.yaml"],
    filePatterns: [/Dockerfile/i, /docker-compose/i],
    weight: 1.0,
  },
  {
    name: "GitHub Actions",
    category: "DevOps",
    filePatterns: [/\.github\/workflows\/.*\.ya?ml$/i],
    weight: 0.9,
  },
  {
    name: "AWS",
    category: "DevOps",
    manifestKeywords: ["aws-sdk", "@aws-sdk", "boto3"],
    importKeywords: [/import\s+boto3/, /from\s+['"]@aws-sdk\//],
    weight: 1.0,
  },

  // Testing
  {
    name: "Jest",
    category: "Testing",
    manifestKeywords: ["jest", "ts-jest"],
    configFiles: ["jest.config.js", "jest.config.ts"],
    filePatterns: [/\.(?:test|spec)\.[jt]sx?$/],
    weight: 0.9,
  },
  {
    name: "Pytest",
    category: "Testing",
    manifestKeywords: ["pytest"],
    filePatterns: [/test_.*\.py$/, /.*_test\.py$/],
    weight: 0.9,
  },
  {
    name: "Cypress",
    category: "Testing",
    manifestKeywords: ["cypress"],
    filePatterns: [/cypress\//],
    weight: 1.0,
  },
  {
    name: "Playwright",
    category: "Testing",
    manifestKeywords: ["@playwright/test", "playwright"],
    configFiles: ["playwright.config.ts", "playwright.config.js"],
    weight: 1.0,
  },
];

export interface StaticAnalysisResult {
  detectedTechnologies: DetectedTechnology[];
  metrics: ProjectMetrics;
  evidenceSignals: string[];
  readmePresent: boolean;
  readmeCompletenessScore: number;
  testFileCount: number;
  dockerPresent: boolean;
  ciPresent: boolean;
  databasePresent: boolean;
}

export function performStaticAnalysis(snapshot: GithubRepoSnapshot): StaticAnalysisResult {
  const treePaths = snapshot.tree.map((t) => t.path);
  const manifestsText = snapshot.manifests.map((m) => `${m.path}\n${m.content}`).join("\n\n");
  const snippetsText = snapshot.sourceFileSnippets
    .map((s) => `${s.path}\n${s.content}`)
    .join("\n\n");

  const detectedTechnologies: DetectedTechnology[] = [];
  const evidenceSignals: string[] = [];

  // 1. Analyze each signature
  for (const sig of TECH_SIGNATURES) {
    let matchCount = 0;
    const signals: string[] = [];

    // Check config files
    if (sig.configFiles) {
      for (const cf of sig.configFiles) {
        if (treePaths.some((p) => p.toLowerCase().endsWith(cf.toLowerCase()))) {
          matchCount += 3;
          signals.push(`Configuration '${cf}' detected`);
        }
      }
    }

    // Check manifest keywords (dependencies)
    if (sig.manifestKeywords) {
      for (const kw of sig.manifestKeywords) {
        const regex = new RegExp(`["']${kw}["']|\\b${kw}\\b`, "i");
        if (regex.test(manifestsText)) {
          matchCount += 2;
          signals.push(`Dependency '${kw}' declared in manifests`);
        }
      }
    }

    // Check file patterns in tree
    if (sig.filePatterns) {
      for (const pattern of sig.filePatterns) {
        const matchingFiles = treePaths.filter((p) => pattern.test(p));
        if (matchingFiles.length > 0) {
          matchCount += Math.min(matchingFiles.length, 5);
          signals.push(`${matchingFiles.length} file(s) matching ${sig.name} pattern`);
        }
      }
    }

    // Check import keywords in source snippets
    if (sig.importKeywords) {
      for (const imp of sig.importKeywords) {
        if (imp.test(snippetsText)) {
          matchCount += 3;
          signals.push(`Source import/usage verified in repository code`);
        }
      }
    }

    // Also check GitHub API languages breakdown for language categories
    if (sig.category === "Language" && snapshot.languages[sig.name]) {
      const bytes = snapshot.languages[sig.name];
      matchCount += 3;
      signals.push(`GitHub language statistics: ${(bytes / 1024).toFixed(1)} KB`);
    }

    if (matchCount >= 2) {
      // Calculate evidence score for this technology
      const rawScore = Math.min(100, Math.round(matchCount * 12 * sig.weight));
      const normalizedScore = Math.max(30, Math.min(95, rawScore));

      const filesCount = sig.filePatterns
        ? treePaths.filter((p) => sig.filePatterns!.some((pt) => pt.test(p))).length
        : 1;

      detectedTechnologies.push({
        name: sig.name,
        category: sig.category,
        score: normalizedScore,
        filesCount: Math.max(filesCount, 1),
        signals,
      });

      evidenceSignals.push(`${sig.name}: ${signals.slice(0, 2).join(", ")}`);
    }
  }

  // 2. Compute Multidimensional Metrics
  // A. Codebase Size Score (Capped logarithmic scale, avoiding purely rewarding massive dumps)
  const codeFiles = snapshot.totalCodeFiles;
  let codebaseSizeScore = 30;
  if (codeFiles >= 3) codebaseSizeScore = 45;
  if (codeFiles >= 8) codebaseSizeScore = 65;
  if (codeFiles >= 15) codebaseSizeScore = 80;
  if (codeFiles >= 30) codebaseSizeScore = 90;
  if (codeFiles >= 60) codebaseSizeScore = 95;

  // B. Testing Practices
  const testFiles = treePaths.filter(
    (p) =>
      p.toLowerCase().includes("test") ||
      p.toLowerCase().includes("spec") ||
      p.toLowerCase().includes("__tests__")
  );
  let testingPractices = 20;
  if (testFiles.length >= 1) testingPractices = 50;
  if (testFiles.length >= 3) testingPractices = 70;
  if (testFiles.length >= 8) testingPractices = 85;
  if (testFiles.length >= 15) testingPractices = 95;

  // C. Architecture Quality (Layering: controllers, routes, models, services, components)
  const archLayers = [
    treePaths.some((p) => p.includes("route") || p.includes("api/")),
    treePaths.some((p) => p.includes("controller")),
    treePaths.some((p) => p.includes("service")),
    treePaths.some((p) => p.includes("model") || p.includes("schema")),
    treePaths.some((p) => p.includes("component") || p.includes("views/")),
    treePaths.some((p) => p.includes("util") || p.includes("lib/")),
  ].filter(Boolean).length;

  let architectureQuality = 40 + archLayers * 10;
  architectureQuality = Math.min(95, architectureQuality);

  // D. Engineering Practices (CI/CD, Docker, TypeScript, Linters)
  const ciPresent = treePaths.some((p) => p.includes(".github/workflows"));
  const dockerPresent = treePaths.some((p) => /dockerfile|docker-compose/i.test(p));
  const tsPresent = detectedTechnologies.some((t) => t.name === "TypeScript");
  const lintPresent = treePaths.some((p) => /eslint|\.prettierrc|ruff|flake8/i.test(p));

  let engineeringPractices = 40;
  if (ciPresent) engineeringPractices += 15;
  if (dockerPresent) engineeringPractices += 15;
  if (tsPresent) engineeringPractices += 15;
  if (lintPresent) engineeringPractices += 10;
  engineeringPractices = Math.min(95, engineeringPractices);

  // E. Documentation Practices (README presence, length, structure)
  const readmeFile = snapshot.manifests.find((m) =>
    m.path.toLowerCase().includes("readme")
  );
  let readmeCompletenessScore = 25;
  if (readmeFile) {
    const len = readmeFile.content.length;
    if (len > 300) readmeCompletenessScore = 55;
    if (len > 1000) readmeCompletenessScore = 75;
    if (len > 2500 && readmeFile.content.includes("```")) {
      readmeCompletenessScore = 90;
    }
  }

  // F. Technology Depth & Implementation Complexity
  const frameworkCount = detectedTechnologies.filter(
    (t) => t.category === "Framework" || t.category === "Database" || t.category === "Library"
  ).length;

  const technologyDepth = Math.min(
    95,
    Math.round(45 + detectedTechnologies.length * 6 + frameworkCount * 4)
  );

  const databasePresent = detectedTechnologies.some((t) => t.category === "Database");
  let implementationComplexity = 40 + (databasePresent ? 20 : 0) + (archLayers >= 3 ? 20 : 10);
  if (detectedTechnologies.length >= 4) implementationComplexity += 10;
  implementationComplexity = Math.min(95, implementationComplexity);

  return {
    detectedTechnologies,
    metrics: {
      technologyDepth,
      architectureQuality,
      implementationComplexity,
      engineeringPractices,
      testingPractices,
      documentationPractices: readmeCompletenessScore,
      codebaseSizeScore,
    },
    evidenceSignals,
    readmePresent: Boolean(readmeFile),
    readmeCompletenessScore,
    testFileCount: testFiles.length,
    dockerPresent,
    ciPresent,
    databasePresent,
  };
}
