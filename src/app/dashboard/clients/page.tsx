'use client'

import { useState, useEffect, useMemo } from 'react'
import ClientTable, { Client } from '@/components/dashboard/ClientTable'
import { AddClientModal, ClientDetailsModal } from '@/components/dashboard/ClientPopups'
import { useAppContext } from '@/context/AppContext'
import { useTranslation } from 'react-i18next'
import { traineesApi } from '@/services/fitTrackApi'
import { groupsApi } from '@/services/fitTrackApi'
import { DEBUG_MODE } from '@/utils/config'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

// Define types for API responses
interface ApiTrainee {
  id: string;
  name: string;
  email: string;
  phone: string;
  group_id: string;
  target_calories: string;
  target_weight: string;
  gender: string;
  is_active: string;
  [key: string]: unknown;
}

interface ApiGroup {
  id: string;
  name: string;
  [key: string]: unknown;
}

// Extended Client type to include API data
interface ExtendedClient extends Client {
  apiData?: ApiTrainee;
}

export default function ClientManagementPage() {
  const { t } = useTranslation()
  const { addClient, updateClient, deleteClient, toggleClientPush } = useAppContext()
  
  const [apiTrainees, setApiTrainees] = useState<ApiTrainee[]>([])
  const [apiGroups, setApiGroups] = useState<ApiGroup[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false)
  const [isClientDetailsModalOpen, setIsClientDetailsModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<ExtendedClient | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Get data and functions from context - keep only what's needed
  const { clients: contextClients } = useAppContext();
  
  // Fetch trainees from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch trainees
        const traineesResponse = await traineesApi.list()
        if (traineesResponse.data && traineesResponse.data.trainees) {
          setApiTrainees(traineesResponse.data.trainees)
          
          // Fetch groups to map group_id to group names
          const groupsResponse = await groupsApi.list()
          if (groupsResponse.data && groupsResponse.data.groups) {
            setApiGroups(groupsResponse.data.groups)
          }
          
          if (DEBUG_MODE) {
            console.log('Fetched trainees:', traineesResponse.data.trainees)
            console.log('Fetched groups:', groupsResponse.data.groups)
          }
        }
      } catch (err) {
        console.error('Error fetching trainees:', err)
        setError('Failed to load trainees')
        // We'll fall back to context clients
        setApiTrainees([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Convert API trainees to Client format and merge with context
  const clientsList = useMemo(() => {
    if (apiTrainees.length > 0) {
      // Find the corresponding group name for a group_id
      const getGroupName = (groupId: string) => {
        const group = apiGroups.find(g => g.id === groupId)
        return group ? group.name : 'Unknown Group'
      }
      
      // Map API trainees to Client format
      return apiTrainees.map(trainee => ({
        id: trainee.id,
        name: trainee.name,
        image: '/images/profile.jpg', // Default image
        group: getGroupName(trainee.group_id),
        goalsMet: 75, // Default value as API doesn't provide this
        dietaryGoal: `${trainee.target_calories} calories / ${trainee.target_weight} kg`,
        status: trainee.is_active === '1' ? 'active' : 'inactive',
        compliance: 'compliant', // Default value as API doesn't provide this
        pushEnabled: true, // Default value as API doesn't provide this
        // Store original API data for updates
        apiData: trainee
      } as ExtendedClient))
    }
    
    // Fall back to context clients if no API data
    return contextClients
  }, [apiTrainees, apiGroups, contextClients])
  
  // Handle add client
  const handleAddClient = async (client: Partial<Client>) => {
    try {
      setIsLoading(true);

      // Find the group ID based on the selected group name
      const selectedGroup = apiGroups.find(g => g.name === client.group);
      const groupId = selectedGroup ? selectedGroup.id : '1'; // Default to first group if not found

      // Prepare trainee data for API
      const traineeData = {
        name: client.name || '',
        email: 'client@example.com', // Default email
        phone: '123456789', // Default phone
        group_id: groupId,
        target_calories: client.dietaryGoal?.split(' ')[0] || '2000', // Try to extract calories value
        target_weight: client.dietaryGoal?.split(' ')[3] || '70', // Try to extract weight value
        gender: '1', // Default to male
        is_active: '1' // Set as active by default
      };

      // Call API to create trainee
      const response = await traineesApi.set(traineeData);

      if (response.data && response.data.success) {
        // Refresh trainees list
        const refreshResponse = await traineesApi.list();
        if (refreshResponse.data && refreshResponse.data.trainees) {
          setApiTrainees(refreshResponse.data.trainees);
        }
      }
    } catch (err) {
      console.error('Error adding client:', err);
      setError('Failed to add client. Using local data instead.');
      
      // Fall back to context only
      const newClient = {
        ...client,
        id: Math.random().toString(36).substring(7),
        image: '/images/profile.jpg',
        goalsMet: 75,
        status: 'active' as const,
        compliance: 'compliant' as const
      } as Client;
      
      addClient(newClient);
    } finally {
      setIsLoading(false);
      setIsAddClientModalOpen(false);
    }
  };
  
  // Handle client details
  const handleViewClient = (client: Client) => {
    setSelectedClient(client as ExtendedClient)
    setIsClientDetailsModalOpen(true)
  }
  
  // Handle update client
  const handleUpdateClient = async (client: ExtendedClient) => {
    try {
      setIsLoading(true);
      
      // Get the original API data
      const originalData = client.apiData;
      
      if (originalData) {
        // Find the group ID based on the group name
        const selectedGroup = apiGroups.find(g => g.name === client.group);
        const groupId = selectedGroup ? selectedGroup.id : originalData.group_id;

        // Extract target values from dietaryGoal if available
        let targetCalories = originalData.target_calories;
        let targetWeight = originalData.target_weight;
        
        if (client.dietaryGoal) {
          const parts = client.dietaryGoal.split(' ');
          if (parts.length >= 1) targetCalories = parts[0];
          if (parts.length >= 4) targetWeight = parts[3];
        }
        
        // Prepare trainee data for API
        const traineeData = {
          id: client.id,
          name: client.name,
          email: originalData.email,
          phone: originalData.phone,
          group_id: groupId,
          target_calories: targetCalories,
          target_weight: targetWeight,
          gender: originalData.gender,
          is_active: client.status === 'active' ? '1' : '0'
        };
        
        // Call API to update trainee
        const response = await traineesApi.set(traineeData);
        
        if (response.data && response.data.success) {
          // Refresh trainees list
          const refreshResponse = await traineesApi.list();
          if (refreshResponse.data && refreshResponse.data.trainees) {
            setApiTrainees(refreshResponse.data.trainees);
          }
        }
      } else {
        // Fall back to context
        updateClient(client as Client);
      }
    } catch (err) {
      console.error('Error updating client:', err);
      updateClient(client as Client); // Fall back to context
    } finally {
      setIsLoading(false);
      setIsClientDetailsModalOpen(false);
    }
  };
  
  // Handle toggle push notifications
  const handleTogglePush = (clientId: string, enabled: boolean) => {
    toggleClientPush(clientId, enabled)
  }
  
  // Handle delete client
  const handleDeleteClient = async (clientId: string) => {
    try {
      setIsLoading(true);
      
      // Call API to delete trainee
      const response = await traineesApi.delete(clientId);
      
      if (response.data && response.data.success) {
        // Refresh trainees list
        const refreshResponse = await traineesApi.list();
        if (refreshResponse.data && refreshResponse.data.trainees) {
          setApiTrainees(refreshResponse.data.trainees);
        }
        
        // Also update context
        deleteClient(clientId);
      }
    } catch (err) {
      console.error('Error deleting client:', err);
      deleteClient(clientId); // Fall back to context
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle export clients (example function)
  const handleExportClients = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Exporting clients:', clientsList)
    // Implement export logic
  }
  
  // Handle schedule (example function)
  const handleSchedule = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Opening schedule')
    // Implement schedule logic
  }
  
  // Client page icon
  const clientPageIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.0495 2.53L4.02953 6.46C2.09953 7.72 2.09953 10.54 4.02953 11.8L10.0495 15.73C11.1295 16.44 12.9095 16.44 13.9895 15.73L19.9795 11.8C21.8995 10.54 21.8995 7.73 19.9795 6.47L13.9895 2.54C12.9095 1.82 11.1295 1.82 10.0495 2.53Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.6293 13.08L5.6193 17.77C5.6193 19.04 6.6093 20.4 7.7993 20.8L10.9893 21.86C11.5393 22.04 12.4493 22.04 13.0093 21.86L16.1993 20.8C17.3893 20.4 18.3793 19.04 18.3793 17.77V13.13" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21.4004 15V9" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  
  // CSS animations for the client page
  const animations = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes grow {
      from { transform: scale(0.9); }
      to { transform: scale(1); }
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(19, 167, 83, 0.2); }
      70% { box-shadow: 0 0 0 10px rgba(19, 167, 83, 0); }
      100% { box-shadow: 0 0 0 0 rgba(19, 167, 83, 0); }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    
    .animate-slide-in {
      animation: slideIn 0.3s ease-out forwards;
    }
    
    .animate-grow {
      animation: grow 0.2s ease-out forwards;
    }
    
    .animate-pulse {
      animation: pulse 2s infinite;
    }
    
    .staggered-item:nth-child(1) { animation-delay: 0.05s; }
    .staggered-item:nth-child(2) { animation-delay: 0.1s; }
    .staggered-item:nth-child(3) { animation-delay: 0.15s; }
    .staggered-item:nth-child(4) { animation-delay: 0.2s; }
    .staggered-item:nth-child(5) { animation-delay: 0.25s; }
  `;

  // Desktop content
  const desktopContent = (
    <>
      <style jsx>{animations}</style>
      
      {/* Client summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 animate-fade-in">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-[#13A753]/10 p-3 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" fill="#13A753"/>
                <path d="M16.3598 3.08C16.7398 3.02 17.1298 3 17.5098 3C19.9898 3 21.9998 5.01 21.9998 7.5C21.9998 9.99 19.9898 12 17.5098 12C16.2598 12 15.1198 11.5 14.2998 10.68" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17C2 14.79 3.79 13 6 13H12C14.21 13 16 14.79 16 17V20C16 20.55 15.55 21 15 21H3C2.45 21 2 20.55 2 20V17Z" fill="#13A753" fillOpacity="0.6"/>
                <path d="M17.5 21H20.5C21.05 21 21.5 20.55 21.5 20V17C21.5 14.79 19.71 13 17.5 13C16.53 13 15.63 13.33 14.96 13.88" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-2xl font-bold text-gray-800">4</h3>
              <p className="text-gray-500 truncate max-w-[150px]">Total</p>
            </div>
                </div>
              </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.75 12L10.58 14.83L16.25 9.17004" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-2xl font-bold text-gray-800">3</h3>
              <p className="text-gray-500 truncate max-w-[150px]">Active</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V13" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9945 16H12.0035" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-2xl font-bold text-gray-800">1</h3>
              <p className="text-gray-500 truncate max-w-[150px]">Inactive</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
            <div className="bg-purple-50 p-3 rounded-full">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V5" stroke="#8B5CF6" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V5" stroke="#8B5CF6" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 9.09H20.5" stroke="#8B5CF6" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#8B5CF6" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.6947 13.7H15.7037" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.6947 16.7H15.7037" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9955 13.7H12.0045" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9955 16.7H12.0045" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.29431 13.7H8.30329" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.29431 16.7H8.30329" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-2xl font-bold text-gray-800">4</h3>
              <p className="text-gray-500 truncate max-w-[150px]">Compliant</p>
            </div>
          </div>
                </div>
              </div>
              
      {/* Error message if any */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm animate-fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
            <span className="font-medium">{error}</span>
          </div>
                </div>
      )}
      
      {/* Client management controls */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-6 hover:shadow-lg transition-all duration-300 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 17.5L12.5001 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder={t('clientManagementPage.searchClients')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
                </div>
              </div>
              
          <div className="flex gap-3">
                <button
              onClick={handleExportClients}
              className="bg-white flex items-center gap-2 py-3 px-5 rounded-xl text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.44 8.8999C20.04 9.2099 21.51 11.0599 21.51 15.1099V15.2399C21.51 19.7099 19.72 21.4999 15.25 21.4999H8.73998C4.26998 21.4999 2.47998 19.7099 2.47998 15.2399V15.1099C2.47998 11.0899 3.92998 9.2399 7.46998 8.9099" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15.0001V3.62012" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.35 5.85L12 2.5L8.65002 5.85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              <span className="font-medium">{t('clientManagementPage.export')}</span>
                </button>
                
                <button 
              onClick={handleSchedule}
              className="bg-white flex items-center gap-2 py-3 px-5 rounded-xl text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.5 27.5V29.5C24.5 30.5 23.5 31.5 22.5 31.5H14.5C13.5 31.5 12.5 30.5 12.5 29.5V14.5C12.5 13.5 13.5 12.5 14.5 12.5H22.5C23.5 12.5 24.5 13.5 24.5 14.5V16.5" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M27.5 16.5H29.5C30.5 16.5 31.5 17.5 31.5 18.5V27.5C31.5 28.5 30.5 29.5 29.5 29.5H27.5" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24.5 22H31.5" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24.5 19.25V24.75" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              <span className="font-medium">{t('clientManagementPage.schedule')}</span>
                </button>
                
                <button 
              onClick={() => setIsAddClientModalOpen(true)}
              className="bg-[#13A753] text-white flex items-center gap-2 py-3 px-5 rounded-xl hover:bg-[#0F8A44] shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12H18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18V6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              <span className="font-medium">{t('clientManagementPage.addClient')}</span>
                </button>
              </div>
            </div>
            </div>
            
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in">
              <ClientTable 
          searchTerm={searchTerm}
                onViewClient={handleViewClient}
                onTogglePush={handleTogglePush}
          isMobile={false}
              />
            </div>
    </>
  )

  // Mobile content 
  const mobileContent = (
    <>
      <style jsx>{animations}</style>
      
      {/* Error message if any */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm animate-fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}
      
      {/* Client summary cards - mobile scrollable */}
      <div className="flex overflow-x-auto gap-3 pb-2 mb-5 hide-scrollbar">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 min-w-[130px] animate-fade-in staggered-item">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-[#13A753]/10 p-2 rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" fill="#13A753"/>
                <path d="M2 17C2 14.79 3.79 13 6 13H12C14.21 13 16 14.79 16 17V20C16 20.55 15.55 21 15 21H3C2.45 21 2 20.55 2 20V17Z" fill="#13A753" fillOpacity="0.6"/>
              </svg>
            </div>
            <span className="text-xs text-gray-500 truncate max-w-[90px]">Total</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">4</h3>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 min-w-[130px] animate-fade-in staggered-item">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-blue-50 p-2 rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.75 12L10.58 14.83L16.25 9.17004" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xs text-gray-500 truncate max-w-[90px]">Active</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">3</h3>
          </div>
          
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 min-w-[130px] animate-fade-in staggered-item">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-amber-50 p-2 rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V13" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9945 16H12.0035" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              </div>
            <span className="text-xs text-gray-500 truncate max-w-[90px]">Inactive</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">1</h3>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 min-w-[130px] animate-fade-in staggered-item">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-purple-50 p-2 rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V5" stroke="#8B5CF6" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V5" stroke="#8B5CF6" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 9.09H20.5" stroke="#8B5CF6" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#8B5CF6" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <span className="text-xs text-gray-500 truncate max-w-[90px]">Compliant</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">4</h3>
        </div>
            </div>
            
      {/* Mobile search */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-4 animate-fade-in">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5 17.5L12.5001 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
          </span>
                <input 
                  type="text" 
            className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200"
            placeholder={t('clientManagementPage.searchClients')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setSearchTerm('')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile actions */}
      <div className="flex gap-2 mb-5 animate-fade-in">
        <button
          onClick={() => setIsAddClientModalOpen(true)}
          className="flex-1 bg-[#13A753] text-white flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-medium hover:bg-[#0F8A44] shadow-md hover:shadow-lg transition-all duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12H18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 18V6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{t('clientManagementPage.addClient')}</span>
            </button>
            
            <button
          onClick={handleExportClients}
          className="flex-1 bg-white flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-gray-700 text-sm font-medium border border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.44 8.8999C20.04 9.2099 21.51 11.0599 21.51 15.1099V15.2399C21.51 19.7099 19.72 21.4999 15.25 21.4999H8.73998C4.26998 21.4999 2.47998 19.7099 2.47998 15.2399V15.1099C2.47998 11.0899 3.92998 9.2399 7.46998 8.9099" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15.0001V3.62012" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.35 5.85L12 2.5L8.65002 5.85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
          <span>{t('clientManagementPage.export')}</span>
            </button>
          </div>

      {/* Mobile client table */}
      <div className="animate-fade-in">
          <ClientTable 
          searchTerm={searchTerm}
            onViewClient={handleViewClient}
            onTogglePush={handleTogglePush}
            isMobile={true}
        />
      </div>
    </>
  )

  // Add custom CSS for mobile styling
  const mobileStyles = `
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `;

  return (
    <DashboardLayout
      pageTitle={t('clientManagementPage.title')}
      pageIcon={clientPageIcon}
    >
      <style jsx global>{mobileStyles}</style>
      
      {/* Loading indicator */}
      {isLoading && clientsList.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13A753]"></div>
        </div>
      )}
      
      {/* Desktop View */}
      <div className="hidden lg:block">
        {!isLoading && desktopContent}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        {!isLoading && mobileContent}
      </div>
      
      {/* Modals */}
      {isAddClientModalOpen && (
      <AddClientModal 
          isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onAddClient={handleAddClient}
      />
      )}
      
      {selectedClient && isClientDetailsModalOpen && (
        <>
      <ClientDetailsModal
            isOpen={true}
        onClose={() => setIsClientDetailsModalOpen(false)}
            client={{
              name: selectedClient.name,
              group: selectedClient.group || '',
              dietaryGoal: selectedClient.dietaryGoal || '',
              image: selectedClient.image
            }}
          />
          <div className="fixed bottom-5 left-0 right-0 flex justify-center z-50">
            <div className="bg-white rounded-full shadow-lg p-2 flex gap-2">
              <button 
                onClick={() => handleUpdateClient(selectedClient)}
                className="bg-blue-500 text-white px-4 py-2 rounded-full"
              >
                {t('clientManagementPage.update')}
              </button>
              <button 
                onClick={() => handleDeleteClient(selectedClient.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-full"
              >
                {t('clientManagementPage.delete')}
              </button>
            </div>
    </div>
        </>
      )}
    </DashboardLayout>
  )
}