"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { StepIndicator, ONBOARDING_STEPS } from "@/components/onboarding/StepIndicator";
import { PersonalInfoStep } from "@/components/onboarding/PersonalInfoStep";
import { AcademicProfileStep } from "@/components/onboarding/AcademicProfileStep";
import { CareerPreferencesStep } from "@/components/onboarding/CareerPreferencesStep";
import { SkillsStep } from "@/components/onboarding/SkillsStep";
import { ProjectsStep } from "@/components/onboarding/ProjectsStep";
import { CareerGoalsStep } from "@/components/onboarding/CareerGoalsStep";
import { ResumeUploadStep } from "@/components/onboarding/ResumeUploadStep";
import { CompletionModal } from "@/components/onboarding/CompletionModal";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Loader2,
  HelpCircle,
  LayoutDashboard,
} from "lucide-react";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";

  const {
    profile,
    loading,
    isOnboarded,
    updatePersonalInfo,
    updateAcademicProfile,
    updateCareerPreferences,
    updateSkills,
    updateProjects,
    updateCertifications,
    updateCareerGoals,
    updateResume,
    saveDraft,
    completeOnboarding,
    loadSampleProfile,
    resetProfile,
  } = useStudentProfile();

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Initialize completed steps if editing existing profile
  useEffect(() => {
    if (isOnboarded) {
      setCompletedSteps([1, 2, 3, 4, 5, 6, 7]);
    }
  }, [isOnboarded]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!profile.personalInfo.fullName.trim()) {
        newErrors.fullName = "Please enter your full name.";
      }
      if (!profile.personalInfo.college.trim()) {
        newErrors.college = "Please enter your college or university name.";
      }
      if (!profile.personalInfo.degree.trim()) {
        newErrors.degree = "Please select or enter your degree program.";
      }
      if (!profile.personalInfo.email.trim() || !profile.personalInfo.email.includes("@")) {
        newErrors.email = "Please enter a valid student email address.";
      }
    } else if (step === 2) {
      if (!profile.academicProfile.cgpa.trim()) {
        newErrors.cgpa = "Please enter your current CGPA or percentage.";
      }
    } else if (step === 3) {
      if (profile.careerPreferences.targetRoles.length === 0) {
        newErrors.targetRoles = "Please select at least one target role.";
      }
    } else if (step === 4) {
      const totalSkills =
        profile.skills.programming.length +
        profile.skills.development.length +
        profile.skills.aiMl.length +
        profile.skills.data.length +
        profile.skills.cloudDevOps.length;
      if (totalSkills === 0) {
        newErrors.skills = "Please add at least 1-2 skills in your core tech stack.";
      }
    } else if (step === 6) {
      if (!profile.careerGoals.primaryObjective.trim()) {
        newErrors.primaryObjective = "Please enter your primary career objective or elevator pitch.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentStep < ONBOARDING_STEPS.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectStep = (stepId: number) => {
    if (stepId <= currentStep || completedSteps.includes(stepId - 1)) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveDraft = async () => {
    setSaveStatus("saving");
    await saveDraft();
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await completeOnboarding();
      setIsSubmitting(false);
      setShowCompletionModal(true);
    } catch (err) {
      console.error("Failed to complete onboarding:", err);
      setIsSubmitting(false);
    }
  };

  const handleLoadDemo = () => {
    loadSampleProfile();
    setCompletedSteps([1, 2, 3, 4, 5, 6, 7]);
    setSaveStatus("Demo profile loaded!");
    setTimeout(() => setSaveStatus(null), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas bg-ambient-mesh flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-surface/90 border border-border shadow-xl text-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
          <p className="text-sm font-semibold text-ink">Loading your career profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas bg-ambient-mesh text-ink transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-surface/85 backdrop-blur-md border-b border-border/80 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-sm shadow-md shadow-accent/25 group-hover:scale-105 transition-transform">
              C
            </div>
            <div>
              <span className="font-bold text-[16px] tracking-tight text-ink block leading-none">
                CareerOS
              </span>
              <span className="text-[10px] text-ink-muted font-medium">
                Student Career Intelligence
              </span>
            </div>
          </Link>

          {isEditing && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-accent px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 ml-2">
              Editing Career Profile
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Auto-fill demo button for quick reviewer inspection */}
          <button
            type="button"
            onClick={handleLoadDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-accent/40 bg-accent/10 hover:bg-accent/20 text-accent text-xs font-semibold transition-all"
            title="Auto-fills comprehensive student details for fast testing"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">Auto-fill Demo Profile</span>
            <span className="sm:hidden">Demo</span>
          </button>

          {/* Return to Dashboard if user is editing or already onboarded */}
          {isOnboarded && (
            <Link
              href="/"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface border border-border/80 hover:bg-canvas text-ink text-xs font-semibold transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-accent" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-9">
        {/* Save feedback toast */}
        {saveStatus && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {saveStatus === "saving"
                  ? "Saving draft to cloud and local storage..."
                  : saveStatus === "saved"
                  ? "Draft saved successfully!"
                  : saveStatus}
              </span>
            </span>
          </div>
        )}

        {/* Step Progression Stepper */}
        <div className="mb-6">
          <StepIndicator
            currentStep={currentStep}
            onSelectStep={handleSelectStep}
            completedSteps={completedSteps}
          />
        </div>

        {/* Active Step Content Form Card */}
        <div className="bg-surface border border-border/80 rounded-3xl p-5 sm:p-8 shadow-sm transition-all">
          {currentStep === 1 && (
            <PersonalInfoStep
              data={profile.personalInfo}
              onChange={updatePersonalInfo}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <AcademicProfileStep
              data={profile.academicProfile}
              onChange={updateAcademicProfile}
              errors={errors}
            />
          )}

          {currentStep === 3 && (
            <CareerPreferencesStep
              data={profile.careerPreferences}
              onChange={updateCareerPreferences}
              errors={errors}
            />
          )}

          {currentStep === 4 && (
            <SkillsStep
              skills={profile.skills}
              onChange={updateSkills}
              errors={errors}
            />
          )}

          {currentStep === 5 && (
            <ProjectsStep
              projects={profile.projects}
              certifications={profile.certifications}
              onChangeProjects={updateProjects}
              onChangeCertifications={updateCertifications}
              errors={errors}
            />
          )}

          {currentStep === 6 && (
            <CareerGoalsStep
              data={profile.careerGoals}
              onChange={updateCareerGoals}
              errors={errors}
            />
          )}

          {currentStep === 7 && (
            <ResumeUploadStep
              profile={profile}
              resume={profile.resume}
              onUpdateResume={updateResume}
              onSubmit={handleFinalSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Navigation Controls Bar */}
          <div className="mt-8 pt-5 border-t border-border/70 flex items-center justify-between gap-3">
            {/* Left side: Back or Reset */}
            <div>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-canvas border border-border/80 hover:border-border text-ink text-xs font-semibold transition-all hover:bg-canvas/80 active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Step</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resetProfile}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-ink-muted hover:text-action text-xs font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Form</span>
                </button>
              )}
            </div>

            {/* Right side: Save Draft & Next / Submit */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-border/80 hover:bg-canvas text-ink text-xs font-semibold transition-all"
                title="Save your progress and continue later"
              >
                <Save className="w-3.5 h-3.5 text-ink-muted" />
                <span>Save Draft</span>
              </button>

              {currentStep < ONBOARDING_STEPS.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white text-xs sm:text-sm font-bold shadow-md shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white text-xs sm:text-sm font-bold shadow-md shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Onboarding</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Celebration Modal upon completion */}
      <CompletionModal
        profile={profile}
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
      />
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-canvas bg-ambient-mesh flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-surface/90 border border-border shadow-xl text-center">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <p className="text-sm font-semibold text-ink">Loading student onboarding...</p>
          </div>
        </div>
      }
    >
      <OnboardingContent />
    </React.Suspense>
  );
}
