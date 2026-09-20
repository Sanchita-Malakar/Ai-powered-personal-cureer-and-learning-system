"use client";

import React from "react";
import { JobPosting } from "@/types/job";
import {
  X,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Briefcase,
  FileCheck2,
  ArrowRight,
} from "lucide-react";

interface JobDetailModalProps {
  job: JobPosting | null;
  isSaved?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onToggleSave: (jobId: string) => void;
  onTrackAsApplied: (job: JobPosting) => void;
  onAnalyzeResume?: (job: JobPosting) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isSaved,
  isOpen,
  onClose,
  onToggleSave,
  onTrackAsApplied,
  onAnalyzeResume,
}) => {
  if (!isOpen || !job) return null;

  const saved = isSaved || job.isSaved;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-surface rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border/80 flex items-start justify-between gap-4 bg-canvas/40">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-canvas border border-border/90 flex items-center justify-center font-bold text-lg text-ink shadow-xs shrink-0">
              {job.company.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                  {job.company}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-canvas border border-border/70 capitalize font-medium text-ink-muted">
                  {job.workplaceType}
                </span>
                <span className="text-[11px] font-semibold text-accent">
                  {job.salaryRange}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-ink tracking-tight leading-tight">
                {job.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-ink-muted mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-ink-muted" />
                  <span>{job.location}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-ink-muted" />
                  <span>Deadline: {job.applicationDeadline}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-canvas transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 divide-y divide-border/60">
          {/* Section 1: Resume Suitability Score & ATS Match */}
          <div className="pb-4">
            <div className="p-4 rounded-2xl bg-accent/10 border border-accent/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-accent flex flex-col items-center justify-center text-white shrink-0 shadow-md shadow-accent/25">
                  <span className="text-base font-extrabold leading-none">
                    {job.resumeSuitabilityScore}%
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5">
                    Match
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink">
                    Resume Suitability Score
                  </h4>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Evaluated against your active profile and technical competencies.
                  </p>
                </div>
              </div>

              <div className="text-right sm:text-right w-full sm:w-auto">
                <span className="text-xs font-bold text-accent bg-surface/80 px-2.5 py-1 rounded-lg border border-accent/20 inline-block">
                  {job.resumeSuitabilityScore >= 85 ? "High Tier-1 Match" : "Good Placement Match"}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Student Matching Skills vs Missing Skills */}
          <div className="pt-5 space-y-4">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Skill Alignment Analysis</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Matching Skills */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Your Matching Skills ({job.matchingSkills.length})</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {job.matchingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-semibold px-2 py-1 rounded-lg bg-surface text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Missing / Areas to Prep ({job.missingSkills.length})</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {job.missingSkills.length === 0 ? (
                    <span className="text-xs text-ink-muted">No missing skills detected!</span>
                  ) : (
                    job.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs font-semibold px-2 py-1 rounded-lg bg-surface text-amber-700 dark:text-amber-300 border border-amber-500/30"
                      >
                        + {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Complete Job Description */}
          <div className="pt-5 space-y-2.5">
            <h3 className="text-sm font-bold text-ink">Complete Description</h3>
            <p className="text-xs text-ink-muted leading-relaxed whitespace-pre-line bg-canvas/40 p-4 rounded-2xl border border-border/70">
              {job.completeDescription}
            </p>
          </div>

          {/* Section 4: Key Requirements & Qualifications */}
          <div className="pt-5 space-y-2.5">
            <h3 className="text-sm font-bold text-ink">Requirements & Qualifications</h3>
            <ul className="space-y-2">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-ink/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span className="leading-normal">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 border-t border-border/80 bg-canvas/60 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onToggleSave(job.id)}
            className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
              saved
                ? "bg-accent/15 border-accent/40 text-accent"
                : "bg-surface border-border text-ink hover:bg-canvas"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? "fill-accent" : ""}`} />
            <span>{saved ? "Saved in Pipeline" : "Save Job"}</span>
          </button>

          <div className="flex items-center gap-2">
            {onAnalyzeResume && (
              <button
                type="button"
                onClick={() => onAnalyzeResume(job)}
                className="px-4 py-2 rounded-xl bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Analyze Resume</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onTrackAsApplied(job)}
              className="px-4 py-2 rounded-xl bg-surface border border-accent/30 text-accent hover:bg-accent/10 text-xs font-bold transition-all"
            >
              Add to Tracker (Applied)
            </button>

            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-xl bg-accent text-white hover:bg-accent/90 text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-accent/25 transition-all active:scale-95"
            >
              <span>Apply on Company Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
