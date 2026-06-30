"use client";

import React from "react";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { ThemeProvider, useTheme } from "./ThemeProvider";
import AnimatedLayout from "./AnimatedLayout";
import AnnapurnaChat from "./AnnapurnaChat";
import dynamic from "next/dynamic";

const InteractiveBackground3D = dynamic(
  () => import("./InteractiveBackground3D"),
  { ssr: false }
);

function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="px-6 md:px-10 py-5 border-b border-panel-border bg-transparent sticky top-0 z-50 transition-colors duration-400">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/the-crisis"
          className="font-serif-premium text-3xl md:text-4xl font-normal tracking-tight text-beige hover:opacity-85 transition-opacity"
        >
          SUSTAIN
        </Link>

        <nav className="flex items-center gap-6 md:gap-8 text-[11px] uppercase tracking-[0.2em] font-sans">
          <Link href="/the-crisis" className="text-beige hover:opacity-80 transition-opacity">
            The Crisis
          </Link>
          <Link href="/the-solution" className="text-beige hover:opacity-80 transition-opacity">
            The Solution
          </Link>
          <Link href="/dashboard" className="text-beige hover:opacity-80 transition-opacity">
            Dashboard
          </Link>
          
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-2 border border-panel-border hover:bg-beige hover:text-background text-beige transition-all duration-300 rounded-none flex items-center justify-center"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <Link
            href="/auth"
            className="hidden md:block px-5 py-2.5 bg-beige text-background font-semibold hover:bg-beige-dim transition-colors"
          >
            Access Portal
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      {/* Noise background texture */}
      <div className="noise-overlay" />

      {/* Mouse reactive background shapes */}
      <InteractiveBackground3D />

      <div className="min-h-screen flex flex-col relative z-10">
        <Header />
        
        <main className="flex-grow">
          <AnimatedLayout>{children}</AnimatedLayout>
        </main>

        <AnnapurnaChat />

        <footer className="border-t border-panel-border bg-transparent transition-colors duration-400">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-4 font-sans">
            <p className="text-[10px] uppercase tracking-[0.2em] text-beige/40">
              &copy; 2026 SUSTAIN. Zero Waste, Full Impact.
            </p>
            <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em]">
              <Link href="/the-crisis" className="text-beige/40 hover:text-beige/70 transition-colors">The Crisis</Link>
              <Link href="/the-solution" className="text-beige/40 hover:text-beige/70 transition-colors">The Solution</Link>
              <Link href="/auth" className="text-beige/40 hover:text-beige/70 transition-colors">Portal</Link>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
