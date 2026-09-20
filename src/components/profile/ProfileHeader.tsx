"use client";

import React from "react";
import { CompleteStudentProfile } from "@/types/onboarding";
import {
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Edit3,
  Upload,
  CheckCircle2,
  Calendar,
  Github,
  Linkedin,
  Globe,
  Sparkles,
} from "lucide-react";

interface ProfileHeaderProps {
  profile: CompleteStudentProfile;
  onEditProfile: () => void;
  onUploadResume: () => void;
  onNavigateSection?: (sectionId: string, paramId?: string) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onEditProfile,
  onUploadResume,
  onNavigateSection,
}) => {
  const { personalInfo, academicProfile, careerPreferences, calculatedReadiness } = profile;

  const initials = personalInfo.fullName
    ? personalInfo.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AR";

  const readinessScore = calculatedReadiness || 84;

  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 sm:p-7 shadow-xs hover:border-border transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left side: Avatar + Identity Details */}
        <div className="flex items-start sm:items-center gap-5">
          {/* Avatar / Initials */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-accent/20 to-purple-500/20 border-2 border-accent/40 flex items-center justify-center text-accent font-bold text-2xl sm:text-3xl shadow-md shadow-accent/10">
              {initials}
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-surface flex items-center justify-center text-white" title="Profile Verified">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Core Info */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                {personalInfo.fullName || "Alex Rivera"}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20">
                <Sparkles className="w-3 h-3" />
                {careerPreferences.primaryRole || "AI/ML Engineer"}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Placement Ready
              </span>
            </div>

            <p className="text-xs sm:text-sm text-ink-muted flex flex-wrap items-center gap-y-1 gap-x-3">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-ink-muted" />
                {personalInfo.college || "NIT"} • {academicProfile.semester || "Semester 7"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-ink-muted" />
                Class of {personalInfo.graduationYear || "2025"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-ink-muted" />
                {personalInfo.locationCity || "Bengaluru, India"}
              </span>
            </p>

            {/* Social & Web Links */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {personalInfo.githubUrl && (
                <a
                  href={personalInfo.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-canvas hover:bg-border/60 text-ink text-xs font-medium border border-border/80 transition-colors"
                >
                  <Github className="w-3.5 h-3.5 text-ink-muted" />
                  <span>GitHub</span>
                  <ExternalLink className="w-2.5 h-2.5 text-ink-muted" />
                </a>
              )}
              {personalInfo.linkedInUrl && (
                <a
                  href={personalInfo.linkedInUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-canvas hover:bg-border/60 text-ink text-xs font-medium border border-border/80 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-sky-500" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-2.5 h-2.5 text-ink-muted" />
                </a>
              )}
              {personalInfo.portfolioUrl && (
                <a
                  href={personalInfo.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-canvas hover:bg-border/60 text-ink text-xs font-medium border border-border/80 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Portfolio</span>
                  <ExternalLink className="w-2.5 h-2.5 text-ink-muted" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Readiness Card & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-border/60">
          {/* Readiness Mini Indicator */}
          <div className="flex items-center gap-3 bg-canvas/80 border border-border/80 px-4 py-2.5 rounded-2xl">
            <div className="text-right">
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">
                Overall Profile Readiness
              </span>
              <span className="text-xs text-ink-muted">Tier-1 Benchmark: 80%</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-extrabold text-lg">
              {readinessScore}%
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onEditProfile}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-accent text-white hover:bg-accent/90 font-semibold text-xs transition-all shadow-sm shadow-accent/20 flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={onUploadResume}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-canvas hover:bg-border/60 border border-border text-ink font-semibold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-ink-muted" />
              <span>Update Resume</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
