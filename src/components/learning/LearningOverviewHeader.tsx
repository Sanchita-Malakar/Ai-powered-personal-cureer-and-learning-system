"use client";

import React from "react";
import { LearningEngineStats } from "@/types/learning";
import {
  BookOpen,
  Sparkles,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Brain,
  Zap,
} from "lucide-react";

interface LearningOverviewHeaderProps {
  stats: LearningEngineStats;
}

export const LearningOverviewHeader: React.FC<LearningOverviewHeaderProps> = ({
  stats,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-slate-900/90 via-indigo-950/30 to-slate-900/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
            <BookOpen className="w-3.5 h-3.5" />
            AI Adaptive Learning System
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Personalized Career Curriculum
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Curated interactive lessons, engineering deep dives, and knowledge quizzes tailored to your target role and skill gaps.
          </p>
        </div>

        {/* Top Summary Badges */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 shrink-0">
          <div className="text-center px-2">
            <div className="text-xl font-bold text-white">
              {stats.completedModulesCount} / {stats.totalModulesCount}
            </div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">
              Completed
            </div>
          </div>
          <div className="h-7 w-px bg-slate-800" />
          <div className="text-center px-2">
            <div className="text-xl font-bold text-emerald-400">
              {stats.overallProgressPercentage}%
            </div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">
              Progress
            </div>
          </div>
          <div className="h-7 w-px bg-slate-800" />
          <div className="text-center px-2">
            <div className="text-xl font-bold text-indigo-400">
              {stats.hoursInvested}h
            </div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">
              Invested
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Engine Tripartite Formula Banner */}
      <div className="mt-6 pt-5 border-t border-slate-800/80">
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-950/70 border border-indigo-500/30 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Recommendation Engine Tripartite Formula
              </span>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Target: {stats.careerGoal}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                1. Career Goal
              </span>
              <span className="font-semibold text-white">{stats.careerGoal}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                2. Skill Gaps Identified
              </span>
              <span className="font-semibold text-amber-400">
                SQL (52%), Trees (43%), ML (42%)
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                3. Past Performance
              </span>
              <span className="font-semibold text-indigo-300">
                DSA Intermediate • 77% Accuracy
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-1">
            {stats.activeRecommendationReason}
          </p>
        </div>
      </div>
    </div>
  );
};
