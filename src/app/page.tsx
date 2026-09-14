"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Hero } from "@/components/dashboard/Hero";
import { MetricStrip } from "@/components/dashboard/MetricStrip";
import { AiTodaysPlan } from "@/components/dashboard/AiTodaysPlan";
import { CareerRoadmap } from "@/components/dashboard/CareerRoadmap";
import { YourProgress } from "@/components/dashboard/YourProgress";
import { RecommendedJobs } from "@/components/dashboard/RecommendedJobs";
import { NeedsAttention } from "@/components/dashboard/NeedsAttention";
import { RecentApplications } from "@/components/dashboard/RecentApplications";
import { useDashboardData } from "@/hooks/useDashboardData";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { data, isPlanStarted, togglePlanItem, startPlan, dismissAlert } =
    useDashboardData();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-canvas bg-ambient-mesh text-ink transition-colors duration-200">
      {/* 1. Full-width Top Navbar */}
      <Navbar onToggleMobileMenu={() => setMobileNavOpen((prev) => !prev)} />

      {/* 2. Left Icon-only Sidebar (64px fixed) */}
      <Sidebar
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* 3. Main Dashboard Content (Responsive max-width and padding) */}
      <main className="pt-14 md:pl-16 min-h-screen">
        <div className="w-full max-w-[1160px] px-3.5 sm:px-6 lg:px-8 py-5 sm:py-7 animate-in fade-in duration-300">
          {/* Hero Section */}
          <Hero profile={data.profile} />

          {/* Metric Strip: 4-up row with 3D hover */}
          <MetricStrip metrics={data.metrics} />

          {/* Stacking Rows: Two-up grid with 3D cards */}
          <div className="space-y-4 sm:space-y-5">
            {/* Row 2: AI Today's Plan + Career Roadmap */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-stretch">
              <AiTodaysPlan
                plan={data.aiPlan}
                isStarted={isPlanStarted}
                onToggleItem={togglePlanItem}
                onStartPlan={startPlan}
              />
              <CareerRoadmap
                milestones={data.roadmap.milestones}
                currentMilestoneIndex={data.roadmap.currentMilestoneIndex}
              />
            </div>

            {/* Row 3: Your Progress + Recommended Jobs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-stretch">
              <YourProgress progressList={data.progress} />
              <RecommendedJobs jobs={data.recommendedJobs} />
            </div>

            {/* Row 4: Needs Attention + Recent Applications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-stretch">
              <NeedsAttention alerts={data.alerts} onDismiss={dismissAlert} />
              <RecentApplications applications={data.recentApplications} />
            </div>
          </div>
        </div>
      </main>
      </div>
    </AuthGuard>
  );
}
