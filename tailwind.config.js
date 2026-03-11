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
        background: "#0a0a0f",
        surface: "#12121a",
        "surface-2": "#1a1a27",
        "surface-3": "#22223a",
        border: "#2a2a45",
        "border-light": "#3a3a5c",
        primary: "#6c63ff",
        "primary-hover": "#7c74ff",
        "primary-dark": "#4a42cc",
        accent: "#00d4aa",
        "accent-hover": "#00e6ba",
        income: "#00d4aa",
        expense: "#ff6b6b",
        "text-primary": "#f0f0ff",
        "text-secondary": "#9090bb",
        "text-muted": "#5a5a88",
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
