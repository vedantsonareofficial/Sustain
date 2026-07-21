"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useTheme } from "next-themes";
import { useSearchParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { supabase } from "@/lib/supabase";
import { useAuth, isNgoProfile } from "@/components/AuthProvider";

// Matches the real surplus_listings table columns (id is int8)
interface SurplusListing {
  id: number;
  food_type: string;
  quantity: number;
  pickup_location: string;
  pickup_deadline: string;
  status: string;
  created_at: string;
}

interface ClaimWithListing {
  id: number;
  listing_id: number;
  claimed_at: string;
  pickup_status: string;
  notes: string | null;
  surplus_listings: {
    food_type: string;
    quantity: number;
    pickup_location: string;
    pickup_deadline: string;
    status: string;
  } | null;
}

interface NgoProfile {
  id: number;
  ngo_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  city: string | null;
  is_verified: boolean;
}

// ─── Dashboard View (Live Feed + Map) ───────────────────────────────────────────
function DashboardView() {
  const { authUser, profile, loading, profileReady } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const { resolvedTheme } = useTheme();
  const mapRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Real stats
  const [totalClaimed, setTotalClaimed] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [pendingRescues, setPendingRescues] = useState(0);

  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    if (!document.getElementById("leaflet-js")) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => setLeafletLoaded(true);
      document.body.appendChild(script);
    } else {
      setLeafletLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!leafletLoaded) return;
    const L = (window as any).L;
    if (!L) return;
    if (mapRef.current) mapRef.current.remove();

    const map = L.map("leaflet-map-container", {
      center: [22.9734, 78.6569],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
    });
    mapRef.current = map;

    const isDark = resolvedTheme === "dark";
    const tileUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

    const hubs = [
      { name: "Delhi", lat: 28.7041, lng: 77.1025, type: "restaurant" },
      { name: "Mumbai", lat: 19.076, lng: 72.8777, type: "restaurant" },
      { name: "Kolkata", lat: 22.5726, lng: 88.3639, type: "basket" },
      { name: "Bengaluru", lat: 12.9716, lng: 77.5946, type: "restaurant" },
      { name: "Chennai", lat: 13.0827, lng: 80.2707, type: "basket" },
    ];

    hubs.forEach((hub) => {
      const isRestaurant = hub.type === "restaurant";
      const iconHtml = `
        <div class="relative flex flex-col items-center select-none">
          ${isRestaurant ? '<div class="absolute w-8 h-8 bg-emerald-500/30 rounded-full animate-ping" style="top:0;left:0;"></div>' : ""}
          <div class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white shadow-md ${
            isRestaurant ? "bg-emerald-600" : "bg-teal-600"
          }">
            <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">${isRestaurant ? "restaurant" : "shopping_basket"}</span>
          </div>
          <span style="margin-top:2px;font-size:9px;font-weight:700;background:rgba(255,255,255,0.92);padding:1px 5px;border-radius:9999px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.15);border:1px solid rgba(16,185,129,0.2);color:#065f46;">${hub.name}</span>
        </div>
      `;
      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-icon",
        iconSize: [80, 52],
        iconAnchor: [40, 20],
      });
      L.marker([hub.lat, hub.lng], { icon: customIcon }).addTo(map);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [leafletLoaded, resolvedTheme]);

  // Fetch real NGO stats
  useEffect(() => {
    if (!profile) return;
    const fetchStats = async () => {
      const { data: claims } = await supabase
        .from("claims")
        .select("id, pickup_status, surplus_listings(quantity)")
        .eq("ngo_id", profile.id);

      if (claims) {
        setTotalClaimed(claims.length);
        const completed = claims.filter((c: any) => c.pickup_status === "completed").length;
        setTotalCompleted(completed);
        const pending = claims.filter((c: any) => c.pickup_status === "pending").length;
        setPendingRescues(pending);
      }
    };
    fetchStats();
  }, [profile]);

  // ── Real data from surplus_listings ──────────────────────────────────
  const [listings, setListings] = useState<SurplusListing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      setLoadingListings(true);
      setFetchError("");
      const { data, error } = await supabase
        .from("surplus_listings")
        .select("id, food_type, quantity, pickup_location, pickup_deadline, status, created_at")
        .eq("status", "available")
        .order("created_at", { ascending: false });

      if (error) {
        setFetchError(error.message);
      } else {
        setListings(data ?? []);
      }
      setLoadingListings(false);
    };
    fetchListings();
  }, []);

  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [claimError, setClaimError] = useState<{ id: number; msg: string } | null>(null);

  const handleClaim = async (listing: SurplusListing) => {
    if (loading || !profileReady) {
      setClaimError({ id: listing.id, msg: "Still loading your session — please wait a moment." });
      return;
    }
    if (!authUser) {
      setClaimError({ id: listing.id, msg: "Not logged in — please sign in first." });
      return;
    }
    if (!isNgoProfile(profile)) {
      setClaimError({ id: listing.id, msg: "NGO profile not found, please contact support" });
      return;
    }
    setClaimError(null);
    setClaimingId(listing.id);

    try {
      // 1. Insert into claims using ngo_id = profile.id (int8 id from AuthContext)
      const { error: claimErr } = await supabase
        .from("claims")
        .insert({
          listing_id: listing.id,
          ngo_id: profile.id,
          claimed_at: new Date().toISOString(),
          pickup_status: "pending",
          notes: `${listing.food_type} — qty ${listing.quantity} at ${listing.pickup_location}`,
        });

      if (claimErr) throw claimErr;

      // 2. After successful claims insert, UPDATE surplus_listings status = 'claimed' ONLY if status is still 'available'
      const { data: updatedListings, error: updateErr } = await supabase
        .from("surplus_listings")
        .update({ status: "claimed" })
        .eq("id", listing.id)
        .eq("status", "available")
        .select();

      if (updateErr) {
        // Rollback claim insert if update failed
        await supabase.from("claims").delete().eq("listing_id", listing.id).eq("ngo_id", profile.id);
        throw updateErr;
      }

      if (!updatedListings || updatedListings.length === 0) {
        // Double-claim prevented: listing was no longer 'available' at that moment
        await supabase.from("claims").delete().eq("listing_id", listing.id).eq("ngo_id", profile.id);
        throw new Error("Already claimed");
      }

      // 3. Remove the listing from the UI immediately without requiring a refresh
      setListings((prev) => prev.filter((l) => l.id !== listing.id));
    } catch (err: any) {
      const errMsg = err.message === "Already claimed" 
        ? "This listing has already been claimed by another organization." 
        : err.message || "Failed to claim listing.";
      setClaimError({ id: listing.id, msg: errMsg });
    } finally {
      setClaimingId(null);
    }
  };

  const filteredListings = listings.filter(
    (item) =>
      item.food_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pickup_location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="lg:ml-64 flex-grow flex flex-col lg:flex-row relative">
      {/* Left Panel: Listings */}
      <section className="w-full lg:w-[40%] h-[calc(100vh-60px)] overflow-hidden flex flex-col border-r border-outline-variant bg-surface-container-low/60">
        <header className="p-6 bg-surface shrink-0 z-20 shadow-sm border-b border-outline-variant/30">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-2xl font-headline font-bold text-primary">Live Surplus Feed</h2>
              <p className="text-xs text-on-surface-variant font-medium">Nearby pickup opportunities</p>
            </div>
            <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>
          </div>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm transition-all text-on-surface placeholder:text-on-surface-variant/50"
              placeholder="Search by location or food type..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar pb-20">
          {fetchError && (
            <div className="flex items-start gap-2 bg-error-container text-on-error-container text-xs px-4 py-3 rounded-xl border border-error/20 mx-1">
              <span className="material-symbols-outlined text-[16px] mt-0.5 flex-shrink-0">error</span>
              <span>{fetchError}</span>
            </div>
          )}

          {loadingListings && <LoadingSkeleton />}

          {!loadingListings &&
            filteredListings.map((item) => {
              const isClaiming = claimingId === item.id;
              return (
                <article
                  key={item.id}
                  className="food-card-glass p-5 rounded-2xl shadow-lg border border-white/10 hover:shadow-xl hover:-translate-y-0.5 transition-all relative z-10"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-[10px] uppercase border border-primary/20">
                      <span className="material-symbols-outlined text-[13px] mr-1">timer</span>
                      {item.pickup_deadline}
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant/60 bg-surface-container px-2 py-0.5 rounded-full">
                      #{item.id}
                    </span>
                  </div>

                  <h3 className="text-lg font-headline font-bold text-on-surface mb-1">{item.food_type}</h3>
                  <p className="text-xs text-on-surface-variant mb-4 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {item.pickup_location}
                  </p>

                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Quantity</span>
                      <span className="text-sm font-bold text-primary">{item.quantity} servings</span>
                    </div>
                    <div className="h-8 w-px bg-outline-variant/30" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Posted</span>
                      <span className="text-sm font-bold text-primary">
                        {new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => !isClaiming && handleClaim(item)}
                    disabled={isClaiming}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-all duration-250 cursor-pointer active:scale-95 ${
                      isClaiming
                        ? "bg-surface-container-highest text-on-surface-variant/70 border border-outline-variant/30"
                        : "forest-gradient-btn text-on-primary shadow-md hover:shadow-lg"
                    }`}
                  >
                    {isClaiming ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span>
                        <span>Claiming…</span>
                      </>
                    ) : (
                      <>
                        <span>Claim Pickup</span>
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </>
                    )}
                  </button>

                  {claimError?.id === item.id && (
                    <div className="flex items-center gap-2 bg-error-container text-on-error-container text-xs px-3 py-2 rounded-xl mt-2 border border-error/20">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      <span>{claimError.msg}</span>
                    </div>
                  )}
                </article>
              );
            })}

          {!loadingListings && !fetchError && filteredListings.length === 0 && (
            <EmptyState
              icon="inventory_2"
              title="No available listings"
              description={searchQuery ? "Try a different search term." : "Organizers haven't posted surplus yet. Check back soon."}
            />
          )}
        </div>
      </section>

      {/* Right Panel: Map */}
      <section className="flex-1 h-[calc(100vh-60px)] relative p-6 bg-surface-container/20">
        <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30 relative">
          <div id="leaflet-map-container" className="absolute inset-0 w-full h-full z-0" />

          <div className="absolute top-6 right-6 flex flex-col space-y-2 z-20">
            <button className="w-12 h-12 bg-surface/90 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center text-primary hover:bg-surface-container-high transition-all border border-outline-variant/30 cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">my_location</span>
            </button>
            <button className="w-12 h-12 bg-surface/90 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center text-primary hover:bg-surface-container-high transition-all border border-outline-variant/30 cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">layers</span>
            </button>
          </div>

          {/* Real Stats Overlay */}
          <div className="absolute bottom-6 left-6 right-6 pointer-events-none z-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pointer-events-auto">
              <div className="bg-surface/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-outline-variant/30">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Total Claims</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xl font-headline font-bold text-primary">{totalClaimed}</span>
                  <span className="text-secondary font-bold text-xs">pickups</span>
                </div>
              </div>

              <div className="bg-surface/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-outline-variant/30 flex flex-col justify-center">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Pending Rescues</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xl font-headline font-bold text-primary">{pendingRescues}</span>
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    local_shipping
                  </span>
                </div>
              </div>

              <div className="bg-surface/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-outline-variant/30 flex flex-col justify-center">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Completed</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xl font-headline font-bold text-primary">{totalCompleted}</span>
                  <span className="text-xs text-on-surface font-semibold">deliveries</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Active Rescues View ────────────────────────────────────────────────────────
function ActiveRescuesView() {
  const { profile } = useAuth();
  const [claims, setClaims] = useState<ClaimWithListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const fetchRescues = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("claims")
        .select("id, listing_id, claimed_at, pickup_status, notes, surplus_listings(food_type, quantity, pickup_location, pickup_deadline, status)")
        .eq("ngo_id", profile.id)
        .eq("pickup_status", "pending")
        .order("claimed_at", { ascending: false });

      setClaims((data as any) ?? []);
      setLoading(false);
    };
    fetchRescues();
  }, [profile]);

  return (
    <main className="lg:ml-64 flex-1 p-6 md:p-10">
      <h2 className="text-2xl font-headline font-bold text-primary mb-6">Active Rescues</h2>
      <p className="text-xs text-on-surface-variant font-medium mb-8">Listings you&apos;ve claimed that are awaiting pickup.</p>

      {loading ? <LoadingSkeleton /> : claims.length === 0 ? (
        <EmptyState icon="local_shipping" title="No active rescues" description="Claims with pending pickup will appear here." />
      ) : (
        <div className="space-y-4 max-w-3xl">
          {claims.map((claim) => {
            const listing = claim.surplus_listings;
            return (
              <div key={claim.id} className="glass-morphism rounded-card p-5 card-shadow border border-white/10 hover:translate-y-[-2px] transition-all duration-300">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-on-surface text-sm">{listing?.food_type || "Unknown"}</h4>
                  <span className="bg-tertiary-container text-on-tertiary-container text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full">
                    Pending Pickup
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant font-medium">
                  {listing?.quantity || 0} Servings • Deadline: {listing?.pickup_deadline || "—"}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-on-surface-variant text-xs font-medium">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  <span>{listing?.pickup_location || "—"}</span>
                </div>
                <p className="text-[10px] text-on-surface-variant mt-2">
                  Claimed: {new Date(claim.claimed_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

// ─── Partners View ──────────────────────────────────────────────────────────────
function PartnersView() {
  const { profile } = useAuth();
  const [partners, setPartners] = useState<{ organization_name: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const fetchPartners = async () => {
      setLoading(true);
      
      // Get all listings this NGO has claimed
      const { data: claims } = await supabase
        .from("claims")
        .select("listing_id")
        .eq("ngo_id", profile.id);

      if (!claims || claims.length === 0) { setPartners([]); setLoading(false); return; }

      const listingIds = claims.map((c: any) => c.listing_id);

      // Get listings and check created_by
      const { data: listings } = await supabase
        .from("surplus_listings")
        .select("created_by")
        .in("id", listingIds);

      if (!listings || listings.length === 0) { setPartners([]); setLoading(false); return; }

      const organizerIds = [...new Set(listings.map((l: any) => l.created_by).filter(Boolean))];
      if (organizerIds.length === 0) { setPartners([]); setLoading(false); return; }

      // Get organizer names
      const { data: orgs } = await supabase
        .from("organizers")
        .select("organization_name")
        .in("id", organizerIds);

      setPartners(orgs ?? []);
      setLoading(false);
    };
    fetchPartners();
  }, [profile]);

  return (
    <main className="lg:ml-64 flex-1 p-6 md:p-10">
      <h2 className="text-2xl font-headline font-bold text-primary mb-6">Partners</h2>
      <p className="text-xs text-on-surface-variant font-medium mb-8">Organizations you&apos;ve received donations from.</p>

      {loading ? <LoadingSkeleton /> : partners.length === 0 ? (
        <EmptyState icon="handshake" title="No partners yet" description="Organizers you've claimed donations from will appear here." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
          {partners.map((p, i) => (
            <div key={i} className="glass-morphism rounded-card p-5 card-shadow border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  restaurant
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-on-surface text-sm truncate">{p.organization_name || "Unknown Organizer"}</p>
                <p className="text-xs text-on-surface-variant">Food Partner</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

// ─── Impact Analytics View ──────────────────────────────────────────────────────
function AnalyticsView() {
  const { profile } = useAuth();
  const [totalMeals, setTotalMeals] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalClaims, setTotalClaims] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const fetchAnalytics = async () => {
      setLoading(true);
      const { data: claims } = await supabase
        .from("claims")
        .select("id, pickup_status, surplus_listings(quantity)")
        .eq("ngo_id", profile.id);

      if (claims) {
        setTotalClaims(claims.length);
        setTotalCompleted(claims.filter((c: any) => c.pickup_status === "completed").length);
        const meals = claims.reduce((sum: number, c: any) => {
          const qty = c.surplus_listings?.quantity || 0;
          return sum + qty;
        }, 0);
        setTotalMeals(meals);
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, [profile]);

  return (
    <main className="lg:ml-64 flex-1 p-6 md:p-10">
      <h2 className="text-2xl font-headline font-bold text-primary mb-6">Impact Analytics</h2>
      <p className="text-xs text-on-surface-variant font-medium mb-8">Your aggregate impact data from all claims.</p>

      {loading ? <LoadingSkeleton /> : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
          <div className="glass-morphism rounded-card p-6 card-shadow border border-white/10 text-center">
            <span className="material-symbols-outlined text-primary text-[36px] mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>
              restaurant
            </span>
            <p className="text-4xl font-headline font-bold text-primary">{totalMeals}</p>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mt-2">Total Meals Claimed</p>
          </div>
          <div className="glass-morphism rounded-card p-6 card-shadow border border-white/10 text-center">
            <span className="material-symbols-outlined text-primary text-[36px] mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>
              task_alt
            </span>
            <p className="text-4xl font-headline font-bold text-primary">{totalCompleted}</p>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mt-2">Pickups Completed</p>
          </div>
          <div className="glass-morphism rounded-card p-6 card-shadow border border-white/10 text-center">
            <span className="material-symbols-outlined text-primary text-[36px] mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>
              volunteer_activism
            </span>
            <p className="text-4xl font-headline font-bold text-primary">{totalClaims}</p>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mt-2">Total Claims</p>
          </div>
        </div>
      )}
    </main>
  );
}

// ─── NGO Settings View ──────────────────────────────────────────────────────────
function NgoSettingsView() {
  const { profile } = useAuth();
  const [form, setForm] = useState({ ngo_name: "", contact_email: "", contact_phone: "", city: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        ngo_name: (profile as any).ngo_name || "",
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
      .from("ngos")
      .update({
        ngo_name: form.ngo_name || null,
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

  return (
    <main className="lg:ml-64 flex-1 p-6 md:p-10">
      <h2 className="text-2xl font-headline font-bold text-primary mb-6">NGO Settings</h2>

      {loading ? <LoadingSkeleton /> : !profile ? (
        <EmptyState icon="settings" title="Profile not found" description="Could not load your NGO profile." />
      ) : (
        <div className="glass-morphism rounded-card p-6 card-shadow border border-white/10 max-w-2xl">
          {/* Verification Status */}
          <div className="mb-6">
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${
              (profile as NgoProfile).is_verified
                ? "bg-secondary-container text-on-secondary-container border-secondary/20"
                : "bg-surface-container-highest text-on-surface-variant border-outline-variant/30"
            }`}>
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {(profile as NgoProfile).is_verified ? "verified" : "pending"}
              </span>
              {(profile as NgoProfile).is_verified ? "Verified NGO" : "Pending Verification"}
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-primary mb-2">NGO Name</label>
                <input className="w-full p-4 rounded-xl input-void focus:ring-2 outline-none transition-all text-sm" value={form.ngo_name} onChange={(e) => setForm({ ...form, ngo_name: e.target.value })} />
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
      )}
    </main>
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

// ─── Empty State ────────────────────────────────────────────────────────────────
function EmptyState({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4 w-full">
      <span className="material-symbols-outlined text-5xl text-primary/30 mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
        {icon}
      </span>
      <p className="text-on-surface font-semibold text-sm mb-1">{title}</p>
      <p className="text-on-surface-variant text-xs">{description}</p>
    </div>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────────
function NgoContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "";

  switch (view) {
    case "rescues":
      return <ActiveRescuesView />;
    case "partners":
      return <PartnersView />;
    case "analytics":
      return <AnalyticsView />;
    case "settings":
      return <NgoSettingsView />;
    default:
      return <DashboardView />;
  }
}

export default function NgoDashboard() {
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
        <Sidebar role="ngo" />
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
      <Sidebar role="ngo" />

      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        <Suspense fallback={<div className="lg:ml-64 p-10"><LoadingSkeleton /></div>}>
          <NgoContent />
        </Suspense>
        <Footer variant="dashboard" />
      </div>

      <ChatWidget />
    </div>
  );
}
