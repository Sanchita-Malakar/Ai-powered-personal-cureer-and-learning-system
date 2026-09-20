"use client";

import React, { useState } from "react";
import { CareerPreferences } from "@/types/onboarding";
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Building2,
  CalendarClock,
  Sparkles,
  Check,
  Plus,
  X,
  Target,
} from "lucide-react";

interface CareerPreferencesStepProps {
  data: CareerPreferences;
  onChange: (updates: Partial<CareerPreferences>) => void;
  errors: Record<string, string>;
}

const AVAILABLE_ROLES = [
  "Junior Full Stack Developer",
  "Frontend Engineer (React / Next.js)",
  "Backend Engineer (Node.js / Python / Java)",
  "AI / ML Engineer",
  "Data Scientist & Analyst",
  "DevOps & Cloud Associate",
  "Mobile App Engineer (React Native / Flutter)",
  "Product Designer (UI / UX)",
  "Software Engineer (General SDE)",
];

const SALARY_BRACKETS = [
  "₹6 - ₹10 LPA",
  "₹10 - ₹16 LPA",
  "₹16 - ₹25 LPA",
  "₹25 - ₹40 LPA",
  "₹40+ LPA (Tier-1 Tech)",
];

const LOCATIONS = [
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Delhi NCR / Gurgaon",
  "Mumbai",
  "Chennai",
  "Remote (India)",
  "Global Remote / Relocation",
];

const INDUSTRIES = [
  "SaaS & Enterprise",
  "AI & DeepTech",
  "FinTech & Payments",
  "E-Commerce & Quick Commerce",
  "EdTech",
  "HealthTech & Biotech",
  "Cybersecurity",
  "Gaming & Web3",
];

const EMPLOYMENT_TYPES = ["Full-time", "Internship (3-6 mo)", "Intern-to-PPO", "Remote Contract"];

const JOINING_TIMELINES = [
  "Immediate (Within 1-2 weeks)",
  "Within 1 month",
  "Post Graduation (Summer 2025)",
  "Flexible / Next Cohort",
];

export const CareerPreferencesStep: React.FC<CareerPreferencesStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  const [customCompany, setCustomCompany] = useState("");

  const toggleRole = (role: string) => {
    let nextRoles = [...data.targetRoles];
    if (nextRoles.includes(role)) {
      if (nextRoles.length === 1) return; // Keep at least one
      nextRoles = nextRoles.filter((r) => r !== role);
    } else {
      nextRoles.push(role);
    }
    const primary = nextRoles.includes(data.primaryRole) ? data.primaryRole : nextRoles[0];
    onChange({ targetRoles: nextRoles, primaryRole: primary });
  };

  const toggleLocation = (loc: string) => {
    let next = [...data.preferredLocations];
    if (next.includes(loc)) {
      if (next.length === 1) return;
      next = next.filter((l) => l !== loc);
    } else {
      next.push(loc);
    }
    onChange({ preferredLocations: next });
  };

  const toggleIndustry = (ind: string) => {
    let next = [...data.preferredIndustries];
    if (next.includes(ind)) {
      if (next.length === 1) return;
      next = next.filter((i) => i !== ind);
    } else {
      next.push(ind);
    }
    onChange({ preferredIndustries: next });
  };

  const toggleEmploymentType = (type: string) => {
    let next = [...data.employmentTypes];
    if (next.includes(type)) {
      if (next.length === 1) return;
      next = next.filter((t) => t !== type);
    } else {
      next.push(type);
    }
    onChange({ employmentTypes: next });
  };

  const handleAddDreamCompany = () => {
    if (!customCompany.trim()) return;
    if (!data.dreamCompanies.includes(customCompany.trim())) {
      onChange({ dreamCompanies: [...data.dreamCompanies, customCompany.trim()] });
    }
    setCustomCompany("");
  };

  const handleRemoveDreamCompany = (company: string) => {
    onChange({ dreamCompanies: data.dreamCompanies.filter((c) => c !== company) });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="border-b border-border/70 pb-4">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 3 • Career Aspiration & Market Targets</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-ink">
          Define your target career & placement goals
        </h3>
        <p className="text-sm text-ink-muted mt-1">
          Your dashboard milestones, curated job matches, and readiness analytics will center around these selections.
        </p>
      </div>

      {/* Target Roles Multi-Select */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[13px] font-semibold text-ink">
            Target Job Roles (Select 1 or more) <span className="text-action">*</span>
          </label>
          <span className="text-xs text-ink-muted">
            Primary role: <span className="font-bold text-accent">{data.primaryRole}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {AVAILABLE_ROLES.map((role) => {
            const isSelected = data.targetRoles.includes(role);
            const isPrimary = data.primaryRole === role;

            return (
              <div
                key={role}
                onClick={() => toggleRole(role)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-accent/10 border-accent text-accent shadow-sm"
                    : "bg-canvas/60 border-border/80 text-ink hover:border-border hover:bg-canvas"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs sm:text-[13px] font-semibold leading-tight">
                    {role}
                  </span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center text-[10px] shrink-0 ${
                      isSelected ? "bg-accent text-white" : "border border-border"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {isSelected && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange({ primaryRole: role });
                    }}
                    className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 w-fit transition-all ${
                      isPrimary
                        ? "bg-accent text-white shadow-xs"
                        : "bg-surface text-ink-muted hover:text-accent border border-border"
                    }`}
                  >
                    <Target className="w-2.5 h-2.5" />
                    <span>{isPrimary ? "Primary Goal" : "Set as primary"}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {errors.targetRoles && (
          <p className="text-xs text-action mt-1.5">{errors.targetRoles}</p>
        )}
      </div>

      {/* Target Salary / Expected CTC */}
      <div>
        <label className="block text-[13px] font-semibold text-ink mb-2">
          Target Salary / Expected CTC Range <span className="text-action">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {SALARY_BRACKETS.map((bracket) => {
            const isSelected = data.targetSalary === bracket;
            return (
              <button
                key={bracket}
                type="button"
                onClick={() => onChange({ targetSalary: bracket })}
                className={`p-2.5 rounded-xl border text-center transition-all text-xs font-semibold ${
                  isSelected
                    ? "bg-accent text-white border-accent shadow-md shadow-accent/20 scale-[1.02]"
                    : "bg-canvas/60 border-border/80 text-ink hover:bg-canvas"
                }`}
              >
                <IndianRupee className="w-3.5 h-3.5 mx-auto mb-1 opacity-75" />
                <span>{bracket}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferred Locations */}
      <div>
        <label className="block text-[13px] font-semibold text-ink mb-2">
          Preferred Job Locations (Select all that apply) <span className="text-action">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {LOCATIONS.map((loc) => {
            const isSelected = data.preferredLocations.includes(loc);
            return (
              <button
                key={loc}
                type="button"
                onClick={() => toggleLocation(loc)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-accent/15 border-accent text-accent"
                    : "bg-canvas/60 border-border/80 text-ink hover:border-border hover:bg-canvas"
                }`}
              >
                <MapPin className="w-3 h-3 opacity-70" />
                <span>{loc}</span>
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferred Industries & Employment Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/60">
        {/* Preferred Industries */}
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-2">
            Target Industries / Sectors
          </label>
          <div className="flex flex-wrap gap-1.5">
            {INDUSTRIES.map((ind) => {
              const isSelected = data.preferredIndustries.includes(ind);
              return (
                <button
                  key={ind}
                  type="button"
                  onClick={() => toggleIndustry(ind)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    isSelected
                      ? "bg-ai/15 border-ai text-ai font-semibold"
                      : "bg-canvas/60 border-border/70 text-ink hover:bg-canvas"
                  }`}
                >
                  {ind}
                </button>
              );
            })}
          </div>
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-2">
            Employment Type
          </label>
          <div className="flex flex-wrap gap-1.5">
            {EMPLOYMENT_TYPES.map((type) => {
              const isSelected = data.employmentTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleEmploymentType(type)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    isSelected
                      ? "bg-accent/15 border-accent text-accent font-semibold"
                      : "bg-canvas/60 border-border/70 text-ink hover:bg-canvas"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          {/* Earliest Joining */}
          <div className="mt-3.5">
            <label className="block text-xs font-semibold text-ink mb-1" htmlFor="joining">
              Earliest Joining Timeline
            </label>
            <div className="relative">
              <CalendarClock className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="joining"
                value={data.earliestJoining}
                onChange={(e) => onChange({ earliestJoining: e.target.value })}
                className="w-full bg-canvas/70 border border-border/80 text-ink text-xs rounded-xl pl-8 pr-8 py-2 focus:outline-none focus:border-accent appearance-none cursor-pointer"
              >
                {JOINING_TIMELINES.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Dream Companies (Ideal Student Addition) */}
      <div className="pt-2 border-t border-border/60">
        <label className="block text-[13px] font-semibold text-ink mb-1">
          Dream Companies / Target Employers
        </label>
        <p className="text-xs text-ink-muted mb-2.5">
          Enter companies you aspire to interview with (e.g. Stripe, Microsoft, Google, Swiggy, Zerodha).
        </p>

        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {data.dreamCompanies.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1 bg-surface border border-border/80 text-ink text-xs font-medium px-2.5 py-1 rounded-lg shadow-xs"
            >
              <Building2 className="w-3 h-3 text-accent" />
              <span>{c}</span>
              <button
                type="button"
                onClick={() => handleRemoveDreamCompany(c)}
                className="text-ink-muted hover:text-action ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 max-w-sm">
          <input
            type="text"
            placeholder="Add target company (e.g. Atlassian)"
            value={customCompany}
            onChange={(e) => setCustomCompany(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddDreamCompany();
              }
            }}
            className="flex-1 bg-canvas/70 border border-border/80 text-ink placeholder:text-ink-muted/50 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={handleAddDreamCompany}
            disabled={!customCompany.trim()}
            className="inline-flex items-center gap-1 bg-accent text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-accent/90 disabled:opacity-50 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
