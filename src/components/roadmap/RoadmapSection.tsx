"use client";

import React, { useState, useEffect, useMemo } from "react";
import { TimelineTrack } from "@/components/roadmap/TimelineTrack";
import { MilestoneCard } from "@/components/roadmap/MilestoneCard";
import { RoadmapHeader } from "@/components/roadmap/RoadmapHeader";
import { AiRecalibrateModal } from "@/components/roadmap/AiRecalibrateModal";
import { ROLE_ROADMAPS } from "@/data/mockRoadmapData";
import { RoleRoadmap, RecalibrationPacing } from "@/types/roadmap";
import { CheckCircle2, RotateCcw, ArrowLeft } from "lucide-react";

interface RoadmapSectionProps {
  onBackToDashboard?: () => void;
}

export const RoadmapSection: React.FC<RoadmapSectionProps> = ({
  onBackToDashboard,
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("ai-ml-engineer");
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "current" | "completed" | "upcoming">("all");
  const [showRecalibrateModal, setShowRecalibrateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Local state for roadmap data allowing interactive task checking and custom tasks
  const [roadmapsState, setRoadmapsState] = useState<Record<string, RoleRoadmap>>(ROLE_ROADMAPS);

  // Hydrate student's role from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("career_os_student_profile");
      if (raw) {
        try {
          const profile = JSON.parse(raw);
          if (profile.careerPreferences?.primaryRole?.toLowerCase().includes("full")) {
            setSelectedRoleId("junior-full-stack-developer");
          } else {
            setSelectedRoleId("ai-ml-engineer");
          }
        } catch (e) {}
      }

      // Check for saved roadmap progress
      const savedRoadmaps = localStorage.getItem("career_os_custom_roadmaps");
      if (savedRoadmaps) {
        try {
          setRoadmapsState(JSON.parse(savedRoadmaps));
        } catch (e) {}
      }
    }
  }, []);

  const currentRoadmap = roadmapsState[selectedRoleId] || ROLE_ROADMAPS["ai-ml-engineer"];

  const handleToggleTask = (milestoneId: string, taskId: string) => {
    setRoadmapsState((prev) => {
      const targetMap = prev[selectedRoleId] || ROLE_ROADMAPS[selectedRoleId];
      const updatedMilestones = targetMap.milestones.map((m) => {
        if (m.id !== milestoneId) return m;

        const updatedTasks = m.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );

        const completedCount = updatedTasks.filter((t) => t.completed).length;
        const newPercent = Math.round((completedCount / updatedTasks.length) * 100);

        return {
          ...m,
          tasks: updatedTasks,
          completionPercentage: newPercent,
          status: (newPercent === 100 ? "completed" : newPercent > 0 ? "current" : m.status) as any,
        };
      });

      const next = {
        ...prev,
        [selectedRoleId]: {
          ...targetMap,
          milestones: updatedMilestones,
        },
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("career_os_custom_roadmaps", JSON.stringify(next));
      }
      return next;
    });
  };

  const handleAddTask = (milestoneId: string, taskTitle: string) => {
    setRoadmapsState((prev) => {
      const targetMap = prev[selectedRoleId] || ROLE_ROADMAPS[selectedRoleId];
      const updatedMilestones = targetMap.milestones.map((m) => {
        if (m.id !== milestoneId) return m;

        const newTask = {
          id: `task-custom-${Date.now()}`,
          title: taskTitle,
          completed: false,
          isCustom: true,
        };

        const updatedTasks = [...m.tasks, newTask];
        const completedCount = updatedTasks.filter((t) => t.completed).length;
        const newPercent = Math.round((completedCount / updatedTasks.length) * 100);

        return {
          ...m,
          tasks: updatedTasks,
          completionPercentage: newPercent,
        };
      });

      const next = {
        ...prev,
        [selectedRoleId]: {
          ...targetMap,
          milestones: updatedMilestones,
        },
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("career_os_custom_roadmaps", JSON.stringify(next));
      }
      return next;
    });

    setToastMessage("Custom task added to milestone!");
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleApplyRecalibration = (pacing: RecalibrationPacing) => {
    setRoadmapsState((prev) => {
      const targetMap = prev[selectedRoleId] || ROLE_ROADMAPS[selectedRoleId];
      let updatedMilestones = [...targetMap.milestones];

      if (pacing === "placement-sprint") {
        // Fast-track DSA and Resume into current priority
        updatedMilestones = updatedMilestones.map((m) => {
          if (m.stageName === "DSA" || m.stageName === "Resume") {
            return {
              ...m,
              status: "current" as any,
              estimatedWeeks: "Top Priority • Next 3 Weeks",
              aiCoachNote: "AI Priority Override: Brought forward to clear impending campus screening tests.",
            };
          }
          return m;
        });
        setToastMessage("Roadmap recalibrated: DSA & Resume placed into immediate priority!");
      } else if (pacing === "fast-track") {
        updatedMilestones = updatedMilestones.map((m) => {
          if (m.stepNumber === 4 || m.stepNumber === 5) {
            return {
              ...m,
              status: "current" as any,
              estimatedWeeks: "Accelerated Sprint",
              aiCoachNote: "AI Fast-Track: Foundations cleared early; unlocked LLM & PyTorch deployments.",
            };
          }
          return m;
        });
        setToastMessage("Roadmap recalibrated: Fast-track sprint mode activated!");
      } else {
        setToastMessage("Roadmap recalibrated: Balanced mastery mode applied.");
      }

      const next = {
        ...prev,
        [selectedRoleId]: {
          ...targetMap,
          milestones: updatedMilestones,
        },
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("career_os_custom_roadmaps", JSON.stringify(next));
      }
      return next;
    });

    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResetRoadmap = () => {
    setRoadmapsState(ROLE_ROADMAPS);
    if (typeof window !== "undefined") {
      localStorage.removeItem("career_os_custom_roadmaps");
    }
    setToastMessage("Roadmap reset to default verified track.");
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Calculate overall statistics
  const totalMilestonesCount = currentRoadmap.milestones.length;
  const completedMilestonesCount = currentRoadmap.milestones.filter(
    (m) => m.status === "completed" || m.completionPercentage === 100
  ).length;

  const overallProgress = useMemo(() => {
    const totalPercentage = currentRoadmap.milestones.reduce(
      (acc, m) => acc + m.completionPercentage,
      0
    );
    return Math.round(totalPercentage / totalMilestonesCount);
  }, [currentRoadmap.milestones, totalMilestonesCount]);

  // Filter milestones based on active timeline stage and status tab
  const filteredMilestones = useMemo(() => {
    return currentRoadmap.milestones.filter((m) => {
      // Timeline stage filter
      if (activeStageId) {
        const stage = currentRoadmap.stages.find((s) => s.id === activeStageId);
        if (stage && !stage.milestoneIds.includes(m.id)) {
          return false;
        }
      }

      // Status pill filter
      if (statusFilter === "current") {
        return m.status === "current" || (m.completionPercentage > 0 && m.completionPercentage < 100);
      }
      if (statusFilter === "completed") {
        return m.status === "completed" || m.completionPercentage === 100;
      }
      if (statusFilter === "upcoming") {
        return m.status === "upcoming" && m.completionPercentage === 0;
      }

      return true;
    });
  }, [currentRoadmap, activeStageId, statusFilter]);

  const availableRoleOptions = [
    { id: "ai-ml-engineer", title: "AI/ML Engineer" },
    { id: "junior-full-stack-developer", title: "Junior Full Stack Developer" },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      {/* Top back navigation breadcrumb if opened from inside dashboard */}
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
            Navigation: Left Sidebar → Career Roadmap
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

      {/* Header: Title, Target Role Switcher, Completion Gauge & Filters */}
      <RoadmapHeader
        selectedRole={selectedRoleId}
        onSelectRole={setSelectedRoleId}
        availableRoles={availableRoleOptions}
        overallProgress={overallProgress}
        completedMilestonesCount={completedMilestonesCount}
        totalMilestonesCount={totalMilestonesCount}
        statusFilter={statusFilter}
        onSelectFilter={setStatusFilter}
        onOpenRecalibrate={() => setShowRecalibrateModal(true)}
      />

      {/* Visual Timeline Track (Current Level -> Skills -> Projects -> DSA -> Resume -> Applications -> Interviews -> Target Role) */}
      <TimelineTrack
        stages={currentRoadmap.stages}
        activeStageId={activeStageId}
        onSelectStage={setActiveStageId}
      />

      {/* Milestones Cards List */}
      <div className="space-y-4">
        {filteredMilestones.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-surface border border-border/80 text-ink-muted">
            <p className="text-sm font-semibold">No milestones match the selected filter.</p>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("all");
                setActiveStageId(null);
              }}
              className="mt-2 text-xs font-bold text-accent hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredMilestones.map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
            />
          ))
        )}
      </div>

      {/* Footer action bar */}
      <div className="mt-8 pt-4 border-t border-border/70 flex items-center justify-between text-xs text-ink-muted">
        <span>CareerOS Dynamic Adaptive Roadmap Engine</span>
        <button
          type="button"
          onClick={handleResetRoadmap}
          className="inline-flex items-center gap-1 text-ink-muted hover:text-action transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Standard Track</span>
        </button>
      </div>

      {/* AI Recalibration Modal */}
      <AiRecalibrateModal
        isOpen={showRecalibrateModal}
        onClose={() => setShowRecalibrateModal(false)}
        onApplyRecalibration={handleApplyRecalibration}
      />
    </div>
  );
};
