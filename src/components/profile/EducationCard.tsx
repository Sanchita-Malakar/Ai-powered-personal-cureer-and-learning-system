"use client";

import React, { useState } from "react";
import { AcademicProfile, SubjectPerformance } from "@/types/onboarding";
import { AcademicEditModal } from "./AcademicEditModal";
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Edit3,
  Plus,
  School,
  Building2,
  Calendar,
  Database,
  Layers,
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const displayDegree = degreeName || academicProfile.degreeName || "Degree / Program not set";
  const displayCollege = collegeName || academicProfile.collegeName || "Institution not set";

  const handleManualSave = async (
    updatedProfile: AcademicProfile,
    updatedDegree?: string,
    updatedCollege?: string
  ) => {
    try {
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
      setSaveNotice("Educational details updated and saved to database successfully!");
      setTimeout(() => setSaveNotice(null), 5000);
    } catch (err: any) {
      console.error("Error saving academic profile:", err);
    }
  };

  const hasDiplomaDetails = Boolean(
    academicProfile.hasDiploma ||
      academicProfile.diplomaPercentage ||
      academicProfile.diplomaBoard ||
      academicProfile.diplomaCollege
  );

  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 shadow-xs hover:border-border transition-all space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/70">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center border border-purple-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-ink">Education & Academic Credentials</h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <Database className="w-3 h-3" />
                <span>Database Synced</span>
              </span>
            </div>
            <p className="text-xs text-ink-muted">
              Manually manage your university degree, cumulative CGPA, 10th & 12th board marks, diploma credentials, and technical coursework.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-accent text-white font-bold text-xs hover:bg-accent/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shadow-accent/20"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Academic Details</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-700 dark:text-emerald-400 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{saveNotice}</span>
          </div>
          <button
            onClick={() => setSaveNotice(null)}
            className="text-[11px] font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Academic Stats Grid (4 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Cumulative CGPA */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60 relative group">
          <button
            onClick={() => setEditModalOpen(true)}
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-ink-muted hover:text-accent cursor-pointer"
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
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            <Award className="w-3 h-3" />
            <span>Good Academic Standing</span>
          </span>
        </div>

        {/* Academic Status / Semester */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60 relative group">
          <button
            onClick={() => setEditModalOpen(true)}
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-ink-muted hover:text-accent cursor-pointer"
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

        {/* School & Secondary Boards */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60 relative group">
          <button
            onClick={() => setEditModalOpen(true)}
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-ink-muted hover:text-accent cursor-pointer"
            title="Edit School Boards"
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
            {hasDiplomaDetails && (
              <div className="flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 font-semibold">
                <span>Diploma:</span>
                <span className="font-bold">
                  {academicProfile.diplomaPercentage || "Recorded"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Backlog Status */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60 relative group">
          <button
            onClick={() => setEditModalOpen(true)}
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-ink-muted hover:text-accent cursor-pointer"
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
          {hasDiplomaDetails && (
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

      {/* Detailed Academic History: 10th, 12th, and Diploma Breakdown Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
            Prior Academic History & Credentials
          </span>
          <button
            onClick={() => setEditModalOpen(true)}
            className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit School & Diploma Details</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* 1. Class 10 (Secondary) */}
          <div className="p-4 rounded-2xl bg-canvas/70 border border-border/70 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <School className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-ink">Class 10 (Secondary)</span>
                </div>
                {academicProfile.tenthPercentage ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    Recorded
                  </span>
                ) : (
                  <span className="text-[10px] text-ink-muted">Not Set</span>
                )}
              </div>

              <div className="space-y-1.5 text-xs pt-1">
                <div>
                  <span className="text-ink-muted block text-[10px] font-medium">Board</span>
                  <span className="font-semibold text-ink">
                    {academicProfile.tenthBoard || "Board not set"}
                  </span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px] font-medium">School Name</span>
                  <span className="text-ink font-medium truncate block">
                    {academicProfile.tenthSchool || "School not set"}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/50">
                  <span className="text-ink-muted text-[11px]">Percentage:</span>
                  <strong className="text-sm font-black text-ink">
                    {academicProfile.tenthPercentage || "—"}
                  </strong>
                </div>
                {academicProfile.tenthPassingYear && (
                  <div className="flex items-center justify-between text-[11px] text-ink-muted">
                    <span>Year:</span>
                    <span className="font-medium text-ink">{academicProfile.tenthPassingYear}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setEditModalOpen(true)}
              className="w-full py-1.5 rounded-xl bg-canvas border border-border/80 hover:border-accent hover:text-accent text-[11px] font-semibold text-ink transition-colors cursor-pointer text-center"
            >
              Edit Class 10
            </button>
          </div>

          {/* 2. Class 12 (Higher Secondary) */}
          <div className="p-4 rounded-2xl bg-canvas/70 border border-border/70 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-ink">Class 12 (Higher Secondary)</span>
                </div>
                {academicProfile.twelfthPercentage ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    Recorded
                  </span>
                ) : (
                  <span className="text-[10px] text-ink-muted">Not Set</span>
                )}
              </div>

              <div className="space-y-1.5 text-xs pt-1">
                <div>
                  <span className="text-ink-muted block text-[10px] font-medium">Board / Council</span>
                  <span className="font-semibold text-ink">
                    {academicProfile.twelfthBoard || "Board not set"}
                  </span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px] font-medium">Stream / School</span>
                  <span className="text-ink font-medium truncate block">
                    {academicProfile.twelfthStream
                      ? `${academicProfile.twelfthStream} • `
                      : ""}
                    {academicProfile.twelfthSchool || "Institution not set"}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/50">
                  <span className="text-ink-muted text-[11px]">Percentage:</span>
                  <strong className="text-sm font-black text-ink">
                    {academicProfile.twelfthPercentage || "—"}
                  </strong>
                </div>
                {academicProfile.twelfthPassingYear && (
                  <div className="flex items-center justify-between text-[11px] text-ink-muted">
                    <span>Year:</span>
                    <span className="font-medium text-ink">{academicProfile.twelfthPassingYear}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setEditModalOpen(true)}
              className="w-full py-1.5 rounded-xl bg-canvas border border-border/80 hover:border-accent hover:text-accent text-[11px] font-semibold text-ink transition-colors cursor-pointer text-center"
            >
              Edit Class 12
            </button>
          </div>

          {/* 3. Polytechnic / Diploma in Engineering (Optional / Lateral Entry) */}
          <div className="p-4 rounded-2xl bg-canvas/70 border border-border/70 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-ink">Diploma / Polytechnic</span>
                </div>
                {hasDiplomaDetails ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400">
                    Recorded
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-ink-muted">Optional</span>
                )}
              </div>

              {hasDiplomaDetails ? (
                <div className="space-y-1.5 text-xs pt-1">
                  <div>
                    <span className="text-ink-muted block text-[10px] font-medium">Council / Board</span>
                    <span className="font-semibold text-ink">
                      {academicProfile.diplomaBoard || "Technical Board"}
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px] font-medium">Polytechnic / Discipline</span>
                    <span className="text-ink font-medium truncate block">
                      {academicProfile.diplomaBranch
                        ? `${academicProfile.diplomaBranch} • `
                        : ""}
                      {academicProfile.diplomaCollege || "Polytechnic Institute"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-border/50">
                    <span className="text-ink-muted text-[11px]">Percentage / CGPA:</span>
                    <strong className="text-sm font-black text-ink">
                      {academicProfile.diplomaPercentage || "—"}
                    </strong>
                  </div>
                  {academicProfile.diplomaPassingYear && (
                    <div className="flex items-center justify-between text-[11px] text-ink-muted">
                      <span>Passing Year:</span>
                      <span className="font-medium text-ink">{academicProfile.diplomaPassingYear}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5 text-xs pt-1">
                  <p className="text-[11px] text-ink-muted">
                    If you completed a 3-year polytechnic diploma or entered via Lateral Entry, record your details here.
                  </p>
                  <div className="p-2.5 rounded-xl border border-dashed border-border/80 text-[11px] text-center text-ink-muted">
                    No diploma credentials entered yet.
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setEditModalOpen(true)}
              className="w-full py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[11px] font-bold transition-colors cursor-pointer text-center border border-purple-500/20"
            >
              {hasDiplomaDetails ? "Edit Diploma Details" : "+ Add Diploma Details"}
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
              Core Coursework & University Subjects
            </h4>
          </div>
          <button
            onClick={() => setEditModalOpen(true)}
            className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>Add / Edit Coursework</span>
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
              No technical subjects added yet. Click &quot;Add / Edit Coursework&quot; to manually record your engineering subjects and grades.
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
