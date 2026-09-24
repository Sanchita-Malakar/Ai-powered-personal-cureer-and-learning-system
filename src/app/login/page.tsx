"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabaseClient";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      // Only redirect when a real session exists after login
      if (data?.session) {
        router.push("/");
        return;
      }

      // Verify active session with getSession
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        router.push("/");
      } else {
        setError("Please check your email and confirm your account before logging in.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas bg-ambient-mesh flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-ink group focus-visible:outline-accent rounded-lg"
        >
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-sm shadow-md shadow-accent/25 transition-transform duration-200 group-hover:scale-105">
            C
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-lg sm:text-xl tracking-tight">CareerOS</span>
            <span className="text-[10px] font-semibold text-accent uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
              Student Edition
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-ink-muted hover:text-ink hover:bg-surface border border-transparent hover:border-border transition-colors"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Center Container */}
      <main className="max-w-md w-full mx-auto my-auto">
        <div className="bg-surface/90 backdrop-blur-xl border border-border/90 rounded-3xl p-7 sm:p-9 shadow-card-3d relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-ai/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header Title */}
          <div className="mb-6 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Supabase Authentication</span>
            </div>
            <h1 className="text-2xl font-bold text-ink tracking-tight">
              Sign in to CareerOS
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              Enter your student email and password to access your dashboard.
            </p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="space-y-4 relative z-10">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-ink mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-canvas/70 focus:bg-surface border border-border/90 focus:border-accent text-ink placeholder:text-ink-muted/60 text-xs sm:text-sm rounded-xl pl-10 pr-3.5 py-2.5 transition-all outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-ink"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-canvas/70 focus:bg-surface border border-border/90 focus:border-accent text-ink placeholder:text-ink-muted/60 text-xs sm:text-sm rounded-xl pl-10 pr-10 py-2.5 transition-all outline-none focus:ring-1 focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-1 focus-visible:outline-accent"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white text-xs sm:text-sm font-bold shadow-md shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Simple error handling: small error message under the form */}
          {error && (
            <div className="mt-3.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="mt-6 pt-5 border-t border-border/80 text-center text-xs text-ink-muted relative z-10">
            <span>Don&apos;t have an account yet? </span>
            <Link
              href="/signup"
              className="font-bold text-accent hover:underline focus-visible:outline-accent"
            >
              Sign up
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto mt-6 py-2 text-center text-xs text-ink-muted border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} CareerOS. Deterministic AI Career System for Engineering Students.</p>
        <span className="flex items-center gap-1.5 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Connected to Supabase Auth</span>
        </span>
      </footer>
    </div>
  );
}
