"use client";

import React from "react";
import { StudentGroundedContext } from "@/types/mentor";
import {
  Sparkles,
  ShieldCheck,
  Target,
  FileText,
  AlertTriangle,
  Briefcase,
  TrendingUp,
} from "lucide-react";

interface MentorContextPillsProps {
  context: StudentGroundedContext;
}

export const MentorContextPills: React.FC<MentorContextPillsProps> = ({
  context,
}) => {
  return (
    <div className="p-3 md:p-3.5 rounded-2xl border border-indigo-500/30 bg-slate-950/70 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
          <Sparkles className="w-4 h-4 animate-pulse text-indigo-300" />
        </div>
        <div>
          <span className="font-bold text-white flex items-center gap-1.5 text-xs">
            Profile Grounding Active
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </span>
          <span className="text-[11px] text-slate-400">
            AI responses grounded in your real-time performance data
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
          <Target className="w-3.5 h-3.5 text-indigo-400" />
          <span>Goal: {context.targetRole.split("&")[0].trim()}</span>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Readiness: {context.overallReadiness}%</span>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>ATS: {context.atsResumeScore}/100</span>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 font-mono text-[11px]">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>Weak: {context.dsaWeakArea.split("(")[0].trim()} (43%)</span>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
          <Briefcase className="w-3.5 h-3.5 text-blue-400" />
          <span>Top Match: Swiggy (92%)</span>
        </div>
      </div>
    </div>
  );
};
