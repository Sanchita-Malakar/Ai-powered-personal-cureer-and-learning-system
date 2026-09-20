"use client";

import React from "react";
import Link from "next/link";
import { RoadmapMilestone } from "@/types/dashboard";
import { Check, ChevronRight, ArrowRight } from "lucide-react";
import { TiltCard } from "./TiltCard";

interface CareerRoadmapProps {
  milestones: RoadmapMilestone[];
  currentMilestoneIndex: number;
  onOpenRoadmap?: () => void;
}

export const CareerRoadmap: React.FC<CareerRoadmapProps> = ({
  milestones,
  currentMilestoneIndex,
  onOpenRoadmap,
}) => {
  return (
    <TiltCard glow="accent" className="h-full">
      <div className="card-base flex flex-col justify-between h-full group/card transition-all duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="h3-scale text-ink">Career roadmap</h3>
              <p className="caption text-ink-muted">
                Milestone {currentMilestoneIndex + 1} of {milestones.length} in progress
              </p>
            </div>

            {onOpenRoadmap ? (
              <button
                type="button"
                onClick={onOpenRoadmap}
                className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:underline group/link focus-visible:outline-accent"
              >
                <span>View full roadmap</span>
                <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-0.5" />
              </button>
            ) : (
              <Link
                href="#roadmap"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:underline group/link focus-visible:outline-accent"
              >
                <span>View full roadmap</span>
                <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-0.5" />
              </Link>
            )}
          </div>

          {/* Milestone Timeline List */}
          <div className="relative pl-6 space-y-4 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/80 dark:before:bg-zinc-800">
            {milestones.map((m) => {
              const isCompleted = m.status === "completed";
              const isCurrent = m.status === "current";

              return (
                <div
                  key={m.id}
                  className="relative flex items-start gap-3 p-1.5 -ml-1.5 rounded-lg transition-all duration-200 hover:bg-canvas/60 group/node"
                >
                  {/* 3D Node icon */}
                  <div
                    className={`absolute -left-6 top-1.5 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-medium border transition-all duration-200 transform-gpu group-hover/node:scale-110 ${
                      isCompleted
                        ? "bg-accent border-accent text-white shadow-sm shadow-accent/30"
                        : isCurrent
                        ? "bg-surface border-accent text-accent ring-4 ring-accent/20 font-bold shadow-glow-accent animate-pulse-subtle"
                        : "bg-surface border-border text-ink-muted group-hover/node:border-ink/40"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <span>{m.stepNumber}</span>
                    )}
                  </div>

                  {/* Milestone details */}
                  <div className="flex-1 min-w-0 pl-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-[13px] leading-tight transition-colors ${
                          isCurrent
                            ? "font-semibold text-accent"
                            : isCompleted
                            ? "font-medium text-ink-muted line-through"
                            : "font-medium text-ink group-hover/node:text-accent"
                        }`}
                      >
                        {m.title}
                      </p>
                      {isCurrent && m.estimatedWeeks && (
                        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[11px] font-semibold whitespace-nowrap shadow-sm shadow-accent/10">
                          {m.estimatedWeeks}
                        </span>
                      )}
                    </div>
                    {isCurrent && (
                      <p className="text-[12px] text-ink-muted mt-1 leading-snug">
                        Currently focusing on relational database indexing and RESTful microservices.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer ghost link */}
        <div className="mt-5 pt-3 border-t border-border/80 dark:border-zinc-800 flex items-center justify-between">
          <span className="caption text-ink-muted">
            Expected completion: Dec 2026
          </span>
          {onOpenRoadmap ? (
            <button
              type="button"
              onClick={onOpenRoadmap}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-transparent text-ink hover:bg-canvas hover:border-border text-[12px] font-medium transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus-visible:outline-accent"
            >
              <span>Roadmap curriculum</span>
              <ArrowRight className="w-3.5 h-3.5 text-ink-muted transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <Link
              href="#roadmap"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-transparent text-ink hover:bg-canvas hover:border-border text-[12px] font-medium transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus-visible:outline-accent"
            >
              <span>Roadmap curriculum</span>
              <ArrowRight className="w-3.5 h-3.5 text-ink-muted transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
    </TiltCard>
  );
};
