"use client";

import React from "react";
import {
  User,
  GraduationCap,
  Briefcase,
  Cpu,
  FolderGit2,
  Target,
  FileCheck2,
  Check,
} from "lucide-react";

export interface StepItem {
  id: number;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const ONBOARDING_STEPS: StepItem[] = [
  { id: 1, label: "Personal Info", shortLabel: "Personal", icon: User, description: "Contact & university" },
  { id: 2, label: "Academic Profile", shortLabel: "Academics", icon: GraduationCap, description: "Scores & performance" },
  { id: 3, label: "Career Preferences", shortLabel: "Preferences", icon: Briefcase, description: "Roles & target salary" },
  { id: 4, label: "Skills Matrix", shortLabel: "Skills", icon: Cpu, description: "Tech stack & proficiency" },
  { id: 5, label: "Projects & Certs", shortLabel: "Projects", icon: FolderGit2, description: "Work & credentials" },
  { id: 6, label: "Career Goals", shortLabel: "Goals", icon: Target, description: "Ambition & commitment" },
  { id: 7, label: "Resume & ATS", shortLabel: "Resume", icon: FileCheck2, description: "Upload & verification" },
];

interface StepIndicatorProps {
  currentStep: number;
  onSelectStep: (stepId: number) => void;
  completedSteps: number[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onSelectStep,
  completedSteps,
}) => {
  const progressPercent = Math.round(((currentStep - 1) / (ONBOARDING_STEPS.length - 1)) * 100);

  return (
    <div className="w-full bg-surface border border-border/80 rounded-2xl p-4 sm:p-5 shadow-sm">
      {/* Top Header & Percentage */}
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
            Step {currentStep} of {ONBOARDING_STEPS.length}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-ink">
            {ONBOARDING_STEPS[currentStep - 1]?.label}
          </h2>
          <p className="text-xs text-ink-muted hidden sm:block">
            {ONBOARDING_STEPS[currentStep - 1]?.description}
          </p>
        </div>

        <div className="text-right">
          <div className="text-sm sm:text-base font-bold text-ink">
            {progressPercent}% Complete
          </div>
          <span className="text-[11px] text-ink-muted">Career Profile</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-canvas rounded-full overflow-hidden mb-4 border border-border/50">
        <div
          className="h-full bg-gradient-to-r from-accent via-ai to-accent rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps Row (Horizontal scrollable on small mobile, flex on desktop) */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
        {ONBOARDING_STEPS.map((step) => {
          const Icon = step.icon;
          const isCurrent = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id);
          const isClickable = isCompleted || step.id <= currentStep;

          return (
            <button
              key={step.id}
              onClick={() => isClickable && onSelectStep(step.id)}
              disabled={!isClickable}
              className={`flex-1 min-w-[72px] sm:min-w-0 flex flex-col items-center gap-1.5 p-1.5 sm:p-2 rounded-xl transition-all duration-200 text-center group ${
                isCurrent
                  ? "bg-accent/10 border border-accent/30 text-accent font-semibold shadow-sm"
                  : isCompleted
                  ? "hover:bg-canvas text-ink cursor-pointer"
                  : "text-ink-muted/50 opacity-60 cursor-not-allowed"
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-accent text-white shadow-md shadow-accent/25 scale-105"
                    : isCompleted
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                    : "bg-canvas border border-border text-ink-muted"
                }`}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] truncate max-w-full font-medium">
                {step.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
