"use client";

import React, { useState, useEffect } from "react";
import { ProjectItem } from "@/types/onboarding";
import { authenticatedFetch } from "@/lib/apiClient";
import {
  ShieldCheck,
  Github,
  Code2,
  Cpu,
  Layers,
  FileCheck2,
  X,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FolderGit2,
  Loader2,
} from "lucide-react";

interface ProjectAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectItem | null;
  onAuthorizeAndVerify: (project: ProjectItem) => void;
  onOpenRepoSelector?: () => void;
  isVerifying?: boolean;
}

export const ProjectAuthModal: React.FC<ProjectAuthModalProps> = ({
  isOpen,
  onClose,
  project,
  onAuthorizeAndVerify,
  onOpenRepoSelector,
  isVerifying = false,
}) => {
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    isConnected: boolean;
    username: string | null;
    isAppConfigured: boolean;
  }>({
    isConnected: false,
    username: null,
    isAppConfigured: false,
  });
  const [connectError, setConnectError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCheckingConnection(true);
      setConnectError(null);
      authenticatedFetch("/api/github/connection-status")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setConnectionStatus({
              isConnected: data.isConnected,
              username: data.username,
              isAppConfigured: data.isAppConfigured,
            });
          }
        })
        .catch(() => {
          // Fall through
        })
        .finally(() => setCheckingConnection(false));
    }
  }, [isOpen]);

  if (!isOpen || !project) return null;

  const handleConnectGithub = async () => {
    setConnecting(true);
    setConnectError(null);
    try {
      const res = await authenticatedFetch("/api/github/connect");
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        setConnectError(
          data.message ||
            "GitHub App is not configured yet. Public repositories can be verified directly."
        );
        setConnecting(false);
      }
    } catch (err: any) {
      setConnectError(err.message || "Failed to initiate GitHub authorization.");
      setConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-surface border border-border shadow-2xl p-6 sm:p-7 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-2 border-b border-border/70">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-accent/15 text-accent flex items-center justify-center border border-accent/25">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink">Project Verification</h3>
              <p className="text-xs text-ink-muted">Evidence-Based Repository Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isVerifying || connecting}
            className="p-1.5 rounded-xl hover:bg-border/60 text-ink-muted hover:text-ink transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Project Target Box */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink">{project.title}</span>
            <span className="text-[11px] font-semibold text-accent">{project.role}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-ink-muted font-mono truncate">
            <Github className="w-3.5 h-3.5 shrink-0 text-ink" />
            <span className="truncate">{project.githubUrl}</span>
          </div>
          {project.rootPath && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-ink-muted">
              <span className="font-semibold text-accent">Root Path:</span>
              <span>{project.rootPath}</span>
            </div>
          )}
        </div>

        {/* GitHub Connection State Banner */}
        {checkingConnection ? (
          <div className="p-3 rounded-2xl bg-canvas border border-border text-xs text-ink-muted flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-accent" />
            <span>Checking GitHub authorization...</span>
          </div>
        ) : connectionStatus.isConnected ? (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-2 text-xs text-emerald-600 dark:text-emerald-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Connected to GitHub as <strong>@{connectionStatus.username}</strong>
              </span>
            </div>
            {onOpenRepoSelector && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRepoSelector();
                }}
                className="text-[11px] underline font-bold hover:text-emerald-500 cursor-pointer"
              >
                Change Repo
              </button>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/25 space-y-2 text-xs">
            <div className="flex items-start gap-2 text-blue-600 dark:text-blue-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Connect GitHub to verify private repositories</p>
                <p className="text-[11px] text-blue-600/80 dark:text-blue-400/80 mt-0.5">
                  CareerOS can only analyze private repositories that you explicitly grant access to via the GitHub App.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleConnectGithub}
              disabled={connecting}
              className="w-full py-2 px-3 rounded-xl bg-ink text-canvas text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {connecting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Redirecting to GitHub...</span>
                </>
              ) : (
                <>
                  <Github className="w-3.5 h-3.5" />
                  <span>Connect GitHub</span>
                </>
              )}
            </button>
            {connectError && (
              <p className="text-[11px] text-red-500 mt-1">{connectError}</p>
            )}
          </div>
        )}

        {/* Scope and Transparency Statement */}
        <div className="space-y-2.5">
          <p className="text-xs text-ink-muted leading-relaxed">
            Project Verification inspects your repository code to establish evidence-based signals:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink font-medium">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-surface border border-border/60">
              <Code2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Technologies actually used</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-surface border border-border/60">
              <Layers className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Code structure & architecture</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-surface border border-border/60">
              <Cpu className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>Implementation depth</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-surface border border-border/60">
              <FileCheck2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Tests & documentation</span>
            </div>
          </div>
        </div>

        {/* Privacy & Safety Note */}
        <div className="p-3 rounded-2xl bg-canvas border border-border/80 flex items-start gap-2.5 text-xs text-ink-muted">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
          <span className="leading-relaxed">
            <strong>Security Guarantee:</strong> We never execute repository code or scripts.
            Analysis is read-only and strictly used to verify skills in your CareerOS profile.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isVerifying || connecting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-muted hover:text-ink hover:bg-border/60 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onAuthorizeAndVerify(project)}
            disabled={isVerifying || connecting}
            className="px-5 py-2.5 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 transition-all flex items-center gap-2 shadow-sm shadow-accent/25 cursor-pointer disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying Repository...</span>
              </>
            ) : (
              <>
                <span>Verify Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
