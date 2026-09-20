"use client";

import React from "react";
import { JobFilterState } from "@/types/job";
import {
  Search,
  MapPin,
  Briefcase,
  Layers,
  Building,
  RotateCcw,
  SlidersHorizontal,
  LayoutGrid,
  Columns,
} from "lucide-react";

interface JobFilterBarProps {
  filters: JobFilterState;
  onFilterChange: (key: keyof JobFilterState, value: string) => void;
  onResetFilters: () => void;
  viewMode: "explore" | "pipeline";
  onChangeViewMode: (mode: "explore" | "pipeline") => void;
  availableCompanies: string[];
  totalJobsCount: number;
  totalApplicationsCount: number;
}

const COMMON_SKILLS = [
  "All Skills",
  "Python",
  "React",
  "DSA",
  "PyTorch",
  "SQL",
  "FastAPI",
  "TypeScript",
  "NLP",
  "Next.js",
  "Docker",
];

const COMMON_LOCATIONS = [
  "All Locations",
  "Bangalore, India",
  "Remote",
  "Hyderabad",
  "Gurgaon, India",
  "Pune",
];

const EXPERIENCE_LEVELS = [
  { value: "all", label: "All Experience" },
  { value: "intern", label: "Internships (2026/2027)" },
  { value: "entry-level", label: "Entry-Level / Graduate" },
];

export const JobFilterBar: React.FC<JobFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  viewMode,
  onChangeViewMode,
  availableCompanies,
  totalJobsCount,
  totalApplicationsCount,
}) => {
  const isFiltered =
    Boolean(filters.search) ||
    Boolean(filters.location) ||
    Boolean(filters.experience) ||
    Boolean(filters.skill) ||
    Boolean(filters.company);

  return (
    <div className="space-y-4 mb-6">
      {/* Top row: View switcher tabs & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Segmented View Mode Switcher */}
        <div className="inline-flex p-1 rounded-2xl bg-canvas border border-border/80 shadow-2xs">
          <button
            type="button"
            onClick={() => onChangeViewMode("explore")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === "explore"
                ? "bg-surface text-accent shadow-sm border border-border/70"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Job Search & Board</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-accent/10 text-accent font-extrabold">
              {totalJobsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onChangeViewMode("pipeline")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === "pipeline"
                ? "bg-surface text-accent shadow-sm border border-border/70"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Application Pipeline</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold">
              {totalApplicationsCount}
            </span>
          </button>
        </div>

        {/* Reset filters button if active */}
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-medium text-ink-muted hover:text-ink hover:bg-canvas transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Main Search & Filter Inputs Strip */}
      <div className="p-4 rounded-3xl bg-surface border border-border/80 shadow-xs space-y-3">
        {/* Row 1: Search text by Job Title or Keyword */}
        <div className="relative">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search by job title, technical stack, or role requirements (e.g. Software Engineer, Machine Learning)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-canvas border border-border/80 focus:outline-accent text-ink text-xs font-medium placeholder:text-ink-muted/70 shadow-2xs"
          />
        </div>

        {/* Row 2: Four distinct dropdown selectors: Company, Location, Experience, Skills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Company Filter */}
          <div className="relative">
            <select
              value={filters.company}
              onChange={(e) => onFilterChange("company", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-canvas border border-border/80 text-xs font-medium text-ink focus:outline-accent"
            >
              <option value="">All Companies</option>
              {availableCompanies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="relative">
            <select
              value={filters.location}
              onChange={(e) => onFilterChange("location", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-canvas border border-border/80 text-xs font-medium text-ink focus:outline-accent"
            >
              {COMMON_LOCATIONS.map((loc) => (
                <option key={loc} value={loc === "All Locations" ? "" : loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div className="relative">
            <select
              value={filters.experience}
              onChange={(e) => onFilterChange("experience", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-canvas border border-border/80 text-xs font-medium text-ink focus:outline-accent"
            >
              {EXPERIENCE_LEVELS.map((exp) => (
                <option key={exp.value} value={exp.value === "all" ? "" : exp.value}>
                  {exp.label}
                </option>
              ))}
            </select>
          </div>

          {/* Skills Filter */}
          <div className="relative">
            <select
              value={filters.skill}
              onChange={(e) => onFilterChange("skill", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-canvas border border-border/80 text-xs font-medium text-ink focus:outline-accent"
            >
              {COMMON_SKILLS.map((sk) => (
                <option key={sk} value={sk === "All Skills" ? "" : sk}>
                  {sk}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
