"use client";

import React from "react";
import { ProjectItem } from "@/types/onboarding";
import {
  FolderGit2,
  ExternalLink,
  Github,
  Award,
  Plus,
  Edit3,
  Layers,
} from "lucide-react";

interface ProjectsCardProps {
  projects: ProjectItem[];
  onAddProject: () => void;
  onEdit: () => void;
}

export const ProjectsCard: React.FC<ProjectsCardProps> = ({
  projects,
  onAddProject,
  onEdit,
}) => {
  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 shadow-xs hover:border-border transition-all">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">Featured Projects</h3>
            <p className="text-xs text-ink-muted">
              Production systems, impact metrics, repositories, and live deployments.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onAddProject}
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
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
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-canvas/70 border border-border/70 hover:border-accent/40 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-ink flex items-center gap-2">
                  <span>{proj.title}</span>
                </h4>
                <span className="text-xs text-accent font-semibold">
                  {proj.role}
                </span>
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-2">
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-border/80 text-xs font-semibold text-ink hover:text-accent transition-colors"
                  >
                    <Github className="w-3.5 h-3.5 text-ink-muted" />
                    <span>Source</span>
                    <ExternalLink className="w-2.5 h-2.5 text-ink-muted" />
                  </a>
                )}
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent/15 border border-accent/30 text-xs font-bold text-accent hover:bg-accent/25 transition-colors"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-[13px] text-ink-muted leading-relaxed">
              {proj.description}
            </p>

            {/* Quantified Impact Metric */}
            {proj.impactMetrics && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <Award className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                <span>
                  <strong className="font-bold">Measurable Impact:</strong> {proj.impactMetrics}
                </span>
              </div>
            )}

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <Layers className="w-3 h-3 text-ink-muted mr-1" />
              {proj.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-surface border border-border/80 text-[11px] font-semibold text-ink"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="p-8 text-center rounded-2xl border border-dashed border-border/80">
            <FolderGit2 className="w-8 h-8 text-ink-muted mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-ink">No projects added yet</p>
            <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
              Add your best academic, capstone, or personal open-source projects to bolster your ATS score.
            </p>
            <button
              onClick={onAddProject}
              className="mt-3 px-4 py-1.5 rounded-xl bg-accent text-white text-xs font-bold"
            >
              Add First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
