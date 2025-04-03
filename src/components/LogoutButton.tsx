'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { useTranslation } from 'react-i18next';

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className = '' }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Call the API logout endpoint using our proxy endpoint
      try {
        const response = await fetch('/api/proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mdl: 'login',
            act: 'logout',
            user_type: localStorage.getItem('user_type') || 'coach'
          }),
          credentials: 'include'
        });
        
        const data = await response.json();
        console.log('Logout API response:', data);
      } catch (apiError) {
        console.error('API logout error:', apiError);
        // Continue with local logout even if API call fails
      }
      
      // Always clear local storage and state regardless of API response
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('is_logged_in');
      localStorage.removeItem('user_phone');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_type');
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie = "is_logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "user_phone=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "PHPSESSID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Clear Redux state
      dispatch(logout() as any);
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if API call fails, still logout locally
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('is_logged_in');
      localStorage.removeItem('user_phone');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_type');
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie = "is_logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "user_phone=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "PHPSESSID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      dispatch(logout() as any);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center gap-2 justify-center rounded-[25px] px-4 py-2 text-white bg-red-600 hover:bg-red-700 transition-colors ${className}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.90002 7.56001C9.21002 3.96001 11.06 2.49001 15.11 2.49001H15.24C19.71 2.49001 21.5 4.28001 21.5 8.75001V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 12H3.62" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.85 8.6499L2.5 11.9999L5.85 15.3499" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {loading ? t('common.logging_out', 'Logging out...') : t('common.logout', 'Logout')}
    </button>
  );
} 