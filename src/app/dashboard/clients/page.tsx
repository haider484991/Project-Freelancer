'use client'

import { useState, useEffect, useMemo } from 'react'
import ClientTable, { Client } from '@/components/dashboard/ClientTable'
import { AddClientModal, ClientDetailsModal, EditClientModal } from '@/components/dashboard/ClientPopups'
import { useAppContext } from '@/context/AppContext'
import { useTranslation } from 'react-i18next'
import { traineesApi } from '@/services/fitTrackApi'
import { groupsApi } from '@/services/fitTrackApi'
import { DEBUG_MODE } from '@/utils/config'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { parseApiResponse as parseApiResponseRaw } from '@/utils/config'
import Toast from '@/components/ui/Toast'
import ClientModal from '@/components/dashboard/ClientModal'

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

// Type-safe wrapper function
function parseApiResponse<T>(data: unknown): T[] {
  return parseApiResponseRaw(data) as T[];
}

// Toast notification types
type ToastType = 'success' | 'error' | 'info' | 'warning';

export default function ClientManagementPage() {
  const { t } = useTranslation()
  const { addClient, updateClient, deleteClient, togglePushNotification } = useAppContext()
  
  const [apiTrainees, setApiTrainees] = useState<ApiTrainee[]>([])
  const [apiGroups, setApiGroups] = useState<ApiGroup[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false)
  const [isClientDetailsModalOpen, setIsClientDetailsModalOpen] = useState(false)
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<ExtendedClient | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false)
  const [toast, setToast] = useState<{
    visible: boolean;
    type: ToastType;
    message: string;
  }>({
    visible: false,
    type: 'info',
    message: ''
  })
  
  // Get data and functions from context - keep only what's needed
  const { clients: _contextClients } = useAppContext();
  
  // Add a placeholder function to fix build error
  // This function is not used in the UI but needed for the build
  const handleExportClients = () => {
    console.log('Export feature disabled');
  };
  
  // Show toast notification
  const showToast = (type: ToastType, message: string) => {
    setToast({
      visible: true,
      type,
      message
    });
  };
  
  // Fetch trainees from API
  const fetchClients = async () => {
    setIsLoading(true)
    try {
      // Fetch trainees
      const traineesResponse = await traineesApi.list()
      
      // Log the actual response structure for debugging
      console.log('API Response:', traineesResponse);
      
      // Parse trainees using our type-safe wrapper function
      const trainees = parseApiResponse<ApiTrainee>(traineesResponse.data);
      
      // If we found trainees, use them
      if (trainees.length > 0) {
        setApiTrainees(trainees);
        
        // Fetch groups to map group_id to group names
        const groupsResponse = await groupsApi.list();
        
        // Parse groups using our type-safe wrapper function
        const groups = parseApiResponse<ApiGroup>(groupsResponse.data);
        
        if (groups.length > 0) {
          setApiGroups(groups);
        }
        
        if (DEBUG_MODE) {
          console.log('Processed trainees:', trainees);
          console.log('Processed groups:', groups);
        }
      } else {
        console.warn('Could not extract trainees from response:', traineesResponse.data);
        throw new Error('Unable to extract trainee data from API response');
      }
    } catch (err) {
      console.error('Error fetching trainees:', err);
      setError('Failed to load client data from API. Please check your connection and try again.');
      // We'll no longer fall back to context clients
      setApiTrainees([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchClients();
  }, []);
  
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
        email: trainee.email,
        phone: trainee.phone,
        gender: trainee.gender === '1' ? 'male' : 'female',
        // Store original API data for updates
        apiData: trainee
      } as ExtendedClient))
    }
    
    // Return empty array instead of falling back to context clients
    return []
  }, [apiTrainees, apiGroups])
  
  // Handle add client
  const handleAddClient = async (clientData: {
    name: string;
    email: string;
    phone: string;
    group_id: string;
    target_calories: string;
    target_weight: string;
    gender: string;
    is_active: string;
  }) => {
    try {
      setIsLoading(true);

      // Call API to create trainee
      const response = await traineesApi.set(clientData);

      if (response.data && response.data.result) {
        // Refresh trainees list
        const refreshResponse = await traineesApi.list();
        const refreshedTrainees = parseApiResponse<ApiTrainee>(refreshResponse.data);
        if (refreshedTrainees.length > 0) {
          setApiTrainees(refreshedTrainees);
          showToast('success', t('clientManagementPage.clientAdded'));
        }
      } else {
        throw new Error(response.data?.message || 'Failed to add client');
      }
    } catch (err) {
      console.error('Error adding client:', err);
      showToast('error', t('clientManagementPage.errorAddingClient'));
    } finally {
      setIsLoading(false);
      setIsAddClientModalOpen(false);
    }
  };
  
  // Handle client details
  const handleViewClient = async (client: Client) => {
    try {
      setIsLoading(true);
      
      // Get the client ID (assuming the ExtendedClient has apiData with id)
      const clientId = (client as ExtendedClient).apiData?.id || client.id;
      
      // Call the API to get detailed client data
      const response = await traineesApi.get(clientId);
      console.log('Client details API response:', response);
      
      if (response.data && response.data.result) {
        // Get the API trainee data
        const traineeData = response.data.result;
        
        // Find the corresponding group name
        const groupName = apiGroups.find(g => g.id === traineeData.group_id)?.name || 'Unknown Group';
        
        // Create extended client with API data
        const extendedClient: ExtendedClient = {
          ...client,
          name: traineeData.name,
          email: traineeData.email,
          phone: traineeData.phone,
          group: groupName,
          dietaryGoal: `${traineeData.target_calories} calories / ${traineeData.target_weight} kg`,
          status: traineeData.is_active === '1' ? 'active' : 'inactive',
          gender: traineeData.gender === '1' ? 'male' : 'female',
          apiData: traineeData
        };
        
        // Set the selected client with the API data
        setSelectedClient(extendedClient);
        setIsClientDetailsModalOpen(true);
      } else {
        throw new Error('Failed to fetch client details');
      }
    } catch (error) {
      console.error('Error fetching client details:', error);
      showToast('error', t('clientManagementPage.errorFetchingClientDetails'));
      
      // Fallback to using existing client data
      setSelectedClient(client as ExtendedClient);
      setIsClientDetailsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle toggle push notification
  const handleTogglePush = async (clientId: string, enabled: boolean) => {
    try {
      setIsLoading(true);
      await togglePushNotification(clientId, enabled);
      
      // Show success toast
      showToast('success', t('clientManagementPage.pushNotificationsUpdated'));
    } catch (error) {
      console.error('Error toggling push notification:', error);
      showToast('error', t('clientManagementPage.errorTogglePush'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle opening the edit client modal
  const handleEditClientClick = (client: ExtendedClient) => {
    setSelectedClient(client);
    setIsEditClientModalOpen(true);
  };
  
  // Handle edit client submission
  const handleEditClient = async (updatedClient: ExtendedClient) => {
    try {
      setIsLoading(true);
      
      // Find the original API data
      const originalData = updatedClient.apiData;
      
      if (originalData) {
        // Find the group ID based on the group name
        const selectedGroup = apiGroups.find(g => g.name === updatedClient.group);
        const groupId = selectedGroup ? selectedGroup.id : originalData.group_id;

        // Extract target values from dietaryGoal if available
        let targetCalories = originalData.target_calories || '0';
        let targetWeight = originalData.target_weight || '0';
        
        if (updatedClient.dietaryGoal) {
          try {
            // More robust parsing
            const match = updatedClient.dietaryGoal.match(/(\d+)\s+calories\s+\/\s+(\d+)\s+kg/);
            if (match && match.length >= 3) {
              targetCalories = match[1];
              targetWeight = match[2];
            }
          } catch (parseError) {
            console.warn('Error parsing dietary goal:', parseError);
            // Fallback to original values
          }
        }

        // Prepare trainee data for API - match the exact format from the Postman collection
        const traineeData = {
          id: originalData.id,
          name: updatedClient.name || originalData.name,
          email: updatedClient.email || originalData.email || '',
          phone: updatedClient.phone || originalData.phone || '',
          group_id: groupId,
          target_calories: String(targetCalories),
          target_weight: String(targetWeight),
          gender: updatedClient.gender === 'male' ? '1' : '2',
          is_active: updatedClient.status === 'active' ? '1' : '0'
        };
        
        console.log('Sending update with data:', traineeData);
        
        // Use the traineesApi correctly - it will add 'mdl' and 'act' internally
        if (!traineesApi) {
          throw new Error('traineesApi is not available');
        }
        
        const response = await traineesApi.set(traineeData);
        console.log('Update response:', response);
        
        if (response.data && response.data.result) {
          // Update client in context with the ID and updated client data
          updateClient(updatedClient.id, updatedClient);
          
          // Refresh table data
          await fetchClients();
          showToast('success', t('clientManagementPage.clientUpdated'));
          
          // Close the modal
          setIsClientDetailsModalOpen(false);
        } else {
          throw new Error(response.data?.message || response.data?.error || 'Failed to update client');
        }
      } else {
        throw new Error('Missing original client data');
      }
    } catch (error) {
      console.error('Error updating client:', error);
      showToast('error', t('clientManagementPage.errorUpdatingClient'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle delete client
  const handleDeleteClient = async (client: ExtendedClient) => {
    try {
      setIsLoading(true);
      
      // Ensure we have the API data
      if (client.apiData && client.apiData.id) {
        // Call API to delete the trainee
        await traineesApi.delete(client.apiData.id);
        
        // Delete from context
        deleteClient(client.id);
        
        // Refresh client list
        await fetchClients();
        showToast('success', t('clientManagementPage.clientDeleted'));
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      showToast('error', t('clientManagementPage.errorDeletingClient'));
    } finally {
      setIsLoading(false);
      setDeleteConfirmationVisible(false);
    }
  };
  
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
      
      {/* Client summary cards - show only total count */}
      <div className="mb-6 animate-fade-in">
        <div className="bg-white p-6 rounded-25 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
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
              <h3 className="text-2xl font-bold text-gray-800">{clientsList.length}</h3>
              <p className="text-gray-500 truncate max-w-[150px]">{t('clientManagementPage.total_clients')}</p>
            </div>
            </div>
          </div>
        </div>
        
      {/* Page heading and search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('clientManagementPage.title')}</h1>
          <p className="text-gray-500">{t('clientManagementPage.manage_clients')}</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('common.search')}
              className="pl-10 pr-4 py-2 w-full md:w-[250px] rounded-25 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="absolute left-3 top-2.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
                
                <button 
              onClick={() => setIsAddClientModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-25 flex items-center gap-2 hover:bg-[#0D8443] transition-colors whitespace-nowrap"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
            {t('clientManagementPage.add_client')}
                </button>
            </div>
            </div>
            
      {/* Client table */}
      <div className="bg-white rounded-25 shadow-md p-6">
        <ClientTable 
          clients={clientsList}
          onViewClient={handleViewClient}
          onTogglePush={handleTogglePush}
          onEdit={handleEditClientClick}
          searchTerm={searchTerm}
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
          <h3 className="text-xl font-bold text-gray-800">{clientsList.length}</h3>
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
          <h3 className="text-xl font-bold text-gray-800">{clientsList.filter(client => client.status === 'active').length}</h3>
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
          <h3 className="text-xl font-bold text-gray-800">{clientsList.filter(client => client.status === 'inactive').length}</h3>
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
          <h3 className="text-xl font-bold text-gray-800">{clientsList.filter(client => client.compliance === 'compliant').length}</h3>
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
          </div>

      {/* Mobile client table */}
      <div className="animate-fade-in">
        <ClientTable 
          searchTerm={searchTerm}
          onViewClient={handleViewClient}
          onTogglePush={handleTogglePush}
          onEdit={handleEditClientClick}
          isMobile={true}
          clients={clientsList}
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
      
      {/* Toast notifications */}
      {toast.visible && (
        <Toast
          visible={toast.visible}
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(prev => ({ ...prev, visible: false }))}
        />
      )}
      
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
          onSubmit={handleAddClient}
          groups={apiGroups}
        />
      )}
      
      {/* Edit Client Modal */}
      {selectedClient && isEditClientModalOpen && (
        <EditClientModal
          isOpen={isEditClientModalOpen}
          onClose={() => setIsEditClientModalOpen(false)}
          onSubmit={(formData) => {
            // Convert the form data to ExtendedClient format
            if (selectedClient) {
              const updatedClient: ExtendedClient = {
                ...selectedClient,
                name: formData.name,
                email: formData.email || '',
                phone: formData.phone || '',
                group: apiGroups.find(g => g.id === formData.group_id)?.name || selectedClient.group || '',
                status: formData.is_active === '1' ? 'active' : 'inactive',
                gender: formData.gender === '1' ? 'male' : 'female',
                dietaryGoal: `${formData.target_calories} calories / ${formData.target_weight} kg`,
                apiData: {
                  ...selectedClient.apiData,
                  id: formData.id,
                  name: formData.name,
                  email: formData.email,
                  phone: formData.phone,
                  group_id: formData.group_id,
                  target_calories: formData.target_calories,
                  target_weight: formData.target_weight,
                  gender: formData.gender,
                  is_active: formData.is_active
                }
              };
              handleEditClient(updatedClient);
            }
          }}
          client={selectedClient}
          groups={apiGroups}
        />
      )}
      
      {/* Client Details Modal */}
      {selectedClient && isClientDetailsModalOpen && (
        <ClientDetailsModal
          isOpen={isClientDetailsModalOpen}
          onClose={() => setIsClientDetailsModalOpen(false)}
          client={selectedClient}
          onEdit={handleEditClientClick}
          onDelete={handleDeleteClient}
        />
      )}
    </DashboardLayout>
  )
}