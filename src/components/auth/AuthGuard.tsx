"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/supabaseClient";
import { Loader2 } from "lucide-react";

const PUBLIC_ROUTES = ["/login", "/signin", "/signup"];

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const [isLoading, setIsLoading] = useState(!isPublicRoute);
  const [isAuthenticated, setIsAuthenticated] = useState(isPublicRoute);

  useEffect(() => {
    // Public pages (login, signin, signup) do not require a session
    if (isPublicRoute) {
      setIsLoading(false);
      setIsAuthenticated(true);
      return;
    }

    let isMounted = true;

    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (error || !session) {
          setIsAuthenticated(false);
          setIsLoading(false);
          router.replace("/login");
          return;
        }

        // Real session exists
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (err) {
        if (isMounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
          router.replace("/login");
        }
      }
    };

    checkSession();

    // Listen to Supabase auth state transitions (sign in, sign out, token expiry)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (!session && !isPublicRoute) {
        setIsAuthenticated(false);
        router.replace("/login");
      } else if (session) {
        setIsAuthenticated(true);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [router, pathname, isPublicRoute]);

  // Public route: render immediately without authorization delay
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Checking session for protected private page
  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas bg-ambient-mesh flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-surface/90 border border-border shadow-xl max-w-sm w-full text-center animate-in fade-in duration-150">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-base shadow-md shadow-accent/25">
            C
          </div>
          <div className="flex items-center gap-2 text-accent font-semibold text-sm mt-1">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying session...</span>
          </div>
          <p className="text-xs text-ink-muted">
            Checking Supabase credentials. Unauthorized access will be redirected to /login.
          </p>
        </div>
      </div>
    );
  }

  // If no session on private page, do not render children while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
