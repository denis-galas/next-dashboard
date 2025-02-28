import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'fastly.picsum.photos',
      },
    ],
  },
};

export default nextConfig;
