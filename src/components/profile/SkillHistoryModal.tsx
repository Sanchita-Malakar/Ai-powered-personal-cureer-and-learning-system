"use client";

import React, { useState, useEffect } from "react";
import { SkillHistoryEntry } from "@/types/verification";
import {
  X,
  History,
  TrendingUp,
  FolderGit2,
  Calendar,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { authenticatedFetch } from "@/lib/apiClient";

interface SkillHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillName: string;
  currentPercentage?: number;
  currentLevel?: string;
  isVerified?: boolean;
  evidenceProjectsCount?: number;
  userId?: string;
  localHistory?: SkillHistoryEntry[];
}

export const SkillHistoryModal: React.FC<SkillHistoryModalProps> = ({
  isOpen,
  onClose,
  skillName,
  currentPercentage = 20,
  currentLevel = "Exposure",
  isVerified = false,
  evidenceProjectsCount = 0,
  userId,
  localHistory = [],
}) => {
  const [history, setHistory] = useState<SkillHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && skillName) {
      // 1. Check local entries first
      const matchedLocal = localHistory.filter(
        (h) => h.skillName.toLowerCase() === skillName.toLowerCase()
      );

      // 2. Fetch from database if user is authenticated
      if (userId && !userId.startsWith("demo-")) {
        setLoading(true);
        authenticatedFetch(`/api/profile/skills/${encodeURIComponent(skillName)}/history`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.history && data.history.length > 0) {
              setHistory(data.history);
            } else {
              setHistory(matchedLocal);
            }
          })
          .catch(() => setHistory(matchedLocal))
          .finally(() => setLoading(false));
      } else {
        setHistory(matchedLocal);
      }
    }
  }, [isOpen, skillName, userId, localHistory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-surface border border-border shadow-2xl p-6 sm:p-7 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 text-accent flex items-center justify-center border border-accent/25">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-ink">{skillName}</span>
                {isVerified ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                    Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-500 border border-slate-500/30">
                    Claimed
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-muted">Evidence & Verification Progression</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-border/60 text-ink-muted hover:text-ink transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current State Card */}
        <div className="p-4 rounded-2xl bg-canvas/80 border border-border/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-ink-muted uppercase">
              Current Evidence Level
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-ink">{currentPercentage}%</span>
              <span className="text-xs font-bold text-accent">{currentLevel}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold text-ink-muted">Backing Projects</span>
            <p className="text-xs font-bold text-ink flex items-center justify-end gap-1 mt-0.5">
              <FolderGit2 className="w-3.5 h-3.5 text-accent" />
              <span>{evidenceProjectsCount} Project(s)</span>
            </p>
          </div>
        </div>

        {/* Audit Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-accent" />
            <span>Progression Audit Trail</span>
          </h4>

          {loading ? (
            <p className="text-xs text-ink-muted italic py-4 text-center">Loading audit history...</p>
          ) : history.length === 0 ? (
            <div className="p-6 text-center rounded-2xl border border-dashed border-border/80 space-y-1.5">
              <ShieldCheck className="w-6 h-6 text-ink-muted mx-auto opacity-50" />
              <p className="text-xs font-semibold text-ink">Initial Student-Claimed Baseline</p>
              <p className="text-[11px] text-ink-muted max-w-xs mx-auto">
                This skill is currently at baseline. When you verify a project using {skillName}, the evidence calculation will record audit logs here.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-border/60">
              {history.map((entry, idx) => (
                <div key={idx} className="relative pl-7 text-xs space-y-1">
                  <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-accent border-2 border-surface" />
                  <div className="p-3 rounded-2xl bg-canvas/70 border border-border/70 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink flex items-center gap-1.5">
                        <span className="text-ink-muted line-through">{entry.previousPercentage}%</span>
                        <span className="text-emerald-500 font-extrabold">→ {entry.newPercentage}%</span>
                        <span className="text-[10px] text-ink-muted">({entry.newLevel})</span>
                      </span>
                      <span className="text-[10px] text-ink-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-muted">{entry.changeReason}</p>
                    {entry.projectTitle && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent mt-0.5">
                        <FolderGit2 className="w-3 h-3" />
                        <span>{entry.projectTitle}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface border border-border/80 text-xs font-bold text-ink hover:bg-border/60 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
