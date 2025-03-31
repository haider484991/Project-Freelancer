import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { settingsApi } from '@/services/fitTrackApi';
import { parseApiResponse } from '@/utils/config';

// Define user profile interface
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  image: string;
  role: string;
  notificationCount: number;
}

// Define context type
interface UserContextType {
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  loading: boolean;
  error: string | null;
  saveProfile: () => Promise<void>;
}

// Default profile values
const defaultProfile: UserProfile = {
  name: 'Guest User',
  email: '',
  phone: '',
  image: '/images/profile.jpg',
  role: 'user',
  notificationCount: 0
};

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await settingsApi.get();
        // Use parseApiResponse to handle different response formats
        const settingsArray = parseApiResponse(response.data);
        
        if (settingsArray && settingsArray.length > 0) {
          // Find profile-related settings
          const profileSettings = settingsArray.find(
            setting => setting.type === 'profile' || setting.type === 'user'
          ) || settingsArray[0]; // Fallback to first item
          
          // Company settings may be in a different item
          const companySettings = settingsArray.find(
            setting => setting.type === 'company' || setting.type === 'company_info'
          );
          
          // Update profile with API data
          setProfile(prevProfile => ({
            ...prevProfile,
            name: profileSettings.name || companySettings?.company_name || prevProfile.name,
            email: profileSettings.email || companySettings?.email || prevProfile.email,
            phone: profileSettings.phone || companySettings?.phone || prevProfile.phone,
            image: profileSettings.image || profileSettings.logo_url || companySettings?.logo || prevProfile.image,
            role: profileSettings.role || prevProfile.role,
            notificationCount: parseInt(profileSettings.unread_notifications || '0') || prevProfile.notificationCount
          }));
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  // Update profile function
  const updateProfile = (newData: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...newData }));
  };

  // Save profile to API
  const saveProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await settingsApi.set({
        company_name: profile.name,
        email: profile.email,
        phone: profile.phone,
        logo_url: profile.image
      });
      
      // Use the parseApiResponse utility to check success status
      const responseData = parseApiResponse(response.data);
      
      if (!responseData || responseData.length === 0 || !responseData[0].success) {
        throw new Error('Failed to save profile');
      }
      
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    profile,
    updateProfile,
    loading,
    error,
    saveProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 