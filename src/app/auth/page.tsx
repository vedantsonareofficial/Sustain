"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Building2, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const [role, setRole] = useState<"organizer" | "ngo">("organizer");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[85vh] text-foreground flex items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-md glass-panel p-8 md:p-10 space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-[family-name:var(--font-serif)] text-3xl tracking-tight">
            {mode === "login" ? "Access Portal" : "Join SUSTAIN"}
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-beige/40">
            {mode === "login" ? "Authenticate to your workspace" : "Register your rescue role"}
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-px border border-beige/15 overflow-hidden">
          <button
            onClick={() => setRole("organizer")}
            className={`py-3.5 text-[11px] uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
              role === "organizer"
                ? "bg-beige text-forest"
                : "bg-transparent text-beige/40 hover:text-beige/70"
            }`}
          >
            <User size={14} />
            Organizer
          </button>
          <button
            onClick={() => setRole("ngo")}
            className={`py-3.5 text-[11px] uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
              role === "ngo"
                ? "bg-beige text-forest"
                : "bg-transparent text-beige/40 hover:text-beige/70"
            }`}
          >
            <Building2 size={14} />
            NGO
          </button>
        </div>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {mode === "register" && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] text-beige/45 font-semibold">
                {role === "organizer" ? "Organization Name" : "NGO Name"}
              </label>
              <input
                type="text"
                placeholder={role === "organizer" ? "e.g. Grand Hyatt Events" : "e.g. Hope Food Bank"}
                className="w-full bg-beige/[0.03] border border-beige/15 px-4 py-3 text-sm text-beige placeholder:text-beige/25 focus:outline-none focus:border-beige/40 transition-colors"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.2em] text-beige/45 font-semibold">
              Email Address
            </label>
            <input
              type="email"
              placeholder="partner@sustain.org"
              className="w-full bg-beige/[0.03] border border-beige/15 px-4 py-3 text-sm text-beige placeholder:text-beige/25 focus:outline-none focus:border-beige/40 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-[0.2em] text-beige/45 font-semibold">
                Password
              </label>
              {mode === "login" && (
                <button type="button" className="text-[9px] uppercase tracking-[0.15em] text-beige/30 hover:text-beige/60 transition-colors">
                  Reset
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                className="w-full bg-beige/[0.03] border border-beige/15 px-4 py-3 text-sm text-beige placeholder:text-beige/25 focus:outline-none focus:border-beige/40 transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-beige/30 hover:text-beige/60 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-beige text-forest text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:bg-beige-dim transition-colors mt-2"
          >
            {mode === "login" ? "Authenticate" : "Create Account"}
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center">
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-[11px] uppercase tracking-[0.15em] text-beige/40 hover:text-beige transition-colors"
          >
            {mode === "login" ? "New here? Register instead" : "Already a member? Log in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
