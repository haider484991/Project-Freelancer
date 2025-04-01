"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginApi } from '@/services/fitTrackApi';
import axios, { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export default function LoginForm() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check for error in URL when component mounts
  useEffect(() => {
    // Get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    const messageParam = urlParams.get('message');
    
    // If there's an error parameter, display it
    if (errorParam === 'coach_not_found') {
      setError(messageParam || 'Coach not found. Please login again.');
      
      // Clear URL parameters without refreshing the page
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simple validation
    if (!phone) {
      setError('Please enter your phone number');
      setLoading(false);
      return;
    }
    
    // Ensure phone is clean before sending
    const cleanPhone = phone.trim();
    
    try {
      console.log('[LoginForm] Requesting OTP for phone:', cleanPhone);
      // Always send user_type when requesting OTP
      const response = await loginApi.requestOtp(cleanPhone);
      console.log('[LoginForm] OTP request response:', response.data);
      setStep('otp');
    } catch (err: unknown) {
      console.error('[LoginForm] OTP request error:', err);
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        setError(axiosError.response?.data?.message || 'Failed to send OTP');
      } else {
        setError('Failed to send OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!otp) {
      setError('Please enter the verification code');
      setLoading(false);
      return;
    }
    
    // Ensure OTP is numeric and 6 digits
    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit verification code');
      setLoading(false);
      return;
    }
    
    // Ensure phone is clean before sending
    const cleanPhone = phone.trim();
    
    try {
      console.log('[LoginForm] Verifying OTP for phone:', cleanPhone);
      const response = await loginApi.verifyOtp(cleanPhone, otp);
      console.log('[LoginForm] OTP verification response:', {
        data: response.data
      });
      
      // Check for successful login
      if (response.data.result === true) {
        console.log('[LoginForm] Login successful, preparing to navigate to dashboard');
        
        // Clear any old cookies and local storage
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "force_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "is_logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "user_phone=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "user_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        localStorage.removeItem('authToken');
        localStorage.removeItem('force_auth');
        localStorage.removeItem('tokenTimestamp');
        localStorage.removeItem('access_token');
        localStorage.removeItem('is_logged_in');
        localStorage.removeItem('user_phone');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_type');
        
        // Store the phone in both localStorage and cookies - essential for this API
        localStorage.setItem('user_phone', cleanPhone);
        document.cookie = `user_phone=${cleanPhone}; path=/; max-age=2592000; SameSite=Lax`;
        
        // Set user type to coach - required for this specific API
        localStorage.setItem('user_type', 'coach');
        document.cookie = `user_type=coach; path=/; max-age=2592000; SameSite=Lax`;
        
        // Set login state in both localStorage and cookies
        localStorage.setItem('is_logged_in', 'true');
        document.cookie = `is_logged_in=true; path=/; max-age=2592000; SameSite=Lax`;
        
        // Store access token if provided in the response
        if (response.data.access_token) {
          localStorage.setItem('access_token', response.data.access_token);
          document.cookie = `access_token=${response.data.access_token}; path=/; max-age=2592000; SameSite=Lax`;
          console.log('[LoginForm] Stored access token in both localStorage and cookie');
        } else if (response.data.message) {
          // In some APIs, the authentication token might be returned in the message field
          const possibleToken = typeof response.data.message === 'string' ? response.data.message : '';
          if (possibleToken && possibleToken.length > 10) {
            console.log('[LoginForm] Using message as access token');
            localStorage.setItem('access_token', possibleToken);
            document.cookie = `access_token=${possibleToken}; path=/; max-age=2592000; SameSite=Lax`;
          } else {
            console.warn('[LoginForm] No access token in response - using phone as token');
            localStorage.setItem('access_token', cleanPhone);
            document.cookie = `access_token=${cleanPhone}; path=/; max-age=2592000; SameSite=Lax`;
          }
        } else {
          console.warn('[LoginForm] No access token in response - using phone as token');
          localStorage.setItem('access_token', cleanPhone);
          document.cookie = `access_token=${cleanPhone}; path=/; max-age=2592000; SameSite=Lax`;
        }
        
        // Set user_id in both localStorage and cookies
        if (response.data.user_id) {
          localStorage.setItem('user_id', response.data.user_id);
          document.cookie = `user_id=${response.data.user_id}; path=/; max-age=2592000; SameSite=Lax`;
        } else {
          localStorage.setItem('user_id', cleanPhone);
          document.cookie = `user_id=${cleanPhone}; path=/; max-age=2592000; SameSite=Lax`;
        }
        
        // Use a longer delay to ensure the cookies and localStorage are set
        console.log('[LoginForm] Waiting for auth data to be set...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Final check to make sure everything was set properly
        const authCheck = {
          localStorage: {
            is_logged_in: localStorage.getItem('is_logged_in'),
            user_phone: localStorage.getItem('user_phone'),
            user_id: localStorage.getItem('user_id'),
            access_token: localStorage.getItem('access_token')
          },
          cookies: document.cookie
        };
        console.log('[LoginForm] Auth data check:', authCheck);
        
        console.log('[LoginForm] Session-based auth set up, navigating to dashboard');
        
        // Clear any existing cache before navigation
        try {
          if ('caches' in window) {
            caches.keys().then(cacheNames => {
              cacheNames.forEach(cacheName => {
                caches.delete(cacheName);
              });
            });
          }
        } catch (e) {
          console.error('Error clearing cache:', e);
        }
        
        // If we're already on dashboard page, reload it, otherwise navigate
        if (window.location.pathname.includes('/dashboard')) {
          window.location.reload();
        } else {
          // Force a hard navigation to ensure the app state is reset
          window.location.href = '/dashboard/clients';
        }
      } else {
        console.error('[LoginForm] Login failed:', response.data);
        setError(response.data.message || response.data.error || 'Login failed');
        return;
      }
    } catch (err: unknown) {
      console.error('[LoginForm] OTP verification error:', err);
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        setError(axiosError.response?.data?.message || 
                axiosError.response?.data?.error || 
                'Invalid verification code');
      } else {
        setError('Invalid verification code');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderPhoneStep = () => (
    <form onSubmit={handleRequestOtp} className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h2 className="font-manrope font-bold text-3xl sm:text-4xl text-white">Welcome Back</h2>
        <p className="font-manrope text-base sm:text-lg text-white/80">Enter your phone number to continue</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-base flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Form Fields */}
      <div className="flex flex-col gap-6">
        {/* Phone Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <span className="text-gray-500 text-lg group-focus-within:text-primary transition-colors duration-200">+</span>
          </div>
          <input 
            type="tel" 
            placeholder="Enter Your Phone Number" 
            className="w-full bg-white/90 text-black rounded-2xl pl-14 pr-6 py-4 outline-none text-base sm:text-lg font-medium transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-primary/20 placeholder-gray-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {/* Request OTP Button */}
        <button 
          type="submit"
          className="bg-primary hover:bg-primary/90 text-white rounded-2xl py-4 px-6 text-base sm:text-lg font-semibold w-full flex justify-center items-center transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/20"
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : null}
          {loading ? 'Sending Code...' : 'Continue'}
        </button>
      </div>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h2 className="font-manrope font-bold text-3xl sm:text-4xl text-white">Verify Code</h2>
        <p className="font-manrope text-base sm:text-lg text-white/80">We've sent a verification code to {phone}</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-base flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Form Fields */}
      <div className="flex flex-col gap-6">
        {/* OTP Input */}
        <div className="bg-white/90 text-black rounded-2xl px-6 py-4 flex items-center group focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
          <input 
            type="text" 
            placeholder="Enter Verification Code" 
            className="w-full bg-transparent outline-none text-base sm:text-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-primary/20 placeholder-gray-500"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>

        {/* Back Button */}
        <button 
          type="button"
          className="text-white/80 hover:text-white text-base flex items-center justify-center gap-2 group"
          onClick={() => setStep('phone')}
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform duration-200">←</span>
          Back to phone entry
        </button>

        {/* Verify OTP Button */}
        <button 
          type="submit"
          className="bg-primary hover:bg-primary/90 text-white rounded-2xl py-4 px-6 text-base sm:text-lg font-semibold w-full flex justify-center items-center transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/20"
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : null}
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Logo and Title */}
      <div className="flex flex-col gap-2">
        <h1 className="font-michael text-primary text-4xl sm:text-5xl uppercase tracking-wider font-bold">FITTRACK</h1>
        <p className="font-manrope text-base sm:text-lg text-white/80 tracking-wide">fitness & nutrition tracking</p>
      </div>

      {/* Login Form */}
      <div className="bg-black/20 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/10">
        {step === 'phone' ? renderPhoneStep() : renderOtpStep()}
      </div>
    </div>
  );
} 