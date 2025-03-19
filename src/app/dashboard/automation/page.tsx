'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Sidebar from '@/components/dashboard/Sidebar'
import ProfileAvatar from '@/components/dashboard/ProfileAvatar'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useAppContext } from '@/context/AppContext'

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
                <ProfileAvatar 
                  src="/images/profile.jpg" 
                  alt="Profile"
                  size={40}
                />
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
                
                <h2 className="text-[25px] font-bold text-[#1E1E1E]">WhatsApp Message Automation</h2>
              </div>
              
              <div className="flex items-center gap-[5px]">
                {/* Search Button */}
                <button 
                  className="w-[45px] h-[45px] flex items-center justify-center rounded-full bg-[rgba(16,106,2,0.1)]"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('Search clicked')
                  }}
                  aria-label="Search"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.58329 17.5C13.9555 17.5 17.5 13.9555 17.5 9.58329C17.5 5.21104 13.9555 1.66663 9.58329 1.66663C5.21104 1.66663 1.5 5.21104 1.5 9.58329C1.5 13.9555 5.21104 17.5 9.58329 17.5Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.3333 18.3333L16.6666 16.6666" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                  aria-label="Notification"
                >
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 2.625C7.875 2.625 5.25 5.25 5.25 7.875V10.5L3.5 12.25V14H17.5V12.25L15.75 10.5V7.875C15.75 5.25 13.125 2.625 10.5 2.625Z" stroke="#2B180A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="13.5" cy="5.5" r="4.5" fill="#FF0000"/>
                  </svg>
                  <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[#FF3B30] rounded-full text-white text-[10px] font-bold">
                    7
                  </div>
                </button>
                
                {/* Profile */}
                <div className="flex items-center gap-[6px]">
                  <ProfileAvatar 
                    src="/images/profile.jpg" 
                    alt="Profile"
                    size={45}
                  />
                  <div className="flex flex-col">
                    <span className="text-[16px] font-semibold text-[#201D1D] capitalize">Alex Dube</span>
                    <span className="text-[14px] text-[#636363] capitalize">Admin</span>
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
                    <option value="">Select Recipient (Client Or Group)</option>
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
                    <option value="">Select Message Template</option>
                    {messageTemplates.map(template => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.96004 4.47498L6.70004 7.73498C6.31504 8.11998 5.68504 8.11998 5.30004 7.73498L2.04004 4.47498" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
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
                  Schedule
                </button>
                <button 
                  className="bg-gradient-to-b from-[#13A753] to-[#1E2120] text-white rounded-[60px] px-6 py-3 font-semibold ml-4"
                  onClick={handleSendNow}
                >
                  Send Now
                </button>
              </div>
            </div>
            
            {/* Messages Table */}
            <div className="w-full bg-white overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse">
                <thead>
                  <tr className="border-b-[1.2px] border-[#E2ECE2] bg-white text-black">
                    <th className="text-left py-4 px-4 text-[#1E1E1E] font-bold uppercase text-[16px]">Recipient</th>
                    <th className="text-left py-4 px-4 text-[#1E1E1E] font-bold uppercase text-[16px]">Type</th>
                    <th className="text-left py-4 px-4 text-[#1E1E1E] font-bold uppercase text-[16px]">Message</th>
                    <th className="text-left py-4 px-4 text-[#1E1E1E] font-bold uppercase text-[16px]">Status</th>
                    <th className="text-left py-4 px-4 text-[#1E1E1E] font-bold uppercase text-[16px]">Timestamp</th>
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
                          {message.status === 'sent' ? 'Sent' : 'Schedule'}
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
          <div className="bg-white rounded-[25px] p-4 mx-3 min-h-[892px]">
            {/* Mobile Header */}
            <div className="flex justify-between items-center mb-8 pt-2">
              <button 
                className="w-[38px] h-[38px] flex items-center justify-center rounded-[10px] bg-[#3DD559]"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.375 7H14.625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.375 2.5H14.625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.375 11.5H14.625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <div className="flex items-center gap-2">
                {/* Search Button */}
                <button className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-[rgba(16,106,2,0.1)]">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.625 15.75C12.56 15.75 15.75 12.56 15.75 8.625C15.75 4.68997 12.56 1.5 8.625 1.5C4.68997 1.5 1.5 4.68997 1.5 8.625C1.5 12.56 4.68997 15.75 8.625 15.75Z" stroke="#2B180A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.5 16.5L15 15" stroke="#2B180A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {/* Notification Button */}
                <button className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-[#3DD559] relative">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 2.25C6.75 2.25 4.5 4.5 4.5 6.75V9L3 10.5V12H15V10.5L13.5 9V6.75C13.5 4.5 11.25 2.25 9 2.25Z" stroke="#1E1E1E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  
                  {/* Notification Badge */}
                  <div className="absolute top-1 right-1 w-[13px] h-[13px] rounded-full bg-[#FF0000] flex items-center justify-center">
                    <span className="text-[10px] font-extrabold text-white">1</span>
                  </div>
                </button>
                
                {/* Profile */}
                <ProfileAvatar 
                  src="/images/profile.jpg" 
                  alt="Profile"
                  size={38}
                />
              </div>
            </div>
            
            {/* Page Title */}
            <div className="mb-6">
              <h2 className="text-[20px] font-bold text-[#1E1E1E] ml-[2px]">WhatsApp Message Automation</h2>
            </div>
            
            {/* Mobile Message Controls */}
            <div className="bg-[#F3F7F3] rounded-[25px] p-3 mb-4">
              {/* Mobile Recipient Input */}
              <div className="mb-3">
                <div className="flex items-center rounded-[20px] bg-white px-3 py-2.5 border border-[#13A753]/20">
                  <select 
                    value={selectedRecipient} 
                    onChange={handleRecipientChange} 
                    className="flex-1 bg-transparent border-none outline-none text-[#545454] text-[12px]"
                  >
                    <option value="">Select Recipient (Client Or Group)</option>
                    {clients.map(client => (
                      <option key={client.id} value={`individual:${client.id}`}>{client.name}</option>
                    ))}
                    {groups.map(group => (
                      <option key={group.id} value={`group:${group.id}`}>{group.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Mobile Message Template */}
              <div className="mb-3">
                <div className="flex items-center justify-between rounded-[20px] bg-white px-3 py-2.5 border border-[#13A753]/20">
                  <select 
                    value={selectedTemplate} 
                    onChange={handleTemplateChange} 
                    className="flex-1 bg-transparent border-none outline-none text-[#545454] text-[12px]"
                  >
                    <option value="">Select Message Template</option>
                    {messageTemplates.map(template => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.96004 4.47498L6.70004 7.73498C6.31504 8.11998 5.68504 8.11998 5.30004 7.73498L2.04004 4.47498" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              {/* Mobile Date Selection */}
              <div className="mb-3">
                <div className="flex items-center justify-between rounded-[20px] bg-white px-3 py-2.5 border border-[#13A753]/20">
                  <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={handleDateChange} 
                    className="flex-1 bg-transparent border-none outline-none text-[#545454] text-[12px]"
                  />
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.33325 1.33337V3.33337" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.6667 1.33337V3.33337" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.33325 6.06006H13.6666" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 5.66671V11.3334C14 13.3334 13 14.6667 10.6667 14.6667H5.33333C3 14.6667 2 13.3334 2 11.3334V5.66671C2 3.66671 3 2.33337 5.33333 2.33337H10.6667C13 2.33337 14 3.66671 14 5.66671Z" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              {/* Mobile Schedule Button */}
              <button 
                className="w-full bg-gradient-to-b from-[#13A753] to-[#1E2120] text-white rounded-[60px] py-2.5 font-semibold text-[14px]"
                onClick={handleScheduleMessage}
              >
                Schedule
              </button>
              <button 
                className="w-full bg-gradient-to-b from-[#13A753] to-[#1E2120] text-white rounded-[60px] py-2.5 font-semibold text-[14px] mt-4"
                onClick={handleSendNow}
              >
                Send Now
              </button>
            </div>
            
            {/* Mobile Messages List */}
            <div className="bg-white rounded-[25px] border border-[#F3F7F3] mb-4">
              {messages.map((message, index) => (
                <div key={message.id} className={`p-4 ${index !== messages.length - 1 ? 'border-b border-[#E2ECE2]' : ''}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-[14px] text-[#636363]">{message.recipient}</div>
                    <div className="text-[12px] text-[#636363] capitalize">{message.type}</div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-[12px] text-[#636363]">{message.message}</div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      message.status === 'sent' 
                        ? 'bg-[#EBF9EB] text-[#368C48] border-[1.5px] border-[#B7DFBA]' 
                        : 'bg-[#FFFAE1] text-[#9F7918] border-[1.5px] border-[#F8DA84]'
                    }`}>
                      {message.status === 'sent' ? 'Sent' : 'Schedule'}
                    </span>
                  </div>
                  
                  <div className="text-[12px] text-[#636363]">{message.timestamp}</div>
                </div>
              ))}
            </div>
            
            {/* Pagination Indicator */}
            <div className="w-full bg-[#D9D9D9] h-[10px] rounded-[80px] relative mt-6">
              <div className="absolute left-0 top-0 h-full w-[48%] bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-[80px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}