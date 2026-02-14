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
        bg: "#FAFAF8",
        "bg-raised": "#F5F4F0",
        "bg-hover": "#EEEDEA",
        "bg-active": "#E6E5E1",
        border: "#E0DFDB",
        "border-strong": "#C8C7C2",
        "text-primary": "#1A1A18",
        "text-secondary": "#6B6B65",
        "text-tertiary": "#9C9C95",
        accent: "#2D6A4F",
        "accent-hover": "#3D8B68",
        "accent-subtle": "rgba(45, 106, 79, 0.05)",
        signal: {
          pay: "#B45309",
          "pay-bg": "#FFFBEB",
          up: "#2D6A4F",
          "up-bg": "#F0FDF4",
          alt: "#6B21A8",
          "alt-bg": "#FAF5FF",
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
