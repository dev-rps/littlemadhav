import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    // serverComponentsExternalPackages is now serverExternalPackages in Next 15
  },
  serverExternalPackages: ["@prisma/adapter-better-sqlite3", "better-sqlite3", "@prisma/client"],
};

export default nextConfig;
