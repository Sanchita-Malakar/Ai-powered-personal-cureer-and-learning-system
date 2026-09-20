"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CompleteStudentProfile } from "@/types/onboarding";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Target,
  Route,
  Briefcase,
  Zap,
} from "lucide-react";

interface CompletionModalProps {
  profile: CompleteStudentProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  profile,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface border border-border/80 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 text-center">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-br from-accent/30 to-ai/30 rounded-full blur-3xl pointer-events-none" />

        {/* Celebration Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent to-ai text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/30 scale-105">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 inline-block mb-2">
          Onboarding Complete
        </span>

        <h3 className="text-2xl font-bold text-ink tracking-tight">
          Welcome to CareerOS, {profile.personalInfo.fullName.split(" ")[0] || "Student"}!
        </h3>

        <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
          Your personalized career intelligence workspace is now configured for{" "}
          <strong className="text-ink font-semibold">{profile.careerPreferences.primaryRole}</strong>.
        </p>

        {/* Readiness Meter Card */}
        <div className="my-5 p-4 rounded-2xl bg-canvas/80 border border-border/80 flex items-center justify-between">
          <div className="text-left">
            <span className="text-xs font-semibold text-ink block">
              Initial Role Readiness Score
            </span>
            <span className="text-[11px] text-ink-muted">
              Calculated from your skills, coursework & projects
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent text-white font-extrabold text-base shadow-sm">
            <span>{profile.calculatedReadiness}%</span>
          </div>
        </div>

        {/* Highlights Generated */}
        <div className="space-y-2 text-left mb-6">
          <div className="flex items-center gap-2.5 text-xs text-ink">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>AI Roadmap generated for {profile.careerPreferences.primaryRole}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-ink">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Daily study plan adapted to {profile.careerGoals.weeklyStudyHours}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-ink">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Curated job matches in {profile.careerPreferences.preferredLocations.slice(0, 2).join(", ")}</span>
          </div>
        </div>

        {/* Action Button & Countdown */}
        <button
          type="button"
          onClick={() => {
            onClose();
            router.push("/");
          }}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-accent hover:bg-accent/90 text-white font-bold text-sm shadow-md shadow-accent/25 hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          <span>Launch Personalized Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[11px] text-ink-muted mt-3">
          Auto-redirecting in <span className="font-bold text-accent">{countdown}s</span>...
        </p>
      </div>
    </div>
  );
};
