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

module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb',
    },
  },
}

export default nextConfig;
