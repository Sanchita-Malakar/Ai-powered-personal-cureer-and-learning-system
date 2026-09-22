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
  KeyRound,
  RefreshCw,
  MailCheck,
  ShieldCheck,
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

  // In-tab verification states
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendStatus, setResendStatus] = useState<"" | "sending" | "sent">("");

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        router.replace("/");
      }
    };
    checkSession();
  }, [router]);

  // Real-time synchronization when awaiting confirmation
  useEffect(() => {
    if (!awaitingConfirmation) return;

    let isMounted = true;

    // 1. Cross-tab BroadcastChannel sync (if confirmation link was clicked in another tab)
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel("career_os_auth_sync");
      channel.onmessage = (event) => {
        if (event.data?.type === "EMAIL_VERIFIED") {
          // Send PONG so the other tab knows we handled it
          channel?.postMessage({ type: "PONG_EXISTING_TAB" });
          if (isMounted) {
            setSuccessMessage("Email confirmed! Continuing to onboarding in this tab...");
            setTimeout(() => {
              router.push("/onboarding");
            }, 800);
          }
        } else if (event.data?.type === "PING_EXISTING_TAB") {
          channel?.postMessage({ type: "PONG_EXISTING_TAB" });
        }
      };
    }

    // 2. Storage event listener (fallback cross-tab communication)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "career_os_email_verified_trigger") {
        if (isMounted) {
          setSuccessMessage("Email confirmed! Continuing to onboarding in this tab...");
          setTimeout(() => {
            router.push("/onboarding");
          }, 800);
        }
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. Supabase Auth state change listener
    let unsubscribe: (() => void) | undefined;
    if (supabase?.auth?.onAuthStateChange) {
      try {
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (session && isMounted) {
            setSuccessMessage("Email verified! Continuing to onboarding in this tab...");
            setTimeout(() => {
              router.push("/onboarding");
            }, 800);
          }
        });
        unsubscribe = () => subscription?.unsubscribe?.();
      } catch (subErr) {
        console.error("Failed to subscribe in SignUp:", subErr);
      }
    }

    // 4. Polling check every 2.5s in case link was opened on another window or device
    const pollInterval = setInterval(async () => {
      try {
        if (!supabase?.auth?.getSession) return;
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session && isMounted) {
          setSuccessMessage("Email verified! Continuing to onboarding in this tab...");
          setTimeout(() => {
            router.push("/onboarding");
          }, 800);
        }
      } catch (pollErr) {}
    }, 2500);

    return () => {
      isMounted = false;
      channel?.close();
      window.removeEventListener("storage", handleStorage);
      unsubscribe?.();
      clearInterval(pollInterval);
    };
  }, [awaitingConfirmation, router]);

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
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
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

      // If user session is immediately available (email confirmation disabled in Supabase)
      if (data.session) {
        setSuccessMessage(`Account created for ${name}! Continuing to onboarding in this tab...`);
        setIsLoading(false);
        setTimeout(() => {
          router.push("/onboarding");
        }, 1000);
        return;
      }

      // If email confirmation is required by Supabase
      if (data.user) {
        setIsLoading(false);
        setAwaitingConfirmation(true);
        setSuccessMessage(
          `Confirmation sent! Check ${email.trim()} for your 6-digit verification code or click the confirmation link.`
        );
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred during signup.");
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const cleanCode = otpCode.trim();

    if (!cleanCode || cleanCode.length < 6) {
      setErrorMessage("Please enter the complete 6-digit confirmation code.");
      return;
    }

    setIsVerifyingOtp(true);

    try {
      // Try verify with type 'signup'
      let res = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: cleanCode,
        type: "signup",
      });

      // If that fails, fallback to type 'email'
      if (res.error) {
        res = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: cleanCode,
          type: "email",
        });
      }

      if (res.error) {
        setErrorMessage(
          res.error.message ||
            "Invalid or expired verification code. Please check your email or click Resend."
        );
        setIsVerifyingOtp(false);
        return;
      }

      setSuccessMessage("Email confirmed successfully! Opening onboarding in this tab...");
      setIsVerifyingOtp(false);

      // Transition smoothly to onboarding in the same tab
      setTimeout(() => {
        router.push("/onboarding");
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to verify confirmation code.");
      setIsVerifyingOtp(false);
    }
  };

  const handleResendCode = async () => {
    setResendStatus("sending");
    setErrorMessage("");

    try {
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      setResendStatus("sent");
      setSuccessMessage(`New confirmation code sent to ${email.trim()}!`);
      setTimeout(() => setResendStatus(""), 4000);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to resend confirmation email.");
      setResendStatus("");
    }
  };

  // If waiting for confirmation, show in-tab verification screen
  if (awaitingConfirmation) {
    return (
      <AuthLayout
        title="Verify your email"
        subtitle="Stay in this tab. Enter the 6-digit code or click the email link."
      >
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Top visual banner */}
          <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 flex items-start gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center shrink-0 shadow-sm shadow-accent/25">
              <MailCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-ink">
                Confirmation code sent to:
              </p>
              <p className="text-xs font-bold text-accent break-all">{email}</p>
              <p className="text-[11px] text-ink-muted mt-0.5">
                We sent a 6-digit code and link. Everything opens right in this same tab.
              </p>
            </div>
          </div>

          {/* Error & Success Messages */}
          {errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* OTP Input Form */}
          <form onSubmit={handleVerifyOtp} className="space-y-3.5">
            <div>
              <label
                className="block text-[13px] font-semibold text-ink mb-1 text-left"
                htmlFor="otp-input"
              >
                Enter 6-digit code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="otp-input"
                  type="text"
                  maxLength={8}
                  autoFocus
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\s+/g, ""))}
                  placeholder="e.g. 123456"
                  className="w-full bg-canvas/60 border border-border/80 text-ink placeholder:text-ink-muted/50 text-base font-mono tracking-widest text-center rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-accent focus:bg-surface transition-all"
                />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] text-ink-muted block text-left">
                  Check your inbox or enter test code.
                </span>
                <button
                  type="button"
                  onClick={() => setOtpCode("123456")}
                  className="text-[11px] font-semibold text-accent hover:underline cursor-pointer"
                >
                  Use test code: 123456
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifyingOtp || !otpCode.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-md shadow-accent/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isVerifyingOtp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying in this tab...</span>
                </>
              ) : (
                <>
                  <span>Verify & Open Onboarding in this Tab</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Real-time background sync indicator */}
          <div className="p-3 rounded-xl bg-canvas/60 border border-border/70 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-ink">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Listening for email link confirmation...</span>
            </div>
            <p className="text-[11px] text-ink-muted mt-0.5">
              If you clicked the link in your email, this tab will automatically detect it and advance!
            </p>
          </div>

          {/* Actions: Resend or Edit email */}
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendStatus === "sending"}
              className="inline-flex items-center gap-1.5 text-accent font-semibold hover:underline disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${resendStatus === "sending" ? "animate-spin" : ""}`}
              />
              <span>
                {resendStatus === "sending"
                  ? "Resending..."
                  : resendStatus === "sent"
                  ? "Sent!"
                  : "Resend code"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAwaitingConfirmation(false);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className="text-ink-muted hover:text-ink font-medium"
            >
              Change email
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

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
            Mobile number (with country code)
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

        {/* Target Role Initial Selection */}
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-1" htmlFor="role-select">
            Primary target role
          </label>
          <div className="relative">
            <Target className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="role-select"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-canvas/60 border border-border/80 text-ink text-[13px] rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:border-accent focus:bg-surface focus:shadow-sm focus:shadow-accent/10 transition-all appearance-none cursor-pointer"
            >
              {TARGET_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[13px] font-semibold text-ink" htmlFor="password-input">
              Password
            </label>
            {password && (
              <span className={`text-[11px] font-semibold ${getStrengthBadge().color}`}>
                {getStrengthBadge().text}
              </span>
            )}
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="password-input"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-canvas/60 border border-border/80 text-ink placeholder:text-ink-muted/60 text-[13px] rounded-lg pl-9 pr-10 py-2 focus:outline-none focus:border-accent focus:bg-surface focus:shadow-sm focus:shadow-accent/10 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password strength meter bar */}
          {password && (
            <div className="w-full bg-canvas h-1.5 rounded-full overflow-hidden mt-1.5 border border-border/60">
              <div className={`h-full transition-all duration-300 ${getStrengthBadge().bar}`} />
            </div>
          )}
        </div>

        {/* Error message display */}
        {errorMessage && (
          <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-lg flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success message display */}
        {successMessage && (
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-lg flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Terms agreement checkbox */}
        <div className="flex items-start gap-2 pt-1">
          <input
            id="terms-checkbox"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-1 rounded border-border text-accent focus:ring-accent w-3.5 h-3.5 cursor-pointer"
          />
          <label htmlFor="terms-checkbox" className="text-[12px] text-ink-muted leading-tight cursor-pointer">
            I agree to the CareerOS{" "}
            <span className="text-accent hover:underline font-medium">Terms of Service</span> and{" "}
            <span className="text-accent hover:underline font-medium">Privacy Policy</span>.
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-semibold text-[13px] py-2.5 rounded-lg shadow-sm shadow-accent/20 hover:shadow-accent/30 transition-all duration-150 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating student account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Navigation Link to Sign In */}
      <div className="mt-5 pt-4 border-t border-border/80 text-center">
        <p className="text-[12px] text-ink-muted">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-accent hover:underline focus-visible:outline-accent"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
