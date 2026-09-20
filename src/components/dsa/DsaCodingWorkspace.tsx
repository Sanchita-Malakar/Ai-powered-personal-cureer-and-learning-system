"use client";

import React, { useState, useEffect } from "react";
import {
  DsaProblem,
  SupportedLanguage,
  SubmissionResult,
} from "@/types/dsa";
import {
  Code2,
  Play,
  Send,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Lightbulb,
  ArrowLeft,
  ChevronRight,
  Terminal,
  Cpu,
  Layers,
  Award,
  Zap,
} from "lucide-react";

interface DsaCodingWorkspaceProps {
  problem: DsaProblem;
  onBack: () => void;
  onProblemSolved: (problemId: string, result: SubmissionResult) => void;
  onNextProblem?: () => void;
}

export const DsaCodingWorkspace: React.FC<DsaCodingWorkspaceProps> = ({
  problem,
  onBack,
  onProblemSolved,
  onNextProblem,
}) => {
  const [language, setLanguage] = useState<SupportedLanguage>("python");
  const [code, setCode] = useState(problem.starterCode.python);
  const [activeTab, setActiveTab] = useState<"description" | "hints" | "submissions">("description");
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update starter code when language changes
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    setCode(problem.starterCode[newLang] || "");
  };

  const handleResetCode = () => {
    setCode(problem.starterCode[language]);
    setSubmissionResult(null);
  };

  const handleFillSolution = () => {
    if (problem.solutionCode[language]) {
      setCode(problem.solutionCode[language]);
    } else {
      setCode(problem.solutionCode.python);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleHint = (index: number) => {
    if (revealedHints.includes(index)) {
      setRevealedHints(revealedHints.filter((i) => i !== index));
    } else {
      setRevealedHints([...revealedHints, index]);
    }
  };

  // Run Test Cases Simulation
  const handleRunTests = () => {
    setIsRunning(true);
    setSubmissionResult(null);
    setTimeout(() => {
      setIsRunning(false);
      setActiveTab("description");
    }, 600);
  };

  // Submit Solution Simulation
  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      const hasContent = code.length > 50;
      const isAccepted = hasContent; // accepted if candidate entered substantial code

      const result: SubmissionResult = {
        status: isAccepted ? "Accepted" : "Wrong Answer",
        passedCount: isAccepted ? problem.testCases.length : 1,
        totalCount: problem.testCases.length,
        runtimeMs: Math.floor(Math.random() * 25) + 35,
        runtimePercentile: 91.4,
        memoryMb: 16.2,
        memoryPercentile: 85.8,
        testCaseResults: problem.testCases.map((tc, idx) => ({
          testCaseId: tc.id,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: isAccepted ? tc.expectedOutput : "Output mismatch",
          passed: isAccepted ? true : idx === 0,
        })),
        submittedAt: "Just Now",
        feedback: isAccepted
          ? "Optimal time complexity achieved! Solution passed all edge test cases with great space efficiency."
          : "Output mismatch on edge cases. Ensure edge conditions like empty arrays or target bounds are verified.",
      };

      setSubmissionResult(result);
      if (isAccepted) {
        onProblemSolved(problem.id, result);
      }
    }, 1200);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "Medium":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      case "Hard":
        return "text-rose-400 bg-rose-500/10 border-rose-500/30";
      default:
        return "text-slate-400 bg-slate-800 border-slate-700";
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 md:p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {problem.category}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded border ${getDifficultyColor(
                  problem.difficulty
                )}`}
              >
                {problem.difficulty}
              </span>
            </div>
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              {problem.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            {formatTimer(secondsElapsed)}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunTests}
              disabled={isRunning || isSubmitting}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              {isRunning ? "Running..." : "Run Tests"}
            </button>
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting || isRunning}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? "Evaluating..." : "Submit Solution"}
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Problem Description, Hints, & Submissions */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl flex flex-col h-[650px] overflow-hidden">
          {/* Tabs header */}
          <div className="flex items-center border-b border-slate-800 px-3 pt-2 bg-slate-950/40">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition ${
                activeTab === "description"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("hints")}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === "hints"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Hints & Approach
            </button>
            {submissionResult && (
              <button
                onClick={() => setActiveTab("submissions")}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === "submissions"
                    ? "border-indigo-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Performance
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-4 md:p-5 overflow-y-auto flex-1 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 text-slate-300 text-xs leading-relaxed">
            {activeTab === "description" && (
              <div className="space-y-4">
                {/* Statement */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Problem Statement
                  </h4>
                  <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {problem.problemStatement}
                  </p>
                </div>

                {/* Examples */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Examples
                  </h4>
                  {problem.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]"
                    >
                      <div className="text-slate-400">
                        <strong className="text-slate-200">Input:</strong> {ex.input}
                      </div>
                      <div className="text-emerald-400">
                        <strong className="text-slate-200">Output:</strong> {ex.output}
                      </div>
                      {ex.explanation && (
                        <div className="text-slate-400 font-sans text-xs pt-1 border-t border-slate-800/80">
                          {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Constraints
                  </h4>
                  <ul className="space-y-1 list-disc pl-4 text-slate-400 font-mono text-[11px]">
                    {problem.constraints.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "hints" && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <span>
                    Try solving without hints first! Reveal progressively if you get stuck.
                  </span>
                </div>

                {/* Progressive Hints */}
                <div className="space-y-2.5">
                  {problem.hints.map((hint, idx) => {
                    const isRevealed = revealedHints.includes(idx);
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleHint(idx)}
                          className="w-full p-3 text-left font-semibold text-xs text-slate-300 hover:text-white flex items-center justify-between"
                        >
                          <span>Hint {idx + 1}</span>
                          <span className="text-[11px] text-indigo-400">
                            {isRevealed ? "Hide" : "Reveal Hint"}
                          </span>
                        </button>
                        {isRevealed && (
                          <div className="p-3 pt-0 text-xs text-slate-300 border-t border-slate-800/60 bg-slate-900/30">
                            {hint}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Optimal Complexity Benchmark */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Optimal Solution Benchmarks
                  </span>
                  <p className="text-xs text-slate-300">{problem.optimalApproach}</p>
                  <div className="flex items-center gap-4 text-xs font-mono pt-1">
                    <span className="text-emerald-400">
                      Time: <strong>{problem.timeComplexity}</strong>
                    </span>
                    <span className="text-indigo-400">
                      Space: <strong>{problem.spaceComplexity}</strong>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "submissions" && submissionResult && (
              <div className="space-y-4">
                {/* Status Callout */}
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    submissionResult.status === "Accepted"
                      ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
                      : "bg-rose-950/30 border-rose-500/30 text-rose-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {submissionResult.status === "Accepted" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                    )}
                    <div>
                      <div className="text-sm font-bold">
                        {submissionResult.status}
                      </div>
                      <div className="text-xs opacity-80">
                        {submissionResult.passedCount} / {submissionResult.totalCount} Test Cases Passed
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono">{submissionResult.submittedAt}</span>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">
                      Runtime
                    </div>
                    <div className="text-lg font-bold text-white font-mono">
                      {submissionResult.runtimeMs} ms
                    </div>
                    <div className="text-[10px] text-emerald-400">
                      Beats {submissionResult.runtimePercentile}% of submissions
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">
                      Memory
                    </div>
                    <div className="text-lg font-bold text-white font-mono">
                      {submissionResult.memoryMb} MB
                    </div>
                    <div className="text-[10px] text-indigo-400">
                      Beats {submissionResult.memoryPercentile}% of submissions
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  {submissionResult.feedback}
                </p>

                {onNextProblem && (
                  <button
                    onClick={onNextProblem}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
                  >
                    Next Recommended Problem
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Test Runner */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl flex flex-col h-[650px] overflow-hidden">
          {/* Editor Top Bar */}
          <div className="p-2.5 px-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) =>
                  handleLanguageChange(e.target.value as SupportedLanguage)
                }
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="python">Python (3.10)</option>
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="cpp">C++ (g++ 20)</option>
                <option value="java">Java (OpenJDK 17)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFillSolution}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-indigo-300 border border-indigo-500/20 transition flex items-center gap-1"
                title="Populate working solution for rapid evaluation"
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Fill Solution
              </button>
              <button
                onClick={handleResetCode}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                title="Reset code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Monospace Code Editor */}
          <div className="flex-1 bg-slate-950 p-4 font-mono text-xs overflow-auto">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full bg-transparent text-slate-200 focus:outline-none resize-none font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Test Cases Runner Tabs */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] font-semibold uppercase text-slate-400">
                  Test Cases
                </span>
              </div>
              <div className="flex items-center gap-1">
                {problem.testCases.map((tc, idx) => (
                  <button
                    key={tc.id}
                    onClick={() => setActiveTestCaseIndex(idx)}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition ${
                      activeTestCaseIndex === idx
                        ? "bg-indigo-600 text-white font-bold"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Test Case Detail */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] space-y-1">
              <div className="text-slate-400">
                <span className="text-slate-500">Input:</span>{" "}
                {problem.testCases[activeTestCaseIndex]?.input}
              </div>
              <div className="text-emerald-400">
                <span className="text-slate-500">Expected:</span>{" "}
                {problem.testCases[activeTestCaseIndex]?.expectedOutput}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
