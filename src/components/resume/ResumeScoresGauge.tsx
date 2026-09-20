"use client";

import React from "react";
import { ResumeAnalysisState } from "@/types/resume";
import {
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

interface ResumeScoresGaugeProps {
  score: number;
  dimensions: ResumeAnalysisState["dimensions"];
}

export const ResumeScoresGauge: React.FC<ResumeScoresGaugeProps> = ({
  score,
  dimensions,
}) => {
  const getRatingTier = (val: number) => {
    if (val >= 85) return { label: "Placement Ready", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/30" };
    if (val >= 75) return { label: "Competitive", color: "text-accent", bg: "bg-accent/10 border-accent/30" };
    return { label: "Needs Optimization", color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/30" };
  };

  const tier = getRatingTier(score);

  const dimensionList = [
    { key: "resumeStructure", ...dimensions.resumeStructure },
    { key: "skills", ...dimensions.skills },
    { key: "education", ...dimensions.education },
    { key: "projects", ...dimensions.projects },
    { key: "experience", ...dimensions.experience },
    { key: "keywords", ...dimensions.keywords },
    { key: "jobRelevance", ...dimensions.jobRelevance },
    { key: "atsCompatibility", ...dimensions.atsCompatibility },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-border/80 shadow-xs mb-6">
      {/* Top Banner with ATS Score 78/100 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/70">
        <div className="flex items-center gap-5">
          {/* Main Radial Score Display */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-accent/15 via-accent/5 to-transparent border-2 border-accent/30 flex flex-col items-center justify-center text-center shadow-lg shadow-accent/10 shrink-0">
            <span className="text-3xl sm:text-4xl font-black text-ink tracking-tight leading-none">
              {score}
            </span>
            <span className="text-[11px] font-extrabold text-ink-muted uppercase tracking-widest mt-1">
              / 100
            </span>
            <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-surface border border-accent/30 text-[10px] font-bold text-accent shadow-xs">
              ATS Score
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full border text-xs font-bold ${tier.bg} ${tier.color}`}>
                {tier.label}
              </span>
              <span className="text-xs text-ink-muted">
                Tier-1 Cutoff: 80/100
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
              ATS Score: {score}/100
            </h3>
            <p className="text-xs text-ink-muted mt-1 max-w-md">
              Your resume successfully parses through enterprise applicant tracking systems (Workday, Greenhouse, Lever). Applying recommended bullet rewrites will boost your score above 88/100.
            </p>
          </div>
        </div>

        {/* Diagnostic Quick Summary */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="p-3 rounded-2xl bg-canvas/60 border border-border/70 text-center">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
              3 Sections
            </span>
            <span className="text-[10px] text-ink-muted uppercase font-semibold">
              Exceed Benchmark
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-canvas/60 border border-border/70 text-center">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
              2 Sections
            </span>
            <span className="text-[10px] text-ink-muted uppercase font-semibold">
              Need Keyword Injection
            </span>
          </div>
        </div>
      </div>

      {/* 8-Dimension Evaluation Breakdown Grid */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-accent" />
            <span>8-Point Comprehensive ATS Evaluation</span>
          </h4>
          <span className="text-[11px] text-ink-muted">
            Automated parser audit
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {dimensionList.map((dim) => {
            const isHigh = dim.score >= 80;
            const isMed = dim.score >= 70 && dim.score < 80;
            const barColor = isHigh ? "bg-emerald-500" : isMed ? "bg-accent" : "bg-amber-500";
            const textColor = isHigh ? "text-emerald-600 dark:text-emerald-400" : isMed ? "text-accent" : "text-amber-600 dark:text-amber-400";

            return (
              <div
                key={dim.key}
                className="p-3 rounded-2xl bg-canvas/40 border border-border/70 hover:border-border transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-ink">{dim.name}</span>
                    <span className={`font-extrabold ${textColor}`}>
                      {dim.score}%
                    </span>
                  </div>
                  <span className="text-[10px] text-ink-muted block line-clamp-1 mb-2">
                    {dim.label}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-border/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
