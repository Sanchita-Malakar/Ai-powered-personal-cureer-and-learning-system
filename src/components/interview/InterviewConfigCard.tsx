"use client";

import React, { useState } from "react";
import {
  InterviewCategory,
  TechnicalTopic,
  BehavioralTopic,
  InterviewDifficulty,
  InterviewConfig,
} from "@/types/interview";
import {
  MessageSquareCode,
  Sparkles,
  Building2,
  Brain,
  Code2,
  Database,
  Terminal,
  UserCheck,
  Award,
  Users,
  AlertTriangle,
  Play,
  Zap,
} from "lucide-react";

interface InterviewConfigCardProps {
  onStartInterview: (config: InterviewConfig) => void;
  isStarting?: boolean;
}

const ROLES = [
  "AI/ML Engineer",
  "Junior Full-Stack Developer",
  "Backend Software Engineer",
  "Data Scientist",
];

const COMPANIES = [
  { id: "tier-1", label: "Tier-1 Tech (Google, Stripe, Microsoft)" },
  { id: "startup", label: "High-Growth Startup (Swiggy, Razorpay, CRED)" },
  { id: "enterprise", label: "Enterprise Product (Atlassian, Oracle)" },
  { id: "campus", label: "Campus Placement General Technical" },
];

export const InterviewConfigCard: React.FC<InterviewConfigCardProps> = ({
  onStartInterview,
  isStarting,
}) => {
  const [targetRole, setTargetRole] = useState(ROLES[0]);
  const [companyType, setCompanyType] = useState(COMPANIES[0].label);
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>("medium");
  const [category, setCategory] = useState<InterviewCategory>("technical");
  const [techTopic, setTechTopic] = useState<TechnicalTopic>("python");
  const [behTopic, setBehTopic] = useState<BehavioralTopic>("intro");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartInterview({
      targetRole,
      companyType,
      difficulty,
      category,
      topic: category === "technical" ? techTopic : behTopic,
      questionCount: 3,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 sm:p-7 rounded-3xl bg-surface border border-border/80 shadow-xs mb-6 space-y-6 animate-in fade-in duration-200"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-accent/10 text-accent border border-accent/20">
              <MessageSquareCode className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Interview Simulator Setup
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
            Configure Your Mock Interview
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Select your target role, difficulty, and interview category. The AI will ask questions one by one and evaluate your accuracy, structure, clarity, and technical depth.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-ink-muted shrink-0">
          <span className="px-3 py-1 rounded-xl bg-canvas border border-border font-semibold">
            3 Questions • ~10 mins
          </span>
        </div>
      </div>

      {/* Row 1: Target Role & Company Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
            Target Role
          </label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-canvas border border-border/80 text-xs font-bold text-ink focus:outline-accent"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wider">
            Company / Interview Standard
          </label>
          <select
            value={companyType}
            onChange={(e) => setCompanyType(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-canvas border border-border/80 text-xs font-bold text-ink focus:outline-accent"
          >
            {COMPANIES.map((c) => (
              <option key={c.id} value={c.label}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Difficulty Level */}
      <div>
        <label className="block text-xs font-bold text-ink mb-2 uppercase tracking-wider">
          Difficulty Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(["easy", "medium", "hard"] as InterviewDifficulty[]).map((lvl) => {
            const isSelected = difficulty === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => setDifficulty(lvl)}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-bold capitalize transition-all text-center flex items-center justify-center gap-2 ${
                  isSelected
                    ? "bg-accent text-white border-accent shadow-sm shadow-accent/20"
                    : "bg-canvas/40 border-border text-ink hover:bg-canvas"
                }`}
              >
                <span>{lvl}</span>
                {lvl === "hard" && <Zap className="w-3 h-3 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 3: Category Switcher (Technical vs Behavioral) */}
      <div className="space-y-3 pt-2">
        <label className="block text-xs font-bold text-ink uppercase tracking-wider">
          Interview Category
        </label>

        <div className="inline-flex p-1 rounded-2xl bg-canvas border border-border/80 shadow-2xs mb-2">
          <button
            type="button"
            onClick={() => setCategory("technical")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              category === "technical"
                ? "bg-surface text-accent shadow-sm border border-border/70"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Technical Round</span>
          </button>

          <button
            type="button"
            onClick={() => setCategory("behavioral")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              category === "behavioral"
                ? "bg-surface text-accent shadow-sm border border-border/70"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Behavioral Round</span>
          </button>
        </div>

        {/* Technical Sub-topics: Python, DSA, DBMS, ML */}
        {category === "technical" ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "python" as TechnicalTopic, label: "Python", icon: Terminal, desc: "GIL, Decorators, Generators" },
              { id: "dsa" as TechnicalTopic, label: "DSA", icon: Code2, desc: "Prefix Sum, Graphs, LRU Cache" },
              { id: "dbms" as TechnicalTopic, label: "DBMS", icon: Database, desc: "B+ Indexes, ACID, 3NF Normalization" },
              { id: "ml" as TechnicalTopic, label: "ML", icon: Brain, desc: "Regularization, Backprop, Attention" },
            ].map((topic) => {
              const isSelected = techTopic === topic.id;
              const Icon = topic.icon;
              return (
                <div
                  key={topic.id}
                  onClick={() => setTechTopic(topic.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-accent bg-accent/10 shadow-sm shadow-accent/10"
                      : "border-border/80 bg-canvas/40 hover:bg-canvas hover:border-border"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? "bg-accent text-white"
                          : "bg-surface border border-border text-ink-muted"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-ink">{topic.label}</span>
                  </div>
                  <p className="text-[10px] text-ink-muted leading-relaxed">
                    {topic.desc}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          /* Behavioral Sub-topics: Tell me about yourself, Strengths/weaknesses, Leadership, Conflict */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: "intro" as BehavioralTopic, label: "Tell me about yourself", icon: UserCheck, desc: "Elevator pitch, projects & goals" },
              { id: "strengths_weaknesses" as BehavioralTopic, label: "Strengths / Weaknesses", icon: Award, desc: "Authentic self-awareness & growth" },
              { id: "leadership" as BehavioralTopic, label: "Leadership", icon: Users, desc: "Driving team decisions under deadlines" },
              { id: "conflict" as BehavioralTopic, label: "Conflict", icon: AlertTriangle, desc: "Resolving technical disagreements" },
            ].map((topic) => {
              const isSelected = behTopic === topic.id;
              const Icon = topic.icon;
              return (
                <div
                  key={topic.id}
                  onClick={() => setBehTopic(topic.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-accent bg-accent/10 shadow-sm shadow-accent/10"
                      : "border-border/80 bg-canvas/40 hover:bg-canvas hover:border-border"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? "bg-accent text-white"
                          : "bg-surface border border-border text-ink-muted"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-ink leading-tight">{topic.label}</span>
                  </div>
                  <p className="text-[10px] text-ink-muted leading-relaxed">
                    {topic.desc}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit Action */}
      <div className="pt-4 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-ink-muted">
          AI Interviewer is ready to conduct your session.
        </span>

        <button
          type="submit"
          disabled={isStarting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white font-bold text-xs hover:bg-accent/90 shadow-md shadow-accent/25 transition-all active:scale-95 disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>{isStarting ? "Initializing Session..." : "Start Interview Simulation"}</span>
        </button>
      </div>
    </form>
  );
};
