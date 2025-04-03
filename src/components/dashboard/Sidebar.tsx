'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LanguageSwitcher from '../LanguageSwitcher'
import LogoutButton from '../LogoutButton'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const menuItems = [
  {
    title: 'sidebar.dashboard',
    href: '/dashboard',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 2H18.5C19.33 2 20 2.67 20 3.5V8.5C20 9.33 19.33 10 18.5 10H13.5C12.67 10 12 9.33 12 8.5V3.5C12 2.67 12.67 2 13.5 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 14H10.5C11.33 14 12 14.67 12 15.5V20.5C12 21.33 11.33 22 10.5 22H5.5C4.67 22 4 21.33 4 20.5V15.5C4 14.67 4.67 14 5.5 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 2H10.5C11.33 2 12 2.67 12 3.5V8.5C12 9.33 11.33 10 10.5 10H5.5C4.67 10 4 9.33 4 8.5V3.5C4 2.67 4.67 2 5.5 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.5 14H18.5C19.33 14 20 14.67 20 15.5V20.5C20 21.33 19.33 22 18.5 22H13.5C12.67 22 12 21.33 12 20.5V15.5C12 14.67 12.67 14 13.5 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    title: 'sidebar.clients',
    href: '/dashboard/clients',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    title: 'sidebar.groups',
    href: '/dashboard/groups',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.9 17.7L19.1 20.7C19.4 21.1 20 21.1 20.3 20.7L22.5 17.7C22.7 17.4 22.5 17 22.1 17H17.3C16.9 17 16.7 17.4 16.9 17.7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1.5 17L2.5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.4 6.5C13.4 7.3 13.1 8 12.6 8.5C11.9 9.3 10.6 9.7 9.1 9.8C9 9.8 8.9 9.8 8.8 9.8C7.6 9.8 6.6 9.4 5.9 8.8C5.2 8.2 4.9 7.3 4.9 6.4C4.9 4.3 7 2.7 9.2 2.7C10.6 2.7 11.9 3.3 12.7 4.2C13.1 4.7 13.4 5.5 13.4 6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 6.5C22 8.7 20.2 10.5 18 10.5H17.5C17.5 10.5 16.5 14 12 14C7.5 14 6.5 10.5 6.5 10.5L5.5 7L7 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    title: 'sidebar.automation',
    href: '/dashboard/automation',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.16992 7.43994L11.9999 12.5499L20.7699 7.46994" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 21.61V12.54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.93 2.48004L4.59 5.44004C3.38 6.11004 2.39 7.79004 2.39 9.17004V14.82C2.39 16.2 3.38 17.88 4.59 18.55L9.94 21.52C11.07 22.15 12.94 22.15 14.08 21.52L19.4 18.55C20.61 17.88 21.6 16.2 21.6 14.82V9.17004C21.6 7.79004 20.61 6.11004 19.4 5.44004L14.06 2.47004C12.93 1.84004 11.07 1.84004 9.93 2.48004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    title: 'sidebar.dataManagement',
    href: '/dashboard/data-management',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12.9799V11.0199C2 10.0799 2.85 9.20994 3.9 9.20994C5.71 9.20994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L8.21 2.53994C8.76 2.21994 9.78 2.21994 10.33 2.53994L12.3 3.77994C13.21 4.29994 13.52 5.46994 13 6.36994C12.09 7.93994 12.83 9.20994 14.64 9.20994C15.69 9.20994 16.54 10.0699 16.54 11.0199V12.9799C16.54 13.9199 15.69 14.7799 14.64 14.7799C12.83 14.7799 12.09 16.0599 13 17.6299C13.52 18.5399 13.21 19.6999 12.3 20.2199L10.33 21.4599C9.78 21.7799 8.76 21.7799 8.21 21.4599L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.9799Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.25 12C9.25 12.83 9.92 13.5 10.75 13.5C11.58 13.5 12.25 12.83 12.25 12C12.25 11.17 11.58 10.5 10.75 10.5C9.92 10.5 9.25 11.17 9.25 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    title: 'sidebar.settings',
    href: '/dashboard/settings',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
]

// Filter out the hidden menu items
const visibleMenuItems = menuItems.filter(item => 
  item.href !== '/dashboard' && // Hide Dashboard
  item.href !== '/dashboard/automation' && // Hide WhatsApp Automation
  item.href !== '/dashboard/data-management' // Hide Data Analytics
);

// Add a new "Reportings" menu item
const updatedMenuItems = [
  ...visibleMenuItems,
  {
    title: 'sidebar.reportings',
    href: '/dashboard/reportings',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 10H5C3.9 10 3 9.1 3 8V5C3 3.9 3.9 3 5 3H8C9.1 3 10 3.9 10 5V8C10 9.1 9.1 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 10H16C14.9 10 14 9.1 14 8V5C14 3.9 14.9 3 16 3H19C20.1 3 21 3.9 21 5V8C21 9.1 20.1 10 19 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 21H5C3.9 21 3 20.1 3 19V16C3 14.9 3.9 14 5 14H8C9.1 14 10 14.9 10 16V19C10 20.1 9.1 21 8 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 15.55H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 19.55H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
];

export default function Sidebar({ isMobile = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { t, i18n } = useTranslation()
  const [isRtl, setIsRtl] = useState(false)
  
  // Check if current language is RTL
  useEffect(() => {
    const rtlLanguages = ['he', 'ar']
    setIsRtl(rtlLanguages.includes(i18n.language))
  }, [i18n.language])
  
  return (
    <aside className={`${isMobile 
      ? 'relative w-full text-white' 
      : 'w-[304px] h-full text-white'
    } p-[30px] backdrop-blur-sm z-20 ${isRtl ? 'rtl' : 'ltr'} flex flex-col min-h-screen`}>
      {/* Logo */}
      <div className="flex flex-col gap-[5px] bg-black/30 p-3 rounded-[25px]">
        <h1 className="font-michael text-primary text-[29px] uppercase tracking-[0.04em] leading-[100%] font-bold text-shadow-lg">
          FITTrack
        </h1>
        <p className="text-white text-[11px] font-semibold tracking-[0.04em] capitalize text-shadow-md">
          fitness & nutrition tracking
        </p>
      </div>

      {/* Navigation Menu - without profile section */}
      <nav className="mt-[60px] flex flex-col gap-[20px]">
        {updatedMenuItems.map((item) => {
          // Check if the current path starts with this item's href
          const isActive = item.href === '/dashboard' 
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-[14px] text-white hover:text-primary transition-colors ${isRtl ? 'flex-row-reverse' : ''} 
              p-3 rounded-[25px] ${isActive ? 'bg-black/40 text-primary' : 'hover:bg-black/20'} text-shadow-md`}
              onClick={isMobile && onClose ? onClose : undefined}
            >
              <span className="w-6 h-6">
                {item.icon}
              </span>
              <span className="text-[16px] font-semibold">{t(item.title)}</span>
            </Link>
          )
        })}
      </nav>

      {/* Flex spacer to push down the bottom elements */}
      <div className="flex-grow"></div>

      {/* Language Switcher */}
      <div className="mt-[36px] mb-[20px]">
        <LanguageSwitcher />
      </div>

      {/* Logout Button - moved to the very bottom with more space */}
      <div className="mt-auto pt-8">
        <LogoutButton className="w-full" />
      </div>
      
      {/* Custom styles for text shadow */}
      <style jsx global>{`
        .text-shadow-sm {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        .text-shadow-md {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
        }
        .text-shadow-lg {
          text-shadow: 0 4px 6px rgba(0, 0, 0, 0.9);
        }
      `}</style>
    </aside>
  )
}