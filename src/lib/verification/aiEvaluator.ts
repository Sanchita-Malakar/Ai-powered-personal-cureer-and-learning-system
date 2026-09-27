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
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const techNames = staticResult.detectedTechnologies.map((t) => t.name).join(", ");
  const metrics = staticResult.metrics;

  const prompt = `You are a Senior Engineering Lead evaluating a student's GitHub repository for evidence-based skill verification.
CRITICAL CONSTRAINT: Do NOT hallucinate technologies. Only evaluate what is grounded in observable code evidence.

Repository Context:
- Repository: ${snapshot.fullName}
- Description: ${snapshot.description || "N/A"}
- Total Source Files: ${snapshot.totalCodeFiles}
- Detected Technologies (from AST & manifests): ${techNames || "General Codebase"}
- Code Metrics: TechDepth=${metrics.technologyDepth}/100, ArchQuality=${metrics.architectureQuality}/100, Testing=${metrics.testingPractices}/100, Engineering=${metrics.engineeringPractices}/100
- Docker Present: ${staticResult.dockerPresent}
- CI/CD Present: ${staticResult.ciPresent}
- Test Files: ${staticResult.testFileCount}

Return a valid JSON object matching this schema exactly without markdown formatting:
{
  "architecturalPattern": "string (e.g. Modern Full-Stack App Router Architecture / Layered REST Microservice)",
  "codeQualityTier": "Production-ready" | "Substantial Prototype" | "Learning / Tutorial" | "Minimal / Incomplete",
  "keyHighlights": ["bullet 1", "bullet 2", "bullet 3"],
  "engineeringStrengths": ["bullet 1", "bullet 2"],
  "recommendations": ["bullet 1", "bullet 2"]
}`;

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

  if (!res.ok) return null;

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) return null;

  try {
    const parsed: AiAnalysisSummary = JSON.parse(rawText);
    return parsed;
  } catch {
    return null;
  }
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
  } else if (techNames.includes("FastAPI") || techNames.includes("Flask") || techNames.includes("Django")) {
    architecturalPattern = "Python RESTful Backend & Microservice Architecture";
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

  // Recommendations
  const recommendations: string[] = [];
  if (testFileCount === 0) {
    recommendations.push("Introduce automated test suites (unit & integration tests) to elevate verification confidence.");
  }
  if (!ciPresent) {
    recommendations.push("Add a GitHub Actions CI pipeline to run linter and automated build checks.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Expand integration test coverage and document API endpoint payloads in README.");
  }

  return {
    architecturalPattern,
    codeQualityTier,
    keyHighlights,
    engineeringStrengths,
    recommendations,
  };
}
