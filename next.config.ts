import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dynamic authenticated pages use request-bound cookies; no shared session cache.
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};

export default nextConfig;
