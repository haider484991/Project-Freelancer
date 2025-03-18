'use client'

import { useState } from 'react'
import Image from 'next/image'
import Sidebar from '@/components/dashboard/Sidebar'
import StatsCards from '@/components/dashboard/StatsCards'
import ClientDistributionChart from '@/components/dashboard/ClientDistributionChart'
import FlaggedIssues from '@/components/dashboard/FlaggedIssues'
import MobileStatsCards from '@/components/dashboard/MobileStatsCards'
import MobileClientDistributionChart from '@/components/dashboard/MobileClientDistributionChart'
import MobileFlaggedIssues from '@/components/dashboard/MobileFlaggedIssues'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { i18n } = useTranslation()
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    localStorage.setItem('language', lang)
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] relative overflow-hidden">
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
        <div className={`fixed top-0 left-0 h-full z-20 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-[-100%]'}`}>
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className={`transition-all duration-300 ease-in-out flex-1 ${isSidebarOpen ? 'ml-[304px]' : 'ml-0'} p-5`}>
          {/* White Background Container */}
          <div className="bg-white rounded-[35px] p-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-[36px]">
              <div className="flex items-center gap-4">
                {/* Toggle Sidebar Button */}
                <button 
                  className="w-[45px] h-[45px] flex items-center justify-center rounded-[10px] bg-[#3DD559] hover:bg-[#2bbd47] transition-colors"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  aria-label={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                >
                  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 8H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 1H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 15H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <h2 className="text-[25px] font-bold text-[#1E1E1E]">Welcome Back, Alex 👋</h2>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Language Switcher - Desktop */}
                <div className="hidden sm:block mr-2">
                  <div className="flex items-center gap-2 bg-[#E7F0E6] px-2 py-1 rounded-md">
                    <span className="text-sm text-[#2B180A] font-medium">Language:</span>
                    <button 
                      onClick={() => changeLanguage('en')} 
                      className={`px-2 py-1 ${i18n.language === 'en' ? 'bg-[#3DD559] text-white' : 'text-[#2B180A]'} rounded text-xs font-medium transition-colors`}
                    >
                      EN
                    </button>
                    <button 
                      onClick={() => changeLanguage('he')} 
                      className={`px-2 py-1 ${i18n.language === 'he' ? 'bg-[#3DD559] text-white' : 'text-[#2B180A]'} rounded text-xs font-medium transition-colors`}
                    >
                      HE
                    </button>
                  </div>
                </div>
                
                {/* Search Button */}
                <button className="w-[45px] h-[45px] flex items-center justify-center rounded-full bg-[rgba(16,106,2,0.1)] hover:bg-[rgba(16,106,2,0.2)] transition-colors">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.58329 17.5C13.9555 17.5 17.5 13.9555 17.5 9.58329C17.5 5.21104 13.9555 1.66663 9.58329 1.66663C5.21104 1.66663 1.66663 5.21104 1.66663 9.58329C1.66663 13.9555 5.21104 17.5 9.58329 17.5Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.3333 18.3333L16.6666 16.6666" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {/* Notification Button */}
                <button className="w-[45px] h-[45px] flex items-center justify-center rounded-full bg-[#E7F0E6] hover:bg-[#d3e2d1] transition-colors relative">
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 2.625C7.875 2.625 5.25 5.25 5.25 7.875V10.5L3.5 12.25V14H17.5V12.25L15.75 10.5V7.875C15.75 5.25 13.125 2.625 10.5 2.625Z" stroke="#2B180A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="13.5" cy="5.5" r="4.5" fill="#FF0000"/>
                  </svg>
                </button>
                
                {/* Profile */}
                <div className="flex items-center gap-[6px] cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors">
                  <div className="w-[45px] h-[45px] rounded-full overflow-hidden">
                    <Image 
                      src="/images/profile.jpg" 
                      alt="Profile"
                      width={45}
                      height={45}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[16px] font-semibold text-[#201D1D] capitalize">Alex Dube</span>
                    <span className="text-[14px] text-[#636363] capitalize">Admin</span>
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
      <div className="relative w-full min-h-screen z-10 lg:hidden bg-[#1E1E1E]">
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
        
        {/* Mobile Content */}
        <div className="p-4 relative z-10">
          {/* White Background Container */}
          <div className="bg-white rounded-[25px] p-5 mx-2">
            {/* Mobile Header */}
            <div className="flex justify-between items-center mb-6">
              <button 
                className="w-[38px] h-[38px] flex items-center justify-center rounded-[10px] bg-[#3DD559] hover:bg-[#2bbd47] transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.375 7H14.625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.375 2.5H14.625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.375 11.5H14.625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <div className="flex items-center gap-2">
                {/* Language Switcher - Mobile */}
                <button 
                  onClick={() => changeLanguage(i18n.language === 'en' ? 'he' : 'en')}
                  className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-[rgba(16,106,2,0.1)] text-[#2B180A] font-medium text-sm hover:bg-[rgba(16,106,2,0.2)] transition-colors"
                >
                  {i18n.language === 'en' ? 'EN' : 'HE'}
                </button>
                
                {/* Search Button */}
                <button className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-[rgba(16,106,2,0.1)] hover:bg-[rgba(16,106,2,0.2)] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.625 15.75C12.56 15.75 15.75 12.56 15.75 8.625C15.75 4.68997 12.56 1.5 8.625 1.5C4.68997 1.5 1.5 4.68997 1.5 8.625C1.5 12.56 4.68997 15.75 8.625 15.75Z" stroke="#2B180A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.5 16.5L15 15" stroke="#2B180A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {/* Notification Button */}
                <button className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-[#3DD559] hover:bg-[#2bbd47] transition-colors relative">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 2.25C6.75 2.25 4.5 4.5 4.5 6.75V9L3 10.5V12H15V10.5L13.5 9V6.75C13.5 4.5 11.25 2.25 9 2.25Z" stroke="#2B180A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  
                  {/* Notification Badge */}
                  <div className="absolute top-1 right-1 w-[13px] h-[13px] rounded-full bg-[#FF0000] flex items-center justify-center">
                    <span className="text-[10px] font-extrabold text-white">1</span>
                  </div>
                </button>
                
                {/* Profile */}
                <div className="w-[38px] h-[38px] rounded-full overflow-hidden">
                  <Image 
                    src="/images/profile.jpg" 
                    alt="Profile"
                    width={38}
                    height={38}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Welcome Message */}
            <h2 className="text-[20px] font-bold text-[#1E1E1E] mb-6">Welcome Back, Alex 👋</h2>
            
            {/* Mobile Stats Cards */}
            <MobileStatsCards />
            
            {/* Mobile Charts Section */}
            <div className="flex flex-col gap-6 mt-6">
              <MobileClientDistributionChart />
              <MobileFlaggedIssues />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 