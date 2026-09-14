import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        border: "var(--border)",
        accent: {
          DEFAULT: "var(--accent)",
          10: "color-mix(in srgb, var(--accent) 10%, transparent)",
        },
        attention: {
          DEFAULT: "var(--attention)",
          10: "color-mix(in srgb, var(--attention) 10%, transparent)",
        },
        action: {
          DEFAULT: "var(--action)",
          10: "color-mix(in srgb, var(--action) 10%, transparent)",
        },
        ai: {
          DEFAULT: "var(--ai)",
          10: "color-mix(in srgb, var(--ai) 10%, transparent)",
        },
      },
      fontFamily: {
        ui: ["var(--font-ui)", "system-ui", "sans-serif"],
        ai: ["var(--font-ai)", "Georgia", "serif"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        lg: "var(--radius-lg)",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        "card-3d": "0 16px 32px -8px rgba(0, 0, 0, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 24px 48px -12px rgba(0, 0, 0, 0.16), 0 8px 16px -4px rgba(0, 0, 0, 0.08)",
        "glow-accent": "0 0 20px -2px color-mix(in srgb, var(--accent) 35%, transparent)",
        "glow-ai": "0 0 24px -2px color-mix(in srgb, var(--ai) 40%, transparent)",
        "glow-attention": "0 0 20px -2px color-mix(in srgb, var(--attention) 35%, transparent)",
        "glow-yellow": "0 20px 45px -8px rgba(217, 119, 6, 0.38), 0 0 28px -2px rgba(245, 158, 11, 0.45)",
        "glow-yellow-lg": "0 25px 55px -10px rgba(217, 119, 6, 0.45), 0 0 35px -2px rgba(245, 158, 11, 0.55)",
        none: "none",
      },
    },
  },
  plugins: [],
};
export default config;
