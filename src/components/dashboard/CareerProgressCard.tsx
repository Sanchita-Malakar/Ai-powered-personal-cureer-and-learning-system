"use client";

import React from "react";
import Link from "next/link";
import { StudentProfile, ModuleType } from "@/types/dashboard";
import {
  TrendingUp,
  Target,
  Award,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Code2,
  FileCheck2,
  Video,
} from "lucide-react";

interface CareerProgressCardProps {
  profile: StudentProfile;
  pillars: {
    skills: number;
    dsa: number;
    resume: number;
    interview: number;
  };
  onOpenModule: (module: ModuleType) => void;
  onOpenRoadmap?: () => void;
  onOpenProgress?: () => void;
}

export const CareerProgressCard: React.FC<CareerProgressCardProps> = ({
  profile,
  pillars,
  onOpenModule,
  onOpenRoadmap,
  onOpenProgress,
}) => {
  const readiness = profile.readinessPercentage || 78;
  const gap = Math.max(0, 80 - readiness);

  const pillarItems = [
    { label: "Technical Skills", value: pillars.skills, icon: Code2, module: "learning" as ModuleType },
    { label: "DSA & Problem Solving", value: pillars.dsa, icon: Target, module: "dsa" as ModuleType },
    { label: "Resume & Projects", value: pillars.resume, icon: FileCheck2, module: "resume" as ModuleType },
    { label: "Interview Readiness", value: pillars.interview, icon: Video, module: "interview" as ModuleType },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-border/80 shadow-xs hover:border-border transition-all flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Target Role Benchmarking</span>
            </span>
            <h3 className="text-xl font-bold text-ink">Career Progress</h3>
            <p className="text-xs text-ink-muted mt-0.5">
              How close you are to landing your target role as a{" "}
              <strong className="text-ink font-semibold">{profile.targetRole}</strong>.
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex flex-col items-center justify-center text-accent shrink-0">
            <span className="text-xl font-extrabold leading-none">{readiness}%</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-ink-muted mt-0.5">
              Ready
            </span>
          </div>
        </div>

        {/* Status Callout */}
        <div className="p-3 rounded-xl bg-canvas/70 border border-border/70 mb-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-semibold text-ink">
              {gap === 0
                ? "Qualified for Tier-1 engineering interview screens!"
                : `Within ${gap} points of the 80% Tier-1 interview qualification cutoff.`}
            </span>
          </div>
          <span className="text-[11px] font-bold text-accent">Top 15% in class</span>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="space-y-3 pt-1">
          <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block">
            Core Competency Breakdown
          </span>

          <div className="space-y-2.5">
            {pillarItems.map((pillar) => {
              const Icon = pillar.icon;
              const isStrong = pillar.value >= 80;
              const isIntermediate = pillar.value >= 65 && pillar.value < 80;

              const barColor = isStrong
                ? "bg-emerald-500"
                : isIntermediate
                ? "bg-accent"
                : "bg-attention";

              return (
                <div
                  key={pillar.label}
                  onClick={() => onOpenModule(pillar.module)}
                  className="p-2.5 rounded-xl bg-canvas/50 hover:bg-canvas border border-transparent hover:border-border/70 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-ink flex items-center gap-2 group-hover:text-accent transition-colors">
                      <Icon className="w-3.5 h-3.5 text-ink-muted group-hover:text-accent" />
                      <span>{pillar.label}</span>
                    </span>
                    <span className="font-bold text-ink">{pillar.value}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-border/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${pillar.value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer links to Progress & Roadmap */}
      <div className="mt-5 pt-3 border-t border-border/70 flex items-center justify-between gap-2">
        <span className="text-xs text-ink-muted">Milestone 2 of 4 Active</span>
        <div className="flex items-center gap-3">
          {onOpenProgress ? (
            <button
              type="button"
              onClick={onOpenProgress}
              className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
            >
              <span>Performance Center</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href="#progress"
              className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
            >
              <span>Performance Center</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
          <span className="text-border text-xs">•</span>
          {onOpenRoadmap ? (
            <button
              type="button"
              onClick={onOpenRoadmap}
              className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted hover:text-ink hover:underline"
            >
              <span>Roadmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href="#roadmap"
              className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted hover:text-ink hover:underline"
            >
              <span>Roadmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
