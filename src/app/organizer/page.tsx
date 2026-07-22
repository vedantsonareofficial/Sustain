"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { supabase } from "@/lib/supabase";
import { useAuth, isOrganizerProfile, type NgoProfile } from "@/components/AuthProvider";

interface SurplusListing {
  id: number;
  food_type: string;
  quantity: number;
  pickup_location: string;
  pickup_deadline: string;
  status: string;
  created_at: string;
  event_id: number | null;
  created_by?: number | null;
}

// ─── Post Surplus Form ─────────────────────────────────────────────────────────
function PostFoodView() {
  const { authUser, profile, loading, profileReady } = useAuth();
  const [formState, setFormState] = useState({
    foodType: "",
    servings: "",
    timeWindow: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      if (loading || !profileReady) {
        throw new Error("Still loading your session — please wait a moment.");
      }
      if (!authUser) throw new Error("Not logged in — please sign in first.");
      if (!isOrganizerProfile(profile)) {
        throw new Error("Organizer profile not found, please contact support");
      }

      const organizerId = profile.id;
      const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      
      const { data: existingEvents, error: searchErr } = await supabase
        .from("events")
        .select("id")
        .eq("organizer_id", organizerId)
        .eq("event_date", todayStr)
        .limit(1);

      if (searchErr) throw searchErr;

      let eventId;
      if (existingEvents && existingEvents.length > 0) {
        eventId = existingEvents[0].id;
      } else {
        const { data: newEvent, error: createErr } = await supabase
          .from("events")
          .insert({
            organizer_id: organizerId,
            event_date: todayStr,
            location: formState.address || profile.city || "Default Location",
            status: "active"
          })
          .select("id")
          .single();

        if (createErr) throw createErr;
        eventId = newEvent.id;
      }

      // 2. Insert surplus listing linked to organizers.id via created_by (int8, not auth uuid)
      const { error } = await supabase.from("surplus_listings").insert({
        food_type: formState.foodType,
        quantity: parseInt(formState.servings, 10),
        pickup_location: formState.address,
        pickup_deadline: formState.timeWindow,
        status: "available",
        event_id: eventId,
        created_by: organizerId,
      });

      if (error) throw error;

      setIsSuccess(true);
      setFormState({ foodType: "", servings: "", timeWindow: "", address: "" });
      setTimeout(() => setIsSuccess(false), 4000);
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to submit listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || (authUser && !profileReady)) {
    return (
      <div className="glass-morphism rounded-card p-6 card-shadow border border-white/10 flex items-center justify-center py-16">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
      </div>
    );
  }

  const canPost = authUser && isOrganizerProfile(profile);

  return (
    <div className="glass-morphism rounded-card p-6 card-shadow border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          inventory_2
        </span>
        <h3 className="text-xl font-headline font-bold text-primary">Post Surplus Food</h3>
      </div>

      {!canPost && (
        <div className="flex items-start gap-2 bg-error-container text-on-error-container text-sm px-4 py-3 rounded-xl border border-error/20 mb-6">
          <span className="material-symbols-outlined text-[18px] mt-0.5 flex-shrink-0">error</span>
          <span>Organizer profile not found, please contact support</span>
        </div>
      )}

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

        {submitError && (
          <div className="flex items-start gap-2 bg-error-container text-on-error-container text-sm px-4 py-3 rounded-xl border border-error/20">
            <span className="material-symbols-outlined text-[18px] mt-0.5 flex-shrink-0">error</span>
            <span>{submitError}</span>
          </div>
        )}

        <button
          disabled={isSubmitting || !canPost}
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
  );
}

// ─── Listing Card (shared) ──────────────────────────────────────────────────────
function ListingCard({ item }: { item: SurplusListing }) {
  const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
    available: { bg: "bg-tertiary-container", text: "text-on-tertiary-container", label: "Available" },
    claimed: { bg: "bg-secondary-container", text: "text-on-secondary-container", label: "Claimed" },
    completed: { bg: "bg-surface-container-highest", text: "text-on-surface-variant", label: "Completed" },
  };
  const style = statusStyles[item.status] || statusStyles.available;

  return (
    <div className="glass-morphism rounded-card p-4 card-shadow border border-white/10 flex items-center gap-4 group hover:translate-y-[-2px] transition-all duration-300">
      <div className="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0 shadow-inner">
        <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          lunch_dining
        </span>
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-bold text-on-surface truncate text-sm">{item.food_type}</h4>
          <span className={`${style.bg} ${style.text} text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full flex-shrink-0`}>
            {style.label}
          </span>
        </div>
        <p className="text-xs text-on-surface-variant font-medium mt-1">
          {item.quantity} Servings • {item.pickup_deadline || "No deadline"}
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-on-surface-variant text-xs font-medium">
          <span className="material-symbols-outlined text-[14px]">location_on</span>
          <span className="truncate">{item.pickup_location}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ────────────────────────────────────────────────────────────────
function EmptyState({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <span className="material-symbols-outlined text-5xl text-primary/30 mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
        {icon}
      </span>
      <p className="text-on-surface font-semibold text-sm mb-1">{title}</p>
      <p className="text-on-surface-variant text-xs">{description}</p>
    </div>
  );
}

// ─── My Listings View ───────────────────────────────────────────────────────────
function MyListingsView() {
  const { profile } = useAuth();
  const [listings, setListings] = useState<SurplusListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("surplus_listings")
        .select("*")
        .eq("created_by", profile.id)
        .eq("status", "available")
        .order("created_at", { ascending: false });
      if (!error) {
        setListings(data ?? []);
      }
      setLoading(false);
    };
    fetch();
  }, [profile]);

  if (loading) return <LoadingSkeleton />;
  if (listings.length === 0) return <EmptyState icon="inventory_2" title="No active listings" description="You haven't posted any surplus food yet. Use 'Post Food' to create your first listing." />;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-headline font-bold text-primary mb-4">My Active Listings</h3>
      {listings.map((item) => <ListingCard key={item.id} item={item} />)}
    </div>
  );
}

// ─── History View ───────────────────────────────────────────────────────────────
function HistoryView() {
  const { profile } = useAuth();
  const [listings, setListings] = useState<SurplusListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("surplus_listings")
        .select("*")
        .eq("created_by", profile.id)
        .in("status", ["claimed", "completed"])
        .order("created_at", { ascending: false });
      if (!error) {
        setListings(data ?? []);
      }
      setLoading(false);
    };
    fetch();
  }, [profile]);

  if (loading) return <LoadingSkeleton />;
  if (listings.length === 0) return <EmptyState icon="history" title="No history yet" description="Listings that have been claimed or completed will appear here." />;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-headline font-bold text-primary mb-4">Claimed & Completed History</h3>
      {listings.map((item) => <ListingCard key={item.id} item={item} />)}
    </div>
  );
}

// ─── Settings View ──────────────────────────────────────────────────────────────
function SettingsView() {
  const { profile } = useAuth();
  const [form, setForm] = useState({ organization_name: "", contact_email: "", contact_phone: "", city: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        organization_name: (profile as any).organization_name || "",
        contact_email: profile.contact_email || "",
        contact_phone: profile.contact_phone || "",
        city: profile.city || "",
      });
      setLoading(false);
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSaveError("");
    setSaved(false);

    const { error } = await supabase
      .from("organizers")
      .update({
        organization_name: form.organization_name || null,
        contact_email: form.contact_email || null,
        contact_phone: form.contact_phone || null,
        city: form.city || null,
      })
      .eq("id", profile.id);

    if (error) {
      setSaveError(error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="glass-morphism rounded-card p-6 card-shadow border border-white/10 max-w-2xl">
      <h3 className="text-xl font-headline font-bold text-primary mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-[24px]">settings</span>
        Organizer Settings
      </h3>
      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-primary mb-2">Organization Name</label>
            <input className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all text-sm" value={form.organization_name} onChange={(e) => setForm({ ...form, organization_name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-2">Contact Email</label>
            <input type="email" className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all text-sm" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-2">Phone</label>
            <input type="tel" className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all text-sm" value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-2">City</label>
            <input className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all text-sm" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
        </div>

        {saveError && (
          <div className="flex items-start gap-2 bg-error-container text-on-error-container text-sm px-4 py-3 rounded-xl border border-error/20">
            <span className="material-symbols-outlined text-[18px] mt-0.5 flex-shrink-0">error</span>
            <span>{saveError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className={`w-full font-bold py-4 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
            saved ? "bg-secondary text-on-primary" : "gradient-btn elevation-high text-on-primary"
          }`}
        >
          {saving ? (
            <><span className="material-symbols-outlined animate-spin">autorenew</span><span>Saving…</span></>
          ) : saved ? (
            <><span className="material-symbols-outlined">check_circle</span><span>Saved!</span></>
          ) : (
            <><span>Save Changes</span><span className="material-symbols-outlined">save</span></>
          )}
        </button>
      </form>
    </div>
  );
}

// ─── Loading Skeleton ───────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((n) => (
        <div key={n} className="glass-morphism rounded-card p-5 border border-white/10 animate-pulse">
          <div className="h-4 bg-outline-variant/30 rounded-full w-24 mb-4" />
          <div className="h-5 bg-outline-variant/30 rounded-full w-3/4 mb-2" />
          <div className="h-3 bg-outline-variant/20 rounded-full w-1/2" />
        </div>
      ))}
    </div>
  );
}

// ─── Dashboard Default View (Post + Active Listings) ────────────────────────────
function DashboardView() {
  const { profile } = useAuth();
  const [listings, setListings] = useState<SurplusListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSaved, setTotalSaved] = useState(0);

  useEffect(() => {
    if (!profile) return;
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch active listings for this organizer
      const { data: listingsData } = await supabase
        .from("surplus_listings")
        .select("*")
        .eq("created_by", profile.id)
        .eq("status", "available")
        .order("created_at", { ascending: false })
        .limit(5);
      setListings(listingsData ?? []);

      // Compute total quantity saved (claimed + completed)
      const { data: savedData } = await supabase
        .from("surplus_listings")
        .select("quantity")
        .eq("created_by", profile.id)
        .in("status", ["claimed", "completed"]);
      const total = (savedData ?? []).reduce((sum, r) => sum + (r.quantity || 0), 0);
      setTotalSaved(total);

      setLoading(false);
    };
    fetchData();
  }, [profile]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Left Column: Form */}
      <section className="col-span-1 lg:col-span-7">
        <PostFoodView />
      </section>

      {/* Right Column: Active Listings */}
      <section className="col-span-1 lg:col-span-5 space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-headline font-bold text-primary">Active Listings</h3>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : listings.length === 0 ? (
          <EmptyState icon="inventory_2" title="No active listings" description="Post surplus food to see your listings here." />
        ) : (
          listings.map((item) => <ListingCard key={item.id} item={item} />)
        )}

        {/* Impact Summary — real data */}
        <div className="gradient-btn text-on-primary rounded-card p-6 relative overflow-hidden elevation-high">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10">
            <h4 className="font-headline text-lg font-bold mb-1">Your Impact</h4>
            <p className="text-sm opacity-90 mb-6 text-on-primary">
              {totalSaved > 0
                ? `Your listings have helped rescue ${totalSaved} servings so far.`
                : "Start posting surplus food to track your impact."}
            </p>
            <div className="flex gap-12">
              <div>
                <p className="text-4xl font-headline font-bold text-on-primary">{totalSaved}</p>
                <p className="text-[11px] opacity-80 font-bold uppercase tracking-wider">Servings Saved</p>
              </div>
              <div>
                <p className="text-4xl font-headline font-bold text-on-primary">{listings.length}</p>
                <p className="text-[11px] opacity-80 font-bold uppercase tracking-wider">Active Now</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────────
function OrganizerContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "";
  const { profile, dbUser } = useAuth();
  const [orgName, setOrgName] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setOrgName((profile as any).organization_name || null);
    }
  }, [profile]);

  const renderView = () => {
    switch (view) {
      case "post":
        return <PostFoodView />;
      case "listings":
        return <MyListingsView />;
      case "history":
        return <HistoryView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  const viewTitle = () => {
    switch (view) {
      case "post": return "Post Surplus Food";
      case "listings": return "My Listings";
      case "history": return "History";
      case "settings": return "Settings";
      default: return "Organizer Dashboard";
    }
  };

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary">{viewTitle()}</h2>
          <p className="text-on-surface-variant text-sm mt-1">
            Managing surplus recovery for{" "}
            <span className="font-bold text-primary">{orgName || dbUser?.full_name || "your organization"}</span>
          </p>
        </div>
      </header>

      {renderView()}
    </>
  );
}

export default function OrganizerDashboard() {
  const { authUser, loading, profileReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && profileReady && !authUser) {
      router.push("/login");
    }
  }, [loading, profileReady, authUser, router]);

  if (loading || (authUser && !profileReady)) {
    return (
      <div className="flex min-h-screen bg-sustain-pattern font-body relative w-full overflow-x-hidden">
        <Sidebar role="organizer" />
        <div className="flex-grow flex items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-sustain-pattern font-body relative w-full overflow-x-hidden">
      <Sidebar role="organizer" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        <main className="lg:ml-64 flex-1 p-6 md:p-10 max-w-full w-full">
          <Suspense fallback={<LoadingSkeleton />}>
            <OrganizerContent />
          </Suspense>
        </main>
        <Footer variant="dashboard" />
      </div>

      <ChatWidget />
    </div>
  );
}
