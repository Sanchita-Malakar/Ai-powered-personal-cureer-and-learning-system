"use client";

import React from "react";
import { TargetRoleDetail } from "@/types/profile";
import {
  Target,
  Route,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  ChevronRight,
  Edit3,
  Sparkles,
} from "lucide-react";

interface TargetRolesCardProps {
  targetRoles: TargetRoleDetail[];
  onSelectPrimaryRole: (roleId: string) => void;
  onNavigateSection?: (sectionId: string, paramId?: string) => void;
  onEdit: () => void;
}

export const TargetRolesCard: React.FC<TargetRolesCardProps> = ({
  targetRoles,
  onSelectPrimaryRole,
  onNavigateSection,
  onEdit,
}) => {
  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 shadow-xs hover:border-border transition-all">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center border border-accent/20">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">Target Roles & AI Calibration</h3>
            <p className="text-xs text-ink-muted">
              Primary and secondary career objectives directing roadmap milestones and job matching.
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Manage Roles</span>
        </button>
      </div>

      <div className="space-y-4">
        {targetRoles.map((role) => (
          <div
            key={role.id}
            className={`p-5 rounded-2xl border transition-all ${
              role.isPrimary
                ? "bg-accent/5 border-accent/40 shadow-xs"
                : "bg-canvas/70 border-border/70 hover:border-border"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-bold text-ink">{role.title}</h4>
                    {role.isPrimary ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent text-white shadow-xs">
                        <Sparkles className="w-3 h-3" />
                        Primary Career Goal
                      </span>
                    ) : (
                      <button
                        onClick={() => onSelectPrimaryRole(role.id)}
                        className="text-[11px] font-semibold text-ink-muted hover:text-accent hover:underline"
                      >
                        Set as Primary
                      </button>
                    )}
                    <span className="text-[11px] font-semibold text-ink-muted">
                      • {role.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-ink-muted mt-1">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-500" />
                      {role.salaryRange}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-ink">
                      Demand: {role.marketDemand}
                    </span>
                  </div>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block">
                    Readiness Fit
                  </span>
                  <span className="text-xs font-bold text-accent">
                    {role.matchPercentage}% Qualified
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center font-extrabold text-base text-ink">
                  {role.matchPercentage}%
                </div>
              </div>
            </div>

            {/* Skills Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
              {/* Matching Skills */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1.5">
                  <CheckCircle2 className="w-3 h-3" />
                  Your Matching Verified Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {role.matchingSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-700 dark:text-emerald-300"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1 mb-1.5">
                  <AlertCircle className="w-3 h-3" />
                  Curriculum Gap to Close:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {role.missingSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[11px] font-medium text-amber-700 dark:text-amber-300"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Next Step Callout */}
            <div className="mt-3.5 pt-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-xs text-ink-muted">
                <strong className="text-ink font-semibold">AI Recommendation:</strong>{" "}
                {role.recommendedAction}
              </p>
              {role.isPrimary && (
                <button
                  onClick={() => onNavigateSection?.("roadmap")}
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline shrink-0"
                >
                  <span>View in Roadmap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
