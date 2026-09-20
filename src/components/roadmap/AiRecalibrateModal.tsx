"use client";

import React, { useState } from "react";
import { RecalibrationPacing } from "@/types/roadmap";
import {
  X,
  Sparkles,
  Zap,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface AiRecalibrateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRecalibration: (pacing: RecalibrationPacing) => void;
}

export const AiRecalibrateModal: React.FC<AiRecalibrateModalProps> = ({
  isOpen,
  onClose,
  onApplyRecalibration,
}) => {
  const [selectedPacing, setSelectedPacing] = useState<RecalibrationPacing>("placement-sprint");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleApply = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onApplyRecalibration(selectedPacing);
      onClose();
    }, 1200);
  };

  const options: { id: RecalibrationPacing; title: string; desc: string; badge: string; icon: any }[] = [
    {
      id: "placement-sprint",
      title: "Placement Emergency (DSA & Resume First)",
      desc: "Bumps LeetCode algorithms and ATS resume milestones to the immediate front to clear campus screening rounds in the next 30 days.",
      badge: "Recommended for 7th Sem",
      icon: Zap,
    },
    {
      id: "fast-track",
      title: "Fast-Track Sprint (3-4 Months)",
      desc: "Fast-tracks foundational Python & stats based on your 88% verified score, unlocking LLM fine-tuning and production deployments early.",
      badge: "Save 6 Weeks",
      icon: TrendingUp,
    },
    {
      id: "balanced",
      title: "Deep Academic Mastery (6 Months)",
      desc: "Comprehensive deep dives into linear algebra proofs, PyTorch custom CUDA kernels, and theoretical distributed systems.",
      badge: "Full Foundations",
      icon: ShieldCheck,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-ink/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface border border-ai/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-ai/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-ai/15 text-ai flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ai">
                CareerOS Copilot Engine
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-ink">
                AI Roadmap Recalibration
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-ink-muted hover:text-ink hover:bg-canvas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-ink-muted leading-relaxed mb-4">
          The AI engine analyzes your recent problem-solving velocity, completed projects, and target company cutoffs to optimize your sequence of milestones.
        </p>

        {/* Pacing Options */}
        <div className="space-y-2.5 mb-5">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedPacing === opt.id;

            return (
              <div
                key={opt.id}
                onClick={() => setSelectedPacing(opt.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-ai/10 border-ai text-ai shadow-sm"
                    : "bg-canvas/60 border-border/80 text-ink hover:border-border hover:bg-canvas"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-ai" />
                    <span className="font-bold text-xs sm:text-sm text-ink">{opt.title}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-surface text-ai border border-ai/20">
                    {opt.badge}
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted leading-relaxed pl-6">
                  {opt.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* AI Insight Factors Audited */}
        <div className="p-3 rounded-2xl bg-canvas/60 border border-border/80 text-xs mb-5 space-y-1">
          <span className="font-semibold text-ink text-[11px] uppercase tracking-wider block">
            AI Signals Checked:
          </span>
          <div className="flex items-center gap-2 text-ink-muted text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Python & Web Projects verified (Advanced)</span>
          </div>
          <div className="flex items-center gap-2 text-ink-muted text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Stripe application deadline closes in 48 hours</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-ink-muted hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ai hover:bg-ai/90 text-white font-bold text-xs shadow-md shadow-ai/25 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Re-optimizing Roadmap...</span>
              </>
            ) : (
              <>
                <span>Apply AI Recalibration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
