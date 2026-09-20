"use client";

import React, { useState } from "react";
import { LanguageSettings } from "@/types/settings";
import {
  Globe,
  Calendar,
  DollarSign,
  Clock,
  Check,
} from "lucide-react";

interface LanguageSettingsCardProps {
  language: LanguageSettings;
  onUpdate: (updated: Partial<LanguageSettings>) => void;
}

export const LanguageSettingsCard: React.FC<LanguageSettingsCardProps> = ({
  language,
  onUpdate,
}) => {
  const [selectedLang, setSelectedLang] = useState(language.language);
  const [selectedFormat, setSelectedFormat] = useState(language.dateFormat);
  const [selectedCurrency, setSelectedCurrency] = useState(language.currency);
  const [selectedTimezone, setSelectedTimezone] = useState(language.timezone);
  const [isSaved, setIsSaved] = useState(false);

  const languages = [
    { code: "English (US)", name: "English (United States)" },
    { code: "English (UK)", name: "English (United Kingdom)" },
    { code: "Hindi (हिन्दी)", name: "Hindi (हिन्दी)" },
    { code: "Spanish (Español)", name: "Spanish (Español)" },
    { code: "German (Deutsch)", name: "German (Deutsch)" },
  ];

  const dateFormats = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];

  const currencies = [
    { id: "INR (₹)", symbol: "₹", name: "Indian Rupee (LPA / INR)" },
    { id: "USD ($)", symbol: "$", name: "US Dollar (USD)" },
    { id: "EUR (€)", symbol: "€", name: "Euro (EUR)" },
    { id: "GBP (£)", symbol: "£", name: "British Pound (GBP)" },
  ];

  const timezones = [
    "Asia/Kolkata (IST - GMT+5:30)",
    "Asia/Singapore (SGT - GMT+8:00)",
    "America/New_York (EST - GMT-5:00)",
    "America/Los_Angeles (PST - GMT-8:00)",
    "Europe/London (BST - GMT+1:00)",
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      language: selectedLang,
      dateFormat: selectedFormat,
      currency: selectedCurrency,
      timezone: selectedTimezone,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1500);
  };

  return (
    <div className="rounded-3xl bg-surface border border-border/80 p-6 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-border/80">
        <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center border border-accent/20">
          <Globe className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">Language & Regional Preferences</h2>
          <p className="text-xs text-ink-muted">
            Configure display language, calendar date standards, currency, and local timezones.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Language Selection */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
              Interface Language
            </label>
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Format */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
              Date Representation Format
            </label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent font-mono"
              >
                {dateFormats.map((f) => (
                  <option key={f} value={f}>
                    {f} (e.g. 21/09/2026)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Currency Display */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
              Compensation Currency Format
            </label>
            <div className="relative">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
              >
                {currencies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Timezone */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
              System Timezone (Assessment Deadlines)
            </label>
            <div className="relative">
              <Clock className="w-3.5 h-3.5 text-accent absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-canvas border border-border text-xs text-ink focus:outline-none focus:border-accent"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-border/70 flex justify-end">
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
              <span>Save Regional Settings</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
