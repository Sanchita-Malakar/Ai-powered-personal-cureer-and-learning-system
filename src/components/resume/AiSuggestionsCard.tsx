"use client";

import React, { useState } from "react";
import { BulletRewrite, MeasurableResultTip, MissingSkillRecommendation } from "@/types/resume";
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  Plus,
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Info,
} from "lucide-react";

interface AiSuggestionsCardProps {
  bulletRewrites: BulletRewrite[];
  measurableTips: MeasurableResultTip[];
  missingSkills: MissingSkillRecommendation[];
  onApplyBulletRewrite: (id: string) => void;
  onAddMissingSkill: (id: string) => void;
}

export const AiSuggestionsCard: React.FC<AiSuggestionsCardProps> = ({
  bulletRewrites,
  measurableTips,
  missingSkills,
  onApplyBulletRewrite,
  onAddMissingSkill,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-border/80 shadow-xs mb-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-accent/10 text-accent">
              <Wand2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              AI Actionable Optimizations
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-ink tracking-tight">
            AI Suggestions
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Targeted enhancements to boost your resume from 78/100 to 90+ ATS readiness.
          </p>
        </div>
      </div>

      {/* 1. REWRITE PROJECT BULLET */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>1. Rewrite Project Bullets (Quantified Impact)</span>
          </h3>
          <span className="text-[11px] text-ink-muted">
            {bulletRewrites.filter((b) => b.applied).length}/{bulletRewrites.length} Applied
          </span>
        </div>

        <div className="space-y-3">
          {bulletRewrites.map((rewrite) => (
            <div
              key={rewrite.id}
              className={`p-4 rounded-2xl border transition-all ${
                rewrite.applied
                  ? "bg-emerald-500/[0.04] border-emerald-500/30"
                  : "bg-canvas/50 border-border/80 hover:border-accent/40"
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
                {/* Before: Original Bullet */}
                <div className="p-3 rounded-xl bg-canvas border border-border/70 text-xs">
                  <span className="text-[10px] font-bold text-ink-muted uppercase block mb-1">
                    Original Bullet in Resume
                  </span>
                  <p className="text-ink-muted line-through">
                    &ldquo;{rewrite.originalBullet}&rdquo;
                  </p>
                </div>

                {/* After: AI Rewritten */}
                <div className="p-3 rounded-xl bg-accent/10 border border-accent/25 text-xs">
                  <span className="text-[10px] font-bold text-accent uppercase flex items-center justify-between mb-1">
                    <span>AI Quantified Bullet</span>
                    <span className="text-[9px] bg-accent/15 px-1.5 py-0.2 rounded font-semibold">+6 pts</span>
                  </span>
                  <p className="font-semibold text-ink leading-relaxed">
                    &ldquo;{rewrite.rewrittenBullet}&rdquo;
                  </p>
                </div>
              </div>

              {/* Rationale explanation */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-border/60 text-xs">
                <span className="text-[11px] text-ink-muted flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>{rewrite.impactExplanation}</span>
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(rewrite.id, rewrite.rewrittenBullet)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-surface text-ink hover:bg-canvas text-[11px] font-semibold transition-all"
                  >
                    {copiedId === rewrite.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onApplyBulletRewrite(rewrite.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold transition-all shadow-2xs ${
                      rewrite.applied
                        ? "bg-emerald-500 text-white"
                        : "bg-accent text-white hover:bg-accent/90"
                    }`}
                  >
                    {rewrite.applied ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Applied to Resume</span>
                      </>
                    ) : (
                      <span>Apply to Resume</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. ADD MEASURABLE RESULTS */}
      <div className="space-y-3.5 pt-4 border-t border-border/70">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          <span>2. Add Measurable Results (Scale, Traffic & Latency Formulas)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {measurableTips.map((tip) => (
            <div
              key={tip.id}
              className="p-3.5 rounded-2xl bg-canvas/50 border border-border/80 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-ink block mb-1">
                  {tip.section}
                </span>
                <p className="text-[11px] text-ink-muted leading-relaxed mb-2.5">
                  {tip.guidance}
                </p>
              </div>

              <div className="p-2 rounded-xl bg-surface border border-border/70 font-mono text-[10px] text-accent">
                {tip.exampleFormula}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ADD MISSING RELEVANT SKILLS */}
      <div className="space-y-3 pt-4 border-t border-border/70">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <Plus className="w-4 h-4 text-accent" />
            <span>3. Add Missing Relevant Skills to Skills Section</span>
          </h3>
          <span className="text-[11px] text-ink-muted">
            Click chip to insert into resume
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {missingSkills.map((skill) => (
            <button
              key={skill.id}
              type="button"
              onClick={() => onAddMissingSkill(skill.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                skill.added
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 shadow-2xs"
                  : "bg-surface border-border/80 text-ink hover:border-accent hover:bg-accent/5"
              }`}
              title={skill.frequencyInJobs}
            >
              {skill.added ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Plus className="w-3.5 h-3.5 text-accent" />
              )}
              <span>{skill.name}</span>
              <span className="text-[10px] opacity-70">
                {skill.added ? "Added" : skill.importance}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
