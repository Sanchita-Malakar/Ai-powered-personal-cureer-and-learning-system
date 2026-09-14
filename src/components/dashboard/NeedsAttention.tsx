"use client";

import React from "react";
import Link from "next/link";
import { NeedsAttentionAlert } from "@/types/dashboard";
import { AlertTriangle, ArrowUpRight } from "lucide-react";
import { TiltCard } from "./TiltCard";

interface NeedsAttentionProps {
  alerts: NeedsAttentionAlert[];
  onDismiss?: (id: string) => void;
}

export const NeedsAttention: React.FC<NeedsAttentionProps> = ({ alerts }) => {
  const displayedAlerts = alerts.slice(0, 4);

  return (
    <TiltCard glow="attention" className="h-full">
      <div className="card-attention flex flex-col justify-between h-full group/card transition-all duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <h3 className="h3-scale text-ink">Needs attention</h3>
              {displayedAlerts.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-attention/20 text-attention text-[11px] font-bold shadow-sm shadow-attention/20">
                  {displayedAlerts.length}
                </span>
              )}
            </div>
            <span className="caption text-ink-muted font-medium">Requires action</span>
          </div>

          {/* Content: items or empty state */}
          {displayedAlerts.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-[13px] text-ink-muted">
                Nothing needs attention right now.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {displayedAlerts.map((alert) => (
                <Link
                  key={alert.id}
                  href={alert.targetPage}
                  className="group flex items-center justify-between gap-2.5 p-2.5 rounded-lg bg-surface/80 hover:bg-surface border border-attention/30 hover:border-attention hover:shadow-md hover:shadow-attention/10 hover:-translate-y-0.5 transition-all duration-200 text-ink focus-visible:outline-accent"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="p-1 rounded-md bg-attention/10 flex-shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5 text-attention" />
                    </div>
                    <span className="text-[13px] text-ink font-medium truncate group-hover:underline">
                      {alert.text}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-attention opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-attention/20 flex items-center justify-between">
          <span className="caption text-ink-muted">
            Updated nightly via rules engine
          </span>
          <span className="text-[11px] font-semibold text-attention">
            Priority queues
          </span>
        </div>
      </div>
    </TiltCard>
  );
};
