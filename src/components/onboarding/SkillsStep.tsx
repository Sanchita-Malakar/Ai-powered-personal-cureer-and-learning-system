"use client";

import React, { useState } from "react";
import { SkillsMatrix, SkillItem, SkillProficiency } from "@/types/onboarding";
import {
  Code,
  Globe,
  Sparkles,
  Database,
  Cloud,
  Plus,
  X,
  Check,
  Cpu,
  Layers,
} from "lucide-react";

interface SkillsStepProps {
  skills: SkillsMatrix;
  onChange: (updates: Partial<SkillsMatrix>) => void;
  errors: Record<string, string>;
}

interface SkillCategoryDef {
  key: keyof Omit<SkillsMatrix, "otherSkills">;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  popularSuggestions: string[];
}

const CATEGORY_DEFS: SkillCategoryDef[] = [
  {
    key: "programming",
    label: "Programming Languages",
    icon: Code,
    color: "text-blue-500",
    popularSuggestions: ["TypeScript", "Python", "Java", "C++", "JavaScript", "Go", "C#", "SQL", "Rust"],
  },
  {
    key: "development",
    label: "Development & Frameworks",
    icon: Globe,
    color: "text-emerald-500",
    popularSuggestions: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS", "Spring Boot", "FastAPI", "Django", "GraphQL", "REST APIs"],
  },
  {
    key: "aiMl",
    label: "AI, Machine Learning & LLMs",
    icon: Sparkles,
    color: "text-purple-500",
    popularSuggestions: ["LangChain", "PyTorch", "TensorFlow", "Scikit-Learn", "Hugging Face", "OpenAI APIs", "Pandas", "NumPy", "Computer Vision", "NLP"],
  },
  {
    key: "data",
    label: "Databases & Data Engineering",
    icon: Database,
    color: "text-amber-500",
    popularSuggestions: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Supabase", "Vector DBs (Pinecone/Chroma)", "Snowflake", "Prisma ORM"],
  },
  {
    key: "cloudDevOps",
    label: "Cloud, DevOps & Tooling",
    icon: Cloud,
    color: "text-sky-500",
    popularSuggestions: ["Git & GitHub", "Docker", "Kubernetes", "AWS (S3/EC2/Lambda)", "Linux / Bash", "CI/CD Pipelines", "Postman", "GCP", "Vercel"],
  },
];

const OTHER_SKILL_SUGGESTIONS = [
  "System Design",
  "Agile / Scrum",
  "Object Oriented Design",
  "Microservices",
  "Unit Testing (Jest/Pytest)",
  "Data Structures",
];

export const SkillsStep: React.FC<SkillsStepProps> = ({
  skills,
  onChange,
  errors,
}) => {
  const [activeCategory, setActiveCategory] = useState<keyof Omit<SkillsMatrix, "otherSkills">>("programming");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProficiency, setNewSkillProficiency] = useState<SkillProficiency>("Intermediate");
  const [newOtherSkill, setNewOtherSkill] = useState("");

  const currentCategoryDef = CATEGORY_DEFS.find((c) => c.key === activeCategory)!;
  const currentSkills = skills[activeCategory] || [];

  const handleAddSkill = (name: string, proficiency: SkillProficiency = "Intermediate") => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (currentSkills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;

    const newSkill: SkillItem = {
      id: `${activeCategory}-${Date.now()}`,
      name: trimmed,
      category: currentCategoryDef.label as any,
      proficiency,
    };

    onChange({
      [activeCategory]: [...currentSkills, newSkill],
    });
    setNewSkillName("");
  };

  const handleRemoveSkill = (categoryKey: keyof Omit<SkillsMatrix, "otherSkills">, skillId: string) => {
    onChange({
      [categoryKey]: skills[categoryKey].filter((s) => s.id !== skillId),
    });
  };

  const handleUpdateProficiency = (
    categoryKey: keyof Omit<SkillsMatrix, "otherSkills">,
    skillId: string,
    proficiency: SkillProficiency
  ) => {
    onChange({
      [categoryKey]: skills[categoryKey].map((s) =>
        s.id === skillId ? { ...s, proficiency } : s
      ),
    });
  };

  const handleAddOtherSkill = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (skills.otherSkills.includes(trimmed)) return;
    onChange({ otherSkills: [...skills.otherSkills, trimmed] });
    setNewOtherSkill("");
  };

  const handleRemoveOtherSkill = (skill: string) => {
    onChange({ otherSkills: skills.otherSkills.filter((s) => s !== skill) });
  };

  const totalSkillCount =
    skills.programming.length +
    skills.development.length +
    skills.aiMl.length +
    skills.data.length +
    skills.cloudDevOps.length +
    skills.otherSkills.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="border-b border-border/70 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Step 4 • Technical Competency Matrix</span>
          </div>
          <span className="text-xs font-bold text-accent px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20">
            {totalSkillCount} Skills selected
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-ink">
          Curate your technical skills & tools
        </h3>
        <p className="text-sm text-ink-muted mt-1">
          Specify languages, frameworks, AI/ML tools, and databases. Our ATS engine benchmarks these against 100+ job descriptions.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-border/60">
        {CATEGORY_DEFS.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;
          const count = skills[cat.key]?.length || 0;

          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-accent text-white border-accent shadow-sm"
                  : "bg-surface border-border/70 text-ink-muted hover:text-ink hover:bg-canvas"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : cat.color}`} />
              <span>{cat.label}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-canvas text-ink-muted border border-border"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Category Skills Panel */}
      <div className="bg-canvas/50 border border-border/80 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-ink flex items-center gap-2">
            <currentCategoryDef.icon className={`w-4 h-4 ${currentCategoryDef.color}`} />
            <span>Selected {currentCategoryDef.label}</span>
          </h4>
          <span className="text-xs text-ink-muted">
            Click proficiency to toggle level
          </span>
        </div>

        {/* Selected skills chips */}
        {currentSkills.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-ink-muted bg-surface/40">
            No {currentCategoryDef.label.toLowerCase()} added yet. Pick from popular suggestions below or type a custom one.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mb-4">
            {currentSkills.map((skill) => {
              const profColor =
                skill.proficiency === "Advanced"
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                  : skill.proficiency === "Intermediate"
                  ? "bg-accent/15 text-accent border-accent/30"
                  : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";

              return (
                <div
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 bg-surface border border-border/90 rounded-xl px-3 py-1.5 shadow-xs transition-all hover:border-border"
                >
                  <span className="text-xs font-semibold text-ink">{skill.name}</span>

                  {/* Proficiency switcher button */}
                  <button
                    type="button"
                    onClick={() => {
                      const nextProf: SkillProficiency =
                        skill.proficiency === "Beginner"
                          ? "Intermediate"
                          : skill.proficiency === "Intermediate"
                          ? "Advanced"
                          : "Beginner";
                      handleUpdateProficiency(activeCategory, skill.id, nextProf);
                    }}
                    title="Click to change proficiency"
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border transition-all ${profColor}`}
                  >
                    {skill.proficiency}
                  </button>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(activeCategory, skill.id)}
                    className="text-ink-muted hover:text-action transition-colors ml-0.5"
                    title={`Remove ${skill.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Add custom skill input */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <input
            type="text"
            placeholder={`Add custom ${currentCategoryDef.label.toLowerCase()}...`}
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill(newSkillName, newSkillProficiency);
              }
            }}
            className="flex-1 bg-surface border border-border/80 text-ink placeholder:text-ink-muted/50 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent"
          />

          <select
            value={newSkillProficiency}
            onChange={(e) => setNewSkillProficiency(e.target.value as SkillProficiency)}
            className="bg-surface border border-border/80 text-ink text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-accent appearance-none cursor-pointer"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <button
            type="button"
            onClick={() => handleAddSkill(newSkillName, newSkillProficiency)}
            disabled={!newSkillName.trim()}
            className="inline-flex items-center gap-1 bg-accent text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-accent/90 disabled:opacity-50 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Popular suggestions list */}
        <div className="mt-4 pt-3 border-t border-border/50">
          <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block mb-2">
            Popular {currentCategoryDef.label} suggestions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {currentCategoryDef.popularSuggestions.map((sug) => {
              const alreadyAdded = currentSkills.some(
                (s) => s.name.toLowerCase() === sug.toLowerCase()
              );
              return (
                <button
                  key={sug}
                  type="button"
                  onClick={() => !alreadyAdded && handleAddSkill(sug, "Intermediate")}
                  disabled={alreadyAdded}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    alreadyAdded
                      ? "bg-canvas border-border/50 text-ink-muted/50 cursor-default"
                      : "bg-surface border-border/80 text-ink hover:border-accent hover:text-accent"
                  }`}
                >
                  {alreadyAdded ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Plus className="w-3 h-3 opacity-60" />
                  )}
                  <span>{sug}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Other Skills / Soft Skills Section */}
      <div className="pt-2 border-t border-border/60">
        <label className="block text-[13px] font-semibold text-ink mb-1">
          Other Technical & Core Competencies
        </label>
        <p className="text-xs text-ink-muted mb-3">
          Architecture principles, testing frameworks, agile workflows, and collaborative tools.
        </p>

        {/* Selected other skills */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {skills.otherSkills.map((other) => (
            <span
              key={other}
              className="inline-flex items-center gap-1 bg-surface border border-border/80 text-ink text-xs font-medium px-2.5 py-1 rounded-lg shadow-xs"
            >
              <span>{other}</span>
              <button
                type="button"
                onClick={() => handleRemoveOtherSkill(other)}
                className="text-ink-muted hover:text-action ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Add custom other skill */}
        <div className="flex items-center gap-2 max-w-sm mb-3">
          <input
            type="text"
            placeholder="e.g. System Design, Agile, Microservices"
            value={newOtherSkill}
            onChange={(e) => setNewOtherSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddOtherSkill(newOtherSkill);
              }
            }}
            className="flex-1 bg-canvas/70 border border-border/80 text-ink placeholder:text-ink-muted/50 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={() => handleAddOtherSkill(newOtherSkill)}
            disabled={!newOtherSkill.trim()}
            className="inline-flex items-center gap-1 bg-accent text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-accent/90 disabled:opacity-50 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-1.5">
          {OTHER_SKILL_SUGGESTIONS.map((sug) => {
            const added = skills.otherSkills.includes(sug);
            return (
              <button
                key={sug}
                type="button"
                onClick={() => !added && handleAddOtherSkill(sug)}
                disabled={added}
                className={`px-2 py-0.5 rounded text-[11px] border transition-all ${
                  added
                    ? "bg-canvas border-border/40 text-ink-muted/40 cursor-default"
                    : "bg-surface border-border text-ink hover:text-accent"
                }`}
              >
                + {sug}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
