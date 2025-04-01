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
      // Only set loading true on first attempt
      if (profile.name === defaultProfile.name) {
        setLoading(true);
      }
      setError(null);
      
      // Check if user is authenticated
      const isLoggedIn = typeof window !== 'undefined' ? 
        localStorage.getItem('is_logged_in') === 'true' : false;
      const userPhone = typeof window !== 'undefined' ? 
        localStorage.getItem('user_phone') : null;
      const accessToken = typeof window !== 'undefined' ? 
        localStorage.getItem('access_token') : null;
      
      // Only log this if in dev mode
      if (process.env.NODE_ENV !== 'production') {
        console.log('[UserContext] Authentication status:', { 
          isLoggedIn, 
          hasUserPhone: !!userPhone,
          hasAccessToken: !!accessToken,
          currentProfileName: profile.name
        });
      }
      
      // Check if we need to fetch profile or if we already have it
      if (profile.name !== defaultProfile.name && profile.name !== 'Guest User') {
        console.log('[UserContext] Profile already loaded:', profile.name);
        setLoading(false);
        return;
      }
      
      // If not authenticated, don't try to fetch profile
      if (!isLoggedIn || !userPhone) {
        console.log('[UserContext] Not authenticated, skipping profile fetch');
        setLoading(false);
        return;
      }
      
      // If we have an access token and phone, try to fetch profile
      try {
        console.log('[UserContext] Attempting to fetch profile...');
        const response = await settingsApi.get();
        
        // Log the response for debugging
        console.log('[UserContext] Profile API response:', response.data);
        
        // Use parseApiResponse to handle different response formats
        const settingsArray = parseApiResponse(response.data);
        
        // Log the parsed data
        console.log('[UserContext] Parsed settings array:', settingsArray);
        
        if (settingsArray && settingsArray.length > 0) {
          // Find profile-related settings
          const profileSettings = settingsArray.find(
            (setting: any) => setting.type === 'profile' || setting.type === 'user'
          ) || settingsArray[0]; // Fallback to first item
          
          // Company settings may be in a different item
          const companySettings = settingsArray.find(
            (setting: any) => setting.type === 'company' || setting.type === 'company_info'
          );
          
          console.log('[UserContext] Found profile settings:', {
            profileSettings,
            companySettings
          });
          
          // Update profile with API data, using typeof checks for safety
          setProfile(prevProfile => ({
            ...prevProfile,
            name: typeof profileSettings.name === 'string' ? profileSettings.name : 
                 (typeof companySettings?.company_name === 'string' ? companySettings.company_name : prevProfile.name),
            email: typeof profileSettings.email === 'string' ? profileSettings.email : 
                  (typeof companySettings?.email === 'string' ? companySettings.email : prevProfile.email),
            phone: typeof profileSettings.phone === 'string' ? profileSettings.phone : 
                  (typeof companySettings?.phone === 'string' ? companySettings.phone : prevProfile.phone),
            image: typeof profileSettings.image === 'string' ? profileSettings.image : 
                  (typeof profileSettings.logo_url === 'string' ? profileSettings.logo_url : 
                  (typeof companySettings?.logo === 'string' ? companySettings.logo : prevProfile.image)),
            role: typeof profileSettings.role === 'string' ? profileSettings.role : prevProfile.role,
            notificationCount: typeof profileSettings.unread_notifications === 'string' && !isNaN(parseInt(profileSettings.unread_notifications)) ? 
                             parseInt(profileSettings.unread_notifications) : prevProfile.notificationCount
          }));
          
          console.log('[UserContext] Profile updated successfully');
        } else {
          console.log('[UserContext] No settings data found in response');
        }
      } catch (err) {
        console.error('[UserContext] Error fetching user profile:', err);
        setError('Failed to load user profile');
        
        // Don't clear login state on fetch failure - might be temporary
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [profile.name]);

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