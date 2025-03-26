'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import ClientTable from '@/components/dashboard/ClientTable'
import { traineesApi, groupsApi } from '@/services/fitTrackApi'
import { DEBUG_MODE } from '@/utils/config'

// Example of how to use the DashboardLayout with the new TopBar
export default function ClientManagementPage() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch trainees
        const traineesResponse = await traineesApi.list()
        if (traineesResponse.data && traineesResponse.data.trainees) {
          // Fetch groups to map group_id to group names
          const groupsResponse = await groupsApi.list()
          
          if (DEBUG_MODE) {
            console.log('Fetched trainees:', traineesResponse.data.trainees)
            console.log('Fetched groups:', groupsResponse.data.groups)
          }
        }
      } catch (err) {
        console.error('Error fetching trainees:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-white">Loading client data...</div>
      </div>
    )
  }

  // Define page icon for clients page
  const clientsPageIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" fill="#636363"/>
      <path d="M16.5 11C18.1569 11 19.5 9.65685 19.5 8C19.5 6.34315 18.1569 5 16.5 5C14.8431 5 13.5 6.34315 13.5 8C13.5 9.65685 14.8431 11 16.5 11Z" fill="#636363"/>
      <path d="M9 13C6.33 13 1 14.34 1 17V19H17V17C17 14.34 11.67 13 9 13Z" fill="#636363"/>
      <path d="M16.5 13C15.71 13 14.73 13.16 13.69 13.44C14.76 14.45 15.5 15.74 15.5 17V19H23V17C23 14.34 18.67 13 16.5 13Z" fill="#636363"/>
    </svg>
  )

  return (
    <DashboardLayout
      pageTitle={t('clientManagementPage.header')}
      pageIcon={clientsPageIcon}
      profileName="Alex Dube" // Customize the profile name
      profileRole="admin" // Customize the profile role
      notificationCount={5} // Customize notification count
    >
      {/* Client page content */}
      <div className="mb-6">
        <div className="w-full md:w-auto max-w-[463px]">
          <div className="flex items-center gap-3 px-6 py-3 rounded-[43px] bg-[rgba(16,106,2,0.1)]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.625 15.75C12.56 15.75 15.75 12.56 15.75 8.625C15.75 4.68997 12.56 1.5 8.625 1.5C4.68997 1.5 1.5 4.68997 1.5 8.625C1.5 12.56 4.68997 15.75 8.625 15.75Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.5 16.5L15 15" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input 
              type="text" 
              placeholder={t('clientManagementPage.searchPlaceholder')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[#545454]"
            />
          </div>
        </div>
      </div>
        
      {/* Client Actions Button Bar */}
      <div className="flex justify-end items-center gap-4 mb-6">
        <button
          onClick={() => console.log('Export clicked')}
          className="bg-[#F3F7F3] hover:bg-[#E5F0E5] transition-colors text-[#13A753] py-2 px-4 rounded-full flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16V8" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 13L12 16L15 13" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 4H8C6 4 5 5 5 7V17C5 19 6 20 8 20H16C18 20 19 19 19 17V7C19 5 18 4 16 4Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{t('clientManagementPage.export')}</span>
        </button>
          
        <button
          onClick={() => console.log('Add client clicked')}
          className="bg-[#13A753] hover:bg-[#0D8A40] transition-colors text-white py-2 px-4 rounded-full flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{t('clientManagementPage.addClient')}</span>
        </button>
      </div>
        
      {/* Client Table */}
      <ClientTable 
        onViewClient={() => console.log('View client clicked')}
        onTogglePush={() => console.log('Toggle push clicked')}
        isMobile={false}
        searchTerm={searchTerm}
      />
    </DashboardLayout>
  )
} 