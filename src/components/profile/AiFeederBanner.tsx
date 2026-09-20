"use client";

import React, { useState } from "react";
import { AiRecommendationFeederInfo } from "@/types/profile";
import {
  Sparkles,
  Cpu,
  Target,
  Briefcase,
  Route,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface AiFeederBannerProps {
  feederInfo: AiRecommendationFeederInfo;
  onNavigateSection?: (sectionId: string, paramId?: string) => void;
}

export const AiFeederBanner: React.FC<AiFeederBannerProps> = ({
  feederInfo,
  onNavigateSection,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-violet-950/70 border border-indigo-500/30 p-5 sm:p-6 shadow-xl shadow-indigo-950/30">
      {/* Decorative background glow */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                AI Recommendation System Feeder
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sync Active
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Your profile directly calibrates CareerOS AI models
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5 leading-relaxed">
              Every detail you enter below—from your 8.85 CGPA and coursework to verified projects and target compensation—trains and grounds your personalized AI Career Assistant, Job Tracker match scoring, and adaptive Roadmap milestones.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          <button
            onClick={() => onNavigateSection?.("mentor")}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consult AI Mentor</span>
          </button>
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1"
          >
            <span>{expanded ? "Hide Feeder Breakdown" : "View Feeder Breakdown"}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Breakdown */}
      {expanded && (
        <div className="mt-6 pt-5 border-t border-indigo-500/20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 animate-in fade-in duration-200">
          {/* Tile 1: AI Mentor Grounding */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-indigo-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                AI Career Assistant
              </span>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                {feederInfo.mentorGrounded.fidelityScore}% Grounding
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {feederInfo.mentorGrounded.description}
            </p>
          </div>

          {/* Tile 2: Job Tracker Compatibility */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-indigo-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                Job Match Scoring
              </span>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">
                {feederInfo.jobTracker.matchAccuracy}% Accuracy
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {feederInfo.jobTracker.description}
            </p>
          </div>

          {/* Tile 3: Career Roadmap Milestones */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-indigo-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Route className="w-3.5 h-3.5 text-emerald-400" />
                Roadmap Milestones
              </span>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                {feederInfo.roadmap.curriculumAlignment}% Aligned
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {feederInfo.roadmap.description}
            </p>
          </div>

          {/* Tile 4: ATS Resume Benchmark */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-indigo-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                Resume ATS Engine
              </span>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                {feederInfo.resumeAts.currentScore}/100 ATS
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {feederInfo.resumeAts.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
