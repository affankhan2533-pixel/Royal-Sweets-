import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  turbopack: {},
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
