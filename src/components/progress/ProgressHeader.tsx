"use client";

import React from "react";
import { CareerProgressStats } from "@/types/progress";
import {
  TrendingUp,
  Award,
  Target,
  Route,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface ProgressHeaderProps {
  career: CareerProgressStats;
  onOpenRoadmap?: () => void;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  career,
  onOpenRoadmap,
}) => {
  const gap = Math.max(0, career.qualificationCutoff - career.overallReadiness);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-slate-900/90 via-indigo-950/30 to-slate-900/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Performance Center • +{career.readinessDelta30Days}% 30-Day Growth</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Long-Term Career Performance
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Holistic tracking across your Career Readiness, Skill Trajectory, Learning Curriculum, Interview Rigor, and Job Pipeline Funnel.
          </p>
        </div>

        {/* Big Radial / Metric Strip */}
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800 shrink-0">
          <div className="text-center px-3">
            <div className="text-3xl font-black text-white">{career.overallReadiness}%</div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">
              Role Readiness
            </div>
            <div className="text-[10px] text-emerald-400 font-medium">
              +{career.readinessDelta30Days}% this month
            </div>
          </div>

          <div className="h-10 w-px bg-slate-800" />

          <div className="text-center px-3">
            <div className="text-2xl font-bold text-indigo-400">
              {career.roadmapCompletionPercentage}%
            </div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">
              Roadmap Done
            </div>
            <div className="text-[10px] text-slate-400">
              {career.completedMilestones}/{career.totalMilestones} Milestones
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Banner */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            Tier-1 Placement Qualification Cutoff:{" "}
            <strong className="text-white font-mono">{career.qualificationCutoff}%</strong>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-amber-400 font-medium">
            Just {gap}% away from qualifying for Stripe & Google loops
          </span>
        </div>

        {onOpenRoadmap && (
          <button
            onClick={onOpenRoadmap}
            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition self-start sm:self-auto"
          >
            <span>Active: {career.activeMilestoneTitle}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
