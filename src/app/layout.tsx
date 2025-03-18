import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Providers } from '@/store/provider'

export const metadata: Metadata = {
  title: 'FITTrack - Fitness & Nutrition Tracking',
  description: 'Track your fitness and nutrition goals with FITTrack',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 