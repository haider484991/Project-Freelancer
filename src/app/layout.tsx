import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Providers } from '@/store/provider'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper'
import { defaultMetadata } from './metadata'

const inter = Inter({ subsets: ['latin'] })

// Export metadata as a server component
export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={inter.className}>
        <ErrorBoundaryWrapper>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <Providers>
              {children}
            </Providers>
          </Suspense>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  )
} 