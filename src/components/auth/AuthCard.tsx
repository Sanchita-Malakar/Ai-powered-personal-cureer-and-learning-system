"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/supabaseClient";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import {
  Mail,
  Lock,
  User,
  GraduationCap,
  Briefcase,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  KeyRound,
  ChevronRight,
  Star,
  Check,
  X,
  Compass,
} from "lucide-react";

interface AuthCardProps {
  initialMode: "signin" | "signup";
}

const TARGET_ROLE_OPTIONS = [
  "Software Development Engineer (SDE)",
  "Full Stack Web Developer",
  "Frontend Engineer (React / Next.js)",
  "Backend Engineer (Node / Go / Java)",
  "AI & Machine Learning Engineer",
  "Data Scientist / Analytics Engineer",
  "Cloud & DevOps Engineer",
  "Product Manager (Tech Track)",
];

export const AuthCard: React.FC<AuthCardProps> = ({ initialMode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithOAuth,
    signInWithDemo,
    resetPassword,
    isSupabaseConnected,
    user,
  } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [college, setCollege] = useState("");
  const [degree, setDegree] = useState("B.Tech Computer Science");
  const [targetRole, setTargetRole] = useState(TARGET_ROLE_OPTIONS[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status states
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot password modal
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // If already authenticated and not loading, redirect to target
  useEffect(() => {
    if (user && !loading && !demoLoading) {
      // User is already logged in
    }
  }, [user, loading, demoLoading]);

  // Sync mode if query or prop changes
  useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [initialMode]);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: "", color: "bg-border" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, text: "Weak", color: "bg-action" };
      case 2:
        return { score: 2, text: "Fair", color: "bg-attention" };
      case 3:
        return { score: 3, text: "Good", color: "bg-blue-500" };
      case 4:
        return { score: 4, text: "Strong", color: "bg-emerald-500" };
      default:
        return { score: 0, text: "", color: "bg-border" };
    }
  };

  const passwordStrength = getPasswordStrength(password);

  // Handle Sign In submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both your email and password.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data?.session) {
        setSuccessMessage("Signed in successfully! Redirecting...");
        router.push("/");
      } else {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session) {
          router.push("/");
        } else {
          setErrorMessage("Please check your email and confirm your account before logging in.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const emailRedirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/login`
          : undefined;

      const signUpFn = (supabase.auth as any).signup || supabase.auth.signUp;
      const { data, error } = await signUpFn.call(supabase.auth, {
        email: email.trim(),
        password,
        options: {
          emailRedirectTo,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (!data?.session) {
        setSuccessMessage("Check your email and confirm your account before logging in.");
      } else {
        setSuccessMessage("Account created successfully! Redirecting...");
        router.push("/");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth provider sign in
  const handleOAuth = async (provider: "google" | "github") => {
    setErrorMessage(null);
    try {
      const res = await signInWithOAuth(provider);
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "OAuth authentication failed.");
    }
  };

  // Handle Instant Demo bypass
  const handleDemoLogin = async (preset: "alex" | "priya") => {
    setDemoLoading(preset);
    setErrorMessage(null);
    try {
      await signInWithDemo(preset);
      setSuccessMessage(
        `Logged in as demo student (${preset === "alex" ? "Alex Rivera" : "Priya Sharma"})! Redirecting...`
      );
      setTimeout(() => {
        router.push(redirectUrl);
        router.refresh();
      }, 500);
    } catch (e: any) {
      setErrorMessage("Failed to initialize demo session.");
    } finally {
      setDemoLoading(null);
    }
  };

  // Handle Forgot Password modal submit
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    setForgotLoading(true);
    setForgotSuccess(null);
    try {
      const res = await resetPassword(forgotEmail);
      if (res.success) {
        setForgotSuccess(res.message || "Reset link dispatched to your inbox.");
      } else {
        setErrorMessage(res.error || "Failed to send reset link.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to process request.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas bg-ambient-mesh flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Bar */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-2 mb-4 sm:mb-6">
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

        <div className="flex items-center gap-2 sm:gap-3">
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

      {/* Main Dual Auth Container */}
      <main className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch my-auto">
        {/* Left Side: Brand Value Proposition & Live Visuals */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-3xl bg-surface/70 backdrop-blur-md border border-border/80 shadow-card-3d relative overflow-hidden">
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-ai/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top content */}
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Career Intelligence Platform</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink leading-tight">
                Architect your engineering career with deterministic precision.
              </h1>
              <p className="text-sm text-ink-muted leading-relaxed">
                Connect your academics, projects, and target roles. CareerOS analyzes ATS gaps, builds your roadmap, and tracks your readiness score every day.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-canvas/70 border border-border/60">
                <div className="p-2 rounded-xl bg-accent/10 text-accent mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-ink">Personalized Career Milestones</h4>
                  <p className="text-[11px] text-ink-muted leading-snug">
                    Real-time steps tailored to Tier-1 product firms and high-growth tech startups.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-canvas/70 border border-border/60">
                <div className="p-2 rounded-xl bg-ai/10 text-ai mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-ink">AI Mock Technical Trainer</h4>
                  <p className="text-[11px] text-ink-muted leading-snug">
                    Simulate behavioral and coding rounds grounded in your actual coursework and resume.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-canvas/70 border border-border/60">
                <div className="p-2 rounded-xl bg-attention/10 text-attention mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-ink">ATS Resume Benchmark (88% Target)</h4>
                  <p className="text-[11px] text-ink-muted leading-snug">
                    Instant keyword gap detection against competitive job descriptions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Student Testimonial Card */}
          <div className="relative z-10 mt-6 pt-5 border-t border-border/70">
            <div className="p-4 rounded-2xl bg-surface/90 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                    94%
                  </div>
                  <span className="text-xs font-semibold text-ink">Target Role Readiness</span>
                </div>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-ink-muted italic leading-relaxed">
                “CareerOS helped me fix critical ATS gaps and prepare for LeetCode medium graph questions. Landed my dream SWE role!”
              </p>
              <div className="mt-2.5 flex items-center justify-between text-[10px] text-ink-muted">
                <span className="font-semibold text-ink">Alex Rivera • B.Tech CSE</span>
                <span className="text-accent font-medium">Placed @ Top Tier Tech</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-ink-muted px-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Encrypted & Cloud Synchronized</span>
              </span>
              <span className="font-mono text-[10px]">v1.4.0</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="bg-surface border border-border/90 rounded-3xl p-6 sm:p-9 shadow-card-3d relative overflow-hidden transition-all">
            {/* Supabase Status Indicator */}
            <div className="flex items-center justify-between mb-5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-canvas border border-border text-[11px] text-ink-muted">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSupabaseConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  }`}
                />
                <span>
                  {isSupabaseConnected
                    ? "Supabase Cloud Database Connected"
                    : "Demo Sandbox Active"}
                </span>
              </div>

              {/* Mode Toggle Switch */}
              <div className="inline-flex p-1 rounded-xl bg-canvas border border-border/80 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    mode === "signin"
                      ? "bg-surface text-ink font-semibold shadow-sm"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    mode === "signup"
                      ? "bg-surface text-ink font-semibold shadow-sm"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Header Titles */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
                {mode === "signin"
                  ? "Welcome back to CareerOS"
                  : "Create your student account"}
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted mt-1">
                {mode === "signin"
                  ? "Enter your credentials to continue your engineering journey."
                  : "Start tracking skills, building your resume, and evaluating career readiness."}
              </p>
            </div>


            {successMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{successMessage}</div>
              </div>
            )}

            {/* Social Auth Providers */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={() => handleOAuth("google")}
                className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-canvas hover:bg-canvas/80 border border-border/90 text-ink text-xs font-semibold shadow-2xs hover:border-border transition-all active:scale-[0.98]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuth("github")}
                className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-canvas hover:bg-canvas/80 border border-border/90 text-ink text-xs font-semibold shadow-2xs hover:border-border transition-all active:scale-[0.98]"
              >
                <svg className="w-4 h-4 fill-current text-ink" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="border-t border-border/80 w-full" />
              <span className="bg-surface px-3 text-[11px] font-medium text-ink-muted uppercase tracking-wider">
                Or with student email
              </span>
            </div>

            {/* FORM */}
            {mode === "signin" ? (
              <>
                {/* SIGN IN FORM */}
                <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="signin-email"
                      type="email"
                      required
                      placeholder="student@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-canvas/70 focus:bg-surface border border-border/90 focus:border-accent text-ink placeholder:text-ink-muted/60 text-xs sm:text-sm rounded-xl pl-10 pr-3.5 py-2.5 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-ink">Password</label>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-xs font-medium text-accent hover:underline focus-visible:outline-accent"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-canvas/70 focus:bg-surface border border-border/90 focus:border-accent text-ink placeholder:text-ink-muted/60 text-xs sm:text-sm rounded-xl pl-10 pr-10 py-2.5 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-1 focus-visible:outline-accent"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-border text-accent focus:ring-accent w-3.5 h-3.5"
                    />
                    <span className="text-xs text-ink-muted">Remember this device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white text-xs sm:text-sm font-bold shadow-md shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
              {errorMessage && (
                <div className="mt-3.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </>
          ) : (
            <>
              {/* SIGN UP FORM */}
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="signup-name"
                        type="text"
                        required
                        placeholder="Alex Rivera"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-canvas/70 focus:bg-surface border border-border/90 focus:border-accent text-ink placeholder:text-ink-muted/60 text-xs sm:text-sm rounded-xl pl-9 pr-3 py-2 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      College / University
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="signup-college"
                        type="text"
                        required
                        placeholder="e.g. National Institute of Tech"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        className="w-full bg-canvas/70 focus:bg-surface border border-border/90 focus:border-accent text-ink placeholder:text-ink-muted/60 text-xs sm:text-sm rounded-xl pl-9 pr-3 py-2 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      Target Role
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        id="signup-target-role"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full bg-canvas/70 focus:bg-surface border border-border/90 focus:border-accent text-ink text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2 transition-all outline-none appearance-none cursor-pointer"
                      >
                        {TARGET_ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="w-4 h-4 text-ink-muted absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      Student Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="signup-email"
                        type="email"
                        required
                        placeholder="student@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-canvas/70 focus:bg-surface border border-border/90 focus:border-accent text-ink placeholder:text-ink-muted/60 text-xs sm:text-sm rounded-xl pl-9 pr-3 py-2 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Password field + live strength */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-canvas/70 focus:bg-surface border border-border/90 focus:border-accent text-ink placeholder:text-ink-muted/60 text-xs sm:text-sm rounded-xl pl-9 pr-9 py-2 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  {password && (
                    <div className="mt-1.5 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-ink-muted">Password strength:</span>
                        <span className="font-semibold text-ink">{passwordStrength.text}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1.5">
                        <div
                          className={`rounded-full transition-all ${
                            passwordStrength.score >= 1 ? passwordStrength.color : "bg-border"
                          }`}
                        />
                        <div
                          className={`rounded-full transition-all ${
                            passwordStrength.score >= 2 ? passwordStrength.color : "bg-border"
                          }`}
                        />
                        <div
                          className={`rounded-full transition-all ${
                            passwordStrength.score >= 3 ? passwordStrength.color : "bg-border"
                          }`}
                        />
                        <div
                          className={`rounded-full transition-all ${
                            passwordStrength.score >= 4 ? passwordStrength.color : "bg-border"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full bg-canvas/70 focus:bg-surface border text-ink placeholder:text-ink-muted/60 text-xs sm:text-sm rounded-xl pl-9 pr-9 py-2 transition-all outline-none ${
                        confirmPassword && confirmPassword !== password
                          ? "border-action focus:border-action"
                          : confirmPassword && confirmPassword === password
                          ? "border-emerald-500 focus:border-emerald-500"
                          : "border-border/90 focus:border-accent"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-1"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms agreement */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded border-border text-accent focus:ring-accent w-3.5 h-3.5"
                    />
                    <span className="text-[11px] text-ink-muted leading-tight">
                      I agree to the CareerOS{" "}
                      <span className="text-accent underline">Academic Terms</span> and{" "}
                      <span className="text-accent underline">Privacy Guidelines</span>.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white text-xs sm:text-sm font-bold shadow-md shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account & Start Onboarding</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
              {errorMessage && (
                <div className="mt-3.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </>
          )}

            {/* Quick Demo Student Access Box */}
            <div className="mt-6 pt-5 border-t border-border/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-ink flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>Instant Reviewer Demo (No sign up required)</span>
                </span>
                <span className="text-[10px] text-ink-muted">One-click testing</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("alex")}
                  disabled={Boolean(demoLoading)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-canvas hover:bg-accent/10 border border-border/80 hover:border-accent/40 text-left transition-all active:scale-[0.98] group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-xs text-ink group-hover:text-accent truncate">
                      Alex Rivera
                    </div>
                    <div className="text-[10px] text-ink-muted truncate">
                      Software Engineering Track • 84% Ready
                    </div>
                  </div>
                  {demoLoading === "alex" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-accent flex-shrink-0" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin("priya")}
                  disabled={Boolean(demoLoading)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-canvas hover:bg-ai/10 border border-border/80 hover:border-ai/40 text-left transition-all active:scale-[0.98] group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-xs text-ink group-hover:text-ai truncate">
                      Priya Sharma
                    </div>
                    <div className="text-[10px] text-ink-muted truncate">
                      AI & ML Track • 89% Ready
                    </div>
                  </div>
                  {demoLoading === "priya" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-ai flex-shrink-0" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-ai group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Footer switch link */}
            <div className="mt-5 text-center text-xs text-ink-muted">
              {mode === "signin" ? (
                <span>
                  Don't have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="font-semibold text-accent hover:underline focus-visible:outline-accent"
                  >
                    Create student account
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="font-semibold text-accent hover:underline focus-visible:outline-accent"
                  >
                    Sign in to your account
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface border border-border rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setForgotPasswordOpen(false);
                setForgotSuccess(null);
              }}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-3">
              <KeyRound className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-ink">Reset your password</h3>
            <p className="text-xs text-ink-muted mt-1 mb-4">
              Enter your registered student email. We will send password reset instructions to your inbox.
            </p>

            {forgotSuccess ? (
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{forgotSuccess}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-canvas border border-border text-ink text-xs font-semibold hover:bg-surface"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Student Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-canvas/70 focus:bg-surface border border-border text-ink text-xs rounded-xl px-3 py-2.5 outline-none focus:border-accent"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-canvas border border-border text-ink text-xs font-semibold hover:bg-surface"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2.5 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {forgotLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Send Link</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto mt-6 py-2 text-center text-xs text-ink-muted border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} CareerOS. Deterministic AI Career System for Engineering Students.</p>
        <div className="flex items-center gap-4 text-[11px]">
          <Link href="/#roadmap" className="hover:text-ink">Roadmap</Link>
          <Link href="/#jobs" className="hover:text-ink">Job Tracker</Link>
          <Link href="/#mentor" className="hover:text-ink">AI Mentor</Link>
        </div>
      </footer>
    </div>
  );
};
