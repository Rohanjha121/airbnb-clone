"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";

interface ThemeToggleProps {
  variant?: "pill" | "dropdown" | "button";
  className?: string;
}

export default function ThemeToggle({ variant = "dropdown", className = "" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse ${className}`} />
    );
  }

  if (variant === "button") {
    const isDark = resolvedTheme === "dark";
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`p-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 cursor-pointer ${className}`}
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        title={`Switch to ${isDark ? "light" : "dark"} theme`}
      >
        {isDark ? (
          <Sun size={18} className="text-amber-500 transition-transform duration-300 rotate-0 hover:rotate-45" />
        ) : (
          <Moon size={18} className="text-zinc-700 transition-transform duration-300 rotate-0 hover:-rotate-12" />
        )}
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <div
        className={`flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full border border-zinc-200 dark:border-zinc-700 transition-colors ${className}`}
        role="group"
        aria-label="Theme selector"
      >
        <button
          onClick={() => setTheme("light")}
          aria-label="Light theme"
          title="Light Theme"
          className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
            theme === "light"
              ? "bg-white dark:bg-zinc-700 text-amber-500 shadow-xs"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Sun size={14} />
        </button>
        <button
          onClick={() => setTheme("dark")}
          aria-label="Dark theme"
          title="Dark Theme"
          className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
            theme === "dark"
              ? "bg-white dark:bg-zinc-700 text-blue-400 shadow-xs"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Moon size={14} />
        </button>
        <button
          onClick={() => setTheme("system")}
          aria-label="System theme"
          title="System Theme"
          className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
            theme === "system"
              ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Laptop size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        Appearance
      </div>
      <div
        className="px-2 flex items-center justify-between gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl mx-2 border border-zinc-200/80 dark:border-zinc-700/60"
        role="group"
        aria-label="Theme selector options"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setTheme("light");
          }}
          aria-label="Switch to light theme"
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
            theme === "light"
              ? "bg-white text-zinc-900 shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          <Sun size={13} className={theme === "light" ? "text-amber-500" : ""} />
          <span>Light</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setTheme("dark");
          }}
          aria-label="Switch to dark theme"
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
            theme === "dark"
              ? "bg-zinc-700 text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          <Moon size={13} className={theme === "dark" ? "text-blue-400" : ""} />
          <span>Dark</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setTheme("system");
          }}
          aria-label="Switch to system theme"
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
            theme === "system"
              ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          <Laptop size={13} />
          <span>System</span>
        </button>
      </div>
    </div>
  );
}
