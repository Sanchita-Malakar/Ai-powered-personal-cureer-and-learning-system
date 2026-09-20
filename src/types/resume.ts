export interface DimensionScore {
  name: string;
  score: number; // 0 - 100
  label: string;
  description: string;
}

export interface BulletRewrite {
  id: string;
  originalBullet: string;
  rewrittenBullet: string;
  impactExplanation: string;
  applied: boolean;
}

export interface MeasurableResultTip {
  id: string;
  section: string;
  guidance: string;
  exampleFormula: string;
}

export interface MissingSkillRecommendation {
  id: string;
  name: string;
  category: "languages" | "frameworks" | "database" | "tools" | "architecture";
  importance: "critical" | "recommended" | "bonus";
  frequencyInJobs: string;
  added: boolean;
}

export interface JobSpecificComparison {
  jobId: string;
  jobTitle: string;
  company: string;
  matchScore: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  tailoringSuggestions: string[];
}

export interface ResumeAnalysisState {
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  overallAtsScore: number; // e.g. 78
  dimensions: {
    resumeStructure: DimensionScore;
    skills: DimensionScore;
    education: DimensionScore;
    projects: DimensionScore;
    experience: DimensionScore;
    keywords: DimensionScore;
    jobRelevance: DimensionScore;
    atsCompatibility: DimensionScore;
  };
  strengths: string[];
  weaknesses: string[];
  bulletRewrites: BulletRewrite[];
  measurableTips: MeasurableResultTip[];
  missingSkills: MissingSkillRecommendation[];
  jobSpecificAnalysis?: JobSpecificComparison;
}
