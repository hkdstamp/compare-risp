/** @type {import('next').NextConfig} */
const nextConfig = {
  // AWS Amplify supports full Next.js features including API Routes
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Next.js 15 optimizations
  reactStrictMode: true,
  // Enable experimental features
  experimental: {
    // Turbopack for faster builds (optional, can be enabled in dev)
    // turbo: {},
  },
  // Performance optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // AWS Amplify configuration
  trailingSlash: true,
}

module.exports = nextConfig
