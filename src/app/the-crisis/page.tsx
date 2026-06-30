"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import CountUp from "react-countup";
import { Flame, Skull, Leaf, ArrowRight } from "lucide-react";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
};

const rise = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] } },
};

export default function TheCrisisPage() {
  return (
    <div className="text-foreground">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto px-6 md:px-10 py-24 space-y-32"
      >
        {/* ── Hero ── */}
        <motion.section variants={rise} className="text-center space-y-8">
          <p className="text-[11px] uppercase tracking-[0.35em] text-beige/45">
            A Global Emergency Hidden in Plain Sight
          </p>
          <h1 className="font-[family-name:var(--font-serif)] text-5xl sm:text-7xl md:text-[5.5rem] lg:text-[7rem] font-normal tracking-tight leading-[0.9]">
            One-Third of All
            <br />
            Food Is Wasted.
          </h1>
          <p className="text-sm md:text-base text-beige/50 max-w-xl mx-auto leading-relaxed">
            While 828 million people face chronic hunger, the world discards
            1.3 billion tons of food every year. SUSTAIN exists to redirect
            the flow.
          </p>
        </motion.section>

        {/* ── Live Impact Counter ── */}
        <motion.section variants={rise} className="glass-panel p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-beige/30 to-transparent" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-beige/40 mb-4">
            Active Global Impact
          </p>
          <div className="font-[family-name:var(--font-serif)] text-6xl sm:text-8xl md:text-9xl tracking-tighter text-beige">
            <CountUp start={89243} end={247819} duration={4} separator="," useEasing />
          </div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-beige/55 mt-4 font-semibold">
            Total Meals Rescued Worldwide
          </p>
        </motion.section>

        {/* ── Crisis Statistics ── */}
        <motion.section variants={rise} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel glass-panel-hover p-8 md:p-10 space-y-6 transition-all duration-500">
            <Flame size={28} strokeWidth={1.5} className="text-beige/70" />
            <h3 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl leading-tight">
              1.3 Billion Tons Lost Annually
            </h3>
            <p className="text-sm text-beige/45 leading-relaxed">
              Enough perfectly edible food is discarded each day to feed every
              person facing food insecurity on the planet twice over.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-8 md:p-10 space-y-6 transition-all duration-500">
            <Skull size={28} strokeWidth={1.5} className="text-beige/70" />
            <h3 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl leading-tight">
              The 3rd Largest Emitter on Earth
            </h3>
            <p className="text-sm text-beige/45 leading-relaxed">
              If food waste were a country, it would rank behind only the
              United States and China in greenhouse gas emissions.
            </p>
          </div>
        </motion.section>

        {/* ── Narrative ── */}
        <motion.section variants={rise} className="border-t border-beige/15 pt-20 max-w-3xl mx-auto text-center space-y-8">
          <Leaf size={32} strokeWidth={1.2} className="mx-auto text-beige/40" />
          <h2 className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl tracking-tight">
            The Structural Failure
          </h2>
          <p className="text-sm md:text-base text-beige/50 leading-relaxed">
            The crisis is not a shortage of food. It is a failure of
            distribution. Organizers of large-scale events, hotels, and
            food suppliers discard perfectly viable food because no
            real-time channel exists to connect them with NGOs who have
            the infrastructure to redistribute it.
          </p>
          <div className="pt-6">
            <Link
              href="/the-solution"
              className="inline-flex items-center gap-3 px-8 py-4 bg-beige text-forest text-xs font-bold uppercase tracking-[0.2em] hover:bg-beige-dim transition-colors"
            >
              See the Solution
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}
