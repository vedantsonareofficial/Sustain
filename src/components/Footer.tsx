"use client";

import Link from "next/link";

interface FooterProps {
  variant?: "landing" | "dashboard";
}

export function Footer({ variant = "landing" }: FooterProps) {
  if (variant === "dashboard") {
    return (
      <footer className="ml-64 bg-surface border-t border-outline-variant/30 py-6 px-12 flex flex-col md:flex-row justify-between items-center text-on-surface-variant z-10 relative">
        <div className="flex flex-col items-center md:items-start">
          <h5 className="text-lg font-headline font-bold text-primary">Sustain</h5>
          <p className="text-xs text-on-surface-variant mt-1">© 2024 Sustain. Efficiency in abundance.</p>
        </div>
        <div className="flex flex-wrap gap-6 mt-4 md:mt-0 justify-center">
          <Link href="#" className="text-xs hover:text-primary transition-colors font-medium">Privacy Policy</Link>
          <Link href="#" className="text-xs hover:text-primary transition-colors font-medium">Terms of Service</Link>
          <Link href="#" className="text-xs hover:text-primary transition-colors font-medium">Global Logistics Standards</Link>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-primary text-on-primary relative w-full overflow-hidden mt-auto">
      <div className="h-24 w-full bg-transparent footer-wave absolute -top-1 z-10 opacity-10 dark:opacity-20"></div>
      <div className="max-w-7xl mx-auto px-6 md:px-32 pt-24 pb-12 relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-12 md:space-y-0">
          <div className="max-w-sm">
            <span className="text-2xl font-headline font-bold text-primary-fixed block mb-4">Sustain</span>
            <p className="text-sm text-primary-fixed/80">
              Efficiency in abundance. We're on a mission to ensure no quality meal ever goes to waste while people go hungry.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 md:gap-24">
            <div className="flex flex-col gap-3">
              <p className="text-xs text-secondary-fixed font-bold uppercase tracking-wider">Resources</p>
              <Link className="text-sm text-on-primary/70 hover:text-on-primary transition-colors" href="#">Privacy Policy</Link>
              <Link className="text-sm text-on-primary/70 hover:text-on-primary transition-colors" href="#">Terms of Service</Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs text-secondary-fixed font-bold uppercase tracking-wider">Support</p>
              <Link className="text-sm text-on-primary/70 hover:text-on-primary transition-colors" href="#">Contact Support</Link>
              <Link className="text-sm text-on-primary/70 hover:text-on-primary transition-colors" href="#">Logistics Standards</Link>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-primary-fixed/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-fixed/60">© 2024 Sustain. Efficiency in abundance.</p>
          <div className="flex gap-6">
            <Link className="text-primary-fixed/60 hover:text-on-primary transition-colors" href="#" aria-label="Website">
              <span className="material-symbols-outlined">public</span>
            </Link>
            <Link className="text-primary-fixed/60 hover:text-on-primary transition-colors" href="#" aria-label="Share">
              <span className="material-symbols-outlined">share</span>
            </Link>
            <Link className="text-primary-fixed/60 hover:text-on-primary transition-colors" href="#" aria-label="Contact">
              <span className="material-symbols-outlined">mail</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
