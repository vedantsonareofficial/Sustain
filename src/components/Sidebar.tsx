"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "./AuthProvider";

interface SidebarProps {
  role: "organizer" | "ngo";
}

function SidebarContent({ role }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "";
  const { authUser, dbUser, loading, signOut } = useAuth();

  const organizerLinks = [
    { name: "Dashboard", href: "/organizer", view: "", icon: "dashboard" },
    { name: "Post Food", href: "/organizer?view=post", view: "post", icon: "local_shipping" },
    { name: "My Listings", href: "/organizer?view=listings", view: "listings", icon: "handshake" },
    { name: "History", href: "/organizer?view=history", view: "history", icon: "analytics" },
    { name: "Settings", href: "/organizer?view=settings", view: "settings", icon: "settings" },
  ];

  const ngoLinks = [
    { name: "Dashboard", href: "/ngo", view: "", icon: "dashboard" },
    { name: "Active Rescues", href: "/ngo?view=rescues", view: "rescues", icon: "local_shipping" },
    { name: "Partners", href: "/ngo?view=partners", view: "partners", icon: "handshake" },
    { name: "Impact Analytics", href: "/ngo?view=analytics", view: "analytics", icon: "analytics" },
    { name: "Settings", href: "/ngo?view=settings", view: "settings", icon: "settings" },
  ];

  const links = role === "organizer" ? organizerLinks : ngoLinks;
  const basePath = role === "organizer" ? "/organizer" : "/ngo";

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface flex flex-col p-4 space-y-2 border-r border-outline-variant z-50 shadow-md">
      <div className="mb-6 px-4 pt-4 flex items-center justify-between">
        <div>
          <Link href="/" className="text-2xl font-headline font-bold text-primary block">
            Sustain
          </Link>
          <p className="text-xs text-on-surface-variant font-medium">Logistics Portal</p>
        </div>
        <ThemeToggle />
      </div>

      <nav className="flex-grow space-y-1">
        {links.map((link) => {
          const isActive =
            pathname === basePath && currentView === link.view;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-primary-container text-on-primary-container font-bold translate-x-1"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">{link.icon}</span>
              <span className="text-sm font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-outline-variant flex flex-col gap-4">
        <Link href={role === "organizer" ? "/organizer?view=post" : "/ngo"}>
          <button className="w-full gradient-btn elevation-high text-on-primary font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-sm cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>{role === "organizer" ? "Post Surplus" : "View Listings"}</span>
          </button>
        </Link>

        {loading ? (
          <div className="h-10 bg-surface-container-high animate-pulse rounded-xl mx-2" />
        ) : authUser && dbUser ? (
          <div className="flex items-center px-2 space-x-3 py-2">
            <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
              {(dbUser.full_name || authUser.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-on-surface">{dbUser.full_name || "User"}</p>
              <p className="text-xs text-on-surface-variant truncate">{dbUser.role === "ngo" ? "NGO Partner" : "Organizer"}</p>
            </div>
            <button
              onClick={signOut}
              className="text-on-surface-variant hover:text-error transition-colors cursor-pointer p-1"
              title="Log Out"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

export function Sidebar(props: SidebarProps) {
  return (
    <Suspense fallback={<aside className="h-screen w-64 fixed left-0 top-0 bg-surface border-r border-outline-variant z-50 animate-pulse" />}>
      <SidebarContent {...props} />
    </Suspense>
  );
}
