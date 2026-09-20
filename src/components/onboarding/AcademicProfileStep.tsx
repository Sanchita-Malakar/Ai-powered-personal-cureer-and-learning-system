"use client";

import React, { useState } from "react";
import { AcademicProfile, SubjectPerformance } from "@/types/onboarding";
import {
  GraduationCap,
  Layers,
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";

interface AcademicProfileStepProps {
  data: AcademicProfile;
  onChange: (updates: Partial<AcademicProfile>) => void;
  errors: Record<string, string>;
}

const BRANCHES = [
  "Computer Science & Engineering",
  "Information Technology",
  "Artificial Intelligence & Machine Learning",
  "Data Science & Analytics",
  "Electronics & Communication Engineering",
  "Electrical & Electronics Engineering",
  "Mechanical Engineering",
  "Information Science",
  "Other Engineering / Tech Discipline",
];

const SEMESTERS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
  "Graduated / Passed Out",
];

const COMMON_CORE_SUBJECTS = [
  "Data Structures & Algorithms",
  "Database Management Systems",
  "Operating Systems",
  "Computer Networks",
  "Object Oriented Programming",
  "System Design",
  "Cloud Computing",
  "Machine Learning",
];

export const AcademicProfileStep: React.FC<AcademicProfileStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectGrade, setNewSubjectGrade] = useState("A");

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    const newSub: SubjectPerformance = {
      id: `sub-${Date.now()}`,
      name: newSubjectName.trim(),
      gradeOrScore: newSubjectGrade,
      proficiency: newSubjectGrade === "A+" || newSubjectGrade === "O" ? "Mastered" : "Proficient",
    };
    onChange({ subjects: [...data.subjects, newSub] });
    setNewSubjectName("");
  };

  const handleRemoveSubject = (id: string) => {
    onChange({
      subjects: data.subjects.filter((s) => s.id !== id),
    });
  };

  const handleUpdateSubject = (id: string, updates: Partial<SubjectPerformance>) => {
    onChange({
      subjects: data.subjects.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="border-b border-border/70 pb-4">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 2 • Academic Record & Campus Cutoffs</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-ink">
          Academic Standing & Performance
        </h3>
        <p className="text-sm text-ink-muted mt-1">
          Campus placement portals and tech recruiters use these deterministic metrics for eligibility filters and role shortlisting.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Branch / Department */}
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-1" htmlFor="branch">
            Branch / Department <span className="text-action">*</span>
          </label>
          <div className="relative">
            <GraduationCap className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="branch"
              value={data.branch}
              onChange={(e) => onChange({ branch: e.target.value })}
              className="w-full bg-canvas/70 border border-border/80 text-ink text-sm rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:border-accent focus:bg-surface transition-all appearance-none cursor-pointer"
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Semester */}
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-1" htmlFor="semester">
            Current Semester <span className="text-action">*</span>
          </label>
          <div className="relative">
            <Layers className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="semester"
              value={data.semester}
              onChange={(e) => onChange({ semester: e.target.value })}
              className="w-full bg-canvas/70 border border-border/80 text-ink text-sm rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:border-accent focus:bg-surface transition-all appearance-none cursor-pointer"
            >
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CGPA & Scale */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[13px] font-semibold text-ink" htmlFor="cgpa">
              Current CGPA / Percentage <span className="text-action">*</span>
            </label>
            <div className="flex items-center gap-1.5 text-[11px] text-ink-muted font-medium">
              <button
                type="button"
                onClick={() => onChange({ gradingScale: "10.0" })}
                className={`px-1.5 py-0.5 rounded transition-all ${
                  data.gradingScale === "10.0" ? "bg-accent text-white font-bold" : "hover:text-ink"
                }`}
              >
                /10.0
              </button>
              <button
                type="button"
                onClick={() => onChange({ gradingScale: "Percentage" })}
                className={`px-1.5 py-0.5 rounded transition-all ${
                  data.gradingScale === "Percentage" ? "bg-accent text-white font-bold" : "hover:text-ink"
                }`}
              >
                %
              </button>
            </div>
          </div>
          <div className="relative">
            <Award className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="cgpa"
              type="text"
              placeholder={data.gradingScale === "10.0" ? "e.g. 8.75" : "e.g. 85.5%"}
              value={data.cgpa}
              onChange={(e) => onChange({ cgpa: e.target.value })}
              className={`w-full bg-canvas/70 border text-ink placeholder:text-ink-muted/60 text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:bg-surface focus:shadow-sm transition-all ${
                errors.cgpa ? "border-action focus:border-action" : "border-border/80 focus:border-accent"
              }`}
            />
          </div>
          {errors.cgpa && <p className="text-xs text-action mt-1">{errors.cgpa}</p>}
        </div>

        {/* Active Backlogs */}
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-1">
            Active Backlogs Status
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "0", label: "0 (Clean Record)", desc: "100% placement eligible" },
              { id: "1", label: "1 Backlog", desc: "Eligible for select firms" },
              { id: "2+", label: "2+ Backlogs", desc: "Prioritize clears" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onChange({ activeBacklogs: option.id as any })}
                className={`p-2 rounded-xl text-left border transition-all text-xs ${
                  data.activeBacklogs === option.id
                    ? option.id === "0"
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-semibold"
                      : "bg-attention/10 border-attention/40 text-attention font-semibold"
                    : "bg-canvas/50 border-border/70 text-ink hover:bg-canvas"
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{option.id === "0" ? "None (0)" : option.id}</span>
                  {data.activeBacklogs === option.id && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-current" />
                  )}
                </div>
                <span className="text-[10px] text-ink-muted block mt-0.5 leading-tight">
                  {option.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 10th Percentage */}
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-1" htmlFor="tenth">
            10th Grade Percentage
          </label>
          <input
            id="tenth"
            type="text"
            placeholder="e.g. 92.4%"
            value={data.tenthPercentage}
            onChange={(e) => onChange({ tenthPercentage: e.target.value })}
            className="w-full bg-canvas/70 border border-border/80 text-ink placeholder:text-ink-muted/60 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-accent focus:bg-surface transition-all"
          />
          <span className="text-[11px] text-ink-muted mt-0.5 block">Used for eligibility cutoffs (60% / 70% rule).</span>
        </div>

        {/* 12th / Diploma Percentage */}
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-1" htmlFor="twelfth">
            12th / Diploma Percentage
          </label>
          <input
            id="twelfth"
            type="text"
            placeholder="e.g. 89.0%"
            value={data.twelfthPercentage}
            onChange={(e) => onChange({ twelfthPercentage: e.target.value })}
            className="w-full bg-canvas/70 border border-border/80 text-ink placeholder:text-ink-muted/60 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-accent focus:bg-surface transition-all"
          />
          <span className="text-[11px] text-ink-muted mt-0.5 block">Used for campus drive registration criteria.</span>
        </div>
      </div>

      {/* Core Technical Coursework & Performance */}
      <div className="pt-3 border-t border-border/60">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-sm font-bold text-ink flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              <span>Core Academic Subjects & Performance</span>
            </h4>
            <p className="text-xs text-ink-muted">
              Specify your grades in CS fundamentals to auto-calculate your interview preparation baseline.
            </p>
          </div>
        </div>

        {/* Subject list */}
        <div className="space-y-2 mt-3">
          {data.subjects.map((subject) => (
            <div
              key={subject.id}
              className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl bg-canvas/60 border border-border/80 hover:border-border transition-all"
            >
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-xs sm:text-sm text-ink block truncate">
                  {subject.name}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-ink-muted">Grade:</span>
                  <span className="text-[11px] font-bold text-accent px-2 py-0.2 rounded-md bg-accent/10">
                    {subject.gradeOrScore}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={subject.proficiency}
                  onChange={(e) =>
                    handleUpdateSubject(subject.id, {
                      proficiency: e.target.value as any,
                    })
                  }
                  className="bg-surface border border-border/80 text-ink text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-accent"
                >
                  <option value="Learning">Learning</option>
                  <option value="Proficient">Proficient</option>
                  <option value="Mastered">Mastered</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleRemoveSubject(subject.id)}
                  className="p-1 text-ink-muted hover:text-action transition-colors rounded-md hover:bg-canvas"
                  title="Remove subject"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add custom subject */}
        <div className="flex items-center gap-2 mt-3 pt-2">
          <input
            type="text"
            list="common-courses"
            placeholder="Add subject (e.g. Computer Networks)"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            className="flex-1 bg-canvas/70 border border-border/80 text-ink placeholder:text-ink-muted/50 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent"
          />
          <datalist id="common-courses">
            {COMMON_CORE_SUBJECTS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>

          <select
            value={newSubjectGrade}
            onChange={(e) => setNewSubjectGrade(e.target.value)}
            className="bg-canvas/70 border border-border/80 text-ink text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-accent"
          >
            <option value="O">O (Outstanding)</option>
            <option value="A+">A+ (90%+)</option>
            <option value="A">A (80-89%)</option>
            <option value="B+">B+ (70-79%)</option>
            <option value="B">B (60-69%)</option>
          </select>

          <button
            type="button"
            onClick={handleAddSubject}
            disabled={!newSubjectName.trim()}
            className="inline-flex items-center gap-1 bg-accent text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
