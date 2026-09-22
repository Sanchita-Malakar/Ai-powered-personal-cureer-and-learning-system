"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopAreaSnapshot } from "@/components/dashboard/TopAreaSnapshot";
import { AiInsightCard } from "@/components/dashboard/AiInsightCard";
import { CareerProgressCard } from "@/components/dashboard/CareerProgressCard";
import { TodaysTasksCard } from "@/components/dashboard/TodaysTasksCard";
import { SkillOverviewCard } from "@/components/dashboard/SkillOverviewCard";
import { UpcomingCard } from "@/components/dashboard/UpcomingCard";
import { RecommendedActionsGrid } from "@/components/dashboard/RecommendedActionsGrid";
import { ActiveModuleModal } from "@/components/dashboard/ActiveModuleModal";
import { CareerRoadmap } from "@/components/dashboard/CareerRoadmap";
import { RecommendedJobs } from "@/components/dashboard/RecommendedJobs";
import { RecentApplications } from "@/components/dashboard/RecentApplications";
import { RoadmapSection } from "@/components/roadmap/RoadmapSection";
import { JobTrackerSection } from "@/components/jobs/JobTrackerSection";
import { ResumeAnalyzerSection } from "@/components/resume/ResumeAnalyzerSection";
import { InterviewTrainerSection } from "@/components/interview/InterviewTrainerSection";
import { DsaTrainerSection } from "@/components/dsa/DsaTrainerSection";
import { LearningSection } from "@/components/learning/LearningSection";
import { MentorSection } from "@/components/mentor/MentorSection";
import { ProgressSection } from "@/components/progress/ProgressSection";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { useDashboardData } from "@/hooks/useDashboardData";
import { ModuleType } from "@/types/dashboard";

export default function DashboardPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"dashboard" | "roadmap" | "jobs" | "resume" | "interview" | "dsa" | "learning" | "mentor" | "progress" | "profile" | "settings">("dashboard");
  const [targetJobForResume, setTargetJobForResume] = useState<string>("job-stripe-intern");

  const {
    data,
    activeModule,
    openModule,
    closeModule,
    toggleTodayTask,
  } = useDashboardData();

  // Sync section with URL hash if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleHashChange = () => {
        if (window.location.hash === "#roadmap") {
          setActiveSection("roadmap");
        } else if (window.location.hash === "#jobs") {
          setActiveSection("jobs");
        } else if (window.location.hash === "#resume") {
          setActiveSection("resume");
        } else if (window.location.hash === "#interview") {
          setActiveSection("interview");
        } else if (window.location.hash === "#dsa") {
          setActiveSection("dsa");
        } else if (window.location.hash === "#learning") {
          setActiveSection("learning");
        } else if (window.location.hash === "#mentor") {
          setActiveSection("mentor");
        } else if (window.location.hash === "#progress") {
          setActiveSection("progress");
        } else if (window.location.hash === "#profile") {
          setActiveSection("profile");
        } else if (window.location.hash === "#settings") {
          setActiveSection("settings");
        } else if (window.location.hash === "#dashboard" || window.location.hash === "") {
          setActiveSection("dashboard");
        }
      };

      handleHashChange();
      window.addEventListener("hashchange", handleHashChange);
      return () => window.removeEventListener("hashchange", handleHashChange);
    }
  }, []);

  const handleSelectSection = (sectionId: string, jobId?: string) => {
    if (jobId) {
      setTargetJobForResume(jobId);
    }

    if (sectionId === "roadmap") {
      setActiveSection("roadmap");
      if (typeof window !== "undefined") {
        window.location.hash = "roadmap";
      }
    } else if (sectionId === "jobs") {
      setActiveSection("jobs");
      if (typeof window !== "undefined") {
        window.location.hash = "jobs";
      }
    } else if (sectionId === "resume") {
      setActiveSection("resume");
      if (typeof window !== "undefined") {
        window.location.hash = "resume";
      }
    } else if (sectionId === "interview") {
      setActiveSection("interview");
      if (typeof window !== "undefined") {
        window.location.hash = "interview";
      }
    } else if (sectionId === "dsa") {
      setActiveSection("dsa");
      if (typeof window !== "undefined") {
        window.location.hash = "dsa";
      }
    } else if (sectionId === "learning") {
      setActiveSection("learning");
      if (typeof window !== "undefined") {
        window.location.hash = "learning";
      }
    } else if (sectionId === "mentor") {
      setActiveSection("mentor");
      if (typeof window !== "undefined") {
        window.location.hash = "mentor";
      }
    } else if (sectionId === "progress") {
      setActiveSection("progress");
      if (typeof window !== "undefined") {
        window.location.hash = "progress";
      }
    } else if (sectionId === "profile") {
      setActiveSection("profile");
      if (typeof window !== "undefined") {
        window.location.hash = "profile";
      }
    } else if (sectionId === "settings") {
      setActiveSection("settings");
      if (typeof window !== "undefined") {
        window.location.hash = "settings";
      }
    } else if (sectionId === "dashboard") {
      setActiveSection("dashboard");
      if (typeof window !== "undefined") {
        window.location.hash = "dashboard";
      }
    }
  };

  const handleOpenAction = (module: ModuleType) => {
    if (module === "jobs") {
      handleSelectSection("jobs");
    } else if (module === "resume") {
      handleSelectSection("resume");
    } else if (module === "interview") {
      handleSelectSection("interview");
    } else if (module === "dsa") {
      handleSelectSection("dsa");
    } else if (module === "learning") {
      handleSelectSection("learning");
    } else {
      openModule(module);
    }
  };

  return (
    <div className="min-h-screen bg-canvas bg-ambient-mesh text-ink transition-colors duration-200">
        {/* 1. Full-width Top Navbar */}
        <Navbar onToggleMobileMenu={() => setMobileNavOpen((prev) => !prev)} />

        {/* 2. Left Icon-only Sidebar (64px fixed) */}
        <Sidebar
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
        />

        {/* 3. Main Dashboard Content (Responsive max-width and padding) */}
        <main className="pt-14 md:pl-16 min-h-screen">
          <div className="w-full max-w-[1160px] px-3.5 sm:px-6 lg:px-8 py-5 sm:py-7 animate-in fade-in duration-300">
            {activeSection === "roadmap" ? (
              /* Career Roadmap Section opened directly inside page from Sidebar or Dashboard cards */
              <RoadmapSection
                onBackToDashboard={() => handleSelectSection("dashboard")}
              />
            ) : activeSection === "jobs" ? (
              /* Job Tracker Section opened directly inside page from Sidebar or Dashboard cards */
              <JobTrackerSection
                onBackToDashboard={() => handleSelectSection("dashboard")}
                onAnalyzeResumeWithJob={(jobId) => handleSelectSection("resume", jobId)}
              />
            ) : activeSection === "resume" ? (
              /* Resume Analyzer Section opened directly inside page from Sidebar, Action cards, or Job Tracker */
              <ResumeAnalyzerSection
                initialJobId={targetJobForResume}
                onBackToDashboard={() => handleSelectSection("dashboard")}
              />
            ) : activeSection === "interview" ? (
              /* Interview Trainer Section opened directly inside page from Sidebar or Dashboard cards */
              <InterviewTrainerSection
                onBackToDashboard={() => handleSelectSection("dashboard")}
                onNavigateToRoadmap={() => handleSelectSection("roadmap")}
              />
            ) : activeSection === "dsa" ? (
              /* DSA & Skill Trainer Section opened directly inside page from Sidebar, Action cards, or Tasks */
              <DsaTrainerSection
                onBackToDashboard={() => handleSelectSection("dashboard")}
                onOpenRoadmap={() => handleSelectSection("roadmap")}
              />
            ) : activeSection === "learning" ? (
              /* Learning Section opened directly inside page from Sidebar, Action cards, or Tasks */
              <LearningSection
                onBackToDashboard={() => handleSelectSection("dashboard")}
                onNavigateToRoadmap={() => handleSelectSection("roadmap")}
              />
            ) : activeSection === "mentor" ? (
              /* AI Career Assistant (AI Mentor) Section opened directly inside page */
              <MentorSection
                onBackToDashboard={() => handleSelectSection("dashboard")}
                onNavigateSection={(sec, param) => handleSelectSection(sec, param)}
              />
            ) : activeSection === "progress" ? (
              /* Progress Page (Long-Term Performance Center) opened directly inside page */
              <ProgressSection
                onBackToDashboard={() => handleSelectSection("dashboard")}
                onNavigateSection={(sec, param) => handleSelectSection(sec, param)}
              />
            ) : activeSection === "profile" ? (
              /* Profile Section (Complete Career Profile & AI Feeder) opened directly inside page */
              <ProfileSection
                onBackToDashboard={() => handleSelectSection("dashboard")}
                onNavigateSection={(sec, param) => handleSelectSection(sec, param)}
              />
            ) : activeSection === "settings" ? (
              /* Settings Section (Account, Notifications, Privacy, Security) opened directly inside page */
              <SettingsSection
                onBackToDashboard={() => handleSelectSection("dashboard")}
                onNavigateSection={(sec, param) => handleSelectSection(sec, param)}
              />
            ) : (
              /* Main Home Page Dashboard Snapshot */
              <>
                {/* Top Area: Welcome message, Profile completion, Current career goal, Overall career progress */}
                <TopAreaSnapshot profile={data.profile} />

                {/* AI Insights Card */}
                <AiInsightCard
                  insight={data.aiInsight}
                  onOpenModule={handleOpenAction}
                />

                {/* Main Cards: 2x2 Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-stretch mb-6">
                  {/* Card 1: Career Progress */}
                  <CareerProgressCard
                    profile={data.profile}
                    pillars={data.careerProgressPillars}
                    onOpenModule={handleOpenAction}
                    onOpenRoadmap={() => handleSelectSection("roadmap")}
                    onOpenProgress={() => handleSelectSection("progress")}
                  />

                  {/* Card 2: Today's Tasks */}
                  <TodaysTasksCard
                    tasks={data.todaysTasks}
                    onToggleTask={toggleTodayTask}
                    onOpenModule={handleOpenAction}
                  />

                  {/* Card 3: Skill Overview */}
                  <SkillOverviewCard
                    skills={data.skillsOverview}
                    onOpenModule={handleOpenAction}
                  />

                  {/* Card 4: Upcoming */}
                  <UpcomingCard
                    items={data.upcomingItems}
                    onOpenModule={handleOpenAction}
                  />
                </div>

                {/* Recommended Actions: 5 Cards with click-to-module */}
                <RecommendedActionsGrid
                  actions={data.recommendedActions}
                  onOpenModule={handleOpenAction}
                />

                {/* Supporting Deep Dives: Career Roadmap & Target Jobs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-stretch">
                  <CareerRoadmap
                    milestones={data.roadmap.milestones}
                    currentMilestoneIndex={data.roadmap.currentMilestoneIndex}
                    onOpenRoadmap={() => handleSelectSection("roadmap")}
                  />
                  <RecommendedJobs
                    jobs={data.recommendedJobs}
                    onOpenJobTracker={() => handleSelectSection("jobs")}
                  />
                </div>
              </>
            )}
          </div>
        </main>

        {/* Interactive Module Slide-over / Modal */}
        <ActiveModuleModal
          activeModule={activeModule}
          onClose={closeModule}
          onCompleteTask={toggleTodayTask}
        />
      </div>
  );
}
