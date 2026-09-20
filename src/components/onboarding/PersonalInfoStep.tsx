"use client";

import React from "react";
import { PersonalInfo } from "@/types/onboarding";
import {
  User,
  GraduationCap,
  School,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Sparkles,
} from "lucide-react";

interface PersonalInfoStepProps {
  data: PersonalInfo;
  onChange: (updates: Partial<PersonalInfo>) => void;
  errors: Record<string, string>;
}

const COMMON_DEGREES = [
  "B.Tech Computer Science & Engineering",
  "B.Tech Information Technology",
  "B.Tech AI & Data Science",
  "B.Tech Electronics & Communication",
  "B.E. Computer Science",
  "BCA (Bachelor of Computer Applications)",
  "MCA (Master of Computer Applications)",
  "B.Sc Computer Science",
  "M.Tech Computer Science / AI",
];

const GRADUATION_YEARS = ["2024", "2025", "2026", "2027", "2028"];

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="border-b border-border/70 pb-4">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1 • Identity & Academic Home</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-ink">
          Tell us about yourself
        </h3>
        <p className="text-sm text-ink-muted mt-1">
          We use this to tailor your career roadmap, university placement benchmark, and employer profile.
        </p>
      </div>

      {/* Primary Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <label className="block text-[13px] font-semibold text-ink mb-1" htmlFor="fullname">
            Full Name <span className="text-action">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="fullname"
              type="text"
              placeholder="e.g. Alex Rivera"
              value={data.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              className={`w-full bg-canvas/70 border text-ink placeholder:text-ink-muted/60 text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:bg-surface focus:shadow-sm transition-all ${
                errors.fullName
                  ? "border-action focus:border-action"
                  : "border-border/80 focus:border-accent"
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-action mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Degree / Education */}
        <div className="sm:col-span-2">
          <label className="block text-[13px] font-semibold text-ink mb-1" htmlFor="degree">
            Education / Degree Program <span className="text-action">*</span>
          </label>
          <div className="relative">
            <GraduationCap className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="degree"
              type="text"
              list="degree-options"
              placeholder="e.g. B.Tech Computer Science & Engineering"
              value={data.degree}
              onChange={(e) => onChange({ degree: e.target.value })}
              className={`w-full bg-canvas/70 border text-ink placeholder:text-ink-muted/60 text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:bg-surface focus:shadow-sm transition-all ${
                errors.degree
                  ? "border-action focus:border-action"
                  : "border-border/80 focus:border-accent"
              }`}
            />
            <datalist id="degree-options">
              {COMMON_DEGREES.map((deg) => (
                <option key={deg} value={deg} />
              ))}
            </datalist>
          </div>
          {errors.degree && (
            <p className="text-xs text-action mt-1">{errors.degree}</p>
          )}
        </div>

        {/* College / University */}
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-1" htmlFor="college">
            College / University Name <span className="text-action">*</span>
          </label>
          <div className="relative">
            <School className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="college"
              type="text"
              placeholder="e.g. National Institute of Technology"
              value={data.college}
              onChange={(e) => onChange({ college: e.target.value })}
              className={`w-full bg-canvas/70 border text-ink placeholder:text-ink-muted/60 text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:bg-surface focus:shadow-sm transition-all ${
                errors.college
                  ? "border-action focus:border-action"
                  : "border-border/80 focus:border-accent"
              }`}
            />
          </div>
          {errors.college && (
            <p className="text-xs text-action mt-1">{errors.college}</p>
          )}
        </div>

        {/* Graduation Year */}
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-1" htmlFor="gradYear">
            Graduation Year <span className="text-action">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="gradYear"
              value={data.graduationYear}
              onChange={(e) => onChange({ graduationYear: e.target.value })}
              className="w-full bg-canvas/70 border border-border/80 text-ink text-sm rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:border-accent focus:bg-surface focus:shadow-sm transition-all appearance-none cursor-pointer"
            >
              {GRADUATION_YEARS.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-1" htmlFor="email">
            Student / Contact Email <span className="text-action">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="email"
              type="email"
              placeholder="alex@university.edu"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className={`w-full bg-canvas/70 border text-ink placeholder:text-ink-muted/60 text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:bg-surface focus:shadow-sm transition-all ${
                errors.email
                  ? "border-action focus:border-action"
                  : "border-border/80 focus:border-accent"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-action mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone / WhatsApp */}
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-1" htmlFor="phone">
            Phone / WhatsApp Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="w-full bg-canvas/70 border border-border/80 text-ink placeholder:text-ink-muted/60 text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-accent focus:bg-surface focus:shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Location / Current City */}
        <div className="sm:col-span-2">
          <label className="block text-[13px] font-semibold text-ink mb-1" htmlFor="location">
            Current City / Campus Location
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="location"
              type="text"
              placeholder="e.g. Bengaluru, India"
              value={data.locationCity}
              onChange={(e) => onChange({ locationCity: e.target.value })}
              className="w-full bg-canvas/70 border border-border/80 text-ink placeholder:text-ink-muted/60 text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-accent focus:bg-surface focus:shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Online Profiles / Links (Ideal Student Addition) */}
      <div className="pt-2 border-t border-border/60">
        <h4 className="text-sm font-bold text-ink mb-1">
          Professional Profiles & Portfolios
        </h4>
        <p className="text-xs text-ink-muted mb-3.5">
          Adding your GitHub and LinkedIn increases campus recruiter visibility and ATS benchmark matching.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* LinkedIn */}
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1" htmlFor="linkedin">
              LinkedIn URL
            </label>
            <div className="relative">
              <Linkedin className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={data.linkedInUrl}
                onChange={(e) => onChange({ linkedInUrl: e.target.value })}
                className="w-full bg-canvas/70 border border-border/80 text-ink placeholder:text-ink-muted/50 text-xs rounded-xl pl-8 pr-2.5 py-2 focus:outline-none focus:border-accent focus:bg-surface transition-all"
              />
            </div>
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1" htmlFor="github">
              GitHub Profile
            </label>
            <div className="relative">
              <Github className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="github"
                type="url"
                placeholder="https://github.com/username"
                value={data.githubUrl}
                onChange={(e) => onChange({ githubUrl: e.target.value })}
                className="w-full bg-canvas/70 border border-border/80 text-ink placeholder:text-ink-muted/50 text-xs rounded-xl pl-8 pr-2.5 py-2 focus:outline-none focus:border-accent focus:bg-surface transition-all"
              />
            </div>
          </div>

          {/* Portfolio */}
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1" htmlFor="portfolio">
              Portfolio / Website
            </label>
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="portfolio"
                type="url"
                placeholder="https://myportfolio.dev"
                value={data.portfolioUrl}
                onChange={(e) => onChange({ portfolioUrl: e.target.value })}
                className="w-full bg-canvas/70 border border-border/80 text-ink placeholder:text-ink-muted/50 text-xs rounded-xl pl-8 pr-2.5 py-2 focus:outline-none focus:border-accent focus:bg-surface transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
