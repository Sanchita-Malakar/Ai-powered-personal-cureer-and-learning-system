"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, HelpCircle, Menu, X, User, Settings, LogIn, LogOut, UserPlus } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [onboardedProfile, setOnboardedProfile] = useState<any>(null);

  const { user, signOut, isAuthenticated } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("career_os_student_profile");
      if (raw) {
        try {
          setOnboardedProfile(JSON.parse(raw));
        } catch (e) {}
      }
    }
  }, [user]);

  const displayName =
    user?.fullName || onboardedProfile?.personalInfo?.fullName || "Alex Rivera";
  const displayEmail =
    user?.email || onboardedProfile?.personalInfo?.email || "student@university.edu";
  const displayPhone =
    onboardedProfile?.personalInfo?.phone || "";
  const displaySubtitle =
    user?.targetRole ||
    (onboardedProfile?.careerPreferences?.primaryRole
      ? `${onboardedProfile.careerPreferences.primaryRole}`
      : "CareerOS Student");

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AR";

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-surface/85 backdrop-blur-md border-b border-border/80 dark:border-zinc-800 z-40 flex items-center justify-between px-3 sm:px-5 lg:px-6 transition-colors duration-200">
      {/* Brand & Mobile Toggle */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 -ml-1 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas transition-colors focus-visible:outline-accent"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link
          href="/"
          className="flex items-center gap-2 text-ink group focus-visible:outline-accent rounded-lg"
        >
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-accent/25 transition-transform duration-200 group-hover:scale-105">
            C
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-sm sm:text-base tracking-tight">CareerOS</span>
            <span className="hidden xs:inline-block text-[10px] font-semibold text-accent uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20">
              Student Edition
            </span>
          </div>
        </Link>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="global-search-input"
            type="search"
            placeholder="Search skills, roadmap milestones, jobs, questions... (Press '/' to focus)"
            className="w-full bg-canvas/70 hover:bg-canvas focus:bg-surface border border-border/80 focus:border-accent text-ink placeholder:text-ink-muted/70 text-[12px] rounded-lg pl-8 pr-8 py-1.5 transition-all duration-150 outline-none shadow-none focus:shadow-sm"
          />
          <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-ink-muted/80 bg-surface border border-border rounded shadow-2xs pointer-events-none">
            /
          </kbd>
        </div>
      </div>

      {/* Right Controls: Actions & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setMobileSearchOpen((prev) => !prev)}
          className="md:hidden p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas transition-colors focus-visible:outline-accent"
          aria-label="Open search"
        >
          {mobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button
          id="navbar-notifications-btn"
          className="relative p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas transition-colors focus-visible:outline-accent"
          aria-label="Notifications (2 unread)"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-attention ring-2 ring-surface animate-pulse" />
        </button>

        {/* Help & Support */}
        <button
          id="navbar-help-btn"
          className="hidden sm:flex p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas transition-colors focus-visible:outline-accent"
          aria-label="Help & Documentation"
          title="Help & documentation"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        <div className="h-4 w-[1px] bg-border/80 dark:bg-zinc-800 mx-0.5 sm:mx-1" />

        {!isAuthenticated && (
          <Link
            href="/signin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold shadow-sm shadow-accent/20 hover:bg-accent/90 active:scale-95 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        )}

        {/* User profile dropdown button */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg hover:bg-canvas/80 border border-transparent hover:border-border/60 transition-all duration-150 active:scale-98 focus-visible:outline-accent group cursor-pointer"
            aria-label="Open student profile menu"
            aria-expanded={profileMenuOpen}
          >
            <div className="w-7 h-7 rounded-lg bg-accent/15 text-accent font-bold text-xs flex items-center justify-center border border-accent/30 shadow-sm shadow-accent/15 transition-transform duration-200 group-hover:scale-105">
              {initials}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-[13px] font-semibold text-ink leading-tight truncate max-w-[120px]">
                {displayName}
              </span>
              <span className="text-[10px] text-ink-muted leading-tight font-medium truncate max-w-[140px]">
                {displaySubtitle}
              </span>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {profileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-surface border border-border/80 rounded-xl shadow-xl z-50 py-2 text-xs animate-in fade-in zoom-in-95 duration-100 dark:border-zinc-800">
                {/* Header in dropdown */}
                <div className="px-3 py-2 border-b border-border/80 dark:border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-accent text-white font-bold text-xs flex items-center justify-center shadow-sm shadow-accent/20">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink text-[13px] truncate">{displayName}</p>
                      <p className="text-[11px] text-ink-muted truncate">{displayEmail}</p>
                    </div>
                  </div>
                  {displayPhone && (
                    <p className="text-[10px] text-ink-muted/80 mt-1 font-mono">{displayPhone}</p>
                  )}
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-accent/10 text-accent font-semibold text-[10px]">
                    <span>🎯</span>
                    <span className="truncate">{displaySubtitle}</span>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-1 space-y-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center justify-between px-2.5 py-2 rounded-lg text-ink hover:bg-canvas font-medium transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-accent" />
                      <span>Profile & Academics</span>
                    </div>
                    <span className="text-[11px] text-ink-muted">→</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center justify-between px-2.5 py-2 rounded-lg text-ink hover:bg-canvas font-medium transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5 text-accent" />
                      <span>Settings & Preferences</span>
                    </div>
                    <span className="text-[11px] text-ink-muted">→</span>
                  </Link>

                  <Link
                    href="/onboarding?edit=true"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center justify-between px-2.5 py-2 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas font-medium transition-colors"
                  >
                    <span>Onboarding Wizard</span>
                    <span className="text-[10px] text-ink-muted">Edit →</span>
                  </Link>

                  <div className="my-1 border-t border-border/80 dark:border-zinc-800" />

                  <Link
                    href="/signin"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center justify-between px-2.5 py-2 rounded-lg text-ink hover:bg-canvas font-medium transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <LogIn className="w-3.5 h-3.5 text-accent" />
                      <span>Sign In / Switch Account</span>
                    </div>
                    <span className="text-[10px] text-ink-muted">Login →</span>
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center justify-between px-2.5 py-2 rounded-lg text-ink hover:bg-canvas font-medium transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Create Account</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">New</span>
                  </Link>

                  {user && (
                    <button
                      type="button"
                      onClick={async () => {
                        setProfileMenuOpen(false);
                        await signOut();
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-action hover:bg-action/10 font-medium transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
