"use client";

import React, { useState, useRef } from "react";
import {
  AcademicProfile,
  UploadedScorecardDoc,
  ScorecardDocumentType,
  ExtractedScorecardData,
} from "@/types/onboarding";
import { AcademicEditModal } from "./AcademicEditModal";
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Edit3,
  UploadCloud,
  FileText,
  FileCheck2,
  Loader2,
  Sparkles,
  Trash2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Layers,
  FileUp,
} from "lucide-react";

interface EducationCardProps {
  academicProfile: AcademicProfile;
  degreeName?: string;
  collegeName?: string;
  onUpdateAcademicProfile?: (updated: AcademicProfile) => void;
  onUpdatePersonalInfo?: (updates: any) => void;
  onEdit?: () => void;
}

export const EducationCard: React.FC<EducationCardProps> = ({
  academicProfile,
  degreeName,
  collegeName,
  onUpdateAcademicProfile,
  onUpdatePersonalInfo,
  onEdit,
}) => {
  const [activeUploadTab, setActiveUploadTab] = useState<ScorecardDocumentType>("semester");
  const [selectedSemester, setSelectedSemester] = useState<number>(6);
  const [isScanning, setIsScanning] = useState(false);
  const [scanningMessage, setScanningMessage] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lastExtractedNotice, setLastExtractedNotice] = useState<string | null>(null);
  const [dragActiveType, setDragActiveType] = useState<ScorecardDocumentType | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Synchronous refs to prevent React state closure race conditions during file selection
  const targetDocTypeRef = useRef<ScorecardDocumentType>("secondary");
  const targetSemesterRef = useRef<number>(6);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayDegree = degreeName || academicProfile.degreeName || "Degree / Program not set";
  const displayCollege = collegeName || academicProfile.collegeName || "Institution not set";
  const uploadedDocs = academicProfile.uploadedScorecards || [];

  // Helper to compress image in browser to prevent Vercel 4.5MB payload limit errors
  const compressImageIfNeeded = async (file: File): Promise<File> => {
    if (!file.type.startsWith("image/")) return file;
    if (file.size < 1.2 * 1024 * 1024) return file;

    return new Promise<File>((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            const maxDim = 1800;
            let width = img.width;
            let height = img.height;
            if (width > height && width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              resolve(file);
              return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob && blob.size < file.size) {
                  const compressed = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  });
                  resolve(compressed);
                } else {
                  resolve(file);
                }
              },
              "image/jpeg",
              0.85
            );
          } catch {
            resolve(file);
          }
        };
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  // Helper to trigger hidden file input with synchronous docType lock
  const handleTriggerUpload = (type: ScorecardDocumentType, sem?: number) => {
    targetDocTypeRef.current = type;
    if (sem !== undefined) targetSemesterRef.current = sem;
    setActiveUploadTab(type);
    setUploadError(null);
    setLastExtractedNotice(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Core processing function handling FormData upload & AI extraction
  const processScorecardUpload = async (
    file: File,
    docType: ScorecardDocumentType,
    semNumber?: number
  ) => {
    if (file.size > 12 * 1024 * 1024) {
      setUploadError(`Document size is ${(file.size / (1024 * 1024)).toFixed(1)} MB. Please upload a document under 12 MB.`);
      return;
    }

    setIsScanning(true);
    setUploadError(null);
    setLastExtractedNotice(null);
    setScanningMessage(`Preparing ${file.name}...`);

    try {
      let fileToUpload = file;
      if (file.type.startsWith("image/")) {
        setScanningMessage("Optimizing image resolution for OCR extraction...");
        fileToUpload = await compressImageIfNeeded(file);
      } else if (file.size > 4.4 * 1024 * 1024) {
        throw new Error(
          `PDF size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds 4.4 MB limit. Please compress your PDF or upload a photo/image of the marksheet.`
        );
      }

      setScanningMessage("AI Document OCR: Reading seals, marks & coursework...");

      // Send as FormData directly to avoid 33% base64 JSON payload overhead
      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("documentType", docType);
      const targetSem = docType === "semester" ? semNumber || targetSemesterRef.current || selectedSemester : undefined;
      if (targetSem !== undefined) {
        formData.append("semesterNumber", String(targetSem));
      }

      const res = await fetch("/api/education/analyze-scorecard", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze scorecard document.");
      }

      const extracted: ExtractedScorecardData = data.extractedData;
      setScanningMessage("Integrating extracted academic credentials...");

      const finalSem = docType === "semester" ? extracted.semesterNumber || targetSem : undefined;

      // Construct verified document record
      const newDoc: UploadedScorecardDoc = {
        id: `doc-${Date.now()}`,
        type: docType,
        title:
          docType === "secondary"
            ? "Class 10 (Secondary) Marksheet"
            : docType === "higher_secondary"
            ? "Class 12 (Higher Secondary) Marksheet"
            : docType === "diploma"
            ? "Polytechnic / Diploma Marksheet"
            : `Semester ${finalSem} Scorecard`,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        uploadedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        semesterNumber: finalSem,
        extractedData: extracted,
        isVerified: true,
      };

      // Construct updated academic profile
      const updatedProfile: AcademicProfile = {
        ...academicProfile,
        isVerifiedFromDocuments: true,
        lastDocumentVerifiedAt: new Date().toISOString(),
        uploadedScorecards: [
          ...uploadedDocs.filter(
            (d) =>
              !(
                d.type === docType &&
                (docType !== "semester" || d.semesterNumber === newDoc.semesterNumber)
              )
          ),
          newDoc,
        ],
      };

      let successMsg = "";

      if (docType === "secondary") {
        if (extracted.percentage) updatedProfile.tenthPercentage = extracted.percentage;
        if (extracted.boardOrUniversity) updatedProfile.tenthBoard = extracted.boardOrUniversity;
        if (extracted.institutionName) updatedProfile.tenthSchool = extracted.institutionName;
        if (extracted.passingYear) updatedProfile.tenthPassingYear = extracted.passingYear;
        successMsg = `Class 10 Marksheet verified! Extracted ${extracted.percentage || "score"} from ${extracted.boardOrUniversity || "Board"}.`;
      } else if (docType === "higher_secondary") {
        if (extracted.percentage) updatedProfile.twelfthPercentage = extracted.percentage;
        if (extracted.boardOrUniversity) updatedProfile.twelfthBoard = extracted.boardOrUniversity;
        if (extracted.institutionName) updatedProfile.twelfthSchool = extracted.institutionName;
        if (extracted.degreeOrStream) updatedProfile.twelfthStream = extracted.degreeOrStream;
        if (extracted.passingYear) updatedProfile.twelfthPassingYear = extracted.passingYear;
        successMsg = `Class 12 Marksheet verified! Extracted ${extracted.percentage || "score"} (${extracted.degreeOrStream || "Stream"}).`;
      } else if (docType === "diploma") {
        updatedProfile.hasDiploma = true;
        if (extracted.percentage) updatedProfile.diplomaPercentage = extracted.percentage;
        if (extracted.boardOrUniversity) updatedProfile.diplomaBoard = extracted.boardOrUniversity;
        if (extracted.institutionName) updatedProfile.diplomaCollege = extracted.institutionName;
        if (extracted.branch || extracted.degreeOrStream) updatedProfile.diplomaBranch = extracted.branch || extracted.degreeOrStream;
        if (extracted.passingYear) updatedProfile.diplomaPassingYear = extracted.passingYear;
        successMsg = `Diploma / Polytechnic Marksheet verified! Extracted ${extracted.percentage || "score"} from ${extracted.boardOrUniversity || "Technical Board"}.`;
      } else {
        // Semester Scorecard
        if (extracted.cgpa) updatedProfile.cgpa = extracted.cgpa;
        if (finalSem) updatedProfile.semester = `Semester ${finalSem}`;
        if (extracted.branch) updatedProfile.branch = extracted.branch;
        if (extracted.activeBacklogs) updatedProfile.activeBacklogs = extracted.activeBacklogs;

        // Merge coursework subjects
        if (extracted.subjects && extracted.subjects.length > 0) {
          const existingMap = new Map((academicProfile.subjects || []).map((s) => [s.name.toLowerCase(), s]));
          extracted.subjects.forEach((sub) => {
            existingMap.set(sub.name.toLowerCase(), sub);
          });
          updatedProfile.subjects = Array.from(existingMap.values());
        }

        if (extracted.degreeOrStream) updatedProfile.degreeName = extracted.degreeOrStream;
        if (extracted.institutionName) updatedProfile.collegeName = extracted.institutionName;

        if (onUpdatePersonalInfo) {
          if (extracted.institutionName) onUpdatePersonalInfo({ college: extracted.institutionName });
          if (extracted.degreeOrStream) onUpdatePersonalInfo({ degree: extracted.degreeOrStream });
        }

        successMsg = `Semester ${finalSem} Scorecard verified! CGPA: ${
          extracted.cgpa || academicProfile.cgpa || "Updated"
        }, SGPA: ${extracted.sgpa || "N/A"}, ${extracted.subjects?.length || 0} Coursework subjects synced.`;
      }

      if (onUpdateAcademicProfile) {
        onUpdateAcademicProfile(updatedProfile);
      }

      setLastExtractedNotice(successMsg);
    } catch (err: any) {
      console.error("Scorecard processing error:", err);
      setUploadError(err.message || "Failed to analyze document.");
    } finally {
      setIsScanning(false);
      setScanningMessage("");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const docType = targetDocTypeRef.current;
    const sem = targetSemesterRef.current;
    processScorecardUpload(file, docType, sem);
  };

  const handleRemoveDoc = (docId: string) => {
    const updatedDocs = uploadedDocs.filter((d) => d.id !== docId);
    const updatedProfile: AcademicProfile = {
      ...academicProfile,
      uploadedScorecards: updatedDocs,
      isVerifiedFromDocuments: updatedDocs.length > 0,
    };
    if (onUpdateAcademicProfile) {
      onUpdateAcademicProfile(updatedProfile);
    }
  };

  const handleManualSave = (
    updatedProfile: AcademicProfile,
    updatedDegree?: string,
    updatedCollege?: string
  ) => {
    if (onUpdateAcademicProfile) {
      onUpdateAcademicProfile(updatedProfile);
    }
    if (onUpdatePersonalInfo) {
      const updates: any = {};
      if (updatedDegree) updates.degree = updatedDegree;
      if (updatedCollege) updates.college = updatedCollege;
      if (Object.keys(updates).length > 0) {
        onUpdatePersonalInfo(updates);
      }
    }
  };

  // Find documents per category
  const secondaryDoc = uploadedDocs.find((d) => d.type === "secondary");
  const higherSecDoc = uploadedDocs.find((d) => d.type === "higher_secondary");
  const diplomaDoc = uploadedDocs.find((d) => d.type === "diploma");
  const semesterDocs = uploadedDocs.filter((d) => d.type === "semester");

  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 shadow-xs hover:border-border transition-all space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf,image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/70">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center border border-purple-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-ink">Education & Academics</h3>
              {academicProfile.isVerifiedFromDocuments && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>AI Verified from Documents</span>
                </span>
              )}
            </div>
            <p className="text-xs text-ink-muted">
              Upload Secondary (10th), Higher Secondary (12th), Diploma (Polytechnic), and Semester scorecards for automated AI extraction, or edit manually anytime.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-canvas border border-border text-xs font-semibold text-ink hover:text-accent hover:border-accent transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Manual Edit</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {lastExtractedNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-700 dark:text-emerald-400 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{lastExtractedNotice}</span>
          </div>
          <button
            onClick={() => setLastExtractedNotice(null)}
            className="text-[11px] font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error Banner */}
      {uploadError && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/25 text-xs text-red-600 dark:text-red-400 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{uploadError}</span>
          </div>
          <button
            onClick={() => setUploadError(null)}
            className="text-[11px] font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Scanning In-Flight Indicator */}
      {isScanning && (
        <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3 animate-pulse">
          <Loader2 className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-spin shrink-0" />
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 block">
              Gemini Academic OCR & Verification Active
            </span>
            <span className="text-[11px] text-ink-muted block">{scanningMessage}</span>
          </div>
        </div>
      )}

      {/* Main Academic Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* CGPA */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60 relative group">
          <button
            onClick={() => setEditModalOpen(true)}
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-ink-muted hover:text-accent"
            title="Edit CGPA"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
            Cumulative CGPA
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-ink">
              {academicProfile.cgpa || "—"}
            </span>
            {academicProfile.cgpa && (
              <span className="text-xs font-semibold text-ink-muted">
                / {academicProfile.gradingScale || "10.0"}
              </span>
            )}
          </div>
          {academicProfile.isVerifiedFromDocuments ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 mt-1">
              <Award className="w-3 h-3" />
              Verified from Scorecard
            </span>
          ) : (
            <span className="text-[10px] text-ink-muted mt-1 block">Upload scorecard to verify</span>
          )}
        </div>

        {/* Academic Status / Semester */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60 relative group">
          <button
            onClick={() => setEditModalOpen(true)}
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-ink-muted hover:text-accent"
            title="Edit Status"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
            Academic Status
          </span>
          <span className="text-xl font-black text-ink block truncate">
            {academicProfile.semester || "Semester 1"}
          </span>
          <span className="text-[11px] text-ink-muted truncate block">
            {academicProfile.branch || "Enrolled Student"}
          </span>
        </div>

        {/* School & Diploma Boards */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60 relative group">
          <button
            onClick={() => setEditModalOpen(true)}
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-ink-muted hover:text-accent"
            title="Edit School & Diploma Boards"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
            School & Diploma
          </span>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-muted font-medium">10th:</span>
              <span className="font-bold text-ink">
                {academicProfile.tenthPercentage || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-muted font-medium">12th:</span>
              <span className="font-bold text-ink">
                {academicProfile.twelfthPercentage || "—"}
              </span>
            </div>
            {(academicProfile.diplomaPercentage || academicProfile.hasDiploma || diplomaDoc) && (
              <div className="flex items-center justify-between text-xs text-purple-600 dark:text-purple-400">
                <span className="font-medium">Diploma:</span>
                <span className="font-bold">
                  {academicProfile.diplomaPercentage || "Verified"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Backlog Status */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60 relative group">
          <button
            onClick={() => setEditModalOpen(true)}
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-ink-muted hover:text-accent"
            title="Edit Backlogs"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
            Backlog Status
          </span>
          <span
            className={`text-2xl font-black block ${
              academicProfile.activeBacklogs === "0" ? "text-emerald-500" : "text-amber-500"
            }`}
          >
            {academicProfile.activeBacklogs || "0"}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold ${
              academicProfile.activeBacklogs === "0" ? "text-emerald-500" : "text-amber-500"
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            {academicProfile.activeBacklogs === "0" ? "Clear / Eligible" : "Backlog Pending"}
          </span>
        </div>
      </div>

      {/* Program & Institution Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-accent/5 to-transparent border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Registered Degree & Branch
          </span>
          <h4 className="text-base font-bold text-ink mt-0.5">{displayDegree}</h4>
          <p className="text-xs text-ink-muted">{displayCollege}</p>
        </div>
        <div className="flex items-center gap-2">
          {academicProfile.hasDiploma && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              Lateral Entry / Diploma
            </span>
          )}
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            {academicProfile.semester || "Semester 1"}
          </span>
          <button
            onClick={() => setEditModalOpen(true)}
            className="p-1.5 rounded-lg bg-surface border border-border/80 text-ink hover:text-accent cursor-pointer"
            title="Edit degree details"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SCORECARD UPLOAD & AI EXTRACTION HUB */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl bg-canvas/70 border border-border/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-accent" />
            <h4 className="text-sm font-bold text-ink">Scorecard & Marksheet Document Verification Hub</h4>
          </div>
          <span className="text-[11px] text-ink-muted">PDF or high-res image (drag & drop or click upload)</span>
        </div>

        {/* 4 Upload Categories: 10th, 12th, Diploma (Polytechnic), and Semester */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Secondary (10th) Card */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActiveType("secondary");
            }}
            onDragLeave={() => setDragActiveType(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActiveType(null);
              const f = e.dataTransfer.files?.[0];
              if (f) processScorecardUpload(f, "secondary");
            }}
            className={`p-4 rounded-xl bg-surface border transition-all flex flex-col justify-between space-y-3 ${
              dragActiveType === "secondary"
                ? "border-accent ring-2 ring-accent/20 bg-accent/5"
                : "border-border/80 hover:border-border"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink">Class 10 (Secondary)</span>
                {secondaryDoc ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ✓ Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-ink-muted">Not Uploaded</span>
                )}
              </div>
              <p className="text-[11px] text-ink-muted mt-1">
                Extracts 10th board, school, passing year, and percentage.
              </p>

              {secondaryDoc ? (
                <div className="mt-3 p-2.5 rounded-lg bg-canvas border border-border/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink truncate max-w-[120px]">
                      {secondaryDoc.fileName}
                    </span>
                    <button
                      onClick={() => handleRemoveDoc(secondaryDoc.id)}
                      className="text-ink-muted hover:text-red-500 p-0.5 cursor-pointer"
                      title="Remove document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[11px] text-ink-muted">
                    {academicProfile.tenthBoard || "Board verified"} •{" "}
                    <strong className="text-ink">{academicProfile.tenthPercentage || "Score"}</strong>
                  </div>
                </div>
              ) : null}
            </div>

            <button
              onClick={() => handleTriggerUpload("secondary")}
              disabled={isScanning}
              className="w-full py-2 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-accent/20 disabled:opacity-50"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>{secondaryDoc ? "Re-upload 10th" : "Upload 10th Marksheet"}</span>
            </button>
          </div>

          {/* 2. Higher Secondary (12th) Card */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActiveType("higher_secondary");
            }}
            onDragLeave={() => setDragActiveType(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActiveType(null);
              const f = e.dataTransfer.files?.[0];
              if (f) processScorecardUpload(f, "higher_secondary");
            }}
            className={`p-4 rounded-xl bg-surface border transition-all flex flex-col justify-between space-y-3 ${
              dragActiveType === "higher_secondary"
                ? "border-accent ring-2 ring-accent/20 bg-accent/5"
                : "border-border/80 hover:border-border"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink">Class 12 (Higher Sec)</span>
                {higherSecDoc ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ✓ Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-ink-muted">Not Uploaded</span>
                )}
              </div>
              <p className="text-[11px] text-ink-muted mt-1">
                Extracts 12th board, school, stream (Science/PCM), and percentage.
              </p>

              {higherSecDoc ? (
                <div className="mt-3 p-2.5 rounded-lg bg-canvas border border-border/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink truncate max-w-[120px]">
                      {higherSecDoc.fileName}
                    </span>
                    <button
                      onClick={() => handleRemoveDoc(higherSecDoc.id)}
                      className="text-ink-muted hover:text-red-500 p-0.5 cursor-pointer"
                      title="Remove document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[11px] text-ink-muted">
                    {academicProfile.twelfthStream || "Stream"} •{" "}
                    <strong className="text-ink">{academicProfile.twelfthPercentage || "Score"}</strong>
                  </div>
                </div>
              ) : null}
            </div>

            <button
              onClick={() => handleTriggerUpload("higher_secondary")}
              disabled={isScanning}
              className="w-full py-2 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-accent/20 disabled:opacity-50"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>{higherSecDoc ? "Re-upload 12th" : "Upload 12th Marksheet"}</span>
            </button>
          </div>

          {/* 3. Diploma / Polytechnic (Optional / Lateral Entry) Card */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActiveType("diploma");
            }}
            onDragLeave={() => setDragActiveType(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActiveType(null);
              const f = e.dataTransfer.files?.[0];
              if (f) processScorecardUpload(f, "diploma");
            }}
            className={`p-4 rounded-xl bg-surface border transition-all flex flex-col justify-between space-y-3 ${
              dragActiveType === "diploma"
                ? "border-purple-500 ring-2 ring-purple-500/20 bg-purple-500/5"
                : "border-border/80 hover:border-border"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink">Diploma / Polytechnic</span>
                {diplomaDoc ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ✓ Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                    Optional
                  </span>
                )}
              </div>
              <p className="text-[11px] text-ink-muted mt-1">
                For 3-year diploma or lateral entry (WBSCTE, MSBTE, BTEUP). Extracts stream & aggregate.
              </p>

              {diplomaDoc ? (
                <div className="mt-3 p-2.5 rounded-lg bg-canvas border border-border/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink truncate max-w-[120px]">
                      {diplomaDoc.fileName}
                    </span>
                    <button
                      onClick={() => handleRemoveDoc(diplomaDoc.id)}
                      className="text-ink-muted hover:text-red-500 p-0.5 cursor-pointer"
                      title="Remove document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[11px] text-ink-muted">
                    {academicProfile.diplomaBoard || "Polytechnic Council"} •{" "}
                    <strong className="text-ink">{academicProfile.diplomaPercentage || "Score"}</strong>
                  </div>
                </div>
              ) : null}
            </div>

            <button
              onClick={() => handleTriggerUpload("diploma")}
              disabled={isScanning}
              className="w-full py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-purple-500/30 disabled:opacity-50"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>{diplomaDoc ? "Re-upload Diploma" : "Upload Diploma Marksheet"}</span>
            </button>
          </div>

          {/* 4. Semester Scorecards Card */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActiveType("semester");
            }}
            onDragLeave={() => setDragActiveType(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActiveType(null);
              const f = e.dataTransfer.files?.[0];
              if (f) processScorecardUpload(f, "semester", selectedSemester);
            }}
            className={`p-4 rounded-xl bg-surface border transition-all flex flex-col justify-between space-y-3 ${
              dragActiveType === "semester"
                ? "border-accent ring-2 ring-accent/20 bg-accent/5"
                : "border-border/80 hover:border-border"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink">Semester Scorecards</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  {semesterDocs.length} Uploaded
                </span>
              </div>
              <p className="text-[11px] text-ink-muted mt-1">
                Extracts CGPA, SGPA, backlogs, and coursework subjects.
              </p>

              {/* Semester picker for upload */}
              <div className="mt-2 flex items-center gap-1.5">
                <span className="text-[10px] text-ink-muted font-semibold">Semester:</span>
                <select
                  value={selectedSemester}
                  onChange={(e) => {
                    const s = Number(e.target.value);
                    setSelectedSemester(s);
                    targetSemesterRef.current = s;
                  }}
                  className="px-2 py-1 rounded-lg bg-canvas border border-border text-[11px] font-bold text-ink cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* List of uploaded semester docs */}
              {semesterDocs.length > 0 && (
                <div className="mt-2 space-y-1 max-h-24 overflow-y-auto pr-1">
                  {semesterDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-1.5 rounded-lg bg-canvas border border-border/60 text-[11px] flex items-center justify-between"
                    >
                      <span className="font-semibold text-ink truncate max-w-[110px]">
                        Sem {doc.semesterNumber || "?"}: {doc.fileName}
                      </span>
                      <button
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="text-ink-muted hover:text-red-500 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleTriggerUpload("semester", selectedSemester)}
              disabled={isScanning}
              className="w-full py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-purple-500/30 disabled:opacity-50"
            >
              <FileUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Core Subject Coursework Performance */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-accent" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Core Coursework Grades (Extracted & Verified)
            </h4>
          </div>
          <button
            onClick={() => setEditModalOpen(true)}
            className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit Subjects</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {academicProfile.subjects && academicProfile.subjects.length > 0 ? (
            academicProfile.subjects.map((sub) => (
              <div
                key={sub.id}
                className="p-3 rounded-xl bg-canvas border border-border/70 flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <span className="text-xs font-bold text-ink block leading-tight truncate">
                    {sub.name}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {sub.proficiency}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-accent/15 text-accent font-black text-xs shrink-0">
                  {sub.gradeOrScore}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-full p-4 rounded-xl border border-dashed border-border/80 text-center text-xs text-ink-muted">
              Upload your semester scorecard to automatically populate your course grades and technical subjects.
            </div>
          )}
        </div>
      </div>

      {/* Manual Edit Academic Details Modal */}
      <AcademicEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        academicProfile={academicProfile}
        degreeName={displayDegree}
        collegeName={displayCollege}
        onSave={handleManualSave}
      />
    </div>
  );
};
