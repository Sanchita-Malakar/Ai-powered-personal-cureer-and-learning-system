"use client";

import React from "react";
import { UpcomingItem, ModuleType } from "@/types/dashboard";
import {
  CalendarClock,
  Video,
  Clock,
  Briefcase,
  Flag,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface UpcomingCardProps {
  items: UpcomingItem[];
  onOpenModule: (module: ModuleType) => void;
}

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Interview: Video,
  "Application deadline": Briefcase,
  "Learning milestone": Flag,
  "Scheduled practice": Clock,
};

export const UpcomingCard: React.FC<UpcomingCardProps> = ({ items, onOpenModule }) => {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-border/80 shadow-xs hover:border-border transition-all flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1 mb-1">
              <CalendarClock className="w-3.5 h-3.5" />
              <span>Schedule & Deadlines</span>
            </span>
            <h3 className="text-xl font-bold text-ink">Upcoming</h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Crucial interview dates, application cutoffs, and scheduled practice drills.
            </p>
          </div>

          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
            {items.length} Events
          </span>
        </div>

        {/* List of upcoming items */}
        <div className="space-y-2.5">
          {items.map((item) => {
            const Icon = TYPE_ICONS[item.type] || Clock;
            const isHighUrgency = item.urgency === "high";

            return (
              <div
                key={item.id}
                onClick={() => onOpenModule(item.moduleTarget)}
                className="p-3 rounded-2xl bg-canvas/60 border border-border/80 hover:border-border transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isHighUrgency
                        ? "bg-action/10 text-action border border-action/20"
                        : "bg-accent/10 text-accent border border-accent/20"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase text-ink-muted">
                        {item.type}
                      </span>
                      {item.timeRemaining && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                            isHighUrgency
                              ? "bg-action/10 text-action"
                              : "bg-accent/10 text-accent"
                          }`}
                        >
                          {item.timeRemaining}
                        </span>
                      )}
                    </div>

                    <h4 className="font-semibold text-xs sm:text-sm text-ink truncate group-hover:text-accent transition-colors mt-0.5">
                      {item.title}
                    </h4>

                    <span className="text-[11px] text-ink-muted block mt-0.5">
                      {item.dateText}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModule(item.moduleTarget);
                  }}
                  className="p-1.5 rounded-lg text-xs font-semibold text-accent hover:bg-surface group-hover:translate-x-0.5 transition-all shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer link to Calendar */}
      <div className="mt-5 pt-3 border-t border-border/70 flex items-center justify-between text-xs">
        <span className="text-ink-muted">Sync with Google Calendar</span>
        <button
          type="button"
          onClick={() => onOpenModule("interview")}
          className="text-accent font-bold hover:underline inline-flex items-center gap-1"
        >
          <span>Schedule Practice</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
