"use client";

import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Globe, Shield, Zap } from "lucide-react";
import FounderProfile from "@/components/FounderProfile";

const IndiaMap3D = dynamic(() => import("@/components/IndiaMap3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center glass-panel">
      <p className="text-[11px] uppercase tracking-[0.3em] text-beige/40 animate-pulse font-sans">
        Initializing 3D Projection&hellip;
      </p>
    </div>
  ),
});

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const rise = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.25, 1, 0.5, 1] } },
};

export default function TheSolutionPage() {
  return (
    <div className="text-foreground">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 md:px-10 py-24 space-y-32"
      >
        {/* ── Hero ── */}
        <motion.section variants={rise} className="text-center space-y-6 max-w-4xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.35em] text-beige/45">
            Real-Time Logistics Infrastructure
          </p>
          <h1 className="font-[family-name:var(--font-serif)] text-5xl sm:text-7xl md:text-[5.5rem] font-normal tracking-tight leading-[0.9]">
            Connecting Abundance
            <br />
            With Necessity.
          </h1>
          <p className="text-sm text-beige/50 max-w-lg mx-auto leading-relaxed">
            SUSTAIN is a decentralized coordination layer enabling instantaneous
            mapping and routing of surplus food to rescue organizations.
          </p>
        </motion.section>

        {/* ── 3D India Map ── */}
        <motion.section variants={rise} className="space-y-4">
          <div className="text-center mb-2">
            <h2 className="font-serif-premium text-2xl md:text-3xl tracking-tight">
              India Rescue Matrix
            </h2>
            <p className="text-[10px] uppercase tracking-[0.25em] text-beige/40 mt-1.5 font-sans">
              Each pin represents an active food rescue coordination point
            </p>
          </div>
          <div className="glass-panel p-3 md:p-6">
            <IndiaMap3D />
          </div>
        </motion.section>

        {/* ── Pillars ── */}
        <motion.section variants={rise} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Globe,
              title: "Precision Geomapping",
              desc: "Donors pin exact drop-off coordinates. NGOs receive real-time proximity alerts for zero-friction retrieval logistics.",
            },
            {
              icon: Shield,
              title: "Verified Accountability",
              desc: "Every listing carries strict role verification. Full audit trails protect food safety standards and organizer compliance.",
            },
            {
              icon: Zap,
              title: "Instant Coordination",
              desc: "Surplus food is time-critical. Our platform ensures sub-minute visibility from listing to claim to confirmed pickup.",
            },
          ].map((pillar, i) => (
            <div key={i} className="glass-panel glass-panel-hover p-8 md:p-10 space-y-5 transition-all duration-500">
              <pillar.icon size={24} strokeWidth={1.5} className="text-beige/65" />
              <h3 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl leading-tight">
                {pillar.title}
              </h3>
              <p className="text-sm text-beige/45 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </motion.section>

        {/* ── Founder ── */}
        <motion.section variants={rise}>
          <FounderProfile />
        </motion.section>
      </motion.div>
    </div>
  );
}
