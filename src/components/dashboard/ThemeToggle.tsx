"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-ink-muted hover:text-ink rounded-sm transition-colors focus-visible:outline-accent relative group"
      aria-label={
        !mounted
          ? "Toggle theme"
          : theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={
        !mounted
          ? "Toggle theme"
          : theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
    >
      {mounted && theme === "dark" ? (
        <Sun className="w-4 h-4 text-attention transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
};
