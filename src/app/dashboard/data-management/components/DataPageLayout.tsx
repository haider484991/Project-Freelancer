'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import ProfileAvatar from '@/components/dashboard/ProfileAvatar'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useTranslation } from 'react-i18next'

interface DataPageLayoutProps {
  children: React.ReactNode
}

const DataPageLayout: React.FC<DataPageLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const [isRtl, setIsRtl] = useState(false)
  
  // Check if current language is RTL
  useEffect(() => {
    const rtlLanguages = ['he', 'ar']
    setIsRtl(rtlLanguages.includes(i18n.language))
    
    // Set document direction
    document.documentElement.dir = rtlLanguages.includes(i18n.language) ? 'rtl' : 'ltr'
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
      <div className="absolute w-[300px] h-[300px] top-[-150px] right-[-150px] rounded-full bg-[rgba(19,167,83,0.6)] blur-[180px] lg:hidden block z-0 opacity-70"></div>
      <div className="absolute w-[300px] h-[300px] bottom-[-150px] left-[-150px] rounded-full bg-[rgba(19,167,83,0.6)] blur-[180px] lg:hidden block z-0 opacity-70"></div>
      
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
                <ProfileAvatar
                  src="/images/profile.jpg"
                  alt="Profile"
                  size={40}
                />
                <div>
                  <h3 className="text-white font-semibold">{t('Alex Dube')}</h3>
                  <p className="text-white/70 text-sm">{t('Admin')}</p>
                </div>
              </div>
              <button
                className="text-white"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close Menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                    <path d="M1 8H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M1 1H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M1 15H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="flex items-center gap-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12.9799V11.0199C2 10.0799 2.85 9.20994 3.9 9.20994C5.71 9.20994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L8.21 2.53994C8.76 2.21994 9.78 2.21994 10.33 2.53994L12.3 3.77994C13.21 4.29994 13.52 5.46994 13 6.36994C12.09 7.93994 12.83 9.20994 14.64 9.20994C15.69 9.20994 16.54 10.0699 16.54 11.0199V12.9799C16.54 13.9199 15.69 14.7799 14.64 14.7799C12.83 14.7799 12.09 16.0599 13 17.6299C13.52 18.5399 13.21 19.6999 12.3 20.2199L10.33 21.4599C9.78 21.7799 8.76 21.7799 8.21 21.4599L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.9799Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.25 12C9.25 12.83 9.92 13.5 10.75 13.5C11.58 13.5 12.25 12.83 12.25 12C12.25 11.17 11.58 10.5 10.75 10.5C9.92 10.5 9.25 11.17 9.25 12Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h2 className="text-[25px] font-bold text-[#1E1E1E]">{t('Data & Statistics')}</h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Search Button */}
                <button
                  className="w-[45px] h-[45px] flex items-center justify-center rounded-full bg-[rgba(16,106,2,0.1)]"
                  aria-label={t('common.search')}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.58329 17.5C13.9555 17.5 17.5 13.9555 17.5 9.58329C17.5 5.21104 13.9555 1.5 9.58329 1.5C5.21104 1.5 1.5 5.21104 1.5 9.58329C1.5 13.9555 5.21104 17.5 9.58329 17.5Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16.5 16.5L15 15" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {/* Language Switcher */}
                <div className="hidden md:block">
                  <LanguageSwitcher />
                </div>
                {/* Notification Button */}
                <button
                  className="w-[45px] h-[45px] flex items-center justify-center rounded-full bg-[#E7F0E6] relative"
                  aria-label={t('common.notifications')}
                >
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 2.625C7.875 2.625 5.25 5.25 5.25 7.875V10.5L3.5 12.25V14H17.5V12.25L15.75 10.5V7.875C15.75 5.25 13.125 2.625 10.5 2.625Z" fill="#FF0000" />
                    <path d="M11.5 2.625C8.875 2.625 6.25 5.25 6.25 7.875V10.5L4.5 12.25V14H18.5V12.25L16.75 10.5V7.875C16.75 5.25 14.125 2.625 11.5 2.625Z" fill="#FF0000" />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[#FF3B30] rounded-full text-white text-[10px] font-bold">
                    3
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

            {/* Main Content */}
            <div>
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="w-full min-h-screen z-10 lg:hidden block pt-5 px-4 pb-10">
        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-5 relative z-10">
          <button
            className="w-[40px] h-[40px] flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7H21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3 12H21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3 17H21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <h1 className="text-white text-xl font-bold">Data & Statistics</h1>
          <ProfileAvatar
            src="/images/profile.jpg"
            alt="Alex Dube"
            size={40}
          />
        </div>

        {/* Mobile Content */}
        <div className="bg-white rounded-[25px] p-4 relative z-10">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DataPageLayout 