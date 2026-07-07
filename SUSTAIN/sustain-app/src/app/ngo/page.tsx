"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

interface FoodListing {
  id: string;
  title: string;
  location: string;
  timeLeft: string;
  distance: string;
  quantity: string;
  weight: string;
  critical?: boolean;
}

export default function NgoDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { resolvedTheme } = useTheme();
  const mapRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    // Load Leaflet resources dynamically if not already loaded
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

    if (mapRef.current) {
      mapRef.current.remove();
    }

    const map = L.map("leaflet-map-container", {
      center: [22.9734, 78.6569], // Central India
      zoom: 5,
      zoomControl: false,
      attributionControl: false
    });
    mapRef.current = map;

    // Use CartoDB Voyager (light) or Dark Matter (dark) tiles
    const isDark = resolvedTheme === "dark";
    const tileUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    L.tileLayer(tileUrl, {
      maxZoom: 19,
    }).addTo(map);

    const hubs = [
      { name: "Delhi", lat: 28.7041, lng: 77.1025, type: "restaurant" },
      { name: "Mumbai", lat: 19.0760, lng: 72.8777, type: "restaurant" },
      { name: "Kolkata", lat: 22.5726, lng: 88.3639, type: "basket" },
      { name: "Bengaluru", lat: 12.9716, lng: 77.5946, type: "restaurant" },
      { name: "Chennai", lat: 13.0827, lng: 80.2707, type: "basket" }
    ];

    hubs.forEach((hub) => {
      const isRestaurant = hub.type === "restaurant";
      const iconHtml = `
        <div class="relative flex flex-col items-center select-none" style="transform: translate(-50%, -50%);">
          ${isRestaurant ? '<div class="absolute w-8 h-8 bg-emerald-500/30 rounded-full animate-ping"></div>' : ''}
          <div class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white shadow-md ${
            isRestaurant ? 'bg-emerald-600' : 'bg-teal-600'
          }">
            <span class="material-symbols-outlined text-[16px]">${isRestaurant ? 'restaurant' : 'shopping_basket'}</span>
          </div>
          <span class="mt-1 text-[9px] font-bold text-emerald-800 dark:text-emerald-300 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full shadow-sm border border-emerald-500/20 whitespace-nowrap">${hub.name}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-icon",
        iconSize: [0, 0],
        iconAnchor: [0, 0]
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

  const [listings, setListings] = useState<FoodListing[]>([
    {
      id: "1",
      title: "Assorted Fresh Produce",
      location: "Port Authority Market • Grade A",
      timeLeft: "45m left",
      distance: "2.5km away",
      quantity: "For 150 people",
      weight: "~75kg",
    },
    {
      id: "2",
      title: "Artisan Breads & Pastries",
      location: "Bakery Corner • Downtown",
      timeLeft: "12m left",
      distance: "0.8km away",
      quantity: "For 60 people",
      weight: "~20kg",
      critical: true,
    },
    {
      id: "3",
      title: "Catered Lunch Platters",
      location: "Tech-Core Corporate Hub",
      timeLeft: "2h 15m left",
      distance: "4.2km away",
      quantity: "For 200 people",
      weight: "~110kg",
    },
  ]);

  const [claimedListings, setClaimedListings] = useState<string[]>([]);

  const handleClaim = (id: string) => {
    setClaimedListings((prev) => [...prev, id]);
  };

  const filteredListings = listings.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-sustain-pattern font-body relative w-full overflow-x-hidden">
      <Sidebar role="ngo" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        <main className="lg:ml-64 flex-grow flex flex-col lg:flex-row relative">
          
          {/* Left Panel: Listings (40%) */}
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

              {/* Search Bar */}
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

            {/* Scrollable Feed List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar pb-20">
              {filteredListings.map((item) => {
                const isClaimed = claimedListings.includes(item.id);
                return (
                  <article
                    key={item.id}
                    className="food-card-glass p-5 rounded-2xl shadow-lg border border-white/10 hover:shadow-xl hover:-translate-y-0.5 transition-all relative z-10"
                  >
                    <div className="flex justify-between items-start mb-3">
                      {item.critical ? (
                        <div className="flex items-center bg-error-container text-on-error-container font-extrabold px-3 py-1 rounded-full text-[10px] uppercase border border-error/20 pulse-soft">
                          <span className="material-symbols-outlined text-[13px] mr-1">warning</span>
                          {item.timeLeft}
                        </div>
                      ) : (
                        <div className="flex items-center bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-[10px] uppercase border border-primary/20">
                          <span className="material-symbols-outlined text-[13px] mr-1">timer</span>
                          {item.timeLeft}
                        </div>
                      )}
                      <span className="text-xs font-bold text-on-surface-variant">{item.distance}</span>
                    </div>

                    <h3 className="text-lg font-headline font-bold text-on-surface mb-1">{item.title}</h3>
                    <p className="text-xs text-on-surface-variant mb-4 font-medium">{item.location}</p>

                    <div className="flex items-center space-x-6 mb-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Quantity</span>
                        <span className="text-sm font-bold text-primary">{item.quantity}</span>
                      </div>
                      <div className="h-8 w-px bg-outline-variant/30"></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Weight</span>
                        <span className="text-sm font-bold text-primary">{item.weight}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => !isClaimed && handleClaim(item.id)}
                      disabled={isClaimed}
                      className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-all duration-250 cursor-pointer active:scale-95 ${
                        isClaimed
                          ? "bg-surface-container-highest text-on-surface-variant/70 border border-outline-variant/30"
                          : "forest-gradient-btn text-on-primary shadow-md hover:shadow-lg"
                      }`}
                    >
                      <span>{isClaimed ? "Pickup Claimed" : "Claim Pickup"}</span>
                      {!isClaimed && <span className="material-symbols-outlined text-[18px]">chevron_right</span>}
                    </button>
                  </article>
                );
              })}
              {filteredListings.length === 0 && (
                <div className="text-center p-8 text-on-surface-variant font-medium text-sm">
                  No listings found matching your search.
                </div>
              )}
            </div>
          </section>

          {/* Right Panel: Map (60%) */}
          <section className="flex-1 h-[calc(100vh-60px)] relative p-6 bg-surface-container/20">
            <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30 relative">
              
              {/* Leaflet map container */}
              <div id="leaflet-map-container" className="absolute inset-0 w-full h-full z-0" />

              {/* Floating Map Controls */}
              <div className="absolute top-6 right-6 flex flex-col space-y-2 z-20">
                <button className="w-12 h-12 bg-surface/90 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center text-primary hover:bg-surface-container-high transition-all border border-outline-variant/30 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">my_location</span>
                </button>
                <button className="w-12 h-12 bg-surface/90 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center text-primary hover:bg-surface-container-high transition-all border border-outline-variant/30 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">layers</span>
                </button>
              </div>

              {/* Active Rescue Stats Overlay */}
              <div className="absolute bottom-6 left-6 right-6 pointer-events-none z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pointer-events-auto">
                  <div className="bg-surface/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-outline-variant/30">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Today's Goal</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xl font-headline font-bold text-primary">1,250 kg</span>
                      <span className="text-secondary font-bold text-xs">82%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-high rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(107,251,154,0.5)]" style={{ width: "82%" }}></div>
                    </div>
                  </div>

                  <div className="bg-surface/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-outline-variant/30 flex flex-col justify-center">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Active Vehicles</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xl font-headline font-bold text-primary">4</span>
                      <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        local_shipping
                      </span>
                    </div>
                  </div>

                  <div className="bg-surface/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-outline-variant/30 flex flex-col justify-center">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Estimated Impact</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xl font-headline font-bold text-primary">3,842</span>
                      <span className="text-xs text-on-surface font-semibold">meals today</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

        </main>
        <Footer variant="dashboard" />
      </div>

      <ChatWidget />
    </div>
  );
}
