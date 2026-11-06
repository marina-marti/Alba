import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // warm paper / apricot dawn
        dawn: {
          50: "#fdf8f0",
          100: "#faeedd",
          200: "#f5dcc1",
          300: "#f1c39d",
          400: "#e9ab7e",
          500: "#b0502b",
          600: "#94411f",
        },
        sage: { 50: "#f2f6ef", 100: "#e6eee2", 300: "#c2d4bc", 500: "#7f9e79", 600: "#4d6a49", 700: "#3b543a" },
        ink: { DEFAULT: "#3a2f29", soft: "#6a5a50" },
        // warm coral, used only on the urgent alert screen
        coral: { 50: "#fff3ee", 500: "#d2543b", 600: "#b23c28", 700: "#8f2a1a" },
      },
      fontFamily: {
        sans: ["ui-rounded", "'SF Pro Rounded'", "system-ui", "-apple-system", "'Segoe UI'", "sans-serif"],
        serif: ["ui-serif", "Georgia", "'Iowan Old Style'", "serif"],
      },
      borderRadius: { "3xl": "1.5rem", "4xl": "2rem", "5xl": "2.25rem" },
      boxShadow: {
        soft: "0 22px 50px -26px rgba(120, 80, 50, 0.32), 0 2px 8px -3px rgba(120, 80, 50, 0.08)",
        lift: "0 30px 60px -26px rgba(120, 80, 50, 0.4), 0 3px 10px -3px rgba(120, 80, 50, 0.1)",
      },
      keyframes: {
        rise: { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: { rise: "rise 500ms ease-out both" },
    },
  },
  plugins: [],
};
export default config;
