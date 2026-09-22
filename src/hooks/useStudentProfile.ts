"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CompleteStudentProfile,
  DEFAULT_STUDENT_PROFILE,
  SAMPLE_ONBOARDED_STUDENT,
  PersonalInfo,
  AcademicProfile,
  CareerPreferences,
  SkillsMatrix,
  ProjectItem,
  CertificationItem,
  ExperienceItem,
  CareerGoals,
  ResumeData,
} from "@/types/onboarding";

const STORAGE_KEY = "career_os_student_profile";

export function useStudentProfile() {
  const [profile, setProfile] = useState<CompleteStudentProfile>(SAMPLE_ONBOARDED_STUDENT);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load from localStorage or initialize with sample onboarded student
  useEffect(() => {
    let isMounted = true;

    const loadProfile = () => {
      try {
        if (typeof window !== "undefined") {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              if (isMounted) setProfile(parsed);
              return;
            } catch (e) {
              console.error("Failed to parse localStorage profile", e);
            }
          }
          // Seed with default sample profile if none exists
          localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_ONBOARDED_STUDENT));
          if (isMounted) setProfile(SAMPLE_ONBOARDED_STUDENT);
        }
      } catch (err) {
        console.error("Error loading student profile", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const saveToStorageAndSupabase = useCallback(
    async (updatedProfile: CompleteStudentProfile, markCompleted: boolean = false) => {
      const finalProfile: CompleteStudentProfile = {
        ...updatedProfile,
        onboardingCompleted: markCompleted ? true : updatedProfile.onboardingCompleted,
        completedAt: markCompleted ? new Date().toISOString() : updatedProfile.completedAt,
      };

      setProfile(finalProfile);

      // Persist in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(finalProfile));
      }

      return finalProfile;
    },
    []
  );

  const updatePersonalInfo = useCallback((updates: Partial<PersonalInfo>) => {
    setProfile((prev) => {
      const next = {
        ...prev,
        personalInfo: { ...prev.personalInfo, ...updates },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const updateAcademicProfile = useCallback((updates: Partial<AcademicProfile>) => {
    setProfile((prev) => {
      const next = {
        ...prev,
        academicProfile: { ...prev.academicProfile, ...updates },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const updateCareerPreferences = useCallback((updates: Partial<CareerPreferences>) => {
    setProfile((prev) => {
      const next = {
        ...prev,
        careerPreferences: { ...prev.careerPreferences, ...updates },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const updateSkills = useCallback((updates: Partial<SkillsMatrix>) => {
    setProfile((prev) => {
      const next = {
        ...prev,
        skills: { ...prev.skills, ...updates },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const updateProjects = useCallback((projects: ProjectItem[]) => {
    setProfile((prev) => {
      const next = { ...prev, projects };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const updateCertifications = useCallback((certifications: CertificationItem[]) => {
    setProfile((prev) => {
      const next = { ...prev, certifications };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const updateExperiences = useCallback((experiences: ExperienceItem[]) => {
    setProfile((prev) => {
      const next = { ...prev, experiences };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const updateCareerGoals = useCallback((updates: Partial<CareerGoals>) => {
    setProfile((prev) => {
      const next = {
        ...prev,
        careerGoals: { ...prev.careerGoals, ...updates },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const updateResume = useCallback((resume: ResumeData | null) => {
    setProfile((prev) => {
      const next = { ...prev, resume };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const saveDraft = useCallback(async () => {
    return await saveToStorageAndSupabase(profile, false);
  }, [profile, saveToStorageAndSupabase]);

  const completeOnboarding = useCallback(async () => {
    // Calculate a readiness score based on inputs
    let score = 50;
    if (profile.personalInfo.fullName && profile.personalInfo.college) score += 5;
    if (profile.academicProfile.cgpa) score += 5;
    if (profile.academicProfile.activeBacklogs === "0") score += 5;
    if (profile.skills.programming.length >= 2) score += 5;
    if (profile.skills.development.length >= 2) score += 5;
    if (profile.projects.length >= 1) score += 10;
    if (profile.projects.length >= 2) score += 5;
    if (profile.resume) score += 5;
    score = Math.min(score, 94);

    const updatedWithScore = {
      ...profile,
      calculatedReadiness: score,
    };

    return await saveToStorageAndSupabase(updatedWithScore, true);
  }, [profile, saveToStorageAndSupabase]);

  const loadSampleProfile = useCallback(() => {
    setProfile(SAMPLE_ONBOARDED_STUDENT);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_ONBOARDED_STUDENT));
    }
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_STUDENT_PROFILE);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    profile,
    setProfile,
    loading,
    currentUser,
    isOnboarded: Boolean(profile.onboardingCompleted),
    updatePersonalInfo,
    updateAcademicProfile,
    updateCareerPreferences,
    updateSkills,
    updateProjects,
    updateCertifications,
    updateExperiences,
    updateCareerGoals,
    updateResume,
    saveToStorageAndSupabase,
    saveDraft,
    completeOnboarding,
    loadSampleProfile,
    resetProfile,
  };
}
