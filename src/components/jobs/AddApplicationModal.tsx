"use client";

import React, { useState } from "react";
import { JobApplication, ApplicationStage } from "@/types/job";
import { X, Plus, Building2, Briefcase, MapPin, FileText } from "lucide-react";

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApplication: (app: JobApplication) => void;
}

export const AddApplicationModal: React.FC<AddApplicationModalProps> = ({
  isOpen,
  onClose,
  onAddApplication,
}) => {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("Bangalore, India");
  const [stage, setStage] = useState<ApplicationStage>("applied");
  const [resumeUsedName, setResumeUsedName] = useState("Alex_Rivera_AI_ML_Resume_v3.pdf");
  const [notes, setNotes] = useState("");
  const [deadline, setDeadline] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    const newApp: JobApplication = {
      id: `app-custom-${Date.now()}`,
      company: company.trim(),
      role: role.trim(),
      location: location.trim(),
      stage,
      resumeUsedName,
      resumeMatchScore: 85,
      notes: notes.trim(),
      tasks: [],
      deadlines: {
        applicationDeadline: deadline || "Rolling",
      },
      appliedDate: `Added on ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    };

    onAddApplication(newApp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-ink/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg bg-surface rounded-3xl border border-border shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        <div className="p-5 sm:p-6 border-b border-border/80 flex items-center justify-between bg-canvas/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-accent/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">Track Custom Application</h2>
              <p className="text-xs text-ink-muted">Add a job applied outside CareerOS</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-canvas transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-ink mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. NVIDIA, OpenAI, Goldman Sachs"
              className="w-full px-3.5 py-2 rounded-xl bg-canvas border border-border focus:outline-accent text-ink"
            />
          </div>

          <div>
            <label className="block font-semibold text-ink mb-1">Role Title *</label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. AI Systems Intern / SDE-1"
              className="w-full px-3.5 py-2 rounded-xl bg-canvas border border-border focus:outline-accent text-ink"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-ink mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bangalore / Remote"
                className="w-full px-3.5 py-2 rounded-xl bg-canvas border border-border focus:outline-accent text-ink"
              />
            </div>
            <div>
              <label className="block font-semibold text-ink mb-1">Current Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as ApplicationStage)}
                className="w-full px-3.5 py-2 rounded-xl bg-canvas border border-border focus:outline-accent text-ink font-medium"
              >
                <option value="saved">Saved</option>
                <option value="applied">Applied</option>
                <option value="oa">OA (Assessment)</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer Received</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-ink mb-1">Resume Used</label>
              <input
                type="text"
                value={resumeUsedName}
                onChange={(e) => setResumeUsedName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-canvas border border-border focus:outline-accent text-ink font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block font-semibold text-ink mb-1">Next Deadline / Date</label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g. Oct 25, 2026"
                className="w-full px-3.5 py-2 rounded-xl bg-canvas border border-border focus:outline-accent text-ink"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-ink mb-1">Initial Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Referral name, job portal link, or specific questions..."
              className="w-full px-3.5 py-2 rounded-xl bg-canvas border border-border focus:outline-accent text-ink"
            />
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface border border-border text-ink hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-accent text-white hover:bg-accent/90 shadow-sm shadow-accent/20"
            >
              Track Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
