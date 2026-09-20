"use client";

import React, { useState, useEffect } from "react";
import {
  LearningItem,
  LearningEngineStats,
  QuizEvaluationResult,
} from "@/types/learning";
import {
  RECOMMENDED_LEARNING_ITEMS,
  INITIAL_LEARNING_STATS,
} from "@/data/mockLearningData";
import { LearningOverviewHeader } from "./LearningOverviewHeader";
import { RecommendedTracksGrid } from "./RecommendedTracksGrid";
import { LearningRoom } from "./LearningRoom";
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface LearningSectionProps {
  onBackToDashboard?: () => void;
  onNavigateToRoadmap?: () => void;
}

export const LearningSection: React.FC<LearningSectionProps> = ({
  onBackToDashboard,
  onNavigateToRoadmap,
}) => {
  const [view, setView] = useState<"catalog" | "room">("catalog");
  const [activeItem, setActiveItem] = useState<LearningItem | null>(null);
  const [stats, setStats] = useState<LearningEngineStats>(INITIAL_LEARNING_STATS);
  const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem("career_os_completed_topics");
      if (savedCompleted) {
        const parsed = JSON.parse(savedCompleted);
        if (Array.isArray(parsed)) {
          setCompletedTopicIds(new Set(parsed));
        }
      }

      const savedStats = localStorage.getItem("career_os_learning_stats");
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

  const handleSelectTopic = (item: LearningItem) => {
    setActiveItem(item);
    setView("room");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCompleteFlow = (topicId: string, evaluation: QuizEvaluationResult) => {
    const nextCompleted = new Set(completedTopicIds);
    nextCompleted.add(topicId);
    setCompletedTopicIds(nextCompleted);

    setStats((prev) => {
      const nextCompletedCount = prev.completedModulesCount + 1;
      const nextProgress = Math.min(100, prev.overallProgressPercentage + 8);
      const updatedStats: LearningEngineStats = {
        ...prev,
        completedModulesCount: nextCompletedCount,
        overallProgressPercentage: nextProgress,
        hoursInvested: Number((prev.hoursInvested + 1.5).toFixed(1)),
        activeRecommendationHeadline: `Curriculum updated following ${evaluation.score}% quiz score on ${activeItem?.topic}`,
      };

      try {
        localStorage.setItem(
          "career_os_completed_topics",
          JSON.stringify(Array.from(nextCompleted))
        );
        localStorage.setItem("career_os_learning_stats", JSON.stringify(updatedStats));
        localStorage.setItem("career_os_skill_boost", JSON.stringify(evaluation.progressBoost));
      } catch {
        // ignore
      }

      return updatedStats;
    });

    showToast(
      `Quiz Passed! ${activeItem?.topic} completed. +${evaluation.progressBoost}% boost added to Career Progress!`
    );
  };

  const handleNavigateToTopic = (topicId: string) => {
    const target =
      RECOMMENDED_LEARNING_ITEMS.find((t) => t.id === topicId) ||
      RECOMMENDED_LEARNING_ITEMS[0];
    handleSelectTopic(target);
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
            <BookOpen className="w-3.5 h-3.5" />
            Learning Curriculum
          </span>
          {view === "room" && activeItem && (
            <>
              <span>/</span>
              <span className="text-slate-200 font-medium">
                {activeItem.topic}
              </span>
            </>
          )}
        </div>

        {view === "room" && (
          <button
            onClick={() => setView("catalog")}
            className="text-xs font-medium text-slate-400 hover:text-white hover:underline transition"
          >
            ← Back to Recommended Tracks
          </button>
        )}
      </div>

      {/* VIEW 1: CATALOG (OVERVIEW HEADER + RECOMMENDED TRACKS GRID) */}
      {view === "catalog" && (
        <div className="space-y-8">
          <LearningOverviewHeader stats={stats} />
          <RecommendedTracksGrid
            items={RECOMMENDED_LEARNING_ITEMS}
            completedTopicIds={completedTopicIds}
            onSelectTopic={handleSelectTopic}
          />
        </div>
      )}

      {/* VIEW 2: LEARNING ROOM (LEARN -> COMPLETE -> QUIZ -> EVALUATION) */}
      {view === "room" && activeItem && (
        <LearningRoom
          item={activeItem}
          onBack={() => setView("catalog")}
          onCompleteFlow={handleCompleteFlow}
          onNavigateToTopic={handleNavigateToTopic}
        />
      )}
    </div>
  );
};
