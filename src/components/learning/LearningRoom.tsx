"use client";

import React, { useState } from "react";
import {
  LearningItem,
  QuizEvaluationResult,
} from "@/types/learning";
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Award,
  Clock,
  Code2,
  Layers,
  Zap,
  TrendingUp,
  RotateCcw,
} from "lucide-react";

interface LearningRoomProps {
  item: LearningItem;
  onBack: () => void;
  onCompleteFlow: (topicId: string, evaluation: QuizEvaluationResult) => void;
  onNavigateToTopic: (topicId: string) => void;
}

type FlowStep = "learn" | "complete" | "quiz" | "evaluation";

export const LearningRoom: React.FC<LearningRoomProps> = ({
  item,
  onBack,
  onCompleteFlow,
  onNavigateToTopic,
}) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>("learn");
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showConceptCheckResult, setShowConceptCheckResult] = useState(false);
  const [conceptCheckAnswer, setConceptCheckAnswer] = useState<number | null>(null);
  const [evaluation, setEvaluation] = useState<QuizEvaluationResult | null>(null);

  const activeLesson = item.lessons[activeLessonIndex] || item.lessons[0];

  // Submit Quiz and calculate evaluation
  const handleQuizSubmit = () => {
    let correctCount = 0;
    const totalCount = item.quiz.length;

    item.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / totalCount) * 100);
    const passed = score >= 65;

    const result: QuizEvaluationResult = {
      score,
      correctCount,
      totalCount,
      passed,
      feedback: passed
        ? "Excellent mastery! You demonstrated thorough understanding of core principles, edge-cases, and architectural implications."
        : "Good attempt. Review the conceptual explanations below before advancing to dependent systems tracks.",
      strengths: [
        "Accurate identification of concurrency isolation trade-offs",
        "Clear understanding of execution plans and asymptotic bottlenecks",
      ],
      reviewTopics: passed
        ? []
        : ["Review leftmost index prefixing and transaction isolation anomalies"],
      progressBoost: passed ? 6 : 3,
      nextRecommendation: {
        topicId: item.nextRecommendedTopicId,
        topicTitle:
          item.nextRecommendedTopicId === "learn-sql-opt"
            ? "SQL & Query Optimization"
            : item.nextRecommendedTopicId === "learn-ml-found"
            ? "Machine Learning & Neural Networks"
            : item.nextRecommendedTopicId === "learn-dsa-trees"
            ? "DSA Trees & Traversal"
            : "Python Advanced Concurrency",
        reason: item.nextRecommendationReason,
      },
    };

    setEvaluation(result);
    setCurrentStep("evaluation");
    onCompleteFlow(item.id, result);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {item.category}
              </span>
              <span className="text-xs text-slate-400">• {item.estimatedTime}</span>
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {item.topic}
            </h2>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-xs font-medium">
          {[
            { key: "learn", label: "1. Learn" },
            { key: "complete", label: "2. Complete" },
            { key: "quiz", label: "3. Quiz" },
            { key: "evaluation", label: "4. Evaluation" },
          ].map((step, idx) => {
            const isActive = currentStep === step.key;
            return (
              <span
                key={step.key}
                className={`px-2.5 py-1 rounded-lg transition ${
                  isActive
                    ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30"
                    : "text-slate-400 bg-slate-950/60 border border-slate-800"
                }`}
              >
                {step.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* STAGE 1: LEARN (INTERACTIVE LESSON VIEWER) */}
      {currentStep === "learn" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Lessons Sidebar */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 backdrop-blur-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Curriculum Lessons ({item.lessons.length})
            </h3>
            <div className="space-y-2">
              {item.lessons.map((les, idx) => (
                <div
                  key={les.id}
                  onClick={() => {
                    setActiveLessonIndex(idx);
                    setShowConceptCheckResult(false);
                    setConceptCheckAnswer(null);
                  }}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-2.5 ${
                    activeLessonIndex === idx
                      ? "border-indigo-500 bg-indigo-950/40 text-white shadow-md shadow-indigo-950/30"
                      : "border-slate-800 bg-slate-950/50 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      activeLessonIndex === idx
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-slate-200 mb-0.5">
                      {les.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {les.durationMinutes} min read
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resources link box */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Track Resources
              </span>
              {item.resources.map((res) => (
                <div
                  key={res.id}
                  className="text-xs p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-300 flex items-center justify-between"
                >
                  <span className="truncate pr-2">{res.title}</span>
                  <span className="text-[10px] text-indigo-400 font-mono shrink-0">
                    {res.durationOrPages}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lesson Main Content Reader */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 md:p-8 space-y-6 backdrop-blur-xl">
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Lesson {activeLessonIndex + 1} of {item.lessons.length}
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {activeLesson.title}
              </h2>
              <p className="text-xs text-slate-400">{activeLesson.summary}</p>
            </div>

            {/* Markdown & Text Explanation */}
            <div className="prose prose-invert text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {activeLesson.contentMarkdown}
            </div>

            {/* Syntax Highlighted Code Snippet */}
            {activeLesson.codeSnippet && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                    {activeLesson.codeSnippet.title}
                  </span>
                  <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {activeLesson.codeSnippet.language}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                  {activeLesson.codeSnippet.code}
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  💡 {activeLesson.codeSnippet.explanation}
                </p>
              </div>
            )}

            {/* Key Takeaways */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Key Takeaways
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeLesson.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Concept Check */}
            {activeLesson.conceptCheck && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase text-slate-300">
                    Quick Concept Check
                  </span>
                </div>
                <p className="text-xs font-medium text-white">
                  {activeLesson.conceptCheck.question}
                </p>

                <div className="space-y-2">
                  {activeLesson.conceptCheck.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => {
                        setConceptCheckAnswer(oIdx);
                        setShowConceptCheckResult(true);
                      }}
                      className={`w-full p-2.5 rounded-lg text-left text-xs border transition ${
                        conceptCheckAnswer === oIdx
                          ? oIdx === activeLesson.conceptCheck?.correctAnswerIndex
                            ? "border-emerald-500 bg-emerald-950/40 text-emerald-200"
                            : "border-rose-500 bg-rose-950/40 text-rose-200"
                          : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {showConceptCheckResult && (
                  <div className="text-xs text-slate-300 pt-1">
                    {conceptCheckAnswer === activeLesson.conceptCheck.correctAnswerIndex ? (
                      <span className="text-emerald-400 font-semibold">
                        ✓ Correct! Excellent conceptual understanding.
                      </span>
                    ) : (
                      <span className="text-amber-400">
                        Hint: {activeLesson.conceptCheck.hint}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Next Lesson or Complete Button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {activeLessonIndex > 0 ? (
                <button
                  onClick={() => setActiveLessonIndex(activeLessonIndex - 1)}
                  className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1.5"
                >
                  ← Previous Lesson
                </button>
              ) : (
                <div />
              )}

              {activeLessonIndex < item.lessons.length - 1 ? (
                <button
                  onClick={() => setActiveLessonIndex(activeLessonIndex + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition flex items-center gap-2"
                >
                  Next Lesson
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep("complete")}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
                >
                  Complete Theory & Proceed
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: COMPLETE (CHECKPOINT) */}
      {currentStep === "complete" && (
        <div className="max-w-2xl mx-auto rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-8 text-center space-y-6 backdrop-blur-xl shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Curriculum Theory Completed
            </span>
            <h2 className="text-2xl font-bold text-white">
              Great Job Completing {item.topic}!
            </h2>
            <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
              You have finished all interactive reading modules, code walkthroughs, and architecture patterns for this topic. Next, solidify your knowledge with a brief 3-question evaluation quiz.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Knowledge Check Details:
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs text-center font-mono">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Questions</div>
                <div className="text-white font-bold">{item.quiz.length}</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Passing Score</div>
                <div className="text-emerald-400 font-bold">65%</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Readiness Boost</div>
                <div className="text-indigo-400 font-bold">+6%</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentStep("learn")}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              Review Lessons
            </button>
            <button
              onClick={() => setCurrentStep("quiz")}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
            >
              Start Knowledge Quiz
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: QUIZ / TEST */}
      {currentStep === "quiz" && (
        <div className="max-w-3xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 space-y-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Knowledge Quiz
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {item.topic} Knowledge Check
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {Object.keys(selectedAnswers).length} / {item.quiz.length} Answered
            </span>
          </div>

          <div className="space-y-6">
            {item.quiz.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 md:p-5 rounded-xl border border-slate-800 bg-slate-950/70 space-y-3"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-slate-200">
                    {q.question}
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[q.id] === oIdx;
                    return (
                      <div
                        key={oIdx}
                        onClick={() =>
                          setSelectedAnswers({
                            ...selectedAnswers,
                            [q.id]: oIdx,
                          })
                        }
                        className={`p-3 rounded-lg text-xs border transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-950/40 text-white font-medium shadow-sm"
                            : "border-slate-800/90 bg-slate-900/60 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span>{opt}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "border-indigo-400 bg-indigo-600"
                              : "border-slate-700 bg-slate-950"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentStep("learn")}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              ← Back to Lessons
            </button>
            <button
              onClick={handleQuizSubmit}
              disabled={Object.keys(selectedAnswers).length < item.quiz.length}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                Object.keys(selectedAnswers).length === item.quiz.length
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              Submit Quiz for Evaluation
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: EVALUATION & PROGRESS UPDATED */}
      {currentStep === "evaluation" && evaluation && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Evaluation Score Card */}
          <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/90 p-6 md:p-8 backdrop-blur-xl space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Quiz Evaluation Verified
                </span>
                <h2 className="text-2xl font-bold text-white">
                  Evaluation: {evaluation.score}% Score
                </h2>
                <p className="text-xs text-slate-300">
                  {evaluation.correctCount} of {evaluation.totalCount} questions correct •{" "}
                  {evaluation.passed ? "Proficiency Mastered" : "Needs Review"}
                </p>
              </div>

              {/* Progress Updated Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-indigo-950/30 border border-emerald-500/30 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-300">
                    +{evaluation.progressBoost}% Career Progress Boost
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Profile synchronized with CareerOS
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {evaluation.feedback}
            </p>

            {/* Questions Review with Explanations */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Detailed Answers Review
              </h4>

              {item.quiz.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctOptionIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isCorrect
                        ? "border-emerald-500/30 bg-slate-950/60"
                        : "border-rose-500/30 bg-slate-950/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-200">
                        {idx + 1}. {q.question}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          isCorrect
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-rose-500/20 text-rose-300"
                        }`}
                      >
                        {isCorrect ? "Correct ✓" : "Incorrect"}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      <strong>Correct Answer:</strong> {q.options[q.correctOptionIndex]}
                    </div>
                    <div className="text-[11px] text-indigo-300 bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-500/20">
                      💡 {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Next Recommendation Engine Output */}
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-900 to-indigo-950/30 p-6 md:p-7 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Adaptive Recommendation Engine
                </span>
                <h3 className="text-base font-bold text-white">
                  What You Should Learn Next
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {evaluation.nextRecommendation.reason}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={onBack}
                className="text-xs text-slate-400 hover:text-white transition"
              >
                ← Return to Recommended Curriculum
              </button>

              <button
                onClick={() =>
                  onNavigateToTopic(evaluation.nextRecommendation.topicId)
                }
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                Start Next Topic: {evaluation.nextRecommendation.topicTitle}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
