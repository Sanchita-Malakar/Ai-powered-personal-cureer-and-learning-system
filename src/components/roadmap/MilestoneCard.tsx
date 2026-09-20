"use client";

import React, { useState } from "react";
import { RoadmapMilestoneFull, RoadmapTask } from "@/types/roadmap";
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ExternalLink,
  BookOpen,
  Code2,
  Plus,
  ChevronDown,
  ChevronUp,
  Target,
  FileText,
  Video,
  Award,
} from "lucide-react";

interface MilestoneCardProps {
  milestone: RoadmapMilestoneFull;
  onToggleTask: (milestoneId: string, taskId: string) => void;
  onAddTask: (milestoneId: string, taskTitle: string) => void;
}

const RESOURCE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Course: Award,
  Book: BookOpen,
  Docs: FileText,
  Video: Video,
  Repo: Code2,
  Practice: Target,
};

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  onToggleTask,
  onAddTask,
}) => {
  const [expanded, setExpanded] = useState(milestone.status === "current" || milestone.completionPercentage < 100);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);

  const isCompleted = milestone.status === "completed" || milestone.completionPercentage === 100;
  const isCurrent = milestone.status === "current";

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(milestone.id, newTaskTitle.trim());
    setNewTaskTitle("");
    setShowAddTask(false);
  };

  return (
    <div
      className={`rounded-3xl border transition-all duration-200 shadow-xs overflow-hidden ${
        isCurrent
          ? "bg-surface border-accent/40 ring-1 ring-accent/20 shadow-md"
          : isCompleted
          ? "bg-surface/90 border-border/80"
          : "bg-surface/60 border-border/70 opacity-90"
      }`}
    >
      {/* Top Banner / Accordion Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-canvas/50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Step Badge */}
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-extrabold text-xs sm:text-sm shrink-0 transition-transform ${
              isCompleted
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : isCurrent
                ? "bg-accent text-white shadow-md shadow-accent/25"
                : "bg-canvas border border-border text-ink-muted"
            }`}
          >
            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : milestone.stepNumber}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                {milestone.stageName}
              </span>
              {milestone.estimatedWeeks && (
                <span className="text-[10px] font-semibold text-accent px-2 py-0.2 rounded-md bg-accent/10">
                  {milestone.estimatedWeeks}
                </span>
              )}
            </div>

            <h3 className="font-bold text-sm sm:text-base text-ink truncate">
              {milestone.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Completion Meter */}
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-xs font-bold text-ink">
              {milestone.completionPercentage}% Done
            </span>
            <div className="w-20 h-1.5 bg-canvas border border-border/70 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isCompleted ? "bg-emerald-500" : isCurrent ? "bg-accent" : "bg-ink-muted"
                }`}
                style={{ width: `${milestone.completionPercentage}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas"
            aria-label={expanded ? "Collapse milestone" : "Expand milestone"}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Milestone Content */}
      {expanded && (
        <div className="px-4 sm:px-6 pb-5 pt-1 space-y-4 border-t border-border/60 animate-in fade-in duration-150">
          {/* Objective */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
              Objective
            </span>
            <p className="text-xs sm:text-sm text-ink leading-relaxed">
              {milestone.objective}
            </p>
          </div>

          {/* AI Coach Diagnostic Note */}
          {milestone.aiCoachNote && (
            <div className="p-3 rounded-2xl bg-ai/10 border border-ai/20 flex items-start gap-2.5 text-xs text-ink">
              <Sparkles className="w-4 h-4 text-ai shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-ai block text-[11px] uppercase tracking-wider">
                  AI Mentor Diagnostic
                </span>
                <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                  {milestone.aiCoachNote}
                </p>
              </div>
            </div>
          )}

          {/* Required Skills Grid */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-2">
              Required Competencies & Target Level
            </span>
            <div className="flex flex-wrap gap-1.5">
              {milestone.skills.map((sk) => (
                <span
                  key={sk.name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-canvas border border-border/80 text-xs text-ink shadow-xs"
                >
                  <span className="font-semibold">{sk.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-surface text-accent border border-border">
                    {sk.targetProficiency}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Checkable Tasks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                Milestone Action Tasks ({milestone.tasks.filter((t) => t.completed).length}/
                {milestone.tasks.length} Completed)
              </span>

              {!showAddTask && (
                <button
                  type="button"
                  onClick={() => setShowAddTask(true)}
                  className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Task</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {milestone.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(milestone.id, task.id)}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                    task.completed
                      ? "bg-canvas/40 border-border/50 text-ink-muted"
                      : "bg-canvas/70 border-border/80 hover:bg-canvas text-ink"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTask(milestone.id, task.id);
                      }}
                      className="text-ink-muted hover:text-accent shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <span
                      className={`text-xs font-medium truncate ${
                        task.completed ? "line-through text-ink-muted" : "text-ink"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  {task.isCustom && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-surface border border-border text-ink-muted">
                      Custom
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Add Custom Task Form */}
            {showAddTask && (
              <form onSubmit={handleCreateTask} className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Build end-to-end RAG pipeline with Pinecone"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 bg-canvas border border-border/80 text-xs rounded-xl px-3 py-2 text-ink focus:outline-none focus:border-accent"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  className="px-3 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-2.5 py-2 text-xs text-ink-muted hover:text-ink"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>

          {/* Recommended Resources */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-2">
              Recommended High-Yield Resources
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {milestone.resources.map((res) => {
                const Icon = RESOURCE_ICONS[res.type] || BookOpen;

                return (
                  <a
                    key={res.id}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-canvas/60 border border-border/80 hover:border-accent/60 hover:bg-canvas transition-all flex items-center justify-between gap-2 group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center text-accent border border-border/70 shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-ink truncate block group-hover:text-accent transition-colors">
                          {res.title}
                        </span>
                        <span className="text-[10px] text-ink-muted">
                          {res.provider} {res.duration && `• ${res.duration}`}
                        </span>
                      </div>
                    </div>

                    <ExternalLink className="w-3.5 h-3.5 text-ink-muted group-hover:text-accent shrink-0" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
