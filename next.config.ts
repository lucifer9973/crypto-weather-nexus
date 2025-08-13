import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'siliconcanals.com',
      'hackernoon.imgix.net',
      'cdn.example.com', // add any future ones here
    ],
  },
};

export default nextConfig;
