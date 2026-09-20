"use client";

import React from "react";
import { PrivacySettings } from "@/types/settings";
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  Search,
  Users,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface PrivacySettingsCardProps {
  privacy: PrivacySettings;
  onUpdate: (updated: Partial<PrivacySettings>) => void;
}

export const PrivacySettingsCard: React.FC<PrivacySettingsCardProps> = ({
  privacy,
  onUpdate,
}) => {
  const modes = [
    {
      id: "public" as const,
      label: "Public Placement Profile",
      desc: "Searchable by verified recruiters across all tech partners & startup networks.",
      icon: Eye,
      color: "text-emerald-500",
    },
    {
      id: "campus_only" as const,
      label: "Campus Drives Only",
      desc: "Restricted strictly to authorized placement drives coordinated by your university cell.",
      icon: Lock,
      color: "text-accent",
    },
    {
      id: "incognito" as const,
      label: "Incognito / Applied Only",
      desc: "Your profile is completely hidden until you explicitly submit an application to a role.",
      icon: EyeOff,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-border/80">
        <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center border border-accent/20">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">Privacy & Recruiter Visibility</h2>
          <p className="text-xs text-ink-muted">
            Control how recruiters discover your resume, anonymized benchmarking, and message requests.
          </p>
        </div>
      </div>

      {/* Visibility Mode Selector */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-ink block">
          Profile Visibility Mode:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = privacy.visibilityMode === mode.id;

            return (
              <div
                key={mode.id}
                onClick={() => onUpdate({ visibilityMode: mode.id })}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-accent/10 border-accent text-ink shadow-xs"
                    : "bg-canvas/70 border-border/70 hover:border-border"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${mode.color}`} />
                    <input
                      type="radio"
                      name="visibilityMode"
                      checked={isSelected}
                      onChange={() => onUpdate({ visibilityMode: mode.id })}
                      className="accent-accent"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-ink mb-1">{mode.label}</h4>
                  <p className="text-[11px] text-ink-muted leading-relaxed">
                    {mode.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Specific Privacy Toggles */}
      <div className="space-y-3 pt-2">
        {/* Recruiter Searchable */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/70 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center mt-0.5">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink">
                ATS Recruiter Search Discovery
              </h4>
              <p className="text-xs text-ink-muted">
                Allow company hiring managers to find your resume when filtering by verified skills (e.g. Python, Docker).
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={privacy.recruiterSearchable}
              onChange={(e) => onUpdate({ recruiterSearchable: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>

        {/* Anonymized Benchmarking */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/70 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink">
                Anonymized Peer Cohort Benchmarking
              </h4>
              <p className="text-xs text-ink-muted">
                Contribute anonymized test scores to generate accurate percentile curves across college engineering peers.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={privacy.anonymizedBenchmarking}
              onChange={(e) => onUpdate({ anonymizedBenchmarking: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>

        {/* Recruiter Direct Messages */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/70 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mt-0.5">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink">
                Direct Recruiter InMail Outreach
              </h4>
              <p className="text-xs text-ink-muted">
                Permit talent acquisition leads to message you directly about priority interview fast-tracks.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={privacy.allowRecruiterDirectMessages}
              onChange={(e) => onUpdate({ allowRecruiterDirectMessages: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
