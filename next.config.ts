import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed export mode for full Next.js functionality with backend
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Removed basePath for root deployment
  experimental: {
    serverActions: {
      allowedOrigins: ['owona.de', 'localhost:3000']
    }
  }
};

export default nextConfig;
