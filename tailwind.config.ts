import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f4f7fc",
        sidebar: "#ffffff",
        navy: {
          900: "#0b1329",
          800: "#111c38",
          700: "#1e294b",
          600: "#334155",
          500: "#475569",
        },
        brand: {
          blue: "#3b82f6",
          indigo: "#6366f1",
          purple: "#8b5cf6",
          violet: "#a855f7",
          electric: "#4338ca",
        },
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(99, 102, 241, 0.06), 0 2px 8px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 6px 24px -4px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        'glow': '0 0 25px -3px rgba(99, 102, 241, 0.28)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

