"use client";

import React from "react";
import { LearningItem } from "@/types/learning";
import {
  BookOpen,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Video,
  FileText,
  Terminal,
  Layers,
  Award,
} from "lucide-react";

interface RecommendedTracksGridProps {
  items: LearningItem[];
  completedTopicIds: Set<string>;
  onSelectTopic: (item: LearningItem) => void;
}

export const RecommendedTracksGrid: React.FC<RecommendedTracksGridProps> = ({
  items,
  completedTopicIds,
  onSelectTopic,
}) => {
  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "Beginner":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Intermediate":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "Advanced":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      default:
        return "text-slate-400 bg-slate-800 border-slate-700";
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-3 h-3 text-rose-400" />;
      case "interactive_doc":
      case "cheatsheet":
        return <FileText className="w-3 h-3 text-indigo-400" />;
      case "sandbox":
        return <Terminal className="w-3 h-3 text-emerald-400" />;
      default:
        return <Layers className="w-3 h-3 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Recommended for You
          </h2>
          <p className="text-xs text-slate-400">
            Selected by AI matching your target role requirements and current skill gaps
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400">
          4 Priority Tracks
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => {
          const isCompleted = completedTopicIds.has(item.id) || item.isCompleted;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 md:p-6 transition-all duration-200 flex flex-col justify-between group relative overflow-hidden backdrop-blur-xl ${
                isCompleted
                  ? "border-emerald-500/30 bg-slate-900/60 hover:border-emerald-500/50"
                  : "border-slate-800 bg-slate-900/80 hover:border-indigo-500/40 hover:bg-slate-900/95 shadow-lg"
              }`}
            >
              <div>
                {/* Top badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.category}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${getDifficultyBadge(
                        item.difficulty
                      )}`}
                    >
                      {item.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.estimatedTime}</span>
                  </div>
                </div>

                {/* Topic Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition mb-1.5">
                  {item.topic}
                </h3>

                {/* Skill Gap Addressed */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {item.skillGapAddressed}
                </p>

                {/* Resources List */}
                <div className="space-y-1.5 mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Curated Resources ({item.resources.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {item.resources.slice(0, 4).map((res) => (
                      <div
                        key={res.id}
                        className="flex items-center gap-1.5 text-[11px] text-slate-300 truncate"
                        title={res.title}
                      >
                        {getResourceIcon(res.type)}
                        <span className="truncate">{res.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress Bar & CTA */}
              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Progress</span>
                  <span className="font-mono font-bold text-indigo-400">
                    {isCompleted ? "100%" : `${item.progress}%`}
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                    style={{ width: `${isCompleted ? 100 : item.progress}%` }}
                  />
                </div>

                <button
                  onClick={() => onSelectTopic(item)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    isCompleted
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Review Track
                    </>
                  ) : item.progress > 0 ? (
                    <>
                      Continue Learning
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      Start Track
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
