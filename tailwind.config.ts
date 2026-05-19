import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FBF8F1",
          100: "#F6F0E1",
          200: "#EFE6CC",
          300: "#E6D8AE",
        },
        navy: {
          700: "#1F2A44",
          800: "#16203A",
          900: "#0E1730",
        },
        gold: {
          400: "#D4AF6A",
          500: "#C49A4E",
          600: "#A77E36",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "'Helvetica Neue'",
          "'Segoe UI'",
          "'Apple SD Gothic Neo'",
          "'Noto Sans KR'",
          "sans-serif",
        ],
        serif: ["'Noto Serif KR'", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 4px 16px -4px rgba(22, 32, 58, 0.08), 0 2px 4px -2px rgba(22, 32, 58, 0.06)",
        cardHover:
          "0 12px 28px -8px rgba(22, 32, 58, 0.18), 0 4px 8px -4px rgba(22, 32, 58, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
