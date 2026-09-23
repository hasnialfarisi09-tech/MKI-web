import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Compress output HTML/JS/CSS
  compress: true,
  images: {
    // Static export requires unoptimized: true for next/image
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  // LAN / tunnel origins allowed to hit the dev server (HMR, RSC) cross-origin.
  allowedDevOrigins: [
    "192.168.1.51", // current Wi-Fi LAN IP
    "192.168.1.*", // rest of the LAN subnet (survives DHCP changes)
    "100.105.166.15", // Tailscale
    "localhost",
    "127.0.0.1",
  ],
  // Tree-shake icon/animation libraries — eliminates unused exports
  experimental: {
    optimizePackageImports: ["@tabler/icons-react", "motion"],
  },
};

export default nextConfig;
