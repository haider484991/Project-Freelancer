'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import ProfileAvatar from '@/components/dashboard/ProfileAvatar'
import { settingsApi } from '@/services/fitTrackApi'
import { DEBUG_MODE } from '@/utils/config'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useUser } from '@/context/UserContext'

// Define types for API responses
interface ApiSettings {
  company_name: string;
  email: string;
  phone: string;
  address: string;
  logo_url: string;
  default_target_calories: string;
  default_protein_ratio: string;
  default_carbs_ratio: string;
  default_fat_ratio: string;
  [key: string]: unknown;
}

export default function SettingsPage() {
  const [whatsappEnabled, setWhatsappEnabled] = useState(true)
  const [weeklyResetsEnabled, setWeeklyResetsEnabled] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Get user profile from context
  const { profile, updateProfile, saveProfile: saveUserProfile } = useUser()
  
  // API data states
  const [apiSettings, setApiSettings] = useState<ApiSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Local state for form data
  const [profileInfo, setProfileInfo] = useState({
    name: profile.name,
    email: profile.email,
    image: profile.image,
    phone: profile.phone
  })
  
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [appSettings, setAppSettings] = useState({
    language: 'en',
    theme: 'light',
    notifications: true,
    autoSave: true,
    dataRetention: '30',
    darkMode: false
  })
  
  // Update local state when profile changes
  useEffect(() => {
    setProfileInfo({
      name: profile.name,
      email: profile.email,
      image: profile.image,
      phone: profile.phone
    })
  }, [profile])
  
  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [successMessage])
  
  // Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await settingsApi.get()
        if (response.data && response.data.settings) {
          setApiSettings(response.data.settings)
          
          // Update app settings based on API settings
          const settings = response.data.settings
          setAppSettings(prev => ({
            ...prev,
            language: settings.language || prev.language,
            theme: settings.theme || prev.theme,
            notifications: settings.notifications_enabled === '1',
            autoSave: settings.auto_save === '1',
            dataRetention: settings.data_retention || prev.dataRetention,
            darkMode: settings.dark_mode === '1'
          }))
          
          if (DEBUG_MODE) {
            console.log('Fetched settings:', response.data.settings)
          }
        }
      } catch (err) {
        console.error('Error fetching settings:', err)
        setError('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }
    
    fetchSettings()
  }, [])
  
  // Handle profile image change
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const newImage = event.target.result as string
          setProfileInfo({
            ...profileInfo,
            image: newImage
          })
        }
      }
      
      reader.readAsDataURL(file)
    }
  }
  
  // Handle image click to open file dialog
  const handleImageClick = () => {
    fileInputRef.current?.click()
  }
  
  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Update user context profile
      updateProfile({
        name: profileInfo.name,
        email: profileInfo.email,
        phone: profileInfo.phone,
        image: profileInfo.image
      })
      
      // Save to API
      await saveUserProfile()
      
      setSuccessMessage('Profile updated successfully!')
    } catch (err) {
      console.error('Error saving profile:', err)
      setError('Failed to save profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle password change
  const handleChangePassword = async () => {
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      setError('New passwords do not match!')
      return
    }
    
    if (!passwordInfo.currentPassword || !passwordInfo.newPassword) {
      setError('Please fill in all password fields!')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      // Call the settings API to change password
      const response = await settingsApi.changePassword({
        current_password: passwordInfo.currentPassword,
        new_password: passwordInfo.newPassword
      })
      
      if (response.data && response.data.success) {
        setSuccessMessage('Password changed successfully!')
        
        // Reset password fields
        setPasswordInfo({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        setError('Failed to change password. ' + (response.data.message || 'Please try again.'))
      }
    } catch (err) {
      console.error('Error changing password:', err)
      setError('Failed to change password. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle app settings save
  const handleSaveAppSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Call the settings API to update app settings
      const response = await settingsApi.set({
        language: appSettings.language,
        theme: appSettings.theme,
        notifications_enabled: appSettings.notifications ? '1' : '0',
        auto_save: appSettings.autoSave ? '1' : '0',
        data_retention: appSettings.dataRetention,
        dark_mode: appSettings.darkMode ? '1' : '0',
        // Preserve the other settings
        company_name: apiSettings?.company_name || profile.name,
        email: apiSettings?.email || profile.email,
        phone: apiSettings?.phone || profile.phone,
        address: apiSettings?.address || '',
        logo_url: apiSettings?.logo_url || profile.image
      })
      
      if (response.data && response.data.success) {
        // Update local state with the response data
        setApiSettings(prevSettings => ({
          ...prevSettings!,
          language: appSettings.language,
          theme: appSettings.theme,
          notifications_enabled: appSettings.notifications ? '1' : '0',
          auto_save: appSettings.autoSave ? '1' : '0',
          data_retention: appSettings.dataRetention,
          dark_mode: appSettings.darkMode ? '1' : '0'
        }))
        
        // When language changes, refresh the page to update the UI
        if (appSettings.language !== localStorage.getItem('language')) {
          localStorage.setItem('language', appSettings.language)
          window.location.reload()
        }
        
        setSuccessMessage('Settings updated successfully!')
      } else {
        setError('Failed to update settings. Please try again.')
      }
    } catch (err) {
      console.error('Error saving settings:', err)
      setError('Failed to save settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Reset settings to defaults
  const handleResetSettings = () => {
    setAppSettings({
      language: 'en',
      theme: 'light',
      notifications: true,
      autoSave: true,
      darkMode: false,
      dataRetention: '30'
    })
    
    // Show temporary success message
    setError(null)
    console.log('Settings reset to defaults')
  }
  
  // Define page icon for settings page
  const settingsPageIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  
  // Display loading state
  if (loading && !apiSettings) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-white">Loading settings...</div>
      </div>
    )
  }

  // Desktop content
  const desktopContent = (
    <>
      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm animate-fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-sm animate-fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}
      
      {/* Settings management controls */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.5 17.5L12.5001 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input 
              type="text" 
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder={t('settings.searchSettings')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleSaveProfile}
            className="bg-white flex items-center gap-2 py-2.5 px-5 rounded-xl text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.44 8.9C20.04 9.21 21.51 11.06 21.51 15.11V15.24C21.51 19.71 19.72 21.5 15.25 21.5H8.74C4.27 21.5 2.48 19.71 2.48 15.24V15.11C2.48 11.09 3.93 9.24 7.47 8.91" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15V3.62" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.35 5.85L12 2.5L8.65 5.85" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium">{t('settings.saveAll')}</span>
          </button>
          
          <button
            onClick={handleResetSettings}
            className="bg-[#13A753] text-white flex items-center gap-2 py-2.5 px-5 rounded-xl hover:bg-[#0F8A44] shadow-md hover:shadow-lg transition-all duration-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium">{t('settings.resetDefaults')}</span>
          </button>
        </div>
      </div>
      
      {/* Profile & Password Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.72 11.28 8.72 9.51C8.72 7.7 10.18 6.23 12 6.23C13.81 6.23 15.28 7.7 15.28 9.51C15.27 11.28 13.88 12.72 12.12 12.78Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.74 19.38C16.96 21.01 14.6 22 12 22C9.4 22 7.04 21.01 5.26 19.38C5.36 18.44 5.96 17.52 7.03 16.8C9.77 14.98 14.25 14.98 16.97 16.8C18.04 17.52 18.64 18.44 18.74 19.38Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('settings.profileSettings')}
          </h3>
          
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div 
                className="w-24 h-24 overflow-hidden rounded-full border-2 border-[#13A753] mb-4 cursor-pointer transition-transform duration-300 transform group-hover:scale-105"
                onClick={handleImageClick}
              >
                <ProfileAvatar
                  src={profileInfo.image}
                  alt={profileInfo.name}
                  size={96}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfileImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <div className="absolute bottom-4 right-0 bg-[#13A753] text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.26 3.6L5.05 12.05C4.74 12.37 4.44 13 4.38 13.43L4.01 16.98C3.88 18.11 4.69 18.9 5.82 18.73L9.36 18.23C9.79 18.16 10.42 17.84 10.73 17.51L18.94 9.06C20.28 7.68 20.91 6.05 18.94 4.13C16.98 2.22 14.6 2.22 13.26 3.6Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.89 5.05C12.32 7.81 14.56 9.94 17.34 10.24" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <h4 className="text-lg font-medium text-gray-800">{profileInfo.name}</h4>
            <p className="text-sm text-gray-500">{profileInfo.email}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.fullName')}
              </label>
              <input
                type="text"
                value={profileInfo.name}
                onChange={(e) => setProfileInfo({...profileInfo, name: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.email')}
              </label>
              <input
                type="email"
                value={profileInfo.email}
                onChange={(e) => setProfileInfo({...profileInfo, email: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.phone')}
              </label>
              <input
                type="tel"
                value={profileInfo.phone}
                onChange={(e) => setProfileInfo({...profileInfo, phone: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <button
              onClick={handleSaveProfile}
              className="w-full bg-[#13A753] text-white p-3 rounded-xl font-medium hover:bg-[#0F8A44] shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mt-4"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.89 5.88H5.11C3.4 5.88 2 7.28 2 8.99V20.35C2 20.78 2.34 21.12 2.77 21.12C2.89 21.12 3 21.09 3.11 21.03L7.98 18.5L14.88 18.5C16.59 18.5 17.99 17.1 17.99 15.39V8.99C17.99 7.28 16.6 5.88 14.89 5.88H12.89Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21.98 12.66V4.83C21.98 3.31 20.67 2.11 19.03 2.11H11.92C10.28 2.11 8.97 3.31 8.97 4.83V5.88" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('settings.saveProfile')}
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 8.5V7C17 4.2 14.8 2 12 2C9.2 2 7 4.2 7 7V8.5" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 14.5V17.5" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 8.5H18C20.2 8.5 22 10.3 22 12.5V19C22 21.2 20.2 23 18 23H6C3.8 23 2 21.2 2 19V12.5C2 10.3 3.8 8.5 6 8.5Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('settings.passwordSettings')}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.currentPassword')}
              </label>
              <input
                type="password"
                value={passwordInfo.currentPassword}
                onChange={(e) => setPasswordInfo({...passwordInfo, currentPassword: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.newPassword')}
              </label>
              <input
                type="password"
                value={passwordInfo.newPassword}
                onChange={(e) => setPasswordInfo({...passwordInfo, newPassword: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.confirmNewPassword')}
              </label>
              <input
                type="password"
                value={passwordInfo.confirmPassword}
                onChange={(e) => setPasswordInfo({...passwordInfo, confirmPassword: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-3 rounded-lg mt-2">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-sm">
                  {t('settings.passwordRequirements')}:
                  <ul className="list-disc list-inside mt-1 ml-1">
                    <li>{t('settings.passwordReq1')}</li>
                    <li>{t('settings.passwordReq2')}</li>
                  </ul>
                </p>
              </div>
            </div>
            
            <button
              onClick={handleChangePassword}
              className="w-full bg-[#13A753] text-white p-3 rounded-xl font-medium hover:bg-[#0F8A44] shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mt-4"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.44 8.9C20.04 9.21 21.51 11.06 21.51 15.11V15.24C21.51 19.71 19.72 21.5 15.25 21.5H8.74C4.27 21.5 2.48 19.71 2.48 15.24V15.11C2.48 11.09 3.93 9.24 7.47 8.91" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15V3.62" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.35 5.85L12 2.5L8.65002 5.85" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('settings.changePassword')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Application Settings */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 md:col-span-2">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('settings.appSettings')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.language')}</label>
              <div className="relative">
                <select 
                  value={appSettings.language}
                  onChange={(e) => setAppSettings({...appSettings, language: e.target.value})}
                  className="w-full p-3 pr-10 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="en">English</option>
                  <option value="he">Hebrew (עברית)</option>
                  <option value="ar">Arabic (العربية)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.theme')}</label>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'system'].map((theme) => (
                  <div
                    key={theme}
                    onClick={() => setAppSettings({...appSettings, theme})}
                    className={`flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      appSettings.theme === theme 
                        ? 'bg-[#13A753] bg-opacity-10 border-2 border-[#13A753]' 
                        : 'bg-gray-50 border border-gray-200 hover:border-[#13A753] hover:bg-[#13A753] hover:bg-opacity-5'
                    }`}
                  >
                    {theme === 'light' && (
                      <svg className={`w-6 h-6 mb-1 ${appSettings.theme === theme ? 'text-[#13A753]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                    )}
                    {theme === 'dark' && (
                      <svg className={`w-6 h-6 mb-1 ${appSettings.theme === theme ? 'text-[#13A753]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                      </svg>
                    )}
                    {theme === 'system' && (
                      <svg className={`w-6 h-6 mb-1 ${appSettings.theme === theme ? 'text-[#13A753]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    )}
                    <span className={`text-sm font-medium capitalize ${appSettings.theme === theme ? 'text-[#13A753]' : 'text-gray-700'}`}>
                      {theme}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.dataRetention')}</label>
              <div className="relative">
                <select 
                  value={appSettings.dataRetention}
                  onChange={(e) => setAppSettings({...appSettings, dataRetention: e.target.value})}
                  className="w-full p-3 pr-10 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="7">7 {t('settings.days')}</option>
                  <option value="30">30 {t('settings.days')}</option>
                  <option value="90">90 {t('settings.days')}</option>
                  <option value="365">1 {t('settings.year')}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 mb-2">{t('settings.features')}</h4>
            
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#13A753] bg-opacity-10 p-2 rounded-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.5 12H14.5" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12.5 15L15.5 12L12.5 9" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800">{t('settings.enableNotifications')}</h5>
                  <p className="text-xs text-gray-500">{t('settings.notificationsDescription')}</p>
                </div>
              </div>
              
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={appSettings.notifications}
                  onChange={(e) => setAppSettings({...appSettings, notifications: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13A753]"></div>
              </label>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#13A753] bg-opacity-10 p-2 rounded-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 5.15V8.85C22 11.1 21.1 12 18.85 12H16.15C13.9 12 13 11.1 13 8.85V5.15C13 2.9 13.9 2 16.15 2H18.85C21.1 2 22 2.9 22 5.15Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11 15.15V18.85C11 21.1 10.1 22 7.85 22H5.15C2.9 22 2 21.1 2 18.85V15.15C2 12.9 2.9 12 5.15 12H7.85C10.1 12 11 12.9 11 15.15Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 15C22 18.87 18.87 22 15 22L16.05 20.25" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 9C2 5.13 5.13 2 9 2L7.95001 3.75" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800">{t('settings.enableAutoSave')}</h5>
                  <p className="text-xs text-gray-500">{t('settings.autoSaveDescription')}</p>
                </div>
              </div>
              
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={appSettings.autoSave}
                  onChange={(e) => setAppSettings({...appSettings, autoSave: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13A753]"></div>
              </label>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#13A753] bg-opacity-10 p-2 rounded-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21H7C3 21 2 20 2 16V8C2 4 3 3 7 3H17C21 3 22 4 22 8V16C22 20 21 21 17 21Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 8H6" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 16H6" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 12H6" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800">{t('settings.enableDarkMode')}</h5>
                  <p className="text-xs text-gray-500">{t('settings.darkModeDescription')}</p>
                </div>
              </div>
              
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={appSettings.darkMode}
                  onChange={(e) => setAppSettings({...appSettings, darkMode: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13A753]"></div>
              </label>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#13A753] bg-opacity-10 p-2 rounded-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800">{t('settings.enableWhatsapp')}</h5>
                  <p className="text-xs text-gray-500">{t('settings.whatsappDescription')}</p>
                </div>
              </div>
              
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={whatsappEnabled}
                  onChange={(e) => setWhatsappEnabled(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13A753]"></div>
              </label>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#13A753] bg-opacity-10 p-2 rounded-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800">{t('settings.weeklyReset')}</h5>
                  <p className="text-xs text-gray-500">{t('settings.weeklyResetDescription')}</p>
                </div>
              </div>
              
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={weeklyResetsEnabled}
                  onChange={(e) => setWeeklyResetsEnabled(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13A753]"></div>
              </label>
            </div>
            
            <button
              onClick={handleSaveAppSettings}
              className="w-full bg-[#13A753] text-white p-3 rounded-xl font-medium hover:bg-[#0F8A44] shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mt-6"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.89 5.88H5.11C3.4 5.88 2 7.28 2 8.99V20.35C2 20.78 2.34 21.12 2.77 21.12C2.89 21.12 3 21.09 3.11 21.03L7.98 18.5L14.88 18.5C16.59 18.5 17.99 17.1 17.99 15.39V8.99C17.99 7.28 16.6 5.88 14.89 5.88H12.89Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21.98 12.66V4.83C21.98 3.31 20.67 2.11 19.03 2.11H11.92C10.28 2.11 8.97 3.31 8.97 4.83V5.88" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('settings.saveSettings')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
  
  // Mobile content
  const mobileContent = (
    <>
      {/* Success/Error Messages */}
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-lg shadow-sm animate-fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 text-green-700 p-3 rounded-lg shadow-sm animate-fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        </div>
      )}
      
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 17.5L12.5001 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <input 
          type="text" 
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-[10px] leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          placeholder={t('settings.searchSettings')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleSaveProfile}
          className="flex-1 bg-white flex items-center justify-center gap-1 py-2.5 px-3 rounded-[10px] text-[#636363] text-sm hover:bg-gray-100"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.44 8.9C20.04 9.21 21.51 11.06 21.51 15.11V15.24C21.51 19.71 19.72 21.5 15.25 21.5H8.74C4.27 21.5 2.48 19.71 2.48 15.24V15.11C2.48 11.09 3.93 9.24 7.47 8.91" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15V3.62" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.35 5.85L12 2.5L8.65002 5.85" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-medium">{t('settings.saveAll')}</span>
        </button>
        
        <button 
          onClick={handleResetSettings}
          className="flex-1 bg-[#13A753] text-white flex items-center justify-center gap-1 py-2.5 px-3 rounded-[10px] text-sm hover:bg-[#0F8A44]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51001" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-medium">{t('settings.resetDefaults')}</span>
        </button>
      </div>
      
      {/* Profile Settings - Mobile */}
      <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 mb-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.72 11.28 8.72 9.51C8.72 7.7 10.18 6.23 12 6.23C13.81 6.23 15.28 7.7 15.28 9.51C15.27 11.28 13.88 12.72 12.12 12.78Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.74 19.38C16.96 21.01 14.6 22 12 22C9.4 22 7.04 21.01 5.26 19.38C5.36 18.44 5.96 17.52 7.03 16.8C9.77 14.98 14.25 14.98 16.97 16.8C18.04 17.52 18.64 18.44 18.74 19.38Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('settings.profileSettings')}
        </h3>
        
        {/* Profile Image */}
        <div className="relative group mb-3">
          <div 
            className="w-20 h-20 overflow-hidden rounded-full border-2 border-[#13A753] cursor-pointer transition-transform duration-300 transform group-hover:scale-105"
            onClick={handleImageClick}
          >
            <ProfileAvatar
              src={profileInfo.image}
              alt={profileInfo.name}
              size={80}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfileImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          <div className="absolute bottom-0 right-0 bg-[#13A753] text-white rounded-full p-1 shadow-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.26 3.6L5.05 12.05C4.74 12.37 4.44 13 4.38 13.43L4.01 16.98C3.88 18.11 4.69 18.9 5.82 18.73L9.36 18.23C9.79 18.16 10.42 17.84 10.73 17.51L18.94 9.06C20.28 7.68 20.91 6.05 18.94 4.13C16.98 2.22 14.6 2.22 13.26 3.6Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.89 5.05C12.32 7.81 14.56 9.94 17.34 10.24" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.name')}</label>
          <input 
            type="text" 
            value={profileInfo.name || profile.name || ''}
            onChange={(e) => setProfileInfo({...profileInfo, name: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.email')}</label>
          <input 
            type="email" 
            value={profileInfo.email || profile.email || ''}
            onChange={(e) => setProfileInfo({...profileInfo, email: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.phone')}</label>
          <input 
            type="tel" 
            value={profileInfo.phone || profile.phone || ''}
            onChange={(e) => setProfileInfo({...profileInfo, phone: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <button
          onClick={handleSaveProfile}
          className="bg-[#13A753] text-white py-2 px-4 rounded-md w-full hover:bg-[#0F8A44]"
          disabled={loading}
        >
          {loading ? t('settings.saving') : t('settings.saveProfile')}
        </button>
      </div>
      
      {/* Password Settings - Mobile */}
      <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 mb-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 8.5V7C17 4.2 14.8 2 12 2C9.2 2 7 4.2 7 7V8.5" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 14.5V17.5" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 8.5H18C20.2 8.5 22 10.3 22 12.5V19C22 21.2 20.2 23 18 23H6C3.8 23 2 21.2 2 19V12.5C2 10.3 3.8 8.5 6 8.5Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('settings.passwordSettings')}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('settings.currentPassword')}
            </label>
            <input
              type="password"
              value={passwordInfo.currentPassword}
              onChange={(e) => setPasswordInfo({...passwordInfo, currentPassword: e.target.value})}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('settings.newPassword')}
            </label>
            <input
              type="password"
              value={passwordInfo.newPassword}
              onChange={(e) => setPasswordInfo({...passwordInfo, newPassword: e.target.value})}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('settings.confirmNewPassword')}
            </label>
            <input
              type="password"
              value={passwordInfo.confirmPassword}
              onChange={(e) => setPasswordInfo({...passwordInfo, confirmPassword: e.target.value})}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <button
            onClick={handleChangePassword}
            className="w-full bg-[#13A753] text-white p-2.5 rounded-xl font-medium hover:bg-[#0F8A44] shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mt-3 text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.44 8.9C20.04 9.21 21.51 11.06 21.51 15.11V15.24C21.51 19.71 19.72 21.5 15.25 21.5H8.74C4.27 21.5 2.48 19.71 2.48 15.24V15.11C2.48 11.09 3.93 9.24 7.47 8.91" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15V3.62" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.35 5.85L12 2.5L8.65002 5.85" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('settings.changePassword')}
          </button>
        </div>
      </div>
      
      {/* App Settings - Mobile */}
      <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 mb-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('settings.appSettings')}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t('settings.language')}
            </label>
            <select 
              value={appSettings.language}
              onChange={(e) => setAppSettings({...appSettings, language: e.target.value})}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="en">English</option>
              <option value="he">Hebrew (עברית)</option>
              <option value="ar">Arabic (العربية)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t('settings.theme')}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['light', 'dark', 'system'].map((theme) => (
                <div
                  key={theme}
                  onClick={() => setAppSettings({...appSettings, theme})}
                  className={`flex flex-col items-center p-2 rounded-xl cursor-pointer text-xs transition-all duration-200 ${
                    appSettings.theme === theme 
                      ? 'bg-[#13A753] bg-opacity-10 border-2 border-[#13A753]' 
                      : 'bg-gray-50 border border-gray-200 hover:border-[#13A753]'
                  }`}
                >
                  {theme === 'light' && (
                    <svg className={`w-6 h-6 mb-1 ${appSettings.theme === theme ? 'text-[#13A753]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  )}
                  {theme === 'dark' && (
                    <svg className={`w-6 h-6 mb-1 ${appSettings.theme === theme ? 'text-[#13A753]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                  )}
                  {theme === 'system' && (
                    <svg className={`w-6 h-6 mb-1 ${appSettings.theme === theme ? 'text-[#13A753]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  )}
                  <span className={`font-medium capitalize ${appSettings.theme === theme ? 'text-[#13A753]' : 'text-gray-700'}`}>
                    {theme}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t('settings.dataRetention')}
            </label>
            <select 
              value={appSettings.dataRetention}
              onChange={(e) => setAppSettings({...appSettings, dataRetention: e.target.value})}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="7">7 {t('settings.days')}</option>
              <option value="30">30 {t('settings.days')}</option>
              <option value="90">90 {t('settings.days')}</option>
              <option value="365">1 {t('settings.year')}</option>
            </select>
          </div>
          
          <div className="space-y-3 mt-3">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-800">{t('settings.enableNotifications')}</span>
              </div>
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={appSettings.notifications}
                  onChange={(e) => setAppSettings({...appSettings, notifications: e.target.checked})}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#13A753]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-800">{t('settings.enableAutoSave')}</span>
              </div>
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={appSettings.autoSave}
                  onChange={(e) => setAppSettings({...appSettings, autoSave: e.target.checked})}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#13A753]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-800">{t('settings.enableDarkMode')}</span>
              </div>
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={appSettings.darkMode}
                  onChange={(e) => setAppSettings({...appSettings, darkMode: e.target.checked})}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#13A753]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-800">{t('settings.enableWhatsapp')}</span>
              </div>
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={whatsappEnabled}
                  onChange={(e) => setWhatsappEnabled(e.target.checked)}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#13A753]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-800">{t('settings.enableWhatsapp')}</span>
              </div>
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={whatsappEnabled}
                  onChange={(e) => setWhatsappEnabled(e.target.checked)}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#13A753]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-800">{t('settings.weeklyReset')}</span>
              </div>
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={weeklyResetsEnabled}
                  onChange={(e) => setWeeklyResetsEnabled(e.target.checked)}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#13A753]"></div>
              </label>
            </div>
            
            <button
              onClick={handleSaveAppSettings}
              className="w-full bg-[#13A753] text-white p-2.5 rounded-xl font-medium hover:bg-[#0F8A44] shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mt-3 text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.89 5.88H5.11C3.4 5.88 2 7.28 2 8.99V20.35C2 20.78 2.34 21.12 2.77 21.12C2.89 21.12 3 21.09 3.11 21.03L7.98 18.5L14.88 18.5C16.59 18.5 17.99 17.1 17.99 15.39V8.99C17.99 7.28 16.6 5.88 14.89 5.88H12.89Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21.98 12.66V4.83C21.98 3.31 20.67 2.11 19.03 2.11H11.92C10.28 2.11 8.97 3.31 8.97 4.83V5.88" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('settings.saveSettings')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
  
  return (
    <DashboardLayout
      pageTitle={t('settings.header')}
      pageIcon={settingsPageIcon}
      profileName={profile.name || "Alex Dube"}
      profileRole="admin"
      notificationCount={3}
    >
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes growWidth {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
        
        .animate-grow-width {
          animation: growWidth 0.5s ease-out forwards;
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        
        .staggered-item:nth-child(1) { animation-delay: 0.1s; }
        .staggered-item:nth-child(2) { animation-delay: 0.2s; }
        .staggered-item:nth-child(3) { animation-delay: 0.3s; }
        .staggered-item:nth-child(4) { animation-delay: 0.4s; }
        .staggered-item:nth-child(5) { animation-delay: 0.5s; }
      `}</style>
      
      {/* Desktop View */}
      <div className="hidden lg:block animate-fade-in">
        {desktopContent}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden animate-fade-in">
        {mobileContent}
      </div>
    </DashboardLayout>
  )
} 