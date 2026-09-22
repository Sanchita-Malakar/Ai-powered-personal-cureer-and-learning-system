"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardData, ModuleType } from "@/types/dashboard";
import { initialDashboardData } from "@/data/mockDashboardData";
import { CompleteStudentProfile } from "@/types/onboarding";

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>(initialDashboardData);
  const [isPlanStarted, setIsPlanStarted] = useState(false);
  const [activeModule, setActiveModule] = useState<ModuleType | null>(null);

  useEffect(() => {
    // Check localStorage for customized student profile
    const hydrateProfile = () => {
      let studentProfile: CompleteStudentProfile | null = null;

      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("career_os_student_profile");
        if (raw) {
          try {
            studentProfile = JSON.parse(raw);
          } catch (e) {}
        }
      }

      if (studentProfile && studentProfile.personalInfo?.fullName) {
        const nameParts = studentProfile.personalInfo.fullName.trim().split(" ");
        const firstName = nameParts[0] || "Student";
        const targetRole = studentProfile.careerPreferences?.primaryRole || "Junior Full-Stack Developer";
        const readiness = studentProfile.calculatedReadiness || 78;

        // Calculate profile completeness
        let completeness = 50;
        if (studentProfile.personalInfo.fullName && studentProfile.personalInfo.college) completeness += 10;
        if (studentProfile.academicProfile.cgpa) completeness += 10;
        if (studentProfile.careerPreferences.targetRoles.length > 0) completeness += 10;
        if (studentProfile.skills.programming.length > 0) completeness += 10;
        if (studentProfile.projects.length > 0) completeness += 10;
        if (studentProfile.resume) completeness += 5;
        completeness = Math.min(completeness, 100);

        setData((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            name: firstName,
            targetRole: targetRole,
            readinessPercentage: readiness,
            profileCompletionPercentage: completeness,
            targetSalary: studentProfile?.careerPreferences?.targetSalary || prev.profile.targetSalary,
            dreamCompanies: studentProfile?.careerPreferences?.dreamCompanies || prev.profile.dreamCompanies,
            college: studentProfile?.personalInfo?.college || prev.profile.college,
          },
          careerProgressPillars: {
            skills: Math.min(readiness + 6, 95),
            dsa: studentProfile?.academicProfile?.subjects?.some((s) => s.name.includes("Data Structures") && s.proficiency === "Mastered") ? 78 : 65,
            resume: studentProfile?.resume?.atsScore || 88,
            interview: Math.round(readiness * 0.9),
          },
          metrics: {
            ...prev.metrics,
            careerGoal: {
              ...prev.metrics.careerGoal,
              value: readiness,
            },
            skillScore: {
              ...prev.metrics.skillScore,
              value: Math.min(readiness + 6, 96),
            },
            resumeScore: {
              ...prev.metrics.resumeScore,
              value: studentProfile?.resume?.atsScore
                ? `${studentProfile.resume.atsScore}/100`
                : prev.metrics.resumeScore.value,
            },
          },
          aiInsight: {
            ...prev.aiInsight,
            quote: `Your ${studentProfile.skills.programming[0]?.name || "Python"} skills are strong, but your DSA performance is currently limiting your ${targetRole} applications.`,
          },
          aiPlan: {
            ...prev.aiPlan,
            rationale: `You are progressing towards the ${targetRole} benchmark for campus placements. Today's primary leverage point is closing your ${
              studentProfile?.careerGoals?.topFocusArea || "core competency"
            } gap.`,
            focusArea: studentProfile?.careerGoals?.topFocusArea || prev.aiPlan.focusArea,
          },
        }));
      }
    };

    hydrateProfile();
  }, []);

  const togglePlanItem = (itemId: string) => {
    setData((prev) => ({
      ...prev,
      aiPlan: {
        ...prev.aiPlan,
        items: prev.aiPlan.items.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        ),
      },
    }));
  };

  const toggleTodayTask = useCallback((taskId: string) => {
    setData((prev) => {
      const nextTasks = prev.todaysTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      return {
        ...prev,
        todaysTasks: nextTasks,
      };
    });
  }, []);

  const openModule = useCallback((type: ModuleType) => {
    setActiveModule(type);
  }, []);

  const closeModule = useCallback(() => {
    setActiveModule(null);
  }, []);

  const startPlan = () => {
    setIsPlanStarted(true);
  };

  const dismissAlert = (alertId: string) => {
    setData((prev) => ({
      ...prev,
      alerts: prev.alerts.filter((alert) => alert.id !== alertId),
    }));
  };

  return {
    data,
    isPlanStarted,
    activeModule,
    openModule,
    closeModule,
    toggleTodayTask,
    togglePlanItem,
    startPlan,
    dismissAlert,
  };
}
