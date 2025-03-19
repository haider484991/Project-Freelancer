'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Sidebar from '@/components/dashboard/Sidebar'
import StatsCards from '@/components/dashboard/StatsCards'
import ClientDistributionChart from '@/components/dashboard/ClientDistributionChart'
import FlaggedIssues from '@/components/dashboard/FlaggedIssues'
import MobileStatsCards from '@/components/dashboard/MobileStatsCards'
import MobileClientDistributionChart from '@/components/dashboard/MobileClientDistributionChart'
import MobileFlaggedIssues from '@/components/dashboard/MobileFlaggedIssues'
import ProfileAvatar from '@/components/dashboard/ProfileAvatar'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const [isRtl, setIsRtl] = useState(false)
  
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
      
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen relative z-10">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-[304px]' : 'w-0 overflow-hidden'}`}>
          {isSidebarOpen && <Sidebar />}
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-[1600px] mx-auto px-8 py-8">
            {/* Header */}
            <header className="flex items-center justify-between bg-white rounded-[20px] px-6 py-5 mb-6">
              <div className="flex items-center gap-6">
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
                <h2 className="text-[25px] font-bold text-[#1E1E1E]">
                  {t('dashboard.welcomeMessage', { name: 'Alex' })}
                </h2>
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
            
            {/* Dashboard Content */}
            <div>
              {/* Stats Cards */}
              <StatsCards />
              
              {/* Charts Section */}
              <div className="grid grid-cols-2 gap-7 mt-6">
                <ClientDistributionChart />
                <FlaggedIssues />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Layout */}
      <div className={`relative w-full min-h-screen z-10 lg:hidden bg-[#1E1E1E] ${isRtl ? 'rtl' : 'ltr'}`}>
        {/* Background blur elements - adjusted size and position */}
        <div className="absolute w-[418px] h-[633px] top-[-404px] right-[199px] rounded-full bg-[rgba(19,167,83,0.8)] blur-[287px] z-0"></div>
        <div className="absolute w-[418px] h-[633px] bottom-[-400px] left-[-271px] rounded-full bg-[rgba(19,167,83,0.8)] blur-[324px] z-0"></div>
        
        {/* Background grid lines */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="grid grid-cols-6 h-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`col-${i}`} className="border-r border-white/12 h-full"></div>
            ))}
          </div>
          <div className="grid grid-rows-6 w-full absolute top-0 left-0 h-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`row-${i}`} className="border-b border-white/12 w-full"></div>
            ))}
          </div>
        </div>
        
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
          <div className="bg-white rounded-[20px] p-4 mb-4">
            <h2 className="text-[20px] font-bold text-[#1E1E1E] mb-2">
              {t('dashboard.welcomeMessage', { name: 'Alex' })}
            </h2>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button 
                  className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[rgba(16,106,2,0.1)]"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('Search clicked')
                  }}
                  aria-label={t('common.search')}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.58329 17.5C13.9555 17.5 17.5 13.9555 17.5 9.58329C17.5 5.21104 13.9555 1.5 9.58329 1.5C5.21104 1.5 1.5 5.21104 1.5 9.58329C1.5 13.9555 5.21104 17.5 9.58329 17.5Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.5 16.5L15 15" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
          
          {/* Mobile Stats Cards */}
          <MobileStatsCards />
          
          {/* Mobile Charts */}
          <div className="mt-4 flex flex-col gap-4">
            <MobileClientDistributionChart />
            <MobileFlaggedIssues />
          </div>
        </div>
      </div>
    </div>
  )
}