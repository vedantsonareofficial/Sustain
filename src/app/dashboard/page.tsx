"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, User, Building2, MapPin, Clock, Layers, Check } from "lucide-react";

interface Listing {
  id: string;
  title: string;
  quantity: string;
  lat: number;
  lng: number;
  status: "available" | "claimed" | "picked_up";
  time: string;
}

const SEED_LISTINGS: Listing[] = [
  { id: "1", title: "Wedding Buffet Surplus", quantity: "180 portions", lat: 28.6139, lng: 77.209, status: "available", time: "12 min ago" },
  { id: "2", title: "Artisan Bread & Pastries", quantity: "75 items", lat: 40.7128, lng: -74.006, status: "claimed", time: "2 hours ago" },
  { id: "3", title: "Corporate Catering Leftovers", quantity: "120 portions", lat: 51.5074, lng: -0.1278, status: "available", time: "45 min ago" },
  { id: "4", title: "Fresh Vegetable Crate", quantity: "30 kg", lat: 35.6762, lng: 139.6503, status: "picked_up", time: "1 day ago" },
];

const STATUS_STYLES: Record<string, string> = {
  available: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
  claimed: "border-amber-500/25 bg-amber-500/10 text-amber-400",
  picked_up: "border-beige/10 bg-beige/5 text-beige/35",
};

export default function DashboardPage() {
  const [role, setRole] = useState<"organizer" | "ngo">("organizer");
  const [listings, setListings] = useState<Listing[]>(SEED_LISTINGS);
  const [title, setTitle] = useState("");
  const [qty, setQty] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !qty || !lat || !lng) return;
    setListings((prev) => [
      { id: Date.now().toString(), title, quantity: qty, lat: parseFloat(lat), lng: parseFloat(lng), status: "available", time: "Just now" },
      ...prev,
    ]);
    setTitle(""); setQty(""); setLat(""); setLng("");
  };

  const handleClaim = (id: string) => {
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: "claimed" } : l));
  };

  return (
    <div className="text-foreground">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24 space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-beige/12 pb-8"
        >
          <div>
            <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl tracking-tight">
              Rescue Matrix
            </h1>
            <p className="text-[11px] uppercase tracking-[0.25em] text-beige/40 mt-1.5">
              Internal coordination workspace
            </p>
          </div>

          <div className="flex border border-beige/20 overflow-hidden">
            <button
              onClick={() => setRole("organizer")}
              className={`px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center gap-2 transition-all duration-300 ${
                role === "organizer" ? "bg-beige text-forest" : "text-beige/40 hover:text-beige/70"
              }`}
            >
              <User size={12} /> Organizer
            </button>
            <button
              onClick={() => setRole("ngo")}
              className={`px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center gap-2 transition-all duration-300 ${
                role === "ngo" ? "bg-beige text-forest" : "text-beige/40 hover:text-beige/70"
              }`}
            >
              <Building2 size={12} /> NGO
            </button>
          </div>
        </motion.div>

        {/* ── Organizer View ── */}
        {role === "organizer" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Create Form */}
            <div className="lg:col-span-5 glass-panel p-7 md:p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-beige/10 pb-4">
                <Plus size={16} strokeWidth={1.5} />
                <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold">Log New Donation</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField label="Food Description" value={title} onChange={setTitle} placeholder="e.g. 80 boxed lunches from summit" />
                <InputField label="Quantity" value={qty} onChange={setQty} placeholder="e.g. 80 portions" />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Latitude" value={lat} onChange={setLat} placeholder="28.6139" type="number" />
                  <InputField label="Longitude" value={lng} onChange={setLng} placeholder="77.2090" type="number" />
                </div>
                <button type="submit" className="w-full py-3.5 bg-beige text-forest text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-beige-dim transition-colors mt-2">
                  Deploy Listing
                </button>
              </form>
            </div>

            {/* Listings */}
            <div className="lg:col-span-7 glass-panel p-7 md:p-8 space-y-5">
              <div className="flex items-center gap-2 border-b border-beige/10 pb-4">
                <Layers size={16} strokeWidth={1.5} />
                <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold">Active Dispatches</h2>
              </div>
              <div className="space-y-3">
                {listings.map((l) => (
                  <ListingRow key={l.id} listing={l} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── NGO View ── */}
        {role === "ngo" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="flex items-center gap-2 border-b border-beige/10 pb-4">
              <Building2 size={16} strokeWidth={1.5} />
              <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold">Available Community Dispatches</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {listings.map((l) => (
                <div key={l.id} className="glass-panel glass-panel-hover p-6 flex flex-col justify-between min-h-[180px] transition-all duration-500">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="font-[family-name:var(--font-serif)] text-lg text-beige-light">{l.title}</h3>
                      <span className={`shrink-0 px-2 py-1 text-[9px] uppercase tracking-[0.15em] font-bold border ${STATUS_STYLES[l.status]}`}>
                        {l.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-[11px] text-beige/40">
                      <span className="flex items-center gap-1"><Layers size={11} /> {l.quantity}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} /> {l.lat.toFixed(4)}, {l.lng.toFixed(4)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-beige/8 pt-3 mt-4">
                    <span className="text-[10px] text-beige/30">{l.time}</span>
                    {l.status === "available" ? (
                      <button
                        onClick={() => handleClaim(l.id)}
                        className="px-5 py-2 bg-beige text-forest text-[10px] uppercase tracking-[0.15em] font-bold hover:bg-beige-dim transition-colors"
                      >
                        Claim
                      </button>
                    ) : (
                      <span className="text-[10px] text-beige/25 flex items-center gap-1"><Check size={12} /> Claimed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ── Reusable Input ── */
function InputField({
  label, value, onChange, placeholder, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase tracking-[0.2em] text-beige/40 font-semibold">{label}</label>
      <input
        type={type}
        step={type === "number" ? "any" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-beige/[0.03] border border-beige/12 px-3.5 py-2.5 text-sm text-beige placeholder:text-beige/20 focus:outline-none focus:border-beige/35 transition-colors"
      />
    </div>
  );
}

/* ── Listing Row (Organizer View) ── */
function ListingRow({ listing }: { listing: Listing }) {
  return (
    <div className="border border-beige/8 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-beige/[0.015]">
      <div className="space-y-1">
        <h3 className="font-[family-name:var(--font-serif)] text-base text-beige-light">{listing.title}</h3>
        <div className="flex flex-wrap gap-3 text-[11px] text-beige/35">
          <span className="flex items-center gap-1"><Layers size={11} /> {listing.quantity}</span>
          <span className="flex items-center gap-1"><MapPin size={11} /> {listing.lat.toFixed(4)}, {listing.lng.toFixed(4)}</span>
          <span className="flex items-center gap-1"><Clock size={11} /> {listing.time}</span>
        </div>
      </div>
      <span className={`shrink-0 px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] font-bold border ${STATUS_STYLES[listing.status]}`}>
        {listing.status.replace("_", " ")}
      </span>
    </div>
  );
}
