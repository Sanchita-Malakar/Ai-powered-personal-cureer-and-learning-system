"use client";

import React, { useState } from "react";
import { AccountSettings } from "@/types/settings";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Shield,
  Download,
  AlertTriangle,
  Upload,
  Check,
} from "lucide-react";

interface AccountSettingsCardProps {
  account: AccountSettings;
  onUpdate: (updated: Partial<AccountSettings>) => void;
}

export const AccountSettingsCard: React.FC<AccountSettingsCardProps> = ({
  account,
  onUpdate,
}) => {
  const [name, setName] = useState(account.fullName);
  const [username, setUsername] = useState(account.username);
  const [email, setEmail] = useState(account.email);
  const [phone, setPhone] = useState(account.phone);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ fullName: name, username, email, phone });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1500);
  };

  const handleExportData = () => {
    const blob = new Blob([JSON.stringify(account, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `careeros-data-${account.username}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const initials = account.fullName
    ? account.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AR";

  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-border/80">
        <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center border border-accent/20">
          <User className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">Account Settings</h2>
          <p className="text-xs text-ink-muted">
            Manage your personal profile, credentials, and student tier.
          </p>
        </div>
      </div>

      {/* Avatar & Membership Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-canvas/70 border border-border/70">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/30 text-accent font-extrabold text-xl flex items-center justify-center shadow-xs">
            {initials}
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink">{account.fullName}</h3>
            <p className="text-xs text-ink-muted">@{account.username}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                <Shield className="w-3 h-3" />
                {account.tier}
              </span>
              <span className="text-[11px] text-ink-muted">
                Member since {account.memberSince}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => alert("Photo upload feature opened.")}
            className="px-3 py-1.5 rounded-xl bg-surface hover:bg-border/60 border border-border text-xs font-semibold text-ink flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-ink-muted" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
              Username Handle
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-xs">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-7 pr-3.5 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
              Academic Email Address
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-ink-muted flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-accent" />
            Verified Institution: <strong>{account.college}</strong>
          </span>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="pt-5 border-t border-red-500/20">
        <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 flex items-center gap-1.5 mb-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          Data Export & Account Management
        </h4>
        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-ink">
              Export Personal Career Data
            </p>
            <p className="text-[11px] text-ink-muted">
              Download your complete parsed resume, application history, and test records in JSON format.
            </p>
          </div>
          <button
            onClick={handleExportData}
            className="px-3 py-1.5 rounded-xl bg-surface border border-border hover:bg-border/60 text-xs font-semibold text-ink flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-ink-muted" />
            <span>Download Archive</span>
          </button>
        </div>
      </div>
    </div>
  );
};
