"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, type NgoProfile } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const { authUser, dbUser, profile, loading, profileReady, signOut } = useAuth();
  
  const [fullName, setFullName] = useState("");
  const [orgOrNgoName, setOrgOrNgoName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [city, setCity] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (dbUser) {
      setFullName(dbUser.full_name || "");
    }
    if (profile) {
      const name = "organization_name" in profile 
        ? profile.organization_name 
        : "ngo_name" in profile 
          ? profile.ngo_name 
          : "";
      setOrgOrNgoName(name || "");
      setContactEmail(profile.contact_email || "");
      setContactPhone(profile.contact_phone || "");
      setCity(profile.city || "");
    }
  }, [dbUser, profile]);

  if (loading || (authUser && !profileReady)) {
    return (
      <div className="min-h-screen bg-sustain-pattern font-body">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-sustain-pattern font-body">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-32 px-4 text-center">
          <span className="material-symbols-outlined text-5xl text-primary/30 mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
            lock
          </span>
          <h2 className="text-xl font-headline font-bold text-on-surface mb-2">Not Signed In</h2>
          <p className="text-on-surface-variant text-sm mb-6">Please sign in to view your account.</p>
          <Link href="/login">
            <button className="gradient-btn text-on-primary font-bold py-3 px-8 rounded-xl text-sm cursor-pointer">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!dbUser) {
    return (
      <div className="min-h-screen bg-sustain-pattern font-body">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-32 px-4 text-center">
          <span className="material-symbols-outlined text-5xl text-primary/30 mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
            error
          </span>
          <h2 className="text-xl font-headline font-bold text-on-surface mb-2">Profile Not Found</h2>
          <p className="text-on-surface-variant text-sm mb-6">You are signed in but your profile could not be loaded. Please contact support or try signing out and back in.</p>
        </div>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaved(false);

    try {
      if (!dbUser || !profile) throw new Error("Not logged in");

      // 1. Update user full name
      const { error: userErr } = await supabase
        .from("users")
        .update({ full_name: fullName })
        .eq("id", dbUser.id);
      if (userErr) throw userErr;

      // 2. Update organizer or NGO profile
      if (dbUser.role === "organizer") {
        const { error: orgErr } = await supabase
          .from("organizers")
          .update({
            organization_name: orgOrNgoName || null,
            contact_email: contactEmail || null,
            contact_phone: contactPhone || null,
            city: city || null,
          })
          .eq("id", profile.id);
        if (orgErr) throw orgErr;
      } else {
        const { error: ngoErr } = await supabase
          .from("ngos")
          .update({
            ngo_name: orgOrNgoName || null,
            contact_email: contactEmail || null,
            contact_phone: contactPhone || null,
            city: city || null,
          })
          .eq("id", profile.id);
        if (ngoErr) throw ngoErr;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  const initials = (fullName || authUser.email || "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-sustain-pattern font-body">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 pt-32 pb-16">
        <h1 className="text-3xl font-headline font-bold text-primary mb-8">My Account</h1>

        <div className="glass-morphism rounded-card p-8 card-shadow border border-white/10 space-y-6">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-2xl shadow-md">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-headline font-bold text-on-surface">{fullName || "—"}</h2>
              <p className="text-sm text-on-surface-variant">{authUser.email}</p>
              <span className="inline-block mt-1 text-[10px] uppercase font-extrabold tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                {dbUser.role === "ngo" ? "NGO / Partner" : "Food Organizer"}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="border-t border-outline-variant/20 pt-6">
              <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">person</span>
                Profile Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-2">Full Name</label>
                  <input
                    className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all text-sm"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary mb-2">Email Address</label>
                  <input
                    className="w-full p-4 rounded-xl input-void bg-surface-container/50 text-on-surface-variant text-sm cursor-not-allowed"
                    value={authUser.email || ""}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-outline-variant/20 pt-6">
              <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  {dbUser.role === "organizer" ? "restaurant" : "diversity_3"}
                </span>
                {dbUser.role === "organizer" ? "Organizer Details" : "NGO Details"}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-2">
                    {dbUser.role === "organizer" ? "Organization Name" : "NGO Name"}
                  </label>
                  <input
                    className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all text-sm"
                    value={orgOrNgoName}
                    onChange={(e) => setOrgOrNgoName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary mb-2">Contact Email</label>
                  <input
                    type="email"
                    className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all text-sm"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary mb-2">Contact Phone</label>
                  <input
                    className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all text-sm"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary mb-2">City</label>
                  <input
                    className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all text-sm"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                {dbUser.role === "ngo" && profile && (
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-2">Verification Status</label>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${
                      (profile as NgoProfile).is_verified
                        ? "bg-secondary-container text-on-secondary-container border-secondary/20"
                        : "bg-surface-container-highest text-on-surface-variant border-outline-variant/30"
                    }`}>
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {(profile as NgoProfile).is_verified ? "verified" : "pending"}
                      </span>
                      {(profile as NgoProfile).is_verified ? "Verified" : "Pending Verification"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {saveError && (
              <div className="flex items-start gap-2 bg-error-container text-on-error-container text-sm px-4 py-3 rounded-xl border border-error/20">
                <span className="material-symbols-outlined text-[18px] mt-0.5 flex-shrink-0">error</span>
                <span>{saveError}</span>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-outline-variant/20 pt-6">
              <button
                type="submit"
                disabled={saving}
                className={`font-bold py-3 px-8 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                  saved ? "bg-secondary text-on-primary" : "gradient-btn text-on-primary shadow-md"
                }`}
              >
                {saving ? (
                  <><span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span><span>Saving Changes…</span></>
                ) : saved ? (
                  <><span className="material-symbols-outlined text-[18px]">check_circle</span><span>Changes Saved!</span></>
                ) : (
                  <><span>Save Changes</span><span className="material-symbols-outlined text-[18px]">save</span></>
                )}
              </button>

              <button
                type="button"
                onClick={signOut}
                className="flex items-center gap-2 text-error hover:bg-error-container/30 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Log Out
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
