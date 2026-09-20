"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  JobPosting,
  JobApplication,
  JobFilterState,
  ApplicationStage,
} from "@/types/job";
import { INITIAL_JOB_POSTINGS, INITIAL_APPLICATIONS } from "@/data/mockJobData";
import { JobFilterBar } from "@/components/jobs/JobFilterBar";
import { JobCard } from "@/components/jobs/JobCard";
import { JobDetailModal } from "@/components/jobs/JobDetailModal";
import { ApplicationPipeline } from "@/components/jobs/ApplicationPipeline";
import { ApplicationDetailModal } from "@/components/jobs/ApplicationDetailModal";
import { AddApplicationModal } from "@/components/jobs/AddApplicationModal";
import {
  Briefcase,
  TrendingUp,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Bookmark,
  Send,
  Plus,
} from "lucide-react";

interface JobTrackerSectionProps {
  onBackToDashboard?: () => void;
  onAnalyzeResumeWithJob?: (jobId: string) => void;
}

export const JobTrackerSection: React.FC<JobTrackerSectionProps> = ({
  onBackToDashboard,
  onAnalyzeResumeWithJob,
}) => {
  // State for jobs and applications
  const [jobs, setJobs] = useState<JobPosting[]>(INITIAL_JOB_POSTINGS);
  const [applications, setApplications] = useState<JobApplication[]>(INITIAL_APPLICATIONS);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"explore" | "pipeline">("explore");

  // Filter state
  const [filters, setFilters] = useState<JobFilterState>({
    search: "",
    location: "",
    experience: "",
    skill: "",
    company: "",
  });

  // Modals state
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedApps = localStorage.getItem("career_os_job_applications");
      if (savedApps) {
        try {
          setApplications(JSON.parse(savedApps));
        } catch (e) {}
      }

      const savedIds = localStorage.getItem("career_os_saved_jobs");
      if (savedIds) {
        try {
          setSavedJobIds(JSON.parse(savedIds));
        } catch (e) {}
      }
    }
  }, []);

  // Save applications to localStorage helper
  const persistApplications = (updatedApps: JobApplication[]) => {
    setApplications(updatedApps);
    if (typeof window !== "undefined") {
      localStorage.setItem("career_os_job_applications", JSON.stringify(updatedApps));
    }
  };

  // Toggle saving a job
  const handleToggleSaveJob = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const isAlreadySaved = savedJobIds.includes(jobId);
    let newSaved: string[];

    if (isAlreadySaved) {
      newSaved = savedJobIds.filter((id) => id !== jobId);
      // Remove from saved applications pipeline
      const updatedApps = applications.filter((app) => !(app.jobId === jobId && app.stage === "saved"));
      persistApplications(updatedApps);
      setToastMessage(`Removed ${job.company} from saved jobs.`);
    } else {
      newSaved = [...savedJobIds, jobId];
      // Add to saved pipeline stage
      const newSavedApp: JobApplication = {
        id: `app-saved-${job.id}-${Date.now()}`,
        jobId: job.id,
        company: job.company,
        role: job.title,
        location: job.location,
        stage: "saved",
        resumeUsedName: "Alex_Rivera_AI_ML_Resume_v3.pdf",
        resumeMatchScore: job.resumeSuitabilityScore,
        jobDescription: job.completeDescription,
        notes: `Saved from Job Board with ${job.resumeSuitabilityScore}% resume suitability match.`,
        tasks: [
          { id: `t-review-${Date.now()}`, title: "Tailor resume keywords for role", completed: false },
        ],
        deadlines: {
          applicationDeadline: job.applicationDeadline,
        },
        appliedDate: "Saved today",
      };
      persistApplications([newSavedApp, ...applications]);
      setToastMessage(`Saved ${job.company} to your Application Pipeline!`);
    }

    setSavedJobIds(newSaved);
    if (typeof window !== "undefined") {
      localStorage.setItem("career_os_saved_jobs", JSON.stringify(newSaved));
    }

    setTimeout(() => setToastMessage(null), 3000);
  };

  // Quick track job as applied
  const handleTrackAsApplied = (job: JobPosting) => {
    const existing = applications.find((a) => a.jobId === job.id);
    if (existing) {
      // Move to applied stage
      handleMoveStage(existing.id, "applied");
    } else {
      const newApp: JobApplication = {
        id: `app-applied-${job.id}-${Date.now()}`,
        jobId: job.id,
        company: job.company,
        role: job.title,
        location: job.location,
        stage: "applied",
        resumeUsedName: "Alex_Rivera_AI_ML_Resume_v3.pdf",
        resumeMatchScore: job.resumeSuitabilityScore,
        jobDescription: job.completeDescription,
        notes: `Submitted application via ${job.applyUrl}.`,
        tasks: [
          { id: `t-${Date.now()}`, title: "Monitor applicant portal for OA invite", completed: false },
        ],
        deadlines: {
          applicationDeadline: job.applicationDeadline,
        },
        appliedDate: "Applied today",
      };
      persistApplications([newApp, ...applications]);
    }

    setSelectedJob(null);
    setToastMessage(`${job.company} added to Applied stage!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Move application between stages
  const handleMoveStage = (appId: string, nextStage: ApplicationStage) => {
    const updated = applications.map((app) =>
      app.id === appId ? { ...app, stage: nextStage } : app
    );
    persistApplications(updated);

    // If modal open, sync
    if (selectedApplication && selectedApplication.id === appId) {
      setSelectedApplication({ ...selectedApplication, stage: nextStage });
    }

    const appName = applications.find((a) => a.id === appId)?.company || "Application";
    setToastMessage(`${appName} moved to ${nextStage.toUpperCase()}!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Update application details from modal
  const handleUpdateApplication = (updatedApp: JobApplication) => {
    const updated = applications.map((a) =>
      a.id === updatedApp.id ? updatedApp : a
    );
    persistApplications(updated);
    setSelectedApplication(updatedApp);
  };

  // Delete an application
  const handleDeleteApplication = (appId: string) => {
    const updated = applications.filter((a) => a.id !== appId);
    persistApplications(updated);
    if (selectedApplication?.id === appId) {
      setSelectedApplication(null);
    }
  };

  // Add custom application
  const handleAddCustomApplication = (newApp: JobApplication) => {
    const updated = [newApp, ...applications];
    persistApplications(updated);
    setToastMessage(`Custom application for ${newApp.company} tracked in pipeline!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.company.toLowerCase().includes(query);
        const matchesDesc = job.completeDescription.toLowerCase().includes(query);
        const matchesSkill = job.requiredSkills.some((s) => s.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCompany && !matchesDesc && !matchesSkill) {
          return false;
        }
      }

      if (filters.company && job.company !== filters.company) {
        return false;
      }

      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      if (filters.experience && job.experienceLevel !== filters.experience) {
        return false;
      }

      if (filters.skill && !job.requiredSkills.includes(filters.skill)) {
        return false;
      }

      return true;
    });
  }, [jobs, filters]);

  const availableCompanies = useMemo(() => {
    return Array.from(new Set(jobs.map((j) => j.company))).sort();
  }, [jobs]);

  const handleFilterChange = (key: keyof JobFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      location: "",
      experience: "",
      skill: "",
      company: "",
    });
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Top Breadcrumb Navigation */}
      {onBackToDashboard && (
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface hover:bg-canvas border border-border/80 text-xs font-semibold text-ink-muted hover:text-ink transition-all shadow-2xs group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Dashboard Overview</span>
          </button>

          <span className="text-[11px] font-semibold text-ink-muted bg-surface/70 px-2.5 py-1 rounded-lg border border-border/60">
            Navigation: Left Sidebar → Job Tracker
          </span>
        </div>
      )}

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-border/80 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-accent/10 text-accent border border-accent/20">
              <Briefcase className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Career Pipeline & Opportunities
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Job Tracker
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1 max-w-xl">
            Discover roles matched to your student skill profile, assess resume suitability, and track applications across all pipeline stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-canvas/60 border border-border/70 flex items-center gap-3 text-center">
            <div>
              <span className="text-lg font-extrabold text-ink leading-none block">
                {applications.filter((a) => a.stage === "interview").length}
              </span>
              <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Interviews
              </span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <span className="text-lg font-extrabold text-ink leading-none block">
                {applications.filter((a) => a.stage === "offer").length}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Offers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and View Mode Switcher */}
      <JobFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        availableCompanies={availableCompanies}
        totalJobsCount={filteredJobs.length}
        totalApplicationsCount={applications.length}
      />

      {/* Main Content Area */}
      {viewMode === "explore" ? (
        /* Job Search Grid */
        <div>
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-surface border border-border/80 text-ink-muted">
              <p className="text-sm font-semibold">No jobs match your current search filters.</p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 text-xs font-bold text-accent hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={savedJobIds.includes(job.id)}
                  onSelectJob={setSelectedJob}
                  onToggleSave={handleToggleSaveJob}
                  onQuickTrack={handleTrackAsApplied}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Application Pipeline (5-Stage Kanban) */
        <ApplicationPipeline
          applications={applications}
          onSelectApplication={setSelectedApplication}
          onMoveStage={handleMoveStage}
          onDeleteApplication={handleDeleteApplication}
          onOpenAddModal={() => setShowAddModal(true)}
        />
      )}

      {/* Job Details Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={Boolean(selectedJob)}
        isSaved={selectedJob ? savedJobIds.includes(selectedJob.id) : false}
        onClose={() => setSelectedJob(null)}
        onToggleSave={handleToggleSaveJob}
        onTrackAsApplied={handleTrackAsApplied}
        onAnalyzeResume={(job) => {
          setSelectedJob(null);
          onAnalyzeResumeWithJob?.(job.id);
        }}
      />

      {/* Application Details Modal */}
      <ApplicationDetailModal
        application={selectedApplication}
        isOpen={Boolean(selectedApplication)}
        onClose={() => setSelectedApplication(null)}
        onUpdateApplication={handleUpdateApplication}
      />

      {/* Track Custom Application Modal */}
      <AddApplicationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddApplication={handleAddCustomApplication}
      />
    </div>
  );
};
