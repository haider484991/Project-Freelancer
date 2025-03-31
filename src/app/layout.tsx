'use client'

import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Providers } from '@/store/provider'
import { Inter } from 'next/font/google'
import { Suspense, useEffect } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

const inter = Inter({ subsets: ['latin'] })

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-red-400">Something went wrong</h2>
        <p className="mb-4">We apologize for the inconvenience. Please try again or contact support if the issue persists.</p>
        <div className="p-4 bg-gray-900 rounded mb-4 overflow-auto max-h-40">
          <p className="font-mono text-xs text-red-300">{error.message}</p>
        </div>
        <button
          onClick={resetErrorBoundary}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'FitTrack App',
  description: 'Fitness and nutrition tracking application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Log errors to console for debugging
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-50">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <Providers>
              {children}
            </Providers>
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
} 