import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FAF3EA",
          dark: "#F2E6D8",
          card: "#FDF8F2",
          paper: "#F8F0E4",
        },
        blush: {
          50:  "#FDF0EC",
          100: "#F8DDD5",
          200: "#EEC5B8",
          300: "#E0A898",
          400: "#CC8878",
          500: "#B86860",
          DEFAULT: "#CC8878",
          sidebar: "#E8C8BC",
        },
        sage: {
          50:  "#EEF3E8",
          100: "#D5E4CA",
          200: "#B0C99A",
          300: "#8AAE6E",
          400: "#6A9450",
          500: "#4E7840",
          DEFAULT: "#8AAE6E",
        },
        rose: {
          soft: "#F5DEDE",
          DEFAULT: "#D4909A",
          dark: "#A86070",
        },
        warm: {
          brown: "#7A5840",
          tan: "#C4A080",
          gold: "#C8A060",
          text: "#4A3828",
          muted: "#8A7060",
        },
        petal: {
          pink: "#F0C8C0",
          peach: "#F0D8C8",
          yellow: "#F0E0A8",
          green: "#C8DDB8",
          lavender: "#D8CCEA",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "serif"],
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "22px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(74, 56, 40, 0.08), 0 1px 3px rgba(74, 56, 40, 0.05)",
        "card-hover": "0 6px 24px rgba(74, 56, 40, 0.13)",
        soft: "0 1px 6px rgba(74, 56, 40, 0.08)",
        window: "0 4px 20px rgba(74, 56, 40, 0.12), 0 1px 4px rgba(74, 56, 40, 0.06)",
      },
      animation: {
        "float-up": "floatUp 1.4s ease-out forwards",
        "level-up": "levelUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "bounce-in": "bounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "shimmer": "shimmer 2.5s linear infinite",
        "sway": "sway 4s ease-in-out infinite",
      },
      keyframes: {
        floatUp: {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "40%": { opacity: "1", transform: "translateY(-20px) scale(1.15)" },
          "100%": { opacity: "0", transform: "translateY(-56px) scale(0.9)" },
        },
        levelUp: {
          "0%": { opacity: "0", transform: "scale(0.6) translateY(12px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.7)" },
          "60%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
