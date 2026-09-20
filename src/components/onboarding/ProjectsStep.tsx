"use client";

import React, { useState } from "react";
import { ProjectItem, CertificationItem } from "@/types/onboarding";
import {
  FolderGit2,
  Award,
  Plus,
  Trash2,
  ExternalLink,
  Github,
  Globe,
  Sparkles,
  Layers,
  HelpCircle,
} from "lucide-react";

interface ProjectsStepProps {
  projects: ProjectItem[];
  certifications: CertificationItem[];
  onChangeProjects: (projects: ProjectItem[]) => void;
  onChangeCertifications: (certifications: CertificationItem[]) => void;
  errors: Record<string, string>;
}

export const ProjectsStep: React.FC<ProjectsStepProps> = ({
  projects,
  certifications,
  onChangeProjects,
  onChangeCertifications,
  errors,
}) => {
  // New project state
  const [showAddProject, setShowAddProject] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectRole, setProjectRole] = useState("Full Stack Developer");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTech, setProjectTech] = useState("");
  const [projectLiveUrl, setProjectLiveUrl] = useState("");
  const [projectGithubUrl, setProjectGithubUrl] = useState("");
  const [projectMetrics, setProjectMetrics] = useState("");

  // New certification state
  const [showAddCert, setShowAddCert] = useState(false);
  const [certTitle, setCertTitle] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certYear, setCertYear] = useState("2024");
  const [certUrl, setCertUrl] = useState("");

  const handleSaveProject = () => {
    if (!projectTitle.trim() || !projectDescription.trim()) return;

    const techArray = projectTech
      ? projectTech.split(",").map((t) => t.trim()).filter(Boolean)
      : ["React", "TypeScript"];

    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: projectTitle.trim(),
      role: projectRole.trim(),
      description: projectDescription.trim(),
      technologies: techArray,
      liveUrl: projectLiveUrl.trim() || undefined,
      githubUrl: projectGithubUrl.trim() || undefined,
      impactMetrics: projectMetrics.trim() || undefined,
    };

    onChangeProjects([...projects, newProject]);

    // Reset
    setProjectTitle("");
    setProjectRole("Full Stack Developer");
    setProjectDescription("");
    setProjectTech("");
    setProjectLiveUrl("");
    setProjectGithubUrl("");
    setProjectMetrics("");
    setShowAddProject(false);
  };

  const handleDeleteProject = (id: string) => {
    onChangeProjects(projects.filter((p) => p.id !== id));
  };

  const handleSaveCert = () => {
    if (!certTitle.trim() || !certIssuer.trim()) return;

    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      title: certTitle.trim(),
      issuer: certIssuer.trim(),
      issueYear: certYear,
      credentialUrl: certUrl.trim() || undefined,
    };

    onChangeCertifications([...certifications, newCert]);

    // Reset
    setCertTitle("");
    setCertIssuer("");
    setCertYear("2024");
    setCertUrl("");
    setShowAddCert(false);
  };

  const handleDeleteCert = (id: string) => {
    onChangeCertifications(certifications.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="border-b border-border/70 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-1">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Step 5 • Proof of Work & Credentials</span>
          </div>
          <span className="text-xs font-bold text-accent px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20">
            {projects.length} Projects • {certifications.length} Certs
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-ink">
          Key Projects & Industry Certifications
        </h3>
        <p className="text-sm text-ink-muted mt-1">
          High-impact portfolio projects and verified credentials are the #1 differentiator in engineering campus placements.
        </p>
      </div>

      {/* Projects List Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-base font-bold text-ink flex items-center gap-2">
              <span>Showcase Projects</span>
              <span className="text-xs text-ink-muted font-normal">
                (Add at least 1-2 major projects)
              </span>
            </h4>
          </div>

          {!showAddProject && (
            <button
              type="button"
              onClick={() => setShowAddProject(true)}
              className="inline-flex items-center gap-1.5 bg-accent text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-accent/90 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          )}
        </div>

        {/* Existing Projects Cards */}
        {projects.length === 0 && !showAddProject && (
          <div className="p-6 rounded-2xl border border-dashed border-border/90 bg-canvas/40 text-center">
            <FolderGit2 className="w-8 h-8 text-ink-muted/60 mx-auto mb-2" />
            <p className="text-sm font-semibold text-ink">No projects added yet</p>
            <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
              Add a full-stack, AI, or systems project to boost your placement readiness score above 75%.
            </p>
            <button
              type="button"
              onClick={() => setShowAddProject(true)}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add your first project now</span>
            </button>
          </div>
        )}

        <div className="space-y-3">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-4 rounded-2xl bg-surface border border-border/80 shadow-xs hover:border-border transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="font-bold text-sm text-ink">{proj.title}</h5>
                    <span className="text-[11px] text-ink-muted px-2 py-0.2 rounded-md bg-canvas border border-border">
                      {proj.role}
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteProject(proj.id)}
                  className="p-1.5 text-ink-muted hover:text-action rounded-lg hover:bg-canvas transition-colors shrink-0"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {proj.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-accent/10 text-accent"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Links & Impact */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-border/60 text-xs">
                {proj.impactMetrics ? (
                  <span className="text-[11px] text-ink-muted flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-attention" />
                    <span className="italic">{proj.impactMetrics}</span>
                  </span>
                ) : <span />}

                <div className="flex items-center gap-3">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-ink-muted hover:text-ink transition-colors font-medium text-[11px]"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-accent hover:underline font-medium text-[11px]"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Project Form Modal/Card */}
        {showAddProject && (
          <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-canvas/80 border border-accent/30 shadow-sm space-y-3.5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-border/70 pb-2">
              <span className="font-bold text-xs sm:text-sm text-ink flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-accent" />
                <span>New Project Details</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAddProject(false)}
                className="text-xs text-ink-muted hover:text-ink font-semibold"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Project Title <span className="text-action">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI Career Copilot"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-surface border border-border/80 text-ink text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Your Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead Full Stack Developer"
                  value={projectRole}
                  onChange={(e) => setProjectRole(e.target.value)}
                  className="w-full bg-surface border border-border/80 text-ink text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-ink mb-1">
                  Project Description & Architecture <span className="text-action">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Summarize what the app does, key architectural decisions, and why you built it..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full bg-surface border border-border/80 text-ink text-xs rounded-xl p-3 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-ink mb-1">
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, TypeScript, Tailwind CSS, PostgreSQL, Docker"
                  value={projectTech}
                  onChange={(e) => setProjectTech(e.target.value)}
                  className="w-full bg-surface border border-border/80 text-ink text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username/project"
                  value={projectGithubUrl}
                  onChange={(e) => setProjectGithubUrl(e.target.value)}
                  className="w-full bg-surface border border-border/80 text-ink text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  placeholder="https://myproject.vercel.app"
                  value={projectLiveUrl}
                  onChange={(e) => setProjectLiveUrl(e.target.value)}
                  className="w-full bg-surface border border-border/80 text-ink text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-ink mb-1">
                  Key Metric / Quantitative Impact
                </label>
                <input
                  type="text"
                  placeholder="e.g. Handled 5k+ queries/sec, reduced API latency by 35%"
                  value={projectMetrics}
                  onChange={(e) => setProjectMetrics(e.target.value)}
                  className="w-full bg-surface border border-border/80 text-ink text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddProject(false)}
                className="px-3 py-1.5 text-xs text-ink-muted hover:text-ink rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProject}
                disabled={!projectTitle.trim() || !projectDescription.trim()}
                className="bg-accent text-white text-xs font-semibold px-4 py-1.5 rounded-xl hover:bg-accent/90 disabled:opacity-50 transition-all"
              >
                Save Project
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Certifications Section */}
      <div className="pt-4 border-t border-border/60">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-base font-bold text-ink flex items-center gap-2">
              <Award className="w-4 h-4 text-attention" />
              <span>Certifications & Verified Credentials</span>
            </h4>
            <p className="text-xs text-ink-muted">
              Add AWS, Azure, Google Cloud, Meta, or Coursera credentials.
            </p>
          </div>

          {!showAddCert && (
            <button
              type="button"
              onClick={() => setShowAddCert(true)}
              className="inline-flex items-center gap-1.5 bg-surface border border-border/80 text-ink text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-canvas transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-accent" />
              <span>Add Credential</span>
            </button>
          )}
        </div>

        {/* Existing Certifications */}
        <div className="space-y-2">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between p-3 rounded-xl bg-canvas/60 border border-border/80"
            >
              <div>
                <span className="font-semibold text-xs sm:text-sm text-ink block">
                  {cert.title}
                </span>
                <span className="text-[11px] text-ink-muted">
                  {cert.issuer} • Issued {cert.issueYear}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-accent hover:underline text-xs flex items-center gap-1"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteCert(cert.id)}
                  className="p-1 text-ink-muted hover:text-action transition-colors rounded"
                  title="Remove credential"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Cert Inline */}
        {showAddCert && (
          <div className="mt-3 p-3.5 rounded-xl bg-canvas/80 border border-border/80 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Certification Name (e.g. AWS Cloud Practitioner)"
                value={certTitle}
                onChange={(e) => setCertTitle(e.target.value)}
                className="sm:col-span-2 bg-surface border border-border/80 text-ink text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent"
              />
              <input
                type="text"
                placeholder="Issuer (e.g. AWS, Meta)"
                value={certIssuer}
                onChange={(e) => setCertIssuer(e.target.value)}
                className="bg-surface border border-border/80 text-ink text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="url"
                placeholder="Credential Verification URL (Optional)"
                value={certUrl}
                onChange={(e) => setCertUrl(e.target.value)}
                className="sm:col-span-2 bg-surface border border-border/80 text-ink text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent"
              />
              <select
                value={certYear}
                onChange={(e) => setCertYear(e.target.value)}
                className="bg-surface border border-border/80 text-ink text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent"
              >
                {["2025", "2024", "2023", "2022", "2021"].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddCert(false)}
                className="px-3 py-1 text-xs text-ink-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCert}
                disabled={!certTitle.trim() || !certIssuer.trim()}
                className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-xl hover:bg-accent/90 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
