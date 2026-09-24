"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/supabaseClient";
import { User, Session } from "@supabase/supabase-js";
import { SAMPLE_ONBOARDED_STUDENT, CompleteStudentProfile } from "@/types/onboarding";

export interface StudentAuthUser {
  id: string;
  email: string;
  fullName: string;
  college?: string;
  targetRole?: string;
  avatarUrl?: string;
  isDemo?: boolean;
}

interface SignUpMetadata {
  fullName: string;
  college: string;
  targetRole: string;
  degree?: string;
}

interface AuthContextType {
  user: StudentAuthUser | null;
  supabaseUser: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isSupabaseConnected: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (
    email: string,
    password: string,
    metadata: SignUpMetadata
  ) => Promise<{ success: boolean; requiresEmailConfirmation?: boolean; error?: string }>;
  signInWithOAuth: (provider: "google" | "github") => Promise<{ success: boolean; error?: string }>;
  signInWithDemo: (preset?: "alex" | "priya") => Promise<{ success: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = "career_os_auth_user";
const LOCAL_STORAGE_PROFILE_KEY = "career_os_student_profile";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<StudentAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync state from Supabase or localStorage on load
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // 1. Check local session cache first for fast render
        if (typeof window !== "undefined") {
          const cachedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
          if (cachedUser) {
            try {
              const parsed = JSON.parse(cachedUser);
              if (isMounted) setUser(parsed);
            } catch (e) {
              console.error("Failed to parse cached user", e);
            }
          }
        }

        // 2. If Supabase is configured, check live session
        if (isSupabaseConfigured) {
          const { data, error } = await supabase.auth.getSession();
          if (!error && data?.session?.user && isMounted) {
            const sbUser = data.session.user;
            setSession(data.session);
            setSupabaseUser(sbUser);

            const studentUser: StudentAuthUser = {
              id: sbUser.id,
              email: sbUser.email || "",
              fullName:
                sbUser.user_metadata?.full_name ||
                sbUser.user_metadata?.fullName ||
                sbUser.email?.split("@")[0] ||
                "Student User",
              college: sbUser.user_metadata?.college || "University",
              targetRole: sbUser.user_metadata?.targetRole || "Software Engineer",
              avatarUrl: sbUser.user_metadata?.avatar_url,
              isDemo: false,
            };

            setUser(studentUser);
            if (typeof window !== "undefined") {
              localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(studentUser));
            }
          }
        }
      } catch (err) {
        console.warn("Auth initialization warning:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    // Listen to Supabase auth state change if enabled
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (!isMounted) return;

        setSession(newSession);
        if (newSession?.user) {
          const sbUser = newSession.user;
          setSupabaseUser(sbUser);
          const studentUser: StudentAuthUser = {
            id: sbUser.id,
            email: sbUser.email || "",
            fullName:
              sbUser.user_metadata?.full_name ||
              sbUser.user_metadata?.fullName ||
              sbUser.email?.split("@")[0] ||
              "Student User",
            college: sbUser.user_metadata?.college || "University",
            targetRole: sbUser.user_metadata?.targetRole || "Software Engineer",
            avatarUrl: sbUser.user_metadata?.avatar_url,
            isDemo: false,
          };
          setUser(studentUser);
          if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(studentUser));
          }
        } else {
          // If session expired or logged out from Supabase and not a demo user
          if (user && !user.isDemo) {
            setUser(null);
            if (typeof window !== "undefined") {
              localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
            }
          }
          setSupabaseUser(null);
        }
      });
      authListener = data;
    }

    return () => {
      isMounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data?.user) {
          const studentUser: StudentAuthUser = {
            id: data.user.id,
            email: data.user.email || email,
            fullName:
              data.user.user_metadata?.full_name ||
              data.user.user_metadata?.fullName ||
              email.split("@")[0],
            college: data.user.user_metadata?.college || "Engineering College",
            targetRole: data.user.user_metadata?.targetRole || "Software Engineer",
            isDemo: false,
          };

          setUser(studentUser);
          setSupabaseUser(data.user);
          setSession(data.session);

          if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(studentUser));

            // Sync with local student profile
            const rawProfile = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
            if (rawProfile) {
              try {
                const currentProfile = JSON.parse(rawProfile);
                currentProfile.personalInfo = {
                  ...currentProfile.personalInfo,
                  email: studentUser.email,
                  fullName: studentUser.fullName || currentProfile.personalInfo.fullName,
                };
                localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(currentProfile));
              } catch (e) {}
            }
          }

          return { success: true };
        }
      }

      // If Supabase is not configured or in sandbox fallback
      const fallbackUser: StudentAuthUser = {
        id: "usr-" + Date.now(),
        email,
        fullName: email.split("@")[0],
        college: "University Campus",
        targetRole: "Software Engineer",
        isDemo: true,
      };
      setUser(fallbackUser);
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fallbackUser));
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "An unexpected error occurred during sign in." };
    }
  }, []);

  const signUpWithEmail = useCallback(
    async (email: string, password: string, metadata: SignUpMetadata) => {
      try {
        if (isSupabaseConfigured) {
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: {
                full_name: metadata.fullName,
                college: metadata.college,
                targetRole: metadata.targetRole,
                degree: metadata.degree,
              },
            },
          });

          if (error) {
            return { success: false, error: error.message };
          }

          const requiresEmailConfirmation = Boolean(data?.user && !data?.session);

          const studentUser: StudentAuthUser = {
            id: data?.user?.id || "usr-" + Date.now(),
            email,
            fullName: metadata.fullName,
            college: metadata.college,
            targetRole: metadata.targetRole,
            isDemo: false,
          };

          if (!requiresEmailConfirmation && data?.session) {
            setUser(studentUser);
            setSupabaseUser(data.user);
            setSession(data.session);
            if (typeof window !== "undefined") {
              localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(studentUser));
            }
          }

          // Update student profile in local storage with the user's registration details
          if (typeof window !== "undefined") {
            const rawProfile = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
            const baseProfile = rawProfile ? JSON.parse(rawProfile) : SAMPLE_ONBOARDED_STUDENT;
            const updatedProfile: CompleteStudentProfile = {
              ...baseProfile,
              personalInfo: {
                ...baseProfile.personalInfo,
                fullName: metadata.fullName,
                email: email,
                college: metadata.college,
                degree: metadata.degree || baseProfile.personalInfo.degree,
              },
              careerPreferences: {
                ...baseProfile.careerPreferences,
                primaryRole: metadata.targetRole,
                targetRoles: [metadata.targetRole, ...(baseProfile.careerPreferences.targetRoles || [])].filter(
                  (v, i, a) => a.indexOf(v) === i
                ),
              },
            };
            localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updatedProfile));
          }

          return {
            success: true,
            requiresEmailConfirmation,
          };
        }

        // Fallback demo signup
        const demoUser: StudentAuthUser = {
          id: "usr-" + Date.now(),
          email,
          fullName: metadata.fullName,
          college: metadata.college,
          targetRole: metadata.targetRole,
          isDemo: true,
        };
        setUser(demoUser);
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
        }
        return { success: true, requiresEmailConfirmation: false };
      } catch (err: any) {
        return { success: false, error: err?.message || "Sign up failed. Please try again." };
      }
    },
    []
  );

  const signInWithOAuth = useCallback(async (provider: "google" | "github") => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: typeof window !== "undefined" ? `${window.location.origin}/` : undefined,
          },
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      }
      return {
        success: false,
        error: "OAuth requires active Supabase credentials configured in environment variables.",
      };
    } catch (err: any) {
      return { success: false, error: err?.message || "OAuth sign in failed." };
    }
  }, []);

  const signInWithDemo = useCallback(async (preset: "alex" | "priya" = "alex") => {
    let demoUser: StudentAuthUser;
    let demoProfile: CompleteStudentProfile;

    if (preset === "priya") {
      demoUser = {
        id: "demo-priya-sharma",
        email: "priya.sharma@aiml-institute.edu",
        fullName: "Priya Sharma",
        college: "Indian Institute of Science & Technology",
        targetRole: "AI / Machine Learning Engineer",
        isDemo: true,
      };

      demoProfile = {
        ...SAMPLE_ONBOARDED_STUDENT,
        personalInfo: {
          ...SAMPLE_ONBOARDED_STUDENT.personalInfo,
          fullName: "Priya Sharma",
          email: "priya.sharma@aiml-institute.edu",
          college: "Indian Institute of Science & Technology",
          degree: "B.Tech Computer Science (AI & ML Specialization)",
          graduationYear: "2025",
          locationCity: "Hyderabad, India",
          githubUrl: "https://github.com/priyasharma-ai",
          portfolioUrl: "https://priyasharma.ai",
        },
        careerPreferences: {
          ...SAMPLE_ONBOARDED_STUDENT.careerPreferences,
          primaryRole: "AI / Machine Learning Engineer",
          targetRoles: ["AI / Machine Learning Engineer", "NLP Researcher", "Data Scientist"],
          dreamCompanies: ["Anthropic", "Google DeepMind", "Microsoft Research", "OpenAI"],
        },
        calculatedReadiness: 89,
        onboardingCompleted: true,
      };
    } else {
      demoUser = {
        id: "demo-alex-rivera",
        email: "alex.rivera@university.edu",
        fullName: "Alex Rivera",
        college: "National Institute of Technology (NIT)",
        targetRole: "Software Development Engineer",
        isDemo: true,
      };

      demoProfile = {
        ...SAMPLE_ONBOARDED_STUDENT,
      };
    }

    setUser(demoUser);

    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(demoProfile));
    }

    return { success: true };
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("SignOut Supabase error:", e);
      }
    }
    setUser(null);
    setSupabaseUser(null);
    setSession(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: typeof window !== "undefined" ? `${window.location.origin}/signin?reset=true` : undefined,
        });
        if (error) return { success: false, error: error.message };
        return {
          success: true,
          message: "Password reset link has been sent to your email address.",
        };
      }
      return {
        success: true,
        message: "Demo Mode: Password reset instructions simulated for " + email,
      };
    } catch (err: any) {
      return { success: false, error: err?.message || "Failed to send reset link." };
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        loading,
        isAuthenticated: Boolean(user),
        isSupabaseConnected: isSupabaseConfigured,
        signInWithEmail,
        signUpWithEmail,
        signInWithOAuth,
        signInWithDemo,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
