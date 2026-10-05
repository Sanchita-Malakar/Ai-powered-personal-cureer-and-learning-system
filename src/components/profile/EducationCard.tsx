"use client";

import React, { useState, useEffect } from "react";
import { AcademicProfile, SubjectPerformance } from "@/types/onboarding";
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Edit3,
  Plus,
  Trash2,
  Building2,
  Calendar,
  Database,
  Layers,
  School,
  Sparkles,
  Save,
  RotateCcw,
  Check,
} from "lucide-react";

interface EducationCardProps {
  academicProfile: AcademicProfile;
  degreeName?: string;
  collegeName?: string;
  onUpdateAcademicProfile?: (updated: AcademicProfile) => void;
  onUpdatePersonalInfo?: (updates: any) => void;
  onEdit?: () => void;
}

const COMMON_BRANCHES = [
  "Computer Science & Engineering",
  "Information Technology",
  "Artificial Intelligence & Machine Learning",
  "Data Science & Analytics",
  "Electronics & Communication Engineering",
  "Electrical & Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Science",
  "Other Engineering / Tech Discipline",
];

const SEMESTER_OPTIONS = [
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

export const EducationCard: React.FC<EducationCardProps> = ({
  academicProfile,
  degreeName,
  collegeName,
  onUpdateAcademicProfile,
  onUpdatePersonalInfo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Form State initialized from props
  const [formData, setFormData] = useState<AcademicProfile>(academicProfile);
  const [degInput, setDegInput] = useState(degreeName || academicProfile.degreeName || "");
  const [colInput, setColInput] = useState(collegeName || academicProfile.collegeName || "");
  const [uniInput, setUniInput] = useState(academicProfile.universityName || "");

  // Subject quick-add state
  const [newSubName, setNewSubName] = useState("");
  const [newSubGrade, setNewSubGrade] = useState("A+");
  const [newSubProficiency, setNewSubProficiency] = useState<"Proficient" | "Mastered" | "Learning">("Mastered");

  useEffect(() => {
    setFormData(academicProfile);
    setDegInput(degreeName || academicProfile.degreeName || "");
    setColInput(collegeName || academicProfile.collegeName || "");
    setUniInput(academicProfile.universityName || "");
  }, [academicProfile, degreeName, collegeName]);

  const handleFieldChange = (field: keyof AcademicProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSubject = () => {
    if (!newSubName.trim()) return;
    const newSub: SubjectPerformance = {
      id: `sub-${Date.now()}`,
      name: newSubName.trim(),
      gradeOrScore: newSubGrade,
      proficiency: newSubProficiency,
    };
    setFormData((prev) => ({
      ...prev,
      subjects: [...(prev.subjects || []), newSub],
    }));
    setNewSubName("");
    setNewSubGrade("A+");
  };

  const handleRemoveSubject = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: (prev.subjects || []).filter((s) => s.id !== id),
    }));
  };

  const handleSaveToDatabase = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const updatedProfile: AcademicProfile = {
        ...formData,
        degreeName: degInput.trim() || undefined,
        collegeName: colInput.trim() || undefined,
        universityName: uniInput.trim() || undefined,
      };

      if (onUpdateAcademicProfile) {
        onUpdateAcademicProfile(updatedProfile);
      }

      if (onUpdatePersonalInfo) {
        const personalUpdates: any = {};
        if (degInput.trim()) personalUpdates.degree = degInput.trim();
        if (colInput.trim()) personalUpdates.college = colInput.trim();
        if (formData.graduationYear) personalUpdates.graduationYear = formData.graduationYear;
        if (Object.keys(personalUpdates).length > 0) {
          onUpdatePersonalInfo(personalUpdates);
        }
      }

      setSaveNotice("Academic credentials saved to database successfully!");
      setIsEditing(false);
      setTimeout(() => setSaveNotice(null), 5000);
    } catch (err: any) {
      console.error("Error saving academic credentials:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const displayDegree = degInput || academicProfile.degreeName || degreeName || "Degree / Program not set";
  const displayCollege = colInput || academicProfile.collegeName || collegeName || "Institution not set";
  const displayUniversity = uniInput || academicProfile.universityName || "Affiliated University";

  const hasDiploma = Boolean(
    formData.hasDiploma ||
      formData.diplomaPercentage ||
      formData.diplomaBoard ||
      formData.diplomaCollege
  );

  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 sm:p-7 shadow-xs hover:border-border transition-all space-y-6">
      {/* 1. Unified Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/25 shrink-0 shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold text-ink">Give Your Academic Credentials</h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <Database className="w-3 h-3" />
                <span>Database Synced</span>
              </span>
            </div>
            <p className="text-xs text-ink-muted mt-0.5">
              Enter and manage all your essential academic records from secondary school to university semester, degree, and coursework.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setFormData(academicProfile);
                  setDegInput(degreeName || academicProfile.degreeName || "");
                  setColInput(collegeName || academicProfile.collegeName || "");
                  setUniInput(academicProfile.universityName || "");
                  setIsEditing(false);
                }}
                className="px-3 py-1.5 rounded-xl border border-border/80 text-ink-muted hover:text-ink hover:bg-canvas text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={() => handleSaveToDatabase()}
                disabled={isSaving}
                className="px-4 py-1.5 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shadow-accent/25 disabled:opacity-50"
              >
                {isSaving ? (
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save to Database</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-1.5 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shadow-accent/20"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Academic Credentials</span>
            </button>
          )}
        </div>
      </div>

      {/* Save Notification Banner */}
      {saveNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-700 dark:text-emerald-400 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span className="font-semibold">{saveNotice}</span>
          </div>
          <button
            onClick={() => setSaveNotice(null)}
            className="text-[11px] font-bold underline cursor-pointer hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Interactive Mode: Workable Form OR Overview Display */}
      {isEditing ? (
        /* WORKABLE INPUT FORM: ONE UNIFIED CREDENTIALS FORM */
        <form onSubmit={handleSaveToDatabase} className="space-y-6 animate-in fade-in duration-200">
          {/* Section 1: College & University Details */}
          <div className="p-5 rounded-2xl bg-canvas/60 border border-border/70 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <Building2 className="w-4 h-4 text-purple-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                1. College & University Higher Education
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  Degree / Program <span className="text-action">*</span>
                </label>
                <input
                  type="text"
                  value={degInput}
                  onChange={(e) => setDegInput(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  College / Institute Name <span className="text-action">*</span>
                </label>
                <input
                  type="text"
                  value={colInput}
                  onChange={(e) => setColInput(e.target.value)}
                  placeholder="e.g. National Institute of Technology / IEM"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  Affiliated University
                </label>
                <input
                  type="text"
                  value={uniInput}
                  onChange={(e) => setUniInput(e.target.value)}
                  placeholder="e.g. MAKAUT / Autonomous University"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  Department / Branch <span className="text-action">*</span>
                </label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => handleFieldChange("branch", e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  list="branch-suggestions"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  required
                />
                <datalist id="branch-suggestions">
                  {COMMON_BRANCHES.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  Current Semester <span className="text-action">*</span>
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => handleFieldChange("semester", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                >
                  {SEMESTER_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-ink-muted">
                    Cumulative CGPA <span className="text-action">*</span>
                  </label>
                  <span className="text-[10px] text-ink-muted font-semibold">
                    Scale: {formData.gradingScale || "10.0"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.cgpa}
                    onChange={(e) => handleFieldChange("cgpa", e.target.value)}
                    placeholder="e.g. 8.85"
                    className="flex-1 px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                    required
                  />
                  <select
                    value={formData.gradingScale}
                    onChange={(e) => handleFieldChange("gradingScale", e.target.value)}
                    className="w-24 px-2 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  >
                    <option value="10.0">/10.0</option>
                    <option value="4.0">/4.0</option>
                    <option value="Percentage">%</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  Active Backlogs
                </label>
                <select
                  value={formData.activeBacklogs}
                  onChange={(e) => handleFieldChange("activeBacklogs", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                >
                  <option value="0">0 (Zero / Clear)</option>
                  <option value="1">1</option>
                  <option value="2+">2+</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  Expected Graduation Year
                </label>
                <input
                  type="text"
                  value={formData.graduationYear || ""}
                  onChange={(e) => handleFieldChange("graduationYear", e.target.value)}
                  placeholder="e.g. 2025"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Secondary & Higher Secondary (10th & 12th) */}
          <div className="p-5 rounded-2xl bg-canvas/60 border border-border/70 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <School className="w-4 h-4 text-accent" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                2. Secondary (10th) & Higher Secondary (12th) Board Details
              </h4>
            </div>

            {/* Class 10 Row */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>Class 10th (Secondary)</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    10th Board Name
                  </label>
                  <input
                    type="text"
                    value={formData.tenthBoard || ""}
                    onChange={(e) => handleFieldChange("tenthBoard", e.target.value)}
                    placeholder="e.g. CBSE / ICSE / State Board"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    10th School Name
                  </label>
                  <input
                    type="text"
                    value={formData.tenthSchool || ""}
                    onChange={(e) => handleFieldChange("tenthSchool", e.target.value)}
                    placeholder="e.g. St. Xavier's High School"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    10th Percentage / CGPA
                  </label>
                  <input
                    type="text"
                    value={formData.tenthPercentage || ""}
                    onChange={(e) => handleFieldChange("tenthPercentage", e.target.value)}
                    placeholder="e.g. 94.2%"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    Passing Year
                  </label>
                  <input
                    type="text"
                    value={formData.tenthPassingYear || ""}
                    onChange={(e) => handleFieldChange("tenthPassingYear", e.target.value)}
                    placeholder="e.g. 2019"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            {/* Class 12 Row */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Class 12th (Higher Secondary)</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    12th Board / Council
                  </label>
                  <input
                    type="text"
                    value={formData.twelfthBoard || ""}
                    onChange={(e) => handleFieldChange("twelfthBoard", e.target.value)}
                    placeholder="e.g. CBSE / ISC / State Board"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    12th School / College
                  </label>
                  <input
                    type="text"
                    value={formData.twelfthSchool || ""}
                    onChange={(e) => handleFieldChange("twelfthSchool", e.target.value)}
                    placeholder="e.g. Delhi Public School"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    Stream
                  </label>
                  <input
                    type="text"
                    value={formData.twelfthStream || ""}
                    onChange={(e) => handleFieldChange("twelfthStream", e.target.value)}
                    placeholder="e.g. Science (PCM)"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    12th Percentage
                  </label>
                  <input
                    type="text"
                    value={formData.twelfthPercentage || ""}
                    onChange={(e) => handleFieldChange("twelfthPercentage", e.target.value)}
                    placeholder="e.g. 91.8%"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    Passing Year
                  </label>
                  <input
                    type="text"
                    value={formData.twelfthPassingYear || ""}
                    onChange={(e) => handleFieldChange("twelfthPassingYear", e.target.value)}
                    placeholder="e.g. 2021"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Polytechnic / Diploma in Engineering (Optional / Lateral Entry) */}
          <div className="p-5 rounded-2xl bg-canvas/60 border border-border/70 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                  3. Polytechnic / Diploma in Engineering (Lateral Entry / Optional)
                </h4>
              </div>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.hasDiploma)}
                  onChange={(e) => handleFieldChange("hasDiploma", e.target.checked)}
                  className="rounded accent-accent cursor-pointer"
                />
                <span>I have a Diploma / Lateral Entry</span>
              </label>
            </div>

            {formData.hasDiploma ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-1 animate-in fade-in">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    Board / Council
                  </label>
                  <input
                    type="text"
                    value={formData.diplomaBoard || ""}
                    onChange={(e) => handleFieldChange("diplomaBoard", e.target.value)}
                    placeholder="e.g. WBSCTE / MSBTE / DTE"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    Polytechnic College
                  </label>
                  <input
                    type="text"
                    value={formData.diplomaCollege || ""}
                    onChange={(e) => handleFieldChange("diplomaCollege", e.target.value)}
                    placeholder="e.g. Govt. Polytechnic"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    Branch / Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.diplomaBranch || ""}
                    onChange={(e) => handleFieldChange("diplomaBranch", e.target.value)}
                    placeholder="e.g. Computer Science & Tech"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    Percentage / CGPA
                  </label>
                  <input
                    type="text"
                    value={formData.diplomaPercentage || ""}
                    onChange={(e) => handleFieldChange("diplomaPercentage", e.target.value)}
                    placeholder="e.g. 84.5%"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">
                    Passing Year
                  </label>
                  <input
                    type="text"
                    value={formData.diplomaPassingYear || ""}
                    onChange={(e) => handleFieldChange("diplomaPassingYear", e.target.value)}
                    placeholder="e.g. 2022"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-ink-muted">
                Check the box above if you entered your degree via Lateral Entry or completed a 3-year State Technical Board Diploma.
              </p>
            )}
          </div>

          {/* Section 4: Coursework Subjects */}
          <div className="p-5 rounded-2xl bg-canvas/60 border border-border/70 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                4. Key Coursework & University Subjects
              </h4>
            </div>

            {/* Existing Subjects */}
            {formData.subjects && formData.subjects.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {formData.subjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border/80 text-xs shadow-2xs"
                  >
                    <span className="font-semibold text-ink">{sub.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-accent/10 text-accent font-bold text-[10px]">
                      {sub.gradeOrScore}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(sub.id)}
                      className="text-ink-muted hover:text-action p-0.5 transition-colors cursor-pointer"
                      title="Remove subject"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-muted">No specific coursework subjects added yet.</p>
            )}

            {/* Add Subject Row */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <input
                type="text"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="Add Subject (e.g. Operating Systems)"
                className="flex-1 min-w-[200px] px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
              />
              <input
                type="text"
                value={newSubGrade}
                onChange={(e) => setNewSubGrade(e.target.value)}
                placeholder="Grade (e.g. A+)"
                className="w-24 px-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
              />
              <select
                value={newSubProficiency}
                onChange={(e) => setNewSubProficiency(e.target.value as any)}
                className="w-28 px-2 py-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
              >
                <option value="Mastered">Mastered</option>
                <option value="Proficient">Proficient</option>
                <option value="Learning">Learning</option>
              </select>
              <button
                type="button"
                onClick={handleAddSubject}
                className="px-3.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Subject</span>
              </button>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70">
            <span className="text-xs text-ink-muted flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-accent" />
              <span>All updates are synchronized directly to your Supabase student profile.</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-border/80 text-ink-muted hover:text-ink hover:bg-canvas text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-accent/25 disabled:opacity-50"
              >
                {isSaving ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Academic Credentials to Database</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* UNIFIED OVERVIEW DISPLAY (NO FRAGMENTED CLASS10/CLASS12 BOXES) */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top 4 Quick-Metric Stat Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60">
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
                <span>Good Standing</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                Current Semester
              </span>
              <span className="text-xl font-black text-ink block truncate">
                {academicProfile.semester || "Semester 1"}
              </span>
              <span className="text-[11px] text-ink-muted truncate block">
                {academicProfile.branch || "Enrolled"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60">
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

            <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                Graduation Year
              </span>
              <span className="text-2xl font-black text-ink block">
                {academicProfile.graduationYear || "2025"}
              </span>
              <span className="text-[11px] text-ink-muted block">
                Targeted Batch
              </span>
            </div>
          </div>

          {/* Unified Credentials Detailed Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* University & College Credentials Block */}
            <div className="p-5 rounded-2xl bg-canvas/50 border border-border/70 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                      University & College Degree
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400">
                    {academicProfile.semester || "Semester 7"}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-ink-muted uppercase block">Degree / Program</span>
                    <span className="font-bold text-ink text-sm block">{displayDegree}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-ink-muted uppercase block">College / Institute</span>
                    <span className="font-medium text-ink block">{displayCollege}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-ink-muted uppercase block">Affiliated University</span>
                    <span className="font-medium text-ink block">{displayUniversity}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
                    <div>
                      <span className="text-[10px] font-semibold text-ink-muted uppercase block">Department / Branch</span>
                      <span className="font-semibold text-ink truncate block">{academicProfile.branch || "Not Specified"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-ink-muted uppercase block">CGPA & Standing</span>
                      <span className="font-black text-ink block">
                        {academicProfile.cgpa || "—"} / {academicProfile.gradingScale || "10.0"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* School & Prior Credentials (10th, 12th & Diploma) in ONE Unified Table */}
            <div className="p-5 rounded-2xl bg-canvas/50 border border-border/70 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4 text-accent" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                      Secondary & Higher Secondary Records
                    </h4>
                  </div>
                  <span className="text-[10px] font-semibold text-ink-muted">
                    10th • 12th • Diploma
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* 10th Summary Row */}
                  <div className="p-2.5 rounded-xl bg-surface/80 border border-border/60 flex items-center justify-between gap-3">
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink">Class 10th</span>
                        <span className="text-[11px] text-ink-muted truncate">
                          {academicProfile.tenthBoard || "Board not set"}
                        </span>
                      </div>
                      <span className="text-[11px] text-ink-muted truncate block">
                        {academicProfile.tenthSchool || "School name not recorded"}
                        {academicProfile.tenthPassingYear ? ` • ${academicProfile.tenthPassingYear}` : ""}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-ink block">
                        {academicProfile.tenthPercentage || "—"}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {academicProfile.tenthPercentage ? "Recorded" : "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* 12th Summary Row */}
                  <div className="p-2.5 rounded-xl bg-surface/80 border border-border/60 flex items-center justify-between gap-3">
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink">Class 12th</span>
                        <span className="text-[11px] text-ink-muted truncate">
                          {academicProfile.twelfthBoard || "Board not set"}
                        </span>
                      </div>
                      <span className="text-[11px] text-ink-muted truncate block">
                        {academicProfile.twelfthStream ? `${academicProfile.twelfthStream} • ` : ""}
                        {academicProfile.twelfthSchool || "School name not recorded"}
                        {academicProfile.twelfthPassingYear ? ` • ${academicProfile.twelfthPassingYear}` : ""}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-ink block">
                        {academicProfile.twelfthPercentage || "—"}
                      </span>
                      <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                        {academicProfile.twelfthPercentage ? "Recorded" : "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Diploma Row (If Applicable) */}
                  {hasDiploma && (
                    <div className="p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/20 flex items-center justify-between gap-3">
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                            Polytechnic / Diploma
                          </span>
                          <span className="text-[11px] text-ink-muted truncate">
                            {academicProfile.diplomaBoard || "Technical Board"}
                          </span>
                        </div>
                        <span className="text-[11px] text-ink-muted truncate block">
                          {academicProfile.diplomaBranch ? `${academicProfile.diplomaBranch} • ` : ""}
                          {academicProfile.diplomaCollege || "Polytechnic Institute"}
                          {academicProfile.diplomaPassingYear ? ` • ${academicProfile.diplomaPassingYear}` : ""}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-purple-600 dark:text-purple-400 block">
                          {academicProfile.diplomaPercentage || "Recorded"}
                        </span>
                        <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                          Lateral Entry
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Core Technical Coursework Block */}
          <div className="p-5 rounded-2xl bg-canvas/40 border border-border/60 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                  Core University Coursework & Academic Performance
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add / Manage Coursework</span>
              </button>
            </div>

            {academicProfile.subjects && academicProfile.subjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
                {academicProfile.subjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-xl bg-surface border border-border/70 flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="truncate">
                      <span className="text-xs font-bold text-ink block truncate">{sub.name}</span>
                      <span className="text-[10px] text-ink-muted block">{sub.proficiency}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent font-black text-xs shrink-0">
                      {sub.gradeOrScore}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-muted">
                No coursework subjects recorded yet. Click &quot;Edit Academic Credentials&quot; to add Data Structures, DBMS, Operating Systems, etc.
              </p>
            )}
          </div>

          {/* Unified CTA Strip at the bottom of the card */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-ink-muted flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>All 10th, 12th, college semester, and degree credentials are validated and stored in DB.</span>
            </span>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-canvas border border-border/80 hover:border-accent hover:text-accent text-xs font-bold text-ink transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-accent" />
              <span>Update Academic Credentials</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
