"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "py-2 bg-surface/95 backdrop-blur-sm shadow-lg border-b border-outline-variant/30"
          : "py-4 bg-surface/80 backdrop-blur-sm shadow-md"
      }`}
    >
      <div className="flex justify-between items-center px-6 md:px-32 py-2 w-full max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-headline font-bold text-primary">Sustain</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="#how-it-works"
            className="text-on-surface-variant font-medium hover:text-primary transition-colors text-sm"
          >
            How it works
          </Link>
          <Link
            href="#impact"
            className="text-on-surface-variant font-medium hover:text-primary transition-colors text-sm"
          >
            Impact
          </Link>
          <Link
            href="/vision"
            className="text-on-surface-variant font-medium hover:text-primary transition-colors text-sm"
          >
            Our Vision
          </Link>
          <Link
            href="/ngo"
            className="text-on-surface-variant font-medium hover:text-primary transition-colors text-sm"
          >
            For NGOs
          </Link>
          <Link
            href="/organizer"
            className="text-on-surface-variant font-medium hover:text-primary transition-colors text-sm"
          >
            For Organizers
          </Link>
          
          <div className="flex items-center gap-3 pl-2 border-l border-outline-variant/50">
            <ThemeToggle />
            <Link href="/organizer">
              <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-semibold hover:bg-primary-container transition-all active:scale-95 shadow-sm text-sm cursor-pointer">
                Get Started
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle & Theme Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-primary p-2 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-outline-variant px-6 py-4 flex flex-col gap-4 shadow-xl">
          <Link
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="text-on-surface-variant font-medium hover:text-primary transition-colors py-2 text-sm"
          >
            How it works
          </Link>
          <Link
            href="#impact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-on-surface-variant font-medium hover:text-primary transition-colors py-2 text-sm"
          >
            Impact
          </Link>
          <Link
            href="/vision"
            onClick={() => setMobileMenuOpen(false)}
            className="text-on-surface-variant font-medium hover:text-primary transition-colors py-2 text-sm"
          >
            Our Vision
          </Link>
          <Link
            href="/ngo"
            onClick={() => setMobileMenuOpen(false)}
            className="text-on-surface-variant font-medium hover:text-primary transition-colors py-2 text-sm"
          >
            For NGOs
          </Link>
          <Link
            href="/organizer"
            onClick={() => setMobileMenuOpen(false)}
            className="text-on-surface-variant font-medium hover:text-primary transition-colors py-2 text-sm"
          >
            For Organizers
          </Link>
          <Link href="/organizer" onClick={() => setMobileMenuOpen(false)}>
            <button className="w-full bg-primary text-on-primary py-3 rounded-xl font-semibold hover:bg-primary-container transition-all text-center text-sm cursor-pointer">
              Get Started
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
