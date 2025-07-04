import type { NextConfig } from "next";

const API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000'
    : process.env.NEXT_PUBLIC_API_URL!;

const nextConfig: NextConfig = {
  async rewrites() {
      const destination = API_BASE
      ? `${API_BASE}/api/:path*`
      : `/api/:path*`; 
    return [
      {
        source: "/api/:path*",
        destination,
      },
    ];
  },
};

export default nextConfig;
