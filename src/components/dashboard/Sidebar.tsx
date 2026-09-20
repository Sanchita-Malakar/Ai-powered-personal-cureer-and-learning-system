"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Route,
  Briefcase,
  FileText,
  MessageSquareCode,
  Code2,
  BookOpen,
  Sparkles,
  TrendingUp,
  User,
  Settings,
  X,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  category: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isAi?: boolean;
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    category: "Overview",
    description: "Readiness score & action items",
    href: "#dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "roadmap",
    label: "Career Roadmap",
    category: "Strategy",
    description: "Milestones & target competencies",
    href: "#roadmap",
    icon: Route,
  },
  {
    id: "jobs",
    label: "Job Tracker",
    category: "Pipeline",
    description: "16 applications across stages",
    href: "#jobs",
    icon: Briefcase,
  },
  {
    id: "resume",
    label: "Resume Analyzer",
    category: "Tool",
    description: "ATS benchmark & keyword match",
    href: "#resume",
    icon: FileText,
  },
  {
    id: "interview",
    label: "Interview Trainer",
    category: "Practice",
    description: "Technical & behavioral mock rounds",
    href: "#interview",
    icon: MessageSquareCode,
  },
  {
    id: "dsa",
    label: "DSA & Skill Trainer",
    category: "Drills",
    description: "Problem sets, coding workspace & evaluations",
    href: "#dsa",
    icon: Code2,
  },
  {
    id: "learning",
    label: "Learning",
    category: "Curriculum",
    description: "Recommended curriculum, interactive lessons & quizzes",
    href: "#learning",
    icon: BookOpen,
  },
  {
    id: "mentor",
    label: "AI Career Assistant",
    category: "AI Co-pilot",
    description: "Interactive AI mentor grounded in your profile",
    href: "#mentor",
    icon: Sparkles,
    isAi: true,
  },
  {
    id: "progress",
    label: "Progress",
    category: "Metrics",
    description: "Long-term performance center & AI trend analysis",
    href: "#progress",
    icon: TrendingUp,
  },
  {
    id: "profile",
    label: "Student Profile",
    category: "Profile",
    description: "Complete career profile & AI feeder",
    href: "#profile",
    icon: User,
  },
  {
    id: "settings",
    label: "Settings",
    category: "System",
    description: "Preferences, targets & alerts",
    href: "#settings",
    icon: Settings,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  onCloseMobile,
  activeSection,
  onSelectSection,
}) => {
  const pathname = usePathname();
  const [internalActiveId, setInternalActiveId] = useState<string>(() => {
    if (activeSection) return activeSection;
    if (pathname?.startsWith("/onboarding")) return "profile";
    return "dashboard";
  });

  const effectiveActiveId = activeSection || internalActiveId;

  useEffect(() => {
    if (activeSection) {
      setInternalActiveId(activeSection);
    } else if (pathname?.startsWith("/onboarding")) {
      setInternalActiveId("profile");
    } else if (pathname === "/") {
      setInternalActiveId("dashboard");
    }
  }, [pathname, activeSection]);

  const [hoveredItem, setHoveredItem] = useState<{
    item: NavItem;
    top: number;
  } | null>(null);

  const navRef = useRef<HTMLElement>(null);

  const handleMouseEnter = (item: NavItem, event: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredItem({
      item,
      top: rect.top + rect.height / 2,
    });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <>
      {/* Desktop Fixed Sidebar Rail (64px wide) */}
      <aside
        className="hidden md:flex fixed left-0 top-14 bottom-0 w-16 bg-surface/90 backdrop-blur-md border-r border-border z-30 flex-col items-center py-3 overflow-visible transition-colors duration-200"
        aria-label="Main navigation"
      >
        <nav ref={navRef} className="flex flex-col items-center gap-1.5 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = effectiveActiveId === item.id;

            return (
              <div key={item.id} className="relative w-full flex justify-center">
                <Link
                  href={item.href}
                  onClick={(e) => {
                    setInternalActiveId(item.id);
                    if (onSelectSection) {
                      if (
                        item.id === "roadmap" ||
                        item.id === "dashboard" ||
                        item.id === "jobs" ||
                        item.id === "resume" ||
                        item.id === "interview" ||
                        item.id === "dsa" ||
                        item.id === "learning" ||
                        item.id === "mentor" ||
                        item.id === "progress" ||
                        item.id === "profile" ||
                        item.id === "settings"
                      ) {
                        e.preventDefault();
                        onSelectSection(item.id);
                      }
                    }
                  }}
                  onMouseEnter={(e) => handleMouseEnter(item, e)}
                  onMouseLeave={handleMouseLeave}
                  className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 transform-gpu active:scale-95 focus-visible:outline-accent ${
                    isActive
                      ? "bg-accent text-white shadow-md shadow-accent/25 scale-105"
                      : item.isAi
                      ? "text-ai hover:bg-ai/10 hover:scale-110 hover:shadow-sm"
                      : "text-ink-muted hover:text-ink hover:bg-canvas hover:scale-110 hover:shadow-sm"
                  }`}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${item.isAi && !isActive ? "hover:rotate-12" : ""}`} />

                  {/* Active 3D Indicator Bar */}
                  {isActive && (
                    <span className="absolute -left-2 top-2 bottom-2 w-[3px] bg-accent rounded-r-full shadow-glow-accent" />
                  )}
                </Link>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Floating 3D Tooltip Preview (Rendered outside overflow clipping container) */}
      {hoveredItem && (
        <div
          role="tooltip"
          style={{ top: hoveredItem.top }}
          className="pointer-events-none fixed left-[72px] -translate-y-1/2 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="relative flex items-center">
            {/* Arrow pointing to icon */}
            <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[8px] border-r-border/80 dark:border-r-zinc-700" />
            <div className="-ml-[7px] w-0 h-0 border-y-[5px] border-y-transparent border-r-[7px] border-r-surface dark:border-r-zinc-900 z-10" />

            {/* Tooltip Content Card with 3D glassmorphism & shadow */}
            <div className="bg-surface/95 dark:bg-zinc-900/95 backdrop-blur-md border border-border dark:border-zinc-700/80 rounded-lg px-3.5 py-2.5 shadow-xl shadow-black/10 dark:shadow-black/40 min-w-[200px] max-w-[260px] text-left transform-gpu">
              {/* Header: Field title and category badge */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[13px] font-semibold text-ink dark:text-zinc-100 leading-none">
                  {hoveredItem.item.label}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full ${
                    hoveredItem.item.isAi
                      ? "bg-ai/15 text-ai dark:bg-ai/25"
                      : "bg-accent/10 text-accent dark:bg-accent/20"
                  }`}
                >
                  {hoveredItem.item.category}
                </span>
              </div>

              {/* Description */}
              <p className="text-[11px] text-ink-muted dark:text-zinc-400 leading-snug">
                {hoveredItem.item.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Responsive Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-ink/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Sidebar */}
          <aside className="relative w-72 max-w-[85vw] bg-surface dark:bg-zinc-900 h-full border-r border-border dark:border-zinc-800 p-5 flex flex-col z-50 shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border dark:border-zinc-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white text-xs font-bold shadow-md shadow-accent/30">
                  C
                </div>
                <div>
                  <span className="font-bold text-[16px] text-ink dark:text-zinc-100 tracking-tight block leading-tight">
                    CareerOS
                  </span>
                  <span className="text-[11px] text-ink-muted leading-none">
                    Alex Rivera • Junior track
                  </span>
                </div>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-1.5 text-ink-muted hover:text-ink rounded-md hover:bg-canvas transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation List */}
            <nav className="flex flex-col gap-1 overflow-y-auto flex-1 pr-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = effectiveActiveId === item.id;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      setInternalActiveId(item.id);
                      if (onCloseMobile) onCloseMobile();
                      if (onSelectSection) {
                        if (
                          item.id === "roadmap" ||
                          item.id === "dashboard" ||
                          item.id === "jobs" ||
                          item.id === "resume" ||
                          item.id === "interview" ||
                          item.id === "dsa" ||
                          item.id === "learning" ||
                          item.id === "mentor" ||
                          item.id === "progress" ||
                          item.id === "profile" ||
                          item.id === "settings"
                        ) {
                          e.preventDefault();
                          onSelectSection(item.id);
                        }
                      }
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] transition-all duration-150 ${
                      isActive
                        ? "bg-accent text-white font-semibold shadow-sm"
                        : item.isAi
                        ? "text-ai hover:bg-ai/10 font-medium"
                        : "text-ink-muted hover:text-ink hover:bg-canvas font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="block truncate leading-tight">{item.label}</span>
                        <span
                          className={`text-[10px] block truncate leading-tight mt-0.5 ${
                            isActive
                              ? "text-white/80"
                              : "text-ink-muted/80 dark:text-zinc-500"
                          }`}
                        >
                          {item.description}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 opacity-60 flex-shrink-0 ${isActive ? "text-white" : ""}`} />
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
};
