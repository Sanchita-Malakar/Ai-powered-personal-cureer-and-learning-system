"use client";

import React from "react";
import { NotificationPreferences } from "@/types/settings";
import {
  Bell,
  CheckCircle2,
  Calendar,
  Flame,
  Sparkles,
  Briefcase,
  Mail,
} from "lucide-react";

interface NotificationPreferencesCardProps {
  notifications: NotificationPreferences;
  onUpdate: (updated: Partial<NotificationPreferences>) => void;
}

export const NotificationPreferencesCard: React.FC<NotificationPreferencesCardProps> = ({
  notifications,
  onUpdate,
}) => {
  const toggleSetting = (key: keyof NotificationPreferences) => {
    onUpdate({ [key]: !notifications[key] });
  };

  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-border/80">
        <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center border border-accent/20">
          <Bell className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">Notification Preferences</h2>
          <p className="text-xs text-ink-muted">
            Configure alert channels, email frequencies, and automated preparation reminders.
          </p>
        </div>
      </div>

      {/* Main Alert Toggles */}
      <div className="space-y-3">
        {/* 1. Application Updates */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/70 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink">
                Application & Interview Status Updates
              </h4>
              <p className="text-xs text-ink-muted">
                Receive instant alerts when companies change your application status to OA, Interview, or Shortlist.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={notifications.applicationUpdates}
              onChange={() => toggleSetting("applicationUpdates")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>

        {/* 2. Deadlines */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/70 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink">
                Upcoming Deadlines & OA Cutoffs
              </h4>
              <p className="text-xs text-ink-muted">
                Get high-priority alerts 48 hours and 12 hours before application deadlines and coding assessments expire.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={notifications.interviewDeadlines}
              onChange={() => toggleSetting("interviewDeadlines")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>

        {/* 3. Daily Streaks */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/70 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mt-0.5">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink">
                Daily Learning & DSA Streak Reminders
              </h4>
              <p className="text-xs text-ink-muted">
                Daily evening nudge if today&apos;s coding drills or learning modules remain uncompleted.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={notifications.dailyStreakAlerts}
              onChange={() => toggleSetting("dailyStreakAlerts")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>

        {/* 4. AI Mentor Insights */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/70 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink">
                AI Mentor Strategy & Recommendation Digests
              </h4>
              <p className="text-xs text-ink-muted">
                Weekly AI trend reports analyzing your performance growth, DSA bottlenecks, and resume improvements.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={notifications.aiMentorInsights}
              onChange={() => toggleSetting("aiMentorInsights")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>

        {/* 5. Job Match Alerts */}
        <div className="p-4 rounded-2xl bg-canvas/70 border border-border/70 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center mt-0.5">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink">
                High-Match Job Notifications
              </h4>
              <p className="text-xs text-ink-muted">
                Alert me immediately when a new opening matches my verified skills with ≥85% compatibility.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={notifications.jobMatchAlerts}
              onChange={() => toggleSetting("jobMatchAlerts")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>
      </div>

      {/* Email Digest Frequency */}
      <div className="pt-4 border-t border-border/80">
        <span className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5 mb-3">
          <Mail className="w-3.5 h-3.5 text-accent" />
          Email Delivery Frequency
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "instant", label: "Instant Alerts", desc: "Real-time as events occur" },
            { id: "daily_digest", label: "Daily Digest", desc: "Consolidated evening digest (8 PM)" },
            { id: "weekly_summary", label: "Weekly Summary", desc: "Monday morning career brief" },
          ].map((item) => (
            <label
              key={item.id}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                notifications.emailFrequency === item.id
                  ? "bg-accent/10 border-accent text-ink shadow-xs"
                  : "bg-canvas/70 border-border/70 hover:border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-ink">{item.label}</span>
                <input
                  type="radio"
                  name="emailFrequency"
                  checked={notifications.emailFrequency === item.id}
                  onChange={() => onUpdate({ emailFrequency: item.id as any })}
                  className="accent-accent"
                />
              </div>
              <span className="text-[11px] text-ink-muted">{item.desc}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
