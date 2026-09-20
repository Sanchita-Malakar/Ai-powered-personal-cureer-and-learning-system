"use client";

import React from "react";
import { TodayTaskItem, ModuleType } from "@/types/dashboard";
import {
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  ArrowRight,
  Code2,
  FileText,
  Brain,
  Briefcase,
  Sparkles,
} from "lucide-react";

interface TodaysTasksCardProps {
  tasks: TodayTaskItem[];
  onToggleTask: (taskId: string) => void;
  onOpenModule: (module: ModuleType) => void;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  DSA: Code2,
  Resume: FileText,
  ML: Brain,
  Jobs: Briefcase,
};

export const TodaysTasksCard: React.FC<TodaysTasksCardProps> = ({
  tasks,
  onToggleTask,
  onOpenModule,
}) => {
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const percent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-border/80 shadow-xs hover:border-border transition-all flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-ai flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Daily High-Leverage Plan</span>
            </span>
            <h3 className="text-xl font-bold text-ink">Today&apos;s Tasks</h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Complete these targeted actions to advance your readiness score today.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-bold text-ink">
              {completedCount} of {totalCount} Done
            </span>
            <div className="w-24 h-1.5 bg-canvas border border-border/70 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-ai rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-2.5 mt-4">
          {tasks.map((task) => {
            const Icon = CATEGORY_ICONS[task.category] || Sparkles;

            return (
              <div
                key={task.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 group ${
                  task.completed
                    ? "bg-canvas/40 border-border/50 text-ink-muted opacity-80"
                    : "bg-canvas/70 border-border/80 hover:border-border hover:bg-canvas text-ink"
                }`}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className="p-1 text-ink-muted hover:text-accent transition-colors shrink-0"
                  aria-label={task.completed ? "Mark incomplete" : "Mark completed"}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 hover:text-accent" />
                  )}
                </button>

                {/* Task Details & Click to open Module */}
                <div
                  onClick={() => onOpenModule(task.moduleTarget)}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <span
                    className={`text-xs sm:text-sm font-semibold block truncate ${
                      task.completed ? "line-through text-ink-muted" : "text-ink"
                    }`}
                  >
                    {task.title}
                  </span>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.2 rounded-md bg-surface border border-border/80 text-ink-muted">
                      <Icon className="w-3 h-3 text-ai" />
                      <span>{task.category}</span>
                    </span>

                    <span className="text-[11px] text-ink-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{task.durationText}</span>
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="button"
                  onClick={() => onOpenModule(task.moduleTarget)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-surface text-accent text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  <span className="hidden sm:inline">Launch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-3 border-t border-border/70 flex items-center justify-between text-xs">
        <span className="text-ink-muted">Estimated time: 2h 00m</span>
        <button
          type="button"
          onClick={() => onOpenModule("dsa")}
          className="text-ai font-bold hover:underline inline-flex items-center gap-1"
        >
          <span>Start Focus Sprint</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
