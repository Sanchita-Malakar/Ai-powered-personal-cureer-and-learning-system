"use client";

import React from "react";
import { SettingsTabId } from "@/types/settings";
import {
  Settings,
  ArrowLeft,
  CheckCircle2,
  Search,
} from "lucide-react";

interface SettingsHeaderProps {
  activeTab: SettingsTabId;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBackToDashboard?: () => void;
  savedToast?: boolean;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  activeTab,
  searchQuery,
  onSearchChange,
  onBackToDashboard,
  savedToast,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case "account":
        return "Account Settings";
      case "notifications":
        return "Notification Preferences";
      case "career":
        return "Career Preferences";
      case "privacy":
        return "Privacy & Visibility";
      case "connected":
        return "Connected Services";
      case "language":
        return "Language & Regional";
      case "security":
        return "Security & Authentication";
      default:
        return "Settings";
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb & Auto-save status */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted">
        <div className="flex items-center gap-2">
          {onBackToDashboard ? (
            <button
              onClick={onBackToDashboard}
              className="hover:text-ink flex items-center gap-1 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          ) : (
            <a
              href="/"
              className="hover:text-ink flex items-center gap-1 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </a>
          )}
          <span>/</span>
          <span className="text-ink font-bold flex items-center gap-1">
            <Settings className="w-3.5 h-3.5 text-accent" />
            Profile → Settings
          </span>
          <span>/</span>
          <span className="text-accent font-semibold">{getTabTitle()}</span>
        </div>

        <div className="flex items-center gap-2">
          {savedToast ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Changes saved
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-canvas text-ink-muted border border-border/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Auto-saved to cloud
            </span>
          )}
        </div>
      </div>

      {/* Main Header Block */}
      <div className="rounded-3xl bg-surface border border-border/80 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-accent" />
            <span>Settings & Preferences</span>
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Manage your account security, notification rules, career filters, privacy controls, and connected services.
          </p>
        </div>

        {/* Quick Filter Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search settings..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-canvas border border-border text-xs rounded-xl pl-9 pr-3 py-2 text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent"
          />
        </div>
      </div>
    </div>
  );
};
