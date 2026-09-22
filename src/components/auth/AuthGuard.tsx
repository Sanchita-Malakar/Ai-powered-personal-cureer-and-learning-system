"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabaseClient";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const verifyUserSession = async () => {
      try {
        if (!supabase?.auth?.getSession) {
          if (isMounted) {
            setIsAuthenticated(false);
            router.replace("/signin");
          }
          return;
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session?.user) {
          if (isMounted) {
            setIsAuthenticated(false);
            router.replace("/signin");
          }
          return;
        }

        if (isMounted) {
          setIsAuthenticated(true);

          // Check if onboarding is completed
          const metadataOnboarded = Boolean(session.user.user_metadata?.onboarding_completed);
          let localOnboarded = false;
          if (typeof window !== "undefined") {
            const raw = localStorage.getItem("career_os_student_profile");
            if (raw) {
              try {
                const parsed = JSON.parse(raw);
                localOnboarded = Boolean(parsed.onboardingCompleted);
              } catch (e) {
                // Ignore parse errors
              }
            }
          }

          if (!metadataOnboarded && !localOnboarded) {
            router.replace("/onboarding");
            return;
          }
        }
      } catch (err) {
        if (isMounted) {
          setIsAuthenticated(false);
          router.replace("/signin");
        }
      }
    };

    verifyUserSession();

    // Listen for auth state changes (e.g. sign out, token expiry)
    let unsubscribe: (() => void) | undefined;
    if (supabase?.auth?.onAuthStateChange) {
      try {
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!session?.user) {
            if (isMounted) {
              setIsAuthenticated(false);
              router.replace("/signin");
            }
          } else {
            if (isMounted) {
              setIsAuthenticated(true);
              const metadataOnboarded = Boolean(session.user.user_metadata?.onboarding_completed);
              let localOnboarded = false;
              if (typeof window !== "undefined") {
                const raw = localStorage.getItem("career_os_student_profile");
                if (raw) {
                  try {
                    localOnboarded = Boolean(JSON.parse(raw).onboardingCompleted);
                  } catch (e) {}
                }
              }
              if (!metadataOnboarded && !localOnboarded) {
                router.replace("/onboarding");
              }
            }
          }
        });
        unsubscribe = () => subscription?.unsubscribe?.();
      } catch (subErr) {
        console.error("Failed to subscribe to auth changes:", subErr);
      }
    }

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [router]);

  // While checking auth state, show a clean academic authorization verification screen
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-canvas bg-ambient-mesh flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-surface/90 border border-border/80 shadow-xl max-w-sm w-full text-center animate-in fade-in duration-200">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-base shadow-md shadow-accent/25">
            C
          </div>
          <div className="flex items-center gap-2 text-accent font-semibold text-sm mt-1">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying student authorization...</span>
          </div>
          <p className="text-xs text-ink-muted">
            Checking active CareerOS credentials. Unauthorized users will be redirected to sign in.
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated: render nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated: allow entry to dashboard / app
  return <>{children}</>;
};
