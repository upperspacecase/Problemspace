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
        bg: "#020617",
        "bg-raised": "#0F172A",
        "bg-hover": "#1E293B",
        "bg-active": "#334155",
        "bg-card": "#0F172A",
        border: "#1E293B",
        "border-strong": "#334155",
        "text-primary": "#F1F5F9",
        "text-secondary": "#94A3B8",
        "text-tertiary": "#64748B",
        accent: "#818CF8",
        "accent-hover": "#6366F1",
        "accent-subtle": "rgba(129, 140, 248, 0.1)",
        "accent-dark": "#4F46E5",
        signal: {
          pay: "#F59E0B",
          "pay-bg": "rgba(245, 158, 11, 0.1)",
          up: "#818CF8",
          "up-bg": "rgba(129, 140, 248, 0.1)",
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
        heading: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
      },
      keyframes: {
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
      },
    },
  },
  plugins: [],
};
