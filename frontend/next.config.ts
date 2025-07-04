import type { NextConfig } from "next";

const API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000'
    : process.env.NEXT_PUBLIC_API_URL!;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_BASE}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
