'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Sidebar from '@/components/dashboard/Sidebar'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import ProfileAvatar from '@/components/dashboard/ProfileAvatar'

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [whatsappEnabled, setWhatsappEnabled] = useState(true)
  const [weeklyResetsEnabled, setWeeklyResetsEnabled] = useState(true)
  const { t, i18n } = useTranslation()
  const [isRtl, setIsRtl] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profileInfo, setProfileInfo] = useState({
    name: 'Alex Dube',
    email: 'alex.dube@example.com',
    image: '/images/profile.jpg',
    phone: '+1 (555) 123-4567'
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
  
  // Handle profile image change
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileInfo({
            ...profileInfo,
            image: event.target.result as string
          })
        }
      }
      
      reader.readAsDataURL(file)
    }
  }
  
  // Handle save profile
  const handleSaveProfile = () => {
    console.log('Saving profile:', profileInfo)
    // Here you would typically make an API call to save the profile data
    alert('Profile updated successfully!')
  }
  
  // Handle password change
  const handleChangePassword = () => {
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      alert('New passwords do not match!')
      return
    }
    
    console.log('Changing password')
    // Here you would typically make an API call to change the password
    alert('Password changed successfully!')
  }
  
  // Handle app settings save
  const handleSaveAppSettings = () => {
    console.log('Saving app settings:', appSettings)
    // Here you would typically make an API call to save the app settings
    alert('Settings saved successfully!')
  }
  
  // Check if current language is RTL
  useEffect(() => {
    const rtlLanguages = ['he', 'ar']
    setIsRtl(rtlLanguages.includes(i18n.language))
  }, [i18n.language])
  
  return (
    <div className={`min-h-screen bg-[#1E1E1E] relative overflow-hidden ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Background grid lines */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="grid grid-cols-6 lg:grid-cols-12 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`col-${i}`} className={`border-r border-white/12 h-full ${i >= 6 ? 'hidden lg:block' : ''}`}></div>
          ))}
        </div>
        <div className="grid grid-rows-6 lg:grid-rows-12 w-full absolute top-0 left-0 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`row-${i}`} className={`border-b border-white/12 w-full ${i >= 6 ? 'hidden lg:block' : ''}`}></div>
          ))}
        </div>
      </div>
      
      {/* Background blur elements */}
      <div className="absolute w-[418px] h-[633px] top-[-363px] right-[639px] rounded-full bg-[rgba(19,167,83,0.8)] blur-[287px] hidden lg:block"></div>
      <div className="absolute w-[418px] h-[633px] bottom-[-400px] left-[-84px] rounded-full bg-[rgba(19,167,83,0.8)] blur-[324px] hidden lg:block"></div>
      
      {/* Mobile background blur elements */}
      <div className="absolute w-[300px] h-[300px] top-[-150px] right-[-150px] rounded-full bg-[rgba(19,167,83,0.8)] blur-[150px] lg:hidden block"></div>
      <div className="absolute w-[300px] h-[300px] bottom-[-150px] left-[-150px] rounded-full bg-[rgba(19,167,83,0.8)] blur-[150px] lg:hidden block"></div>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="w-[80%] max-w-[300px] h-full bg-[#1E1E1E] p-5 animate-slide-in" 
            style={{ boxShadow: '5px 0 15px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                  <Image 
                    src="/images/profile.jpg" 
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Alex Dube</h3>
                  <p className="text-white/70 text-sm">Admin</p>
                </div>
              </div>
              <button 
                className="text-white"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close Menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <Sidebar isMobile={true} />
          </div>
        </div>
      )}
      
      {/* Desktop Layout */}
      <div className="relative w-full min-h-screen z-10 hidden lg:flex">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ease-in-out ${isRtl ? 'right-0' : 'left-0'} fixed top-0 h-full z-20 ${isSidebarOpen ? (isRtl ? 'translate-x-0' : 'translate-x-0') : (isRtl ? 'translate-x-[100%]' : 'translate-x-[-100%]')}`}>
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className={`transition-all duration-300 ease-in-out flex-1 ${isSidebarOpen ? (isRtl ? 'mr-[304px]' : 'ml-[304px]') : (isRtl ? 'mr-0' : 'ml-0')} p-5`}>
          {/* White Background Container */}
          <div className="bg-white rounded-[35px] p-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-[36px]">
              <div className="flex items-center gap-4">
                {/* Toggle Sidebar Button */}
                <button 
                  className="w-[45px] h-[45px] flex items-center justify-center rounded-[10px] bg-[#3DD559]"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  aria-label={isSidebarOpen ? t('common.hideSidebar') : t('common.showSidebar')}
                >
                  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 8H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 1H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 15H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className="flex items-center gap-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h2 className="text-[25px] font-bold text-[#1E1E1E]">{t('Settings & Preferences')}</h2>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Search Button */}
                <button 
                  className="w-[45px] h-[45px] flex items-center justify-center rounded-full bg-[rgba(16,106,2,0.1)]"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('Search clicked')
                  }}
                  aria-label={t('common.search')}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.58329 17.5C13.9555 17.5 17.5 13.9555 17.5 9.58329C17.5 5.21104 13.9555 1.5 9.58329 1.5C5.21104 1.5 1.5 5.21104 1.5 9.58329C1.5 13.9555 5.21104 17.5 9.58329 17.5Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.5 16.5L15 15" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {/* Language Switcher */}
                <div className="hidden md:block">
                  <LanguageSwitcher />
                </div>
                
                {/* Notification Button */}
                <button 
                  className="w-[45px] h-[45px] flex items-center justify-center rounded-full bg-[#E7F0E6] relative"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('Notifications clicked')
                  }}
                  aria-label={t('common.notifications')}
                >
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 2.625C7.875 2.625 5.25 5.25 5.25 7.875V10.5L3.5 12.25V14H17.5V12.25L15.75 10.5V7.875C15.75 5.25 13.125 2.625 10.5 2.625Z" fill="#FF0000"/>
                    <path d="M16.5 2.625C14.875 2.625 13.25 5.25 13.25 7.875V10.5L11 12.25V14H21V12.25L19.25 10.5V7.875C19.25 5.25 17.625 2.625 16.5 2.625Z" fill="#FF0000"/>
                    <path d="M10.5 13.7C7.875 13.7 5.25 16.7 5.25 19.7V22H17.5V19.7C17.5 16.7 14.875 13.7 10.5 13.7Z" fill="#FF0000"/>
                    <path d="M16.5 13.7C14.875 13.7 13.25 16.7 13.25 19.7V22H21V19.7C21 16.7 18.625 13.7 16.5 13.7Z" fill="#FF0000"/>
                  </svg>
                  <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[#FF3B30] rounded-full text-white text-[10px] font-bold">
                    7
                  </div>
                </button>
                
                {/* Profile */}
                <div className={`flex items-center gap-[6px] ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <ProfileAvatar 
                      src="/images/profile.jpg" 
                    alt="Alex Dube"
                    size={45}
                  />
                  <div className="flex flex-col">
                    <span className="text-[16px] font-semibold text-[#201D1D] capitalize">Alex Dube</span>
                    <span className="text-[14px] text-[#636363] capitalize">{t('common.admin')}</span>
                  </div>
                </div>
              </div>
            </header>
            
            {/* Settings Content will be added here */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-[30px] overflow-hidden shadow-md relative flex">
                {/* Green Background Section */}
                <div className="bg-gradient-to-r from-[#106A02] to-[#13A753] p-6 flex items-center w-[30%]">
                  <div className="w-[80px] h-[80px] rounded-full border-[3px] border-white overflow-hidden">
                    <Image 
                      src="/images/profile.jpg" 
                      alt="Profile" 
                      width={80} 
                      height={80}
                      className="object-cover"
                    />
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-[22px] font-bold text-[#1E1E1E]">Bevely Piter</h3>
                      <p className="text-[14px] text-[#636363]">Weight Loss, Muscle Gain</p>
                    </div>
                    <button className="bg-[#13A753] hover:bg-[#0D8A40] transition-colors rounded-full text-white py-2 px-4 flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.26 3.59997L5.04997 12.29C4.73997 12.62 4.43997 13.27 4.37997 13.72L4.00997 16.96C3.87997 18.13 4.71997 18.93 5.87997 18.73L9.09997 18.18C9.54997 18.1 10.18 17.77 10.49 17.43L18.7 8.73997C20.12 7.23997 20.76 5.52997 18.55 3.43997C16.35 1.36997 14.68 2.09997 13.26 3.59997Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-white font-semibold">Edit</span>
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-4">
                      {/* Email */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#13A753] flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="text-[16px] text-[#636363]">alex123@gmail.com</span>
                      </div>
                      
                      {/* Phone */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#13A753] flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.31 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10"/>
                          </svg>
                        </div>
                        <span className="text-[16px] text-[#636363]">+91 7854578232</span>
                      </div>
                    </div>
                    
                    {/* Logout Button */}
                    <button className="border border-[#f3f3f3] rounded-full py-2.5 px-6 text-[#FF0000] flex items-center justify-center gap-2.5 hover:bg-[#FFF5F5] transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.90002 7.56001C9.21002 3.96001 11.06 2.49001 15.11 2.49001H15.24C19.71 2.49001 21.5 4.28001 21.5 8.75001V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54" stroke="#FF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 12H3.62" stroke="#FF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.85 8.65002L2.5 12L5.85 15.35" stroke="#FF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-[#FF0000] font-semibold">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Edit Profile Section */}
              <div className="bg-white rounded-[30px] p-6 shadow-md border border-gray-100">
                <h3 className="text-[18px] font-bold text-[#1E1E1E] mb-5">Edit Profile</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative border border-gradient-to-b from-[#13A753] to-[#1E2120] rounded-[53px]">
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      className="w-full py-2.5 px-5 rounded-[53px] focus:outline-none text-[#636363]"
                    />
                  </div>
                  
                  <div className="relative border border-gradient-to-b from-[#13A753] to-[#1E2120] rounded-[53px]">
                    <input 
                      type="email" 
                      placeholder="Your Email" 
                      className="w-full py-2.5 px-5 rounded-[53px] focus:outline-none text-[#636363]"
                    />
                  </div>
                  
                  <div className="relative border border-gradient-to-b from-[#13A753] to-[#1E2120] rounded-[53px]">
                    <input 
                      type="tel" 
                      placeholder="Phone Number" 
                      className="w-full py-2.5 px-5 rounded-[53px] focus:outline-none text-[#636363]"
                    />
                  </div>
                  
                  <div className="relative border border-gradient-to-b from-[#13A753] to-[#1E2120] rounded-[53px]">
                    <input 
                      type="text" 
                      placeholder="Specialization" 
                      className="w-full py-2.5 px-5 rounded-[53px] focus:outline-none text-[#636363]"
                    />
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <button className="bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-[60px] py-3.5 px-8 text-white">
                    Save Changes
                  </button>
                </div>
              </div>
              
              {/* Data Retention Section */}
              <div className="bg-white rounded-[25px] p-6 shadow-md border border-gray-100">
                <h3 className="text-[18px] font-bold text-[#1E1E1E] mb-5">Configure Data Retention</h3>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                  <div className="relative border border-gradient-to-b from-[#13A753] to-[#1E2120] rounded-[53px] w-full sm:w-auto flex-grow">
                    <input 
                      type="text" 
                      placeholder="30 days" 
                      className="w-full py-2.5 px-5 rounded-[53px] focus:outline-none text-[#636363]"
                    />
                  </div>
                  
                  <button className="bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-[60px] py-3.5 px-8 text-white w-full sm:w-auto">
                    Update
                  </button>
                </div>
              </div>
              
              {/* WhatsApp Integration Section */}
              <div className="bg-white rounded-[20px] p-6 shadow-md border border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-[18px] font-bold text-[#1E1E1E]">Manage WhatsApp Integration</h3>
                  
                  {/* Toggle Switch */}
                  <div className="relative">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={whatsappEnabled}
                          onChange={() => setWhatsappEnabled(!whatsappEnabled)}
                        />
                        <div className="block bg-gradient-to-b from-[#13A753] to-[#1E2120] w-12 h-6 rounded-full"></div>
                        <div 
                          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform duration-200 ease-in-out ${whatsappEnabled ? 'translate-x-6' : 'translate-x-0'}`}
                        ></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Weekly Resets Section */}
              <div className="bg-white rounded-[20px] p-6 shadow-md border border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-[18px] font-bold text-[#1E1E1E]">Enable Weekly Resets</h3>
                  
                  {/* Toggle Switch */}
                  <div className="relative">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={weeklyResetsEnabled}
                          onChange={() => setWeeklyResetsEnabled(!weeklyResetsEnabled)}
                        />
                        <div className="block bg-gradient-to-b from-[#13A753] to-[#1E2120] w-14 h-8 rounded-full"></div>
                        <div 
                          className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform duration-200 ease-in-out ${weeklyResetsEnabled ? 'translate-x-6' : 'translate-x-0'}`}
                        ></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Layout */}
      <div className={`relative w-full min-h-screen z-10 lg:hidden bg-[#1E1E1E] ${isRtl ? 'rtl' : 'ltr'}`}>
        {/* Background blur elements and grid lines */}
        {/* ... existing code ... */}
        
        {/* Mobile Header */}
        <header className="flex items-center justify-between bg-white p-4 relative z-10">
          <div className="flex items-center gap-3">
            <button 
              className="w-[40px] h-[40px] flex items-center justify-center rounded-[10px] bg-[#3DD559]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? t('common.closeMenu') : t('common.openMenu')}
            >
              <svg width="18" height="14" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 8H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 1H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 15H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="font-michael text-primary text-[24px] uppercase tracking-[0.04em] leading-[100%] font-bold">
              FITTrack
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#E7F0E6] relative"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Notifications clicked')
              }}
              aria-label={t('common.notifications')}
            >
              <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 2.625C7.875 2.625 5.25 5.25 5.25 7.875V10.5L3.5 12.25V14H17.5V12.25L15.75 10.5V7.875C15.75 5.25 13.125 2.625 10.5 2.625Z" fill="#FF0000"/>
                <path d="M16.5 2.625C14.875 2.625 13.25 5.25 13.25 7.875V10.5L11 12.25V14H21V12.25L19.25 10.5V7.875C19.25 5.25 17.625 2.625 16.5 2.625Z" fill="#FF0000"/>
                <path d="M10.5 13.7C7.875 13.7 5.25 16.7 5.25 19.7V22H17.5V19.7C17.5 16.7 14.875 13.7 10.5 13.7Z" fill="#FF0000"/>
                <path d="M16.5 13.7C14.875 13.7 13.25 16.7 13.25 19.7V22H21V19.7C21 16.7 18.625 13.7 16.5 13.7Z" fill="#FF0000"/>
              </svg>
              <div className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-[#FF3B30] rounded-full text-white text-[8px] font-bold">
                7
              </div>
            </button>
            <ProfileAvatar 
                src="/images/profile.jpg" 
              alt="Alex Dube"
              size={40}
            />
          </div>
        </header>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-[#1E1E1E] z-50 overflow-auto">
            <div className="p-4">
              <button 
                className="w-[40px] h-[40px] flex items-center justify-center rounded-[10px] bg-[#3DD559] mb-6"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label={t('common.closeMenu')}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L13 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13 1L1 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <Sidebar isMobile={true} />
            </div>
          </div>
        )}
        
        {/* Mobile Content */}
        <div className="p-4 relative z-10">
          <div className="bg-white rounded-[20px] p-4">
            {/* Settings Content for Mobile */}
            <div className="mb-4">
              <h2 className="text-[20px] font-bold text-[#1E1E1E] mb-4">{t('Settings')}</h2>
              
              <div className="space-y-4">
                {/* Profile Settings */}
                <div className="bg-[#F9F9F9] rounded-[15px] p-4">
                  <h3 className="text-[16px] font-semibold text-[#1E1E1E] mb-3">{t('Profile Settings')}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex flex-col items-center mb-4">
                      <div className="relative mb-2">
                        <ProfileAvatar 
                          src="/images/profile.jpg" 
                          alt="Profile"
                          size={80}
                        />
                        <button 
                          className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-[#3DD559] flex items-center justify-center shadow-md"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.99998 1.33331H9.99998C13.3333 1.33331 14.6666 2.66665 14.6666 5.99998V9.99998C14.6666 13.3333 13.3333 14.6666 9.99998 14.6666H5.99998C2.66665 14.6666 1.33331 13.3333 1.33331 9.99998V5.99998C1.33331 2.66665 2.66665 1.33331 5.99998 1.33331Z" stroke="#3DD559" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5.33331 6.66669C6.06665 6.66669 6.66665 6.06669 6.66665 5.33335C6.66665 4.60002 6.06665 4.00002 5.33331 4.00002C4.59998 4.00002 3.99998 4.60002 3.99998 5.33335C3.99998 6.06669 4.59998 6.66669 5.33331 6.66669Z" stroke="#3DD559" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14.4666 10.6667L11.8666 8.06667C11.4466 7.64667 10.7533 7.64667 10.3333 8.06667L8.60001 9.8C8.18001 10.22 7.48668 10.22 7.06668 9.8L6.86668 9.6C6.42668 9.16 5.70668 9.16 5.26668 9.6L3.33334 11.5333" stroke="#3DD559" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          className="hidden" 
                          accept="image/*"
                          onChange={handleProfileImageChange}
                        />
                      </div>
                      <h3 className="text-[18px] font-bold text-[#1E1E1E]">Alex Dube</h3>
                      <p className="text-[14px] text-[#636363]">{t('Admin')}</p>
                    </div>
                    
                    <div>
                      <label className="block text-[14px] text-[#636363] mb-1">{t('Full Name')}</label>
                  <input 
                    type="text" 
                        className="w-full py-2 px-3 rounded-[10px] border border-[#E0E0E0] focus:outline-none"
                        value={profileInfo.name}
                        onChange={(e) => setProfileInfo({...profileInfo, name: e.target.value})}
                  />
                </div>
                
                    <div>
                      <label className="block text-[14px] text-[#636363] mb-1">{t('Email')}</label>
                  <input 
                    type="email" 
                        className="w-full py-2 px-3 rounded-[10px] border border-[#E0E0E0] focus:outline-none"
                        value={profileInfo.email}
                        onChange={(e) => setProfileInfo({...profileInfo, email: e.target.value})}
                  />
                </div>
                
                    <div>
                      <label className="block text-[14px] text-[#636363] mb-1">{t('Phone')}</label>
                  <input 
                    type="tel" 
                        className="w-full py-2 px-3 rounded-[10px] border border-[#E0E0E0] focus:outline-none"
                        value={profileInfo.phone}
                        onChange={(e) => setProfileInfo({...profileInfo, phone: e.target.value})}
                  />
                </div>
                
                    <button 
                      className="w-full py-2 rounded-[10px] bg-gradient-to-b from-[#13A753] to-[#1E2120] text-white text-[14px] font-medium"
                      onClick={handleSaveProfile}
                    >
                      {t('Save Changes')}
                </button>
              </div>
            </div>
            
                {/* Security Settings */}
                <div className="bg-[#F9F9F9] rounded-[15px] p-4">
                  <h3 className="text-[16px] font-semibold text-[#1E1E1E] mb-3">{t('Security')}</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[14px] text-[#636363] mb-1">{t('Current Password')}</label>
                  <input 
                        type="password" 
                        className="w-full py-2 px-3 rounded-[10px] border border-[#E0E0E0] focus:outline-none"
                        value={passwordInfo.currentPassword}
                        onChange={(e) => setPasswordInfo({...passwordInfo, currentPassword: e.target.value})}
                  />
                </div>
                
                    <div>
                      <label className="block text-[14px] text-[#636363] mb-1">{t('New Password')}</label>
                      <input 
                        type="password" 
                        className="w-full py-2 px-3 rounded-[10px] border border-[#E0E0E0] focus:outline-none"
                        value={passwordInfo.newPassword}
                        onChange={(e) => setPasswordInfo({...passwordInfo, newPassword: e.target.value})}
                      />
            </div>
            
                    <div>
                      <label className="block text-[14px] text-[#636363] mb-1">{t('Confirm New Password')}</label>
                      <input 
                        type="password" 
                        className="w-full py-2 px-3 rounded-[10px] border border-[#E0E0E0] focus:outline-none"
                        value={passwordInfo.confirmPassword}
                        onChange={(e) => setPasswordInfo({...passwordInfo, confirmPassword: e.target.value})}
                      />
                    </div>
                    
                    <button 
                      className="w-full py-2 rounded-[10px] bg-gradient-to-b from-[#13A753] to-[#1E2120] text-white text-[14px] font-medium"
                      onClick={handleChangePassword}
                    >
                      {t('Change Password')}
                    </button>
                  </div>
                </div>
                
                {/* App Settings */}
                <div className="bg-[#F9F9F9] rounded-[15px] p-4">
                  <h3 className="text-[16px] font-semibold text-[#1E1E1E] mb-3">{t('App Settings')}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[14px] text-[#636363]">{t('Notifications')}</span>
                      <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                          checked={appSettings.notifications}
                          onChange={() => setAppSettings({...appSettings, notifications: !appSettings.notifications})}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3DD559]"></div>
                      </label>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[14px] text-[#636363]">{t('Dark Mode')}</span>
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={appSettings.darkMode}
                          onChange={() => setAppSettings({...appSettings, darkMode: !appSettings.darkMode})}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3DD559]"></div>
                  </label>
                    </div>
                    
                    <div>
                      <label className="block text-[14px] text-[#636363] mb-1">{t('Language')}</label>
                      <div className="relative">
                        <select 
                          className="w-full py-2 px-3 rounded-[10px] border border-[#E0E0E0] focus:outline-none appearance-none bg-white"
                          value={i18n.language}
                          onChange={(e) => i18n.changeLanguage(e.target.value)}
                        >
                          <option value="en">English</option>
                          <option value="fr">Français</option>
                          <option value="es">Español</option>
                          <option value="ar">العربية</option>
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.96004 4.47498L6.70004 7.73498C6.31504 8.11998 5.68504 8.11998 5.30004 7.73498L2.04004 4.47498" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      className="w-full py-2 rounded-[10px] bg-gradient-to-b from-[#13A753] to-[#1E2120] text-white text-[14px] font-medium"
                      onClick={handleSaveAppSettings}
                    >
                      {t('Save Settings')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 