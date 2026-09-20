"use client";

import React, { useState } from "react";
import { CareerPreferencesSettings } from "@/types/settings";
import {
  Compass,
  DollarSign,
  MapPin,
  Briefcase,
  Calendar,
  Check,
  Building2,
} from "lucide-react";

interface CareerPreferencesSettingsCardProps {
  career: CareerPreferencesSettings;
  onUpdate: (updated: Partial<CareerPreferencesSettings>) => void;
}

export const CareerPreferencesSettingsCard: React.FC<CareerPreferencesSettingsCardProps> = ({
  career,
  onUpdate,
}) => {
  const [primaryRole, setPrimaryRole] = useState(career.primaryRole);
  const [minSalary, setMinSalary] = useState(career.minSalaryLpa);
  const [relocation, setRelocation] = useState(career.openToRelocation);
  const [joining, setJoining] = useState(career.earliestJoining);
  const [isSaved, setIsSaved] = useState(false);

  const availableLocations = ["Bengaluru", "Remote", "Hyderabad", "Pune", "Mumbai", "Gurugram / NCR"];

  const toggleLocation = (loc: string) => {
    const current = career.preferredLocations || [];
    const updated = current.includes(loc)
      ? current.filter((l) => l !== loc)
      : [...current, loc];
    onUpdate({ preferredLocations: updated });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      primaryRole,
      minSalaryLpa: Number(minSalary),
      openToRelocation: relocation,
      earliestJoining: joining,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1500);
  };

  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-border/80">
        <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center border border-accent/20">
          <Compass className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">Career Preferences & Search Criteria</h2>
          <p className="text-xs text-ink-muted">
            Configure matching filters for curated roles, compensation floors, and location readiness.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Target Roles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
              Primary Career Objective
            </label>
            <input
              type="text"
              value={primaryRole}
              onChange={(e) => setPrimaryRole(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent font-semibold"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
              Minimum Compensation Target
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="3"
                  max="50"
                  value={minSalary}
                  onChange={(e) => setMinSalary(Number(e.target.value))}
                  className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>
              <span className="text-xs font-bold text-ink">LPA (₹ Lakhs/yr)</span>
            </div>
          </div>
        </div>

        {/* Relocation Toggle */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink">
                Open to Relocation for On-site Roles
              </h4>
              <p className="text-[11px] text-ink-muted">
                Allow recruiters outside your hometown to recommend hybrid and on-site engineering roles.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={relocation}
              onChange={(e) => setRelocation(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>

        {/* Locations Grid */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-2">
            Target Job Locations:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {availableLocations.map((loc) => {
              const isSelected = (career.preferredLocations || []).includes(loc);
              return (
                <button
                  type="button"
                  key={loc}
                  onClick={() => toggleLocation(loc)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? "bg-accent/10 border-accent text-accent"
                      : "bg-canvas border-border/70 text-ink-muted hover:text-ink hover:border-border"
                  }`}
                >
                  <span>{loc}</span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Earliest Joining */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
            Earliest Joining Availability
          </label>
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={joining}
              onChange={(e) => setJoining(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-border/70 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Update Career Preferences</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
