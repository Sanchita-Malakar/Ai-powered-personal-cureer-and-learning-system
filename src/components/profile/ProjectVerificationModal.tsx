"use client";

import React from "react";
import { ProjectVerificationReport } from "@/types/verification";
import {
  CheckCircle2,
  X,
  Code2,
  Cpu,
  Layers,
  FileCheck2,
  Award,
  TrendingUp,
  Sparkles,
  GitCommit,
  ExternalLink,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";

interface ProjectVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ProjectVerificationReport | null;
  projectTitle?: string;
  githubUrl?: string;
}

export const ProjectVerificationModal: React.FC<ProjectVerificationModalProps> = ({
  isOpen,
  onClose,
  report,
  projectTitle = "Project Verification",
  githubUrl,
}) => {
  if (!isOpen || !report) return null;

  const metrics = report.metrics || {
    technologyDepth: 75,
    architectureQuality: 70,
    implementationComplexity: 78,
    testingPractices: 50,
    documentationPractices: 65,
    engineeringPractices: 72,
    codebaseSizeScore: 80,
  };

  const metricItems = [
    { label: "Technology Depth", score: metrics.technologyDepth, icon: Cpu, color: "text-purple-500", bg: "bg-purple-500" },
    { label: "Architecture Quality", score: metrics.architectureQuality, icon: Layers, color: "text-blue-500", bg: "bg-blue-500" },
    { label: "Implementation Complexity", score: metrics.implementationComplexity, icon: Code2, color: "text-emerald-500", bg: "bg-emerald-500" },
    { label: "Testing & Verification", score: metrics.testingPractices, icon: FileCheck2, color: "text-amber-500", bg: "bg-amber-500" },
    { label: "Engineering Practices", score: metrics.engineeringPractices, icon: ShieldCheck, color: "text-sky-500", bg: "bg-sky-500" },
    { label: "Documentation", score: metrics.documentationPractices, icon: Award, color: "text-indigo-500", bg: "bg-indigo-500" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-surface border border-border shadow-2xl p-6 sm:p-7 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-border/70">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
                  Project Verified ✓
                </span>
                {report.commitSha && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-canvas border border-border text-ink-muted flex items-center gap-1">
                    <GitCommit className="w-3 h-3" />
                    {report.commitSha.slice(0, 7)}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-ink">{projectTitle}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-border/60 text-ink-muted hover:text-ink transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Score Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border border-accent/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              Project Evidence Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-ink">{report.overallScore}</span>
              <span className="text-sm font-semibold text-ink-muted">/ 100</span>
            </div>
            <p className="text-xs text-ink-muted mt-0.5">
              Pattern: <strong className="text-ink">{report.aiAnalysisSummary?.architecturalPattern || "Full-Stack Application"}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-surface border border-accent/30 text-xs font-bold text-accent shadow-xs">
              {report.aiAnalysisSummary?.codeQualityTier || "Production-ready"}
            </span>
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-surface border border-border/80 text-ink hover:text-accent transition-colors"
                title="View GitHub Repository"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Skill Impact Section */}
        {report.skillImpacts && report.skillImpacts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                Verified Skill Proficiency Impact
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {report.skillImpacts.map((impact, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-canvas/80 border border-border/80 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-xs text-ink">{impact.skillName}</span>
                    <p className="text-[11px] text-ink-muted">{impact.newLevel}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink-muted line-through font-mono">
                      {impact.previousPercentage}%
                    </span>
                    <span className="text-xs font-extrabold text-emerald-500 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                      → {impact.newPercentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detected Technologies */}
        {report.detectedTechnologies && report.detectedTechnologies.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Technologies Evidenced in Repository</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.detectedTechnologies.map((tech, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-canvas/60 border border-border/80 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-ink">{tech.name}</span>
                    <span className="font-semibold text-accent font-mono">{tech.score}/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-border/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${tech.score}%` }}
                    />
                  </div>
                  {tech.signals && tech.signals[0] && (
                    <p className="text-[11px] text-ink-muted truncate">
                      • {tech.signals[0]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Metrics Breakdown */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-500" />
            <span>Multidimensional Evaluation Metrics</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {metricItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-canvas/60 border border-border/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-medium text-ink-muted">{item.label}</span>
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <div className="text-base font-extrabold text-ink font-mono">
                    {item.score}
                    <span className="text-[10px] font-normal text-ink-muted">/100</span>
                  </div>
                  <div className="w-full h-1 bg-border/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.bg} rounded-full`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Engineering Highlights & Recommendations */}
        {report.aiAnalysisSummary && (
          <div className="p-4 rounded-2xl bg-canvas/80 border border-border/80 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Engineering Audit & Recommendations</span>
            </div>

            {report.aiAnalysisSummary.keyHighlights && (
              <ul className="space-y-1 text-xs text-ink-muted">
                {report.aiAnalysisSummary.keyHighlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            )}

            {report.aiAnalysisSummary.recommendations && report.aiAnalysisSummary.recommendations.length > 0 && (
              <div className="pt-2 border-t border-border/60 flex items-start gap-2 text-xs text-ink-muted">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Next Level:</strong> {report.aiAnalysisSummary.recommendations[0]}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 text-xs text-ink-muted">
          <span>
            Verified on {new Date(report.verifiedAt).toLocaleDateString()} • System v{report.analysisVersion}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-accent text-white font-bold hover:bg-accent/90 transition-colors cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
