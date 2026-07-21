"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "./AuthProvider";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { authUser, dbUser, loading, signOut } = useAuth();

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = dbUser?.full_name || authUser?.email || "User";
  const initials = displayName.charAt(0).toUpperCase();
  const dashboardHref = dbUser?.role === "ngo" ? "/ngo" : "/organizer";

  const handleSignOut = async () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    await signOut();
  };

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

            {loading ? (
              <div className="w-9 h-9 rounded-full bg-surface-container-high animate-pulse" />
            ) : authUser ? (
              /* Logged-in: avatar + dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-sm group-hover:shadow-md transition-shadow">
                    {initials}
                  </div>
                  <span className="text-sm font-semibold text-on-surface-variant group-hover:text-primary transition-colors max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">
                    {dropdownOpen ? "expand_less" : "expand_more"}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-outline-variant/30 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-outline-variant/20">
                      <p className="text-sm font-bold text-on-surface truncate">{displayName}</p>
                      <p className="text-xs text-on-surface-variant truncate">{authUser.email}</p>
                      {dbUser?.role && (
                        <span className="inline-block mt-1 text-[10px] uppercase font-extrabold tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                          {dbUser.role}
                        </span>
                      )}
                    </div>
                    <Link
                      href={dashboardHref}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">dashboard</span>
                      Dashboard
                    </Link>
                    <Link
                      href="/account"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      Account
                    </Link>
                    <div className="border-t border-outline-variant/20 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-container/30 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not logged in: Sign In / Sign Up */
              <>
                <Link href="/login">
                  <button className="text-on-surface-variant font-semibold px-4 py-2 rounded-full hover:bg-surface-container-high transition-all text-sm cursor-pointer">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-semibold hover:bg-primary-container transition-all active:scale-95 shadow-sm text-sm cursor-pointer">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
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

          {loading ? null : authUser ? (
            /* Logged-in mobile: user info + links */
            <>
              <div className="border-t border-outline-variant/30 pt-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-on-surface truncate">{displayName}</p>
                  <p className="text-xs text-on-surface-variant truncate">{authUser.email}</p>
                </div>
              </div>
              <Link href={dashboardHref} onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full border border-outline-variant text-on-surface-variant py-3 rounded-xl font-semibold text-center text-sm cursor-pointer hover:bg-surface-container-high transition-all">
                  Dashboard
                </button>
              </Link>
              <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full border border-outline-variant text-on-surface-variant py-3 rounded-xl font-semibold text-center text-sm cursor-pointer hover:bg-surface-container-high transition-all">
                  Account
                </button>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full border border-error/30 text-error py-3 rounded-xl font-semibold text-center text-sm cursor-pointer hover:bg-error-container/30 transition-all"
              >
                Log Out
              </button>
            </>
          ) : (
            /* Not logged in mobile */
            <>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full border border-outline-variant text-on-surface-variant py-3 rounded-xl font-semibold text-center text-sm cursor-pointer hover:bg-surface-container-high transition-all">
                  Sign In
                </button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full bg-primary text-on-primary py-3 rounded-xl font-semibold hover:bg-primary-container transition-all text-center text-sm cursor-pointer">
                  Sign Up Free
                </button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
