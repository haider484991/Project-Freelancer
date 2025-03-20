'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import ProfileAvatar from '@/components/dashboard/ProfileAvatar'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useAppContext } from '@/context/AppContext'
import { useTranslation } from 'react-i18next'

// Define message types
type MessageStatus = 'sent' | 'schedule'
type RecipientType = 'individual' | 'group'

interface Message {
  id: string;
  recipient: string;
  recipientId: string;
  type: RecipientType;
  message: string;
  status: MessageStatus;
  timestamp: string;
}

// Mock data for messages
const mockMessages: Message[] = [
  {
    id: '1',
    recipient: 'Tanning Bude',
    recipientId: '1',
    type: 'individual',
    message: 'Meal Reminder',
    status: 'sent',
    timestamp: '2023-01-13 10:00 AM'
  },
  {
    id: '2',
    recipient: 'Muscle Gain',
    recipientId: '2',
    type: 'group',
    message: 'Weekly Check-In',
    status: 'schedule',
    timestamp: '2023-01-13 10:00 AM'
  },
  {
    id: '3',
    recipient: 'Tanning Bude',
    recipientId: '1',
    type: 'individual',
    message: 'Meal Reminder',
    status: 'sent',
    timestamp: '2023-01-13 10:00 AM'
  },
  {
    id: '4',
    recipient: 'Tanning Bude',
    recipientId: '1',
    type: 'individual',
    message: 'Meal Reminder',
    status: 'sent',
    timestamp: '2023-01-13 10:00 AM'
  },
  {
    id: '5',
    recipient: 'Tanning Bude',
    recipientId: '1',
    type: 'individual',
    message: 'Meal Reminder',
    status: 'sent',
    timestamp: '2023-01-13 10:00 AM'
  }
]

export default function WhatsAppAutomationPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Get clients and groups from context
  const { clients, groups } = useAppContext()
  const { t, i18n } = useTranslation()
  const [isRtl, setIsRtl] = useState(false)
  
  // Check if current language is RTL
  useEffect(() => {
    const rtlLanguages = ['he', 'ar']
    setIsRtl(rtlLanguages.includes(i18n.language))
  }, [i18n.language])
  
  // State for message form
  const [selectedRecipient, setSelectedRecipient] = useState<string>('')
  const [selectedRecipientType, setSelectedRecipientType] = useState<RecipientType>('individual')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  
  // Templates for messages
  const messageTemplates = [
    { id: '1', name: 'Meal Reminder' },
    { id: '2', name: 'Weekly Check-In' },
    { id: '3', name: 'Workout Reminder' },
    { id: '4', name: 'Progress Update Request' }
  ]
  
  // Handle recipient selection
  const handleRecipientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (!value) {
      setSelectedRecipient('')
      return
    }
    
    const [type, id] = value.split(':')
    setSelectedRecipientType(type as RecipientType)
    setSelectedRecipient(id)
  }
  
  // Handle template selection
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(e.target.value)
  }
  
  // Handle date selection
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
  }
  
  // Handle schedule message
  const handleScheduleMessage = () => {
    if (!selectedRecipient || !selectedTemplate || !selectedDate) {
      alert('Please fill in all fields to schedule a message')
      return
    }
    
    // Find recipient name
    let recipientName = ''
    if (selectedRecipientType === 'individual') {
      const client = clients.find(c => c.id === selectedRecipient)
      recipientName = client ? client.name : 'Unknown Client'
    } else {
      const group = groups.find(g => g.id === selectedRecipient)
      recipientName = group ? group.name : 'Unknown Group'
    }
    
    // Find template name
    const template = messageTemplates.find(t => t.id === selectedTemplate)
    const templateName = template ? template.name : 'Custom Message'
    
    // Create new message
    const newMessage: Message = {
      id: Date.now().toString(),
      recipient: recipientName,
      recipientId: selectedRecipient,
      type: selectedRecipientType,
      message: templateName,
      status: 'schedule',
      timestamp: selectedDate + ' 10:00 AM'
    }
    
    // Add to messages
    setMessages(prev => [newMessage, ...prev])
    
    // Reset form
    setSelectedRecipient('')
    setSelectedTemplate('')
    setSelectedDate('')
    
    alert('Message scheduled successfully!')
  }
  
  // Handle send now (instead of scheduling)
  const handleSendNow = () => {
    if (!selectedRecipient || !selectedTemplate) {
      alert('Please select a recipient and message template')
      return
    }
    
    // Find recipient name
    let recipientName = ''
    if (selectedRecipientType === 'individual') {
      const client = clients.find(c => c.id === selectedRecipient)
      recipientName = client ? client.name : 'Unknown Client'
    } else {
      const group = groups.find(g => g.id === selectedRecipient)
      recipientName = group ? group.name : 'Unknown Group'
    }
    
    // Find template name
    const template = messageTemplates.find(t => t.id === selectedTemplate)
    const templateName = template ? template.name : 'Custom Message'
    
    // Create new message
    const newMessage: Message = {
      id: Date.now().toString(),
      recipient: recipientName,
      recipientId: selectedRecipient,
      type: selectedRecipientType,
      message: templateName,
      status: 'sent',
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }
    
    // Add to messages
    setMessages(prev => [newMessage, ...prev])
    
    // Reset form
    setSelectedRecipient('')
    setSelectedTemplate('')
    setSelectedDate('')
    
    alert('Message sent successfully!')
  }

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
                <ProfileAvatar 
                  src="/images/profile.jpg" 
                  alt="Profile"
                  size={40}
                />
                <div>
                  <h3 className="text-white font-semibold">{t('profile')}</h3>
                  <p className="text-white/70 text-sm">{t('admin')}</p>
                </div>
              </div>
              <button 
                className="text-white"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label={t('close')}
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
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16.23C9.40999 16.23 7.30999 14.13 7.30999 11.54C7.30999 8.95 9.40999 6.85001 12 6.85001C14.59 6.85001 16.69 8.95 16.69 11.54" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16.23V22" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h2 className="text-[25px] font-bold text-[#1E1E1E]">{t('WhatsApp Automation')}</h2>
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
            
            {/* Message Control Panel */}
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
              {/* Recipient Selection */}
              <div className="w-full md:w-[280px]">
                <div className="border border-[#13A753]/20 rounded-[25px] px-4 py-3">
                  <select 
                    value={selectedRecipient} 
                    onChange={handleRecipientChange} 
                    className="flex-1 bg-transparent border-none outline-none text-[#545454] text-[12px]"
                  >
                    <option value="">{t('select')}</option>
                    {clients.map(client => (
                      <option key={client.id} value={`individual:${client.id}`}>{client.name}</option>
                    ))}
                    {groups.map(group => (
                      <option key={group.id} value={`group:${group.id}`}>{group.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Message Template */}
              <div className="w-full md:w-[280px]">
                <div className="border border-[#13A753]/20 rounded-[25px] px-4 py-3 flex justify-between items-center">
                  <select 
                    value={selectedTemplate} 
                    onChange={handleTemplateChange} 
                    className="flex-1 bg-transparent border-none outline-none text-[#545454] text-[12px]"
                  >
                    <option value="">{t('select')}</option>
                    {messageTemplates.map(template => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.96004 4.47498L6.70004 7.73498C6.31504 8.11998 5.68504 8.11998 5.30004 7.73498L2.04004 4.47498" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              {/* Date Selection */}
              <div className="w-full md:w-[180px]">
                <div className="border border-[#13A753]/20 rounded-[25px] px-4 py-3 flex justify-between items-center">
                  <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={handleDateChange} 
                    className="flex-1 bg-transparent border-none outline-none text-[#545454] text-[12px]"
                  />
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.33325 1.33337V3.33337" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.6667 1.33337V3.33337" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.33325 6.06006H13.6666" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 5.66671V11.3334C14 13.3334 13 14.6667 10.6667 14.6667H5.33333C3 14.6667 2 13.3334 2 11.3334V5.66671C2 3.66671 3 2.33337 5.33333 2.33337H10.6667C13 2.33337 14 3.66671 14 5.66671Z" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              {/* Schedule Button */}
              <div className="w-full md:w-auto">
                <button 
                  className="bg-gradient-to-b from-[#13A753] to-[#1E2120] text-white rounded-[60px] px-6 py-3 font-semibold"
                  onClick={handleScheduleMessage}
                >
                  {t('schedule')}
                </button>
                <button 
                  className="bg-gradient-to-b from-[#13A753] to-[#1E2120] text-white rounded-[60px] px-6 py-3 font-semibold ml-4"
                  onClick={handleSendNow}
                >
                  {t('send')}
                </button>
              </div>
            </div>
            
            {/* Messages Table */}
            <div className="w-full bg-white overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse">
                <thead>
                  <tr className="border-b-[1.2px] border-[#E2ECE2] bg-white text-black">
                    <th className="text-left py-4 px-4 text-[#1E1E1E] font-bold uppercase text-[16px]">{t('recipient')}</th>
                    <th className="text-left py-4 px-4 text-[#1E1E1E] font-bold uppercase text-[16px]">{t('type')}</th>
                    <th className="text-left py-4 px-4 text-[#1E1E1E] font-bold uppercase text-[16px]">{t('message')}</th>
                    <th className="text-left py-4 px-4 text-[#1E1E1E] font-bold uppercase text-[16px]">{t('status')}</th>
                    <th className="text-left py-4 px-4 text-[#1E1E1E] font-bold uppercase text-[16px]">{t('timestamp')}</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr key={message.id} className="border-b-[1.2px] border-[#E2ECE2]">
                      <td className="py-4 px-4 text-[#636363] font-medium">{message.recipient}</td>
                      <td className="py-4 px-4 text-[#636363] capitalize font-medium">{message.type}</td>
                      <td className="py-4 px-4 text-[#636363] font-medium">{message.message}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          message.status === 'sent' 
                            ? 'bg-[#EBF9EB] text-[#368C48] border-[2px] border-[#B7DFBA]' 
                            : 'bg-[#FFFAE1] text-[#9F7918] border-[2px] border-[#F8DA84]'
                        }`}>
                          {message.status === 'sent' ? t('sent') : t('schedule')}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[#636363] font-medium">{message.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Layout */}
      <div className={`relative w-full min-h-screen z-10 lg:hidden bg-[#1E1E1E] ${isRtl ? 'rtl' : 'ltr'}`}>
        {/* Background blur elements and grid lines */}
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
          <div className="bg-white rounded-[20px] p-4">
            {/* WhatsApp Automation Content for Mobile */}
            <div className="mb-4">
              <h2 className="text-[20px] font-bold text-[#1E1E1E] mb-4">{t('WhatsApp Automation')}</h2>
              
              <div className="space-y-4">
                {/* Schedule Message Form */}
                <div className="bg-[#F9F9F9] rounded-[15px] p-4">
                  <h3 className="text-[16px] font-semibold text-[#1E1E1E] mb-3">{t('Schedule Message')}</h3>
                  
                  <div className="space-y-3">
                    {/* Recipient Selector */}
                    <div>
                      <label className="block text-[14px] text-[#636363] mb-1">{t('Select Recipient')}</label>
                  <select 
                        className="w-full py-2 px-3 rounded-[10px] border border-[#E0E0E0] focus:outline-none"
                    onChange={handleRecipientChange} 
                        value={selectedRecipientType + ':' + selectedRecipient}
                  >
                        <option value="">{t('Select...')}</option>
                        <optgroup label={t('Clients')}>
                    {clients.map(client => (
                            <option key={`client-${client.id}`} value={`individual:${client.id}`}>
                              {client.name}
                            </option>
                    ))}
                        </optgroup>
                        <optgroup label={t('Groups')}>
                    {groups.map(group => (
                            <option key={`group-${group.id}`} value={`group:${group.id}`}>
                              {group.name}
                            </option>
                    ))}
                        </optgroup>
                  </select>
              </div>
              
                    {/* Template Selector */}
                    <div>
                      <label className="block text-[14px] text-[#636363] mb-1">{t('Select Template')}</label>
                  <select 
                        className="w-full py-2 px-3 rounded-[10px] border border-[#E0E0E0] focus:outline-none"
                    value={selectedTemplate} 
                    onChange={handleTemplateChange} 
                  >
                        <option value="">{t('Select...')}</option>
                    {messageTemplates.map(template => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                    ))}
                  </select>
              </div>
              
                    {/* Date Selector */}
                    <div>
                      <label className="block text-[14px] text-[#636363] mb-1">{t('Select Date')}</label>
                  <input 
                    type="date" 
                        className="w-full py-2 px-3 rounded-[10px] border border-[#E0E0E0] focus:outline-none"
                    value={selectedDate} 
                    onChange={handleDateChange} 
                      />
              </div>
              
                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
              <button 
                        className="flex-1 bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-[10px] py-2 text-white text-sm font-medium"
                onClick={handleScheduleMessage}
              >
                        {t('Schedule')}
              </button>
              <button 
                        className="flex-1 bg-[#F3F7F3] rounded-[10px] py-2 text-[#1E1E1E] text-sm font-medium"
                onClick={handleSendNow}
              >
                        {t('Send Now')}
              </button>
            </div>
                  </div>
                  </div>
                  
                {/* Messages History */}
                <div>
                  <h3 className="text-[16px] font-semibold text-[#1E1E1E] mb-3">{t('Recent Messages')}</h3>
                  <div className="space-y-3">
                    {messages.slice(0, 5).map((message) => (
                      <div 
                        key={message.id} 
                        className="bg-[#F9F9F9] rounded-[10px] p-3 flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium text-[14px]">{message.recipient}</div>
                    <div className="text-[12px] text-[#636363]">{message.message}</div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                      message.status === 'sent' 
                              ? 'bg-[#E6F7EC] text-[#13A753] border-[1.5px] border-[#13A753]'
                        : 'bg-[#FFFAE1] text-[#9F7918] border-[1.5px] border-[#F8DA84]'
                    }`}>
                      {message.status === 'sent' ? t('sent') : t('schedule')}
                    </span>
                          <div className="text-[10px] text-[#636363] mt-1">{message.timestamp}</div>
                        </div>
                      </div>
                    ))}
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