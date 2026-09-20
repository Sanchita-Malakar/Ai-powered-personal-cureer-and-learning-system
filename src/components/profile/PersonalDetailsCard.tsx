"use client";

import React from "react";
import { PersonalInfo, CareerGoals } from "@/types/onboarding";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  Globe,
  Github,
  Linkedin,
  Code2,
  Edit3,
} from "lucide-react";

interface PersonalDetailsCardProps {
  personalInfo: PersonalInfo;
  careerGoals?: CareerGoals;
  onEdit: () => void;
}

export const PersonalDetailsCard: React.FC<PersonalDetailsCardProps> = ({
  personalInfo,
  careerGoals,
  onEdit,
}) => {
  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 shadow-xs hover:border-border transition-all">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center border border-accent/20">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">Personal Details</h3>
            <p className="text-xs text-ink-muted">
              Core identity, contact information, and developer presence.
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Details</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Full Name */}
        <div className="p-3.5 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5 mb-1">
            <User className="w-3 h-3 text-accent" />
            Full Legal Name
          </span>
          <p className="text-sm font-semibold text-ink truncate">
            {personalInfo.fullName || "Alex Rivera"}
          </p>
        </div>

        {/* Email */}
        <div className="p-3.5 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5 mb-1">
            <Mail className="w-3 h-3 text-accent" />
            Academic Email
          </span>
          <p className="text-sm font-semibold text-ink truncate">
            {personalInfo.email || "alex.rivera@university.edu"}
          </p>
        </div>

        {/* Phone */}
        <div className="p-3.5 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5 mb-1">
            <Phone className="w-3 h-3 text-accent" />
            Phone Number
          </span>
          <p className="text-sm font-semibold text-ink truncate">
            {personalInfo.phone || "+91 98765 43210"}
          </p>
        </div>

        {/* Location */}
        <div className="p-3.5 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5 mb-1">
            <MapPin className="w-3 h-3 text-accent" />
            Current Location
          </span>
          <p className="text-sm font-semibold text-ink truncate">
            {personalInfo.locationCity || "Bengaluru, India"}
          </p>
        </div>

        {/* College & Degree */}
        <div className="p-3.5 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5 mb-1">
            <GraduationCap className="w-3 h-3 text-accent" />
            Institution & Program
          </span>
          <p className="text-sm font-semibold text-ink truncate">
            {personalInfo.college || "NIT"} — {personalInfo.degree || "B.Tech CSE"}
          </p>
        </div>

        {/* Graduation Year */}
        <div className="p-3.5 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5 mb-1">
            <Calendar className="w-3 h-3 text-accent" />
            Target Batch
          </span>
          <p className="text-sm font-semibold text-ink truncate">
            Class of {personalInfo.graduationYear || "2025"} (Senior)
          </p>
        </div>

        {/* LeetCode Handle */}
        <div className="p-3.5 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5 mb-1">
            <Code2 className="w-3 h-3 text-amber-500" />
            LeetCode Handle
          </span>
          <p className="text-sm font-semibold text-ink truncate">
            {careerGoals?.leetcodeHandle ? `@${careerGoals.leetcodeHandle}` : "@code_ninja25"} • {careerGoals?.problemsSolvedCount || "320+"} solved
          </p>
        </div>

        {/* GitHub */}
        <div className="p-3.5 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5 mb-1">
            <Github className="w-3 h-3 text-ink" />
            GitHub URL
          </span>
          <a
            href={personalInfo.githubUrl || "https://github.com/alexrivera-dev"}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-accent hover:underline truncate block"
          >
            {personalInfo.githubUrl || "https://github.com/alexrivera-dev"}
          </a>
        </div>

        {/* LinkedIn */}
        <div className="p-3.5 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5 mb-1">
            <Linkedin className="w-3 h-3 text-sky-500" />
            LinkedIn Profile
          </span>
          <a
            href={personalInfo.linkedInUrl || "https://linkedin.com/in/alex-rivera"}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-accent hover:underline truncate block"
          >
            {personalInfo.linkedInUrl || "https://linkedin.com/in/alex-rivera"}
          </a>
        </div>
      </div>
    </div>
  );
};
