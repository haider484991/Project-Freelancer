/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Remove custom output and distDir settings for Vercel compatibility
  // output: 'standalone',
  // distDir: 'dist',
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_AUTH_TOKEN_NAME: process.env.NEXT_PUBLIC_AUTH_TOKEN_NAME,
    DEBUG_MODE: process.env.DEBUG_MODE,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.fit-track.net',
      },
      {
        protocol: 'https',
        hostname: 'app.fit-track.net',
      },
      {
        protocol: 'https',
        hostname: 'bot.fit-track.net',
      }
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: app.fit-track.net bot.fit-track.net;"
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  },
}

module.exports = nextConfig 