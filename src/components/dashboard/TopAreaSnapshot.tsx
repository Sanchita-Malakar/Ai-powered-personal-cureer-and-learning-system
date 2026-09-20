"use client";

import React from "react";
import Link from "next/link";
import { StudentProfile } from "@/types/dashboard";
import {
  Flame,
  Sparkles,
  Target,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Award,
} from "lucide-react";

interface TopAreaSnapshotProps {
  profile: StudentProfile;
}

export const TopAreaSnapshot: React.FC<TopAreaSnapshotProps> = ({ profile }) => {
  const completion = profile.profileCompletionPercentage || 94;
  const readiness = profile.readinessPercentage || 78;
  const isBenchmarkReached = readiness >= 80;

  return (
    <section className="mb-6 animate-in fade-in duration-300" aria-label="Student Career Snapshot">
      {/* Top Greeting & Streak */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Student Portal • Career Snapshot</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mt-0.5">
            Welcome back, {profile.name}!
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Here is your real-time career preparation overview and today&apos;s high-leverage actions.
          </p>
        </div>

        {/* Streak & College Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {profile.streakDays > 0 && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-attention/30 bg-surface/90 shadow-sm text-ink text-xs font-bold"
              title={`${profile.streakDays} consecutive study days`}
            >
              <Flame className="w-4 h-4 text-attention fill-attention animate-bounce" style={{ animationDuration: "2.5s" }} />
              <span>{profile.streakDays}-Day Streak</span>
            </div>
          )}

          <Link
            href="/onboarding?edit=true"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border/80 bg-surface hover:bg-canvas text-xs font-semibold text-ink transition-colors shadow-xs"
            title="Edit student profile"
          >
            <span>Edit Profile</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
          </Link>
        </div>
      </div>

      {/* Snapshot Cards Grid: 3 Pillars (Profile Completion, Current Career Goal, Overall Career Progress) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        {/* 1. Profile Completion */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border/80 shadow-xs hover:border-border transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                Profile Completion
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-ink">
                  {completion}%
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  Placement Ready
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3.5 space-y-1.5">
            <div className="w-full h-1.5 bg-canvas rounded-full overflow-hidden border border-border/60">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-ink-muted">
              <span>Academics, Skills & Resume indexed</span>
              <Link href="/onboarding?edit=true" className="text-accent font-semibold hover:underline">
                Review
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Current Career Goal */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border/80 shadow-xs hover:border-border transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                <span>Current Career Goal</span>
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-ink mt-1 truncate max-w-[200px] sm:max-w-xs">
                {profile.targetRole}
              </h2>
            </div>
            <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs">
            <span className="text-ink-muted">Target Compensation:</span>
            <span className="font-bold text-ink bg-canvas px-2 py-0.5 rounded-md border border-border/70">
              {profile.targetSalary || "₹10 - ₹16 LPA"}
            </span>
          </div>
        </div>

        {/* 3. Overall Career Progress */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-accent/5 via-surface to-ai/5 border border-accent/30 shadow-xs hover:border-accent/50 transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-ai flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Overall Career Progress</span>
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-accent">
                  {readiness}%
                </span>
                <span className="text-xs text-ink-muted">Role Readiness</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center font-bold shadow-md shadow-accent/25">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3.5 space-y-1.5">
            <div className="w-full h-2 bg-canvas rounded-full overflow-hidden border border-border/60 p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-accent to-ai rounded-full transition-all duration-500"
                style={{ width: `${readiness}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-ink-muted">80% Tier-1 Cutoff Benchmark</span>
              <span className={`font-bold ${isBenchmarkReached ? "text-emerald-600" : "text-attention"}`}>
                {isBenchmarkReached ? "Threshold Met" : `${80 - readiness}% to threshold`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
