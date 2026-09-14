"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, HelpCircle, Menu, X, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { supabase } from "@/supabaseClient";

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const router = useRouter();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    setProfileMenuOpen(false);
    await supabase.auth.signOut();
    router.replace("/signin");
  };

  const displayName = currentUser?.user_metadata?.full_name || "Alex Rivera";
  const displayEmail = currentUser?.email || "alex.rivera@university.edu";
  const displayPhone = currentUser?.user_metadata?.phone || "+1 (555) 234-5678";
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
            className="md:hidden p-2 text-ink-muted hover:text-ink rounded-lg hover:bg-canvas transition-colors active:scale-95 focus-visible:outline-accent"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Link
          href="/"
          className="flex items-center gap-2.5 group text-ink focus-visible:outline-accent"
        >
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xs tracking-tight shadow-md shadow-accent/25 transition-transform duration-200 group-hover:scale-105 group-hover:rotate-3">
            C
          </div>
          <span className="font-bold text-[16px] tracking-tight text-ink">
            CareerOS
          </span>
        </Link>
      </div>

      {/* Global Search (Desktop & Tablet) */}
      <div className="flex-1 max-w-md mx-3 sm:mx-6 hidden sm:block">
        <div className="relative group">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-accent" />
          <input
            type="text"
            placeholder="Search roles, skills, roadmap milestones..."
            className="w-full bg-canvas/80 border border-border/80 text-ink placeholder:text-ink-muted text-[13px] rounded-lg pl-9 pr-3 py-1.5 focus:outline-none focus:border-accent focus:bg-surface focus:shadow-sm focus:shadow-accent/10 transition-all"
          />
        </div>
      </div>

      {/* Mobile Search Input Overlay */}
      {mobileSearchOpen && (
        <div className="absolute inset-0 bg-surface px-3 flex items-center gap-2 sm:hidden z-50">
          <Search className="w-4 h-4 text-ink-muted" />
          <input
            type="text"
            autoFocus
            placeholder="Search roles, skills, roadmap..."
            className="flex-1 bg-transparent text-[13px] text-ink outline-none"
          />
          <button
            onClick={() => setMobileSearchOpen(false)}
            className="p-1.5 text-ink-muted hover:text-ink"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Actions & Avatar */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Mobile search icon button */}
        <button
          onClick={() => setMobileSearchOpen(true)}
          className="sm:hidden p-2 text-ink-muted hover:text-ink rounded-lg hover:bg-canvas transition-colors active:scale-95"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 text-ink-muted hover:text-ink rounded-lg hover:bg-canvas transition-all duration-150 active:scale-95 focus-visible:outline-accent"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-attention ring-2 ring-surface shadow-sm animate-pulse" />
        </button>

        {/* Help */}
        <button
          className="p-2 text-ink-muted hover:text-ink rounded-lg hover:bg-canvas transition-all duration-150 active:scale-95 focus-visible:outline-accent hidden xs:flex"
          aria-label="Help and resources"
          title="Help & documentation"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        <div className="h-4 w-[1px] bg-border/80 dark:bg-zinc-800 mx-0.5 sm:mx-1" />

        {/* Sign In & Sign Up Quick Navigation */}
        <Link
          href="/signin"
          className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-[13px] font-semibold text-ink hover:text-accent hover:bg-canvas transition-colors focus-visible:outline-accent"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="hidden md:inline-flex items-center px-3 py-1.5 rounded-lg bg-accent text-white text-[12px] font-semibold hover:bg-accent/90 shadow-sm shadow-accent/25 transition-all focus-visible:outline-accent"
        >
          Sign up
        </Link>

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
              <span className="text-[10px] text-ink-muted leading-tight font-medium">
                Student • CS 2026
              </span>
            </div>
          </button>

          {/* Profile Menu Dropdown */}
          {profileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileMenuOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 mt-2 w-64 bg-surface/95 dark:bg-zinc-900/95 backdrop-blur-md border border-border dark:border-zinc-800 rounded-xl p-3 shadow-xl shadow-black/10 dark:shadow-black/40 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="pb-3 border-b border-border/80 dark:border-zinc-800 mb-2">
                  <p className="text-[14px] font-bold text-ink leading-tight truncate">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-ink-muted leading-tight mt-0.5 truncate">
                    {displayEmail}
                  </p>
                  <p className="text-[11px] text-ink-muted leading-tight mt-0.5">
                    {displayPhone}
                  </p>
                </div>

                <div className="space-y-1 text-[13px]">
                  <Link
                    href="/signin"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center justify-between px-2.5 py-2 rounded-lg text-ink hover:bg-canvas hover:text-accent font-medium transition-colors"
                  >
                    <span>Sign in / Switch account</span>
                    <span className="text-[11px] text-ink-muted">→</span>
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center justify-between px-2.5 py-2 rounded-lg text-ink hover:bg-canvas hover:text-accent font-medium transition-colors"
                  >
                    <span>Create new account</span>
                    <span className="text-[10px] uppercase font-bold text-accent px-1.5 py-0.5 rounded bg-accent/10">
                      New
                    </span>
                  </Link>

                  <div className="pt-1 mt-1 border-t border-border/80 dark:border-zinc-800">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium transition-colors cursor-pointer text-left"
                    >
                      <span>Sign out</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
