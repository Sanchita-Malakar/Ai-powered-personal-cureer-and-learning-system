import { ProficiencyLevel } from "@/types/verification";

export const ANALYSIS_VERSION = "1.0.0";

// Agreed baseline percentage for newly student-claimed skills
export const CLAIMED_SKILL_BASELINE_PERCENTAGE = 20;
export const CLAIMED_SKILL_BASELINE_LEVEL: ProficiencyLevel = "Exposure";

// Configurable single source of truth for Proficiency Mapping
export interface ProficiencyThreshold {
  min: number;
  max: number;
  level: ProficiencyLevel;
  badgeColor: string;
  badgeBg: string;
  textColor: string;
}

export const PROFICIENCY_THRESHOLDS: ProficiencyThreshold[] = [
  {
    min: 0,
    max: 20,
    level: "Exposure",
    badgeColor: "border-slate-500/30",
    badgeBg: "bg-slate-500/15",
    textColor: "text-slate-600 dark:text-slate-400",
  },
  {
    min: 21,
    max: 40,
    level: "Beginner",
    badgeColor: "border-amber-500/30",
    badgeBg: "bg-amber-500/15",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  {
    min: 41,
    max: 60,
    level: "Developing",
    badgeColor: "border-blue-500/30",
    badgeBg: "bg-blue-500/15",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    min: 61,
    max: 75,
    level: "Intermediate",
    badgeColor: "border-indigo-500/30",
    badgeBg: "bg-indigo-500/15",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    min: 76,
    max: 90,
    level: "Advanced",
    badgeColor: "border-emerald-500/30",
    badgeBg: "bg-emerald-500/15",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    min: 91,
    max: 100,
    level: "Highly Proficient",
    badgeColor: "border-purple-500/30",
    badgeBg: "bg-purple-500/15",
    textColor: "text-purple-600 dark:text-purple-400",
  },
];

export function getProficiencyLevel(percentage: number): ProficiencyLevel {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
  const found = PROFICIENCY_THRESHOLDS.find(
    (t) => clamped >= t.min && clamped <= t.max
  );
  return found ? found.level : "Exposure";
}

export function getProficiencyBadgeStyle(percentage: number) {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
  const found = PROFICIENCY_THRESHOLDS.find(
    (t) => clamped >= t.min && clamped <= t.max
  );
  return (
    found || {
      badgeColor: "border-border",
      badgeBg: "bg-surface",
      textColor: "text-ink-muted",
    }
  );
}

// Directories and files to exclude from analysis (vendor, generated, lockfiles)
export const EXCLUDED_PATHS = [
  "node_modules/",
  ".git/",
  ".next/",
  "dist/",
  "build/",
  "out/",
  "coverage/",
  "vendor/",
  "target/",
  ".cache/",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lockb",
  "Gemfile.lock",
  "poetry.lock",
  "Pipfile.lock",
  "composer.lock",
  ".env",
  ".env.local",
  ".env.production",
  ".DS_Store",
  "Thumbs.db",
];

// Meaningful code file extensions
export const SOURCE_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".py",
  ".java",
  ".go",
  ".rs",
  ".cpp",
  ".c",
  ".cs",
  ".rb",
  ".php",
  ".sql",
  ".sh",
  ".vue",
  ".svelte",
  ".dart",
  ".kt",
  ".swift",
  ".scala",
];

// Manifest files to fetch and parse
export const MANIFEST_FILENAMES = [
  "package.json",
  "requirements.txt",
  "Pipfile",
  "pyproject.toml",
  "setup.py",
  "setup.cfg",
  "environment.yml",
  "environment.yaml",
  "pytest.ini",
  "pom.xml",
  "build.gradle",
  "go.mod",
  "Cargo.toml",
  "Dockerfile",
  "docker-compose.yml",
  "docker-compose.yaml",
  "README.md",
  "readme.md",
];
