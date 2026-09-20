"use client";

import React, { useState } from "react";
import { JobApplication, ApplicationStage, ApplicationTask } from "@/types/job";
import {
  X,
  FileText,
  FileCheck2,
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface ApplicationDetailModalProps {
  application: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateApplication: (updatedApp: JobApplication) => void;
}

const STAGE_OPTIONS: { id: ApplicationStage; label: string; color: string }[] = [
  { id: "saved", label: "Saved", color: "text-ink-muted bg-canvas" },
  { id: "applied", label: "Applied", color: "text-blue-600 dark:text-blue-400 bg-blue-500/10" },
  { id: "oa", label: "OA (Assessment)", color: "text-amber-600 dark:text-amber-400 bg-amber-500/10" },
  { id: "interview", label: "Interview", color: "text-purple-600 dark:text-purple-400 bg-purple-500/10" },
  { id: "offer", label: "Offer Received", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" },
  { id: "rejected", label: "Rejected", color: "text-action bg-action/10" },
];

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  isOpen,
  onClose,
  onUpdateApplication,
}) => {
  if (!isOpen || !application) return null;

  const [notes, setNotes] = useState(application.notes);
  const [stage, setStage] = useState<ApplicationStage>(application.stage);
  const [tasks, setTasks] = useState<ApplicationTask[]>(application.tasks || []);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Interview state
  const [interviewDate, setInterviewDate] = useState(application.interviewInfo?.date || "");
  const [interviewTime, setInterviewTime] = useState(application.interviewInfo?.time || "");
  const [interviewMeetingUrl, setInterviewMeetingUrl] = useState(application.interviewInfo?.meetingUrl || "");
  const [interviewers, setInterviewers] = useState(application.interviewInfo?.interviewers || "");

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    saveChanges({ tasks: updated });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: ApplicationTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      completed: false,
    };

    const updated = [...tasks, newTask];
    setTasks(updated);
    setNewTaskTitle("");
    saveChanges({ tasks: updated });
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    saveChanges({ tasks: updated });
  };

  const handleStageChange = (newStage: ApplicationStage) => {
    setStage(newStage);
    saveChanges({ stage: newStage });
  };

  const saveChanges = (partial?: Partial<JobApplication>) => {
    const updated: JobApplication = {
      ...application,
      notes,
      stage,
      tasks,
      interviewInfo: {
        roundName: application.interviewInfo?.roundName || "Technical Round",
        roundType: application.interviewInfo?.roundType || "Technical Coding",
        date: interviewDate,
        time: interviewTime,
        meetingUrl: interviewMeetingUrl,
        interviewers: interviewers,
      },
      ...partial,
    };

    onUpdateApplication(updated);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-surface rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border/80 flex items-start justify-between gap-4 bg-canvas/50">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                {application.company}
              </span>
              <span className="text-xs text-ink-muted">•</span>
              <span className="text-xs text-ink-muted">{application.location}</span>
            </div>
            <h2 className="text-xl font-extrabold text-ink leading-tight">
              {application.role}
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              {application.appliedDate}
            </p>
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

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 divide-y divide-border/60">
          {/* 1. Status Selector */}
          <div className="pb-2">
            <label className="text-xs font-bold text-ink block mb-2 uppercase tracking-wider">
              Application Pipeline Stage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STAGE_OPTIONS.map((opt) => {
                const isSelected = stage === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleStageChange(opt.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                      isSelected
                        ? "border-accent bg-accent text-white shadow-sm shadow-accent/20"
                        : "border-border/70 bg-canvas/40 hover:bg-canvas text-ink"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Resume Used & ATS Suitability */}
          <div className="pt-5 space-y-3">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-accent" />
              <span>Resume Used for Application</span>
            </h3>

            <div className="p-4 rounded-2xl bg-canvas/50 border border-border/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-ink block truncate">
                    {application.resumeUsedName}
                  </span>
                  <span className="text-[11px] text-ink-muted block mt-0.5">
                    Tailored with ATS Keyword Optimization
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 inline-block">
                  {application.resumeMatchScore}% ATS Match
                </span>
              </div>
            </div>
          </div>

          {/* 3. Job Description */}
          {application.jobDescription && (
            <div className="pt-5 space-y-2">
              <h3 className="text-sm font-bold text-ink">Job Description Reference</h3>
              <p className="text-xs text-ink-muted leading-relaxed bg-canvas/40 p-3.5 rounded-2xl border border-border/70 whitespace-pre-line">
                {application.jobDescription}
              </p>
            </div>
          )}

          {/* 4. Interview Information */}
          <div className="pt-5 space-y-3">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
              <Video className="w-4 h-4 text-accent" />
              <span>Interview Information</span>
            </h3>

            <div className="p-4 rounded-2xl bg-canvas/40 border border-border/80 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-ink-muted block mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    placeholder="e.g. Thursday, Oct 15, 2026"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-surface border border-border focus:outline-accent text-ink"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-ink-muted block mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    placeholder="e.g. 4:00 PM - 5:00 PM IST"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-surface border border-border focus:outline-accent text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-ink-muted block mb-1">
                    Meeting URL / Platform
                  </label>
                  <input
                    type="text"
                    value={interviewMeetingUrl}
                    onChange={(e) => setInterviewMeetingUrl(e.target.value)}
                    placeholder="e.g. https://meet.google.com/xyz"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-surface border border-border focus:outline-accent text-ink"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-ink-muted block mb-1">
                    Interviewer(s)
                  </label>
                  <input
                    type="text"
                    value={interviewers}
                    onChange={(e) => setInterviewers(e.target.value)}
                    placeholder="e.g. Staff SDE, Payments"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-surface border border-border focus:outline-accent text-ink"
                  />
                </div>
              </div>

              {interviewMeetingUrl && (
                <div className="pt-1">
                  <a
                    href={interviewMeetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
                  >
                    <span>Launch Interview Meeting Room</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* 5. Application Tasks Checklist */}
          <div className="pt-5 space-y-3">
            <h3 className="text-sm font-bold text-ink flex items-center justify-between">
              <span>Preparation Tasks ({tasks.filter((t) => t.completed).length}/{tasks.length})</span>
            </h3>

            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-canvas/40 border border-border/70 group"
                >
                  <label className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                      className="w-4 h-4 rounded text-accent border-border focus:ring-accent accent-accent"
                    />
                    <span
                      className={`text-xs leading-tight select-none truncate ${
                        task.completed
                          ? "line-through text-ink-muted"
                          : "font-medium text-ink"
                      }`}
                    >
                      {task.title}
                    </span>
                  </label>

                  {task.dueDate && (
                    <span className="text-[10px] text-ink-muted shrink-0">
                      {task.dueDate}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-ink-muted hover:text-action transition-all"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add Task Input */}
              <form onSubmit={handleAddTask} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="+ Add prep task (e.g. Review Dijkstra & LeetCode Graph #200)..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-surface border border-border focus:outline-accent text-ink"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-accent text-white hover:bg-accent/90 shrink-0"
                >
                  Add Task
                </button>
              </form>
            </div>
          </div>

          {/* 6. Notes (Rich Editable Notes) */}
          <div className="pt-5 space-y-2">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-accent" />
              <span>Application Notes & Recruiter Communications</span>
            </h3>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record recruiter comments, compensation discussions, referral names, or technical questions asked..."
              className="w-full p-3 text-xs rounded-2xl bg-canvas/40 border border-border/80 focus:outline-accent text-ink leading-relaxed"
            />
          </div>

          {/* 7. Deadlines Summary */}
          <div className="pt-5 space-y-2">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              <span>Deadlines & Milestones</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {application.deadlines.applicationDeadline && (
                <div className="p-2.5 rounded-xl bg-canvas/40 border border-border/70 flex items-center justify-between">
                  <span className="text-ink-muted">Application Deadline</span>
                  <span className="font-semibold text-ink">{application.deadlines.applicationDeadline}</span>
                </div>
              )}
              {application.deadlines.oaDeadline && (
                <div className="p-2.5 rounded-xl bg-canvas/40 border border-border/70 flex items-center justify-between">
                  <span className="text-ink-muted">OA Deadline</span>
                  <span className="font-semibold text-ink">{application.deadlines.oaDeadline}</span>
                </div>
              )}
              {application.deadlines.interviewDate && (
                <div className="p-2.5 rounded-xl bg-canvas/40 border border-border/70 flex items-center justify-between">
                  <span className="text-ink-muted">Interview Date</span>
                  <span className="font-semibold text-accent">{application.deadlines.interviewDate}</span>
                </div>
              )}
              {application.deadlines.offerDeadline && (
                <div className="p-2.5 rounded-xl bg-canvas/40 border border-border/70 flex items-center justify-between">
                  <span className="text-ink-muted">Offer Decision</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{application.deadlines.offerDeadline}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-border/80 bg-canvas/60 flex items-center justify-between gap-3">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold transition-opacity">
            {savedFeedback ? "✓ Changes saved successfully" : ""}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface border border-border text-ink hover:bg-canvas transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => saveChanges()}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-accent text-white hover:bg-accent/90 shadow-sm shadow-accent/20 flex items-center gap-1.5 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
