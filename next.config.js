/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
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
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: app.fit-track.net;",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig 