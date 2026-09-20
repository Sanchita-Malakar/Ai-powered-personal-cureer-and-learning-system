"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  DsaProblem,
  DsaCategory,
  DsaDifficulty,
  DsaUserStats,
  SubmissionResult,
} from "@/types/dsa";
import {
  DSA_PROBLEMS,
  INITIAL_DSA_STATS,
} from "@/data/mockDsaData";
import { DsaOverviewMetrics } from "./DsaOverviewMetrics";
import { DsaCategoryFilter } from "./DsaCategoryFilter";
import { DsaProblemList } from "./DsaProblemList";
import { DsaCodingWorkspace } from "./DsaCodingWorkspace";
import {
  Code2,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Award,
} from "lucide-react";

interface DsaTrainerSectionProps {
  onBackToDashboard?: () => void;
  onOpenRoadmap?: () => void;
}

export const DsaTrainerSection: React.FC<DsaTrainerSectionProps> = ({
  onBackToDashboard,
  onOpenRoadmap,
}) => {
  const [view, setView] = useState<"overview" | "workspace">("overview");
  const [activeProblem, setActiveProblem] = useState<DsaProblem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<DsaCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<DsaDifficulty | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState<"All" | "Solved" | "Unsolved">("All");
  const [stats, setStats] = useState<DsaUserStats>(INITIAL_DSA_STATS);
  const [solvedProblemIds, setSolvedProblemIds] = useState<Set<string>>(
    new Set(["dsa-arr-two-sum", "dsa-stk-valid-parens"])
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedSolved = localStorage.getItem("career_os_dsa_solved_ids");
      if (savedSolved) {
        const parsed = JSON.parse(savedSolved);
        if (Array.isArray(parsed)) {
          setSolvedProblemIds(new Set(parsed));
        }
      }
      const savedStats = localStorage.getItem("career_os_dsa_stats");
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch {
      // ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return DSA_PROBLEMS.filter((prob) => {
      // Category filter
      if (selectedCategory !== "All" && prob.category !== selectedCategory) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== "All" && prob.difficulty !== selectedDifficulty) {
        return false;
      }
      // Solved filter
      const isSolved = solvedProblemIds.has(prob.id);
      if (selectedStatus === "Solved" && !isSolved) return false;
      if (selectedStatus === "Unsolved" && isSolved) return false;

      // Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchTitle = prob.title.toLowerCase().includes(q);
        const matchCategory = prob.category.toLowerCase().includes(q);
        const matchCompany = prob.companies.some((c) => c.toLowerCase().includes(q));
        if (!matchTitle && !matchCategory && !matchCompany) return false;
      }

      return true;
    });
  }, [
    selectedCategory,
    selectedDifficulty,
    selectedStatus,
    searchQuery,
    solvedProblemIds,
  ]);

  // Open problem
  const handleSelectProblem = (problem: DsaProblem) => {
    setActiveProblem(problem);
    setView("workspace");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Start recommended problem from AI callout
  const handleStartRecommended = (problemId: string) => {
    const target =
      DSA_PROBLEMS.find((p) => p.id === problemId) || DSA_PROBLEMS[0];
    handleSelectProblem(target);
  };

  // Problem solved callback
  const handleProblemSolved = (problemId: string, result: SubmissionResult) => {
    const nextSolved = new Set(solvedProblemIds);
    nextSolved.add(problemId);
    setSolvedProblemIds(nextSolved);

    // Update Stats
    const problem = DSA_PROBLEMS.find((p) => p.id === problemId);
    if (!problem) return;

    setStats((prev) => {
      const topic = prev.topicMastery[problem.category];
      const newSolvedCount = (topic?.solvedCount || 0) + 1;
      const newAccuracy = Math.min(
        100,
        (topic?.accuracy || 50) + (problem.difficulty === "Hard" ? 10 : 7)
      );

      const updatedTopicMastery = {
        ...prev.topicMastery,
        [problem.category]: {
          ...topic,
          solvedCount: newSolvedCount,
          accuracy: newAccuracy,
          status: (newAccuracy >= 75 ? "Mastered" : newAccuracy >= 55 ? "Intermediate" : "Weak Area") as "Mastered" | "Intermediate" | "Weak Area",
        },
      };

      // Check if Trees is still lowest
      const updatedWeakAreas = Object.values(updatedTopicMastery)
        .filter((t) => t.accuracy < 60)
        .map((t) => t.category);

      const nextStats: DsaUserStats = {
        ...prev,
        totalSolved: prev.totalSolved + 1,
        overallAccuracy: Math.min(100, prev.overallAccuracy + 1),
        topicMastery: updatedTopicMastery,
        weakAreas: updatedWeakAreas,
        aiRecommendation:
          updatedTopicMastery.Trees.accuracy >= 55
            ? "Great improvement in Trees! Next, proceed to Graph Cycle Detection (Course Schedule)."
            : prev.aiRecommendation,
      };

      try {
        localStorage.setItem(
          "career_os_dsa_solved_ids",
          JSON.stringify(Array.from(nextSolved))
        );
        localStorage.setItem("career_os_dsa_stats", JSON.stringify(nextStats));
      } catch {
        // ignore
      }

      return nextStats;
    });

    showToast(
      `Accepted! ${problem.title} solved. Your ${problem.category} accuracy increased!`
    );
  };

  return (
    <div className="min-h-screen text-slate-100 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb Navigation */}
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
            <Code2 className="w-3.5 h-3.5" />
            DSA & Skill Trainer
          </span>
          {view === "workspace" && activeProblem && (
            <>
              <span>/</span>
              <span className="text-slate-200 font-medium">
                {activeProblem.title}
              </span>
            </>
          )}
        </div>

        {view === "workspace" && (
          <button
            onClick={() => setView("overview")}
            className="text-xs font-medium text-slate-400 hover:text-white hover:underline transition flex items-center gap-1"
          >
            ← Back to All Problems
          </button>
        )}
      </div>

      {/* VIEW 1: OVERVIEW (METRICS + CATEGORIES + PROBLEM LIST) */}
      {view === "overview" && (
        <div className="space-y-6">
          <DsaOverviewMetrics
            stats={stats}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onStartRecommendedProblem={handleStartRecommended}
          />

          <DsaCategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={setSelectedDifficulty}
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
          />

          <DsaProblemList
            problems={filteredProblems}
            solvedProblemIds={solvedProblemIds}
            onSelectProblem={handleSelectProblem}
          />
        </div>
      )}

      {/* VIEW 2: CODING WORKSPACE (PROBLEM STATEMENT, MONOSPACE EDITOR, EVALUATION) */}
      {view === "workspace" && activeProblem && (
        <DsaCodingWorkspace
          problem={activeProblem}
          onBack={() => setView("overview")}
          onProblemSolved={handleProblemSolved}
          onNextProblem={() => {
            const next = DSA_PROBLEMS.find((p) => p.id !== activeProblem.id);
            if (next) handleSelectProblem(next);
            else setView("overview");
          }}
        />
      )}
    </div>
  );
};
