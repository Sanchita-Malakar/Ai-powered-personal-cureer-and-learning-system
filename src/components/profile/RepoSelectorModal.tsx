"use client";

import React, { useState, useEffect } from "react";
import { GithubPermittedRepo } from "@/types/verification";
import {
  X,
  Search,
  FolderGit2,
  Lock,
  Globe,
  Check,
  ExternalLink,
  Loader2,
  FolderTree,
  AlertCircle,
} from "lucide-react";
import { authenticatedFetch } from "@/lib/apiClient";

interface RepoSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onSelectRepo: (repo: GithubPermittedRepo, rootPath?: string) => void;
  initialRootPath?: string;
}

export const RepoSelectorModal: React.FC<RepoSelectorModalProps> = ({
  isOpen,
  onClose,
  userId,
  onSelectRepo,
  initialRootPath = "",
}) => {
  const [repos, setRepos] = useState<GithubPermittedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRepoId, setSelectedRepoId] = useState<number | null>(null);
  const [rootPath, setRootPath] = useState(initialRootPath);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setErrorNotice(null);
      setRootPath(initialRootPath || "");

      authenticatedFetch("/api/github/repositories")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.repositories) {
            setRepos(data.repositories);
          } else {
            setErrorNotice(data.message || "No authorized repositories found. Make sure you granted access to repositories during GitHub App setup.");
          }
        })
        .catch((err) => {
          setErrorNotice(err.message || "Failed to load authorized repositories.");
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, userId, initialRootPath]);

  if (!isOpen) return null;

  const filteredRepos = repos.filter(
    (r) =>
      r.repositoryName.toLowerCase().includes(search.toLowerCase()) ||
      r.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = () => {
    if (!selectedRepoId) return;
    const target = repos.find((r) => r.githubRepositoryId === selectedRepoId);
    if (!target) return;

    // Validate root path if provided
    if (rootPath && (rootPath.includes("..") || rootPath.includes("~"))) {
      alert("Invalid root path: directory traversal (..) is not permitted.");
      return;
    }

    onSelectRepo(target, rootPath.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-surface border border-border shadow-2xl p-6 sm:p-7 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 text-accent flex items-center justify-center border border-accent/25">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Authorized GitHub Repositories</h3>
              <p className="text-xs text-ink-muted">
                Repositories you explicitly granted CareerOS read access to.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-border/60 text-ink-muted hover:text-ink transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search your authorized repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
          />
        </div>

        {/* Error message */}
        {errorNotice && (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* Repositories List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {loading ? (
            <div className="py-8 text-center text-xs text-ink-muted flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              <span>Fetching authorized repositories...</span>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-border/80 text-xs text-ink-muted space-y-1">
              <FolderGit2 className="w-6 h-6 text-ink-muted mx-auto opacity-50 mb-1" />
              <p className="font-semibold text-ink">No repositories match your search</p>
              <p className="text-[11px]">
                To grant access to more repositories, click "Manage App on GitHub".
              </p>
            </div>
          ) : (
            filteredRepos.map((repo) => {
              const isSelected = selectedRepoId === repo.githubRepositoryId;

              return (
                <div
                  key={repo.githubRepositoryId}
                  onClick={() => setSelectedRepoId(repo.githubRepositoryId)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-accent/10 border-accent text-ink shadow-xs"
                      : "bg-canvas/70 border-border/70 hover:border-border hover:bg-canvas"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? "border-accent bg-accent text-white" : "border-border"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-ink truncate">
                          {repo.fullName}
                        </span>
                        {repo.private ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 shrink-0">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Private</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 shrink-0">
                            <Globe className="w-2.5 h-2.5" />
                            <span>Public</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-ink-muted truncate block">
                        Branch: {repo.defaultBranch}
                      </span>
                    </div>
                  </div>

                  <a
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg text-ink-muted hover:text-accent transition-colors shrink-0"
                    title="Open on GitHub"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })
          )}
        </div>

        {/* Monorepo Subdirectory Option */}
        <div className="p-3.5 rounded-2xl bg-canvas/90 border border-border/80 space-y-1.5 text-xs">
          <label className="font-bold text-ink flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5 text-accent" />
            <span>Monorepo Root Path (Optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. packages/client or apps/web (leave empty for repository root)"
            value={rootPath}
            onChange={(e) => setRootPath(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-accent font-mono text-[11px]"
          />
          <p className="text-[10px] text-ink-muted leading-relaxed">
            If your application lives in a monorepo subfolder, specify the relative path here.
            Only code inside this subfolder and top-level manifests will be evaluated.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/70 text-xs">
          <span className="text-[11px] text-ink-muted">
            {selectedRepoId ? "1 repository selected" : "Click a repository to select"}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-ink-muted hover:text-ink font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedRepoId}
              className="px-4 py-2 rounded-xl bg-accent text-white font-bold hover:bg-accent/90 transition-all flex items-center gap-1.5 shadow-sm shadow-accent/25 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Link Repository</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
