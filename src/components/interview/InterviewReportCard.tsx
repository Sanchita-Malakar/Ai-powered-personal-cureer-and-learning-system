"use client";

import React, { useState } from "react";
import { InterviewReportData, InterviewQuestion } from "@/types/interview";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Brain,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Target,
  FileCheck2,
  Layers,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface InterviewReportCardProps {
  report: InterviewReportData;
  onRetake: () => void;
  onNewInterview: () => void;
  onBackToDashboard?: () => void;
  onApplyProgress?: () => void;
}

export const InterviewReportCard: React.FC<InterviewReportCardProps> = ({
  report,
  onRetake,
  onNewInterview,
  onBackToDashboard,
  onApplyProgress,
}) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    report.weakestQuestion?.id || (report.questionsAnswered[0]?.id ?? null)
  );
  const [progressApplied, setProgressApplied] = useState(false);

  const handleApply = () => {
    setProgressApplied(true);
    if (onApplyProgress) {
      onApplyProgress();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 65) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-rose-400 border-rose-500/30 bg-rose-500/10";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-emerald-500 to-teal-400";
    if (score >= 65) return "bg-gradient-to-r from-amber-500 to-yellow-400";
    return "bg-gradient-to-r from-rose-500 to-red-400";
  };

  const dimensionsList = [
    { key: "accuracy", label: "Accuracy", value: report.dimensionAverages.accuracy, desc: "Factual and conceptual correctness" },
    { key: "relevance", label: "Relevance", value: report.dimensionAverages.relevance, desc: "Direct alignment with prompt scope" },
    { key: "clarity", label: "Clarity", value: report.dimensionAverages.clarity, desc: "Concise and understandable communication" },
    { key: "structure", label: "Structure", value: report.dimensionAverages.structure, desc: "Logical flow & STAR framing" },
    { key: "confidence", label: "Confidence", value: report.dimensionAverages.confidence, desc: "Assertive tone & decisive technical stance" },
    { key: "technicalDepth", label: "Technical Depth", value: report.dimensionAverages.technicalDepth, desc: "Edge cases, Big-O, and systems trade-offs" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-slate-900/90 via-indigo-950/40 to-slate-900/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              AI Evaluation Complete & Verified
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              Interview Performance Report
            </h1>
            <p className="text-sm text-slate-300 flex flex-wrap items-center gap-2">
              <span className="font-medium text-indigo-300">{report.targetRole}</span>
              <span>•</span>
              <span className="text-slate-400">{report.companyType}</span>
              <span>•</span>
              <span className="capitalize px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700">
                {report.difficulty} {report.category}
              </span>
              <span>•</span>
              <span className="text-slate-400">{report.completedAt}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onRetake}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Same Session
            </button>
            <button
              onClick={onNewInterview}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition"
            >
              <Zap className="w-4 h-4 text-indigo-200" />
              New Topic Simulation
            </button>
          </div>
        </div>
      </div>

      {/* Primary Metrics: Overall Score & 6 Dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Score Card */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between backdrop-blur-xl relative">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Overall Readiness
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                {report.overallScore >= 80 ? "Hire Ready" : report.overallScore >= 65 ? "Near Ready" : "Needs Practice"}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black tracking-tight text-white">
                {report.overallScore}
              </span>
              <span className="text-xl font-bold text-slate-500">/ 100</span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {report.overallScore >= 80
                ? "Outstanding delivery. Your architectural grounding and clarity closely match what top-tier engineering bars expect."
                : report.overallScore >= 65
                ? "Solid foundational understanding. Refining communication structure and Big-O guarantees will push this into offer territory."
                : "Good start. Focus on reviewing core definitions and practicing the STAR framework for clear, structured answers."}
            </p>

            {/* Progress Boost Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-indigo-950/30 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-300">
                    +{report.progressBoost}% Career Readiness
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Updates your overall dashboard progress
                  </div>
                </div>
              </div>
              <button
                onClick={handleApply}
                disabled={progressApplied}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  progressApplied
                    ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default"
                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                }`}
              >
                {progressApplied ? "Applied ✓" : "Sync Profile"}
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Evaluated by AI Staff Screener</span>
            <span className="text-slate-500 font-mono text-[11px]">{report.sessionId}</span>
          </div>
        </div>

        {/* 6 Core Evaluation Dimensions */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                6-Dimension Interview Evaluation
              </h2>
              <p className="text-xs text-slate-400">
                Rubric calibrated against FAANG & high-growth startup screening guidelines
              </p>
            </div>
            <span className="text-xs text-slate-400">Target: ≥ 80%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dimensionsList.map((dim) => (
              <div
                key={dim.key}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-slate-200">{dim.label}</span>
                  <span className={`text-sm font-mono font-bold ${getScoreColor(dim.value)}`}>
                    {dim.value}%
                  </span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2 mb-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${getScoreBarColor(dim.value)}`}
                    style={{ width: `${dim.value}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{dim.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strong Areas & Weak Areas Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Areas */}
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/10 to-slate-900/90 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2.5 mb-4 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Key Strengths Demonstrated</h3>
          </div>
          <ul className="space-y-2.5">
            {report.strongAreas.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weak Areas */}
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-950/10 to-slate-900/90 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2.5 mb-4 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Areas for Targeted Growth</h3>
          </div>
          <ul className="space-y-2.5">
            {report.weakAreas.map((weakness, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Focus Breakdown: Questions Answered Poorly & Model Answer */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 md:p-7 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Questions Review & Model Solutions
            </h3>
            <p className="text-xs text-slate-400">
              Compare your answer against the benchmark Model Answer written by Staff Engineers.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {report.questionsAnswered.length} Questions Answered
          </span>
        </div>

        <div className="space-y-4">
          {report.questionsAnswered.map((q, idx) => {
            const isExpanded = expandedQuestionId === q.id;
            const isWeakest = report.weakestQuestion?.id === q.id;
            const evalScore = q.evaluation?.overallScore ?? 75;

            return (
              <div
                key={q.id}
                className={`rounded-xl border transition overflow-hidden ${
                  isWeakest
                    ? "border-amber-500/40 bg-slate-950/70 shadow-lg shadow-amber-950/20"
                    : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                }`}
              >
                {/* Header item */}
                <div
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="p-4 md:p-5 flex items-start md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 md:mt-0 ${
                        isWeakest
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      Q{idx + 1}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {q.topic}
                        </span>
                        {isWeakest && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300">
                            Needs Greatest Revision
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-200 line-clamp-2">
                        {q.question}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className={`text-sm font-mono font-bold ${getScoreColor(evalScore)}`}>
                        {evalScore}%
                      </span>
                      <div className="text-[10px] text-slate-500">Score</div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details: Student vs Model Answer */}
                {isExpanded && (
                  <div className="px-4 md:px-6 pb-6 pt-2 border-t border-slate-800/80 space-y-5 bg-slate-900/50">
                    {/* Feedback Pill */}
                    {q.evaluation?.feedback && (
                      <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 shrink-0 text-indigo-400" />
                        <span>{q.evaluation.feedback}</span>
                      </div>
                    )}

                    {/* Student Answer */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <span>Your Response</span>
                        <span className="text-slate-500 font-mono text-[11px]">Candidate Submission</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                        {q.studentAnswer || "No answer recorded."}
                      </div>
                    </div>

                    {/* Model Answer (Staff Engineer Benchmark) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Staff Engineer Benchmark Model Answer
                        </span>
                        <span className="text-emerald-500/70 font-mono text-[11px]">Ideal 100% Bar</span>
                      </div>
                      <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-100/90 leading-relaxed whitespace-pre-wrap">
                        {q.modelAnswer}
                      </div>
                    </div>

                    {/* Key Evaluation Criteria Checkpoints */}
                    {q.keyCriteria && q.keyCriteria.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-400">
                          Key Concepts Looked For:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {q.keyCriteria.map((crit, cIdx) => (
                            <div
                              key={cIdx}
                              className="text-[11px] p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300 flex items-start gap-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{crit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Improvement Action Plan */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 via-slate-900 to-indigo-950/30 p-6 md:p-7 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Actionable Recommendations</h3>
            <p className="text-xs text-slate-400">High-yield adjustments for your next interview loop</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.improvementSuggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Recommendation #{idx + 1}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1.5"
          >
            ← Return to Dashboard Overview
          </button>
        )}

        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={onRetake}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Interview
          </button>
          <button
            onClick={onNewInterview}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
          >
            Start Another Simulation
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
