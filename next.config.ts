import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: "/command", destination: "/command-center.html", permanent: false }];
  }
};

export default nextConfig;
