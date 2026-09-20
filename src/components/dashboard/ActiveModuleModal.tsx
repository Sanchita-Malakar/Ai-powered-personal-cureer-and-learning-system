"use client";

import React, { useState } from "react";
import { ModuleType } from "@/types/dashboard";
import {
  X,
  Code2,
  FileCheck2,
  Briefcase,
  GraduationCap,
  MessageSquareCode,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Play,
  ArrowRight,
  Send,
  Loader2,
  ShieldCheck,
  ChevronRight,
  BookOpen,
} from "lucide-react";

interface ActiveModuleModalProps {
  activeModule: ModuleType | null;
  onClose: () => void;
  onCompleteTask?: (taskId: string) => void;
}

export const ActiveModuleModal: React.FC<ActiveModuleModalProps> = ({
  activeModule,
  onClose,
  onCompleteTask,
}) => {
  // DSA Module State
  const [dsaSolved, setDsaSolved] = useState<string[]>([]);

  // Resume Module State
  const [resumeRevised, setResumeRevised] = useState(false);

  // Job Module State
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  // Interview Module State
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<string | null>(null);

  if (!activeModule) return null;

  const handleSolveDsa = (id: string) => {
    if (!dsaSolved.includes(id)) {
      setDsaSolved((prev) => [...prev, id]);
      if (onCompleteTask) onCompleteTask("task-1");
    }
  };

  const handleApplyJob = (company: string) => {
    if (!appliedJobs.includes(company)) {
      setAppliedJobs((prev) => [...prev, company]);
      if (onCompleteTask) onCompleteTask("task-4");
    }
  };

  const handleEvaluateInterview = () => {
    if (!interviewAnswer.trim()) return;
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setEvaluationFeedback(
        "Strong structural approach! You correctly identified Token Bucket or Leet-Bucket algorithm for rate limiting. Recommendation: mention Redis distributed locks (Redlock) to ensure multi-instance consistency."
      );
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-ink/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-surface border border-border/90 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-bold">
              {activeModule === "dsa" && <Code2 className="w-5 h-5" />}
              {activeModule === "resume" && <FileCheck2 className="w-5 h-5" />}
              {activeModule === "jobs" && <Briefcase className="w-5 h-5" />}
              {activeModule === "learning" && <GraduationCap className="w-5 h-5" />}
              {activeModule === "interview" && <MessageSquareCode className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                Interactive Career Module
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-ink">
                {activeModule === "dsa" && "DSA Practice Arena"}
                {activeModule === "resume" && "Resume ATS Analyzer & Project Optimizer"}
                {activeModule === "jobs" && "Curated Job Opportunities"}
                {activeModule === "learning" && "Curriculum & Learning Tracks"}
                {activeModule === "interview" && "AI Mock Interview Simulator"}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-canvas transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Module Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* 1. DSA MODULE */}
          {activeModule === "dsa" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-canvas/70 border border-border/80 flex items-center justify-between text-xs">
                <span>
                  Target Goal: <strong>Solve 2 Medium Problems today</strong>
                </span>
                <span className="font-bold text-accent">
                  {dsaSolved.length}/2 Completed
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: "dsa-1",
                    title: "Course Schedule (Cycle Detection in Directed Graphs)",
                    difficulty: "Medium",
                    topic: "Graphs • BFS / Topological Sort",
                    time: "25 min",
                  },
                  {
                    id: "dsa-2",
                    title: "Coin Change (Fewest Coins to Make Up Amount)",
                    difficulty: "Medium",
                    topic: "Dynamic Programming • Bottom-Up",
                    time: "30 min",
                  },
                  {
                    id: "dsa-3",
                    title: "Binary Tree Maximum Path Sum",
                    difficulty: "Hard",
                    topic: "Trees • Post-Order Traversal",
                    time: "40 min",
                  },
                ].map((problem) => {
                  const isDone = dsaSolved.includes(problem.id);

                  return (
                    <div
                      key={problem.id}
                      className="p-4 rounded-2xl bg-canvas/40 border border-border/80 flex items-center justify-between gap-3 hover:border-border transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-ink">{problem.title}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${
                              problem.difficulty === "Medium"
                                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                : "bg-red-500/15 text-red-600 dark:text-red-400"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-ink-muted">{problem.topic} • Est. {problem.time}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSolveDsa(problem.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isDone
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : "bg-accent hover:bg-accent/90 text-white shadow-sm"
                        }`}
                      >
                        {isDone ? "✓ Solved" : "Mark Solved"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. RESUME MODULE */}
          {activeModule === "resume" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-accent/10 to-emerald-500/10 border border-accent/20 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-ink-muted uppercase">
                    Current ATS Score
                  </span>
                  <div className="text-2xl font-extrabold text-ink">88 / 100</div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    Strong Tier-1 Placement Alignment
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
                  88
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
                  High-Impact Project Section Suggestions
                </span>

                <div className="p-3.5 rounded-2xl bg-canvas/60 border border-border/80 text-xs space-y-1.5">
                  <div className="font-semibold text-ink flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-attention" />
                    <span>Quantify Backend Performance & Caching</span>
                  </div>
                  <p className="text-ink-muted leading-relaxed">
                    Change: &quot;Built a task queue with Redis and PostgreSQL&quot; → &quot;Engineered asynchronous queue worker with Redis & PostgreSQL, processing 2,500+ tasks/sec with &lt;10ms dequeue latency.&quot;
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-canvas/60 border border-border/80 text-xs space-y-1.5">
                  <div className="font-semibold text-ink flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-attention" />
                    <span>Add Microservices & Docker Keywords</span>
                  </div>
                  <p className="text-ink-muted leading-relaxed">
                    Stripe and Swiggy job descriptions prioritize containerization and Docker multi-stage builds. Add this keyword to your Project #1 tech stack.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setResumeRevised(true);
                  if (onCompleteTask) onCompleteTask("task-2");
                }}
                className="w-full py-2.5 rounded-xl bg-accent text-white font-bold text-xs shadow-md shadow-accent/20 hover:bg-accent/90 transition-all"
              >
                {resumeRevised ? "✓ Resume Project Section Revised" : "Apply Suggestions & Mark Complete"}
              </button>
            </div>
          )}

          {/* 3. JOBS MODULE */}
          {activeModule === "jobs" && (
            <div className="space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
                Top Matches for Junior Full Stack Engineer
              </span>

              {[
                { company: "Stripe", role: "Junior Full Stack Developer", match: "92%", location: "Bengaluru (Hybrid)", deadline: "48 hours left" },
                { company: "Swiggy", role: "Frontend Engineer (React / Next.js)", match: "89%", location: "Remote / India", deadline: "3 days left" },
                { company: "Razorpay", role: "Associate Backend Developer", match: "85%", location: "Bengaluru, India", deadline: "5 days left" },
              ].map((job) => {
                const applied = appliedJobs.includes(job.company);

                return (
                  <div
                    key={job.company}
                    className="p-4 rounded-2xl bg-canvas/50 border border-border/80 flex items-center justify-between gap-3 hover:border-border transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-ink">{job.company}</span>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          {job.match} Match
                        </span>
                      </div>
                      <p className="text-xs font-medium text-ink">{job.role}</p>
                      <p className="text-[11px] text-ink-muted mt-0.5">{job.location} • {job.deadline}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplyJob(job.company)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        applied
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : "bg-accent hover:bg-accent/90 text-white shadow-sm"
                      }`}
                    >
                      {applied ? "✓ Applied" : "Quick Apply"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. LEARNING MODULE */}
          {activeModule === "learning" && (
            <div className="space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
                Active Career Curriculum Tracks
              </span>

              {[
                { title: "Python Advanced & Async I/O", progress: 88, status: "Strong", desc: "Coroutines, GIL architecture, and FastAPI microservices." },
                { title: "DSA: Graphs, BFS/DFS & Dynamic Programming", progress: 68, status: "In Progress", desc: "Mastering LeetCode mediums for technical screening." },
                { title: "Database Indexing & PostgreSQL Optimizations", progress: 52, status: "Focus Area", desc: "B-Tree, Hash, and execution query plan benchmarking." },
                { title: "Machine Learning & Neural Network Foundations", progress: 42, status: "Beginner", desc: "Tensors, loss backpropagation, and PyTorch basics." },
              ].map((track) => (
                <div key={track.title} className="p-3.5 rounded-2xl bg-canvas/50 border border-border/80">
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="font-bold text-ink">{track.title}</span>
                    <span className="font-semibold text-accent">{track.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-border/60 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${track.progress}%` }} />
                  </div>
                  <p className="text-[11px] text-ink-muted leading-relaxed">{track.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* 5. INTERVIEW MODULE */}
          {activeModule === "interview" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20">
                <span className="text-[10px] font-bold uppercase text-accent tracking-wider block mb-1">
                  Today&apos;s Technical Screen Question
                </span>
                <p className="text-sm font-bold text-ink leading-relaxed">
                  &quot;How would you design a distributed rate limiter for an API handling 10,000 requests per second across multiple container instances?&quot;
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Your Solution Approach
                </label>
                <textarea
                  rows={3}
                  value={interviewAnswer}
                  onChange={(e) => setInterviewAnswer(e.target.value)}
                  placeholder="Outline your chosen algorithm (Token Bucket / Leaky Bucket), caching storage (Redis), and how you prevent race conditions..."
                  className="w-full bg-canvas/70 border border-border/80 text-ink text-xs rounded-xl p-3 focus:outline-none focus:border-accent"
                />
              </div>

              <button
                type="button"
                onClick={handleEvaluateInterview}
                disabled={isEvaluating || !interviewAnswer.trim()}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all disabled:opacity-50"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating with AI Coach...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit for AI Feedback</span>
                  </>
                )}
              </button>

              {evaluationFeedback && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-ink space-y-1 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>AI Evaluation: 85/100</span>
                  </div>
                  <p className="text-ink-muted leading-relaxed">{evaluationFeedback}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between text-xs">
          <span className="text-ink-muted">CareerOS Intelligence Hub</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-canvas hover:bg-canvas/80 text-ink font-semibold border border-border/80 transition-colors"
          >
            Close Module
          </button>
        </div>
      </div>
    </div>
  );
};
