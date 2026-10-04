import { GithubRepoSnapshot } from "./githubService";
import { StaticAnalysisResult } from "./analyzer";
import { AiAnalysisSummary } from "@/types/verification";

export async function evaluateWithAiOrHeuristic(
  snapshot: GithubRepoSnapshot,
  staticResult: StaticAnalysisResult
): Promise<AiAnalysisSummary> {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      const summary = await callGeminiEvaluation(snapshot, staticResult, geminiApiKey);
      if (summary) return summary;
    } catch (err) {
      console.warn("Gemini evaluation error, falling back to deterministic heuristic:", err);
    }
  }

  // Fallback: Deterministic Heuristic Synthesis based strictly on verified observable signals
  return generateDeterministicSummary(snapshot, staticResult);
}

async function callGeminiEvaluation(
  snapshot: GithubRepoSnapshot,
  staticResult: StaticAnalysisResult,
  apiKey: string
): Promise<AiAnalysisSummary | null> {
  // Try latest Gemini models in order of priority
  const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-2.5-pro"];

  const techNames = staticResult.detectedTechnologies.map((t) => t.name).join(", ");
  const metrics = staticResult.metrics;

  const prompt = `You are a Senior Staff Engineer evaluating a student's GitHub repository for evidence-based technical assessment.
CRITICAL CONSTRAINT: Do NOT hallucinate technologies. Only evaluate what is grounded in observable code evidence.

Repository Context:
- Full Name: ${snapshot.fullName}
- Description: ${snapshot.description || "N/A"}
- Total Source Files: ${snapshot.totalCodeFiles}
- Detected Technologies (from AST & manifests): ${techNames || "General Codebase"}
- Code Metrics: TechDepth=${metrics.technologyDepth}/100, ArchQuality=${metrics.architectureQuality}/100, Testing=${metrics.testingPractices}/100, Engineering=${metrics.engineeringPractices}/100, Documentation=${metrics.documentationPractices}/100
- Docker Present: ${staticResult.dockerPresent}
- CI/CD Present: ${staticResult.ciPresent}
- Test Files Count: ${staticResult.testFileCount}
- Key Manifests / Dependencies:
${snapshot.manifests.slice(0, 4).map((m) => `--- ${m.path} ---\n${m.content.slice(0, 1000)}`).join("\n\n")}
- Representative Code Snippets:
${snapshot.sourceFileSnippets.slice(0, 4).map((s) => `--- ${s.path} ---\n${s.content.slice(0, 800)}`).join("\n\n")}

CRITICAL INSTRUCTIONS:
1. Provide accurate architectural classification.
2. Identify observable Skill Gaps in this codebase (e.g. missing unit tests, absence of type hints, lack of input validation, unconfigured environment handling).
3. Identify technical Weak Points (e.g. monolithic files, hardcoded credentials, lack of async/concurrency, missing error recovery).
4. Provide concrete, actionable recommendations for the student to bridge these gaps.

Return ONLY a valid JSON object matching this schema exactly without markdown fences:
{
  "architecturalPattern": "string (e.g. Python Modular Microservice / FastAPI Clean Architecture / Next.js Full-Stack App)",
  "codeQualityTier": "Production-ready" | "Substantial Prototype" | "Learning / Tutorial" | "Minimal / Incomplete",
  "keyHighlights": ["bullet 1", "bullet 2", "bullet 3"],
  "engineeringStrengths": ["strength 1", "strength 2"],
  "skillGaps": ["skill gap 1", "skill gap 2"],
  "weakPoints": ["weak point 1", "weak point 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}`;

  for (const model of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      });

      if (!res.ok) {
        continue;
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const parsed: AiAnalysisSummary = JSON.parse(rawText);
      if (parsed.architecturalPattern && parsed.codeQualityTier) {
        return parsed;
      }
    } catch {
      // Try next model
    }
  }

  return null;
}

function generateDeterministicSummary(
  snapshot: GithubRepoSnapshot,
  staticResult: StaticAnalysisResult
): AiAnalysisSummary {
  const { metrics, detectedTechnologies, dockerPresent, ciPresent, testFileCount, readmePresent } = staticResult;
  const techNames = detectedTechnologies.map((t) => t.name);

  // Determine Architectural Pattern
  let architecturalPattern = "Modular Application Architecture";
  if (techNames.includes("Next.js")) {
    architecturalPattern = "Modern Next.js Full-Stack App Architecture";
  } else if (techNames.includes("FastAPI") || techNames.includes("Flask") || techNames.includes("Django") || techNames.includes("Python")) {
    architecturalPattern = "Python Modular Backend & Service Architecture";
  } else if (techNames.includes("Express") || techNames.includes("NestJS") || techNames.includes("Node.js")) {
    architecturalPattern = "Node.js Event-Driven Backend API Architecture";
  } else if (techNames.includes("React")) {
    architecturalPattern = "Component-Driven Client Application";
  }

  // Determine Quality Tier
  let codeQualityTier: AiAnalysisSummary["codeQualityTier"] = "Substantial Prototype";
  if (metrics.technologyDepth >= 75 && (ciPresent || dockerPresent) && testFileCount >= 2) {
    codeQualityTier = "Production-ready";
  } else if (snapshot.totalCodeFiles <= 3) {
    codeQualityTier = "Learning / Tutorial";
  } else if (snapshot.totalCodeFiles <= 1) {
    codeQualityTier = "Minimal / Incomplete";
  }

  // Highlights
  const keyHighlights: string[] = [];
  if (detectedTechnologies.length > 0) {
    keyHighlights.push(`Verified usage of ${detectedTechnologies.slice(0, 4).map((t) => t.name).join(", ")} across ${snapshot.totalCodeFiles} source files.`);
  }
  if (staticResult.databasePresent) {
    keyHighlights.push("Configured database persistence and structured data models verified in codebase.");
  }
  if (dockerPresent || ciPresent) {
    keyHighlights.push("DevOps workflows verified: Containerization and/or automated CI integration detected.");
  }
  if (readmePresent) {
    keyHighlights.push("Repository contains structured documentation detailing setup and project purpose.");
  }

  // Strengths
  const engineeringStrengths: string[] = [];
  if (metrics.architectureQuality >= 65) {
    engineeringStrengths.push("Good modular separation of concerns across directory structures.");
  }
  if (testFileCount > 0) {
    engineeringStrengths.push(`Automated testing practices demonstrated with ${testFileCount} test files.`);
  } else {
    engineeringStrengths.push("Clean project configuration and structured dependency declarations.");
  }

  // Skill Gaps
  const skillGaps: string[] = [];
  if (testFileCount === 0) {
    skillGaps.push("Automated Testing: No unit or integration test suites (e.g. pytest, unittest) found.");
  }
  if (!ciPresent) {
    skillGaps.push("Continuous Integration: Absence of GitHub Actions CI pipeline for automated testing.");
  }
  if (!dockerPresent) {
    skillGaps.push("Containerization: Missing Dockerfile / docker-compose for deterministic execution environments.");
  }

  // Weak Points
  const weakPoints: string[] = [];
  if (testFileCount === 0) {
    weakPoints.push("Code regression risk due to absence of automated test coverage.");
  }
  if (metrics.documentationPractices < 60) {
    weakPoints.push("Documentation could be expanded with API usage examples and installation prerequisites.");
  }
  if (weakPoints.length === 0) {
    weakPoints.push("Opportunity to enhance integration test coverage for boundary error conditions.");
  }

  // Recommendations
  const recommendations: string[] = [];
  if (testFileCount === 0) {
    recommendations.push("Introduce automated test suites (e.g. pytest for Python) to elevate verification confidence.");
  }
  if (!ciPresent) {
    recommendations.push("Add a GitHub Actions CI pipeline to run linters and automated tests on push.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Expand integration test coverage and document API endpoint payloads in README.");
  }

  return {
    architecturalPattern,
    codeQualityTier,
    keyHighlights,
    engineeringStrengths,
    skillGaps,
    weakPoints,
    recommendations,
  };
}

