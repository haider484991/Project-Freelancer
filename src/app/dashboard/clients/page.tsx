'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import ClientTable, { Client, mockClients } from '@/components/dashboard/ClientTable'
import ProfileAvatar from '@/components/dashboard/ProfileAvatar'
import { AddClientModal, ClientDetailsModal } from '@/components/dashboard/ClientPopups'

export default function ClientManagementPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Modal states
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false)
  const [isClientDetailsModalOpen, setIsClientDetailsModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  
  // Client data state
  const [clients, setClients] = useState<Client[]>(mockClients)
  
  // Handle add client
  const handleAddClient = (client: any) => {
    console.log('Adding client:', client)
    // Add client logic here
    const newClient = {
      ...client,
      id: String(clients.length + 1),
      image: '/images/profile.jpg',
      goalsMet: 75,
      status: 'active',
      compliance: 'compliant',
      pushEnabled: false
    }
    setClients([...clients, newClient])
  }
  
  // Handle client details
  const handleViewClient = (client: any) => {
    setSelectedClient(client)
    setIsClientDetailsModalOpen(true)
  }
  
  // Handle push notification toggle
  const handleTogglePush = (clientId: string, enabled: boolean) => {
    console.log(`Toggle push for client ${clientId} to ${enabled}`)
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === clientId 
          ? { ...client, pushEnabled: enabled } 
          : client
      )
    )
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
                  alt="Alex Dube"
                  size={40}
                />
                <div>
                  <h2 className="text-white font-semibold">Alex Dube</h2>
                  <p className="text-white/60 text-sm">Premium Plan</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/60"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <Sidebar isMobile={true} />
          </div>
        </div>
      )}
      
      {/* Desktop View */}
      <div className="relative w-full min-h-screen z-10 hidden lg:flex">
        {/* Sidebar */}
        <div className={`fixed top-0 left-0 h-full z-20 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-[-100%]'}`}>
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className={`transition-all duration-300 ease-in-out flex-1 ${isSidebarOpen ? 'ml-[304px]' : 'ml-0'} p-5`}>
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
                
                <div className="flex items-center gap-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" fill="#636363"/>
                    <path d="M16.5 11C18.1569 11 19.5 9.65685 19.5 8C19.5 6.34315 18.1569 5 16.5 5C14.8431 5 13.5 6.34315 13.5 8C13.5 9.65685 14.8431 11 16.5 11Z" fill="#636363"/>
                    <path d="M9 13C6.33 13 1 14.34 1 17V19H17V17C17 14.34 11.67 13 9 13Z" fill="#636363"/>
                    <path d="M16.5 13C15.71 13 14.73 13.16 13.69 13.44C14.76 14.45 15.5 15.74 15.5 17V19H23V17C23 14.34 18.67 13 16.5 13Z" fill="#636363"/>
                  </svg>
                  
                  <h2 className="text-[25px] font-bold text-[#1E1E1E]">Client Management</h2>
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
                    alt="Alex Dube"
                    size={45}
                  />
                  <div className="flex flex-col">
                    <span className="text-[16px] font-semibold text-[#201D1D] capitalize">Alex Dube</span>
                    <span className="text-[14px] text-[#636363] capitalize">Admin</span>
                  </div>
                </div>
              </div>
            </header>
            
            <div className="flex justify-between items-center mb-6">
              <div className="w-full md:w-auto max-w-[463px]">
                <div className="flex items-center gap-3 px-6 py-3 rounded-[43px] bg-[rgba(16,106,2,0.1)]">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.625 15.75C12.56 15.75 15.75 12.56 15.75 8.625C15.75 4.68997 12.56 1.5 8.625 1.5C4.68997 1.5 1.5 4.68997 1.5 8.625C1.5 12.56 4.68997 15.75 8.625 15.75Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.5 16.5L15 15" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Search client" 
                    className="flex-1 bg-transparent border-none outline-none text-[#545454]"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsAddClientModalOpen(true)}
                  className="bg-[#F3F7F3] border border-[#13A753]/20 text-[#13A753] py-2.5 px-5 rounded-full flex items-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12H16" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V8" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-semibold">Add Client</span>
                </button>
                
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

            {/* Client Table */}
            <ClientTable 
              clients={clients}
              onViewClient={handleViewClient} 
              onTogglePush={handleTogglePush}
            />
          </div>
        </div>
      </div>
      
      {/* Mobile View */}
      <div className="relative w-full min-h-screen z-10 lg:hidden">
        {/* Header */}
        <header className="bg-white px-5 py-4 flex justify-between items-center shadow-sm">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7H21" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M3 12H21" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M3 17H21" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          
          <h1 className="font-bold text-lg">Client Management</h1>
          
          <div className="flex items-center gap-3">
            <button className="relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6.43994V9.76994" stroke="#1E1E1E" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
                <path d="M12.02 2C8.34002 2 5.36002 4.98 5.36002 8.66V10.76C5.36002 11.44 5.08002 12.46 4.73002 13.04L3.46002 15.16C2.68002 16.47 3.22002 17.93 4.66002 18.41C9.44002 20 14.61 20 19.39 18.41C20.74 17.96 21.32 16.38 20.59 15.16L19.32 13.04C18.97 12.46 18.69 11.43 18.69 10.76V8.66C18.68 5 15.68 2 12.02 2Z" stroke="#1E1E1E" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
                <path d="M15.33 18.8201C15.33 20.6501 13.83 22.1501 12 22.1501C11.09 22.1501 10.25 21.7701 9.65004 21.1701C9.05004 20.5701 8.67004 19.7301 8.67004 18.8201" stroke="#1E1E1E" strokeWidth="1.5" strokeMiterlimit="10"/>
              </svg>
              <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[#FF3B30] rounded-full text-white text-[10px] font-bold">
                7
              </div>
            </button>
            <ProfileAvatar 
              src="/images/profile.jpg" 
              alt="Alex Dube"
              size={32}
            />
          </div>
        </header>
        
        {/* Mobile Content */}
        <div className="p-4">
          <div className="bg-[#F3F7F3] rounded-[25px] p-3 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[18px] font-bold text-[#1E1E1E]">Clients</h2>
              <button
                onClick={() => setIsAddClientModalOpen(true)}
                className="bg-[#13A753] hover:bg-[#0D8A40] transition-colors text-white py-1.5 px-3 rounded-full flex items-center gap-1.5 text-sm"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Add</span>
              </button>
            </div>
            
            <div className="mb-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-[43px] bg-white">
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.625 15.75C12.56 15.75 15.75 12.56 15.75 8.625C15.75 4.68997 12.56 1.5 8.625 1.5C4.68997 1.5 1.5 4.68997 1.5 8.625C1.5 12.56 4.68997 15.75 8.625 15.75Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.5 16.5L15 15" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search client" 
                  className="flex-1 bg-transparent border-none outline-none text-[#545454] text-sm"
                />
              </div>
            </div>
          </div>

          {/* Mobile Client Table */}
          <ClientTable 
            clients={clients}
            onViewClient={handleViewClient} 
            onTogglePush={handleTogglePush}
            isMobile={true} 
          />
        </div>
      </div>
      
      {/* Popups */}
      <AddClientModal 
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onAddClient={handleAddClient}
      />
      
      <ClientDetailsModal 
        isOpen={isClientDetailsModalOpen}
        onClose={() => setIsClientDetailsModalOpen(false)}
        client={selectedClient || {
          name: '',
          group: '',
          dietaryGoal: '',
        }}
      />
    </div>
  )
} 