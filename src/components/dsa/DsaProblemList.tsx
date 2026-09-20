"use client";

import React from "react";
import { DsaProblem } from "@/types/dsa";
import {
  Code2,
  CheckCircle2,
  ArrowRight,
  Building2,
  Percent,
  Sparkles,
  HelpCircle,
} from "lucide-react";

interface DsaProblemListProps {
  problems: DsaProblem[];
  solvedProblemIds: Set<string>;
  onSelectProblem: (problem: DsaProblem) => void;
}

export const DsaProblemList: React.FC<DsaProblemListProps> = ({
  problems,
  solvedProblemIds,
  onSelectProblem,
}) => {
  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Medium":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "Hard":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-slate-400 bg-slate-800 border-slate-700";
    }
  };

  if (problems.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
        <HelpCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white">No problems found</h3>
        <p className="text-xs text-slate-400 mt-1">
          Try clearing your search query or selecting a different category.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing {problems.length} problems</span>
        <span>
          {solvedProblemIds.size} Solved
        </span>
      </div>

      <div className="space-y-2.5">
        {problems.map((prob) => {
          const isSolved = solvedProblemIds.has(prob.id);

          return (
            <div
              key={prob.id}
              className={`group p-4 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isSolved
                  ? "border-emerald-500/30 bg-slate-900/60 hover:border-emerald-500/50"
                  : "border-slate-800 bg-slate-900/80 hover:border-indigo-500/40 hover:bg-slate-900/95"
              }`}
            >
              {/* Problem Info */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {isSolved ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Solved
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-600 ml-1 mr-0.5" />
                  )}

                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getDifficultyBadge(
                      prob.difficulty
                    )}`}
                  >
                    {prob.difficulty}
                  </span>

                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {prob.category}
                  </span>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Percent className="w-3 h-3 text-slate-500" />
                    {prob.acceptanceRate}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition">
                  {prob.title}
                </h3>

                {/* Company Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 mr-1">
                    Asked in:
                  </span>
                  {prob.companies.map((comp) => (
                    <span
                      key={comp}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/70 text-slate-400 border border-slate-800"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => onSelectProblem(prob)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                    isSolved
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
                  }`}
                >
                  {isSolved ? "Practice Again" : "Solve Problem"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
