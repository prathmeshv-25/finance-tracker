"use client";

import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 transition-all">
      <div>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Appearance Mode</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Switch between light and dark themes.</p>
      </div>
      <button
        onClick={toggleTheme}
        className="w-14 h-8 bg-slate-200 dark:bg-indigo-600 rounded-full relative p-1 transition-all duration-300"
      >
        <div className={`w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transform transition-transform duration-300 ${isDark ? "translate-x-6" : "translate-x-0"}`}>
          {isDark ? <Moon size={14} className="text-indigo-600" /> : <Sun size={14} className="text-amber-500" />}
        </div>
      </button>
    </div>
  );
}
