"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, GraduationCap, Target, ShieldCheck, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen bg-canvas bg-ambient-mesh text-ink flex flex-col justify-between selection:bg-accent/20 transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="h-16 px-4 sm:px-8 flex items-center justify-between border-b border-border/70 backdrop-blur-md bg-surface/70 sticky top-0 z-30">
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-accent"
        >
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-md shadow-accent/25 transition-transform duration-200 group-hover:scale-105 group-hover:rotate-3">
            C
          </div>
          <span className="font-bold text-[18px] tracking-tight text-ink">
            CareerOS
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-semibold border border-accent/20">
            Education Platform
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-muted hover:text-accent transition-colors pl-2 py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area: Split 2-column on desktop */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Educational Branding & Value Proposition (hidden on mobile, visible lg:) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col gap-6 pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-[12px] font-semibold w-fit shadow-sm shadow-accent/10">
              <GraduationCap className="w-4 h-4" />
              <span>Student Career Readiness OS</span>
            </div>

            <div>
              <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-ink leading-tight">
                Architect your path to your target role.
              </h1>
              <p className="mt-3 text-[14px] text-ink-muted leading-relaxed">
                Deterministic skill benchmarking, ATS-tailored resume intelligence, and daily AI-guided career coaching for ambitious college students.
              </p>
            </div>

            {/* Feature bullets */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-[13px]">
                  <span className="font-semibold text-ink">Actionable daily career roadmap</span>
                  <p className="text-ink-muted text-[12px]">Step-by-step milestone tracking from semester to offer letter.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-[13px]">
                  <span className="font-semibold text-ink">AI reasoning & gap analysis</span>
                  <p className="text-ink-muted text-[12px]">Identifies missing competencies against top industry hiring benchmarks.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-[13px]">
                  <span className="font-semibold text-ink">Targeted pipeline tracker</span>
                  <p className="text-ink-muted text-[12px]">Keep 100% visibility over applications, interviews, and offers.</p>
                </div>
              </div>
            </div>

            {/* Testimonial card */}
            <div className="mt-2 p-4 rounded-xl bg-surface/90 border border-border/80 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-accent/15 text-accent font-bold text-xs flex items-center justify-center border border-accent/30">
                  AR
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-ink leading-tight">Alex Rivera</h4>
                  <p className="text-[11px] text-ink-muted leading-tight">Junior Track • CS Major</p>
                </div>
              </div>
              <p className="text-[12px] text-ink-muted italic leading-relaxed font-ai">
                &ldquo;CareerOS helped me jump my role readiness benchmark from 48% to 74% in 6 weeks with clear daily drills.&rdquo;
              </p>
            </div>
          </div>

          {/* Right Column: Form Container Card */}
          <div className="col-span-1 lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md bg-surface/95 dark:bg-zinc-900/95 backdrop-blur-md border border-border/80 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-black/30">
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  {title}
                </h2>
                <p className="text-[13px] text-ink-muted mt-1">
                  {subtitle}
                </p>
              </div>

              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[12px] text-ink-muted border-t border-border/60">
        <span>© 2026 CareerOS Inc. Empowering student career intelligence.</span>
      </footer>
    </div>
  );
};
