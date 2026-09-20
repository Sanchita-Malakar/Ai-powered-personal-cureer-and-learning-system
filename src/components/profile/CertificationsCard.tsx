"use client";

import React from "react";
import { CertificationItem } from "@/types/onboarding";
import {
  Award,
  ExternalLink,
  ShieldCheck,
  Plus,
  Edit3,
  Calendar,
} from "lucide-react";

interface CertificationsCardProps {
  certifications: CertificationItem[];
  onAddCertification: () => void;
  onEdit: () => void;
}

export const CertificationsCard: React.FC<CertificationsCardProps> = ({
  certifications,
  onAddCertification,
  onEdit,
}) => {
  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 shadow-xs hover:border-border transition-all">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center border border-amber-500/20">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">Certifications & Accreditations</h3>
            <p className="text-xs text-ink-muted">
              Industry-recognized credentials verified for recruiter search algorithms.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onAddCertification}
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Credential</span>
          </button>
          <span className="text-border">•</span>
          <button
            onClick={onEdit}
            className="text-xs font-semibold text-ink-muted hover:text-ink flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Manage</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="p-4 rounded-2xl bg-canvas/70 border border-border/70 flex flex-col justify-between gap-3 hover:border-amber-500/40 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-bold text-ink leading-snug">
                  {cert.title}
                </h4>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                {cert.issuer}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-ink-muted">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-ink-muted" />
                Issued: {cert.issueYear}
              </span>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                >
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}

        {certifications.length === 0 && (
          <div className="col-span-2 p-6 text-center rounded-2xl border border-dashed border-border/80">
            <Award className="w-7 h-7 text-ink-muted mx-auto mb-1.5 opacity-50" />
            <p className="text-xs font-semibold text-ink">No certifications recorded yet</p>
            <button
              onClick={onAddCertification}
              className="mt-2 text-xs font-bold text-accent hover:underline"
            >
              + Add cloud or developer certificate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
