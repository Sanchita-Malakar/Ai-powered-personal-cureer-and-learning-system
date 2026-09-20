"use client";

import React, { useState } from "react";
import { CompleteStudentProfile } from "@/types/onboarding";
import {
  X,
  Check,
  User,
  GraduationCap,
  Compass,
  Target,
  Sparkles,
  Save,
} from "lucide-react";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CompleteStudentProfile;
  onSave: (updated: CompleteStudentProfile) => void;
  initialTab?: "personal" | "academic" | "preferences";
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  initialTab = "personal",
}) => {
  const [activeTab, setActiveTab] = useState<"personal" | "academic" | "preferences">(initialTab);
  const [formData, setFormData] = useState<CompleteStudentProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (section: keyof CompleteStudentProfile, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Edit Career Profile</h3>
              <p className="text-[11px] text-ink-muted">
                Updates synchronize with AI recommendations, roadmap milestones & job matcher.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-3 pb-2 border-b border-border/60 flex items-center gap-2 bg-canvas/40">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "personal"
                ? "bg-accent text-white shadow-xs"
                : "text-ink-muted hover:text-ink hover:bg-surface"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal & Social</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("academic")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "academic"
                ? "bg-accent text-white shadow-xs"
                : "text-ink-muted hover:text-ink hover:bg-surface"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Details</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preferences")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "preferences"
                ? "bg-accent text-white shadow-xs"
                : "text-ink-muted hover:text-ink hover:bg-surface"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Preferences & Goals</span>
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === "personal" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.fullName}
                    onChange={(e) => handleInputChange("personalInfo", "fullName", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Academic Email
                  </label>
                  <input
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Current City & Country
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.locationCity}
                    onChange={(e) => handleInputChange("personalInfo", "locationCity", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.college}
                    onChange={(e) => handleInputChange("personalInfo", "college", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.graduationYear}
                    onChange={(e) => handleInputChange("personalInfo", "graduationYear", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border/60">
                <span className="text-xs font-bold text-ink block mb-2">Developer Links</span>
                <div className="space-y-2.5">
                  <input
                    type="url"
                    placeholder="GitHub URL (e.g. https://github.com/...)"
                    value={formData.personalInfo.githubUrl}
                    onChange={(e) => handleInputChange("personalInfo", "githubUrl", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                  <input
                    type="url"
                    placeholder="LinkedIn Profile URL"
                    value={formData.personalInfo.linkedInUrl}
                    onChange={(e) => handleInputChange("personalInfo", "linkedInUrl", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                  <input
                    type="url"
                    placeholder="Portfolio Website URL"
                    value={formData.personalInfo.portfolioUrl}
                    onChange={(e) => handleInputChange("personalInfo", "portfolioUrl", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "academic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Cumulative CGPA
                  </label>
                  <input
                    type="text"
                    value={formData.academicProfile.cgpa}
                    onChange={(e) => handleInputChange("academicProfile", "cgpa", e.target.value)}
                    placeholder="e.g. 8.85"
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Current Semester
                  </label>
                  <input
                    type="text"
                    value={formData.academicProfile.semester}
                    onChange={(e) => handleInputChange("academicProfile", "semester", e.target.value)}
                    placeholder="e.g. Semester 7"
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    10th Board %
                  </label>
                  <input
                    type="text"
                    value={formData.academicProfile.tenthPercentage}
                    onChange={(e) => handleInputChange("academicProfile", "tenthPercentage", e.target.value)}
                    placeholder="e.g. 94.2%"
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    12th Board %
                  </label>
                  <input
                    type="text"
                    value={formData.academicProfile.twelfthPercentage}
                    onChange={(e) => handleInputChange("academicProfile", "twelfthPercentage", e.target.value)}
                    placeholder="e.g. 91.8%"
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                    Active Backlogs
                  </label>
                  <select
                    value={formData.academicProfile.activeBacklogs}
                    onChange={(e) => handleInputChange("academicProfile", "activeBacklogs", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  >
                    <option value="0">0 (Zero / Clear)</option>
                    <option value="1">1</option>
                    <option value="2+">2+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Department / Branch
                </label>
                <input
                  type="text"
                  value={formData.academicProfile.branch}
                  onChange={(e) => handleInputChange("academicProfile", "branch", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Primary Target Career Role
                </label>
                <input
                  type="text"
                  value={formData.careerPreferences.primaryRole}
                  onChange={(e) => handleInputChange("careerPreferences", "primaryRole", e.target.value)}
                  placeholder="e.g. AI/ML Engineer"
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Target Salary / Compensation Bracket
                </label>
                <input
                  type="text"
                  value={formData.careerPreferences.targetSalary}
                  onChange={(e) => handleInputChange("careerPreferences", "targetSalary", e.target.value)}
                  placeholder="e.g. ₹12 - ₹18 LPA"
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Earliest Availability
                </label>
                <input
                  type="text"
                  value={formData.careerPreferences.earliestJoining}
                  onChange={(e) => handleInputChange("careerPreferences", "earliestJoining", e.target.value)}
                  placeholder="e.g. Post Graduation (May 2025)"
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                  Career Objective Statement
                </label>
                <textarea
                  rows={3}
                  value={formData.careerGoals.primaryObjective}
                  onChange={(e) => handleInputChange("careerGoals", "primaryObjective", e.target.value)}
                  placeholder="To build scalable machine learning systems..."
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Footer Save Actions */}
          <div className="pt-4 border-t border-border/80 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-canvas text-xs font-semibold text-ink-muted hover:text-ink hover:bg-border/60 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-accent hover:bg-accent/90 text-white text-xs font-bold transition-all shadow-md shadow-accent/20 flex items-center gap-1.5 active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
