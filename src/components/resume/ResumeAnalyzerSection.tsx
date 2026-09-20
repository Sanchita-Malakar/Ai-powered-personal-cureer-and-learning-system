"use client";

import React, { useState, useEffect } from "react";
import { ResumeAnalysisState } from "@/types/resume";
import { INITIAL_RESUME_ANALYSIS, JOB_SPECIFIC_COMPARISONS } from "@/data/mockResumeData";
import { ResumeUploadCard } from "@/components/resume/ResumeUploadCard";
import { ResumeScoresGauge } from "@/components/resume/ResumeScoresGauge";
import { StrengthsWeaknessesCard } from "@/components/resume/StrengthsWeaknessesCard";
import { AiSuggestionsCard } from "@/components/resume/AiSuggestionsCard";
import { JobSpecificAnalysisCard } from "@/components/resume/JobSpecificAnalysisCard";
import { ArrowLeft, CheckCircle2, RotateCcw, FileText } from "lucide-react";

interface ResumeAnalyzerSectionProps {
  initialJobId?: string;
  onBackToDashboard?: () => void;
}

export const ResumeAnalyzerSection: React.FC<ResumeAnalyzerSectionProps> = ({
  initialJobId = "job-stripe-intern",
  onBackToDashboard,
}) => {
  const [analysis, setAnalysis] = useState<ResumeAnalysisState>(INITIAL_RESUME_ANALYSIS);
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync initialJobId if passed from props
  useEffect(() => {
    if (initialJobId && JOB_SPECIFIC_COMPARISONS[initialJobId]) {
      setSelectedJobId(initialJobId);
    }
  }, [initialJobId]);

  // Hydrate from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("career_os_resume_analysis");
      if (saved) {
        try {
          setAnalysis(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, []);

  const persistAnalysis = (updated: ResumeAnalysisState) => {
    setAnalysis(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("career_os_resume_analysis", JSON.stringify(updated));
    }
  };

  const handleUploadNewFile = (name: string, size: string) => {
    const updated: ResumeAnalysisState = {
      ...analysis,
      fileName: name,
      fileSize: size,
      uploadedAt: "Just now",
    };
    persistAnalysis(updated);
    handleRunScan();
    setToastMessage(`Uploaded ${name}. Initiating full 8-point ATS diagnostic!`);
  };

  const handleRunScan = () => {
    setIsScanning(true);
    setScanStep(0);

    const interval = setInterval(() => {
      setScanStep((prev) => {
        if (prev >= 7) {
          clearInterval(interval);
          setIsScanning(false);
          setToastMessage("Resume ATS diagnostic completed successfully!");
          setTimeout(() => setToastMessage(null), 3000);
          return 7;
        }
        return prev + 1;
      });
    }, 350);
  };

  const handleApplyBulletRewrite = (id: string) => {
    const updatedRewrites = analysis.bulletRewrites.map((r) =>
      r.id === id ? { ...r, applied: !r.applied } : r
    );

    const appliedCount = updatedRewrites.filter((r) => r.applied).length;
    const newScore = Math.min(94, 78 + appliedCount * 4);

    const updated: ResumeAnalysisState = {
      ...analysis,
      overallAtsScore: newScore,
      bulletRewrites: updatedRewrites,
      dimensions: {
        ...analysis.dimensions,
        projects: {
          ...analysis.dimensions.projects,
          score: Math.min(92, 72 + appliedCount * 7),
        },
      },
    };

    persistAnalysis(updated);
    setToastMessage(`Project bullet applied to resume! ATS score increased to ${newScore}/100.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddMissingSkill = (id: string) => {
    const updatedSkills = analysis.missingSkills.map((sk) =>
      sk.id === id ? { ...sk, added: !sk.added } : sk
    );

    const addedSkill = analysis.missingSkills.find((s) => s.id === id);
    const addedCount = updatedSkills.filter((s) => s.added).length;
    const newScore = Math.min(96, analysis.overallAtsScore + 2);

    const updated: ResumeAnalysisState = {
      ...analysis,
      overallAtsScore: newScore,
      missingSkills: updatedSkills,
      dimensions: {
        ...analysis.dimensions,
        keywords: {
          ...analysis.dimensions.keywords,
          score: Math.min(92, 65 + addedCount * 6),
        },
      },
    };

    persistAnalysis(updated);
    setToastMessage(
      addedSkill && !addedSkill.added
        ? `Added ${addedSkill.name} to resume skills section! ATS score increased to ${newScore}/100.`
        : "Updated skills section."
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResetAnalysis = () => {
    persistAnalysis(INITIAL_RESUME_ANALYSIS);
    setToastMessage("Resume Analyzer reset to default baseline.");
    setTimeout(() => setToastMessage(null), 2500);
  };

  const currentJobComparison =
    JOB_SPECIFIC_COMPARISONS[selectedJobId] || JOB_SPECIFIC_COMPARISONS["job-stripe-intern"];

  return (
    <div className="animate-in fade-in duration-300">
      {/* Top Breadcrumb Navigation */}
      {onBackToDashboard && (
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface hover:bg-canvas border border-border/80 text-xs font-semibold text-ink-muted hover:text-ink transition-all shadow-2xs group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Dashboard Overview</span>
          </button>

          <span className="text-[11px] font-semibold text-ink-muted bg-surface/70 px-2.5 py-1 rounded-lg border border-border/60">
            Navigation: Left Sidebar → Resume Analyzer
          </span>
        </div>
      )}

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </span>
        </div>
      )}

      {/* 1. Resume Upload Card */}
      <ResumeUploadCard
        fileName={analysis.fileName}
        fileSize={analysis.fileSize}
        uploadedAt={analysis.uploadedAt}
        onUploadNewFile={handleUploadNewFile}
        onRunScan={handleRunScan}
        isScanning={isScanning}
        scanStep={scanStep}
      />

      {/* 2. Result UI: ATS Score 78/100 & 8-Dimension Breakdown */}
      <ResumeScoresGauge
        score={analysis.overallAtsScore}
        dimensions={analysis.dimensions}
      />

      {/* 3. Strengths & Weaknesses */}
      <StrengthsWeaknessesCard
        strengths={analysis.strengths}
        weaknesses={analysis.weaknesses}
      />

      {/* 4. AI Suggestions (Bullet Rewriter, Measurable Results, Missing Skills) */}
      <AiSuggestionsCard
        bulletRewrites={analysis.bulletRewrites}
        measurableTips={analysis.measurableTips}
        missingSkills={analysis.missingSkills}
        onApplyBulletRewrite={handleApplyBulletRewrite}
        onAddMissingSkill={handleAddMissingSkill}
      />

      {/* 5. Job-Specific Resume Analysis (Resume ↔ Job Requirements) */}
      <JobSpecificAnalysisCard
        currentComparison={currentJobComparison}
        onSelectJob={setSelectedJobId}
      />

      {/* Footer Reset */}
      <div className="mt-8 pt-4 border-t border-border/70 flex items-center justify-between text-xs text-ink-muted">
        <span>CareerOS Enterprise ATS Parsing Engine</span>
        <button
          type="button"
          onClick={handleResetAnalysis}
          className="inline-flex items-center gap-1 text-ink-muted hover:text-action transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Analysis to Default</span>
        </button>
      </div>
    </div>
  );
};
