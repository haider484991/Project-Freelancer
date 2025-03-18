'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LanguageSwitcher from '../LanguageSwitcher'

interface SidebarProps {
  isMobile?: boolean;
}

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="13.5" y="2" width="8.5" height="8.5" fill="currentColor"/>
        <rect x="2" y="13.5" width="8.5" height="8.5" fill="currentColor"/>
        <rect x="2" y="2" width="8.5" height="8.5" fill="currentColor"/>
        <rect x="13.5" y="13.5" width="8.5" height="8.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    title: 'Client Management',
    href: '/dashboard/clients',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 15.2C14.2091 15.2 16 13.4091 16 11.2C16 8.99086 14.2091 7.2 12 7.2C9.79086 7.2 8 8.99086 8 11.2C8 13.4091 9.79086 15.2 12 15.2Z" fill="currentColor"/>
        <path d="M18 19.2C18 16.4 15.3 14.2 12 14.2C8.7 14.2 6 16.4 6 19.2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    title: 'Coaching Groups Management',
    href: '/dashboard/groups',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" fill="currentColor"/>
        <path d="M16.5 11C18.1569 11 19.5 9.65685 19.5 8C19.5 6.34315 18.1569 5 16.5 5C14.8431 5 13.5 6.34315 13.5 8C13.5 9.65685 14.8431 11 16.5 11Z" fill="currentColor"/>
        <path d="M9 13C6.33 13 1 14.34 1 17V19H17V17C17 14.34 11.67 13 9 13Z" fill="currentColor"/>
        <path d="M16.5 13C15.71 13 14.73 13.16 13.69 13.44C14.76 14.45 15.5 15.74 15.5 17V19H23V17C23 14.34 18.67 13 16.5 13Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    title: 'WhatsApp Message Automation',
    href: '/dashboard/automation',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.5 3.5L3.5 10L10 13.5L13.5 20.5L20.5 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Data & Statistics',
    href: '/dashboard/data-management',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 7H21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  }
]

export default function Sidebar({ isMobile = false }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={`${isMobile ? 'relative w-full' : 'w-[304px] h-full'} p-[30px] z-20`}>
      {/* Logo */}
      <div className="flex flex-col gap-[5px]">
        <h1 className="font-michael text-primary text-[29px] uppercase tracking-[0.04em] leading-[100%] font-bold">
          FITTrack
        </h1>
        <p className="text-white text-[11px] font-semibold tracking-[0.04em] capitalize">
          fitness & nutrition tracking
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className={`${isMobile ? 'mt-[30px]' : 'mt-[179px]'} flex flex-col gap-[36px]`}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-[14px] ${
                isActive ? 'text-primary' : 'text-[#CFCFCF]'
              } hover:text-primary transition-colors`}
            >
              <span className="w-6 h-6">
                {item.icon}
              </span>
              <span className="text-[16px] font-semibold">{item.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* Language Switcher */}
      <div className="mt-8 pt-8 border-t border-gray-700">
        <div className="flex flex-col gap-2">
          <span className="text-[#CFCFCF] text-sm font-medium">Language</span>
          <LanguageSwitcher />
        </div>
      </div>
    </aside>
  )
} 