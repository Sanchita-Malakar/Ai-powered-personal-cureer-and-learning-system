"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, AlertCircle } from "lucide-react";

interface StrengthsWeaknessesCardProps {
  strengths: string[];
  weaknesses: string[];
}

export const StrengthsWeaknessesCard: React.FC<StrengthsWeaknessesCardProps> = ({
  strengths,
  weaknesses,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
      {/* 1. STRENGTHS CARD */}
      <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-emerald-500/30 bg-emerald-500/[0.02] shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-ink">
                Strengths
              </h3>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {strengths.length} Detected
            </span>
          </div>

          <ul className="space-y-3">
            {strengths.map((str, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-canvas/40 border border-emerald-500/15 text-xs text-ink/90 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
          <span>✓ Positive ATS keyword weighting applied</span>
        </div>
      </div>

      {/* 2. WEAKNESSES CARD */}
      <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-amber-500/30 bg-amber-500/[0.02] shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-ink">
                Weaknesses & Gaps
              </h3>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {weaknesses.length} Critical
            </span>
          </div>

          <ul className="space-y-3">
            {weaknesses.map((weak, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-canvas/40 border border-amber-500/15 text-xs text-ink/90 font-medium"
              >
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{weak}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 pt-3 border-t border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1.5">
          <span>⚠ Direct factor lowering ATS score to 78/100</span>
        </div>
      </div>
    </div>
  );
};
