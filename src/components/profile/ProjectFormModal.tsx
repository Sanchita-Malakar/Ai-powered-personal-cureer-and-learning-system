"use client";

import React, { useState, useEffect } from "react";
import { ProjectItem } from "@/types/onboarding";
import { parseGithubUrl } from "@/lib/verification/urlUtils";
import { RepoSelectorModal } from "./RepoSelectorModal";
import { GithubPermittedRepo } from "@/types/verification";
import {
  X,
  FolderGit2,
  Github,
  Globe,
  Award,
  Layers,
  Check,
  AlertCircle,
  FolderTree,
  ListFilter,
} from "lucide-react";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: ProjectItem | null;
  onSave: (project: ProjectItem) => void;
  userId?: string;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
  onSave,
  userId,
}) => {
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("Full Stack Developer");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [techInput, setTechInput] = useState("");
  const [impactMetrics, setImpactMetrics] = useState("");
  const [rootPath, setRootPath] = useState("");
  const [githubRepositoryId, setGithubRepositoryId] = useState<number | undefined>(undefined);
  const [repoSelectorOpen, setRepoSelectorOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (projectToEdit) {
        setTitle(projectToEdit.title || "");
        setRole(projectToEdit.role || "Full Stack Developer");
        setDescription(projectToEdit.description || "");
        setGithubUrl(projectToEdit.githubUrl || "");
        setLiveUrl(projectToEdit.liveUrl || "");
        setTechInput(projectToEdit.technologies ? projectToEdit.technologies.join(", ") : "");
        setImpactMetrics(projectToEdit.impactMetrics || "");
        setRootPath(projectToEdit.rootPath || "");
        setGithubRepositoryId(projectToEdit.githubRepositoryId);
      } else {
        setTitle("");
        setRole("Full Stack Developer");
        setDescription("");
        setGithubUrl("");
        setLiveUrl("");
        setTechInput("Next.js, TypeScript, Tailwind CSS, PostgreSQL");
        setImpactMetrics("");
        setRootPath("");
        setGithubRepositoryId(undefined);
      }
      setErrors({});
    }
  }, [isOpen, projectToEdit]);

  if (!isOpen) return null;

  const handleSelectAuthorizedRepo = (repo: GithubPermittedRepo, selectedRootPath?: string) => {
    setGithubUrl(repo.htmlUrl);
    setGithubRepositoryId(repo.githubRepositoryId);
    if (!title) {
      setTitle(repo.repositoryName.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
    }
    if (selectedRootPath) {
      setRootPath(selectedRootPath);
    }
    setErrors((prev) => ({ ...prev, githubUrl: "" }));
  };

  const handleValidateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Project title is required.";
    }
    if (!description.trim() || description.trim().length < 20) {
      newErrors.description = "Please provide a meaningful description (at least 20 characters).";
    }

    // Strict GitHub URL Validation
    const parsed = parseGithubUrl(githubUrl);
    if (!parsed.isValid) {
      newErrors.githubUrl = parsed.error || "A valid GitHub repository URL is required for verification.";
    }

    // Monorepo Path Traversal Prevention
    if (rootPath && (rootPath.includes("..") || rootPath.includes("~"))) {
      newErrors.rootPath = "Invalid root path: directory traversal (..) is not permitted.";
    }

    const techArray = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (techArray.length === 0) {
      newErrors.technologies = "Please list at least one technology used in this project.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const savedProject: ProjectItem = {
      id: projectToEdit ? projectToEdit.id : `proj-${Date.now()}`,
      title: title.trim(),
      role: role.trim(),
      description: description.trim(),
      technologies: techArray,
      githubUrl: parsed.normalizedUrl,
      liveUrl: liveUrl.trim() || undefined,
      impactMetrics: impactMetrics.trim() || undefined,
      verificationStatus: projectToEdit ? projectToEdit.verificationStatus || "NOT_VERIFIED" : "NOT_VERIFIED",
      verificationScore: projectToEdit?.verificationScore,
      lastVerifiedAt: projectToEdit?.lastVerifiedAt,
      verifiedCommitSha: projectToEdit?.verifiedCommitSha,
      rootPath: rootPath.trim() || undefined,
      githubRepositoryId,
    };

    onSave(savedProject);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-lg rounded-3xl bg-surface border border-border shadow-2xl p-6 sm:p-7 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center border border-emerald-500/25">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">
                  {projectToEdit ? "Edit Featured Project" : "Add Featured Project"}
                </h3>
                <p className="text-xs text-ink-muted">
                  Requires GitHub repository URL for evidence-based verification.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-border/60 text-ink-muted hover:text-ink transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleValidateAndSubmit} className="space-y-4 text-xs">
            {/* Title & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-ink">Project Title *</label>
                <input
                  type="text"
                  placeholder="e.g. AI Interview Trainer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-ink focus:outline-none focus:border-accent"
                />
                {errors.title && <p className="text-[11px] text-red-500">{errors.title}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink">Your Role</label>
                <input
                  type="text"
                  placeholder="e.g. Full Stack Developer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-ink focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* GitHub URL (Required) & Quick Picker */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-ink flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-accent" />
                  <span>GitHub Repository URL *</span>
                </label>
                <button
                  type="button"
                  onClick={() => setRepoSelectorOpen(true)}
                  className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ListFilter className="w-3 h-3" />
                  <span>Select from Authorized</span>
                </button>
              </div>
              <input
                type="text"
                placeholder="https://github.com/username/repository"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-ink focus:outline-none focus:border-accent font-mono text-[11px]"
              />
              {errors.githubUrl ? (
                <p className="text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.githubUrl}</span>
                </p>
              ) : (
                <p className="text-[10px] text-ink-muted">
                  Must be an authorized or public repository. Will be inspected during project verification.
                </p>
              )}
            </div>

            {/* Monorepo Subdirectory (Optional) */}
            <div className="space-y-1">
              <label className="font-bold text-ink flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5 text-blue-500" />
                <span>Monorepo Subdirectory (Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. packages/client or apps/web (leave blank if repository root)"
                value={rootPath}
                onChange={(e) => setRootPath(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-ink focus:outline-none focus:border-accent font-mono text-[11px]"
              />
              {errors.rootPath ? (
                <p className="text-[11px] text-red-500">{errors.rootPath}</p>
              ) : (
                <p className="text-[10px] text-ink-muted">
                  Scopes analysis to a specific directory inside a monorepo.
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="font-bold text-ink">Project Description *</label>
              <textarea
                rows={3}
                placeholder="Describe the problem solved, architectural approach, and core features..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-ink focus:outline-none focus:border-accent resize-none leading-relaxed"
              />
              {errors.description && (
                <p className="text-[11px] text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Technologies */}
            <div className="space-y-1">
              <label className="font-bold text-ink flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-accent" />
                <span>Technologies Used (Comma-separated) *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Next.js, FastAPI, PostgreSQL, Docker, LangChain"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-ink focus:outline-none focus:border-accent"
              />
              {errors.technologies && (
                <p className="text-[11px] text-red-500">{errors.technologies}</p>
              )}
            </div>

            {/* Live URL & Impact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-ink flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <span>Live Demo URL (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="https://my-app.vercel.app"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-ink focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Impact Metric (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Processed 10k+ requests/day"
                  value={impactMetrics}
                  onChange={(e) => setImpactMetrics(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-ink focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/70">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-ink-muted hover:text-ink hover:bg-border/60 font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-accent text-white font-bold hover:bg-accent/90 transition-all flex items-center gap-1.5 shadow-sm shadow-accent/25 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Project</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Authorized Repository Selector Modal */}
      <RepoSelectorModal
        isOpen={repoSelectorOpen}
        onClose={() => setRepoSelectorOpen(false)}
        userId={userId}
        onSelectRepo={handleSelectAuthorizedRepo}
        initialRootPath={rootPath}
      />
    </>
  );
};
