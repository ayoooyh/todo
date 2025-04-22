import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://lhs950204.iptime.org:8000/:path*",
      },
    ];
  },
};

export default nextConfig;
