import type { Metadata, Viewport } from 'next';

// Default metadata for the application
export const defaultMetadata: Metadata = {
  title: {
    template: '%s | FitTrack App',
    default: 'FitTrack App',
  },
  description: 'Fitness and nutrition tracking application',
  keywords: ['fitness', 'tracking', 'nutrition', 'health', 'workout'],
  authors: [{ name: 'FitTrack Team' }],
  creator: 'FitTrack',
  applicationName: 'FitTrack',
  icons: {
    icon: [
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    other: [
      { url: '/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#13A753',
};

// Generate metadata for specific pages
export function generateMetadata(
  params: { title?: string; description?: string } = {}
): Metadata {
  return {
    ...defaultMetadata,
    title: params.title || defaultMetadata.title,
    description: params.description || defaultMetadata.description,
  };
} 