import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/immex",
        destination: "/servicios/comercio-exterior",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
