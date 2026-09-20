"use client";

import React from "react";
import { SkillOverviewItem, ModuleType } from "@/types/dashboard";
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";

interface SkillOverviewCardProps {
  skills: SkillOverviewItem[];
  onOpenModule: (module: ModuleType) => void;
}

export const SkillOverviewCard: React.FC<SkillOverviewCardProps> = ({
  skills,
  onOpenModule,
}) => {
  const getBadgeStyle = (level: SkillOverviewItem["level"]) => {
    switch (level) {
      case "Strong":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "Intermediate":
        return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "Needs Improvement":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "Beginner":
        return "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30";
      default:
        return "bg-canvas text-ink-muted border-border";
    }
  };

  const getProgressColor = (level: SkillOverviewItem["level"]) => {
    switch (level) {
      case "Strong":
        return "bg-emerald-500";
      case "Intermediate":
        return "bg-blue-500";
      case "Needs Improvement":
        return "bg-amber-500";
      case "Beginner":
        return "bg-purple-500";
      default:
        return "bg-accent";
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-border/80 shadow-xs hover:border-border transition-all flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1 mb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>Technical Benchmark</span>
            </span>
            <h3 className="text-xl font-bold text-ink">Skill Overview</h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Verified proficiency ratings compared to target job descriptions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenModule("learning")}
            className="text-xs font-semibold text-accent hover:underline shrink-0"
          >
            Assess Skills
          </button>
        </div>

        {/* Skills List */}
        <div className="space-y-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              onClick={() => onOpenModule(skill.name === "DSA" ? "dsa" : "learning")}
              className="p-3 rounded-2xl bg-canvas/60 border border-border/80 hover:border-border transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-ink group-hover:text-accent transition-colors">
                    {skill.name}
                  </span>
                  <span className="text-[11px] text-ink-muted hidden sm:inline">
                    • {skill.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(
                      skill.level
                    )}`}
                  >
                    {skill.level}
                  </span>
                  <span className="text-xs font-semibold text-ink-muted">
                    {skill.score}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-border/60 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(skill.level)} rounded-full transition-all duration-500`}
                  style={{ width: `${skill.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-3 border-t border-border/70 flex items-center justify-between text-xs">
        <span className="text-ink-muted flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-attention" />
          <span>DSA & SQL need focus this week</span>
        </span>
        <button
          type="button"
          onClick={() => onOpenModule("learning")}
          className="text-accent font-bold hover:underline inline-flex items-center gap-1"
        >
          <span>All Skills</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
