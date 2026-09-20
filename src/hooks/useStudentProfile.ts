"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/supabaseClient";
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
  const [profile, setProfile] = useState<CompleteStudentProfile>(DEFAULT_STUDENT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load from Supabase user metadata or localStorage
  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && isMounted) {
          setCurrentUser(user);
        }

        // Check localStorage first for rapid hydration
        let localData: CompleteStudentProfile | null = null;
        if (typeof window !== "undefined") {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            try {
              localData = JSON.parse(raw);
            } catch (e) {
              console.error("Failed to parse localStorage profile", e);
            }
          }
        }

        // Check Supabase metadata
        const metadataProfile = user?.user_metadata?.career_profile;
        const metadataOnboarded = Boolean(user?.user_metadata?.onboarding_completed);

        if (metadataProfile) {
          const merged: CompleteStudentProfile = {
            ...DEFAULT_STUDENT_PROFILE,
            ...metadataProfile,
            onboardingCompleted: metadataOnboarded ?? metadataProfile.onboardingCompleted ?? false,
          };
          if (isMounted) {
            setProfile(merged);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          }
        } else if (localData) {
          if (isMounted) {
            setProfile(localData);
          }
        } else if (user) {
          // Pre-populate with auth data if available
          if (isMounted) {
            setProfile((prev) => ({
              ...prev,
              personalInfo: {
                ...prev.personalInfo,
                fullName: user.user_metadata?.full_name || prev.personalInfo.fullName,
                email: user.email || prev.personalInfo.email,
                phone: user.user_metadata?.phone || prev.personalInfo.phone,
              },
              careerPreferences: {
                ...prev.careerPreferences,
                primaryRole: user.user_metadata?.target_role || prev.careerPreferences.primaryRole,
                targetRoles: user.user_metadata?.target_role
                  ? [user.user_metadata.target_role]
                  : prev.careerPreferences.targetRoles,
              },
            }));
          }
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

      // Persist in Supabase user_metadata if user is signed in
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.auth.updateUser({
            data: {
              career_profile: finalProfile,
              onboarding_completed: finalProfile.onboardingCompleted,
              full_name: finalProfile.personalInfo.fullName || user.user_metadata?.full_name,
              target_role: finalProfile.careerPreferences.primaryRole || user.user_metadata?.target_role,
            },
          });
        }
      } catch (err) {
        console.error("Supabase profile sync warning:", err);
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
