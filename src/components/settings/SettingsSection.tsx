"use client";

import React, { useState, useEffect } from "react";
import { SettingsTabId, UserSettingsState } from "@/types/settings";
import { DEFAULT_USER_SETTINGS } from "@/data/mockSettingsData";
import { SettingsHeader } from "./SettingsHeader";
import { AccountSettingsCard } from "./AccountSettingsCard";
import { NotificationPreferencesCard } from "./NotificationPreferencesCard";
import { CareerPreferencesSettingsCard } from "./CareerPreferencesSettingsCard";
import { PrivacySettingsCard } from "./PrivacySettingsCard";
import { ConnectedServicesCard } from "./ConnectedServicesCard";
import { LanguageSettingsCard } from "./LanguageSettingsCard";
import { SecuritySettingsCard } from "./SecuritySettingsCard";
import {
  User,
  Bell,
  Compass,
  Shield,
  Link2,
  Globe,
  KeyRound,
  Sparkles,
} from "lucide-react";

const SETTINGS_STORAGE_KEY = "career_os_settings";

interface SettingsSectionProps {
  onBackToDashboard?: () => void;
  onNavigateSection?: (sectionId: string, paramId?: string) => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  onBackToDashboard,
  onNavigateSection,
}) => {
  const [settings, setSettings] = useState<UserSettingsState>(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (raw) {
        try {
          return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(raw) };
        } catch {
          // ignore
        }
      }
    }
    return DEFAULT_USER_SETTINGS;
  });

  const [activeTab, setActiveTab] = useState<SettingsTabId>("account");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedToast, setSavedToast] = useState(false);

  // Sync section with URL hash if a specific setting is addressed, e.g. #settings-notifications
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash.includes("notification")) setActiveTab("notifications");
      else if (hash.includes("career")) setActiveTab("career");
      else if (hash.includes("privacy")) setActiveTab("privacy");
      else if (hash.includes("connected")) setActiveTab("connected");
      else if (hash.includes("security")) setActiveTab("security");
      else if (hash.includes("language")) setActiveTab("language");
    }
  }, []);

  const persistSettings = (updated: UserSettingsState) => {
    setSettings(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    }
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 1200);
  };

  const navItems = [
    {
      id: "account" as const,
      label: "Account Settings",
      description: "Profile photo, legal name & handle",
      icon: User,
    },
    {
      id: "notifications" as const,
      label: "Notification Preferences",
      description: "Application updates, deadlines & streaks",
      icon: Bell,
    },
    {
      id: "career" as const,
      label: "Career Preferences",
      description: "Roles, salary floor & locations",
      icon: Compass,
    },
    {
      id: "privacy" as const,
      label: "Privacy & Visibility",
      description: "Placement visibility & benchmarking",
      icon: Shield,
    },
    {
      id: "connected" as const,
      label: "Connected Services",
      description: "GitHub, LeetCode, Calendar & DB",
      icon: Link2,
    },
    {
      id: "language" as const,
      label: "Language & Regional",
      description: "Language, date format & timezone",
      icon: Globe,
    },
    {
      id: "security" as const,
      label: "Security & Authentication",
      description: "Password, 2FA & active sessions",
      icon: KeyRound,
    },
  ];

  return (
    <div className="min-h-screen text-ink space-y-7 animate-in fade-in duration-200">
      {/* 1. Header with Breadcrumb and Search */}
      <SettingsHeader
        activeTab={activeTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onBackToDashboard={onBackToDashboard}
        savedToast={savedToast}
      />

      {/* 2. Responsive 2-Column Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Navigation Rail (lg: 4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          {/* Mobile horizontal pill scroll */}
          <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? "bg-accent text-white shadow-xs"
                      : "bg-surface text-ink-muted hover:text-ink border border-border/80"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop vertical sidebar card */}
          <div className="hidden lg:block rounded-3xl bg-surface border border-border/80 p-3 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted px-3 py-1.5 block">
              Preferences Navigation
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-2xl text-left transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-accent text-white shadow-sm shadow-accent/20"
                      : "text-ink hover:bg-canvas/80 hover:text-accent"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isActive ? "bg-white/20 text-white" : "bg-canvas border border-border text-ink-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block leading-snug">
                      {item.label}
                    </span>
                    <span
                      className={`text-[11px] block truncate leading-tight mt-0.5 ${
                        isActive ? "text-white/80" : "text-ink-muted"
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* AI Helper Banner */}
          <div className="hidden lg:block p-4 rounded-3xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 text-xs space-y-1.5">
            <span className="text-[11px] font-bold text-accent flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              CareerOS Cloud Sync
            </span>
            <p className="text-ink-muted text-[11px] leading-relaxed">
              Updating your career preferences or minimum salary floor immediately recalibrates AI match scoring across your Job Tracker and Roadmap.
            </p>
          </div>
        </div>

        {/* Right Content Pane (lg: 8 cols) */}
        <div className="lg:col-span-8">
          {activeTab === "account" && (
            <AccountSettingsCard
              account={settings.account}
              onUpdate={(up) =>
                persistSettings({
                  ...settings,
                  account: { ...settings.account, ...up },
                })
              }
            />
          )}

          {activeTab === "notifications" && (
            <NotificationPreferencesCard
              notifications={settings.notifications}
              onUpdate={(up) =>
                persistSettings({
                  ...settings,
                  notifications: { ...settings.notifications, ...up },
                })
              }
            />
          )}

          {activeTab === "career" && (
            <CareerPreferencesSettingsCard
              career={settings.career}
              onUpdate={(up) =>
                persistSettings({
                  ...settings,
                  career: { ...settings.career, ...up },
                })
              }
            />
          )}

          {activeTab === "privacy" && (
            <PrivacySettingsCard
              privacy={settings.privacy}
              onUpdate={(up) =>
                persistSettings({
                  ...settings,
                  privacy: { ...settings.privacy, ...up },
                })
              }
            />
          )}

          {activeTab === "connected" && (
            <ConnectedServicesCard
              services={settings.connectedServices}
              onToggleService={(id) => {
                const updated = settings.connectedServices.map((s) =>
                  s.id === id ? { ...s, connected: !s.connected } : s
                );
                persistSettings({ ...settings, connectedServices: updated });
              }}
              onSyncService={(id) => {
                const updated = settings.connectedServices.map((s) =>
                  s.id === id ? { ...s, lastSynced: "Just now" } : s
                );
                persistSettings({ ...settings, connectedServices: updated });
              }}
            />
          )}

          {activeTab === "language" && (
            <LanguageSettingsCard
              language={settings.language}
              onUpdate={(up) =>
                persistSettings({
                  ...settings,
                  language: { ...settings.language, ...up },
                })
              }
            />
          )}

          {activeTab === "security" && (
            <SecuritySettingsCard
              security={settings.security}
              onUpdate={(up) =>
                persistSettings({
                  ...settings,
                  security: { ...settings.security, ...up },
                })
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};
