import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ── Sanity CDN ─────────────────────────────────────────────────────────
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      // ── Unsplash (images de test / fallback) ───────────────────────────────
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
    ],
  },
}

export default nextConfig