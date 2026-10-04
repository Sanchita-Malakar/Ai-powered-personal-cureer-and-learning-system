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
  SkillItem,
  ProjectItem,
  CertificationItem,
  ExperienceItem,
  CareerGoals,
  ResumeData,
} from "@/types/onboarding";

import { reconcileLegacyProfile } from "@/lib/locationService";
import { supabase } from "@/supabaseClient";

const STORAGE_KEY = "career_os_student_profile";

export function useStudentProfile() {
  const [profile, setProfile] = useState<CompleteStudentProfile>(SAMPLE_ONBOARDED_STUDENT);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load from Supabase (if authenticated) or localStorage / sample fallback
  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        // 1. Check for authenticated Supabase user
        let authUser: any = null;
        try {
          const { data: authData } = await supabase.auth.getUser();
          authUser = authData?.user || null;
          if (isMounted) setCurrentUser(authUser);
        } catch {
          // Auth check failed or offline
        }

        // 2. If authenticated, try loading from Supabase student_profiles table
        if (authUser) {
          try {
            const { data: dbProfile, error } = await supabase
              .from("student_profiles")
              .select("*")
              .eq("user_id", authUser.id)
              .maybeSingle();

            if (!error && dbProfile) {
              // Also query projects and skills if available
              let fetchedProjects = SAMPLE_ONBOARDED_STUDENT.projects;
              let fetchedSkills = SAMPLE_ONBOARDED_STUDENT.skills;

              try {
                const { data: dbProj } = await supabase
                  .from("student_projects")
                  .select("*")
                  .eq("user_id", authUser.id)
                  .order("created_at", { ascending: false });

                if (dbProj && dbProj.length > 0) {
                  fetchedProjects = dbProj.map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    role: p.role,
                    description: p.description,
                    technologies: p.technologies || [],
                    githubUrl: p.github_url,
                    liveUrl: p.live_url || undefined,
                    impactMetrics: p.impact_metrics || undefined,
                    verificationStatus: p.verification_status || "NOT_VERIFIED",
                    verificationScore: p.verification_score || undefined,
                    lastVerifiedAt: p.last_verified_at || undefined,
                    rootPath: p.root_path || undefined,
                    githubRepositoryId: p.github_repository_id ? Number(p.github_repository_id) : undefined,
                    verifiedCommitSha: p.verified_commit_sha || undefined,
                  }));
                }
              } catch (e) {
                // Table might be pending or offline
              }

              try {
                const { data: dbSk } = await supabase
                  .from("student_skills")
                  .select("*")
                  .eq("user_id", authUser.id);

                if (dbSk && dbSk.length > 0) {
                  const prog: SkillItem[] = [];
                  const dev: SkillItem[] = [];
                  const aiml: SkillItem[] = [];
                  const dat: SkillItem[] = [];
                  const cld: SkillItem[] = [];

                  dbSk.forEach((s: any) => {
                    const item: SkillItem = {
                      id: s.id,
                      name: s.name,
                      category: s.category || "Development",
                      proficiency: s.claimed_level || "Beginner",
                      isClaimed: s.student_claimed !== false,
                      isVerified: Boolean(s.verified),
                      verifiedPercentage: s.verified_percentage || 20,
                      verifiedLevel: s.verified_level || "Exposure",
                      evidenceProjectsCount: s.evidence_projects_count || 0,
                      confidenceScore: s.confidence_score || 0.2,
                      lastVerifiedAt: s.last_verified_at || undefined,
                    };
                    if (s.category === "Programming") prog.push(item);
                    else if (s.category === "AI/ML") aiml.push(item);
                    else if (s.category === "Data") dat.push(item);
                    else if (s.category === "Cloud & DevOps") cld.push(item);
                    else dev.push(item);
                  });

                  fetchedSkills = {
                    programming: prog.length > 0 ? prog : SAMPLE_ONBOARDED_STUDENT.skills.programming,
                    development: dev.length > 0 ? dev : SAMPLE_ONBOARDED_STUDENT.skills.development,
                    aiMl: aiml.length > 0 ? aiml : SAMPLE_ONBOARDED_STUDENT.skills.aiMl,
                    data: dat.length > 0 ? dat : SAMPLE_ONBOARDED_STUDENT.skills.data,
                    cloudDevOps: cld.length > 0 ? cld : SAMPLE_ONBOARDED_STUDENT.skills.cloudDevOps,
                    otherSkills: SAMPLE_ONBOARDED_STUDENT.skills.otherSkills,
                  };
                }
              } catch (e) {}

              const merged: CompleteStudentProfile = {
                ...SAMPLE_ONBOARDED_STUDENT,
                personalInfo: {
                  fullName: dbProfile.full_name || authUser.user_metadata?.full_name || "",
                  email: dbProfile.email || authUser.email || "",
                  phone: dbProfile.phone || "",
                  degree: dbProfile.degree || "B.Tech Computer Science & Engineering",
                  college: dbProfile.institution_name || "",
                  graduationYear: dbProfile.graduation_year || "2025",
                  locationCity: dbProfile.current_city || "",
                  linkedInUrl: dbProfile.linkedin_url || "",
                  githubUrl: dbProfile.github_url || "",
                  portfolioUrl: dbProfile.portfolio_url || "",
                  country: dbProfile.country_name || "",
                  countryCode: dbProfile.country_code || "",
                  cityId: dbProfile.city_id || undefined,
                  cityDetails: dbProfile.city_details || undefined,
                  universityId: dbProfile.university_id || undefined,
                  universityDetails: dbProfile.university_details || undefined,
                },
                academicProfile: {
                  ...SAMPLE_ONBOARDED_STUDENT.academicProfile,
                  branch: dbProfile.department_branch || "Computer Science & Engineering",
                  semester: dbProfile.current_semester || "Semester 7",
                  cgpa: dbProfile.cgpa !== null && dbProfile.cgpa !== undefined ? String(dbProfile.cgpa) : "",
                  gradingScale: dbProfile.grading_scale || "10.0",
                  tenthPercentage: dbProfile.tenth_percentage || "",
                  twelfthPercentage: dbProfile.twelfth_percentage || "",
                  activeBacklogs: dbProfile.active_backlogs || "0",
                  subjects:
                    Array.isArray(dbProfile.coursework_subjects) && dbProfile.coursework_subjects.length > 0
                      ? dbProfile.coursework_subjects
                      : SAMPLE_ONBOARDED_STUDENT.academicProfile.subjects,
                },
                projects: fetchedProjects,
                skills: fetchedSkills,
              };

              if (typeof window !== "undefined") {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              }

              if (isMounted) {
                setProfile(merged);
                setLoading(false);
              }
              return;
            }
          } catch (dbErr) {
            console.warn("Could not query Supabase student tables:", dbErr);
          }
        }

        // 3. Fallback to localStorage or default
        if (typeof window !== "undefined") {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            try {
              const parsed: CompleteStudentProfile = JSON.parse(raw);

              // Safe migration / normalization strategy for existing users:
              if (parsed && parsed.personalInfo) {
                const reconciled = reconcileLegacyProfile({
                  country: parsed.personalInfo.country,
                  countryCode: parsed.personalInfo.countryCode,
                  cityId: parsed.personalInfo.cityId,
                  locationCity: parsed.personalInfo.locationCity,
                  universityId: parsed.personalInfo.universityId,
                  college: parsed.personalInfo.college,
                });

                let modified = false;

                if (reconciled.country && !parsed.personalInfo.countryCode) {
                  parsed.personalInfo.country = reconciled.country.name;
                  parsed.personalInfo.countryCode = reconciled.country.code;
                  modified = true;
                }

                if (reconciled.city && !parsed.personalInfo.cityId) {
                  parsed.personalInfo.cityId = reconciled.city.id;
                  parsed.personalInfo.cityDetails = reconciled.city;
                  parsed.personalInfo.locationCity = `${reconciled.city.name}, ${reconciled.city.state}, ${reconciled.city.country}`;
                  modified = true;
                }

                if (reconciled.university && !parsed.personalInfo.universityId) {
                  parsed.personalInfo.universityId = reconciled.university.id;
                  parsed.personalInfo.universityDetails = reconciled.university;
                  parsed.personalInfo.college = reconciled.university.officialName;
                  modified = true;
                }

                if (
                  reconciled.legacyCountryNeedsConfirmation ||
                  reconciled.legacyCityNeedsConfirmation ||
                  reconciled.legacyCollegeNeedsConfirmation
                ) {
                  parsed.personalInfo.locationNeedsConfirmation = true;
                  modified = true;
                }

                if (modified) {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
                }
              }

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

    // Listen for auth state changes to re-sync
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setCurrentUser(session?.user || null);
        if (session?.user) {
          loadProfile();
        }
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
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

      // Persist in user-scoped localStorage
      if (typeof window !== "undefined") {
        const userKey = currentUser?.id ? `career_os_student_profile_${currentUser.id}` : STORAGE_KEY;
        localStorage.setItem(userKey, JSON.stringify(finalProfile));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(finalProfile));
        window.dispatchEvent(new CustomEvent("student-profile-updated", { detail: finalProfile }));
      }

      // Sync to Supabase student_profiles table if user is authenticated
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;

        if (user) {
          const personal = finalProfile.personalInfo;
          const academic = finalProfile.academicProfile;

          const parsedCgpa = academic.cgpa ? parseFloat(academic.cgpa) : null;

          await supabase.from("student_profiles").upsert(
            {
              user_id: user.id,
              full_name: personal.fullName || user.user_metadata?.full_name || "",
              email: personal.email || user.email || "",
              phone: personal.phone || null,
              country_name: personal.country || null,
              country_code: personal.countryCode || null,
              city_id: personal.cityId || null,
              current_city: personal.locationCity || null,
              city_details: personal.cityDetails || {},
              location_verified: Boolean(personal.cityId),
              university_id: personal.universityId || null,
              institution_name: personal.college || null,
              university_details: personal.universityDetails || {},
              institution_verified: Boolean(personal.universityId),
              degree: personal.degree || null,
              graduation_year: personal.graduationYear || null,
              github_url: personal.githubUrl || null,
              linkedin_url: personal.linkedInUrl || null,
              portfolio_url: personal.portfolioUrl || null,
              // Academic Details
              cgpa: isNaN(parsedCgpa as number) ? null : parsedCgpa,
              grading_scale: academic.gradingScale || "10.0",
              current_semester: academic.semester || null,
              department_branch: academic.branch || null,
              tenth_percentage: academic.tenthPercentage || null,
              twelfth_percentage: academic.twelfthPercentage || null,
              active_backlogs: academic.activeBacklogs || "0",
              coursework_subjects: academic.subjects || [],
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

          // Sync projects to student_projects
          if (finalProfile.projects && finalProfile.projects.length > 0) {
            const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            for (const proj of finalProfile.projects) {
              const projectPayload: any = {
                user_id: user.id,
                title: proj.title || "Featured Project",
                role: proj.role || "Developer",
                description: proj.description || "",
                technologies: proj.technologies || [],
                github_url: proj.githubUrl || "https://github.com",
                live_url: proj.liveUrl || null,
                impact_metrics: proj.impactMetrics || null,
                verification_status: proj.verificationStatus || "NOT_VERIFIED",
                verification_score: proj.verificationScore || null,
                last_verified_at: proj.lastVerifiedAt || null,
                root_path: proj.rootPath || null,
                github_repository_id: proj.githubRepositoryId ? Number(proj.githubRepositoryId) : null,
                verified_commit_sha: proj.verifiedCommitSha || null,
                updated_at: new Date().toISOString(),
              };

              if (UUID_REGEX.test(proj.id)) {
                projectPayload.id = proj.id;
                await supabase.from("student_projects").upsert(projectPayload, { onConflict: "id" });
              } else {
                // If it's a client ID (e.g. proj-1), look up by user and github_url or insert
                const { data: existing } = await supabase
                  .from("student_projects")
                  .select("id")
                  .eq("user_id", user.id)
                  .eq("github_url", projectPayload.github_url)
                  .maybeSingle();

                if (existing?.id) {
                  projectPayload.id = existing.id;
                  await supabase.from("student_projects").upsert(projectPayload, { onConflict: "id" });
                  proj.id = existing.id;
                } else {
                  const { data: inserted } = await supabase
                    .from("student_projects")
                    .insert(projectPayload)
                    .select("id")
                    .maybeSingle();
                  if (inserted?.id) {
                    proj.id = inserted.id;
                  }
                }
              }
            }
          }

          // Sync skills to student_skills
          const allSkills: SkillItem[] = [
            ...(finalProfile.skills.programming || []),
            ...(finalProfile.skills.development || []),
            ...(finalProfile.skills.aiMl || []),
            ...(finalProfile.skills.data || []),
            ...(finalProfile.skills.cloudDevOps || []),
          ];

          for (const s of allSkills) {
            await supabase.from("student_skills").upsert(
              {
                user_id: user.id,
                name: s.name,
                category: s.category || "Development",
                student_claimed: s.isClaimed !== false,
                claimed_level: s.proficiency || "Beginner",
                verified: Boolean(s.isVerified),
                verified_percentage: s.verifiedPercentage || 20,
                verified_level: s.verifiedLevel || "Exposure",
                confidence_score: s.confidenceScore || 0.2,
                evidence_projects_count: s.evidenceProjectsCount || 0,
                last_verified_at: s.lastVerifiedAt || null,
              },
              { onConflict: "user_id,name" }
            );
          }
        }
      } catch (syncErr) {
        console.warn("Supabase student tables sync notice:", syncErr);
      }

      return finalProfile;
    },
    [currentUser]
  );

  const persistLocal = useCallback(
    (next: CompleteStudentProfile) => {
      if (typeof window !== "undefined") {
        const userKey = currentUser?.id ? `career_os_student_profile_${currentUser.id}` : STORAGE_KEY;
        localStorage.setItem(userKey, JSON.stringify(next));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent("student-profile-updated", { detail: next }));
      }
    },
    [currentUser]
  );

  const updatePersonalInfo = useCallback(
    (updates: Partial<PersonalInfo>) => {
      setProfile((prev) => {
        const next = {
          ...prev,
          personalInfo: { ...prev.personalInfo, ...updates },
        };
        persistLocal(next);
        return next;
      });
    },
    [persistLocal]
  );

  const updateAcademicProfile = useCallback(
    (updates: Partial<AcademicProfile>) => {
      setProfile((prev) => {
        const next = {
          ...prev,
          academicProfile: { ...prev.academicProfile, ...updates },
        };
        persistLocal(next);
        return next;
      });
    },
    [persistLocal]
  );

  const updateCareerPreferences = useCallback(
    (updates: Partial<CareerPreferences>) => {
      setProfile((prev) => {
        const next = {
          ...prev,
          careerPreferences: { ...prev.careerPreferences, ...updates },
        };
        persistLocal(next);
        return next;
      });
    },
    [persistLocal]
  );

  const updateSkills = useCallback(
    (updates: Partial<SkillsMatrix>) => {
      setProfile((prev) => {
        const next = {
          ...prev,
          skills: { ...prev.skills, ...updates },
        };
        persistLocal(next);
        return next;
      });
    },
    [persistLocal]
  );

  const updateProjects = useCallback(
    (projects: ProjectItem[]) => {
      setProfile((prev) => {
        const next = { ...prev, projects };
        persistLocal(next);
        return next;
      });
    },
    [persistLocal]
  );

  const updateCertifications = useCallback(
    (certifications: CertificationItem[]) => {
      setProfile((prev) => {
        const next = { ...prev, certifications };
        persistLocal(next);
        return next;
      });
    },
    [persistLocal]
  );

  const updateExperiences = useCallback(
    (experiences: ExperienceItem[]) => {
      setProfile((prev) => {
        const next = { ...prev, experiences };
        persistLocal(next);
        return next;
      });
    },
    [persistLocal]
  );

  const updateCareerGoals = useCallback(
    (updates: Partial<CareerGoals>) => {
      setProfile((prev) => {
        const next = {
          ...prev,
          careerGoals: { ...prev.careerGoals, ...updates },
        };
        persistLocal(next);
        return next;
      });
    },
    [persistLocal]
  );

  const updateResume = useCallback(
    (resume: ResumeData | null) => {
      setProfile((prev) => {
        const next = { ...prev, resume };
        persistLocal(next);
        return next;
      });
    },
    [persistLocal]
  );

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
