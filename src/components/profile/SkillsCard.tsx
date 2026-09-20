"use client";

import React, { useState } from "react";
import { SkillsMatrix, SkillItem, SkillProficiency } from "@/types/onboarding";
import {
  Code2,
  Cpu,
  Database,
  Layers,
  Cloud,
  Plus,
  Edit3,
  Check,
  Sparkles,
} from "lucide-react";

interface SkillsCardProps {
  skills: SkillsMatrix;
  onUpdateSkills: (skills: Partial<SkillsMatrix>) => void;
  onEdit: () => void;
}

export const SkillsCard: React.FC<SkillsCardProps> = ({
  skills,
  onUpdateSkills,
  onEdit,
}) => {
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProficiency, setNewSkillProficiency] = useState<SkillProficiency>("Intermediate");

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

  const handleAddSkill = (categoryKey: keyof SkillsMatrix) => {
    if (!newSkillName.trim()) return;

    const newItem: SkillItem = {
      id: `skill-${Date.now()}`,
      name: newSkillName.trim(),
      category: categoryKey === "programming" ? "Programming" : categoryKey === "aiMl" ? "AI/ML" : "Development",
      proficiency: newSkillProficiency,
    };

    const currentList = (skills[categoryKey] as SkillItem[]) || [];
    onUpdateSkills({
      [categoryKey]: [...currentList, newItem],
    });

    setNewSkillName("");
    setAddingToCategory(null);
  };

  const getProficiencyBadge = (prof: SkillProficiency) => {
    switch (prof) {
      case "Advanced":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "Intermediate":
        return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "Beginner":
      default:
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
    }
  };

  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 shadow-xs hover:border-border transition-all">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center border border-blue-500/20">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">Skills Matrix</h3>
            <p className="text-xs text-ink-muted">
              Technical competencies verified for ATS parsing and job matching.
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Manage Skills</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="space-y-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isAdding = addingToCategory === cat.key;

          return (
            <div
              key={cat.key}
              className="p-4 rounded-2xl bg-canvas/70 border border-border/70"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${cat.color}`} />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                    {cat.label}
                  </h4>
                  <span className="text-[11px] font-semibold text-ink-muted px-2 py-0.5 rounded-full bg-surface border border-border/60">
                    {cat.items.length}
                  </span>
                </div>
                {!isAdding && (
                  <button
                    onClick={() => {
                      setAddingToCategory(cat.key);
                      setNewSkillName("");
                    }}
                    className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                )}
              </div>

              {/* Skill Badges */}
              <div className="flex flex-wrap gap-2">
                {cat.items.map((skill) => (
                  <div
                    key={skill.id}
                    className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border/80 text-ink text-xs font-medium hover:border-accent/40 transition-all shadow-xs"
                  >
                    <span className="font-semibold text-ink">{skill.name}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${getProficiencyBadge(
                        skill.proficiency
                      )}`}
                    >
                      {skill.proficiency}
                    </span>
                  </div>
                ))}

                {cat.items.length === 0 && !isAdding && (
                  <span className="text-xs text-ink-muted italic">
                    No skills logged in this category.
                  </span>
                )}
              </div>

              {/* Inline Quick Add Form */}
              {isAdding && (
                <div className="mt-3 pt-3 border-t border-border/60 flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    placeholder="Skill name (e.g. Docker, PyTorch)..."
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    autoFocus
                    className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  />
                  <select
                    value={newSkillProficiency}
                    onChange={(e) => setNewSkillProficiency(e.target.value as SkillProficiency)}
                    className="px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <button
                    onClick={() => handleAddSkill(cat.key)}
                    className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setAddingToCategory(null)}
                    className="px-2.5 py-1.5 rounded-lg bg-transparent text-ink-muted text-xs hover:text-ink"
                  >
                    Cancel
                  </button>
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
              Additional Tools & Practices
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
    </div>
  );
};
