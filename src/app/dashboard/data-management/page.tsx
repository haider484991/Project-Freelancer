'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Sidebar from '@/components/dashboard/Sidebar'
import ProfileAvatar from '@/components/dashboard/ProfileAvatar'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useAppContext } from '@/context/AppContext'
import { useTranslation } from 'react-i18next'

export default function DataManagementPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState('Week 1')
  const [selectedClientFilter, setSelectedClientFilter] = useState('All Clients')
  const { clients } = useAppContext()
  const { t, i18n } = useTranslation()
  const [isRtl, setIsRtl] = useState(false)
  
  // Derived data for statistics
  const activeClients = clients.filter(client => client.status === 'active')
  const inactiveClients = clients.filter(client => client.status === 'inactive')
  const complianceRate = clients.length > 0 
    ? Math.round((clients.filter(client => client.compliance === 'compliant').length / clients.length) * 100) 
    : 0
    
  // Data for charts
  const weeklyData = [
    { week: 'Week 1', active: activeClients.length, inactive: inactiveClients.length },
    { week: 'Week 2', active: Math.round(activeClients.length * 0.9), inactive: Math.round(inactiveClients.length * 1.1) },
    { week: 'Week 3', active: Math.round(activeClients.length * 1.1), inactive: Math.round(inactiveClients.length * 0.9) },
    { week: 'Week 4', active: Math.round(activeClients.length * 1.2), inactive: Math.round(inactiveClients.length * 0.8) }
  ]
  
  // Calculate max values for scaling the chart
  const maxActiveValue = Math.max(...weeklyData.map(data => data.active), 1)
  const maxInactiveValue = Math.max(...weeklyData.map(data => data.inactive), 1)
  const maxTotalValue = Math.max(...weeklyData.map(data => data.active + data.inactive), 1)
  
  // Caloric data (mock data as example)
  const caloricData = [
    { week: 'Week 1', calories: 1800 },
    { week: 'Week 2', calories: 1600 },
    { week: 'Week 3', calories: 1300 },
    { week: 'Week 4', calories: 1500 }
  ]
  
  // Function to handle client filter change
  const handleClientFilterChange = (filter: string) => {
    setSelectedClientFilter(filter)
  }
  
  // Function to handle week selection change
  const handleWeekChange = (week: string) => {
    setSelectedWeek(week)
  }
  
  // Available weeks for selection
  const availableWeeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  
  // Week selection dropdown component
  const WeekSelector = () => {
    const [isOpen, setIsOpen] = useState(false)
    
    return (
      <div className="relative">
        <div 
          className="flex items-center bg-[#F3F7F3] rounded-[60px] py-2 px-4 gap-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-sm font-semibold text-primary">{selectedWeek}</span>
          <svg 
            width="10" 
            height="6" 
            viewBox="0 0 10 6" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          >
            <path d="M1 1L5 5L9 1" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {isOpen && (
          <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg z-10 py-2 min-w-[120px]">
            {availableWeeks.map(week => (
              <div 
                key={week} 
                className={`px-4 py-2 hover:bg-[#F3F7F3] cursor-pointer ${selectedWeek === week ? 'bg-[#F3F7F3] text-primary' : ''}`}
                onClick={() => {
                  handleWeekChange(week)
                  setIsOpen(false)
                }}
              >
                {week}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
  
  // Mobile week selector component
  const MobileWeekSelector = () => {
    const [isOpen, setIsOpen] = useState(false)
    
    return (
      <div className="relative">
        <div 
          className="flex items-center bg-[#F3F7F3] rounded-[60px] py-1 px-2 gap-1 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-xs font-semibold text-primary">{selectedWeek}</span>
          <svg 
            width="8" 
            height="5" 
            viewBox="0 0 10 6" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          >
            <path d="M1 1L5 5L9 1" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {isOpen && (
          <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg z-10 py-2 min-w-[100px]">
            {availableWeeks.map(week => (
              <div 
                key={week} 
                className={`px-3 py-1 text-xs hover:bg-[#F3F7F3] cursor-pointer ${selectedWeek === week ? 'bg-[#F3F7F3] text-primary' : ''}`}
                onClick={() => {
                  handleWeekChange(week)
                  setIsOpen(false)
                }}
              >
                {week}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
  
  // Client filter dropdown component
  const ClientFilterDropdown = () => {
    const [isOpen, setIsOpen] = useState(false)
    const filterOptions = ['All Clients', 'Active Clients', 'Inactive Clients']
    
    return (
      <div className="relative">
        <div 
          className="flex items-center gap-2 bg-[rgba(16,106,2,0.1)] rounded-[43px] py-3 px-6 cursor-pointer relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-[#545454] text-sm font-normal">{selectedClientFilter}</span>
          <svg 
            width="10" 
            height="6" 
            viewBox="0 0 10 6" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          >
            <path d="M1 1L5 5L9 1" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg z-10 py-2 min-w-[150px]">
            {filterOptions.map(option => (
              <div 
                key={option} 
                className={`px-4 py-2 hover:bg-[#F3F7F3] cursor-pointer ${selectedClientFilter === option ? 'bg-[#F3F7F3] text-primary' : ''}`}
                onClick={() => {
                  handleClientFilterChange(option)
                  setIsOpen(false)
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
  
  // Mobile client filter dropdown
  const MobileClientFilterDropdown = () => {
    const [isOpen, setIsOpen] = useState(false)
    const filterOptions = ['All Clients', 'Active Clients', 'Inactive Clients']
    
    return (
      <div className="relative">
        <div 
          className="flex items-center gap-1 bg-[rgba(16,106,2,0.1)] rounded-[20px] py-2 px-3 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-[#545454] text-xs font-normal">{selectedClientFilter}</span>
          <svg 
            width="8" 
            height="5" 
            viewBox="0 0 8 5" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          >
            <path d="M1 1L4 4L7 1" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg z-10 py-2 min-w-[120px]">
            {filterOptions.map(option => (
              <div 
                key={option} 
                className={`px-3 py-1 text-xs hover:bg-[#F3F7F3] cursor-pointer ${selectedClientFilter === option ? 'bg-[#F3F7F3] text-primary' : ''}`}
                onClick={() => {
                  handleClientFilterChange(option)
                  setIsOpen(false)
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
  
  // Handle export data
  const handleExportData = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Compliance', 'Goals Met']
    const csvContent = [
      headers.join(','),
      ...clients.map(client => 
        [
          client.name,
          client.dietaryGoal,
          client.group,
          client.status,
          client.compliance,
          `${client.goalsMet}%`
        ].join(',')
      )
    ].join('\n')
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'client_statistics.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
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
                  aria-label={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                >
                  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 8H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 1H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 15H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <h2 className="text-[25px] font-bold text-[#1E1E1E]">{t('Data & Statistics')}</h2>
              </div>
              
              <div className="flex items-center gap-[5px]">
                {/* Search Button */}
                <button className="w-[45px] h-[45px] flex items-center justify-center rounded-full bg-[rgba(16,106,2,0.1)]">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.58329 17.5C13.9555 17.5 17.5 13.9555 17.5 9.58329C17.5 5.21104 13.9555 1.66663 9.58329 1.66663C5.21104 1.66663 1.66663 5.21104 1.66663 9.58329C1.66663 13.9555 5.21104 17.5 9.58329 17.5Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.3333 18.3333L16.6666 16.6666" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {/* Language Switcher */}
                <div className="hidden md:block">
                  <LanguageSwitcher />
                </div>
                
                {/* Notification Button */}
                <button className="w-[45px] h-[45px] flex items-center justify-center rounded-full bg-[#E7F0E6] relative">
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 2.625C7.875 2.625 5.25 5.25 5.25 7.875V10.5L3.5 12.25V14H17.5V12.25L15.75 10.5V7.875C15.75 5.25 13.125 2.625 10.5 2.625ZM10.5 15.75C7.875 15.75 5.25 18.25 5.25 20.75V23.5L3.5 25.25V27H17.5V25.25L15.75 23.5V20.75C15.75 18.25 13.125 15.75 10.5 15.75Z" stroke="#2B180A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="13.5" cy="5.5" r="4.5" fill="#FF0000"/>
                  </svg>
                </button>
                
                {/* Profile */}
                <div className="flex items-center gap-[6px]">
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
                    <h3 className="text-white font-semibold">{t('Alex Dube')}</h3>
                    <p className="text-white/70 text-sm">{t('Admin')}</p>
                  </div>
                </div>
              </div>
            </header>
            
            {/* Data & Statistics Content */}
            <div>
              {/* Top filter section */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <ClientFilterDropdown />
                </div>
                
                <button 
                  className="flex items-center gap-3 bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-[60px] py-3 px-6 text-white"
                  onClick={handleExportData}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.3334 8.6665V12.6665H4.08342V8.6665H3.3334V12.6665C3.3334 13.3998 3.93341 13.9998 4.08342 13.9998H11.3334C12.0667 13.9998 12.6667 13.3998 12.6667 12.6665V8.6665H11.3334ZM10.6667 7.99984L9.72008 7.05317L8.66675 8.1065V3.33317H7.33341V8.1065L6.28008 7.05317L5.33341 7.99984L8.00008 10.6665L10.6667 7.99984Z" fill="white"/>
                  </svg>
                  <span className="text-white text-sm font-semibold">{t('Export')}</span>
                </button>
              </div>
              
              {/* Client Overview Chart */}
              <div className="mb-6 bg-white rounded-[30px] p-6 shadow-md border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[18px] font-bold text-[#1E1E1E] capitalize">{t('Overview All Clients')}</h3>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-b from-[#13A753] to-[#1E2120]"></div>
                      <span className="text-[#2B180A] text-sm">{t('Total Active')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#F45C5C]"></div>
                      <span className="text-[#2B180A] text-sm">{t('Inactive')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex">
                  {/* Y-Axis Labels */}
                  <div className="flex flex-col justify-between h-[250px] pr-4 py-2">
                    <span className="text-[#636363] text-sm">{maxTotalValue}</span>
                    <span className="text-[#636363] text-sm">{Math.round(maxTotalValue * 0.8)}</span>
                    <span className="text-[#636363] text-sm">{Math.round(maxTotalValue * 0.6)}</span>
                    <span className="text-[#636363] text-sm">{Math.round(maxTotalValue * 0.4)}</span>
                    <span className="text-[#636363] text-sm">{Math.round(maxTotalValue * 0.2)}</span>
                    <span className="text-[#636363] text-sm">0</span>
                  </div>

                  {/* Chart Area */}
                  <div className="flex-1 relative">
                    {/* Grid Lines */}
                    <div className="absolute inset-0">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={`grid-${i}`} className="absolute border-t border-[rgba(15,105,2,0.2)] w-full" style={{ top: `${i * 20}%` }}></div>
                      ))}
                    </div>

                    {/* Bar Chart */}
                    <div className="flex justify-around h-[250px] items-end">
                      {/* Week bars, each containing active and inactive */}
                      {weeklyData.map((data, i) => (
                        <div key={`week-${i+1}`} className="flex items-end space-x-2">
                          {/* Active clients bar */}
                          <div className="w-[40px] group">
                            <div 
                              className="w-full bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-t-md" 
                              style={{ height: `${(data.active / maxTotalValue) * 250}px` }}
                            ></div>
                          </div>
                          {/* Inactive clients bar */}
                          <div className="w-[40px] group">
                            <div 
                              className="w-full bg-[#F45C5C] rounded-t-md" 
                              style={{ height: `${(data.inactive / maxTotalValue) * 250}px` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* X-Axis Labels */}
                <div className="flex justify-around mt-4 text-[#636363] text-sm px-16">
                  {weeklyData.map((data) => (
                    <span key={data.week}>{data.week}</span>
                  ))}
                </div>
              </div>
              
              {/* Caloric Trends Chart */}
              <div className="bg-white rounded-[30px] p-6 shadow-md mb-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[18px] font-bold text-[#1E1E1E] capitalize">{t('Caloric Trends')}</h3>
                  
                  <WeekSelector />
                </div>

                {/* Y-Axis Labels */}
                <div className="flex">
                  <div className="flex flex-col justify-between h-[300px] pr-4 py-2">
                    <span className="text-[#636363] text-sm">2500</span>
                    <span className="text-[#636363] text-sm">2000</span>
                    <span className="text-[#636363] text-sm">1500</span>
                    <span className="text-[#636363] text-sm">1000</span>
                    <span className="text-[#636363] text-sm">500</span>
                    <span className="text-[#636363] text-sm">0</span>
                  </div>

                  {/* Chart Visualization */}
                  <div className="flex-1 relative">
                    {/* Grid Lines */}
                    <div className="absolute inset-0">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={`grid-${i}`} className="absolute border-t border-[rgba(15,105,2,0.2)] w-full" style={{ top: `${i * 20}%` }}></div>
                      ))}
                    </div>

                    {/* Chart Line */}
                    <div className="relative h-[300px]">
                      <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
                        <path 
                          d="M0,240 C40,200 80,220 120,200 C160,180 200,160 240,150 C280,140 320,130 360,130 C400,130 440,140 480,150 C520,160 560,170 600,160 C640,150 680,130 720,120 C760,110 800,100 800,100" 
                          stroke="url(#green-gradient)" 
                          strokeWidth="3" 
                          fill="none"
                        />
                        
                        {/* Define gradient for line */}
                        <defs>
                          <linearGradient id="green-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#13A753" />
                            <stop offset="100%" stopColor="#1E2120" />
                          </linearGradient>
                        </defs>
                        
                        {/* Dots */}
                        {caloricData.map((data, index) => {
                          const x = 200 * index + 120;
                          const y = 300 - (data.calories / 2500) * 300;
                          return (
                            <circle key={`dot-${index}`} cx={x} cy={y} r="6" fill="#FFFFFF" stroke="url(#green-gradient)" strokeWidth="3" />
                          );
                        })}
                      </svg>
                      
                      {/* Tooltip Example (positioned on one of the data points) */}
                      <div className="absolute top-[130px] left-[360px] transform -translate-x-1/2 -translate-y-16 bg-gradient-to-b from-[#13A753] to-[#1E2120] p-2 rounded-[10px] shadow-md z-10">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <span className="text-sm text-white">{t('Week 3')}</span>
                        </div>
                        <span className="font-bold text-white text-[18px]">{t('Calories : 1300')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* X-Axis Labels */}
                <div className="flex justify-between px-10 mt-4 text-[#636363] text-sm">
                  {caloricData.map((data) => (
                    <span key={data.week}>{data.week}</span>
                  ))}
                </div>
              </div>
              
              {/* Compliance and Inactive Clients Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Compliance Rates Card */}
                <div className="bg-white rounded-[30px] p-6 shadow-md border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[18px] font-bold text-[#1E1E1E] capitalize">{t('Compliance Rates')}</h3>
                    <WeekSelector />
                  </div>

                  <div className="flex flex-col items-center mt-6">
                    <div className="relative w-[120px] h-[120px] mb-4">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="white"></circle>
                        <circle 
                          cx="18" cy="18" r="16" 
                          fill="none" 
                          stroke="#13A753" 
                          strokeWidth="3" 
                          strokeDasharray="100.5" 
                          strokeDashoffset={100.5 - (complianceRate / 100) * 100.5}
                          transform="rotate(-90 18 18)"
                        ></circle>
                      </svg>
                      
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[#636363] text-xs">{t('Rate')}</span>
                        <span className="text-[#1E1E1E] text-xl font-bold">{complianceRate} %</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#DAEEDA] w-full py-3 rounded-[10px] text-center">
                      <h4 className="text-[#1E1E1E] text-base font-semibold uppercase">{t('Compliance')}</h4>
                      <p className="text-[#636363] text-sm">{t('For')} {selectedWeek}</p>
                    </div>
                  </div>
                </div>

                {/* Inactive Clients Card */}
                <div className="bg-white rounded-[30px] p-6 shadow-md lg:col-span-2 border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[18px] font-bold text-[#1E1E1E] capitalize">{t('Inactive Clients')}</h3>
                    <WeekSelector />
                  </div>

                  <div className="space-y-4 mt-4">
                    {/* Inactive Client Items */}
                    {inactiveClients.length > 0 ? (
                      inactiveClients.map((client, i) => (
                        <div 
                          key={`inactive-${i}`} 
                          className="flex justify-between items-center bg-[rgba(252,0,0,0.1)] rounded-[110px] py-2 px-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <Image 
                                src={client.image || "/images/profile.jpg"} 
                                alt="Profile"
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </div>
                            <span className="text-[#1E1E1E] font-medium text-base">{client.name}</span>
                          </div>
                          <span className="text-[#D40101] font-medium text-base">
                            {t('Last Active')} : {Math.floor(Math.random() * 10) + 5} {t('days ago')}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">{t('No inactive clients found')}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Layout */}
      <div className={`relative w-full min-h-screen z-10 lg:hidden bg-[#1E1E1E] ${isRtl ? 'rtl' : 'ltr'}`}>
        {/* Mobile Header */}
        <div className="flex justify-between items-center p-4 bg-[#1E1E1E]">
          <div className="flex items-center gap-3">
            <button 
              className="w-[40px] h-[40px] flex items-center justify-center rounded-[10px] bg-[#3DD559] text-white"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 7H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 1H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 13H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex items-center gap-4">
              <Image 
                src="/images/data_stats_icon.svg" 
                alt="Data & Statistics" 
                width={24} 
                height={24}
                className="text-[#636363]"
              />
              <h1 className="text-[20px] font-bold text-white">{t('Data & Statistics')}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[rgba(16,106,2,0.1)]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.625 15.75C12.56 15.75 15.75 12.56 15.75 8.625C15.75 4.68997 12.56 1.5 8.625 1.5C4.68997 1.5 1.5 4.68997 1.5 8.625C1.5 12.56 4.68997 15.75 8.625 15.75ZM16.5 16.5L15 15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Notification Button */}
            <button className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#E7F0E6] relative">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 2.25C6.75 2.25 4.5 4.5 4.5 6.75V9L3 10.5V12H15V10.5L13.5 9V6.75C13.5 4.5 11.25 2.25 9 2.25Z" stroke="#2B180A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
              {/* Notification Badge */}
              <div className="absolute top-0 right-0 w-[15px] h-[15px] rounded-full bg-[#FF0000] flex items-center justify-center">
                <span className="text-[10px] font-extrabold text-white">1</span>
              </div>
            </button>
            
            {/* Profile */}
            <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
              <Image 
                src="/images/profile.jpg" 
                alt="Profile"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* White Container for Content */}
        <div className="bg-white rounded-t-[25px] p-4 -mt-1">
          {/* Top filter section */}
          <div className="flex justify-between items-center mb-4">
            <MobileClientFilterDropdown />
            
            <button 
              className="flex items-center gap-2 bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-[20px] py-2 px-3 text-white"
              onClick={handleExportData}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.0001 7.58317V11.0832H4.08342V7.58317H2.91675V11.0832C2.91675 11.7332 3.43342 12.2498 4.08342 12.2498H10.0001C10.6501 12.2498 11.1667 11.7332 11.1667 11.0832V7.58317H10.0001ZM9.33342 6.99984L8.50592 6.17234L7.58342 7.09484V2.9165H6.41675V7.09484L5.49425 6.17234L4.66675 6.99984L7.00008 9.33317L9.33342 6.99984Z" fill="white"/>
              </svg>
              <span className="text-white text-xs font-semibold">{t('Export')}</span>
            </button>
          </div>
          
          {/* Mobile Charts */}
          <div className="space-y-5">
            {/* Client Overview Chart - Mobile */}
            <div className="bg-white rounded-[20px] p-4 shadow-md border border-gray-100">
              <div className="mb-3">
                <h3 className="text-[16px] font-bold text-[#1E1E1E] mb-2 capitalize">{t('Overview All Clients')}</h3>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-b from-[#13A753] to-[#1E2120]"></div>
                    <span className="text-[#2B180A] text-xs">{t('Total Active')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#F45C5C]"></div>
                    <span className="text-[#2B180A] text-xs">{t('Inactive')}</span>
                  </div>
                </div>
              </div>
              
              {/* Simplified Bar Chart */}
              <div className="flex justify-around h-[120px] items-end mt-4">
                {weeklyData.map((data, i) => (
                  <div key={`mobile-week-chart-${i+1}`} className="flex items-end space-x-1">
                    <div 
                      className="w-4 bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-t-sm" 
                      style={{ height: `${(data.active / maxTotalValue) * 120}px` }}
                    ></div>
                    <div 
                      className="w-4 bg-[#F45C5C] rounded-t-sm" 
                      style={{ height: `${(data.inactive / maxTotalValue) * 120}px` }}
                    ></div>
                  </div>
                ))}
              </div>
              
              {/* X-Axis Labels */}
              <div className="flex justify-around mt-2 text-[#636363] text-[10px]">
                {weeklyData.map((data) => (
                  <span key={data.week}>{data.week}</span>
                ))}
              </div>
            </div>
            
            {/* Caloric Trends Chart */}
            <div className="bg-white rounded-[20px] p-4 shadow-md border border-gray-100">
              <h3 className="text-[16px] font-bold text-[#1E1E1E] mb-4 capitalize">{t('Caloric Trends')}</h3>
              
              <MobileWeekSelector />
              
              {/* Simplified Mobile Chart */}
              <div className="flex">
                <div className="flex flex-col justify-between h-[200px] pr-2 py-2">
                  <span className="text-[#636363] text-xs">2500</span>
                  <span className="text-[#636363] text-xs">2000</span>
                  <span className="text-[#636363] text-xs">1500</span>
                  <span className="text-[#636363] text-xs">1000</span>
                  <span className="text-[#636363] text-xs">500</span>
                  <span className="text-[#636363] text-xs">0</span>
                </div>
                
                <div className="flex-1 relative">
                  {/* Grid Lines */}
                  <div className="absolute inset-0">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={`mobile-grid-${i}`} className="absolute border-t border-[rgba(15,105,2,0.1)] w-full" style={{ top: `${i * 20}%` }}></div>
                    ))}
                  </div>
                  
                  {/* Chart Line */}
                  <div className="relative h-[200px]">
                    <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
                      <path 
                        d="M0,240 C40,200 80,220 120,200 C160,180 200,160 240,150 C280,140 320,130 360,130 C400,130 440,140 480,150 C520,160 560,170 600,160 C640,150 680,130 720,120 C760,110 800,100 800,100" 
                        stroke="url(#mobile-green-gradient)" 
                        strokeWidth="2" 
                        fill="none"
                      />
                      
                      {/* Define gradient for line */}
                      <defs>
                        <linearGradient id="mobile-green-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#13A753" />
                          <stop offset="100%" stopColor="#1E2120" />
                        </linearGradient>
                      </defs>
                      
                      {/* Mobile Dots */}
                      <circle cx="120" cy="200" r="4" fill="#FFFFFF" stroke="url(#mobile-green-gradient)" strokeWidth="2" />
                      <circle cx="240" cy="150" r="4" fill="#FFFFFF" stroke="url(#mobile-green-gradient)" strokeWidth="2" />
                      <circle cx="360" cy="130" r="4" fill="#FFFFFF" stroke="url(#mobile-green-gradient)" strokeWidth="2" />
                      <circle cx="480" cy="150" r="4" fill="#FFFFFF" stroke="url(#mobile-green-gradient)" strokeWidth="2" />
                      <circle cx="600" cy="160" r="4" fill="#FFFFFF" stroke="url(#mobile-green-gradient)" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* X-Axis Labels */}
              <div className="flex justify-between px-4 mt-2 text-[#636363] text-xs">
                <span>{t('Week 1')}</span>
                <span>{t('Week 2')}</span>
                <span>{t('Week 3')}</span>
                <span>{t('Week 4')}</span>
              </div>
            </div>
            
            {/* Mobile Two-Column Layout */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Compliance Rates Card - Mobile */}
              <div className="bg-white rounded-[20px] p-4 shadow-md border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[16px] font-bold text-[#1E1E1E] capitalize">{t('Compliance Rates')}</h3>
                  <MobileWeekSelector />
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="relative w-[120px] h-[120px] mb-4">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="white"></circle>
                      <circle 
                        cx="18" cy="18" r="16" 
                        fill="none" 
                        stroke="#13A753" 
                        strokeWidth="3" 
                        strokeDasharray="100.5" 
                        strokeDashoffset={100.5 - (complianceRate / 100) * 100.5}
                        transform="rotate(-90 18 18)"
                      ></circle>
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[#636363] text-xs">{t('Rate')}</span>
                      <span className="text-[#1E1E1E] text-xl font-bold">{complianceRate} %</span>
                    </div>
                  </div>
                  
                  <div className="bg-[#DAEEDA] w-full py-2 rounded-[8px] text-center">
                    <h4 className="text-[#1E1E1E] text-sm font-semibold uppercase">{t('Compliance')}</h4>
                    <p className="text-[#636363] text-xs">{t('For')} {selectedWeek}</p>
                  </div>
                </div>
              </div>
              
              {/* Inactive Clients Card - Mobile */}
              <div className="bg-white rounded-[20px] p-4 shadow-md border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[16px] font-bold text-[#1E1E1E] capitalize">{t('Inactive Clients')}</h3>
                  <MobileWeekSelector />
                </div>
                
                <div className="space-y-2">
                  {/* Inactive Client Items */}
                  {inactiveClients.length > 0 ? (
                    inactiveClients.map((client, i) => (
                      <div 
                        key={`mobile-inactive-${i}`} 
                        className="flex flex-col bg-[rgba(252,0,0,0.1)] rounded-[15px] py-2 px-3"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <Image 
                              src="/images/profile.jpg" 
                              alt="Profile"
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          </div>
                          <span className="text-[#1E1E1E] font-medium text-sm">{client.name}</span>
                        </div>
                        <span className="text-[#D40101] font-medium text-xs ml-10">
                          {t('Last Active')} : {Math.floor(Math.random() * 10) + 5} {t('days ago')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">{t('No inactive clients found')}</div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Full Inactive Clients Card - Mobile */}
            <div className="sm:hidden bg-white rounded-[20px] p-4 shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[16px] font-bold text-[#1E1E1E] capitalize">{t('Inactive Clients')}</h3>
                <MobileWeekSelector />
              </div>
              
              <div className="space-y-3">
                {/* Inactive Client Items */}
                {inactiveClients.map((client, i) => (
                  <div 
                    key={`mobile-inactive-${i}`} 
                    className="flex flex-col bg-[rgba(252,0,0,0.1)] rounded-[15px] py-2 px-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image 
                          src="/images/profile.jpg" 
                          alt="Profile"
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[#1E1E1E] font-medium text-sm">{client.name}</span>
                    </div>
                    <span className="text-[#D40101] font-medium text-xs ml-10">
                      {t('Last Active')} : {Math.floor(Math.random() * 10) + 5} {t('days ago')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 