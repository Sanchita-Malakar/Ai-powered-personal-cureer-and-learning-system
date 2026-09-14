"use client";

import React from "react";
import Link from "next/link";
import { RecommendedJob } from "@/types/dashboard";
import { ExternalLink, Building2, MapPin } from "lucide-react";
import { TiltCard } from "./TiltCard";

interface RecommendedJobsProps {
  jobs: RecommendedJob[];
}

export const RecommendedJobs: React.FC<RecommendedJobsProps> = ({ jobs }) => {
  return (
    <TiltCard glow="accent" className="h-full">
      <div className="card-base flex flex-col justify-between h-full group/card transition-all duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="h3-scale text-ink">Recommended jobs</h3>
              <p className="caption text-ink-muted">
                Ranked by profile & skill alignment
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[11px] font-semibold">
              Top 2 matches
            </span>
          </div>

          {/* Job Cards */}
          <div className="space-y-3.5">
            {jobs.slice(0, 2).map((job) => (
              <div
                key={job.id}
                className="p-3.5 rounded-xl border border-border/80 bg-canvas/40 hover:bg-canvas hover:border-accent/40 hover:shadow-md hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-200 group/job"
              >
                {/* Job Title & Match Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-[14px] font-bold text-ink leading-snug group-hover/job:text-accent transition-colors">
                      {job.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1.5 text-[12px] text-ink-muted">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-[11px] font-bold whitespace-nowrap shadow-sm shadow-accent/10">
                    {job.matchScore}% match
                  </span>
                </div>

                {/* Missing skill chips */}
                {job.missingSkills.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-border/70 dark:border-zinc-800 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-ink-muted font-medium">Skill gaps:</span>
                    {job.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-surface border border-border/80 text-[11px] text-ink-muted font-medium hover:border-accent/40 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* View Job action */}
                <div className="mt-3.5 flex items-center justify-between">
                  <span className="text-[11px] text-ink-muted">
                    Posted {job.postedDaysAgo}d ago
                  </span>
                  <Link
                    href={job.applyUrl}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-surface text-ink hover:bg-accent hover:text-white hover:border-accent text-[12px] font-semibold transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-sm focus-visible:outline-accent"
                  >
                    <span>View job</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer link */}
        <div className="mt-4 pt-3 border-t border-border/80 dark:border-zinc-800 flex items-center justify-between">
          <span className="caption text-ink-muted">
            14 new roles added this week
          </span>
          <Link
            href="#all-jobs"
            className="text-[12px] font-semibold text-accent hover:underline focus-visible:outline-accent"
          >
            View all 14 matches →
          </Link>
        </div>
      </div>
    </TiltCard>
  );
};
