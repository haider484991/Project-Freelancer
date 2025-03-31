'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { settingsApi } from '@/services/fitTrackApi'
import { parseApiResponse } from '@/utils/config'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

// Define types for API responses
interface ApiSettings {
  company_name: string;
  email: string;
  phone: string;
  name: string;
  [key: string]: unknown;
}

export default function SettingsPage() {
  const { t } = useTranslation()
  const [apiSettings, setApiSettings] = useState<ApiSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try to fetch settings using the settings module
        try {
          const settingsResponse = await settingsApi.get()
          console.log('Settings API response:', settingsResponse);
          
          if (settingsResponse?.data?.result === true && Array.isArray(settingsResponse?.data?.message)) {
            if (settingsResponse.data.message.length > 0) {
              setApiSettings(settingsResponse.data.message[0] as ApiSettings);
              return; // Exit if successful
            }
          }
        } catch (settingsError) {
          console.error('Error fetching from settings module:', settingsError);
        }
        
        // If settings module failed, try the users module
        try {
          const userSettingsResponse = await settingsApi.getUserSettings()
          console.log('User settings API response:', userSettingsResponse);
          
          if (userSettingsResponse?.data?.result === true && Array.isArray(userSettingsResponse?.data?.message)) {
            if (userSettingsResponse.data.message.length > 0) {
              setApiSettings(userSettingsResponse.data.message[0] as ApiSettings);
              return; // Exit if successful
            }
          }
        } catch (userSettingsError) {
          console.error('Error fetching from users module:', userSettingsError);
        }
        
        // If no data found but no errors thrown, set default placeholder data
        setApiSettings({
          name: 'User',
          company_name: 'Your Business',
          email: 'user@example.com',
          phone: '123-456-7890'
        });
        
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load settings from API. Please check your connection and try again.');
        
        // Set default data even on error
        setApiSettings({
          name: 'User',
          company_name: 'Your Business',
          email: 'user@example.com',
          phone: '123-456-7890'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  // Define page icon for settings page
  const settingsPageIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  
  // Display loading state
  if (loading) {
    return (
      <DashboardLayout 
        pageTitle={t('settings.title')}
        pageIcon={settingsPageIcon}
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#13A753]"></div>
        </div>
      </DashboardLayout>
    )
  }
  
  // Settings content
  const content = (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.72 11.28 8.72 9.51C8.72 7.7 10.18 6.23 12 6.23C13.81 6.23 15.28 7.7 15.28 9.51C15.27 11.28 13.88 12.72 12.12 12.78Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18.74 19.38C16.96 21.01 14.6 22 12 22C9.4 22 7.04 21.01 5.26 19.38C5.36 18.44 5.96 17.52 7.03 16.8C9.77 14.98 14.25 14.98 16.97 16.8C18.04 17.52 18.64 18.44 18.74 19.38Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {t('settings.profileSettings')}
      </h3>
        
      <div className="grid grid-cols-1 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            {t('settings.name')}
          </label>
          <input
            type="text"
            id="name"
            value={apiSettings?.name || ''}
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-700"
            disabled
            readOnly
          />
        </div>
        
        {/* Business */}
        <div>
          <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-2">
            {t('settings.business')}
          </label>
          <input
            type="text"
            id="business"
            value={apiSettings?.company_name || ''}
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-700"
            disabled
            readOnly
          />
        </div>
        
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            {t('settings.email')}
          </label>
          <input
            type="email"
            id="email"
            value={apiSettings?.email || ''}
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-700"
            disabled
            readOnly
          />
        </div>
        
        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            {t('settings.phone')}
          </label>
          <input
            type="tel"
            id="phone"
            value={apiSettings?.phone || ''}
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-700"
            disabled
            readOnly
          />
        </div>
      </div>
      
      {/* Display error message if any */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
    </div>
  )

  return (
    <DashboardLayout 
      pageTitle={t('settings.title')}
      pageIcon={settingsPageIcon}
    >
      {content}
    </DashboardLayout>
  )
} 