"use client";

import React from "react";
import { ExperienceItem } from "@/types/onboarding";
import {
  Briefcase,
  MapPin,
  Calendar,
  Layers,
  Plus,
  Edit3,
  TrendingUp,
} from "lucide-react";

interface ExperienceCardProps {
  experiences: ExperienceItem[];
  onAddExperience: () => void;
  onEdit: () => void;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experiences,
  onAddExperience,
  onEdit,
}) => {
  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 shadow-xs hover:border-border transition-all">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center border border-sky-500/20">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">Professional Experience</h3>
            <p className="text-xs text-ink-muted">
              Internships, freelance work, and engineering responsibilities.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onAddExperience}
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Experience</span>
          </button>
          <span className="text-border">•</span>
          <button
            onClick={onEdit}
            className="text-xs font-semibold text-ink-muted hover:text-ink flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Manage</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-5 rounded-2xl bg-canvas/70 border border-border/70 hover:border-sky-500/40 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-ink flex items-center gap-2">
                  <span>{exp.role}</span>
                  {exp.current && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      Current Role
                    </span>
                  )}
                </h4>
                <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                  {exp.company}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                {exp.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-ink-muted" />
                    {exp.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-ink-muted" />
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-[13px] text-ink-muted leading-relaxed">
              {exp.description}
            </p>

            {/* Tech Stack Pills */}
            {exp.skillsUsed && exp.skillsUsed.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <Layers className="w-3 h-3 text-ink-muted mr-1" />
                {exp.skillsUsed.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-surface border border-border/80 text-[11px] font-semibold text-ink"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="p-8 text-center rounded-2xl border border-dashed border-border/80">
            <Briefcase className="w-8 h-8 text-ink-muted mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-ink">No work experience logged yet</p>
            <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
              Add your summer internships, freelance engineering projects, or student research roles.
            </p>
            <button
              onClick={onAddExperience}
              className="mt-3 px-4 py-1.5 rounded-xl bg-accent text-white text-xs font-bold"
            >
              Add First Experience
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
