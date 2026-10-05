"use client";

import React, { useState, useEffect } from "react";
import { AcademicProfile, SubjectPerformance } from "@/types/onboarding";
import {
  X,
  GraduationCap,
  Save,
  Plus,
  Trash2,
  BookOpen,
  Award,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface AcademicEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicProfile: AcademicProfile;
  degreeName?: string;
  collegeName?: string;
  onSave: (updatedProfile: AcademicProfile, updatedDegree?: string, updatedCollege?: string) => void;
}

export const AcademicEditModal: React.FC<AcademicEditModalProps> = ({
  isOpen,
  onClose,
  academicProfile,
  degreeName = "",
  collegeName = "",
  onSave,
}) => {
  const [formData, setFormData] = useState<AcademicProfile>(academicProfile);
  const [degree, setDegree] = useState(degreeName);
  const [college, setCollege] = useState(collegeName);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectGrade, setNewSubjectGrade] = useState("A+");
  const [newSubjectProficiency, setNewSubjectProficiency] = useState<"Proficient" | "Mastered" | "Learning">("Mastered");

  useEffect(() => {
    if (isOpen) {
      setFormData(academicProfile);
      setDegree(degreeName);
      setCollege(collegeName);
    }
  }, [isOpen, academicProfile, degreeName, collegeName]);

  if (!isOpen) return null;

  const handleFieldChange = (field: keyof AcademicProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    const newSub: SubjectPerformance = {
      id: `sub-${Date.now()}`,
      name: newSubjectName.trim(),
      gradeOrScore: newSubjectGrade,
      proficiency: newSubjectProficiency,
    };
    setFormData((prev) => ({
      ...prev,
      subjects: [...(prev.subjects || []), newSub],
    }));
    setNewSubjectName("");
    setNewSubjectGrade("A+");
  };

  const handleRemoveSubject = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, degree, college);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-surface border border-border shadow-2xl p-6 sm:p-7 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-border/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center border border-purple-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink">Academic Details & Coursework Editor</h3>
              <p className="text-xs text-ink-muted">
                Manually enter or adjust your university degree, CGPA, school board marks, diploma credentials, and coursework subjects. Saved directly to the database.
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Degree & Institution */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
              University Degree & Institution
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  Degree / Program
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science & Engineering"
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  College / Institution Name
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. National Institute of Technology"
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Current College CGPA & Semester */}
          <div className="space-y-3 pt-3 border-t border-border/60">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
              College Performance & Standing
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  Cumulative CGPA
                </label>
                <input
                  type="text"
                  value={formData.cgpa || ""}
                  onChange={(e) => handleFieldChange("cgpa", e.target.value)}
                  placeholder="e.g. 8.85"
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  Grading Scale
                </label>
                <select
                  value={formData.gradingScale || "10.0"}
                  onChange={(e) => handleFieldChange("gradingScale", e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                >
                  <option value="10.0">10.0 Scale</option>
                  <option value="4.0">4.0 Scale</option>
                  <option value="Percentage">Percentage (%)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  Current Semester
                </label>
                <select
                  value={formData.semester || "Semester 7"}
                  onChange={(e) => handleFieldChange("semester", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={`Semester ${s}`}>
                      Semester {s}
                    </option>
                  ))}
                  <option value="Graduated">Graduated</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  Branch / Department
                </label>
                <input
                  type="text"
                  value={formData.branch || ""}
                  onChange={(e) => handleFieldChange("branch", e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">
                  Active Backlogs / Arrears
                </label>
                <select
                  value={formData.activeBacklogs || "0"}
                  onChange={(e) => handleFieldChange("activeBacklogs", e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                >
                  <option value="0">0 (Zero / Clear)</option>
                  <option value="1">1 Backlog</option>
                  <option value="2+">2+ Backlogs</option>
                </select>
              </div>
            </div>
          </div>

          {/* School Boards (10th & 12th) */}
          <div className="space-y-3 pt-3 border-t border-border/60">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
              School Board Examinations (10th & 12th)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-canvas/60 border border-border/60">
              {/* Secondary (10th) */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-ink block">Class 10 (Secondary)</span>
                <div>
                  <label className="text-[10px] text-ink-muted block">Percentage / CGPA</label>
                  <input
                    type="text"
                    value={formData.tenthPercentage || ""}
                    onChange={(e) => handleFieldChange("tenthPercentage", e.target.value)}
                    placeholder="e.g. 94.4%"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-ink-muted block">Board Name</label>
                  <input
                    type="text"
                    value={formData.tenthBoard || ""}
                    onChange={(e) => handleFieldChange("tenthBoard", e.target.value)}
                    placeholder="e.g. CBSE / ICSE / State Board"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-ink-muted block">School Name</label>
                  <input
                    type="text"
                    value={formData.tenthSchool || ""}
                    onChange={(e) => handleFieldChange("tenthSchool", e.target.value)}
                    placeholder="e.g. Delhi Public School"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-ink-muted block">Passing Year</label>
                  <input
                    type="text"
                    value={formData.tenthPassingYear || ""}
                    onChange={(e) => handleFieldChange("tenthPassingYear", e.target.value)}
                    placeholder="e.g. 2019"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink"
                  />
                </div>
              </div>

              {/* Higher Secondary (12th) */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-ink block">Class 12 (Higher Secondary)</span>
                <div>
                  <label className="text-[10px] text-ink-muted block">Percentage / Marks</label>
                  <input
                    type="text"
                    value={formData.twelfthPercentage || ""}
                    onChange={(e) => handleFieldChange("twelfthPercentage", e.target.value)}
                    placeholder="e.g. 92.6%"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-ink-muted block">Board / Council</label>
                  <input
                    type="text"
                    value={formData.twelfthBoard || ""}
                    onChange={(e) => handleFieldChange("twelfthBoard", e.target.value)}
                    placeholder="e.g. CBSE / ISC / State Board"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-ink-muted block">School / Junior College</label>
                  <input
                    type="text"
                    value={formData.twelfthSchool || ""}
                    onChange={(e) => handleFieldChange("twelfthSchool", e.target.value)}
                    placeholder="e.g. The Heritage School"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-ink-muted block">Stream / Passing Year</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.twelfthStream || ""}
                      onChange={(e) => handleFieldChange("twelfthStream", e.target.value)}
                      placeholder="Science (PCM)"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink"
                    />
                    <input
                      type="text"
                      value={formData.twelfthPassingYear || ""}
                      onChange={(e) => handleFieldChange("twelfthPassingYear", e.target.value)}
                      placeholder="2021"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Polytechnic / Diploma in Engineering (Optional / Lateral Entry) */}
          <div className="space-y-3 pt-3 border-t border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                Polytechnic / Diploma in Engineering (Optional / Lateral Entry)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                Optional
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-canvas/60 border border-border/60 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-ink-muted block mb-1">
                    Aggregate Percentage / CGPA
                  </label>
                  <input
                    type="text"
                    value={formData.diplomaPercentage || ""}
                    onChange={(e) => handleFieldChange("diplomaPercentage", e.target.value)}
                    placeholder="e.g. 88.4% or 8.9 CGPA"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-ink-muted block mb-1">
                    Board / Council of Technical Education
                  </label>
                  <input
                    type="text"
                    value={formData.diplomaBoard || ""}
                    onChange={(e) => handleFieldChange("diplomaBoard", e.target.value)}
                    placeholder="e.g. WBSCTE / MSBTE / BTEUP / State Board"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-ink-muted block mb-1">
                    Polytechnic / Institute Name
                  </label>
                  <input
                    type="text"
                    value={formData.diplomaCollege || ""}
                    onChange={(e) => handleFieldChange("diplomaCollege", e.target.value)}
                    placeholder="e.g. Acharya Prafulla Chandra Polytechnic"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-ink-muted block mb-1">
                    Passing Year
                  </label>
                  <input
                    type="text"
                    value={formData.diplomaPassingYear || ""}
                    onChange={(e) => handleFieldChange("diplomaPassingYear", e.target.value)}
                    placeholder="e.g. 2022"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-ink-muted block mb-1">
                  Diploma Branch / Discipline
                </label>
                <input
                  type="text"
                  value={formData.diplomaBranch || ""}
                  onChange={(e) => handleFieldChange("diplomaBranch", e.target.value)}
                  placeholder="e.g. Diploma in Computer Science & Technology"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink"
                />
              </div>
            </div>
          </div>

          {/* Core Coursework Subjects */}
          <div className="space-y-3 pt-3 border-t border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Core Coursework Subjects & Grades
              </span>
              <span className="text-[11px] text-ink-muted">
                {formData.subjects?.length || 0} subjects recorded
              </span>
            </div>

            {/* List of current subjects */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {formData.subjects?.map((sub) => (
                <div
                  key={sub.id}
                  className="p-2.5 rounded-xl bg-canvas border border-border flex items-center justify-between text-xs"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="font-bold text-ink block truncate">{sub.name}</span>
                    <span className="text-[10px] text-ink-muted">{sub.proficiency}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-accent/15 text-accent font-bold text-xs">
                      {sub.gradeOrScore}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(sub.id)}
                      className="p-1 rounded text-ink-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Remove subject"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new subject input bar */}
            <div className="p-3 rounded-xl bg-canvas/80 border border-dashed border-border/80 flex flex-wrap sm:flex-nowrap items-center gap-2">
              <input
                type="text"
                placeholder="New subject (e.g. Artificial Intelligence)..."
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="flex-1 min-w-[150px] px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink"
              />
              <select
                value={newSubjectGrade}
                onChange={(e) => setNewSubjectGrade(e.target.value)}
                className="px-2 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink"
              >
                <option value="O">O (Outstanding)</option>
                <option value="A+">A+ (Excellent)</option>
                <option value="A">A (Very Good)</option>
                <option value="B+">B+ (Good)</option>
                <option value="B">B (Above Average)</option>
              </select>
              <select
                value={newSubjectProficiency}
                onChange={(e) => setNewSubjectProficiency(e.target.value as any)}
                className="px-2 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink"
              >
                <option value="Mastered">Mastered</option>
                <option value="Proficient">Proficient</option>
                <option value="Learning">Learning</option>
              </select>
              <button
                type="button"
                onClick={handleAddSubject}
                className="px-3 py-1.5 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold text-xs hover:bg-purple-500/25 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/70">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-canvas border border-border text-xs font-semibold text-ink-muted hover:text-ink cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 flex items-center gap-1.5 shadow-sm shadow-accent/25 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save to Database</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
