import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        blueprint: {
          DEFAULT: "#1E40AF",
          deep: "#1E3A8A",
          line: "#FFFFFF",
        },
        offwhite: "#FAFAFA",
        ink: "#0F172A",
        warn: "#FBBF24",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter-display)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        "tight-2": "-0.02em",
        "tight-3": "-0.03em",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "blueprint-grid":
          "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "draw": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        "bob": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 600ms ease-out forwards",
        "draw": "draw 1500ms ease-out forwards",
        "bob": "bob 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
