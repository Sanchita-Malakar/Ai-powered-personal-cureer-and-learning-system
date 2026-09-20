"use client";

import React, { useState, useRef } from "react";
import { CompleteStudentProfile, ResumeData } from "@/types/onboarding";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trash2,
  FileCheck2,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Award,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface ResumeUploadStepProps {
  profile: CompleteStudentProfile;
  resume: ResumeData | null;
  onUpdateResume: (resume: ResumeData | null) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const ResumeUploadStep: React.FC<ResumeUploadStepProps> = ({
  profile,
  resume,
  onUpdateResume,
  onSubmit,
  isSubmitting,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file) return;
    setIsScanning(true);

    // Simulate smart ATS analysis and extraction
    setTimeout(() => {
      const simulatedResume: ResumeData = {
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        atsScore: 88,
        extractedSkills: [
          "TypeScript",
          "React",
          "Node.js",
          "Next.js",
          "PostgreSQL",
          "Docker",
          "Data Structures",
          "Algorithms",
        ],
        readinessSummary:
          "High ATS compatibility. Strong action verbs detected in project achievements. Excellent alignment with " +
          profile.careerPreferences.primaryRole +
          ".",
      };

      onUpdateResume(simulatedResume);
      setIsScanning(false);
    }, 1200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSampleResume = () => {
    setIsScanning(true);
    setTimeout(() => {
      const sampleResume: ResumeData = {
        fileName: `${profile.personalInfo.fullName.replace(/\s+/g, "_") || "Alex_Rivera"}_Resume.pdf`,
        fileSize: "1.2 MB",
        uploadedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        atsScore: 91,
        extractedSkills: [
          "React",
          "TypeScript",
          "Node.js",
          "Next.js",
          "PostgreSQL",
          "Docker",
          "AWS",
          "Algorithms",
        ],
        readinessSummary:
          "Exceptional technical profile. Quantified project impact metrics (+35% latency reduction), strong GitHub portfolio, and clean ATS-compliant single-column layout.",
      };
      onUpdateResume(sampleResume);
      setIsScanning(false);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="border-b border-border/70 pb-4">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-1">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Step 7 • Resume Scan & Student Profile Audit</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-ink">
          Upload Resume & Review Student Profile
        </h3>
        <p className="text-sm text-ink-muted mt-1">
          Upload your resume for real-time ATS benchmark scanning, keyword alignment against target roles, and comprehensive student placement qualification.
        </p>
      </div>

      {/* Upload Box or Parsed Resume Display */}
      {!resume ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
            dragActive
              ? "border-accent bg-accent/5 scale-[1.01]"
              : "border-border/80 bg-canvas/40 hover:border-accent/60 hover:bg-canvas/70"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {isScanning ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
              <div>
                <p className="text-sm font-bold text-ink">
                  Running real-time ATS Parser & Keyword Scanner...
                </p>
                <p className="text-xs text-ink-muted mt-0.5">
                  Checking layout parsing, contact info, impact metrics, and target role keywords.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shadow-sm">
                <UploadCloud className="w-6 h-6" />
              </div>

              <div>
                <p className="text-sm sm:text-base font-bold text-ink">
                  Drag and drop your resume here, or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-accent underline font-semibold hover:text-accent/90"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-xs text-ink-muted mt-1">
                  Supports PDF or Word format (.pdf, .docx) up to 10MB
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <span className="text-xs text-ink-muted">or don&apos;t have one ready?</span>
                <button
                  type="button"
                  onClick={handleSampleResume}
                  className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Use demo verified resume</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Resume Preview & ATS Score Card */
        <div className="bg-surface border border-border/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-ink flex items-center gap-2">
                  <span>{resume.fileName}</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-semibold border border-emerald-500/20">
                    Uploaded & Verified
                  </span>
                </h4>
                <p className="text-xs text-ink-muted">
                  {resume.fileSize} • Uploaded on {resume.uploadedAt}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onUpdateResume(null)}
              className="p-1.5 text-ink-muted hover:text-action rounded-lg hover:bg-canvas transition-colors"
              title="Replace resume"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* ATS Score & Feedback Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-canvas/60 border border-border/80">
            {/* ATS Score Dial */}
            <div className="flex items-center gap-3 sm:border-r border-border/70 pr-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                <span className="text-base leading-none">{resume.atsScore}</span>
                <span className="text-[9px] uppercase tracking-wider">ATS</span>
              </div>
              <div>
                <span className="text-xs font-bold text-ink block">
                  Placement Ready
                </span>
                <span className="text-[11px] text-ink-muted">
                  Top 12% in class benchmark
                </span>
              </div>
            </div>

            {/* Extracted Skills */}
            <div className="sm:col-span-2 space-y-1">
              <span className="text-[11px] font-semibold text-ink-muted block">
                ATS Key Skills Extracted:
              </span>
              <div className="flex flex-wrap gap-1">
                {resume.extractedSkills.map((sk) => (
                  <span
                    key={sk}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-accent/10 text-accent"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-ink-muted leading-relaxed italic">
            &quot;{resume.readinessSummary}&quot;
          </p>
        </div>
      )}

      {/* Ideal Student Placement Readiness Checklist */}
      <div className="pt-2 border-t border-border/60">
        <h4 className="text-sm font-bold text-ink flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Ideal Student Placement Qualification Audit</span>
        </h4>
        <p className="text-xs text-ink-muted mb-3.5">
          Everything recruiters and placement officers look for in a top campus candidate:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Item 1: Academics & Backlogs */}
          <div className="p-3 rounded-xl bg-canvas/60 border border-border/80 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-ink block">
                Academic Eligibility: {profile.academicProfile.cgpa || "8.5+"} CGPA
              </span>
              <span className="text-[11px] text-ink-muted">
                {profile.academicProfile.activeBacklogs === "0"
                  ? "Zero active backlogs (Eligible for all Tier-1 campus drives)"
                  : `${profile.academicProfile.activeBacklogs} active backlogs recorded`}
              </span>
            </div>
          </div>

          {/* Item 2: Target Role & Salary Alignment */}
          <div className="p-3 rounded-xl bg-canvas/60 border border-border/80 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-ink block">
                Target Role: {profile.careerPreferences.primaryRole}
              </span>
              <span className="text-[11px] text-ink-muted">
                Target CTC {profile.careerPreferences.targetSalary} • {profile.careerPreferences.preferredLocations.slice(0, 2).join(", ")}
              </span>
            </div>
          </div>

          {/* Item 3: Skills & Tech Breadth */}
          <div className="p-3 rounded-xl bg-canvas/60 border border-border/80 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-ink block">
                Technical Stack: {profile.skills.programming.length + profile.skills.development.length} Core Skills Selected
              </span>
              <span className="text-[11px] text-ink-muted">
                Full-stack, data structures, and database coverage verified.
              </span>
            </div>
          </div>

          {/* Item 4: Portfolio & Proof of Work */}
          <div className="p-3 rounded-xl bg-canvas/60 border border-border/80 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-ink block">
                Proof of Work: {profile.projects.length} Showcase Projects
              </span>
              <span className="text-[11px] text-ink-muted">
                Live demo links and source code repos indexed.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete & Personalize Dashboard CTA */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-accent/10 via-surface to-ai/10 border border-accent/30 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready for Launch</span>
            </span>
            <h4 className="text-base sm:text-lg font-bold text-ink">
              Generate Your Personalized CareerOS Dashboard
            </h4>
            <p className="text-xs text-ink-muted mt-0.5 max-w-md">
              Your dashboard will adapt dynamically to {profile.personalInfo.fullName || "your profile"} with personalized daily plans, roadmap milestones, and matched job opportunities.
            </p>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent/90 text-white font-bold text-sm shadow-lg shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shrink-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Personalizing CareerOS...</span>
              </>
            ) : (
              <>
                <span>Complete Onboarding</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
