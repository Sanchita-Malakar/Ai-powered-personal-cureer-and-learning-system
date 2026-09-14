"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { supabase } from "@/supabaseClient";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Target,
} from "lucide-react";

const TARGET_ROLES = [
  "Junior Full Stack Developer",
  "Frontend Engineer (React / Next.js)",
  "Backend Engineer (Node.js / Python)",
  "Data Scientist / ML Engineer",
  "DevOps & Cloud Associate",
  "Product Designer (UI/UX)",
];

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [targetRole, setTargetRole] = useState(TARGET_ROLES[0]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
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

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strengthScore = calculatePasswordStrength(password);

  const getStrengthBadge = () => {
    if (strengthScore <= 1) return { text: "Weak", color: "text-red-500", bar: "w-1/4 bg-red-500" };
    if (strengthScore <= 3) return { text: "Moderate", color: "text-amber-500", bar: "w-2/4 bg-amber-500" };
    if (strengthScore === 4) return { text: "Strong", color: "text-blue-500", bar: "w-3/4 bg-blue-500" };
    return { text: "Very strong", color: "text-emerald-500", bar: "w-full bg-emerald-500" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Field Validation
    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    const digitsOnly = phone.replace(/\D/g, "");
    if (!phone || digitsOnly.length < 10) {
      setErrorMessage("Please enter a valid phone number (at least 10 digits).");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Please accept the Terms of Service to create your account.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: name.trim(),
            phone: phone.trim(),
            target_role: targetRole,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      setSuccessMessage(`Account created for ${name}! Redirecting to home...`);
      setIsLoading(false);

      // Redirect to home page
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred during signup.");
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create student account"
      subtitle="Join CareerOS to track your target role readiness with deterministic data."
    >
      {/* Sign Up Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-1" htmlFor="name-input">
            Full name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivera"
              className="w-full bg-canvas/60 border border-border/80 text-ink placeholder:text-ink-muted/60 text-[13px] rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-accent focus:bg-surface focus:shadow-sm focus:shadow-accent/10 transition-all"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-1" htmlFor="email-input">
            Student / Personal email
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
              className="w-full bg-canvas/60 border border-border/80 text-ink placeholder:text-ink-muted/60 text-[13px] rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-accent focus:bg-surface focus:shadow-sm focus:shadow-accent/10 transition-all"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-1" htmlFor="phone-input">
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
              className="w-full bg-canvas/60 border border-border/80 text-ink placeholder:text-ink-muted/60 text-[13px] rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-accent focus:bg-surface focus:shadow-sm focus:shadow-accent/10 transition-all"
            />
          </div>
        </div>

        {/* Target Career Role */}
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-1" htmlFor="role-select">
            Target career role
          </label>
          <div className="relative">
            <Target className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="role-select"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-canvas/60 border border-border/80 text-ink text-[13px] rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-accent focus:bg-surface focus:shadow-sm focus:shadow-accent/10 transition-all cursor-pointer"
            >
              {TARGET_ROLES.map((role) => (
                <option key={role} value={role} className="bg-surface text-ink">
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-1" htmlFor="password-input">
            Create password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="password-input"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full bg-canvas/60 border border-border/80 text-ink placeholder:text-ink-muted/60 text-[13px] rounded-lg pl-9 pr-10 py-2 focus:outline-none focus:border-accent focus:bg-surface focus:shadow-sm focus:shadow-accent/10 transition-all"
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

          {/* Password strength visualizer */}
          {password.length > 0 && (
            <div className="mt-1.5 space-y-1 animate-in fade-in">
              <div className="w-full h-1 bg-border/60 rounded-full overflow-hidden">
                <div className={`h-full ${getStrengthBadge().bar} transition-all duration-300`} />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-ink-muted">Password strength:</span>
                <span className={`font-semibold ${getStrengthBadge().color}`}>
                  {getStrengthBadge().text}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Agree Terms Checkbox */}
        <div className="flex items-start gap-2 pt-1">
          <input
            id="agree-terms"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-border text-accent focus:ring-accent accent-accent cursor-pointer"
          />
          <label htmlFor="agree-terms" className="text-[12px] text-ink-muted cursor-pointer select-none leading-tight">
            I agree to CareerOS <span className="text-accent underline">Terms of Service</span> and <span className="text-accent underline">Student Privacy Policy</span>.
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
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create account & start roadmap</span>
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

      {/* Switch to Sign In */}
      <div className="mt-5 pt-3.5 border-t border-border/70 text-center text-[13px] text-ink-muted">
        <span>Already have an account? </span>
        <Link
          href="/signin"
          className="font-bold text-accent hover:underline focus-visible:outline-accent"
        >
          Sign in here
        </Link>
      </div>
    </AuthLayout>
  );
}
