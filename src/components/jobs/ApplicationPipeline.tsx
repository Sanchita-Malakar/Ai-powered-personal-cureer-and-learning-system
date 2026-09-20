"use client";

import React from "react";
import { JobApplication, ApplicationStage } from "@/types/job";
import {
  Bookmark,
  Send,
  Code2,
  Video,
  Award,
  XCircle,
  ChevronRight,
  Clock,
  FileCheck2,
  Calendar,
  CheckCircle2,
  Plus,
  ArrowRight,
  Trash2,
} from "lucide-react";

interface ApplicationPipelineProps {
  applications: JobApplication[];
  onSelectApplication: (app: JobApplication) => void;
  onMoveStage: (appId: string, nextStage: ApplicationStage) => void;
  onDeleteApplication: (appId: string) => void;
  onOpenAddModal: () => void;
}

const COLUMNS: {
  id: ApplicationStage | "outcome";
  title: string;
  stageFilter: ApplicationStage[];
  color: string;
  dotColor: string;
  icon: React.ComponentType<{ className?: string }>;
  nextStage?: ApplicationStage;
  nextStageLabel?: string;
}[] = [
  {
    id: "saved",
    title: "Saved",
    stageFilter: ["saved"],
    color: "border-border/80 bg-canvas/30",
    dotColor: "bg-ink-muted",
    icon: Bookmark,
    nextStage: "applied",
    nextStageLabel: "Applied",
  },
  {
    id: "applied",
    title: "Applied",
    stageFilter: ["applied"],
    color: "border-blue-500/20 bg-blue-500/5",
    dotColor: "bg-blue-500",
    icon: Send,
    nextStage: "oa",
    nextStageLabel: "OA",
  },
  {
    id: "oa",
    title: "OA (Assessment)",
    stageFilter: ["oa"],
    color: "border-amber-500/20 bg-amber-500/5",
    dotColor: "bg-amber-500",
    icon: Code2,
    nextStage: "interview",
    nextStageLabel: "Interview",
  },
  {
    id: "interview",
    title: "Interview",
    stageFilter: ["interview"],
    color: "border-purple-500/20 bg-purple-500/5",
    dotColor: "bg-purple-500",
    icon: Video,
    nextStage: "offer",
    nextStageLabel: "Offer",
  },
  {
    id: "outcome",
    title: "Offer / Rejected",
    stageFilter: ["offer", "rejected"],
    color: "border-emerald-500/20 bg-emerald-500/5",
    dotColor: "bg-emerald-500",
    icon: Award,
  },
];

export const ApplicationPipeline: React.FC<ApplicationPipelineProps> = ({
  applications,
  onSelectApplication,
  onMoveStage,
  onDeleteApplication,
  onOpenAddModal,
}) => {
  return (
    <div className="space-y-4">
      {/* Kanban Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-4 rounded-2xl border border-border/80 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <span>Active Pipeline Workflow</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
              {applications.length} Total Applications
            </span>
          </h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Applications move through: Saved ➔ Applied ➔ OA ➔ Interview ➔ Offer / Rejected
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 shadow-sm shadow-accent/20 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Track New Application</span>
        </button>
      </div>

      {/* 5-Column Kanban Track */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3.5 items-start">
        {COLUMNS.map((col) => {
          const Icon = col.icon;
          const colApps = applications.filter((app) =>
            col.stageFilter.includes(app.stage)
          );

          return (
            <div
              key={col.id}
              className={`flex flex-col rounded-2xl border ${col.color} p-3 min-h-[500px] transition-all duration-200`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between gap-2 pb-3 mb-2 border-b border-border/60">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full ${col.dotColor} shrink-0`} />
                  <Icon className="w-4 h-4 text-ink-muted shrink-0" />
                  <span className="text-xs font-bold text-ink truncate">
                    {col.title}
                  </span>
                </div>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-lg bg-surface border border-border/80 text-ink shadow-2xs">
                  {colApps.length}
                </span>
              </div>

              {/* Cards inside this stage */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                {colApps.length === 0 ? (
                  <div className="h-36 rounded-xl border border-dashed border-border/60 flex flex-col items-center justify-center text-center p-3 text-ink-muted/70">
                    <p className="text-[11px] font-medium">No applications</p>
                    <p className="text-[10px]">in this phase</p>
                  </div>
                ) : (
                  colApps.map((app) => {
                    const isOffer = app.stage === "offer";
                    const isRejected = app.stage === "rejected";
                    const totalTasks = app.tasks?.length || 0;
                    const completedTasks = app.tasks?.filter((t) => t.completed).length || 0;

                    return (
                      <div
                        key={app.id}
                        onClick={() => onSelectApplication(app)}
                        className={`group/appcard relative p-3.5 rounded-xl bg-surface border transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer ${
                          isOffer
                            ? "border-emerald-500/40 hover:border-emerald-500 bg-emerald-500/[0.03]"
                            : isRejected
                            ? "border-action/30 hover:border-action/50 bg-action/[0.02]"
                            : "border-border/80 hover:border-accent/40"
                        }`}
                      >
                        {/* Header: Company & Stage chip */}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider truncate">
                            {app.company}
                          </span>

                          {isOffer && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                              Offer
                            </span>
                          )}
                          {isRejected && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-action/15 text-action border border-action/30">
                              Rejected
                            </span>
                          )}
                        </div>

                        {/* Role Title */}
                        <h4 className="text-xs font-bold text-ink group-hover/appcard:text-accent transition-colors leading-snug line-clamp-2 mb-2">
                          {app.role}
                        </h4>

                        {/* Resume Used & Match Badge */}
                        <div className="flex items-center justify-between text-[11px] text-ink-muted mb-2.5">
                          <span className="flex items-center gap-1 truncate max-w-[130px]" title={app.resumeUsedName}>
                            <FileCheck2 className="w-3 h-3 text-accent shrink-0" />
                            <span className="truncate">{app.resumeUsedName.replace(".pdf", "")}</span>
                          </span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                            {app.resumeMatchScore}%
                          </span>
                        </div>

                        {/* Deadline / Interview alert if present */}
                        {app.deadlines?.interviewDate && (
                          <div className="mb-2 p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[10px] font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                            <Video className="w-3 h-3 shrink-0" />
                            <span className="truncate">{app.deadlines.interviewDate}</span>
                          </div>
                        )}
                        {app.deadlines?.oaDeadline && (
                          <div className="mb-2 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                            <Code2 className="w-3 h-3 shrink-0" />
                            <span className="truncate">{app.deadlines.oaDeadline}</span>
                          </div>
                        )}
                        {app.salaryOffered && (
                          <div className="mb-2 p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                            {app.salaryOffered}
                          </div>
                        )}

                        {/* Tasks Count */}
                        {totalTasks > 0 && (
                          <div className="flex items-center justify-between text-[10px] text-ink-muted mb-2 pt-1.5 border-t border-border/50">
                            <span>Tasks</span>
                            <span className="font-semibold text-ink">
                              {completedTasks}/{totalTasks} done
                            </span>
                          </div>
                        )}

                        {/* Card Footer: Move to next stage button */}
                        <div
                          className="pt-2 border-t border-border/60 flex items-center justify-between gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-[10px] text-ink-muted truncate">
                            Click for details
                          </span>

                          <div className="flex items-center gap-1">
                            {col.nextStage && (
                              <button
                                type="button"
                                onClick={() => onMoveStage(app.id, col.nextStage!)}
                                className="px-2 py-0.5 rounded-md bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/30 text-[10px] font-bold transition-all flex items-center gap-1"
                                title={`Move to ${col.nextStageLabel}`}
                              >
                                <span>{col.nextStageLabel}</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            )}

                            {app.stage !== "rejected" && app.stage !== "offer" && (
                              <button
                                type="button"
                                onClick={() => onMoveStage(app.id, "rejected")}
                                className="p-1 rounded-md text-ink-muted hover:text-action hover:bg-action/10 transition-colors"
                                title="Mark as Rejected"
                              >
                                <XCircle className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
