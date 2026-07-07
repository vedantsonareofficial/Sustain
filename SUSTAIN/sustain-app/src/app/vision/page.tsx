"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function OurVisionPage() {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <Navbar />

      <main className="flex-1 pt-24">
        {/* Hero Header */}
        <section className="pt-16 pb-24 px-6 md:px-32 text-center overflow-hidden bg-surface">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span
                className="material-symbols-outlined text-primary text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                eco
              </span>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Our Story
              </span>
            </div>
            <h1 className="text-5xl md:text-[56px] font-headline font-bold text-primary leading-tight">
              Why We Built Sustain
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-2xl mx-auto italic font-body">
              &ldquo;To redefine abundance by ensuring that no nutritious meal is lost to
              logistics, creating a seamless bridge between excess and essential human need
              through technology and dignity.&rdquo;
            </p>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-20 px-6 md:px-32 bg-surface-container-low/50">
          <div className="max-w-3xl mx-auto">
            <div className="backdrop-blur-md bg-surface-container/40 border border-outline-variant/30 rounded-3xl p-10 md:p-16 shadow-xl text-center space-y-4 relative overflow-hidden">
              <div className="absolute -top-12 -left-12 text-[160px] font-headline opacity-5 text-secondary select-none leading-none">
                &ldquo;
              </div>
              <h3 className="font-headline text-xl font-bold text-primary tracking-widest uppercase">
                Vedant Sonare
              </h3>
              <p className="text-xs font-bold text-secondary tracking-widest uppercase">
                Founder, Sustain
              </p>
              <blockquote className="font-headline text-xl md:text-2xl italic text-on-surface leading-relaxed relative z-10 pt-4">
                Having experienced hunger firsthand, we simply cannot stand to watch anyone go
                to sleep on an empty stomach. Sustain exists to bridge the gap between event
                surplus and starvation, ensuring extra food becomes a dignified meal for those
                who need it most.
              </blockquote>
              <p className="text-on-surface-variant text-sm font-body">
                — <strong>Vedant Sonare</strong>, Founder, Sustain
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 px-6 md:px-32 bg-surface">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary text-center mb-12">
              The Midnight Epiphany
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-on-surface-variant font-body">
              <p>
                The journey began on a hot humid night in Mumbai. At a grand wedding
                celebration, I witnessed tables overflowing with gourmet delicacies—saffron-infused
                biryanis, roasted meats, and delicate pastries. As the lights dimmed at midnight,
                crates of untouched, perfectly nutritious food were being wheeled toward disposal bins.
              </p>
              <p>
                Less than a kilometer away, under the flyovers near the railway station, children
                and families were retiring for the night with empty stomachs. The gap wasn't a
                lack of food; it was a total failure of logistics. The abundance existed, but
                there was no way to move it with the speed and safety that perishables require.
              </p>
              <p>
                We quickly realized that manual coordination—WhatsApp groups and phone calls—couldn't
                scale. To truly solve hunger in a country as vast as India, we needed a
                logistics-first approach. We needed real-time tracking, cold-chain verification,
                and a professional digital infrastructure that could match the efficiency of any
                global delivery giant.
              </p>
              <p>
                Today, Sustain is more than a web portal. Our vision is to become the nationwide
                standard for food rescue infrastructure. By 2026, we aim to be operational in 50
                major Indian cities, creating a future where &ldquo;leftover&rdquo; is a term of
                the past, replaced by &ldquo;redistributed abundance.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 px-6 md:px-32 bg-surface-container-low/40">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-bold text-secondary tracking-widest uppercase mb-3">
                Principles
              </p>
              <h2 className="text-3xl font-headline font-bold text-on-surface">
                The Values That Drive Our Tech
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: "visibility",
                  title: "Transparency",
                  desc: "Real-time tracking from pickup to plate. Donors see exactly where their impact lands through verifiable data.",
                },
                {
                  icon: "bolt",
                  title: "Speed",
                  desc: "A logistics-first mindset. For perishables, every minute counts, and our AI-routing ensures zero delays.",
                },
                {
                  icon: "groups",
                  title: "Community",
                  desc: "A verified network of NGO partners, ensuring that food reaches those who need it most, safely.",
                },
              ].map((v) => (
                <div
                  key={v.title}
                  className="backdrop-blur-md bg-surface-container/60 border border-outline-variant/30 p-8 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span
                      className="material-symbols-outlined text-primary text-[32px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {v.icon}
                    </span>
                  </div>
                  <h4 className="font-headline text-lg font-bold text-on-surface mb-3">
                    {v.title}
                  </h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed font-body">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Reach */}
        <section className="py-20 px-6 md:px-32 bg-surface">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
            <div className="w-full h-[380px] rounded-3xl bg-surface-container relative flex items-center justify-center overflow-hidden border border-outline-variant/30 shadow-inner">
              <img
                className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-all duration-700"
                alt="Map of India showing Sustain's growing network of surplus rescue hubs"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbyB-ZR4Ifuz_wn5Zb9L9dKn8nupyEWLmpPtKWAvJUtpUHrip0yySKDryuXUXYE7LXINkgWTw7Zs6AlRavYbhv0ErDlkjnYi7dr2ooaaTul2Cwenpynik_0TOBNfrk4fF9L5oYztcJeDzbKCTwtaz2R7NwWysaALBsMQ3YchsAtOBpm346MORDFwg-nKo9MTZlyXTVmfPA03JTODCCX79WjSPVVkmZxCKcvxSVlQi4exkkXr8UBa9GOw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-headline font-semibold text-secondary">
                Growing city by city across India.
              </p>
              <p className="text-on-surface-variant mt-2 font-body">
                50 Cities. 1 Goal. Zero Waste.
              </p>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-24 px-6 md:px-32 text-center gradient-btn text-on-primary">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-headline font-bold">
              Join us in ending the waste-hunger gap.
            </h2>
            <Link href="/organizer">
              <button className="bg-secondary-container text-on-secondary-container px-10 py-4 rounded-full font-headline font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer mt-4">
                Join the Mission
              </button>
            </Link>
          </div>
        </section>
      </main>

      <Footer variant="landing" />
    </div>
  );
}
