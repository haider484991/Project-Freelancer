/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  env: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_JWT_SECRET: process.env.REACT_APP_JWT_SECRET,
    REACT_APP_DEFAULT_LANGUAGE: process.env.REACT_APP_DEFAULT_LANGUAGE || 'en',
  },
  i18n: {
    locales: ['en', 'he'],
    defaultLocale: 'en',
    localeDetection: true,
  },
}

module.exports = nextConfig 