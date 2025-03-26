'use client'

import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import ProfileAvatar from '@/components/dashboard/ProfileAvatar'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useUser } from '@/context/UserContext'

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
  notificationCount = 3,
  profileName = 'Coach',
  profileRole = 'admin',
  isMobile = false
}) => {
  const { t } = useTranslation()
  const { profile } = useUser()

  // Default page icon if none provided
  const defaultIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="13.5" y="2" width="8.5" height="8.5" fill="#636363"/>
      <rect x="2" y="13.5" width="8.5" height="8.5" fill="#636363"/>
      <rect x="2" y="2" width="8.5" height="8.5" fill="#636363"/>
      <rect x="13.5" y="13.5" width="8.5" height="8.5" fill="#636363"/>
    </svg>
  )

  // Desktop version of top bar
  if (!isMobile) {
    return (
      <header className="flex items-center justify-between bg-white rounded-[20px] px-6 py-5 mb-6">
        <div className="flex items-center gap-6">
          {/* Toggle Sidebar Button */}
          <button 
            className="w-[45px] h-[45px] flex items-center justify-center rounded-[10px] bg-[#3DD559]"
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? t('common.hideSidebar') : t('common.showSidebar')}
          >
            <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 8H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 1H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 15H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex items-center gap-4">
            {pageIcon || defaultIcon}
            <h2 className="text-[25px] font-bold text-[#1E1E1E]">
              {pageTitle}
            </h2>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
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
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7C16 5.4087 15.3679 3.88258 14.2426 2.75736C13.1174 1.63214 11.5913 1 10 1C8.4087 1 6.88258 1.63214 5.75736 2.75736C4.63214 3.88258 4 5.4087 4 7C4 14 1 16 1 16H19C19 16 16 14 16 7Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.73 16C11.5542 16.3031 11.3018 16.5547 10.9982 16.7295C10.6946 16.9044 10.3504 16.9965 10 16.9965C9.64964 16.9965 9.30541 16.9044 9.00179 16.7295C8.69818 16.5547 8.44583 16.3031 8.27 16" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {notificationCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[#FF3B30] rounded-full text-white text-[10px] font-bold">
                {notificationCount}
              </div>
            )}
          </button>
          
          {/* Profile */}
          <div className={`flex items-center gap-[6px] ${isRtl ? 'flex-row-reverse' : ''}`}>
            <ProfileAvatar 
              src={profile.image} 
              alt={profileName}
              size={45}
            />
            <div className="flex flex-col">
              <span className="text-[16px] font-semibold text-[#201D1D] capitalize">{profileName}</span>
              <span className="text-[14px] text-[#636363] capitalize">{t(`common.${profileRole}`)}</span>
            </div>
          </div>
        </div>
      </header>
    )
  }
  
  // Mobile version of top bar
  return (
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
      
      <div className="flex items-center gap-2">
        <LanguageSwitcher isMobile={true} />
        <ProfileAvatar 
          src={profile.image} 
          alt={profileName}
          size={40}
        />
      </div>
    </header>
  )
}

export default TopBar 