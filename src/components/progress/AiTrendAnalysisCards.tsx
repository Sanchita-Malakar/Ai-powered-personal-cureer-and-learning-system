"use client";

import React from "react";
import { AiTrendInsight } from "@/types/progress";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Zap,
  Target,
  MessageSquareCode,
  Briefcase,
} from "lucide-react";

interface AiTrendAnalysisCardsProps {
  insights: AiTrendInsight[];
  onTriggerAction: (section: string, paramId?: string) => void;
}

export const AiTrendAnalysisCards: React.FC<AiTrendAnalysisCardsProps> = ({
  insights,
  onTriggerAction,
}) => {
  const getCardStyle = (type: string) => {
    switch (type) {
      case "positive":
        return "border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-slate-900/90 to-slate-900/90";
      case "attention":
        return "border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-900/90 to-slate-900/90";
      default:
        return "border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 via-slate-900/90 to-slate-900/90";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case "attention":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Zap className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            AI Trend Engine
          </span>
          <h2 className="text-xl font-bold text-white">AI Trend Analysis</h2>
          <p className="text-xs text-slate-400">
            Intelligent pattern detection across rolling 30-day candidate data
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`rounded-2xl border p-5 md:p-6 flex flex-col justify-between backdrop-blur-xl shadow-lg transition hover:border-indigo-500/50 ${getCardStyle(
              insight.type
            )}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    {getIcon(insight.type)}
                  </div>
                  <span className="text-xs font-bold text-white">
                    {insight.headline}
                  </span>
                </div>
              </div>

              {/* Exact Prompt Quote */}
              <blockquote className="text-sm font-bold text-white leading-snug border-l-2 border-indigo-400 pl-3 italic">
                &ldquo;{insight.quote}&rdquo;
              </blockquote>

              <p className="text-xs text-slate-300 leading-relaxed">
                {insight.detailedAnalysis}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80">
              <button
                onClick={() =>
                  onTriggerAction(
                    insight.recommendedAction.section,
                    insight.recommendedAction.paramId
                  )
                }
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-indigo-600 transition flex items-center justify-center gap-2 group"
              >
                <span>{insight.recommendedAction.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
