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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Fetch user settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await settingsApi.get();
        if (response.data.result && response.data.message) {
          const settings = response.data.message;
          setFormData(prev => ({
            ...prev,
            name: settings.name || '',
            email: settings.email || '',
            phone: settings.phone || '',
            business: settings.business || ''
          }));
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const response = await settingsApi.set({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        business: formData.business,
        current_password: formData.currentPassword,
        new_password: formData.newPassword
      });

      if (response.data.result) {
        setSuccess('Settings updated successfully');
        // Clear password fields after successful update
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setError(response.data.message || 'Failed to update settings');
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings');
    }
  };
  
  // Define page icon for settings page
  const settingsPageIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#13A753] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600 font-medium">Loading settings...</div>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V14" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 17.5V18" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#EF4444" strokeWidth="2"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Settings</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#13A753] text-white py-2 px-6 rounded-lg hover:bg-[#0F8A44] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Settings content
  const content = (
    <div className="bg-white p-6 rounded-25 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
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
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 border border-gray-200 rounded-25 bg-gray-50 cursor-not-allowed text-gray-700"
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
            value={formData.business}
            onChange={(e) => setFormData(prev => ({ ...prev, business: e.target.value }))}
            className="w-full p-3 border border-gray-200 rounded-25 bg-gray-50 cursor-not-allowed text-gray-700"
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
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-3 border border-gray-200 rounded-25 bg-gray-50 cursor-not-allowed text-gray-700"
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
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full p-3 border border-gray-200 rounded-25 bg-gray-50 cursor-not-allowed text-gray-700"
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