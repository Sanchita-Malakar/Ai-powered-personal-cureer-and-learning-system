"use client";

import React, { useState } from "react";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { DEFAULT_AI_FEEDER_INFO, DEFAULT_TARGET_ROLES } from "@/data/mockProfileData";
import { ProfileTabId, TargetRoleDetail } from "@/types/profile";
import { AiFeederBanner } from "./AiFeederBanner";
import { ProfileHeader } from "./ProfileHeader";
import { PersonalDetailsCard } from "./PersonalDetailsCard";
import { EducationCard } from "./EducationCard";
import { SkillsCard } from "./SkillsCard";
import { ProjectsCard } from "./ProjectsCard";
import { CertificationsCard } from "./CertificationsCard";
import { ExperienceCard } from "./ExperienceCard";
import { CareerPreferencesCard } from "./CareerPreferencesCard";
import { ResumeCard } from "./ResumeCard";
import { TargetRolesCard } from "./TargetRolesCard";
import { ProfileEditModal } from "./ProfileEditModal";
import {
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Award,
  Briefcase,
  Compass,
  FileText,
  Target,
  ArrowLeft,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import { CompleteStudentProfile, ProjectItem, CertificationItem, ExperienceItem } from "@/types/onboarding";

interface ProfileSectionProps {
  onBackToDashboard?: () => void;
  onNavigateSection?: (sectionId: string, paramId?: string) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  onBackToDashboard,
  onNavigateSection,
}) => {
  const {
    profile,
    updatePersonalInfo,
    updateAcademicProfile,
    updateCareerPreferences,
    updateSkills,
    updateProjects,
    updateCertifications,
    updateExperiences,
    updateResume,
    saveToStorageAndSupabase,
  } = useStudentProfile();

  const [activeTab, setActiveTab] = useState<ProfileTabId>("all");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editInitialTab, setEditInitialTab] = useState<"personal" | "academic" | "preferences">("personal");
  const [targetRoles, setTargetRoles] = useState<TargetRoleDetail[]>(DEFAULT_TARGET_ROLES);

  const tabs = [
    { id: "all" as const, label: "All Details", icon: LayoutGrid },
    { id: "personal" as const, label: "Personal", icon: User },
    { id: "education" as const, label: "Education", icon: GraduationCap },
    { id: "skills" as const, label: "Skills", icon: Code2 },
    { id: "projects" as const, label: "Projects", icon: FolderGit2 },
    { id: "certifications" as const, label: "Certifications", icon: Award },
    { id: "experience" as const, label: "Experience", icon: Briefcase },
    { id: "preferences" as const, label: "Preferences", icon: Compass },
    { id: "resume" as const, label: "Resume", icon: FileText },
    { id: "targetRoles" as const, label: "Target Roles", icon: Target },
  ];

  const handleOpenEdit = (tab: "personal" | "academic" | "preferences" = "personal") => {
    setEditInitialTab(tab);
    setEditModalOpen(true);
  };

  const handleSaveModal = (updated: CompleteStudentProfile) => {
    saveToStorageAndSupabase(updated);
  };

  const handleSelectPrimaryRole = (roleId: string) => {
    setTargetRoles((prev) =>
      prev.map((r) => ({
        ...r,
        isPrimary: r.id === roleId,
      }))
    );
    const selected = targetRoles.find((r) => r.id === roleId);
    if (selected) {
      updateCareerPreferences({ primaryRole: selected.title });
    }
  };

  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: "New AI/Engineering Project",
      role: "Lead Developer",
      description: "Implemented a full-stack production application with real-time streaming and database persistence.",
      technologies: ["TypeScript", "Next.js", "PostgreSQL", "Docker"],
      impactMetrics: "Reduced execution latency by 25% across test suites.",
    };
    updateProjects([...profile.projects, newProj]);
  };

  const handleAddCertification = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      title: "Professional Cloud / Engineering Certificate",
      issuer: "Amazon Web Services / Coursera",
      issueYear: "2025",
      credentialUrl: "https://aws.amazon.com/verification",
    };
    updateCertifications([...profile.certifications, newCert]);
  };

  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: "Engineering Trainee / Intern",
      company: "NextGen Software Systems",
      location: "Bengaluru, India (Remote)",
      startDate: "Jan 2025",
      endDate: "Present",
      current: true,
      description: "Collaborating with senior staff engineers on microservice architectures and automated CI/CD pipelines.",
      skillsUsed: ["Python", "FastAPI", "Docker", "Git"],
    };
    updateExperiences([...(profile.experiences || []), newExp]);
  };

  return (
    <div className="min-h-screen text-ink space-y-7 animate-in fade-in duration-200">
      {/* 1. Breadcrumbs & Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted">
        <div className="flex items-center gap-2">
          {onBackToDashboard ? (
            <button
              onClick={onBackToDashboard}
              className="hover:text-ink flex items-center gap-1 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          ) : (
            <a
              href="/"
              className="hover:text-ink flex items-center gap-1 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </a>
          )}
          <span>/</span>
          <span className="text-ink font-bold flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-accent" />
            Profile → Student Career Profile
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-accent/10 text-accent border border-accent/20">
            <Sparkles className="w-3 h-3" />
            Feeds AI Recommendation System
          </span>
        </div>
      </div>

      {/* 2. Top Profile Hero Header */}
      <ProfileHeader
        profile={profile}
        onEditProfile={() => handleOpenEdit("personal")}
        onUploadResume={() => onNavigateSection?.("resume")}
        onNavigateSection={onNavigateSection}
      />

      {/* 3. AI Recommendation System Feeder Banner */}
      <AiFeederBanner
        feederInfo={DEFAULT_AI_FEEDER_INFO}
        onNavigateSection={onNavigateSection}
      />

      {/* 4. Section Filter Tabs */}
      <div className="sticky top-14 z-30 bg-canvas/90 backdrop-blur-md py-2.5 -mx-2 px-2 border-b border-border/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? "bg-accent text-white shadow-sm shadow-accent/25"
                  : "bg-surface text-ink-muted hover:text-ink hover:bg-border/60 border border-border/80"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 5. Main Profile Content Cards */}
      <div className="space-y-6">
        {/* Personal Details */}
        {(activeTab === "all" || activeTab === "personal") && (
          <PersonalDetailsCard
            personalInfo={profile.personalInfo}
            careerGoals={profile.careerGoals}
            onEdit={() => handleOpenEdit("personal")}
          />
        )}

        {/* Education */}
        {(activeTab === "all" || activeTab === "education") && (
          <EducationCard
            academicProfile={profile.academicProfile}
            degreeName={profile.personalInfo.degree}
            collegeName={profile.personalInfo.college}
            onEdit={() => handleOpenEdit("academic")}
          />
        )}

        {/* Skills */}
        {(activeTab === "all" || activeTab === "skills") && (
          <SkillsCard
            skills={profile.skills}
            onUpdateSkills={updateSkills}
            onEdit={() => handleOpenEdit("preferences")}
          />
        )}

        {/* Target Roles */}
        {(activeTab === "all" || activeTab === "targetRoles") && (
          <TargetRolesCard
            targetRoles={targetRoles}
            onSelectPrimaryRole={handleSelectPrimaryRole}
            onNavigateSection={onNavigateSection}
            onEdit={() => handleOpenEdit("preferences")}
          />
        )}

        {/* Projects */}
        {(activeTab === "all" || activeTab === "projects") && (
          <ProjectsCard
            projects={profile.projects}
            onAddProject={handleAddProject}
            onEdit={() => handleOpenEdit("preferences")}
          />
        )}

        {/* Experience */}
        {(activeTab === "all" || activeTab === "experience") && (
          <ExperienceCard
            experiences={profile.experiences || []}
            onAddExperience={handleAddExperience}
            onEdit={() => handleOpenEdit("preferences")}
          />
        )}

        {/* Certifications */}
        {(activeTab === "all" || activeTab === "certifications") && (
          <CertificationsCard
            certifications={profile.certifications}
            onAddCertification={handleAddCertification}
            onEdit={() => handleOpenEdit("preferences")}
          />
        )}

        {/* Career Preferences */}
        {(activeTab === "all" || activeTab === "preferences") && (
          <CareerPreferencesCard
            preferences={profile.careerPreferences}
            onEdit={() => handleOpenEdit("preferences")}
          />
        )}

        {/* Resume */}
        {(activeTab === "all" || activeTab === "resume") && (
          <ResumeCard
            resume={profile.resume}
            onUploadNew={() => onNavigateSection?.("resume")}
            onNavigateSection={onNavigateSection}
          />
        )}
      </div>

      {/* Edit Profile Modal */}
      <ProfileEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        profile={profile}
        onSave={handleSaveModal}
        initialTab={editInitialTab}
      />
    </div>
  );
};
