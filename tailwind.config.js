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
        cream: "#faf8f4",
        "card-bg": "#f4f1eb",
        "border-warm": "#e5e0d5",
        "earth-dark": "#2d2d26",
        "earth-mid": "#5a5a4f",
        "earth-muted": "#8b8670",
        "green-primary": "#4a6741",
        "green-light": "#6b8f5e",
      },
      fontFamily: {
        serif: ["DM Serif Display", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
