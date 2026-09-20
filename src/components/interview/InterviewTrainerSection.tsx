"use client";

import React, { useState, useEffect } from "react";
import {
  InterviewConfig,
  InterviewQuestion,
  InterviewReportData,
  EvaluationDimensions,
} from "@/types/interview";
import {
  INTERVIEW_QUESTIONS_BANK,
  INITIAL_INTERVIEW_REPORT,
} from "@/data/mockInterviewData";
import { InterviewConfigCard } from "./InterviewConfigCard";
import { InterviewRoom } from "./InterviewRoom";
import { InterviewReportCard } from "./InterviewReportCard";
import {
  MessageSquareCode,
  Sparkles,
  ArrowLeft,
  History,
  TrendingUp,
  Brain,
  Zap,
  CheckCircle2,
  Calendar,
  Award,
} from "lucide-react";

interface InterviewTrainerSectionProps {
  onBackToDashboard?: () => void;
  onNavigateToRoadmap?: () => void;
}

export const InterviewTrainerSection: React.FC<InterviewTrainerSectionProps> = ({
  onBackToDashboard,
  onNavigateToRoadmap,
}) => {
  const [viewState, setViewState] = useState<"config" | "room" | "report">("config");
  const [currentConfig, setCurrentConfig] = useState<InterviewConfig | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<InterviewQuestion[]>([]);
  const [currentReport, setCurrentReport] = useState<InterviewReportData | null>(null);
  const [sessionHistory, setSessionHistory] = useState<InterviewReportData[]>([
    INITIAL_INTERVIEW_REPORT,
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load past interview history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("career_os_interview_sessions");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessionHistory(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Launch interview session
  const handleStartInterview = (config: InterviewConfig) => {
    setCurrentConfig(config);

    // Filter questions matching category and topic
    let filtered = INTERVIEW_QUESTIONS_BANK.filter(
      (q) => q.topic === config.topic
    );

    // If none found for topic, match category
    if (filtered.length === 0) {
      filtered = INTERVIEW_QUESTIONS_BANK.filter(
        (q) => q.category === config.category
      );
    }

    // Fallback if still empty
    if (filtered.length === 0) {
      filtered = INTERVIEW_QUESTIONS_BANK.slice(0, 3);
    }

    // Limit to question count
    const sessionQuestions = filtered.slice(0, config.questionCount);
    setActiveQuestions(sessionQuestions);
    setViewState("room");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Completed session from InterviewRoom
  const handleCompleteSession = (answeredQuestions: InterviewQuestion[]) => {
    if (!currentConfig) return;

    // Calculate dimension averages
    const sumDimensions: EvaluationDimensions = {
      accuracy: 0,
      relevance: 0,
      clarity: 0,
      structure: 0,
      confidence: 0,
      technicalDepth: 0,
    };

    let totalScoreSum = 0;
    let weakest = answeredQuestions[0];
    let minScore = 999;

    answeredQuestions.forEach((q) => {
      const ev = q.evaluation;
      if (ev) {
        sumDimensions.accuracy += ev.dimensions.accuracy;
        sumDimensions.relevance += ev.dimensions.relevance;
        sumDimensions.clarity += ev.dimensions.clarity;
        sumDimensions.structure += ev.dimensions.structure;
        sumDimensions.confidence += ev.dimensions.confidence;
        sumDimensions.technicalDepth += ev.dimensions.technicalDepth;
        totalScoreSum += ev.overallScore;

        if (ev.overallScore < minScore) {
          minScore = ev.overallScore;
          weakest = q;
        }
      }
    });

    const count = answeredQuestions.length || 1;
    const avgDims: EvaluationDimensions = {
      accuracy: Math.round(sumDimensions.accuracy / count),
      relevance: Math.round(sumDimensions.relevance / count),
      clarity: Math.round(sumDimensions.clarity / count),
      structure: Math.round(sumDimensions.structure / count),
      confidence: Math.round(sumDimensions.confidence / count),
      technicalDepth: Math.round(sumDimensions.technicalDepth / count),
    };

    const overallScore = Math.round(totalScoreSum / count);

    // Extract strong & weak points
    const strongList: string[] = [];
    const weakList: string[] = [];

    answeredQuestions.forEach((q) => {
      if (q.evaluation?.strongPoints) {
        strongList.push(...q.evaluation.strongPoints);
      }
      if (q.evaluation?.improvementPoints) {
        weakList.push(...q.evaluation.improvementPoints);
      }
    });

    if (strongList.length === 0) {
      strongList.push(
        "Demonstrated solid core engineering vocabulary and relevant technical concepts.",
        "Maintained professional, articulate communication throughout."
      );
    }
    if (weakList.length === 0) {
      weakList.push(
        "Could provide deeper mathematical or Big-O space trade-off analysis.",
        "Consider using explicit STAR (Situation, Task, Action, Result) signposting."
      );
    }

    const suggestions: string[] = [
      avgDims.accuracy < 80
        ? "Review foundational definitions and ensure precision before diving into code or implementation examples."
        : "Excellent technical accuracy. Keep refining multi-tiered system design scenarios.",
      avgDims.structure < 80
        ? "Adopt the STAR framework for behavioral questions and the 'Clarify → Brute-force → Optimize' pipeline for technical problems."
        : "Structured explanations clearly. Maintain this crisp organization under pressure.",
      avgDims.technicalDepth < 85
        ? "Always quantify auxiliary space and time trade-offs (e.g. O(N) memory vs O(1)) upfront."
        : "Proactively discuss how solutions scale across distributed systems or low-latency bottlenecks.",
    ];

    const report: InterviewReportData = {
      sessionId: `session-${Date.now().toString(36)}`,
      completedAt: "Completed Just Now",
      targetRole: currentConfig.targetRole,
      companyType: currentConfig.companyType,
      category: currentConfig.category,
      topic: currentConfig.topic.toUpperCase(),
      difficulty: currentConfig.difficulty,
      overallScore,
      dimensionAverages: avgDims,
      strongAreas: Array.from(new Set(strongList)).slice(0, 3),
      weakAreas: Array.from(new Set(weakList)).slice(0, 3),
      questionsAnswered: answeredQuestions,
      weakestQuestion: weakest,
      improvementSuggestions: suggestions,
      progressBoost: overallScore >= 80 ? 5 : 3,
    };

    setCurrentReport(report);

    // Update session history
    const updatedHistory = [report, ...sessionHistory.slice(0, 5)];
    setSessionHistory(updatedHistory);
    try {
      localStorage.setItem("career_os_interview_sessions", JSON.stringify(updatedHistory));
      localStorage.setItem("career_os_interview_readiness", JSON.stringify(overallScore));
    } catch {
      // ignore
    }

    setViewState("report");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplyProgress = () => {
    try {
      const currentReadiness = currentReport?.overallScore ?? 84;
      localStorage.setItem("career_os_interview_readiness", JSON.stringify(currentReadiness));
      showToast(`Profile updated! Interview Readiness scored at ${currentReadiness}% (+${currentReport?.progressBoost ?? 4}%)`);
    } catch {
      showToast("Career profile synchronized!");
    }
  };

  return (
    <div className="min-h-screen text-slate-100 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="hover:text-white transition flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-800/80"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Dashboard Overview
            </button>
          )}
          <span>/</span>
          <span className="text-indigo-400 font-semibold flex items-center gap-1.5">
            <MessageSquareCode className="w-3.5 h-3.5" />
            AI Interview Trainer
          </span>
          {viewState === "room" && (
            <>
              <span>/</span>
              <span className="text-slate-200 font-medium">Live Simulation Room</span>
            </>
          )}
          {viewState === "report" && (
            <>
              <span>/</span>
              <span className="text-slate-200 font-medium">Performance Report</span>
            </>
          )}
        </div>

        {viewState !== "config" && (
          <button
            onClick={() => setViewState("config")}
            className="text-xs font-medium text-slate-400 hover:text-white hover:underline transition"
          >
            Switch Setup / Config
          </button>
        )}
      </div>

      {/* VIEW STATE 1: SETUP / CONFIGURATION */}
      {viewState === "config" && (
        <div className="space-y-8">
          <InterviewConfigCard onStartInterview={handleStartInterview} />

          {/* Past Sessions & Performance Log */}
          {sessionHistory.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-7 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-400">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      Recent Interview Simulations
                    </h3>
                    <p className="text-xs text-slate-400">
                      Track your progressive mastery across previous practice runs
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {sessionHistory.length} Recorded Runs
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {sessionHistory.map((sess, idx) => (
                  <div
                    key={sess.sessionId || idx}
                    onClick={() => {
                      setCurrentReport(sess);
                      setViewState("report");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:border-indigo-500/50 hover:bg-slate-900/90 transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                          {sess.category} • {sess.topic}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {sess.overallScore}%
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-white group-hover:text-indigo-300 transition">
                        {sess.targetRole}
                      </h4>
                      <p className="text-[11px] text-slate-400">{sess.companyType}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>{sess.completedAt}</span>
                      <span className="text-indigo-400 group-hover:underline">
                        View Report →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW STATE 2: LIVE INTERVIEW ROOM */}
      {viewState === "room" && currentConfig && (
        <InterviewRoom
          config={currentConfig}
          questions={activeQuestions}
          onCompleteSession={handleCompleteSession}
          onExitSession={() => setViewState("config")}
        />
      )}

      {/* VIEW STATE 3: INTERVIEW REPORT */}
      {viewState === "report" && currentReport && (
        <InterviewReportCard
          report={currentReport}
          onRetake={() => {
            if (currentConfig) {
              handleStartInterview(currentConfig);
            } else {
              setViewState("config");
            }
          }}
          onNewInterview={() => setViewState("config")}
          onBackToDashboard={onBackToDashboard}
          onApplyProgress={handleApplyProgress}
        />
      )}
    </div>
  );
};
