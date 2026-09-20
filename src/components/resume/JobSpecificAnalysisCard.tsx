"use client";

import React, { useState } from "react";
import { JobSpecificComparison } from "@/types/resume";
import { JOB_SPECIFIC_COMPARISONS } from "@/data/mockResumeData";
import {
  Briefcase,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Building2,
} from "lucide-react";

interface JobSpecificAnalysisCardProps {
  currentComparison?: JobSpecificComparison;
  onSelectJob: (jobId: string) => void;
}

export const JobSpecificAnalysisCard: React.FC<JobSpecificAnalysisCardProps> = ({
  currentComparison = JOB_SPECIFIC_COMPARISONS["job-stripe-intern"],
  onSelectJob,
}) => {
  const comparison = currentComparison || JOB_SPECIFIC_COMPARISONS["job-stripe-intern"];
  const availableJobs = Object.values(JOB_SPECIFIC_COMPARISONS);

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-border/80 shadow-xs mb-6 space-y-5">
      {/* Header & Target Job Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-accent/10 text-accent">
              <ArrowRightLeft className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Job-Specific Resume Alignment
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-ink tracking-tight">
            Resume ↔ Job Requirements Benchmark
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Compare your active resume directly against an open target job description.
          </p>
        </div>

        {/* Dropdown to switch job */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-ink-muted shrink-0">
            Target Role:
          </label>
          <select
            value={comparison.jobId}
            onChange={(e) => onSelectJob(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-canvas border border-border text-ink focus:outline-accent"
          >
            {availableJobs.map((j) => (
              <option key={j.jobId} value={j.jobId}>
                {j.company} — {j.jobTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Role & Match Banner */}
      <div className="p-4 rounded-2xl bg-canvas/60 border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-surface border border-border/90 flex items-center justify-center font-bold text-lg text-ink shadow-xs shrink-0">
            {comparison.company.slice(0, 1)}
          </div>
          <div>
            <span className="text-xs font-bold text-ink-muted uppercase tracking-wider block">
              {comparison.company}
            </span>
            <h3 className="text-base font-bold text-ink leading-tight">
              {comparison.jobTitle}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <span className="text-2xl font-black text-accent block leading-none">
              {comparison.matchScore}%
            </span>
            <span className="text-[10px] font-bold text-ink-muted uppercase">
              Role Match Score
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-bold text-sm">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Keywords Comparison (Matching vs Missing) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matching Keywords in Resume */}
        <div className="p-4 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/25 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Matching Job Keywords ({comparison.matchingKeywords.length})</span>
            </h4>
            <span className="text-[10px] text-emerald-600 font-semibold">
              Found in Resume
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {comparison.matchingKeywords.map((kw) => (
              <span
                key={kw}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 shadow-2xs"
              >
                ✓ {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Keywords from Job Description */}
        <div className="p-4 rounded-2xl bg-amber-500/[0.04] border border-amber-500/25 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Missing Keywords ({comparison.missingKeywords.length})</span>
            </h4>
            <span className="text-[10px] text-amber-600 font-semibold">
              Recommended to Add
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {comparison.missingKeywords.map((kw) => (
              <span
                key={kw}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface border border-amber-500/30 text-amber-700 dark:text-amber-300 shadow-2xs"
              >
                + {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Role-Specific AI Improvement Advice */}
      <div className="p-4 rounded-2xl bg-canvas/40 border border-border/80 space-y-2.5">
        <h4 className="text-xs font-bold text-ink flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-accent" />
          <span>Tailoring Advice for {comparison.company}</span>
        </h4>

        <ul className="space-y-2">
          {comparison.tailoringSuggestions.map((sug, idx) => (
            <li key={idx} className="text-xs text-ink/90 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
              <span className="leading-relaxed">{sug}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
