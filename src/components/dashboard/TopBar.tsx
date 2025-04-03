'use client'

import React, { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProfileAvatar from '@/components/dashboard/ProfileAvatar'
import { useUser } from '@/context/UserContext'
import { useAppContext } from '@/context/AppContext'
import NotificationPanel from '@/components/dashboard/NotificationPanel'

interface TopBarProps {
  pageTitle: string
  pageIcon?: ReactNode
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  isRtl: boolean
  notificationCount?: number
  profileName?: string
  profileRole?: string
  isMobile?: boolean
}

const TopBar: React.FC<TopBarProps> = ({
  pageTitle,
  pageIcon,
  isSidebarOpen,
  onToggleSidebar,
  isRtl,
  notificationCount,
  profileName = 'Coach',
  profileRole = 'admin',
  isMobile = false
}) => {
  const { t } = useTranslation()
  const { profile } = useUser()
  const { notificationCount: contextNotificationCount } = useAppContext()
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false)
  
  // Use provided notificationCount or get it from context if available
  const displayNotificationCount = notificationCount !== undefined 
    ? notificationCount 
    : (contextNotificationCount || profile.notificationCount || 0)

  // Default page icon if none provided
  const defaultIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="13.5" y="2" width="8.5" height="8.5" fill="#636363"/>
      <rect x="2" y="13.5" width="8.5" height="8.5" fill="#636363"/>
      <rect x="2" y="2" width="8.5" height="8.5" fill="#636363"/>
      <rect x="13.5" y="13.5" width="8.5" height="8.5" fill="#636363"/>
    </svg>
  )
  
  // Handle opening/closing notification panel
  const toggleNotificationPanel = () => {
    setIsNotificationPanelOpen(!isNotificationPanelOpen)
  }

  // Desktop version of top bar
  if (!isMobile) {
    return (
      <div className="flex flex-col">
        <div className="flex justify-between items-center pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button
              className="h-10 w-10 rounded-[10px] flex items-center justify-center bg-gray-100 hover:bg-gray-200"
              onClick={onToggleSidebar}
              aria-label={isSidebarOpen ? t('common.collapseSidebar') : t('common.expandSidebar')}
            >
              {isSidebarOpen ? (
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5 1L17 7L11.5 13" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1 7H17" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.5 1L1 7L6.5 13" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1 7H17" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
            
            <div className="flex items-center gap-3">
              <div className="min-w-[24px]">
                {pageIcon || defaultIcon}
              </div>
              <h1 className="text-2xl font-bold text-[#1E1E1E]">{pageTitle}</h1>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Mobile version of top bar
  return (
    <>
      <header className="flex items-center justify-between bg-white p-4 relative z-10">
        <div className="flex items-center gap-3">
          <button 
            className="w-[40px] h-[40px] flex items-center justify-center rounded-[10px] bg-[#3DD559]"
            onClick={onToggleSidebar}
            aria-label={t('common.openMenu')}
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
      </header>
      
      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
      />
    </>
  )
}

export default TopBar 