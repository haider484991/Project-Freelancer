'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className = '' }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Call the logout API endpoint
      await fetch('/api/logout', {
        method: 'POST',
      });
      
      // Clear all auth-related storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('is_logged_in');
      localStorage.removeItem('user_phone');
      localStorage.removeItem('user_id');
      
      // Clear Redux state
      dispatch(logout());
      
      // Redirect to login page
      router.push('/login');
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