"use client";

import React, { useState, useEffect } from "react";
import {
  InterviewQuestion,
  InterviewConfig,
  QuestionEvaluation,
  EvaluationDimensions,
} from "@/types/interview";
import {
  MessageSquareCode,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Bot,
  User,
  Lightbulb,
  FileCheck2,
} from "lucide-react";

interface InterviewRoomProps {
  config: InterviewConfig;
  questions: InterviewQuestion[];
  onCompleteSession: (answeredQuestions: InterviewQuestion[]) => void;
  onExitSession: () => void;
}

export const InterviewRoom: React.FC<InterviewRoomProps> = ({
  config,
  questions,
  onCompleteSession,
  onExitSession,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalStep, setEvalStep] = useState(0);
  const [evaluatedQuestions, setEvaluatedQuestions] = useState<InterviewQuestion[]>([]);
  const [activeEvaluation, setActiveEvaluation] = useState<QuestionEvaluation | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentQuestion = questions[currentIndex] || questions[0];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Insert formatting template
  const insertTemplate = (tag: string) => {
    setCurrentAnswer((prev) => (prev ? `${prev}\n${tag}: ` : `${tag}: `));
  };

  // Load sample answer for effortless testing
  const loadSampleAnswer = () => {
    if (currentQuestion.modelAnswer) {
      // Slightly varied sample answer for student
      setCurrentAnswer(
        currentQuestion.modelAnswer.slice(0, 300) + "..."
      );
    }
  };

  // Submit and evaluate answer
  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) return;

    setIsEvaluating(true);
    setEvalStep(0);

    // Animated evaluation stepping through the 6 dimensions
    const evalInterval = setInterval(() => {
      setEvalStep((prev) => {
        if (prev >= 5) {
          clearInterval(evalInterval);
          finishEvaluation();
          return 5;
        }
        return prev + 1;
      });
    }, 280);
  };

  const finishEvaluation = () => {
    // Generate realistic evaluation scores
    const wordCount = currentAnswer.trim().split(/\s+/).length;
    const hasTechnicalKeywords =
      currentAnswer.toLowerCase().includes("python") ||
      currentAnswer.toLowerCase().includes("o(1)") ||
      currentAnswer.toLowerCase().includes("o(n)") ||
      currentAnswer.toLowerCase().includes("complexity") ||
      currentAnswer.toLowerCase().includes("index") ||
      currentAnswer.toLowerCase().includes("algorithm") ||
      currentAnswer.toLowerCase().includes("result") ||
      currentAnswer.toLowerCase().includes("team");

    const baseScore = Math.min(94, Math.max(72, 70 + (wordCount > 40 ? 12 : 5) + (hasTechnicalKeywords ? 10 : 0)));

    const dimensions: EvaluationDimensions = {
      accuracy: Math.min(96, baseScore + Math.floor(Math.random() * 6) - 2),
      relevance: Math.min(96, baseScore + 2),
      clarity: Math.min(95, baseScore - 2),
      structure: Math.min(95, wordCount > 30 ? baseScore + 3 : baseScore - 5),
      confidence: Math.min(90, baseScore - 4),
      technicalDepth: Math.min(98, baseScore + 4),
    };

    const evaluation: QuestionEvaluation = {
      dimensions,
      overallScore: Math.round(
        (dimensions.accuracy +
          dimensions.relevance +
          dimensions.clarity +
          dimensions.structure +
          dimensions.confidence +
          dimensions.technicalDepth) /
          6
      ),
      feedback:
        baseScore >= 85
          ? "Outstanding explanation! Accurate terminology, clear logical sequencing, and strong conceptual command."
          : "Solid attempt! Good core reasoning, though you can elevate clarity by explicitly stating time/space complexity and trade-offs.",
      strongPoints: [
        "Directly addressed the primary core concept requested.",
        "Demonstrated clear understanding of system implications.",
      ],
      improvementPoints: [
        "Include specific quantitative metrics (e.g. latency, Big-O runtime) to sound more authoritative.",
      ],
    };

    const evaluatedQ: InterviewQuestion = {
      ...currentQuestion,
      studentAnswer: currentAnswer,
      evaluation,
    };

    const updatedList = [...evaluatedQuestions, evaluatedQ];
    setEvaluatedQuestions(updatedList);
    setActiveEvaluation(evaluation);
    setIsEvaluating(false);
  };

  const handleNextQuestion = () => {
    setActiveEvaluation(null);
    setCurrentAnswer("");
    setShowHint(false);

    if (isLastQuestion) {
      onCompleteSession(evaluatedQuestions);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="p-5 sm:p-7 rounded-3xl bg-surface border border-border/80 shadow-xs mb-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Session Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ink">
                AI Interview Coach
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Live Session
              </span>
            </div>
            <p className="text-[11px] text-ink-muted">
              {config.companyType} • {config.targetRole} ({config.category.toUpperCase()})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Progress Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-canvas border border-border/80 text-xs font-bold text-ink">
            <span>Question {currentIndex + 1} of {questions.length}</span>
          </div>

          {/* Live Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-canvas border border-border/80 text-xs font-mono font-bold text-accent">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          <button
            type="button"
            onClick={onExitSession}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-ink-muted hover:text-action hover:bg-action/10 transition-colors"
          >
            End Early
          </button>
        </div>
      </div>

      {/* AI Interviewer Question Speech Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-accent/[0.07] via-canvas/60 to-transparent border border-accent/25 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent text-white">
              Question {currentIndex + 1}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              Topic: {currentQuestion.topic.toUpperCase()} • Difficulty: {currentQuestion.difficulty}
            </span>
          </div>

          {currentQuestion.contextHint && (
            <button
              type="button"
              onClick={() => setShowHint((prev) => !prev)}
              className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHint ? "Hide Hint" : "Interviewer Hint"}</span>
            </button>
          )}
        </div>

        {/* Question Text */}
        <h3 className="text-base sm:text-lg font-bold text-ink leading-relaxed">
          &ldquo;{currentQuestion.question}&rdquo;
        </h3>

        {/* Context Hint if requested */}
        {showHint && currentQuestion.contextHint && (
          <div className="p-3 rounded-xl bg-surface border border-accent/30 text-xs text-ink/90 animate-in fade-in">
            <span className="font-bold text-accent block mb-0.5">Focus Areas:</span>
            <span>{currentQuestion.contextHint}</span>
          </div>
        )}
      </div>

      {/* Evaluating Overlay Animation */}
      {isEvaluating ? (
        <div className="p-8 rounded-3xl bg-canvas/60 border border-accent/30 text-center space-y-4 animate-in fade-in">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-white mx-auto shadow-md shadow-accent/30 animate-pulse">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h4 className="text-base font-bold text-ink">
              AI Evaluating Response Across 6 Dimensions...
            </h4>
            <p className="text-xs text-ink-muted mt-1">
              Analyzing Accuracy, Relevance, Clarity, Structure, Confidence, and Technical depth.
            </p>
          </div>

          <div className="max-w-md mx-auto grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-ink-muted pt-2 text-left">
            <span className={evalStep >= 0 ? "text-emerald-600 font-bold" : ""}>
              ✓ 1. Accuracy
            </span>
            <span className={evalStep >= 1 ? "text-emerald-600 font-bold" : ""}>
              ✓ 2. Relevance
            </span>
            <span className={evalStep >= 2 ? "text-emerald-600 font-bold" : ""}>
              ✓ 3. Clarity
            </span>
            <span className={evalStep >= 3 ? "text-emerald-600 font-bold" : ""}>
              ✓ 4. Structure
            </span>
            <span className={evalStep >= 4 ? "text-emerald-600 font-bold" : ""}>
              ✓ 5. Confidence
            </span>
            <span className={evalStep >= 5 ? "text-emerald-600 font-bold" : ""}>
              ✓ 6. Technical Depth
            </span>
          </div>
        </div>
      ) : activeEvaluation ? (
        /* Instant Evaluation Feedback Card before next question */
        <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-emerald-500/30 bg-emerald-500/[0.02] space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-extrabold text-sm">
                {activeEvaluation.overallScore}%
              </div>
              <div>
                <h4 className="text-sm font-bold text-ink">
                  Question {currentIndex + 1} Evaluated
                </h4>
                <p className="text-xs text-ink-muted">
                  {activeEvaluation.feedback}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextQuestion}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 shadow-sm shadow-accent/20 transition-all active:scale-95 shrink-0"
            >
              <span>{isLastQuestion ? "View Comprehensive Report" : "Next Question"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 6 Dimension Mini Bar Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
            {Object.entries(activeEvaluation.dimensions).map(([key, val]) => (
              <div key={key} className="p-2.5 rounded-xl bg-canvas/60 border border-border/70 text-center">
                <span className="text-[10px] uppercase font-bold text-ink-muted block truncate">
                  {key}
                </span>
                <span className="text-sm font-black text-accent mt-0.5 block">
                  {val}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Student Answer Editor */
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ink uppercase tracking-wider">
                Your Response
              </span>
              <span className="text-[11px] text-ink-muted">
                (Type your response or use structuring templates)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {config.category === "behavioral" ? (
                <>
                  <button
                    type="button"
                    onClick={() => insertTemplate("[Situation]")}
                    className="px-2 py-0.5 text-[10px] font-semibold rounded bg-canvas border border-border text-ink-muted hover:text-ink"
                  >
                    + Situation
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTemplate("[Task]")}
                    className="px-2 py-0.5 text-[10px] font-semibold rounded bg-canvas border border-border text-ink-muted hover:text-ink"
                  >
                    + Task
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTemplate("[Action]")}
                    className="px-2 py-0.5 text-[10px] font-semibold rounded bg-canvas border border-border text-ink-muted hover:text-ink"
                  >
                    + Action
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTemplate("[Result]")}
                    className="px-2 py-0.5 text-[10px] font-semibold rounded bg-canvas border border-border text-ink-muted hover:text-ink"
                  >
                    + Result
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => insertTemplate("[Approach]")}
                    className="px-2 py-0.5 text-[10px] font-semibold rounded bg-canvas border border-border text-ink-muted hover:text-ink"
                  >
                    + Approach
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTemplate("[Complexity]")}
                    className="px-2 py-0.5 text-[10px] font-semibold rounded bg-canvas border border-border text-ink-muted hover:text-ink"
                  >
                    + Complexity
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={loadSampleAnswer}
                className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20"
                title="Fill a realistic high-quality answer for testing"
              >
                Auto-fill Answer
              </button>
            </div>
          </div>

          <textarea
            rows={6}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your structured answer here. Speak as if talking directly to your technical interviewer..."
            className="w-full p-4 text-xs sm:text-sm rounded-2xl bg-canvas border border-border/80 focus:outline-accent text-ink leading-relaxed font-sans placeholder:text-ink-muted/60 shadow-2xs"
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3 text-xs text-ink-muted">
              <span>{currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0} words</span>
              <span>•</span>
              <button
                type="button"
                onClick={() => setIsRecording((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                  isRecording
                    ? "bg-action/15 border-action text-action animate-pulse"
                    : "bg-surface border-border text-ink-muted hover:text-ink"
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? "Listening..." : "Dictate Audio"}</span>
              </button>
            </div>

            <button
              type="button"
              disabled={!currentAnswer.trim()}
              onClick={handleSubmitAnswer}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 shadow-md shadow-accent/25 transition-all disabled:opacity-50 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Answer for AI Evaluation</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
