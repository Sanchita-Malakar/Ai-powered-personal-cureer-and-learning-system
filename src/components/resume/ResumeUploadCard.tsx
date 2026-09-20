"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  AlertCircle,
  FileCheck2,
} from "lucide-react";

interface ResumeUploadCardProps {
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  onUploadNewFile: (name: string, size: string) => void;
  onRunScan: () => void;
  isScanning: boolean;
  scanStep: number;
}

const SCAN_STEPS = [
  "Analyzing resume structure & layout...",
  "Extracting technical skills & proficiencies...",
  "Verifying academic chronology & education credentials...",
  "Evaluating project depth & technical complexity...",
  "Auditing work experience & leadership impact...",
  "Scanning industry keyword frequency & density...",
  "Benchmarking job relevance index against tech roles...",
  "Simulating ATS parser compatibility & extraction accuracy...",
];

export const ResumeUploadCard: React.FC<ResumeUploadCardProps> = ({
  fileName,
  fileSize,
  uploadedAt,
  onUploadNewFile,
  onRunScan,
  isScanning,
  scanStep,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const sizeStr = `${Math.round(file.size / 1024)} KB`;
      onUploadNewFile(file.name, sizeStr);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeStr = `${Math.round(file.size / 1024)} KB`;
      onUploadNewFile(file.name, sizeStr);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-border/80 shadow-xs mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-ink flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-accent" />
            <span>Resume Upload & ATS Diagnostic Engine</span>
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Upload your resume in PDF or DOCX format for a real-time 8-point automated ATS breakdown.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={isScanning}
            onClick={onRunScan}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 shadow-sm shadow-accent/20 transition-all disabled:opacity-50 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
            <span>{isScanning ? "Analyzing..." : "Re-Scan Resume"}</span>
          </button>
        </div>
      </div>

      {/* Active File Banner or Drag Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleFileDrop}
        className={`p-4 sm:p-5 rounded-2xl border-2 border-dashed transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isDragOver
            ? "border-accent bg-accent/10"
            : "border-border/80 bg-canvas/40 hover:bg-canvas/70 hover:border-accent/40"
        }`}
      >
        <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-ink truncate block">
                {fileName}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 shrink-0">
                Active
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-muted mt-0.5">
              <span>{fileSize}</span>
              <span>•</span>
              <span>{uploadedAt}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-surface border border-border/80 text-xs font-semibold text-ink hover:bg-canvas hover:border-accent/40 transition-all shadow-2xs flex items-center gap-1.5">
            <UploadCloud className="w-3.5 h-3.5 text-accent" />
            <span>Upload New Resume</span>
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Scanning In-Progress Feedback */}
      {isScanning && (
        <div className="p-4 rounded-2xl bg-accent/10 border border-accent/25 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-bold text-accent">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>{SCAN_STEPS[scanStep] || "Completing final ATS score calculation..."}</span>
            </span>
            <span>{Math.round(((scanStep + 1) / SCAN_STEPS.length) * 100)}%</span>
          </div>

          <div className="w-full h-1.5 bg-accent/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${((scanStep + 1) / SCAN_STEPS.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-ink-muted pt-1">
            <span className={scanStep >= 0 ? "text-emerald-600 font-semibold" : ""}>
              ✓ Resume structure
            </span>
            <span className={scanStep >= 1 ? "text-emerald-600 font-semibold" : ""}>
              ✓ Skills extraction
            </span>
            <span className={scanStep >= 2 ? "text-emerald-600 font-semibold" : ""}>
              ✓ Education audit
            </span>
            <span className={scanStep >= 3 ? "text-emerald-600 font-semibold" : ""}>
              ✓ Projects analysis
            </span>
            <span className={scanStep >= 4 ? "text-emerald-600 font-semibold" : ""}>
              ✓ Experience metrics
            </span>
            <span className={scanStep >= 5 ? "text-emerald-600 font-semibold" : ""}>
              ✓ Keywords density
            </span>
            <span className={scanStep >= 6 ? "text-emerald-600 font-semibold" : ""}>
              ✓ Job relevance
            </span>
            <span className={scanStep >= 7 ? "text-emerald-600 font-semibold" : ""}>
              ✓ ATS compatibility
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
