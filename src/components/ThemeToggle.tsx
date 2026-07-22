"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full border border-outline-variant bg-surface-container-low animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container hover:shadow-md transition-all duration-300 active:scale-95 cursor-pointer relative overflow-hidden"
      aria-label="Toggle dark mode"
    >
      <span
        className={`material-symbols-outlined absolute transition-all duration-500 transform ${
          isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      >
        light_mode
      </span>
      <span
        className={`material-symbols-outlined absolute transition-all duration-500 transform ${
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        }`}
      >
        dark_mode
      </span>
    </button>
  );
}
