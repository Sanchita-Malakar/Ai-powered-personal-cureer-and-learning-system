"use client";

import React from "react";
import { StudentProfile } from "@/types/dashboard";
import { Flame, Sparkles } from "lucide-react";

interface HeroProps {
  profile: StudentProfile;
}

export const Hero: React.FC<HeroProps> = ({ profile }) => {
  return (
    <section className="mb-7 pt-1" aria-label="Career goal overview">
      <div className="flex flex-col gap-2.5">
        {/* Top greeting + streak */}
        <div className="flex items-center justify-between gap-3">
          <p className="caption text-ink-muted flex items-center gap-1.5 font-medium">
            <span>Good morning, {profile.name}</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          </p>

          {profile.streakDays > 0 && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-attention/30 bg-surface/90 dark:bg-zinc-900/90 backdrop-blur-sm text-ink text-[12px] font-semibold shadow-sm hover:shadow-glow-attention hover:scale-105 transition-all duration-200 cursor-default"
              title={`${profile.streakDays} consecutive days active`}
            >
              <Flame className="w-4 h-4 text-attention fill-attention animate-bounce" style={{ animationDuration: "2s" }} />
              <span>{profile.streakDays}-day streak</span>
            </div>
          )}
        </div>

        {/* Target role H1 */}
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="h1-scale text-ink font-bold tracking-tight">
            {profile.targetRole}
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-[11px] font-semibold border border-accent/20">
            <Sparkles className="w-3 h-3" />
            <span>Target Role</span>
          </span>
        </div>

        {/* Slim readiness bar */}
        <div className="mt-1 space-y-2 max-w-xl">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-semibold text-ink">
              Target role readiness
            </span>
            <span className="font-bold text-accent px-2 py-0.5 rounded-md bg-accent/10 text-[12px]">
              {profile.readinessPercentage}%
            </span>
          </div>

          <div
            className="w-full h-2 bg-border/80 dark:bg-zinc-800 rounded-full overflow-hidden p-[1px] shadow-inner"
            role="progressbar"
            aria-valuenow={profile.readinessPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Target role readiness percentage"
          >
            <div
              className="h-full bg-gradient-to-r from-accent via-indigo-500 to-blue-400 dark:from-accent dark:via-indigo-400 dark:to-blue-300 transition-all duration-1000 rounded-full shadow-sm shadow-accent/40 relative overflow-hidden"
              style={{ width: `${profile.readinessPercentage}%` }}
            >
              {/* Subtle shimmer effect on progress */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>

          <p className="caption text-ink-muted flex items-center gap-1 font-medium">
            <span>✓</span>
            <span>On track to meet junior benchmark by mid-semester</span>
          </p>
        </div>
      </div>
    </section>
  );
};
