"use client";

import React from "react";
import { AiPlan } from "@/types/dashboard";
import { Check, Sparkles, Play } from "lucide-react";
import { TiltCard } from "./TiltCard";

interface AiTodaysPlanProps {
  plan: AiPlan;
  isStarted: boolean;
  onToggleItem: (id: string) => void;
  onStartPlan: () => void;
}

export const AiTodaysPlan: React.FC<AiTodaysPlanProps> = ({
  plan,
  isStarted,
  onToggleItem,
  onStartPlan,
}) => {
  const completedCount = plan.items.filter((i) => i.completed).length;

  return (
    <TiltCard glow="ai" className="h-full">
      <div className="card-ai flex flex-col justify-between h-full group/card transition-all duration-300 hover:border-ai/50">
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <h3 className="h3-scale text-ink">Today&apos;s plan</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-ai/10 text-ai text-[11px] font-semibold tracking-wide border border-ai/20 shadow-sm shadow-ai/10">
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span>AI reasoned</span>
              </span>
            </div>
            <span className="caption text-ink-muted font-medium">
              {completedCount} of {plan.items.length} done
            </span>
          </div>

          {/* AI-Generated Reasoning (Strictly in Source Serif 4 font-ai) */}
          <div className="mb-4 pb-3 border-b border-border/80 dark:border-zinc-800">
            <p className="font-ai text-[14px] leading-[22px] text-ink italic">
              &ldquo;{plan.rationale}&rdquo;
            </p>
            <div className="mt-2 text-[12px] text-ink-muted flex items-center gap-1.5">
              <span>Focus:</span>
              <span className="text-ink font-semibold bg-canvas px-2 py-0.5 rounded border border-border/60">
                {plan.focusArea}
              </span>
            </div>
          </div>

          {/* Checklist items with 3D interactive hover elevation */}
          <div className="space-y-2.5">
            {plan.items.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleItem(item.id)}
                className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 border transform-gpu active:scale-[0.99] ${
                  item.completed
                    ? "bg-canvas/40 border-transparent text-ink-muted line-through opacity-75"
                    : "bg-surface border-border/80 hover:border-ai/40 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5 text-ink"
                }`}
              >
                <button
                  type="button"
                  className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-all duration-150 flex-shrink-0 ${
                    item.completed
                      ? "bg-accent border-accent text-white shadow-sm"
                      : "border-border hover:border-accent bg-surface"
                  }`}
                  aria-label={`Mark "${item.title}" as ${item.completed ? "incomplete" : "complete"}`}
                >
                  {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </button>

                <div className="flex-1 min-w-0 text-[13px] leading-tight">
                  <span className={item.completed ? "line-through text-ink-muted" : "text-ink font-medium"}>
                    {item.title}
                  </span>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-ink-muted no-underline">
                    <span className="px-1.5 py-0.5 rounded bg-canvas border border-border text-[10px] font-medium">
                      {item.category}
                    </span>
                    <span>{item.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action footer */}
        <div className="mt-5 pt-3 border-t border-border/80 dark:border-zinc-800 flex items-center justify-between">
          <span className="caption text-ink-muted">
            Estimated time: ~2 hrs 15 min
          </span>

          <button
            type="button"
            onClick={onStartPlan}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 text-[13px] font-semibold transition-all duration-200 shadow-md shadow-accent/25 hover:shadow-lg hover:shadow-accent/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus-visible:outline-accent"
          >
            {isStarted ? (
              <>
                <Check className="w-4 h-4" />
                <span>Plan in progress</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start today&apos;s plan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </TiltCard>
  );
};
