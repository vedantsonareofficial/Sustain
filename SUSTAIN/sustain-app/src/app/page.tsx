"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { GlobeSwitcher } from "@/components/GlobeSwitcher";

export default function LandingPage() {
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll(".reveal-section");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-x-hidden" ref={sectionsRef}>
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 overflow-hidden bg-surface/50 backdrop-blur-[2px] w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-32 w-full">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left z-10">
              <h1 className="font-headline text-5xl md:text-[56px] text-primary mb-6 leading-[1.1] font-bold">
                Turn Surplus <br className="hidden md:block" /> Into <span className="text-secondary italic">Support</span> Across India
              </h1>
              <p className="font-body text-lg text-on-surface-variant mb-10 max-w-xl mx-auto md:mx-0">
                The ultimate logistics platform bridging the gap between corporate event surplus and community NGOs across India. Rescue meals, reduce waste, and feed thousands with precision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/organizer">
                  <button className="bg-primary text-on-primary h-[56px] px-8 rounded-xl font-headline font-semibold hover:shadow-xl dark:hover:shadow-[0_0_20px_rgba(107,251,154,0.3)] transition-all flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto cursor-pointer">
                    I'm an Organizer
                  </button>
                </Link>
                <Link href="/ngo">
                  <button className="border-2 border-outline-variant hover:border-primary text-on-surface h-[56px] px-8 rounded-xl font-headline font-semibold hover:bg-primary/5 transition-all flex items-center justify-center shadow-md w-full sm:w-auto cursor-pointer">
                    I'm an NGO
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Visual / Map Placeholder */}
            <div className="flex-1 relative w-full aspect-square md:aspect-auto">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-20 -z-0"></div>
              <div
                className="relative w-full h-[500px] bg-surface-container-low/60 backdrop-blur-sm rounded-[40px] overflow-hidden shadow-2xl border border-outline-variant/30 z-10"
                id="india-map-canvas"
              >
                <GlobeSwitcher />
                <div className="absolute bottom-6 left-6 bg-surface-container-high/70 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-outline-variant/30 max-w-[240px] z-20 pointer-events-none">
                  <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2 font-headline">Real-time Impact</p>
                  <p className="text-sm text-on-surface font-body leading-relaxed">
                    Connecting 5,000+ donation points to verified NGOs across major Indian metros.
                  </p>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary-fixed-dim/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary-fixed-dim/20 rounded-full blur-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Impact Strip */}
      <section
        className="py-16 relative reveal-section transition-all duration-700 ease-out opacity-0 translate-y-8 w-full"
        id="impact"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-32 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="backdrop-blur-md bg-surface-container/30 p-8 rounded-3xl border border-outline-variant shadow-lg flex flex-col items-center text-center group hover:-translate-y-2 hover:bg-surface-container-high transition-all duration-300">
              <span className="text-[48px] font-bold text-primary mb-2 group-hover:scale-110 transition-transform">50,000+</span>
              <p className="font-headline font-semibold text-xl text-primary dark:text-on-surface">Meals Rescued</p>
              <div className="mt-4 bg-primary/10 border border-primary/20 px-4 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                <span className="text-xs text-primary font-bold">12.5t Carbon Offset</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="backdrop-blur-md bg-surface-container/30 p-8 rounded-3xl border border-outline-variant shadow-lg flex flex-col items-center text-center group hover:-translate-y-2 hover:bg-surface-container-high transition-all duration-300">
              <span className="text-[48px] font-bold text-primary mb-2 group-hover:scale-110 transition-transform">200+</span>
              <p className="font-headline font-semibold text-xl text-primary dark:text-on-surface">NGOs Onboard</p>
              <div className="mt-4 bg-primary/10 border border-primary/20 px-4 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="text-xs text-primary font-bold">Verified Partners</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="backdrop-blur-md bg-surface-container/30 p-8 rounded-3xl border border-outline-variant shadow-lg flex flex-col items-center text-center group hover:-translate-y-2 hover:bg-surface-container-high transition-all duration-300">
              <span className="text-[48px] font-bold text-primary mb-2 group-hover:scale-110 transition-transform">1,200+</span>
              <p className="font-headline font-semibold text-xl text-primary dark:text-on-surface">Events Served</p>
              <div className="mt-4 bg-primary/10 border border-primary/20 px-4 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>celebration</span>
                <span className="text-xs text-primary font-bold">Zero Waste Events</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        className="py-20 bg-surface-container-lowest/50 backdrop-blur-sm reveal-section transition-all duration-700 ease-out opacity-0 translate-y-8 w-full"
        id="how-it-works"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-32 w-full">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl font-bold text-primary mb-4">A Seamless Three-Step Loop</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto font-medium">
              We've automated the logistics of compassion so you can focus on the event, and NGOs can focus on the people.
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-0 relative">
            {/* Step 1 */}
            <div className="flex-1 flex flex-col items-center text-center px-4 relative step-arrow">
              <div className="w-20 h-20 bg-surface-container-high rounded-2xl flex items-center justify-center mb-6 shadow-md border border-outline-variant text-primary group hover:scale-110 transition-transform duration-200">
                <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>inventory</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-primary mb-2">Post Surplus</h3>
              <p className="font-body text-sm text-on-surface-variant max-w-xs">
                Log your event details and estimated surplus in seconds via our dashboard.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex-1 flex flex-col items-center text-center px-4 relative step-arrow">
              <div className="w-20 h-20 bg-surface-container-high rounded-2xl flex items-center justify-center mb-6 shadow-md border border-outline-variant text-primary group hover:scale-110 transition-transform duration-200">
                <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>touch_app</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-primary mb-2">NGO Claims</h3>
              <p className="font-body text-sm text-on-surface-variant max-w-xs">
                Nearby verified NGOs receive a pulse notification and claim the donation instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center text-center px-4">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-md border border-primary/20 text-on-primary group hover:scale-110 transition-transform duration-200">
                <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-primary mb-2">Delivered</h3>
              <p className="font-body text-sm text-on-surface-variant max-w-xs">
                Track the real-time delivery and receive impact analytics for your ESG reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section
        className="py-20 relative reveal-section transition-all duration-700 ease-out opacity-0 translate-y-8 w-full"
        id="trust"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Quotes */}
            <div className="space-y-8">
              <h2 className="font-headline text-3xl font-bold text-primary">Voices from the Field</h2>

              <div className="bg-surface-container/40 backdrop-blur-md p-8 rounded-3xl border border-outline-variant shadow-md hover:bg-surface-container/60 transition-colors">
                <span className="material-symbols-outlined text-primary text-[40px] mb-4">format_quote</span>
                <p className="font-body text-lg italic text-on-surface mb-6 leading-relaxed">
                  "FoodBridge changed our catering operations completely. We no longer feel the guilt of waste; we see the data of our impact."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-outline-variant/40">
                    <img
                      className="w-full h-full object-cover"
                      alt="Sarah Jenkins Portrait"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDR1R_wmpjxElg0p8KCzvKrNuHwPLrz8nJV5Zfa7FI--BFA1ubrbRfrITsqDRuu2e5QJ35Y94SJ5kYPA98cuEi_zs4g0kjRTlSbInAAXOdXFN4BHf9YcgIWZqoJ0fDb9Xi0zIb9hKdbVwkrBCYfozFwqFXyCacH4HoJpMpwAXgv5_C9A1IP2VYVLkDmjNj5c5xgQRt0e6YKoaWQAK2JdJU9iPSJWqZfD7YJ-vxEdxGqhSPhv7hUy3eaTw"
                    />
                  </div>
                  <div>
                    <p className="font-headline font-bold text-sm text-primary">Sarah Jenkins</p>
                    <p className="text-xs text-on-surface-variant font-semibold">Senior Event Lead, TechGlobal</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container/40 backdrop-blur-md p-8 rounded-3xl border border-outline-variant shadow-md hover:bg-surface-container/60 transition-colors">
                <span className="material-symbols-outlined text-primary text-[40px] mb-4">format_quote</span>
                <p className="font-body text-lg italic text-on-surface mb-6 leading-relaxed">
                  "The predictability of FoodBridge allows our community kitchen to plan meals days in advance. It's a logistics miracle."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-outline-variant/40">
                    <img
                      className="w-full h-full object-cover"
                      alt="Marcus Thorne Portrait"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6KDXzJzTM742PNgCqnemi6cFEYOiSYcQm6KomUcQxKNr3GP-R9qHeU34C_HpIj5SobI9pb90g8aY-DMRHRgjOPtKFzS2EyatYmsW2buMtQ73EaiQaqFpwhhW7MVWofQXoD3AGcdAerBoWgfLBj2niyPKDMSIWAWRlNZ7QzkwVIC4VCfbnSmDfTs8tjSJCxqyhmCgyEMhHlO8QfsWWK5qYQhF1c-Vbpar529ci1RJx09PJDI4Z1UnYyw"
                    />
                  </div>
                  <div>
                    <p className="font-headline font-bold text-sm text-primary">Marcus Thorne</p>
                    <p className="text-xs text-on-surface-variant font-semibold">Director, City Harvest Partners</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-surface-container-low/40 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-4 group hover:bg-surface-variant transition-all duration-300 shadow-md border border-outline-variant/30">
                <span className="material-symbols-outlined text-[48px] text-primary group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>policy</span>
                <p className="font-headline text-sm text-on-surface font-bold">Strict Health Compliance</p>
              </div>

              <div className="aspect-square bg-surface-container-low/40 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-4 group hover:bg-surface-variant transition-all duration-300 shadow-lg border border-outline-variant/30 -translate-y-2">
                <span className="material-symbols-outlined text-[48px] text-primary group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <p className="font-headline text-sm text-on-surface font-bold">NGO Vetting System</p>
              </div>

              <div className="aspect-square bg-surface-container-low/40 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-4 group hover:bg-surface-variant transition-all duration-300 shadow-sm border border-outline-variant/30 translate-y-2">
                <span className="material-symbols-outlined text-[48px] text-primary group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>bar_chart</span>
                <p className="font-headline text-sm text-on-surface font-bold">ESG-Ready Analytics</p>
              </div>

              <div className="aspect-square bg-surface-container-low/40 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-4 group hover:bg-surface-variant transition-all duration-300 shadow-xl border border-outline-variant/30 -translate-y-4">
                <span className="material-symbols-outlined text-[48px] text-primary group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                <p className="font-headline text-sm text-on-surface font-bold">Secure Chain of Custody</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="landing" />
      <ChatWidget />
    </div>
  );
}
