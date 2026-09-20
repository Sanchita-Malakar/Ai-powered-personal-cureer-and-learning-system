"use client";

import React from "react";
import { CareerGoals } from "@/types/onboarding";
import {
  Target,
  Clock,
  Code2,
  Sparkles,
  Compass,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface CareerGoalsStepProps {
  data: CareerGoals;
  onChange: (updates: Partial<CareerGoals>) => void;
  errors: Record<string, string>;
}

const STUDY_HOURS_OPTIONS = [
  { id: "5-10 hours/week", label: "5-10 hrs/week", desc: "Light revision & 1 problem/day" },
  { id: "10-15 hours/week", label: "10-15 hrs/week", desc: "Steady prep + active project work" },
  { id: "15-20 hours/week", label: "15-20 hrs/week", desc: "Intensive placement preparation" },
  { id: "20+ hours/week", label: "20+ hrs/week", desc: "Full-time sprint for Tier-1 firms" },
];

const FOCUS_AREAS = [
  "Mastering LeetCode Mediums (Graphs & DP)",
  "Full-Stack Production Projects with Scalable APIs",
  "High-Level System Design & Microservices",
  "Cracking Live Technical & Behavioral Mock Interviews",
  "Cloud Infrastructure, Docker & DevOps Pipelines",
  "AI Agents, LLM Integrations & Vector DBs",
];

const EXAMPLE_STATEMENTS = [
  "To land an SDE-1 role at a high-growth product company where I can build reliable distributed backend services.",
  "Aiming for an AI/ML Engineer position to deploy production LLM pipelines and intelligent agent architectures.",
  "Securing a Frontend Engineer role at a design-driven tech firm building responsive, high-performance web applications.",
];

export const CareerGoalsStep: React.FC<CareerGoalsStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="border-b border-border/70 pb-4">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-1">
          <Target className="w-3.5 h-3.5" />
          <span>Step 6 • Vision, Commitment & Coding Track</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-ink">
          Career Vision & Weekly Commitment
        </h3>
        <p className="text-sm text-ink-muted mt-1">
          CareerOS constructs your daily AI learning plans and roadmap milestones based on your available study bandwidth and primary targets.
        </p>
      </div>

      {/* Primary Objective / Statement */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[13px] font-semibold text-ink" htmlFor="objective">
            Primary Career Goal / Objective Statement <span className="text-action">*</span>
          </label>
          <span className="text-xs text-ink-muted">Elevator pitch</span>
        </div>

        <textarea
          id="objective"
          rows={3}
          placeholder="e.g. Aiming to secure an SDE-1 role in a high-growth product company building scalable microservices and resilient cloud architectures..."
          value={data.primaryObjective}
          onChange={(e) => onChange({ primaryObjective: e.target.value })}
          className={`w-full bg-canvas/70 border text-ink placeholder:text-ink-muted/60 text-sm rounded-xl p-3.5 focus:outline-none focus:bg-surface focus:shadow-sm transition-all leading-relaxed ${
            errors.primaryObjective ? "border-action focus:border-action" : "border-border/80 focus:border-accent"
          }`}
        />
        {errors.primaryObjective && (
          <p className="text-xs text-action mt-1">{errors.primaryObjective}</p>
        )}

        {/* Quick Example Pills */}
        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-ink-muted flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-ai" />
            <span>Quick inspiration:</span>
          </span>
          {EXAMPLE_STATEMENTS.map((stmt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange({ primaryObjective: stmt })}
              className="text-[11px] text-ink-muted hover:text-accent bg-canvas hover:bg-accent/10 border border-border/70 rounded-lg px-2 py-0.5 transition-all text-left truncate max-w-xs"
            >
              &quot;{stmt.slice(0, 42)}...&quot;
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Study Hours Commitment */}
      <div>
        <label className="block text-[13px] font-semibold text-ink mb-2">
          Weekly Study & Upskilling Commitment <span className="text-action">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {STUDY_HOURS_OPTIONS.map((opt) => {
            const isSelected = data.weeklyStudyHours === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ weeklyStudyHours: opt.id })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-accent/10 border-accent text-accent shadow-sm"
                    : "bg-canvas/60 border-border/80 text-ink hover:bg-canvas"
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs">
                  <span>{opt.label}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-accent" />}
                </div>
                <span className="text-[11px] text-ink-muted block mt-1 leading-tight">
                  {opt.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Immediate Focus Area */}
      <div>
        <label className="block text-[13px] font-semibold text-ink mb-2">
          Top Focus Area / Current Bottleneck
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FOCUS_AREAS.map((area) => {
            const isSelected = data.topFocusArea === area;
            return (
              <button
                key={area}
                type="button"
                onClick={() => onChange({ topFocusArea: area })}
                className={`p-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                  isSelected
                    ? "bg-ai/10 border-ai text-ai font-semibold shadow-xs"
                    : "bg-canvas/60 border-border/80 text-ink hover:bg-canvas"
                }`}
              >
                <span>{area}</span>
                {isSelected && <Zap className="w-3.5 h-3.5 text-ai shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Competitive Programming & Coding Track (Ideal Student Addition) */}
      <div className="pt-3 border-t border-border/60">
        <h4 className="text-sm font-bold text-ink flex items-center gap-2 mb-1">
          <Code2 className="w-4 h-4 text-accent" />
          <span>DSA & Competitive Coding Track</span>
        </h4>
        <p className="text-xs text-ink-muted mb-3">
          Include your coding handles to benchmark your algorithmic problem-solving readiness against target companies.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1" htmlFor="leetcode">
              LeetCode / Codeforces Handle
            </label>
            <input
              id="leetcode"
              type="text"
              placeholder="e.g. alex_rivera"
              value={data.leetcodeHandle || ""}
              onChange={(e) => onChange({ leetcodeHandle: e.target.value })}
              className="w-full bg-canvas/70 border border-border/80 text-ink text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1" htmlFor="solvedCount">
              Approximate Problems Solved (DSA)
            </label>
            <input
              id="solvedCount"
              type="text"
              placeholder="e.g. 250+ (Easy/Medium)"
              value={data.problemsSolvedCount || ""}
              onChange={(e) => onChange({ problemsSolvedCount: e.target.value })}
              className="w-full bg-canvas/70 border border-border/80 text-ink text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
