"use client";

import React from "react";
import {
  LearningProgressStats,
  InterviewProgressStats,
} from "@/types/progress";
import {
  BookOpen,
  MessageSquareCode,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  Clock,
  Zap,
} from "lucide-react";

interface LearningAndInterviewCardProps {
  learning: LearningProgressStats;
  interview: InterviewProgressStats;
  onOpenLearning?: () => void;
  onOpenInterview?: () => void;
}

export const LearningAndInterviewCard: React.FC<LearningAndInterviewCardProps> = ({
  learning,
  interview,
  onOpenLearning,
  onOpenInterview,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Learning Progress Card */}
      <div className="p-5 md:p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl flex flex-col justify-between shadow-lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Learning Progress</h3>
                <p className="text-xs text-slate-400">Curriculum & knowledge assessments</p>
              </div>
            </div>
            {onOpenLearning && (
              <button
                onClick={onOpenLearning}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
              >
                <span>Curriculum</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Courses
              </span>
              <div className="text-xl font-bold text-white font-mono">
                {learning.completedCourses} / {learning.activeCourses + learning.completedCourses}
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Completed
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Topics
              </span>
              <div className="text-xl font-bold text-indigo-400 font-mono">
                {learning.topicsCompleted} / {learning.totalTopics}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">
                Finished
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Tests
              </span>
              <div className="text-xl font-bold text-emerald-400 font-mono">
                {learning.avgTestScore}%
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">
                {learning.testsTaken} Quizzes
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Total Time Invested
            </span>
            <span className="font-mono font-bold text-white">
              {learning.learningHours} Hours
            </span>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Active Track: Machine Learning Foundations</span>
          <span className="text-emerald-400 font-semibold">87% Avg Quiz Score</span>
        </div>
      </div>

      {/* 2. Interview Progress Card */}
      <div className="p-5 md:p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl flex flex-col justify-between shadow-lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400">
                <MessageSquareCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Interview Progress</h3>
                <p className="text-xs text-slate-400">Mock screening scores & weaknesses</p>
              </div>
            </div>
            {onOpenInterview && (
              <button
                onClick={onOpenInterview}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
              >
                <span>Trainer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Scores Breakdown: Technical vs Behavioral Disparity */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-300">Technical Depth</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {interview.technicalScore}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 rounded-full bg-emerald-400"
                  style={{ width: `${interview.technicalScore}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Top 10% benchmark
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-300">Behavioral Delivery</span>
                <span className="text-sm font-mono font-bold text-amber-400">
                  {interview.behavioralScore}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 rounded-full bg-amber-400"
                  style={{ width: `${interview.behavioralScore}%` }}
                />
              </div>
              <span className="text-[10px] text-amber-400 font-semibold mt-1 block">
                Needs STAR practice
              </span>
            </div>
          </div>

          {/* Weak Areas List */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Flagged Weak Areas:
            </span>
            {interview.weakAreas.map((weakness, idx) => (
              <div
                key={idx}
                className="text-xs p-2 rounded-lg bg-amber-950/20 border border-amber-500/20 text-amber-200 flex items-start gap-2"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{weakness}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>{interview.mockInterviewsTaken} Mock Interviews Taken</span>
          <span className="font-mono text-slate-200 font-bold">
            Latest Score: {interview.latestScore}%
          </span>
        </div>
      </div>
    </div>
  );
};
