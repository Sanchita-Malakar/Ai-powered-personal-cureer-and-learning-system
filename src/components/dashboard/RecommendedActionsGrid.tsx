"use client";

import React from "react";
import { RecommendedActionItem, ModuleType } from "@/types/dashboard";
import {
  Code2,
  FileCheck2,
  Briefcase,
  GraduationCap,
  MessageSquareCode,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface RecommendedActionsGridProps {
  actions: RecommendedActionItem[];
  onOpenModule: (module: ModuleType) => void;
}

const ACTION_ICONS = {
  dsa: Code2,
  resume: FileCheck2,
  jobs: Briefcase,
  learning: GraduationCap,
  interview: MessageSquareCode,
};

export const RecommendedActionsGrid: React.FC<RecommendedActionsGridProps> = ({
  actions,
  onOpenModule,
}) => {
  return (
    <section className="mb-6 animate-in fade-in duration-300" aria-label="Recommended Actions">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Tool Modules</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-ink">
            Recommended Actions
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Click any card to launch its interactive preparation module.
          </p>
        </div>
      </div>

      {/* 5 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {actions.map((action) => {
          const Icon = ACTION_ICONS[action.iconName] || Sparkles;

          return (
            <div
              key={action.id}
              onClick={() => onOpenModule(action.moduleTarget)}
              className="p-4 sm:p-5 rounded-2xl bg-surface border border-border/80 hover:border-accent/60 shadow-xs hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top ambient hover highlight */}
              <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 group-hover:bg-accent group-hover:text-white text-accent flex items-center justify-center font-bold transition-all duration-200 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>

                  {action.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-canvas border border-border text-ink-muted group-hover:border-accent/30 group-hover:text-accent transition-colors">
                      {action.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-ink group-hover:text-accent transition-colors">
                  {action.title}
                </h3>

                <p className="text-xs text-ink-muted mt-1 leading-relaxed line-clamp-2">
                  {action.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-accent">
                <span>Launch Module</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
