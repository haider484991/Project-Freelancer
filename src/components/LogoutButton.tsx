'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginApi } from '@/services/fitTrackApi';

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className = '' }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await loginApi.logout();
      // Redirect to login page
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center justify-center rounded-md px-4 py-2 text-white bg-red-600 hover:bg-red-700 transition-colors ${className}`}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
} 