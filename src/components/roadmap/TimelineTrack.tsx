"use client";

import React from "react";
import { CareerTimelineStage } from "@/types/roadmap";
import { Check, ArrowRight, Sparkles } from "lucide-react";

interface TimelineTrackProps {
  stages: CareerTimelineStage[];
  activeStageId: string | null;
  onSelectStage: (stageId: string | null) => void;
}

export const TimelineTrack: React.FC<TimelineTrackProps> = ({
  stages,
  activeStageId,
  onSelectStage,
}) => {
  return (
    <div className="w-full bg-surface border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs mb-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Visual Career Pathway</span>
          </span>
          <h2 className="text-sm sm:text-base font-bold text-ink">
            Strategic Timeline Track
          </h2>
        </div>

        {activeStageId && (
          <button
            type="button"
            onClick={() => onSelectStage(null)}
            className="text-xs font-semibold text-accent hover:underline"
          >
            Show All Stages
          </button>
        )}
      </div>

      {/* Horizontal Interactive Timeline Scroll */}
      <div className="relative overflow-x-auto pb-2 pt-1 no-scrollbar">
        {/* Connecting Line */}
        <div className="absolute top-[21px] left-6 right-6 h-0.5 bg-border/80 dark:bg-zinc-800 -z-0 hidden md:block" />

        <div className="flex items-center justify-between min-w-[760px] gap-2 relative z-10">
          {stages.map((stage, idx) => {
            const isCompleted = stage.status === "completed";
            const isCurrent = stage.status === "current";
            const isSelected = activeStageId === stage.id;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onSelectStage(isSelected ? null : stage.id)}
                className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all text-center group cursor-pointer ${
                  isSelected
                    ? "bg-accent/10 border border-accent/40 shadow-xs"
                    : "hover:bg-canvas/80 border border-transparent"
                }`}
              >
                {/* Node circle */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-transform duration-200 group-hover:scale-105 ${
                    isCompleted
                      ? "bg-emerald-500 text-white shadow-xs"
                      : isCurrent
                      ? "bg-accent text-white ring-4 ring-accent/20 shadow-md shadow-accent/25 animate-pulse"
                      : "bg-canvas border border-border text-ink-muted"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Stage title */}
                <span
                  className={`text-[11px] sm:text-xs font-semibold truncate max-w-[95px] ${
                    isCurrent
                      ? "text-accent font-bold"
                      : isCompleted
                      ? "text-ink font-medium"
                      : "text-ink-muted"
                  }`}
                >
                  {stage.label}
                </span>

                {/* Status indicator tag */}
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wider ${
                    isCompleted
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : isCurrent
                      ? "bg-accent/15 text-accent"
                      : "bg-canvas text-ink-muted"
                  }`}
                >
                  {stage.status === "current" ? "Active" : stage.status}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
