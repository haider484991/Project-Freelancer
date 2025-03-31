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
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_JWT_SECRET: process.env.REACT_APP_JWT_SECRET,
    REACT_APP_DEFAULT_LANGUAGE: process.env.REACT_APP_DEFAULT_LANGUAGE || 'en',
  },
  i18n: {
    locales: ['en', 'he'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  images: {
    domains: ['app.fit-track.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.fit-track.net',
      },
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: app.fit-track.net;"
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