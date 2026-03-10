/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B1120",
        "bg-raised": "#111827",
        "bg-hover": "#1A2332",
        "bg-active": "#1E293B",
        "bg-card": "#0F1A2E",
        border: "#1E293B",
        "border-strong": "#334155",
        "text-primary": "#F1F5F9",
        "text-secondary": "#94A3B8",
        "text-tertiary": "#64748B",
        accent: "#14B8A6",
        "accent-hover": "#0D9488",
        "accent-subtle": "rgba(20, 184, 166, 0.1)",
        "accent-dark": "#0F766E",
        signal: {
          pay: "#F59E0B",
          "pay-bg": "rgba(245, 158, 11, 0.1)",
          up: "#14B8A6",
          "up-bg": "rgba(20, 184, 166, 0.1)",
          alt: "#A78BFA",
          "alt-bg": "rgba(167, 139, 250, 0.1)",
        },
        stage: {
          idea: "#6B7280",
          prototype: "#D97706",
          live: "#059669",
          mature: "#7C3AED",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        serif: ["DM Serif Display", "serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
