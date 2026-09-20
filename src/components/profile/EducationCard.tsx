"use client";

import React from "react";
import { AcademicProfile } from "@/types/onboarding";
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Edit3,
  TrendingUp,
} from "lucide-react";

interface EducationCardProps {
  academicProfile: AcademicProfile;
  degreeName?: string;
  collegeName?: string;
  onEdit: () => void;
}

export const EducationCard: React.FC<EducationCardProps> = ({
  academicProfile,
  degreeName = "B.Tech Computer Science & Engineering",
  collegeName = "National Institute of Technology (NIT)",
  onEdit,
}) => {
  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 shadow-xs hover:border-border transition-all">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center border border-purple-500/20">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">Education & Academics</h3>
            <p className="text-xs text-ink-muted">
              Degree credentials, CGPA benchmark, board examinations, and core CS subjects.
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Academics</span>
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
        {/* CGPA */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
            Current CGPA
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-ink">
              {academicProfile.cgpa || "8.85"}
            </span>
            <span className="text-xs font-semibold text-ink-muted">/ 10.0</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 mt-1">
            <Award className="w-3 h-3" />
            Top 5% of Department
          </span>
        </div>

        {/* Semester */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
            Academic Status
          </span>
          <span className="text-2xl font-black text-ink block">
            {academicProfile.semester || "Semester 7"}
          </span>
          <span className="text-[11px] text-ink-muted">Final Year Senior</span>
        </div>

        {/* 10th & 12th Board */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
            School Boards
          </span>
          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-muted font-medium">10th:</span>
              <span className="font-bold text-ink">{academicProfile.tenthPercentage || "94.2%"}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-muted font-medium">12th:</span>
              <span className="font-bold text-ink">{academicProfile.twelfthPercentage || "91.8%"}</span>
            </div>
          </div>
        </div>

        {/* Backlogs */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
            Backlog Status
          </span>
          <span className="text-2xl font-black text-emerald-500 block">
            {academicProfile.activeBacklogs || "0"}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500">
            <ShieldCheck className="w-3 h-3" />
            100% Eligible for Tier-1
          </span>
        </div>
      </div>

      {/* Program & Institution Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-accent/5 to-transparent border border-purple-500/20 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Registered Degree & Branch
          </span>
          <h4 className="text-base font-bold text-ink mt-0.5">
            {degreeName}
          </h4>
          <p className="text-xs text-ink-muted">
            {collegeName} • Affiliated with National Board of Accreditation
          </p>
        </div>
        <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
          Graduation: May 2025
        </span>
      </div>

      {/* Core Subject Performance */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-accent" />
            Core Computer Science Coursework Grades
          </h4>
          <span className="text-[11px] text-ink-muted">Graded on 10.0 scale</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {academicProfile.subjects?.map((sub) => (
            <div
              key={sub.id}
              className="p-3 rounded-xl bg-canvas border border-border/70 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-ink block leading-tight">
                  {sub.name}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {sub.proficiency}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-accent/15 text-accent font-black text-xs">
                {sub.gradeOrScore}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
