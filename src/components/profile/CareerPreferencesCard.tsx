"use client";

import React from "react";
import { CareerPreferences } from "@/types/onboarding";
import {
  Compass,
  MapPin,
  DollarSign,
  Briefcase,
  Building2,
  Calendar,
  Sparkles,
  Edit3,
} from "lucide-react";

interface CareerPreferencesCardProps {
  preferences: CareerPreferences;
  onEdit: () => void;
}

export const CareerPreferencesCard: React.FC<CareerPreferencesCardProps> = ({
  preferences,
  onEdit,
}) => {
  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 shadow-xs hover:border-border transition-all">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">Career Preferences</h3>
            <p className="text-xs text-ink-muted">
              Compensation brackets, work arrangements, and organizational targets.
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Preferences</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Target Salary */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5 mb-1">
            <DollarSign className="w-3 h-3 text-emerald-500" />
            Target Compensation Bracket
          </span>
          <p className="text-lg font-extrabold text-ink">
            {preferences.targetSalary || "₹12 - ₹18 LPA"}
          </p>
          <span className="text-[11px] text-ink-muted">Standard Tier-1 base + equity</span>
        </div>

        {/* Preferred Locations */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5 mb-1.5">
            <MapPin className="w-3 h-3 text-accent" />
            Preferred Locations
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(preferences.preferredLocations || ["Bengaluru", "Remote"]).map((loc, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-surface border border-border/80 text-xs font-semibold text-ink"
              >
                {loc}
              </span>
            ))}
          </div>
        </div>

        {/* Employment Types */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5 mb-1.5">
            <Briefcase className="w-3 h-3 text-sky-500" />
            Role Types
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(preferences.employmentTypes || ["Full-time", "Intern-to-PPO"]).map((type, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-surface border border-border/80 text-xs font-semibold text-ink"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Preferred Industries */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5 mb-1.5">
            <Building2 className="w-3 h-3 text-purple-500" />
            Target Industries
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(preferences.preferredIndustries || ["AI & DeepTech", "SaaS", "FinTech"]).map((ind, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-surface border border-border/80 text-xs font-semibold text-ink"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>

        {/* Earliest Joining */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5 mb-1">
            <Calendar className="w-3 h-3 text-amber-500" />
            Availability / Joining
          </span>
          <p className="text-sm font-semibold text-ink">
            {preferences.earliestJoining || "Post Graduation (May 2025)"}
          </p>
          <span className="text-[11px] text-ink-muted">Immediate for 6-month spring intern</span>
        </div>

        {/* Dream Companies */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3 h-3 text-accent" />
            Dream Companies
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(preferences.dreamCompanies || ["Stripe", "Microsoft", "Swiggy"]).map((comp, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-xs font-bold text-accent"
              >
                {comp}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
