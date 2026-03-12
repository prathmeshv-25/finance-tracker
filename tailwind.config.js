/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        background: "rgb(var(--background))",

        surface: {
          1: "rgb(var(--surface-1))",
          2: "rgb(var(--surface-2))",
          3: "rgb(var(--surface-3))",
        },

        primary: "rgb(var(--primary))",
        "primary-hover": "rgb(var(--primary-hover))",
        secondary: "rgb(var(--secondary))",

        income: "rgb(var(--income))",
        expense: "rgb(var(--expense))",

        "text-primary": "rgb(var(--text-primary))",
        "text-secondary": "rgb(var(--text-secondary))",
        "text-muted": "rgb(var(--text-muted))",

        border: "rgb(var(--border))",
        "border-light": "rgb(var(--border-light))",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "card-gradient":
          "linear-gradient(135deg, #1a1a27 0%, #12121a 100%)",
        "primary-gradient":
          "linear-gradient(135deg, #6c63ff 0%, #4a42cc 100%)",
        "income-gradient":
          "linear-gradient(135deg, #00d4aa 0%, #00a884 100%)",
        "expense-gradient":
          "linear-gradient(135deg, #ff6b6b 0%, #cc4444 100%)",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
        glow: "0 0 20px rgba(108, 99, 255, 0.3)",
        "glow-accent": "0 0 20px rgba(0, 212, 170, 0.3)",
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
