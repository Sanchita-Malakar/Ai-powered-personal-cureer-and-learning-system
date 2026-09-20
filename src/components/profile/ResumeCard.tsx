"use client";

import React from "react";
import { ResumeData } from "@/types/onboarding";
import {
  FileText,
  FileCheck2,
  Upload,
  Download,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface ResumeCardProps {
  resume: ResumeData | null;
  onUploadNew: () => void;
  onNavigateSection?: (sectionId: string, paramId?: string) => void;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({
  resume,
  onUploadNew,
  onNavigateSection,
}) => {
  const currentResume: ResumeData = resume || {
    fileName: "Alex_Rivera_SDE_Resume.pdf",
    fileSize: "1.4 MB",
    uploadedAt: "Sep 18, 2026",
    atsScore: 88,
    extractedSkills: [
      "Python",
      "TypeScript",
      "React",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "PyTorch",
      "Algorithms",
    ],
    readinessSummary:
      "Strong quantified engineering bullet points, validated project section, ATS score 88/100 matching Tier-1 criteria.",
  };

  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 shadow-xs hover:border-border transition-all">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center border border-accent/20">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">Active Resume & ATS Profile</h3>
            <p className="text-xs text-ink-muted">
              Parsed curriculum vitae feeding AI keyword matching and recruiter screening.
            </p>
          </div>
        </div>
        <button
          onClick={onUploadNew}
          className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload New Version</span>
        </button>
      </div>

      <div className="p-5 rounded-2xl bg-canvas/70 border border-border/70 space-y-4">
        {/* Top File Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink flex items-center gap-1.5">
                <span>{currentResume.fileName}</span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  ATS Verified
                </span>
              </h4>
              <p className="text-xs text-ink-muted">
                {currentResume.fileSize} • Uploaded {currentResume.uploadedAt}
              </p>
            </div>
          </div>

          {/* ATS Score Indicator */}
          <div className="flex items-center gap-2.5 bg-surface border border-border px-3.5 py-2 rounded-xl">
            <div className="text-right">
              <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block">
                ATS Score
              </span>
              <span className="text-xs font-semibold text-emerald-500">Tier-1 Qualified</span>
            </div>
            <span className="text-xl font-black text-ink">
              {currentResume.atsScore}/100
            </span>
          </div>
        </div>

        {/* Readiness Summary */}
        <div className="p-3 rounded-xl bg-surface border border-border/70 flex items-start gap-2.5 text-xs text-ink-muted">
          <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-ink font-semibold">AI Parser Analysis:</strong>{" "}
            {currentResume.readinessSummary}
          </p>
        </div>

        {/* Extracted Skills */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-2">
            Skills Successfully Extracted by ATS:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {currentResume.extractedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-surface border border-border/80 text-xs font-medium text-ink"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Actions Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateSection?.("resume")}
              className="px-3.5 py-2 rounded-xl bg-accent text-white hover:bg-accent/90 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Open in Resume Analyzer</span>
            </button>
            <button
              onClick={onUploadNew}
              className="px-3 py-2 rounded-xl bg-surface hover:bg-border/60 border border-border text-ink text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-ink-muted" />
              <span>Replace File</span>
            </button>
          </div>
          <button
            onClick={() => alert("Downloading active resume...")}
            className="text-xs font-semibold text-ink-muted hover:text-ink flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
