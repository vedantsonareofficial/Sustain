"use client";

import Link from "next/link";

export default function FounderProfile() {
  return (
    <section className="border-t border-beige/20 pt-20 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
        {/* Left: Massive Name */}
        <div className="md:col-span-5">
          <h2 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.85] text-beige">
            VEDANT
            <br />
            SONARE
          </h2>
          <p className="text-[11px] uppercase tracking-[0.25em] text-beige/40 mt-5 font-sans">
            Founder &amp; Principal Architect, SUSTAIN
          </p>
        </div>

        {/* Right: Mission Statement */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <blockquote className="text-2xl sm:text-3xl lg:text-[2.1rem] font-normal leading-snug tracking-tight text-beige/85">
            &ldquo;We do not have a resource problem. We have a distribution problem.
            SUSTAIN exists to close the delta between waste and wellness
            &mdash; permanently.&rdquo;
          </blockquote>

          <div className="mt-10 space-y-5">
            <p className="text-sm text-beige/50 leading-relaxed font-sans max-w-lg">
              By constructing premium digital infrastructure for food logistics,
              we systematically decouple community nourishment from the failures
              of industrial food supply chains.
            </p>
            <Link
              href="/auth"
              className="inline-block px-8 py-4 bg-beige text-forest text-xs font-bold uppercase tracking-[0.2em] hover:bg-beige-dim transition-colors font-sans"
            >
              Join the Mission
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
