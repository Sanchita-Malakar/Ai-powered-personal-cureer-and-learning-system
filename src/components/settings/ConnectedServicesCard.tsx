"use client";

import React, { useState } from "react";
import { ConnectedService } from "@/types/settings";
import {
  Link2,
  Github,
  Code2,
  Linkedin,
  Calendar,
  Database,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Plus,
} from "lucide-react";

interface ConnectedServicesCardProps {
  services: ConnectedService[];
  onToggleService: (serviceId: string) => void;
  onSyncService: (serviceId: string) => void;
}

export const ConnectedServicesCard: React.FC<ConnectedServicesCardProps> = ({
  services,
  onToggleService,
  onSyncService,
}) => {
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      onSyncService(id);
      setSyncingId(null);
    }, 800);
  };

  const getServiceIcon = (type: ConnectedService["iconType"]) => {
    switch (type) {
      case "github":
        return <Github className="w-5 h-5 text-ink" />;
      case "leetcode":
        return <Code2 className="w-5 h-5 text-amber-500" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5 text-sky-500" />;
      case "google":
        return <Calendar className="w-5 h-5 text-red-500" />;
      case "supabase":
      default:
        return <Database className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-border/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center border border-accent/20">
            <Link2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink">Connected Services & Integrations</h2>
            <p className="text-xs text-ink-muted">
              Connect external developer tools, coding handles, and calendar services.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert("Integration marketplace modal opened.")}
          className="px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 transition-all flex items-center gap-1 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Integration</span>
        </button>
      </div>

      <div className="space-y-3.5">
        {services.map((srv) => {
          const isSyncing = syncingId === srv.id;

          return (
            <div
              key={srv.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                srv.connected
                  ? "bg-canvas/70 border-border/80 hover:border-accent/40"
                  : "bg-canvas/30 border-border/40 opacity-70"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-surface border border-border flex items-center justify-center shrink-0 shadow-xs">
                  {getServiceIcon(srv.iconType)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-ink">{srv.name}</h4>
                    <span className="text-[11px] font-mono text-accent">
                      {srv.handle}
                    </span>
                    {srv.connected && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {srv.details}
                  </p>
                  <span className="text-[10px] text-ink-muted block mt-1">
                    Last synchronized: <strong>{srv.lastSynced}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {srv.connected ? (
                  <>
                    <button
                      onClick={() => handleSync(srv.id)}
                      disabled={isSyncing}
                      className="px-3 py-1.5 rounded-xl bg-surface hover:bg-border/60 border border-border text-xs font-semibold text-ink flex items-center gap-1.5 transition-colors"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 text-accent ${
                          isSyncing ? "animate-spin" : ""
                        }`}
                      />
                      <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
                    </button>
                    <button
                      onClick={() => onToggleService(srv.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-transparent hover:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold transition-colors"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onToggleService(srv.id)}
                    className="px-4 py-1.5 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 transition-all shadow-xs"
                  >
                    Connect Service
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
