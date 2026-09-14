"use client";

import React from "react";
import Link from "next/link";
import { RecentApplication } from "@/types/dashboard";
import { ArrowUpRight } from "lucide-react";
import { TiltCard } from "./TiltCard";

interface RecentApplicationsProps {
  applications: RecentApplication[];
}

export const RecentApplications: React.FC<RecentApplicationsProps> = ({
  applications,
}) => {
  const getStatusBadgeStyle = (status: RecentApplication["status"]) => {
    switch (status) {
      case "interview":
        return "bg-accent/10 text-accent border-accent/30 shadow-sm shadow-accent/10";
      case "applied":
        return "bg-ink-muted/10 text-ink-muted border-ink-muted/20";
      case "rejected":
        return "bg-action/10 text-action border-action/20";
      case "offer":
        return "bg-accent/15 text-accent border-accent/40 font-bold shadow-sm shadow-accent/20";
      default:
        return "bg-ink-muted/10 text-ink-muted border-border";
    }
  };

  return (
    <TiltCard glow="none" className="h-full">
      <div className="card-base flex flex-col justify-between h-full group/card transition-all duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="h3-scale text-ink">Recent applications</h3>
              <p className="caption text-ink-muted">
                Last 3 submissions across your target pool
              </p>
            </div>
            <Link
              href="#job-tracker"
              className="caption font-semibold text-accent hover:underline focus-visible:outline-accent"
            >
              All applications (16)
            </Link>
          </div>

          {/* Applications List */}
          <div className="divide-y divide-border/80 dark:divide-zinc-800">
            {applications.slice(0, 3).map((app) => (
              <div
                key={app.id}
                className="py-3 px-2 -mx-2 rounded-lg first:pt-2 last:pb-2 flex items-center justify-between gap-3 transition-all duration-150 hover:bg-canvas/70 group/row"
              >
                <div className="min-w-0">
                  <h4 className="text-[13px] font-bold text-ink leading-tight truncate group-hover/row:text-accent transition-colors">
                    {app.company}
                  </h4>
                  <p className="text-[12px] text-ink-muted leading-tight mt-0.5 truncate">
                    {app.role}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="caption text-ink-muted hidden sm:inline-block">
                    {app.appliedDate}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold capitalize transition-transform duration-150 group-hover/row:scale-105 ${getStatusBadgeStyle(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-border/80 dark:border-zinc-800 flex items-center justify-between">
          <span className="caption text-ink-muted">
            Active response rate: 25%
          </span>
          <Link
            href="#add-application"
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-accent hover:underline group/link focus-visible:outline-accent"
          >
            <span>Open job tracker</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </TiltCard>
  );
};
