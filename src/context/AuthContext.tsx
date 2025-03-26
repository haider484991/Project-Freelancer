import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { loginApi } from '../services/fitTrackApi';
import axios, { AxiosError } from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  phone: string | null;
  requestOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

interface ApiErrorResponse {
  message?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [phone, setPhone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const requestOtp = async (phoneNumber: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await loginApi.requestOtp(phoneNumber);
      setPhone(phoneNumber);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        setError(axiosError.response?.data?.message || 'Failed to send OTP');
      } else {
        setError('Failed to send OTP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (phoneNumber: string, code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginApi.verifyOtp(phoneNumber, code);
      const { token } = response.data;
      
      if (token) {
        localStorage.setItem('authToken', token);
        setIsAuthenticated(true);
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        setError(axiosError.response?.data?.message || 'Invalid verification code');
      } else {
        setError('Invalid verification code');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await loginApi.logout();
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        phone,
        requestOtp,
        verifyOtp,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 