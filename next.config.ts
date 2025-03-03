module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb',
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: 'fastly.picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'fegtal1w2kr8na9u.public.blob.vercel-storage.com',
        pathname: '/customers/**',
      }
    ],
  },
}