"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginApi } from '@/services/fitTrackApi';
import axios, { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
}

export default function LoginForm() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    
    try {
      await loginApi.requestOtp(phone);
      setStep('otp');
    } catch (err: unknown) {
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
    
    try {
      const response = await loginApi.verifyOtp(phone, otp);
      const { token } = response.data;
      
      if (token) {
        // Store token in both places for compatibility
        localStorage.setItem('authToken', token);
        localStorage.setItem('token', token);
        router.push('/dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        setError(axiosError.response?.data?.message || 'Invalid verification code');
      } else {
        setError('Invalid verification code');
      }
    } finally {
      setLoading(false);
    }
  };

  // Skip login and go directly to dashboard (test mode)
  const handleSkipLogin = () => {
    // Set test token in both places for compatibility
    localStorage.setItem('authToken', 'test_token_123');
    localStorage.setItem('token', 'test_token_123');
    router.push('/dashboard');
  };

  const renderPhoneStep = () => (
    <form onSubmit={handleRequestOtp} className="flex flex-col gap-[40px] lg:gap-[62px]">
        {/* Header */}
        <div className="flex flex-col gap-[6px] lg:gap-[6.21px]">
          <h2 className="font-manrope font-bold text-[32px] lg:text-[40px] text-white leading-[44px] lg:leading-[55px]">Login</h2>
        <p className="font-manrope font-medium text-[16px] lg:text-[20px] text-white leading-[22px] lg:leading-[27px]">Login with your phone number</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 text-red-500 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="flex flex-col gap-[40px] lg:gap-[50px]">
          <div className="flex flex-col gap-[20px] lg:gap-[25px] w-full">
          {/* Phone Input */}
            <div className="bg-white text-black rounded-[60px] px-[25px] lg:px-[29px] py-[16px] lg:py-[20px] flex items-center">
              <input 
              type="tel" 
              placeholder="Enter Your Phone Number" 
                className="w-full bg-transparent outline-none text-black text-[16px] lg:text-[18px] font-medium leading-[22px] lg:leading-[25px]"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

          {/* Request OTP Button */}
          <button 
            type="submit"
            className="bg-primary text-white rounded-[60px] py-[16px] lg:py-[20px] px-[25px] lg:px-[29px] text-[16px] lg:text-[18px] font-semibold w-full mt-[25px] lg:mt-[35px] flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : null}
            {loading ? 'Sending Code...' : 'Send Verification Code'}
          </button>

          {/* Test Mode Button */}
          <button 
            type="button"
            onClick={handleSkipLogin}
            className="bg-yellow-500 text-white rounded-[60px] py-[16px] lg:py-[20px] px-[25px] lg:px-[29px] text-[16px] lg:text-[18px] font-semibold w-full mt-[10px] flex justify-center items-center"
          >
            Skip Login (Test Mode)
          </button>
        </div>
      </div>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-[40px] lg:gap-[62px]">
      {/* Header */}
      <div className="flex flex-col gap-[6px] lg:gap-[6.21px]">
        <h2 className="font-manrope font-bold text-[32px] lg:text-[40px] text-white leading-[44px] lg:leading-[55px]">Verify OTP</h2>
        <p className="font-manrope font-medium text-[16px] lg:text-[20px] text-white leading-[22px] lg:leading-[27px]">Enter the verification code sent to {phone}</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500/20 text-red-500 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Form Fields */}
      <div className="flex flex-col gap-[40px] lg:gap-[50px]">
        <div className="flex flex-col gap-[20px] lg:gap-[25px] w-full">
          {/* OTP Input */}
          <div className="bg-white text-black rounded-[60px] px-[25px] lg:px-[29px] py-[16px] lg:py-[20px] flex items-center">
                <input 
              type="text" 
              placeholder="Enter Verification Code" 
                  className="w-full bg-transparent outline-none text-black text-[16px] lg:text-[18px] font-medium leading-[22px] lg:leading-[25px]"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
                  required
                />
          </div>

          {/* Back Button */}
                <button 
                  type="button"
            className="text-white text-center"
            onClick={() => setStep('phone')}
          >
            Back to phone entry
                </button>

          {/* Verify OTP Button */}
            <button 
              type="submit"
              className="bg-primary text-white rounded-[60px] py-[16px] lg:py-[20px] px-[25px] lg:px-[29px] text-[16px] lg:text-[18px] font-semibold w-full mt-[25px] lg:mt-[35px] flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : null}
            {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

          {/* Test Mode Button */}
          <button 
            type="button"
            onClick={handleSkipLogin}
            className="bg-yellow-500 text-white rounded-[60px] py-[16px] lg:py-[20px] px-[25px] lg:px-[29px] text-[16px] lg:text-[18px] font-semibold w-full mt-[10px] flex justify-center items-center"
          >
            Skip Login (Test Mode)
              </button>
            </div>
          </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-[40px] lg:gap-[76px] w-full">
      {/* Logo and Title */}
      <div className="flex flex-col gap-[5px]">
        <h1 className="font-michael text-primary text-[45px] lg:text-[55px] uppercase tracking-[0.04em] leading-none font-bold shadow-text">FITTRACK</h1>
        <p className="font-manrope font-semibold text-[16px] lg:text-[20px] text-white tracking-[0.04em] capitalize shadow-text">fitness & nutrition tracking</p>
      </div>

      {/* Login Form - With background to improve visibility */}
      <div className="bg-black/30 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
        {step === 'phone' ? renderPhoneStep() : renderOtpStep()}
      </div>
      
      {/* Custom styles for text shadow */}
      <style jsx global>{`
        .shadow-text {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
} 