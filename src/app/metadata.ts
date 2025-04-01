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
    icon: '/favicon.ico',
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