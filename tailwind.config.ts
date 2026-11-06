import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dawn: {
          50: "#fffaf3",
          100: "#fdf1e3",
          200: "#f9e0c7",
          300: "#f2c7a3",
          400: "#e8a97e",
          500: "#d98c62",
        },
        sage: { 100: "#e6eee4", 300: "#b6cdb2", 600: "#5f7d5b" },
        ink: { DEFAULT: "#4a3f3a", soft: "#7a6c64" },
      },
      borderRadius: { "4xl": "2rem" },
      boxShadow: { soft: "0 8px 30px -12px rgba(150, 100, 70, 0.25)" },
    },
  },
  plugins: [],
};
export default config;
