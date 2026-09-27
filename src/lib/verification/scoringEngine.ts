import { ProjectMetrics, DetectedTechnology, SkillImpact, ProficiencyLevel } from "@/types/verification";
import { getProficiencyLevel } from "./constants";

export interface ProjectScoreResult {
  overallScore: number;
  projectWeight: number; // 0.3 - 1.0 (anti-gaming factor)
  techScores: Record<string, number>;
}

export function calculateProjectScore(
  metrics: ProjectMetrics,
  detectedTechs: DetectedTechnology[],
  totalCodeFiles: number
): ProjectScoreResult {
  // 1. Weighted Composite Score (0-100)
  const weighted =
    metrics.technologyDepth * 0.25 +
    metrics.implementationComplexity * 0.25 +
    metrics.architectureQuality * 0.15 +
    metrics.engineeringPractices * 0.15 +
    metrics.testingPractices * 0.10 +
    metrics.documentationPractices * 0.10;

  const overallScore = Math.max(15, Math.min(98, Math.round(weighted)));

  // 2. Project Evidence Weight (Anti-Gaming Guardrail)
  // Prevents inflating scores by adding dozens of trivial tutorial scripts
  let projectWeight = 0.5;
  if (totalCodeFiles <= 2) {
    projectWeight = 0.3; // Trivial / single script
  } else if (totalCodeFiles <= 6) {
    projectWeight = 0.6; // Small prototype
  } else if (totalCodeFiles <= 15) {
    projectWeight = 0.85; // Medium project
  } else {
    projectWeight = 1.0; // Substantial codebase
  }

  // Bonus for testing and DevOps
  if (metrics.testingPractices >= 60 && metrics.engineeringPractices >= 60) {
    projectWeight = Math.min(1.0, projectWeight + 0.1);
  }

  // 3. Per-Technology Evidence Scores
  const techScores: Record<string, number> = {};
  for (const t of detectedTechs) {
    // Combine technology's specific depth with project architecture weight
    const rawTech = t.score * 0.6 + overallScore * 0.4;
    techScores[t.name] = Math.max(25, Math.min(95, Math.round(rawTech * projectWeight)));
  }

  return {
    overallScore,
    projectWeight,
    techScores,
  };
}

export interface SkillProjectEvidence {
  projectId: string;
  projectTitle: string;
  evidenceScore: number;
  projectWeight: number;
}

/**
 * Aggregates skill proficiency across multiple projects using diminishing returns.
 * The highest evidence project provides the anchor; subsequent projects add diminished
 * incremental evidence.
 */
export function aggregateSkillProficiency(
  evidences: SkillProjectEvidence[],
  claimedBaseline: number = 20
): {
  percentage: number;
  level: ProficiencyLevel;
  confidence: number;
} {
  if (!evidences || evidences.length === 0) {
    const level = getProficiencyLevel(claimedBaseline);
    return {
      percentage: claimedBaseline,
      level,
      confidence: 0.2,
    };
  }

  // Sort evidences descending by evidenceScore * projectWeight
  const sorted = [...evidences].sort(
    (a, b) => b.evidenceScore * b.projectWeight - a.evidenceScore * a.projectWeight
  );

  // Highest evidence project provides the primary baseline
  const primary = sorted[0];
  let accumulated = primary.evidenceScore;

  // Add diminishing returns for subsequent projects
  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i];
    const diminishingFactor = 1 / (1 + 0.6 * i);
    const incremental = next.evidenceScore * next.projectWeight * diminishingFactor * 0.25;
    accumulated += incremental;
  }

  // Cap final percentage at 98% (reserving 100% for extraordinary multi-project mastery)
  const finalPercentage = Math.max(
    claimedBaseline,
    Math.min(98, Math.round(accumulated))
  );

  // Confidence increases with number of validating projects
  let confidence = 0.5 + Math.min(0.45, (sorted.length - 1) * 0.15);
  confidence = Math.min(0.95, parseFloat(confidence.toFixed(2)));

  const level = getProficiencyLevel(finalPercentage);

  return {
    percentage: finalPercentage,
    level,
    confidence,
  };
}

/**
 * Calculates the delta impacts on student's skills after a project verification.
 */
export function calculateSkillImpacts(
  existingSkills: {
    name: string;
    verifiedPercentage?: number;
    verifiedLevel?: ProficiencyLevel;
  }[],
  detectedTechScores: Record<string, number>,
  projectTitle: string,
  projectWeight: number
): SkillImpact[] {
  const impacts: SkillImpact[] = [];

  for (const [techName, score] of Object.entries(detectedTechScores)) {
    // Find matching student skill (case-insensitive)
    const match = existingSkills.find(
      (s) => s.name.toLowerCase().trim() === techName.toLowerCase().trim()
    );

    const prevPercentage = match?.verifiedPercentage || 20;
    const prevLevel = match?.verifiedLevel || getProficiencyLevel(prevPercentage);

    // Calculate new score with diminishing return against previous score
    const delta = Math.max(0, score - prevPercentage);
    const increment = Math.round(delta * 0.45 * projectWeight);
    const newPercentage = Math.min(95, Math.max(prevPercentage, prevPercentage + increment));
    const newLevel = getProficiencyLevel(newPercentage);

    impacts.push({
      skillName: match ? match.name : techName,
      previousPercentage: prevPercentage,
      newPercentage,
      previousLevel: prevLevel,
      newLevel,
      changeReason: `Verified by project: ${projectTitle}`,
    });
  }

  return impacts;
}
