"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { supabase } from "@/supabaseClient";
import {
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        router.replace("/");
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validation
    if (loginMethod === "email") {
      if (!email || !email.includes("@")) {
        setErrorMessage("Please enter a valid email address.");
        return;
      }
    } else {
      const digitsOnly = phone.replace(/\D/g, "");
      if (!phone || digitsOnly.length < 10) {
        setErrorMessage("Please enter a valid phone number with at least 10 digits.");
        return;
      }
    }

    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      let result;
      if (loginMethod === "email") {
        result = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          phone: phone.trim(),
          password: password,
        });
      }

      if (result.error) {
        setErrorMessage(result.error.message || "Failed to sign in. Please verify your credentials.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Signed in successfully! Redirecting to home...");
      setIsLoading(false);

      // Redirect to home page
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred during sign in.");
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to CareerOS"
      subtitle="Access your customized student roadmap, metrics, and AI mentor."
    >
      {/* Login Mode Toggle: Email vs Phone Number */}
      <div className="grid grid-cols-2 p-1 bg-canvas border border-border/80 rounded-xl mb-5 text-[13px] font-semibold">
        <button
          type="button"
          onClick={() => {
            setLoginMethod("email");
            setErrorMessage("");
          }}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
            loginMethod === "email"
              ? "bg-surface text-accent shadow-sm font-bold border border-border/60"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email address</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setLoginMethod("phone");
            setErrorMessage("");
          }}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
            loginMethod === "phone"
              ? "bg-surface text-accent shadow-sm font-bold border border-border/60"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Phone number</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email or Phone Input */}
        {loginMethod === "email" ? (
          <div>
            <label className="block text-[13px] font-semibold text-ink mb-1.5" htmlFor="email-input">
              Email address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.rivera@university.edu"
                className="w-full bg-canvas/60 border border-border/80 text-ink placeholder:text-ink-muted/60 text-[13px] rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-accent focus:bg-surface focus:shadow-sm focus:shadow-accent/10 transition-all"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-[13px] font-semibold text-ink mb-1.5" htmlFor="phone-input">
              Phone number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="phone-input"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full bg-canvas/60 border border-border/80 text-ink placeholder:text-ink-muted/60 text-[13px] rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-accent focus:bg-surface focus:shadow-sm focus:shadow-accent/10 transition-all"
              />
            </div>
          </div>
        )}

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[13px] font-semibold text-ink" htmlFor="password-input">
              Password
            </label>
            <Link
              href="#forgot-password"
              className="text-[12px] font-medium text-accent hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="password-input"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-canvas/60 border border-border/80 text-ink placeholder:text-ink-muted/60 text-[13px] rounded-lg pl-9 pr-10 py-2.5 focus:outline-none focus:border-accent focus:bg-surface focus:shadow-sm focus:shadow-accent/10 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember me checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-border text-accent focus:ring-accent accent-accent cursor-pointer"
          />
          <label htmlFor="remember-me" className="text-[13px] text-ink-muted cursor-pointer select-none">
            Remember me on this browser
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white font-semibold text-[14px] hover:bg-accent/90 shadow-md shadow-accent/25 hover:shadow-lg hover:shadow-accent/35 transition-all duration-150 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Error Message Under the Form */}
      {errorMessage && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-[13px] flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success Message Under the Form */}
      {successMessage && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[13px] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Switch to Sign Up */}
      <div className="mt-6 pt-4 border-t border-border/70 text-center text-[13px] text-ink-muted">
        <span>Don&apos;t have an account yet? </span>
        <Link
          href="/signup"
          className="font-bold text-accent hover:underline focus-visible:outline-accent"
        >
          Create student account
        </Link>
      </div>
    </AuthLayout>
  );
}
