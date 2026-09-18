/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F4EFFC",
          100: "#E7DBF8",
          200: "#D3BCF2",
          300: "#B894E8",
          400: "#9A6BD8",
          500: "#7C50C0",
          600: "#7047A8",
          700: "#5B3A8E",
          DEFAULT: "#7047A8",
          dark: "#5B3A8E",
        },
        secondary: {
          50: "#EFFAF9",
          100: "#DBF3F2",
          200: "#B8E5E2",
          300: "#82D0CB",
          400: "#3FB2AC",
          500: "#1E9B95",
          600: "#168C87",
          DEFAULT: "#168C87",
        },
        rose: {
          50: "#FDF4F6",
          100: "#FBE9ED",
          200: "#F5D3DC",
          300: "#EEB3C3",
          400: "#E9A7B8",
          light: "#E9A7B8",
        },
        cream: {
          DEFAULT: "#FFF9F4",
          dark: "#FAF3EC",
        },
        charcoal: {
          DEFAULT: "#242424",
          light: "#3B3B3B",
          muted: "#6B6B6B",
        },
      },
      spacing: {
        4.5: "1.125rem",
      },
      opacity: {
        8: "0.08",
        12: "0.12",
        15: "0.15",
        35: "0.35",
        45: "0.45",
        55: "0.55",
        65: "0.65",
        85: "0.85",
      },
      fontFamily: {
        heading: ["Poppins", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(36, 36, 36, 0.06), 0 4px 16px rgba(36, 36, 36, 0.05)",
        hover: "0 4px 8px rgba(36, 36, 36, 0.08), 0 12px 32px rgba(36, 36, 36, 0.10)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.65" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        "slide-in-right": "slide-in-right 0.3s ease-out both",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};