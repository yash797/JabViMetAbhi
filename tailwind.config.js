/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["'Playfair Display'", "Georgia", "serif"],
        cinzel: ["'Cinzel'", "serif"],
        garamond: ["'EB Garamond'", "Georgia", "serif"],
        lato: ["'Lato'", "sans-serif"],
      },
      colors: {
        ivory: "#FAF6EE",
        cream: "#F5EDD8",
        parchment: "#EDE0C4",
        gold: {
          DEFAULT: "#C8963C",
          light: "#E4C47A",
          pale: "#F7EDD0",
          dark: "#7A5510",
        },
        teal: {
          DEFAULT: "#1A6B6B",
          light: "#2E9090",
          pale: "#D4EDED",
        },
        blush: "#F2C4C4",
        rose: "#C4607A",
        dusty: "#D4848E",
        marigold: {
          DEFAULT: "#E8961E",
          light: "#F5C040",
        },
        leaf: {
          DEFAULT: "#3A7A3A",
          light: "#6AAF6A",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.75s ease forwards",
        "logo-reveal": "logoReveal 1.2s cubic-bezier(0.16,1,0.3,1) forwards",
        "petal-fall": "petalFall linear infinite",
        sparkle: "sparkle ease-in-out infinite",
        breathe: "breathe 2.5s ease infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        shimmer: "shimmerSlide 4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: "translateY(22px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        logoReveal: {
          from: { opacity: 0, transform: "scale(0.75) translateY(10px)" },
          to: { opacity: 1, transform: "scale(1) translateY(0)" },
        },
        petalFall: {
          "0%": { opacity: 0, transform: "translateY(-20px) rotate(0deg) scale(0.5)" },
          "10%": { opacity: 0.7 },
          "90%": { opacity: 0.4 },
          "100%": { opacity: 0, transform: "translateY(100vh) rotate(720deg) scale(0.3)" },
        },
        sparkle: {
          "0%,100%": { opacity: 0, transform: "scale(0) rotate(0deg)" },
          "30%,70%": { opacity: 1, transform: "scale(1) rotate(180deg)" },
        },
        breathe: {
          "0%,100%": { opacity: 0.35, transform: "translateX(-50%) translateY(0)" },
          "50%": { opacity: 0.7, transform: "translateX(-50%) translateY(6px)" },
        },
        pulseGlow: {
          "0%,100%": { transform: "scale(0.95)", opacity: 0.6 },
          "50%": { transform: "scale(1.05)", opacity: 1 },
        },
        shimmerSlide: {
          "0%,100%": { opacity: 0.4, transform: "scaleX(0.8)" },
          "50%": { opacity: 1, transform: "scaleX(1)" },
        },
      },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
};
