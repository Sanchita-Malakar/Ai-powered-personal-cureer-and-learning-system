"use client";

import React from "react";
import { JobPosting } from "@/types/job";
import {
  Building2,
  MapPin,
  Calendar,
  Bookmark,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Clock,
  Briefcase,
} from "lucide-react";

interface JobCardProps {
  job: JobPosting;
  isSaved?: boolean;
  onSelectJob: (job: JobPosting) => void;
  onToggleSave: (jobId: string) => void;
  onQuickTrack?: (job: JobPosting) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved,
  onSelectJob,
  onToggleSave,
  onQuickTrack,
}) => {
  const getMatchColor = (score: number) => {
    if (score >= 85) {
      return {
        bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        ring: "text-emerald-500",
        label: "Top Match",
      };
    }
    if (score >= 75) {
      return {
        bg: "bg-accent/10 text-accent border-accent/30",
        ring: "text-accent",
        label: "Strong Match",
      };
    }
    return {
      bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      ring: "text-amber-500",
      label: "Potential Match",
    };
  };

  const matchStyle = getMatchColor(job.resumeSuitabilityScore);

  return (
    <div className="group/card relative flex flex-col justify-between p-5 rounded-2xl bg-surface border border-border/80 hover:border-accent/40 shadow-xs hover:shadow-md transition-all duration-200">
      <div>
        {/* Top bar: Company badge, Match percentage, Save Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-canvas border border-border/80 flex items-center justify-center font-bold text-base text-ink shadow-2xs group-hover/card:border-accent/40 transition-colors shrink-0">
              {job.company.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wider truncate">
                {job.company}
              </h4>
              <h3 className="text-[15px] font-bold text-ink leading-tight truncate group-hover/card:text-accent transition-colors">
                {job.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Match Percentage Pill */}
            <div
              className={`px-2.5 py-1 rounded-full border text-[11px] font-bold flex items-center gap-1.5 shadow-2xs ${matchStyle.bg}`}
              title={`${job.resumeSuitabilityScore}% suitability match for your student profile`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Match: {job.resumeSuitabilityScore}%</span>
            </div>

            {/* Save Job Bookmark Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(job.id);
              }}
              className={`p-1.5 rounded-lg border transition-all ${
                isSaved || job.isSaved
                  ? "bg-accent/15 border-accent/40 text-accent"
                  : "bg-canvas/50 border-border/60 text-ink-muted hover:text-ink hover:bg-canvas"
              }`}
              title={isSaved || job.isSaved ? "Saved in pipeline" : "Save job"}
              aria-label="Save Job"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved || job.isSaved ? "fill-accent" : ""}`} />
            </button>
          </div>
        </div>

        {/* Key Metadata: Location, Workplace, Salary, Posted */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-muted mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-ink-muted/80" />
            <span>{job.location}</span>
          </span>
          <span className="inline-block w-1 h-1 rounded-full bg-border" />
          <span className="capitalize font-medium text-ink/80">{job.workplaceType}</span>
          <span className="inline-block w-1 h-1 rounded-full bg-border" />
          <span className="font-semibold text-ink">{job.salaryRange}</span>
        </div>

        {/* Requirements Summary Snippet */}
        <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed mb-4">
          {job.requirements[0]} {job.requirements[1]}
        </p>

        {/* Skills preview tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.requiredSkills.slice(0, 4).map((skill) => {
            const isMatch = job.matchingSkills.includes(skill);
            return (
              <span
                key={skill}
                className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                  isMatch
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                    : "bg-canvas/60 text-ink-muted border-border/60"
                }`}
              >
                {skill}
              </span>
            );
          })}
          {job.requiredSkills.length > 4 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md text-ink-muted">
              +{job.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer bar: Application deadline & action launcher */}
      <div className="pt-3 border-t border-border/70 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1 text-[11px]">
          <Clock
            className={`w-3.5 h-3.5 ${
              job.deadlineUrgency === "urgent"
                ? "text-action"
                : job.deadlineUrgency === "soon"
                ? "text-attention"
                : "text-ink-muted"
            }`}
          />
          <span
            className={`font-medium ${
              job.deadlineUrgency === "urgent"
                ? "text-action font-bold"
                : job.deadlineUrgency === "soon"
                ? "text-attention font-semibold"
                : "text-ink-muted"
            }`}
          >
            {job.applicationDeadline}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onQuickTrack && (
            <button
              type="button"
              onClick={() => onQuickTrack(job)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-canvas hover:bg-canvas/80 border border-border text-ink transition-colors"
            >
              Track
            </button>
          )}

          <button
            type="button"
            onClick={() => onSelectJob(job)}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-2xs transition-all active:scale-95"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
