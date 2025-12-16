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
  
  // Workspace root設定（複数lockfile警告対策）
  outputFileTracingRoot: require('path').join(__dirname),

  // 開発サーバーのポート設定
  ...(process.env.NODE_ENV === 'development' && {
    env: {
      PORT: '3012',
    },
  }),

  // iframe埋め込み対応: Content-Security-Policyでframe-ancestorsを設定
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // iframe埋め込みを許可
            value: process.env.NODE_ENV === 'development'
              ? "frame-ancestors 'self' http://localhost:* https://localhost:*"
              : "frame-ancestors 'self' https://your-company.com https://*.your-company.com",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
