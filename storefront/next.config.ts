import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for the production Docker image (outputs a standalone server.js)
  output: "standalone",
};

export default nextConfig;
