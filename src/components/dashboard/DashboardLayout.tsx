'use client'

import React, { useState, useEffect, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import { useUser } from '@/context/UserContext'

interface DashboardLayoutProps {
  children: ReactNode
  pageTitle: string
  pageIcon?: React.ReactNode
  profileName?: string
  profileRole?: string
  notificationCount?: number
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  pageTitle,
  pageIcon,
  profileName,
  profileRole,
  notificationCount
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'he' || i18n.language === 'ar'
  
  // Get user profile data from context
  const { profile } = useUser()
  
  // Use props if provided, otherwise use context values
  const displayName = profileName || profile.name
  const displayRole = profileRole || profile.role
  const displayNotificationCount = notificationCount !== undefined ? notificationCount : profile.notificationCount

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isMobileMenuOpen])

  // Disable scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMobileMenuOpen])

  return (
    <div className={`min-h-screen bg-black relative overflow-hidden ${isRtl ? 'rtl' : 'ltr'}`}>
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
        <div className="fixed inset-0 backdrop-blur-md bg-[rgba(19,167,83,0.15)] z-50 overflow-auto">
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
      
      {/* Desktop Layout */}
      <div className="relative w-full min-h-screen z-10 hidden lg:flex">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ease-in-out ${isRtl ? 'right-0' : 'left-0'} fixed top-0 h-full z-20 ${isSidebarOpen ? (isRtl ? 'translate-x-0' : 'translate-x-0') : (isRtl ? 'translate-x-[100%]' : 'translate-x-[-100%]')}`}>
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className={`transition-all duration-300 ease-in-out flex-1 ${isSidebarOpen ? (isRtl ? 'mr-[304px]' : 'ml-[304px]') : (isRtl ? 'mr-0' : 'ml-0')} p-5`}>
          <div className="max-w-[1600px] mx-auto px-8 py-8 bg-white rounded-[20px] shadow">
            {/* Top Bar */}
            <TopBar
              pageTitle={pageTitle}
              pageIcon={pageIcon}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              isRtl={isRtl}
              notificationCount={displayNotificationCount}
              profileName={displayName}
              profileRole={displayRole}
              isMobile={false}
            />
            
            {/* Main Content Container */}
            <div className="mt-6">
              {children}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Layout */}
      <div className={`relative w-full min-h-screen z-10 lg:hidden bg-black ${isRtl ? 'rtl' : 'ltr'}`}>
        {/* Mobile Top Bar */}
        <TopBar
          pageTitle={pageTitle}
          pageIcon={pageIcon}
          isSidebarOpen={isMobileMenuOpen}
          onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isRtl={isRtl}
          profileName={displayName}
          profileRole={displayRole}
          notificationCount={displayNotificationCount}
          isMobile={true}
        />
        
        {/* Mobile Content */}
        <div className="p-4 relative z-10">
          <div className="bg-white rounded-[20px] p-4 mb-4 shadow">
            <h2 className="text-[20px] font-bold text-[#1E1E1E] mb-4">{pageTitle}</h2>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout 