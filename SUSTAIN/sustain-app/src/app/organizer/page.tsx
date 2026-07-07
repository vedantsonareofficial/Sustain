"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

export default function OrganizerDashboard() {
  const [formState, setFormState] = useState({
    foodType: "",
    servings: "",
    timeWindow: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormState({
        foodType: "",
        servings: "",
        timeWindow: "",
        address: "",
      });

      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-sustain-pattern font-body relative w-full overflow-x-hidden">
      <Sidebar role="organizer" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        <main className="lg:ml-64 flex-1 p-6 md:p-10 max-w-full w-full">
          {/* Header */}
          <header className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-headline font-bold text-primary">Organizer Dashboard</h2>
              <p className="text-on-surface-variant text-sm mt-1">
                Managing surplus recovery for <span className="font-bold text-primary">Green Valley Catering</span>
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-on-surface-variant font-medium">Daily Impact</p>
                <p className="text-lg font-headline font-bold text-primary dark:text-primary-container">142 kg Saved</p>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-primary-fixed overflow-hidden shadow-sm flex-shrink-0">
                <img
                  className="w-full h-full object-cover"
                  alt="Catering Manager Headshot"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF8qII2CwtJWdoJtvVG9ZRPCiFOiQQ5QG1d_zHsLElEzc-7sg7rsDbCcszY6Mq9jO68sv3GjBo_Nf39bBcMDT2T8u9TMYASgCXHPZ-pjvQECn67y9j-jwr81vPTR0qBTgcx9FKfEGCOcl_bLPNf-d5SQiGHqb8rQWxbDApe29EluvqbxR35NlULskqEypk3aK3wmUNSc6WHjHrsZMyHldwiPE_nl1fiaS8mcprqUAM8VQAYiys3MzI6A"
                />
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Form */}
            <section className="col-span-1 lg:col-span-7">
              <div className="glass-morphism rounded-card p-6 card-shadow border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    inventory_2
                  </span>
                  <h3 className="text-xl font-headline font-bold text-primary">Post Surplus Food</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-primary mb-2">Food Type / Description</label>
                      <input
                        className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all placeholder:text-outline/40 text-sm"
                        placeholder="e.g. Mixed Pastries, Roast Vegetables..."
                        type="text"
                        required
                        value={formState.foodType}
                        onChange={(e) => setFormState({ ...formState, foodType: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-2">Servings (Approx.)</label>
                      <input
                        className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all placeholder:text-outline/40 text-sm"
                        placeholder="40"
                        type="number"
                        required
                        value={formState.servings}
                        onChange={(e) => setFormState({ ...formState, servings: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-2">Pickup Time Window</label>
                      <input
                        className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all placeholder:text-outline/40 text-sm"
                        placeholder="14:00 - 16:30"
                        type="text"
                        required
                        value={formState.timeWindow}
                        onChange={(e) => setFormState({ ...formState, timeWindow: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-2">Pickup Address</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                        location_on
                      </span>
                      <input
                        className="w-full p-4 pl-12 rounded-xl input-void focus:ring-2 outline-none transition-all placeholder:text-outline/40 text-sm"
                        placeholder="Main Entrance, 452 Logistics Way"
                        type="text"
                        required
                        value={formState.address}
                        onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-2">Photo Upload</label>
                    <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 flex flex-col items-center justify-center bg-surface-container/20 hover:bg-surface-container/40 transition-colors cursor-pointer group">
                      <span className="material-symbols-outlined text-primary/40 group-hover:text-primary transition-colors text-4xl mb-2">
                        add_a_photo
                      </span>
                      <p className="text-xs text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                        Tap to take or upload a photo of the food
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={isSubmitting}
                    className={`w-full text-on-primary font-bold py-4 rounded-xl text-md flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-95 duration-200 ${
                      isSuccess ? "bg-secondary" : "gradient-btn elevation-high"
                    }`}
                    type="submit"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">autorenew</span>
                        <span>Processing...</span>
                      </>
                    ) : isSuccess ? (
                      <>
                        <span className="material-symbols-outlined">check_circle</span>
                        <span>Success! Listing Live</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Surplus Listing</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </section>

            {/* Right Column: Active Listings */}
            <section className="col-span-1 lg:col-span-5 space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-headline font-bold text-primary">Active Listings</h3>
                <Link href="#" className="text-primary font-semibold text-sm hover:underline">
                  View All
                </Link>
              </div>

              {/* Listing Card 1 */}
              <div className="glass-morphism rounded-card p-4 card-shadow border border-white/10 flex items-center gap-4 group hover:translate-y-[-2px] transition-all duration-300">
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                  <img
                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all"
                    alt="Artisan Pastry Box"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOTnrc7egRKJ5gR1aWpalNV2FnzZEMeJcAD93y0xwsRtDOMix1zuokhutdij6WPmllQ37Nn4NQRzNhfJVM8cC0QZHBoPCV5o2xlt_Sp6KgjOi36pwUWw-Uc6b-xfcr7nJZc6LngkZU5vyE4PNFvohRj_RESlhe-jOXLYkXxQpwqLzMxB4cu7-XWbJxYiKdjiwxhR7RwWULNKMMEL4y76THs1BCH6tavw8dTE2a7KZduau90HmQLDJlJA"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-on-surface truncate text-sm">Artisan Pastry Box</h4>
                    <span className="bg-tertiary-container text-on-tertiary-container text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full flex-shrink-0">
                      Awaiting NGO
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium mt-1">15 Servings • Until 18:00</p>
                  <div className="mt-3 flex items-center gap-1.5 text-primary text-xs font-bold">
                    <span className="material-symbols-outlined text-[16px]">near_me</span>
                    <span>Broadcast to 12 nearby partners</span>
                  </div>
                </div>
              </div>

              {/* Listing Card 2 */}
              <div className="glass-morphism rounded-card p-4 card-shadow border border-white/10 flex items-center gap-4 group hover:translate-y-[-2px] transition-all duration-300">
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                  <img
                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all"
                    alt="Mixed Salad Platters"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbMujimF7dMT7QJKhCKfqZy6eC60dNpHZAFel1Jh8m1oDFPWTnzKO7al7d6B9ELxE3hwtgSHa34OIhW6snACUwo3VBU_IQszyf1SfhDwfM3doYJmy8BeAKFlb-kXS82uuwTlHAxSGGwHcQ7jvIaliUCYt5dpupCRhBEyX6d3PfN1Mx9uhcWNFHSmPhF38L1fkPY260TFKXAF_qyZml7K6ndEKdls5RxIODQ9y8GepWvAV5RuhstjLWDw"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-on-surface truncate text-sm">Mixed Salad Platters</h4>
                    <span className="bg-secondary-container text-on-secondary-container text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full flex-shrink-0">
                      Claimed
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium mt-1">25 Servings • Claimed by FoodFirst NGO</p>
                  <div className="mt-3 flex items-center gap-1.5 text-primary text-xs font-bold">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      local_shipping
                    </span>
                    <span>Driver arriving in 8 mins</span>
                  </div>
                </div>
              </div>

              {/* Listing Card 3 */}
              <div className="glass-morphism rounded-card p-4 card-shadow border border-white/10 flex items-center gap-4 group hover:translate-y-[-2px] transition-all duration-300">
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                  <img
                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all"
                    alt="Seasonal Fruit Crate"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFT_DxrtDnv7xf_qfOmJI_slSDNPDUBId1NQRnplpEDU3IiV5w48uT0Ptk_aJ8h_owUUr0Nj_7g7E0FY8rrICgl3LAd-KRcaZxHj8K6rPmEiEuMRW-yVV46YVf0eESspYao8w8mk7W8zhAItQ7a0vM_IVmXgmurxwKKEJ74uRtIR2A9HsxVgmnvqDnYubQeLD5KV30U_qQsMCaEloJ-jzxQMF3e0iQ2NnaAHpEV4xc2PGbybTK2G8hIw"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-on-surface truncate text-sm">Seasonal Fruit Crate</h4>
                    <span className="bg-surface-container-highest text-on-surface-variant text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full flex-shrink-0">
                      Picked Up
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium mt-1">10 kg • Completed 2h ago</p>
                  <div className="mt-3 flex items-center gap-1.5 text-on-surface-variant text-xs font-bold">
                    <span className="material-symbols-outlined text-[16px]">task_alt</span>
                    <span>Delivered to City Mission</span>
                  </div>
                </div>
              </div>

              {/* Bento-style Impact Summary */}
              <div className="gradient-btn text-on-primary rounded-card p-6 relative overflow-hidden elevation-high">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="relative z-10">
                  <h4 className="font-headline text-lg font-bold mb-1">Logistics Mastery</h4>
                  <p className="text-sm opacity-90 mb-6 text-on-primary">Your efficiency has prevented 2.4 tons of waste this year.</p>
                  <div className="flex gap-12">
                    <div>
                      <p className="text-4xl font-headline font-bold text-on-primary">98%</p>
                      <p className="text-[11px] opacity-80 font-bold uppercase tracking-wider">Claim Rate</p>
                    </div>
                    <div>
                      <p className="text-4xl font-headline font-bold text-on-primary">14m</p>
                      <p className="text-[11px] opacity-80 font-bold uppercase tracking-wider">Avg. Claim Time</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
        <Footer variant="dashboard" />
      </div>

      <ChatWidget />
    </div>
  );
}
