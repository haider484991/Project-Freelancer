'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import Image from 'next/image'

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in - need to use try/catch for localStorage in case of SSR
    try {
      const hasToken = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (hasToken) {
        // If they have a token, redirect to dashboard
        router.push('/dashboard');
      } else {
        // Otherwise redirect to login
        router.push('/login');
      }
    } catch (error) {
      // Handle any errors with localStorage (e.g., SSR context)
      router.push('/login');
    }
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-primary">
      <div className="animate-pulse text-white text-xl">
        Redirecting...
      </div>
    </div>
  );
} 