"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

interface SidebarProps {
  role: "organizer" | "ngo";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const organizerLinks = [
    { name: "Dashboard", href: "/organizer", icon: "dashboard" },
    { name: "Post Food", href: "#", icon: "local_shipping" },
    { name: "My Listings", href: "#", icon: "handshake" },
    { name: "History", href: "#", icon: "analytics" },
    { name: "Settings", href: "#", icon: "settings" },
  ];

  const ngoLinks = [
    { name: "Dashboard", href: "/ngo", icon: "dashboard" },
    { name: "Active Rescues", href: "#", icon: "local_shipping" },
    { name: "Partners", href: "#", icon: "handshake" },
    { name: "Impact Analytics", href: "#", icon: "analytics" },
    { name: "Settings", href: "#", icon: "settings" },
  ];

  const links = role === "organizer" ? organizerLinks : ngoLinks;

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
          const isActive = pathname === link.href;
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
        <button className="w-full gradient-btn elevation-high text-on-primary font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-sm cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>{role === "organizer" ? "Post Surplus" : "Post New Surplus"}</span>
        </button>

        {role === "ngo" && (
          <div className="flex items-center px-2 space-x-3 py-2">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant flex-shrink-0">
              <img
                className="w-full h-full object-cover"
                alt="City Harvest Operations Lead"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxDJzZQNmCUfHooukG0c_2uxeldD4ADtcJSz7dOXZaz6kvobK2kOmO26xTZshPJfuXckJa5Sd3r08YKsNg8TMXDBhN5x7O-QsrogGMZDEnhB3oocJWgNDMLb_kIbFXIJK_kvrs8IUnPZ3VJNYs6NgUiSyEEAEpiYskx4yyO-RebStdFHBT4elvnMVz98iyup2ggwktx7AkR3MeflbG_YZkvRhB3p2dWc065BFLGmU9z085q40ASHETHA"
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-on-surface">City Harvest</p>
              <p className="text-xs text-on-surface-variant truncate">Lead Logistics</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
