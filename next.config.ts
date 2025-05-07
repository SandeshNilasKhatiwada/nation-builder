import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/nationbuilder/:path*", // Your local route
        destination: `https://sandeshnilaskhatiwada.nationbuilder.com/api/v2/:path*?access_token=${process.env.NEXT_PUBLIC_TOKEN}`, // NationBuilder API
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/api/nationbuilder/:path*", // Apply headers to the same path
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Allow all origins or set a specific domain
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS", // Allowed methods
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type", // Allowed headers
          },
        ],
      },
    ];
  },
};

export default nextConfig;
