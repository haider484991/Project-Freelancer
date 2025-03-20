'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Sidebar from '@/components/dashboard/Sidebar'
import GroupsTable, { Group } from '@/components/dashboard/GroupsTable'
import ProfileAvatar from '@/components/dashboard/ProfileAvatar'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { 
  CreateGroupModal, 
  EditGroupModal, 
  WeekSelector, 
  TemplateSelector, 
  ClientSelector 
} from '@/components/dashboard/ClientPopups'
import { useAppContext } from '@/context/AppContext'
import { useTranslation } from 'react-i18next'

export default function CoachingGroupsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { groups, addGroup, updateGroup, deleteGroup, availableClients } = useAppContext()
  const { t, i18n } = useTranslation()
  const [isRtl, setIsRtl] = useState(false)
  
  // Modal states
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [showEditGroupModal, setShowEditGroupModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredGroups, setFilteredGroups] = useState<Group[]>(groups)
  
  // Dropdown states
  const [isWeekSelectorOpen, setIsWeekSelectorOpen] = useState(false)
  const [isCheckInSelectorOpen, setIsCheckInSelectorOpen] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState('Week 1')
  const [selectedTemplate, setSelectedTemplate] = useState('All Templates')
  const [selectedClient, setSelectedClient] = useState('All Clients')
  
  // Check if language is RTL
  useEffect(() => {
    const rtlLanguages = ['he', 'ar']
    setIsRtl(rtlLanguages.includes(i18n.language))
    
    // Set document direction
    document.documentElement.dir = rtlLanguages.includes(i18n.language) ? 'rtl' : 'ltr'
  }, [i18n.language])

  // Filter groups when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredGroups(groups)
    } else {
      const filtered = groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredGroups(filtered)
    }
  }, [searchQuery, groups])
  
  // Handle create group
  const handleCreateGroup = (group: Group) => {
    console.log('Creating group:', group)
    addGroup(group)
    setShowCreateGroupModal(false)
  }
  
  // Handle edit group
  const handleEditGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId)
    if (group) {
      setSelectedGroup(group)
      setShowEditGroupModal(true)
    }
  }
  
  // Handle view group
  const handleViewGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId)
    if (group) {
      console.log('Viewing group:', group)
    }
  }
  
  // Handle delete group
  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm(t('groups.confirmDelete'))) {
      deleteGroup(groupId)
    }
  }
  
  // Handle export groups
  const handleExportGroups = () => {
    try {
      // Format data for export
      const exportData = groups.map(group => ({
        id: group.id,
        name: group.name,
        members: Array.isArray(group.members) ? group.members.length : 0,
        created: new Date().toISOString().split('T')[0], // Sample date
        status: 'Active'
      }));
      
      // Convert to CSV
      const csvData = convertToCSV(exportData);
      
      // Create download link
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `groups_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Groups exported successfully');
    } catch (error) {
      console.error('Error exporting groups:', error);
      
      // Fallback to JSON if CSV conversion fails
      const jsonString = JSON.stringify(groups, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `groups_export_${new Date().toISOString().split('T')[0]}.json`);
      link.click();
      
      alert('Exported as JSON due to CSV conversion error');
    }
  };
  
  // Helper function to convert JSON to CSV
  const convertToCSV = (objArray: Record<string, any>[]) => {
    const array = [
      Object.keys(objArray[0]),
      ...objArray.map(item => Object.values(item))
    ];
    
    return array.map(row => 
      row.map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    ).join('\n');
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsWeekSelectorOpen(false);
      setIsCheckInSelectorOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

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
                  <h3 className="text-white font-semibold">{t('profile_name')}</h3>
                  <p className="text-white/70 text-sm">{t('admin')}</p>
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
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" fill="#636363"/>
                    <path d="M16.5 11C18.1569 11 19.5 9.65685 19.5 8C19.5 6.34315 18.1569 5 16.5 5C14.8431 5 13.5 6.34315 13.5 8C13.5 9.65685 14.8431 11 16.5 11Z" fill="#636363"/>
                    <path d="M9 13C6.33 13 1 14.34 1 17V19H17V17C17 14.34 11.67 13 9 13Z" fill="#636363"/>
                    <path d="M16.5 13C15.71 13 14.73 13.16 13.69 13.44C14.76 14.45 15.5 15.74 15.5 17V19H23V17C23 14.34 18.67 13 16.5 13Z" fill="#636363"/>
                  </svg>
                  <h2 className="text-[25px] font-bold text-[#1E1E1E]">{t('Groups Management')}</h2>
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
                    <path d="M9.58329 17.5C13.9555 17.5 17.5 13.9555 17.5 9.58329C17.5 5.21104 13.9555 1.66663 9.58329 1.66663C5.21104 1.66663 1.5 5.21104 1.5 9.58329C1.5 13.9555 5.21104 17.5 9.58329 17.5Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
            
            {/* Search and Filters Section */}
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
              {/* Search Input */}
              <div className="w-full md:w-auto max-w-[463px]">
                <div className="flex items-center gap-3 px-6 py-3 rounded-[43px] bg-[rgba(16,106,2,0.1)]">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.58329 17.5C13.9555 17.5 17.5 13.9555 17.5 9.58329C17.5 5.21104 13.9555 1.66663 9.58329 1.66663C5.21104 1.66663 1.5 5.21104 1.5 9.58329C1.5 13.9555 5.21104 17.5 9.58329 17.5Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.3333 18.3333L16.6666 16.6666" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input 
                    type="text" 
                    placeholder={t('search_group')} 
                    className="flex-1 bg-transparent border-none outline-none text-[#545454]"
                    value={searchQuery}
                    onChange={handleSearch}
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
                  onClick={() => setShowCreateGroupModal(true)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12H16" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V8" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[#13A753] font-semibold">{t('create_group')}</span>
                </button>
                
                {/* Export Button */}
                <button 
                  className="flex items-center gap-3 px-6 py-3 rounded-[60px] bg-gradient-to-b from-[#13A753] to-[#1E2120] text-white"
                  onClick={handleExportGroups}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.44 8.8999C20.04 9.2099 21.51 11.0599 21.51 15.1099V15.2399C21.51 19.7099 19.72 21.4999 15.25 21.4999H8.73998C4.26998 21.4999 2.47998 19.7099 2.47998 15.2399V15.1099C2.47998 11.0899 3.92998 9.2399 7.46998 8.9099" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15.0001V3.62012" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.35 5.85L12 2.5L8.65002 5.85" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-semibold">{t('export')}</span>
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
            <div className="bg-white rounded-[25px] border border-[#F3F7F3] p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[20px] font-bold text-[#1E1E1E]">{t('groups')}</h2>
              </div>
              
              <GroupsTable 
                onViewGroup={handleViewGroup}
                onDeleteGroup={handleDeleteGroup}
                searchTerm={searchQuery}
              />
            </div>
            
            <div className="md:hidden">
              <GroupsTable 
                isMobile={true}
                onViewGroup={handleViewGroup}
                onDeleteGroup={handleDeleteGroup}
                searchTerm={searchQuery}
              />
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
            {/* Groups Management Content for Mobile */}
            <div className="mb-4">
              <h2 className="text-[20px] font-bold text-[#1E1E1E] mb-4">{t('Groups')}</h2>
              
              <div className="space-y-4">
                {/* Search and Buttons */}
                <div className="flex flex-col gap-3">
                  <div className="relative">
                  <input 
                    type="text" 
                      placeholder={t('Search groups...')}
                      className="w-full bg-[#F9F9F9] rounded-[10px] py-2 px-4 pl-10 text-[14px] focus:outline-none"
                      value={searchQuery}
                    onChange={handleSearch}
                  />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.66671 14C11.1645 14 14 11.1645 14 7.66671C14 4.16887 11.1645 1.33337 7.66671 1.33337C4.16887 1.33337 1.33337 4.16887 1.33337 7.66671C1.33337 11.1645 4.16887 14 7.66671 14Z" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14.6667 14.6667L13.3334 13.3334" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                </div>
              </div>
              
                  <div className="flex gap-2">
                    <button 
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-[10px] py-2 text-white"
                      onClick={() => setShowCreateGroupModal(true)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 3.33337V12.6667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.33337 8H12.6667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-sm font-medium">{t('Create Group')}</span>
                    </button>
                    
                    <button 
                      className="flex items-center justify-center w-[40px] h-[40px] bg-[#F9F9F9] rounded-[10px]"
                      onClick={handleExportGroups}
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.75 9.75V14.25H4.59375V9.75H3.75V14.25C3.75 15.075 4.42509 15.75 4.59375 15.75H12.75C13.575 15.75 14.25 15.075 14.25 14.25V9.75H12.75ZM12 9L10.935 7.93481L9.75 9.11981V3.75H8.25V9.11981L7.065 7.93481L6 9L9 12L12 9Z" fill="#1E1E1E"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Groups List */}
                <div className="space-y-3">
                  {groups.map(group => (
                    <div 
                      key={group.id}
                      className="bg-[#F9F9F9] rounded-[15px] p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#13A753] to-[#1E2120] flex items-center justify-center text-white font-bold text-lg">
                            {group.name.charAt(0)}
                </div>
                          <div>
                            <h3 className="text-[16px] font-bold text-[#1E1E1E]">{group.name}</h3>
                            <p className="text-[12px] text-[#636363]">{group.members.length} {t('members')}</p>
                </div>
              </div>
              
                        <div className="flex items-center gap-2">
                <button 
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F3F3F3]"
                            onClick={() => handleEditGroup(group.id)}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.16671 13.3334H14" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M11.8067 2.69336C12.0767 2.42336 12.4267 2.27336 12.7933 2.27336C12.9739 2.27336 13.1525 2.30933 13.3192 2.37935C13.4859 2.44938 13.6374 2.55202 13.7667 2.68136C13.896 2.81069 13.9986 2.96222 14.0687 3.12891C14.1387 3.29559 14.1747 3.4742 14.1747 3.65469C14.1747 3.83518 14.1387 4.0138 14.0687 4.18048C14.0489 4.22386 14.0271 4.26656 14.0033 4.30845C13.9795 4.35034 13.9538 4.39126 13.9267 4.43102L5.14005 13.2177L2 14.0001L2.78671 10.8734L11.8067 2.69336Z" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                          <button 
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FDECEC]"
                            onClick={() => handleDeleteGroup(group.id)}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14 3.98665C11.78 3.76665 9.54667 3.65332 7.32 3.65332C6 3.65332 4.68 3.71999 3.36 3.85332L2 3.98665" stroke="#FF3B30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M5.66663 3.31331L5.81329 2.43997C5.91996 1.80664 5.99996 1.33331 7.12663 1.33331H8.87329C9.99996 1.33331 10.0866 1.83331 10.1866 2.44664L10.3333 3.31331" stroke="#FF3B30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Groups Table */}
            <div className="mt-4">
              <GroupsTable 
                groups={filteredGroups}
                onEdit={handleEditGroup}
                onView={handleViewGroup}
                onDelete={handleDeleteGroup}
                isMobile={true}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <CreateGroupModal
        isOpen={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        onCreateGroup={handleCreateGroup}
        availableClients={availableClients}
      />
      
      <EditGroupModal
        isOpen={showEditGroupModal}
        onClose={() => setShowEditGroupModal(false)}
        onEditGroup={handleEditGroup}
        group={selectedGroup}
        availableClients={availableClients}
      />
    </div>
  )
}