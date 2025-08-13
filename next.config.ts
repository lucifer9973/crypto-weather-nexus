import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "openweathermap.org",
      "hackernoon.imgix.net",
      "siliconcanals.com",
      "crypto.com",
      "assets.coingecko.com",
      "images.unsplash.com",
      "cdn.cnn.com",
      "ichef.bbci.co.uk",
      "static01.nyt.com"
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
