import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Allow builds even with ESLint errors
    ignoreDuringBuilds: true,
  },
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
