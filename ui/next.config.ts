import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  
  images: {
    domains: ['localhost','avatars.githubusercontent.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp']
  }
};

export default nextConfig;
