"use client";

import React, { useState } from "react";
import { SkillsMatrix, SkillItem, SkillProficiency } from "@/types/onboarding";
import {
  CLAIMED_SKILL_BASELINE_PERCENTAGE,
  CLAIMED_SKILL_BASELINE_LEVEL,
  getProficiencyLevel,
  getProficiencyBadgeStyle,
} from "@/lib/verification/constants";
import { SkillHistoryModal } from "./SkillHistoryModal";
import {
  Code2,
  Cpu,
  Database,
  Layers,
  Cloud,
  Plus,
  Check,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  History,
  TrendingUp,
  FolderGit2,
} from "lucide-react";

interface SkillsCardProps {
  skills: SkillsMatrix;
  onUpdateSkills: (skills: Partial<SkillsMatrix>) => void;
  onEdit?: () => void;
  userId?: string;
}

export const SkillsCard: React.FC<SkillsCardProps> = ({
  skills,
  onUpdateSkills,
  onEdit,
  userId,
}) => {
  const [filterMode, setFilterMode] = useState<"all" | "verified" | "claimed">("all");
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProficiency, setNewSkillProficiency] = useState<SkillProficiency>("Beginner");

  // Skill History Modal State
  const [historyModalSkill, setHistoryModalSkill] = useState<SkillItem | null>(null);

  const categories = [
    {
      key: "programming" as const,
      label: "Programming Languages",
      icon: Code2,
      color: "text-blue-500",
      bg: "bg-blue-500/10 border-blue-500/20",
      items: skills.programming || [],
    },
    {
      key: "development" as const,
      label: "Web & Full-Stack Development",
      icon: Layers,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      items: skills.development || [],
    },
    {
      key: "aiMl" as const,
      label: "AI, Machine Learning & LLMs",
      icon: Cpu,
      color: "text-purple-500",
      bg: "bg-purple-500/10 border-purple-500/20",
      items: skills.aiMl || [],
    },
    {
      key: "data" as const,
      label: "Data & Databases",
      icon: Database,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
      items: skills.data || [],
    },
    {
      key: "cloudDevOps" as const,
      label: "Cloud & DevOps",
      icon: Cloud,
      color: "text-sky-500",
      bg: "bg-sky-500/10 border-sky-500/20",
      items: skills.cloudDevOps || [],
    },
  ];

  // Enforce Core Concept:
  // When a student adds a skill, it is strictly marked as Claimed.
  // Initial proficiency is Beginner/Basic Knowledge.
  // The verified percentage is the agreed baseline (20% - Exposure).
  // Students cannot manually inflate it to 90% verified score!
  const handleAddSkill = (categoryKey: keyof SkillsMatrix) => {
    if (!newSkillName.trim()) return;

    const newItem: SkillItem = {
      id: `skill-${Date.now()}`,
      name: newSkillName.trim(),
      category:
        categoryKey === "programming"
          ? "Programming"
          : categoryKey === "aiMl"
          ? "AI/ML"
          : categoryKey === "data"
          ? "Data"
          : categoryKey === "cloudDevOps"
          ? "Cloud & DevOps"
          : "Development",
      proficiency: newSkillProficiency, // Student claimed level
      isClaimed: true,
      isVerified: false,
      verifiedPercentage: CLAIMED_SKILL_BASELINE_PERCENTAGE, // Initial 20%
      verifiedLevel: CLAIMED_SKILL_BASELINE_LEVEL, // Exposure
      evidenceProjectsCount: 0,
      confidenceScore: 0.2,
      lastVerifiedAt: undefined,
    };

    const currentList = (skills[categoryKey] as SkillItem[]) || [];
    onUpdateSkills({
      [categoryKey]: [...currentList, newItem],
    });

    setNewSkillName("");
    setAddingToCategory(null);
  };

  // Calculate summary counts
  const allSkillsList: SkillItem[] = [
    ...(skills.programming || []),
    ...(skills.development || []),
    ...(skills.aiMl || []),
    ...(skills.data || []),
    ...(skills.cloudDevOps || []),
  ];

  const verifiedCount = allSkillsList.filter((s) => s.isVerified).length;
  const claimedCount = allSkillsList.length;

  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 shadow-xs hover:border-border transition-all space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center border border-blue-500/20">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-ink">Skills Matrix</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                Evidence-Based Verification
              </span>
            </div>
            <p className="text-xs text-ink-muted">
              Distinguishes student-claimed skills from verified GitHub project evidence.
            </p>
          </div>
        </div>

        {/* View Filter Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-canvas border border-border/80 self-start sm:self-auto">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              filterMode === "all"
                ? "bg-surface text-ink shadow-xs border border-border/60"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            All ({claimedCount})
          </button>
          <button
            onClick={() => setFilterMode("verified")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
              filterMode === "verified"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-xs border border-emerald-500/30"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Verified ({verifiedCount})</span>
          </button>
          <button
            onClick={() => setFilterMode("claimed")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              filterMode === "claimed"
                ? "bg-surface text-ink shadow-xs border border-border/60"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Claimed Only ({claimedCount - verifiedCount})
          </button>
        </div>
      </div>

      {/* Methodology Explainer Note */}
      <div className="p-3.5 rounded-2xl bg-canvas/70 border border-border/80 flex items-start gap-2.5 text-xs text-ink-muted">
        <HelpCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong className="text-ink">Verification Model:</strong> Newly logged skills represent student claims starting at baseline. High verified proficiency is unlocked by linking and analyzing substantive GitHub repositories in <em>Featured Projects</em>.
        </span>
      </div>

      {/* Categories Grid */}
      <div className="space-y-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isAdding = addingToCategory === cat.key;

          // Filter items based on selected tab
          const displayItems = cat.items.filter((item) => {
            if (filterMode === "verified") return Boolean(item.isVerified);
            if (filterMode === "claimed") return !item.isVerified;
            return true;
          });

          return (
            <div
              key={cat.key}
              className="p-4 sm:p-5 rounded-2xl bg-canvas/70 border border-border/70 space-y-3"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${cat.color}`} />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                    {cat.label}
                  </h4>
                  <span className="text-[11px] font-semibold text-ink-muted px-2 py-0.5 rounded-full bg-surface border border-border/60">
                    {displayItems.length}
                  </span>
                </div>
                {!isAdding && (
                  <button
                    onClick={() => {
                      setAddingToCategory(cat.key);
                      setNewSkillName("");
                      setNewSkillProficiency("Beginner");
                    }}
                    className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Claimed Skill</span>
                  </button>
                )}
              </div>

              {/* Skills Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {displayItems.map((skill) => {
                  const verifiedPercentage = skill.verifiedPercentage || CLAIMED_SKILL_BASELINE_PERCENTAGE;
                  const verifiedLevel = skill.verifiedLevel || getProficiencyLevel(verifiedPercentage);
                  const isVerified = Boolean(skill.isVerified);
                  const badgeStyle = getProficiencyBadgeStyle(verifiedPercentage);

                  return (
                    <div
                      key={skill.id}
                      className="p-3.5 rounded-2xl bg-surface border border-border/80 hover:border-accent/40 transition-all space-y-2.5 shadow-xs"
                    >
                      {/* Skill Name & Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-ink">{skill.name}</span>
                            {isVerified && (
                              <span title="Evidence-verified skill" className="inline-flex">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-ink-muted">
                            Claimed: <strong>{skill.proficiency || "Beginner"}</strong>
                          </span>
                        </div>

                        {/* History Trigger */}
                        <button
                          onClick={() => setHistoryModalSkill(skill)}
                          className="p-1 rounded-lg text-ink-muted hover:text-accent hover:bg-border/60 transition-colors"
                          title="View Progression History"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Verified Evidence Metric Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-ink-muted font-medium">
                            {isVerified ? "Project Evidence" : "Baseline"}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${badgeStyle.badgeBg} ${badgeStyle.badgeColor} ${badgeStyle.textColor}`}
                            >
                              {verifiedLevel}
                            </span>
                            <span className="font-mono font-bold text-ink text-xs">
                              {verifiedPercentage}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-border/60 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isVerified ? "bg-accent" : "bg-slate-400/50"
                            }`}
                            style={{ width: `${verifiedPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Backing Evidence Footer */}
                      <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-ink-muted">
                        {isVerified ? (
                          <span className="flex items-center gap-1 text-accent font-semibold">
                            <FolderGit2 className="w-3 h-3" />
                            <span>Verified by {skill.evidenceProjectsCount || 1} project(s)</span>
                          </span>
                        ) : (
                          <span className="italic">Awaiting project evidence</span>
                        )}
                        <button
                          onClick={() => setHistoryModalSkill(skill)}
                          className="text-[10px] text-ink-muted hover:text-ink underline cursor-pointer"
                        >
                          Audit log
                        </button>
                      </div>
                    </div>
                  );
                })}

                {displayItems.length === 0 && !isAdding && (
                  <div className="col-span-full py-4 text-center text-xs text-ink-muted italic">
                    {filterMode === "verified"
                      ? "No skills in this category have been verified yet. Click 'Verify Project' on a relevant featured project."
                      : "No skills logged in this category."}
                  </div>
                )}
              </div>

              {/* Inline Quick Add Form */}
              {isAdding && (
                <div className="mt-3 pt-3 border-t border-border/60 p-3.5 rounded-xl bg-surface border border-accent/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink">Add Claimed Skill</span>
                    <span className="text-[10px] text-ink-muted">
                      Starts at baseline (20% Exposure) until verified
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      placeholder="Skill name (e.g. Python, Docker, React)..."
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      autoFocus
                      className="px-3 py-1.5 rounded-lg bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent min-w-[200px]"
                    />
                    <select
                      value={newSkillProficiency}
                      onChange={(e) => setNewSkillProficiency(e.target.value as SkillProficiency)}
                      className="px-2.5 py-1.5 rounded-lg bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                    >
                      <option value="Beginner">Self-Rating: Beginner</option>
                      <option value="Intermediate">Self-Rating: Intermediate</option>
                      <option value="Advanced">Self-Rating: Advanced</option>
                    </select>
                    <button
                      onClick={() => handleAddSkill(cat.key)}
                      className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>Save as Claimed</span>
                    </button>
                    <button
                      onClick={() => setAddingToCategory(null)}
                      className="px-2.5 py-1.5 rounded-lg bg-transparent text-ink-muted text-xs hover:text-ink cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Other / Soft Skills */}
        {skills.otherSkills && skills.otherSkills.length > 0 && (
          <div className="p-4 rounded-2xl bg-canvas/70 border border-border/70">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Additional Tools & Methodologies</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.otherSkills.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-border/80 text-xs font-medium text-ink-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Skill Progression History Modal */}
      <SkillHistoryModal
        isOpen={Boolean(historyModalSkill)}
        onClose={() => setHistoryModalSkill(null)}
        skillName={historyModalSkill?.name || ""}
        currentPercentage={historyModalSkill?.verifiedPercentage || CLAIMED_SKILL_BASELINE_PERCENTAGE}
        currentLevel={historyModalSkill?.verifiedLevel || CLAIMED_SKILL_BASELINE_LEVEL}
        isVerified={historyModalSkill?.isVerified}
        evidenceProjectsCount={historyModalSkill?.evidenceProjectsCount || 0}
        userId={userId}
      />
    </div>
  );
};
