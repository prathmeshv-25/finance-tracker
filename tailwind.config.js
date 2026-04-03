/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        headline: ["Manrope", "sans-serif"],
      },
      colors: {
        background: "rgb(var(--background))",
        surface: {
          1: "rgb(var(--surface-1))",
          2: "rgb(var(--surface-2))",
          3: "rgb(var(--surface-3))",
        },
        primary: {
          DEFAULT: "#4f46e5",
          dark: "#4338ca",
        },
        secondary: "#64748b",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        income: "rgb(var(--income))",
        expense: "rgb(var(--expense))",
        "text-primary": "rgb(var(--text-primary))",
        "text-secondary": "rgb(var(--text-secondary))",
        "text-muted": "rgb(var(--text-muted))",
        border: "rgb(var(--border))",
        "border-light": "rgb(var(--border-light))",
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      borderRadius: {
        "3xl": "1.5rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "indigo-gradient": "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
        "card-gradient": "linear-gradient(135deg, #1a1a27 0%, #12121a 100%)",
        "primary-gradient": "linear-gradient(135deg, #6c63ff 0%, #4a42cc 100%)",
        "income-gradient": "linear-gradient(135deg, #00d4aa 0%, #00a884 100%)",
        "expense-gradient": "linear-gradient(135deg, #ff6b6b 0%, #cc4444 100%)",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0, 0, 0, 0.04)",
        glow: "0 0 20px rgba(79, 70, 229, 0.2)",
        "premium-shadow": "0 10px 30px -10px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
