"use client";

import React from "react";
import { AiInsight, ModuleType } from "@/types/dashboard";
import { Sparkles, ArrowRight, Zap, Lightbulb } from "lucide-react";

interface AiInsightCardProps {
  insight: AiInsight;
  onOpenModule: (module: ModuleType) => void;
}

export const AiInsightCard: React.FC<AiInsightCardProps> = ({ insight, onOpenModule }) => {
  return (
    <div className="mb-6 rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-ai/10 via-surface to-accent/10 border border-ai/30 shadow-sm relative overflow-hidden animate-in fade-in duration-300">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-ai/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 max-w-3xl">
          <div className="w-10 h-10 rounded-xl bg-ai/15 text-ai flex items-center justify-center shrink-0 border border-ai/30 shadow-sm">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ai">
                AI Career Insight
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-ai/10 text-ai font-semibold border border-ai/20">
                Priority Coaching
              </span>
            </div>

            {/* Exact quote from prompt */}
            <blockquote className="text-sm sm:text-base font-bold text-ink leading-snug">
              &quot;{insight.quote}&quot;
            </blockquote>

            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              {insight.context}
            </p>
          </div>
        </div>

        {/* Action Button to Open DSA Module */}
        <button
          type="button"
          onClick={() => onOpenModule(insight.targetModule)}
          className="self-start md:self-auto shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ai hover:bg-ai/90 text-white text-xs sm:text-sm font-bold shadow-md shadow-ai/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>{insight.recommendedAction}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
