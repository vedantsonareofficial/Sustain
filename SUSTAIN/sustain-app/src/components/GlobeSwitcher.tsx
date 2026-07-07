"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const EarthGlobeLight = dynamic(
  () => import("@/components/EarthGlobe").then((m) => m.EarthGlobe),
  { ssr: false }
);

const EarthGlobeDark = dynamic(
  () => import("@/components/EarthGlobeDark").then((m) => m.EarthGlobeDark),
  { ssr: false }
);

export function GlobeSwitcher() {
  const { resolvedTheme } = useTheme();
  // Track mounted state to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Skeleton while theme resolves to avoid flash
    return (
      <div className="w-full h-full bg-surface-container-low/60 animate-pulse rounded-[inherit]" />
    );
  }

  return resolvedTheme === "dark" ? <EarthGlobeDark /> : <EarthGlobeLight />;
}
