"use client";

import React, { useState, useEffect } from "react";
import { ProgressPageData } from "@/types/progress";
import { MOCK_PROGRESS_DATA } from "@/data/mockProgressData";
import { ProgressHeader } from "./ProgressHeader";
import { AiTrendAnalysisCards } from "./AiTrendAnalysisCards";
import { SkillProgressSection } from "./SkillProgressSection";
import { LearningAndInterviewCard } from "./LearningAndInterviewCard";
import { JobFunnelCard } from "./JobFunnelCard";
import {
  TrendingUp,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

interface ProgressSectionProps {
  onBackToDashboard?: () => void;
  onNavigateSection?: (sectionId: string, paramId?: string) => void;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({
  onBackToDashboard,
  onNavigateSection,
}) => {
  const [data, setData] = useState<ProgressPageData>(MOCK_PROGRESS_DATA);

  // Load any dynamic progress boosts from localStorage on mount
  useEffect(() => {
    try {
      const interviewReadiness = localStorage.getItem("career_os_interview_readiness");
      const dsaStats = localStorage.getItem("career_os_dsa_stats");
      const learningStats = localStorage.getItem("career_os_learning_stats");

      if (interviewReadiness || dsaStats || learningStats) {
        setData((prev) => {
          let updatedReadiness = prev.career.overallReadiness;
          if (interviewReadiness) {
            updatedReadiness = Math.max(updatedReadiness, JSON.parse(interviewReadiness));
          }

          return {
            ...prev,
            career: {
              ...prev.career,
              overallReadiness: updatedReadiness,
            },
          };
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const handleTriggerAction = (section: string, paramId?: string) => {
    if (onNavigateSection) {
      onNavigateSection(section, paramId);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="hover:text-white transition flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-800/80"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Dashboard Overview
            </button>
          )}
          <span>/</span>
          <span className="text-indigo-400 font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Performance & Progress Center
          </span>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          Rolling 30-Day Analysis
        </span>
      </div>

      {/* 1. Career Progress Header */}
      <ProgressHeader
        career={data.career}
        onOpenRoadmap={() => handleTriggerAction("roadmap")}
      />

      {/* 2. AI Trend Analysis Cards (Prompt Insights) */}
      <AiTrendAnalysisCards
        insights={data.aiTrends}
        onTriggerAction={handleTriggerAction}
      />

      {/* 3. Skill Progress Section & 6-Month Trajectory Recharts Graph */}
      <SkillProgressSection
        skills={data.skills}
        trajectory={data.skillTrajectory}
        onOpenSkillModule={(skill) => {
          if (skill === "DSA") handleTriggerAction("dsa");
          else if (skill === "Python" || skill === "SQL" || skill === "AI/ML") {
            handleTriggerAction("learning");
          }
        }}
      />

      {/* 4. Learning & Interview Progress Cards */}
      <LearningAndInterviewCard
        learning={data.learning}
        interview={data.interview}
        onOpenLearning={() => handleTriggerAction("learning")}
        onOpenInterview={() => handleTriggerAction("interview")}
      />

      {/* 5. Job Progress Funnel */}
      <JobFunnelCard
        jobs={data.jobs}
        onOpenJobTracker={() => handleTriggerAction("jobs")}
      />
    </div>
  );
};
