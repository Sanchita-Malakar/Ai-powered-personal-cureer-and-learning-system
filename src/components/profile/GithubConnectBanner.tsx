"use client";

import React, { useState, useEffect } from "react";
import {
  Github,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Unlink,
  RefreshCw,
  Loader2,
  AlertCircle,
  FolderGit2,
} from "lucide-react";
import { authenticatedFetch } from "@/lib/apiClient";

interface GithubConnectBannerProps {
  userId?: string;
  onConnectionChange?: () => void;
  onOpenRepoSelector?: () => void;
}

export const GithubConnectBanner: React.FC<GithubConnectBannerProps> = ({
  userId,
  onConnectionChange,
  onOpenRepoSelector,
}) => {
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [status, setStatus] = useState<{
    isConnected: boolean;
    username: string | null;
    installationId: number | null;
    repoCount: number;
    isAppConfigured: boolean;
    hasDevTokenFallback: boolean;
  }>({
    isConnected: false,
    username: null,
    installationId: null,
    repoCount: 0,
    isAppConfigured: false,
    hasDevTokenFallback: false,
  });
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await authenticatedFetch("/api/github/connection-status");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStatus({
            isConnected: data.isConnected,
            username: data.username,
            installationId: data.installationId,
            repoCount: data.repoCount || 0,
            isAppConfigured: data.isAppConfigured,
            hasDevTokenFallback: data.hasDevTokenFallback,
          });
        }
      }
    } catch (e) {
      console.warn("Could not fetch GitHub status:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Check for callback query params in URL
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("github_connected") === "true") {
        fetchStatus();
        window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
      } else if (urlParams.get("github_error")) {
        setErrorNotice(decodeURIComponent(urlParams.get("github_error") || "GitHub connection failed"));
        window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
      }
    }
  }, [userId]);

  const handleConnect = async () => {
    setConnecting(true);
    setErrorNotice(null);
    try {
      const res = await authenticatedFetch("/api/github/connect");
      const data = await res.json();

      if (data.success && data.url) {
        // Redirect student to GitHub App installation page
        window.location.href = data.url;
      } else {
        setErrorNotice(
          data.message ||
            "GitHub App is not configured yet. For local testing, public repositories and development fallback are active."
        );
        setConnecting(false);
      }
    } catch (err: any) {
      setErrorNotice(err.message || "Failed to initiate GitHub authorization.");
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect your GitHub account from CareerOS?")) return;
    setDisconnecting(true);
    try {
      const res = await authenticatedFetch("/api/github/disconnect", {
        method: "POST",
      });
      if (res.ok) {
        await fetchStatus();
        if (onConnectionChange) onConnectionChange();
      }
    } catch {
      // Non-fatal
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-2 mb-5">
      {errorNotice && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorNotice}</span>
          </div>
          <button onClick={() => setErrorNotice(null)} className="text-[11px] underline font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {status.isConnected ? (
        /* Connected State */
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink">GitHub Connected</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>@{status.username}</span>
                </span>
              </div>
              <p className="text-[11px] text-ink-muted mt-0.5">
                {status.repoCount > 0
                  ? `${status.repoCount} repository(ies) granted via CareerOS GitHub App`
                  : "All repositories accessible via installation"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenRepoSelector && (
              <button
                type="button"
                onClick={onOpenRepoSelector}
                className="px-3 py-1.5 rounded-xl bg-surface border border-border/80 text-xs font-semibold text-ink hover:text-accent transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-accent" />
                <span>Browse Authorized Repos</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="px-2.5 py-1.5 rounded-xl bg-surface border border-border/70 text-xs text-ink-muted hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
              title="Disconnect GitHub connection"
            >
              {disconnecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Unlink className="w-3.5 h-3.5" />}
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      ) : (
        /* Not Connected State */
        <div className="p-4 rounded-2xl bg-canvas/90 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center border border-accent/25">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-ink">Connect GitHub for Evidence Verification</h4>
              <p className="text-[11px] text-ink-muted mt-0.5 leading-relaxed">
                Authorize the CareerOS GitHub App to inspect repositories you explicitly grant read access to.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConnect}
            disabled={connecting}
            className="px-4 py-2 rounded-xl bg-accent text-white font-bold hover:bg-accent/90 transition-all flex items-center gap-2 shadow-sm shadow-accent/25 shrink-0 cursor-pointer disabled:opacity-50"
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
        </div>
      )}
    </div>
  );
};
