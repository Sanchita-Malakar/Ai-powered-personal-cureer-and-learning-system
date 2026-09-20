"use client";

import React from "react";
import Link from "next/link";
import {
  Route,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  Filter,
  CheckCircle2,
  Clock,
  Target,
} from "lucide-react";

interface RoadmapHeaderProps {
  selectedRole: string;
  onSelectRole: (roleId: string) => void;
  availableRoles: { id: string; title: string }[];
  overallProgress: number;
  completedMilestonesCount: number;
  totalMilestonesCount: number;
  statusFilter: "all" | "current" | "completed" | "upcoming";
  onSelectFilter: (filter: "all" | "current" | "completed" | "upcoming") => void;
  onOpenRecalibrate: () => void;
}

export const RoadmapHeader: React.FC<RoadmapHeaderProps> = ({
  selectedRole,
  onSelectRole,
  availableRoles,
  overallProgress,
  completedMilestonesCount,
  totalMilestonesCount,
  statusFilter,
  onSelectFilter,
  onOpenRecalibrate,
}) => {
  return (
    <header className="mb-6 space-y-4 animate-in fade-in duration-200">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-ink font-bold">Career Roadmap</span>
        </Link>

        {/* AI Recalibration CTA */}
        <button
          type="button"
          onClick={onOpenRecalibrate}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-ai/10 hover:bg-ai/20 text-ai text-xs font-bold border border-ai/30 shadow-xs transition-all hover:scale-102 active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Recalibrate with AI</span>
        </button>
      </div>

      {/* Main Title & Role Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-surface border border-border/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent px-2 py-0.2 rounded-md bg-accent/10 border border-accent/20">
              Interactive Execution Pipeline
            </span>
            <span className="text-xs text-ink-muted hidden sm:inline">•</span>
            <span className="text-xs text-ink-muted hidden sm:inline">
              Customized for Campus Placements 2025
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Target:
            </h1>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => onSelectRole(e.target.value)}
                className="bg-accent/10 border border-accent/30 text-accent font-bold text-lg sm:text-2xl rounded-2xl pl-3.5 pr-8 py-1 focus:outline-none cursor-pointer appearance-none shadow-xs"
              >
                {availableRoles.map((r) => (
                  <option key={r.id} value={r.id} className="text-ink text-sm font-semibold">
                    {r.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-accent absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Overall Completion Gauge */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border/70 pt-3 md:pt-0 md:pl-5">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-ink">
                {overallProgress}%
              </span>
              <span className="text-xs text-ink-muted font-medium">Roadmap Complete</span>
            </div>

            <div className="w-40 sm:w-48 h-2 bg-canvas border border-border/70 rounded-full overflow-hidden mt-1.5 p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-accent to-ai rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>

            <span className="text-[11px] text-ink-muted mt-1 block">
              {completedMilestonesCount} of {totalMilestonesCount} Milestones Reached
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: "all", label: "All Milestones" },
          { id: "current", label: "Current Focus" },
          { id: "completed", label: "Completed" },
          { id: "upcoming", label: "Upcoming" },
        ].map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-accent text-white border-accent shadow-xs"
                  : "bg-surface border-border/80 text-ink-muted hover:text-ink hover:bg-canvas"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
