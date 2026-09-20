"use client";

import React from "react";
import { JobProgressStats } from "@/types/progress";
import {
  Briefcase,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";

interface JobFunnelCardProps {
  jobs: JobProgressStats;
  onOpenJobTracker?: () => void;
}

export const JobFunnelCard: React.FC<JobFunnelCardProps> = ({
  jobs,
  onOpenJobTracker,
}) => {
  const stages = [
    { label: "Applications", count: jobs.applicationsCount, color: "bg-blue-500", text: "text-blue-400" },
    { label: "Online Assessments", count: jobs.oaCount, color: "bg-purple-500", text: "text-purple-400" },
    { label: "Technical Interviews", count: jobs.interviewsCount, color: "bg-amber-500", text: "text-amber-400" },
    { label: "Offers / Final Round", count: jobs.offersCount, color: "bg-emerald-500", text: "text-emerald-400" },
  ];

  return (
    <div className="p-5 md:p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-lg space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Job Progress Funnel</h3>
            <p className="text-xs text-slate-400">Application pipeline velocity & conversion rates</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-bold text-emerald-400 font-mono">
              {jobs.responseRatePercentage}%
            </div>
            <div className="text-[10px] text-slate-400">Response Rate</div>
          </div>

          {onOpenJobTracker && (
            <button
              onClick={onOpenJobTracker}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center gap-1.5"
            >
              <span>Job Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Pipeline Funnel Columns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stages.map((stg, idx) => (
          <div
            key={stg.label}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Stage {idx + 1}
              </span>
              <div className="text-2xl font-black text-white font-mono">
                {stg.count}
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 mt-2">
              <span className={`text-xs font-semibold ${stg.text}`}>
                {stg.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Top Active Roles in Pipeline */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Active In-Flight Positions ({jobs.topStages.length})
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {jobs.topStages.map((stg, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-white">{stg.company}</div>
                <div className="text-[11px] text-slate-400">{stg.role}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono">
                  {stg.stage}
                </span>
                <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                  {stg.matchPercentage}% Match
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
