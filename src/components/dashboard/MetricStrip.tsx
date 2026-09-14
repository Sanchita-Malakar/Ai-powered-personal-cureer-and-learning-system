"use client";

import React from "react";
import { MetricItem } from "@/types/dashboard";
import { TrendingUp, Target, Award, FileCheck2, Briefcase } from "lucide-react";
import { TiltCard } from "./TiltCard";

interface MetricStripProps {
  metrics: {
    careerGoal: MetricItem;
    skillScore: MetricItem;
    resumeScore: MetricItem;
    applications: MetricItem;
  };
}

export const MetricStrip: React.FC<MetricStripProps> = ({ metrics }) => {
  return (
    <section className="mb-6" aria-label="Key career metrics">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Career goal */}
        <TiltCard glow="accent" scale={1.03} maxTilt={8}>
          <div className="card-base flex flex-col justify-between h-full group/metric hover:border-accent/40">
            <div className="flex items-center justify-between">
              <span className="caption text-ink-muted font-medium">
                {metrics.careerGoal.label}
              </span>
              <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent transition-transform duration-200 group-hover/metric:scale-110 group-hover/metric:rotate-6">
                <Target className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-[28px] font-bold text-ink leading-none transition-transform duration-200 group-hover/metric:translate-x-0.5">
                {metrics.careerGoal.value}
              </span>
              {metrics.careerGoal.suffix && (
                <span className="text-[16px] font-semibold text-ink-muted">
                  {metrics.careerGoal.suffix}
                </span>
              )}
            </div>
            <span className="text-[11px] text-ink-muted mt-3">
              Target: 85% by end of semester
            </span>
          </div>
        </TiltCard>

        {/* Metric 2: Skill score */}
        <TiltCard glow="accent" scale={1.03} maxTilt={8}>
          <div className="card-base flex flex-col justify-between h-full group/metric hover:border-accent/40">
            <div className="flex items-center justify-between">
              <span className="caption text-ink-muted font-medium">
                {metrics.skillScore.label}
              </span>
              <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent transition-transform duration-200 group-hover/metric:scale-110 group-hover/metric:rotate-6">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-[28px] font-bold text-ink leading-none transition-transform duration-200 group-hover/metric:translate-x-0.5">
                {metrics.skillScore.value}
              </span>
              {metrics.skillScore.suffix && (
                <span className="text-[16px] font-semibold text-ink-muted">
                  {metrics.skillScore.suffix}
                </span>
              )}
            </div>
            {metrics.skillScore.delta && (
              <div className="mt-3 flex items-center gap-1.5 text-[12px] text-accent font-semibold">
                <div className="p-0.5 rounded bg-accent/10">
                  <TrendingUp className="w-3 h-3" />
                </div>
                <span>{metrics.skillScore.delta.value}</span>
              </div>
            )}
          </div>
        </TiltCard>

        {/* Metric 3: Resume score */}
        <TiltCard glow="accent" scale={1.03} maxTilt={8}>
          <div className="card-base flex flex-col justify-between h-full group/metric hover:border-accent/40">
            <div className="flex items-center justify-between">
              <span className="caption text-ink-muted font-medium">
                {metrics.resumeScore.label}
              </span>
              <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent transition-transform duration-200 group-hover/metric:scale-110 group-hover/metric:rotate-6">
                <FileCheck2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-[28px] font-bold text-ink leading-none transition-transform duration-200 group-hover/metric:translate-x-0.5">
                {metrics.resumeScore.value}
              </span>
            </div>
            {metrics.resumeScore.delta && (
              <div className="mt-3 flex items-center gap-1.5 text-[12px] text-accent font-semibold">
                <div className="p-0.5 rounded bg-accent/10">
                  <TrendingUp className="w-3 h-3" />
                </div>
                <span>{metrics.resumeScore.delta.value}</span>
              </div>
            )}
          </div>
        </TiltCard>

        {/* Metric 4: Applications count */}
        <TiltCard glow="accent" scale={1.03} maxTilt={8}>
          <div className="card-base flex flex-col justify-between h-full group/metric hover:border-accent/40">
            <div className="flex items-center justify-between">
              <span className="caption text-ink-muted font-medium">
                {metrics.applications.label}
              </span>
              <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent transition-transform duration-200 group-hover/metric:scale-110 group-hover/metric:rotate-6">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-[28px] font-bold text-ink leading-none transition-transform duration-200 group-hover/metric:translate-x-0.5">
                {metrics.applications.value}
              </span>
            </div>
            {metrics.applications.breakdown && (
              <div className="mt-3 text-[11px] text-ink-muted flex items-center gap-1.5 flex-wrap font-medium">
                <span>{metrics.applications.breakdown.applied} applied</span>
                <span>·</span>
                <span className="text-accent font-semibold">
                  {metrics.applications.breakdown.interview} interview
                </span>
                <span>·</span>
                <span className="text-accent font-semibold">
                  {metrics.applications.breakdown.offer} offer
                </span>
              </div>
            )}
          </div>
        </TiltCard>
      </div>
    </section>
  );
};
