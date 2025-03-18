'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Sidebar from '@/components/dashboard/Sidebar'
import GroupsTable, { mockGroups, Group } from '@/components/dashboard/GroupsTable'
import ProfileAvatar from '@/components/dashboard/ProfileAvatar'
import { 
  CreateGroupModal, 
  EditGroupModal, 
  WeekSelector, 
  TemplateSelector, 
  ClientSelector 
} from '@/components/dashboard/ClientPopups'

export default function CoachingGroupsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Modal states
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false)
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<any>(null)
  
  // Selector states
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState('Healhty Protein')
  const [selectedClient, setSelectedClient] = useState('1')
  
  // Sample clients
  const availableClients = [
    { id: '1', name: 'Alex Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Mike Johnson' },
    { id: '4', name: 'Sarah Williams' },
    { id: '5', name: 'Chris Evans' },
  ]
  
  // Handle create group
  const handleCreateGroup = (group: any) => {
    console.log('Creating group:', group)
    // Create group logic here
  }
  
  // Handle edit group
  const handleEditGroup = (group: any) => {
    console.log('Editing group:', group)
    // Edit group logic here
  }
  
  // Handle view group (for editing)
  const handleViewGroup = (group: any) => {
    setSelectedGroup(group)
    setIsEditGroupModalOpen(true)
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
                
                <div className="flex items-center gap-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" fill="#636363"/>
                    <path d="M16.5 11C18.1569 11 19.5 9.65685 19.5 8C19.5 6.34315 18.1569 5 16.5 5C14.8431 5 13.5 6.34315 13.5 8C13.5 9.65685 14.8431 11 16.5 11Z" fill="#636363"/>
                    <path d="M9 13C6.33 13 1 14.34 1 17V19H17V17C17 14.34 11.67 13 9 13Z" fill="#636363"/>
                    <path d="M16.5 13C15.71 13 14.73 13.16 13.69 13.44C14.76 14.45 15.5 15.74 15.5 17V19H23V17C23 14.34 18.67 13 16.5 13Z" fill="#636363"/>
                  </svg>
                  
                  <h2 className="text-[25px] font-bold text-[#1E1E1E]">Coaching Groups Management</h2>
                </div>
              </div>
              
              <div className="flex items-center gap-[5px]">
                {/* Search Button */}
                <button className="w-[45px] h-[45px] flex items-center justify-center rounded-full bg-[rgba(16,106,2,0.1)]">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.58329 17.5C13.9555 17.5 17.5 13.9555 17.5 9.58329C17.5 5.21104 13.9555 1.66663 9.58329 1.66663C5.21104 1.66663 1.66663 5.21104 1.66663 9.58329C1.66663 13.9555 5.21104 17.5 9.58329 17.5Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.3333 18.3333L16.6666 16.6666" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {/* Notification Button */}
                <button className="w-[45px] h-[45px] flex items-center justify-center rounded-full bg-[#E7F0E6] relative">
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 2.625C7.875 2.625 5.25 5.25 5.25 7.875V10.5L3.5 12.25V14H17.5V12.25L15.75 10.5V7.875C15.75 5.25 13.125 2.625 10.5 2.625Z" stroke="#2B180A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="13.5" cy="5.5" r="4.5" fill="#FF0000"/>
                  </svg>
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
            
            {/* Search and Filters Section */}
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
              {/* Search Input */}
              <div className="w-full md:w-auto max-w-[463px]">
                <div className="flex items-center gap-3 px-6 py-3 rounded-[43px] bg-[rgba(16,106,2,0.1)]">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.625 15.75C12.56 15.75 15.75 12.56 15.75 8.625C15.75 4.68997 12.56 1.5 8.625 1.5C4.68997 1.5 1.5 4.68997 1.5 8.625C1.5 12.56 4.68997 15.75 8.625 15.75Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.5 16.5L15 15" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Search Group" 
                    className="flex-1 bg-transparent border-none outline-none text-[#545454]"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {/* Selector Components */}
                <div className="hidden md:flex gap-4">
                  <div className="w-[120px] relative z-30">
                    <WeekSelector 
                      selectedWeek={selectedWeek} 
                      onWeekChange={setSelectedWeek} 
                    />
                  </div>
                  
                  <div className="w-[200px] relative z-30">
                    <TemplateSelector 
                      selectedTemplate={selectedTemplate} 
                      onTemplateChange={setSelectedTemplate} 
                    />
                  </div>
                  
                  <div className="w-[150px] relative z-30">
                    <ClientSelector 
                      selectedClient={selectedClient} 
                      onClientChange={setSelectedClient} 
                    />
                  </div>
                </div>
                
                {/* Create Group Button */}
                <button 
                  className="flex items-center gap-3 px-5 py-3 rounded-[60px] bg-[#F3F7F3] border border-[#13A753]/20"
                  onClick={() => setIsCreateGroupModalOpen(true)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12H16" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V8" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[#13A753] font-semibold">Create Group</span>
                </button>
                
                {/* Export Button */}
                <button className="flex items-center gap-3 px-6 py-3 rounded-[60px] bg-gradient-to-b from-[#13A753] to-[#1E2120] text-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.44 8.8999C20.04 9.2099 21.51 11.0599 21.51 15.1099V15.2399C21.51 19.7099 19.72 21.4999 15.25 21.4999H8.73998C4.26998 21.4999 2.47998 19.7099 2.47998 15.2399V15.1099C2.47998 11.0899 3.92998 9.2399 7.46998 8.9099" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15.0001V3.62012" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.35 5.85L12 2.5L8.65002 5.85" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-semibold">Export</span>
                </button>
              </div>
            </div>
            
            {/* Mobile Selectors (visible on smaller screens) */}
            <div className="flex md:hidden gap-4 mb-6 overflow-x-auto pb-2">
              <div className="flex-shrink-0 w-[110px] relative z-30">
                <WeekSelector 
                  selectedWeek={selectedWeek} 
                  onWeekChange={setSelectedWeek} 
                />
              </div>
              
              <div className="flex-shrink-0 w-[180px] relative z-30">
                <TemplateSelector 
                  selectedTemplate={selectedTemplate} 
                  onTemplateChange={setSelectedTemplate} 
                />
              </div>
              
              <div className="flex-shrink-0 w-[120px] relative z-30">
                <ClientSelector 
                  selectedClient={selectedClient} 
                  onClientChange={setSelectedClient} 
                />
              </div>
            </div>
            
            {/* Groups Table */}
            <GroupsTable onViewGroup={handleViewGroup} />
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
              <h2 className="text-[20px] font-bold text-[#1E1E1E] ml-[2px]">Coaching Groups Management</h2>
            </div>
            
            {/* Mobile Search and Filters Container */}
            <div className="bg-[#F3F7F3] rounded-[25px] p-3 mb-4">
              {/* Mobile Search */}
              <div className="mb-3">
                <div className="flex items-center gap-2 px-4 py-3 rounded-[43px] bg-[rgba(16,106,2,0.1)]">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.625 15.75C12.56 15.75 15.75 12.56 15.75 8.625C15.75 4.68997 12.56 1.5 8.625 1.5C4.68997 1.5 1.5 4.68997 1.5 8.625C1.5 12.56 4.68997 15.75 8.625 15.75Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.5 16.5L15 15" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Search Group" 
                    className="flex-1 bg-transparent border-none outline-none text-[#545454] text-[12px]"
                  />
                </div>
              </div>
              
              {/* Mobile Selectors */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="w-full relative z-30">
                  <WeekSelector 
                    selectedWeek={selectedWeek} 
                    onWeekChange={setSelectedWeek} 
                  />
                </div>
                
                <div className="w-full relative z-30">
                  <TemplateSelector 
                    selectedTemplate={selectedTemplate} 
                    onTemplateChange={setSelectedTemplate} 
                  />
                </div>
                
                <div className="w-full relative z-30">
                  <ClientSelector 
                    selectedClient={selectedClient} 
                    onClientChange={setSelectedClient} 
                  />
                </div>
              </div>
              
              {/* Mobile Action Buttons */}
              <div className="flex flex-wrap justify-between gap-2">              
                {/* Create Group Button */}
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-[60px] bg-[#F3F7F3] border border-[#13A753]/20"
                  onClick={() => setIsCreateGroupModalOpen(true)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12H16" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V8" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[#13A753] font-semibold text-[12px]">Create Group</span>
                </button>
                
                {/* Export Button */}
                <button className="flex items-center gap-2 px-4 py-2 rounded-[60px] bg-gradient-to-b from-[#13A753] to-[#1E2120] text-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.44 8.8999C20.04 9.2099 21.51 11.0599 21.51 15.1099V15.2399C21.51 19.7099 19.72 21.4999 15.25 21.4999H8.73998C4.26998 21.4999 2.47998 19.7099 2.47998 15.2399V15.1099C2.47998 11.0899 3.92998 9.2399 7.46998 8.9099" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15.0001V3.62012" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.35 5.85L12 2.5L8.65002 5.85" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-semibold text-[12px]">Export</span>
                </button>
              </div>
            </div>
            
            {/* Mobile Groups List */}
            <div className="bg-white rounded-[25px] border border-[#F3F7F3] mb-4">
              {mockGroups.map((group: Group, index: number) => (
                <div key={group.id} className={`p-4 ${index !== mockGroups.length - 1 ? 'border-b border-[#E2ECE2]' : ''}`}>
                  <div className="font-medium text-[14px] text-[#636363] mb-3">{group.name}</div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-[12px] text-[#636363] font-medium">Members:</div>
                    <div className="text-[12px] text-[#636363] max-w-[60%]">{group.members}</div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-[12px] text-[#636363] font-medium">Dietary Goal:</div>
                    <div className="text-[12px] text-[#636363] max-w-[60%]">{group.dietaryGoal}</div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-[12px] text-[#636363] font-medium">Created At:</div>
                    <div className="text-[12px] text-[#636363]">{group.createdAt}</div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button 
                      className="w-[35px] h-[35px] flex items-center justify-center bg-[#F3F7F3] rounded-[10px]"
                      aria-label="Edit"
                      onClick={() => handleViewGroup(group)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.26 3.59997L5.04997 12.29C4.73997 12.62 4.43997 13.27 4.37997 13.72L4.00997 16.96C3.87997 18.13 4.71997 18.93 5.87997 18.73L9.09997 18.18C9.54997 18.1 10.18 17.77 10.49 17.43L18.7 8.73997C20.12 7.23997 20.76 5.52997 18.55 3.43997C16.35 1.36997 14.68 2.09997 13.26 3.59997Z" stroke="#0F6902" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M11.89 5.05005C12.32 7.81005 14.56 9.92005 17.34 10.2" stroke="#0F6902" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      className="w-[35px] h-[35px] flex items-center justify-center bg-[#F3F7F3] rounded-[10px]"
                      aria-label="Delete"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" fill="#FC0000" fillOpacity="0.1" stroke="#FC0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 9L9 15" stroke="#FC0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 15L9 9" stroke="#FC0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
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
      
      {/* Popups */}
      <CreateGroupModal 
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onCreateGroup={handleCreateGroup}
        availableClients={availableClients}
      />
      
      <EditGroupModal 
        isOpen={isEditGroupModalOpen}
        onClose={() => setIsEditGroupModalOpen(false)}
        onEditGroup={handleEditGroup}
        group={selectedGroup}
        availableClients={availableClients}
      />
    </div>
  )
} 