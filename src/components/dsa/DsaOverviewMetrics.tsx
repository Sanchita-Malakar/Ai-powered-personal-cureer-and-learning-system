"use client";

import React from "react";
import { DsaUserStats, DsaCategory } from "@/types/dsa";
import {
  Code2,
  Sparkles,
  Target,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  ArrowRight,
  Flame,
  Award,
} from "lucide-react";

interface DsaOverviewMetricsProps {
  stats: DsaUserStats;
  selectedCategory: DsaCategory | "All";
  onSelectCategory: (cat: DsaCategory | "All") => void;
  onStartRecommendedProblem: (problemId: string) => void;
}

export const DsaOverviewMetrics: React.FC<DsaOverviewMetricsProps> = ({
  stats,
  selectedCategory,
  onSelectCategory,
  onStartRecommendedProblem,
}) => {
  const getAccuracyColor = (acc: number) => {
    if (acc >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (acc >= 65) return "text-blue-400 bg-blue-500/10 border-blue-500/30";
    return "text-rose-400 bg-rose-500/10 border-rose-500/30";
  };

  const getAccuracyBarGradient = (acc: number) => {
    if (acc >= 80) return "bg-gradient-to-r from-emerald-500 to-teal-400";
    if (acc >= 65) return "bg-gradient-to-r from-blue-500 to-cyan-400";
    return "bg-gradient-to-r from-rose-500 to-amber-500";
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-slate-900/90 via-indigo-950/30 to-slate-900/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
              <Code2 className="w-3.5 h-3.5" />
              Algorithmic Proficiency & Skill Trainer
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              DSA & Skill Practice Arena
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Master core computer science algorithms, practice curated LeetCode & FAANG questions with live code evaluations, and strengthen targeted weak areas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-center px-2">
                <div className="text-xl font-bold text-white">{stats.totalSolved}</div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">Solved</div>
              </div>
              <div className="h-7 w-px bg-slate-800" />
              <div className="text-center px-2">
                <div className="text-xl font-bold text-emerald-400">{stats.overallAccuracy}%</div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">Accuracy</div>
              </div>
              <div className="h-7 w-px bg-slate-800" />
              <div className="text-center px-2">
                <div className="text-xl font-bold text-indigo-400">
                  {Math.round(stats.totalTimeSpentMinutes / 60)}h
                </div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">Practice</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight Callout */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-indigo-950/40 to-slate-950/70 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    AI Diagnostic Coaching
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">
                    Weak Area: Trees (43%)
                  </span>
                </div>
                <p className="text-sm font-semibold text-white">
                  &ldquo;{stats.aiRecommendation}&rdquo;
                </p>
                <p className="text-xs text-slate-300 leading-snug">
                  {stats.prerequisiteReasoning}
                </p>
              </div>
            </div>

            <button
              onClick={() => onStartRecommendedProblem(stats.recommendedProblemId)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition shadow-lg shadow-amber-500/20 shrink-0 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-slate-900 fill-slate-900" />
              Solve Level Order Traversal
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>
        </div>
      </div>

      {/* 9-Topic Mastery Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              Topic Accuracy & Skill Distribution
            </h2>
            <p className="text-xs text-slate-400">
              Click any category card to filter problem drills
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Target Benchmark: ≥ 75%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Object.values(stats.topicMastery).map((mastery) => {
            const isSelected = selectedCategory === mastery.category;
            const isWeak = mastery.status === "Weak Area";

            return (
              <div
                key={mastery.category}
                onClick={() =>
                  onSelectCategory(isSelected ? "All" : mastery.category)
                }
                className={`p-4 rounded-xl border transition cursor-pointer select-none relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-950/40"
                    : isWeak
                    ? "border-rose-500/30 bg-slate-900/80 hover:border-rose-500/50"
                    : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">
                      {mastery.category}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getAccuracyColor(
                        mastery.accuracy
                      )}`}
                    >
                      {mastery.accuracy}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${getAccuracyBarGradient(
                        mastery.accuracy
                      )}`}
                      style={{ width: `${mastery.accuracy}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>
                    {mastery.solvedCount} / {mastery.totalCount} Solved
                  </span>
                  <span
                    className={`capitalize font-medium ${
                      isWeak ? "text-rose-400 font-bold" : "text-slate-400"
                    }`}
                  >
                    {mastery.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
