import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Netlify deployment with @netlify/plugin-nextjs
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
