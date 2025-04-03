'use client'

import { useState, useEffect } from 'react'
import { Group } from '@/components/dashboard/GroupsTable'
import { 
  CreateGroupModal, 
  EditGroupModal
} from '@/components/dashboard/ClientPopups'
import { useAppContext } from '@/context/AppContext'
import { useTranslation } from 'react-i18next'
import { groupsApi, traineesApi } from '@/services/fitTrackApi'
import { DEBUG_MODE, parseApiResponse } from '@/utils/config'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import GroupsTable from '@/components/dashboard/GroupsTable'
import { Client } from '@/components/dashboard/ClientTable'

// Define group type for API responses
interface ApiGroup {
  id: string;
  name: string;
  dietary_guidelines: string;
  weekly_menu: string;
  [key: string]: unknown;
}

// Define trainee type for API responses
interface ApiTrainee {
  id: string;
  name: string;
  email: string;
  phone: string;
  group_id: string;
  [key: string]: unknown;
}

// Function to convert API groups to Group format
function convertApiGroupsToGroups(apiGroups: ApiGroup[]): Group[] {
  return apiGroups.map(group => ({
    id: group.id,
    name: group.name,
    members: 0, // Start with 0, will be updated with actual count later
    dietary: group.dietary_guidelines || '',
    mealPlan: group.weekly_menu || '',
    createdAt: new Date().toLocaleDateString(), // Add default value
    apiData: group
  }))
}

// CSS animations
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
`

export default function CoachingGroupsPage() {
  const { groups: contextGroups, addGroup, updateGroup, deleteGroup } = useAppContext()
  const { t } = useTranslation()
  
  // API data states
  const [apiGroups, setApiGroups] = useState<ApiGroup[]>([])
  const [apiTrainees, setApiTrainees] = useState<ApiTrainee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Modal states
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [showEditGroupModal, setShowEditGroupModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([])
  const [availableClients, setAvailableClients] = useState<Client[]>([])
  
  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [successMessage])
  
  // Fetch groups and trainees from API
  useEffect(() => {
    fetchData()
  }, [])
  
  // Function to fetch data from API
  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch groups
      if (groupsApi) {
        const groupsResponse = await groupsApi.list()
        const groups = parseApiResponse<ApiGroup>(groupsResponse.data);
        if (groups.length > 0) {
          setApiGroups(groups);
          if (DEBUG_MODE) {
            console.log('Fetched groups:', groups)
          }
        }
      }
      
      // Fetch trainees/clients
      if (traineesApi) {
        const traineesResponse = await traineesApi.list()
        const trainees = parseApiResponse<ApiTrainee>(traineesResponse.data);
        if (trainees.length > 0) {
          setApiTrainees(trainees);
          
          // Convert to client format for modals
          const clients: Client[] = trainees.map(trainee => ({
            id: trainee.id,
            name: trainee.name,
            image: '/images/profile.jpg',
            group: '', // Will be filled based on group_id
            status: 'active',
            compliance: 'compliant'
          }));
          
          setAvailableClients(clients);
          
          if (DEBUG_MODE) {
            console.log('Fetched trainees for clients:', trainees)
          }
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load groups and clients')
      setApiGroups([])
      setApiTrainees([])
    } finally {
      setLoading(false)
    }
  }
  
  // Update filtered groups when apiGroups, contextGroups, or searchQuery changes
  useEffect(() => {
    // Use API groups if available, otherwise fall back to context groups
    const baseGroups = apiGroups.length > 0 
      ? convertApiGroupsToGroups(apiGroups)
      : contextGroups
      
    // Add members to each group based on trainees
    const groupsWithMembers = baseGroups.map(group => {
      // Find trainees that belong to this group
      const members = apiTrainees
        .filter(trainee => trainee.group_id === group.id)
        .map(trainee => trainee.name)
        
      return {
        ...group,
        members
      }
    })
    
    // Filter groups based on search query
    const filtered = searchQuery
      ? groupsWithMembers.filter(group => 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (group.dietary && group.dietary.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      : groupsWithMembers
    
      setFilteredGroups(filtered)
  }, [apiGroups, apiTrainees, contextGroups, searchQuery])
  
  // Handle creating a new group
  const handleCreateGroup = async (group: {
    name: string;
    dietary: string;
    mealPlan: string;
  }) => {
    setLoading(true);
    
    try {
      // Prepare the API request data
      const apiRequestData = {
        mdl: 'groups',
        act: 'set',
        name: group.name,
        dietary_guidelines: group.dietary,
        weekly_menu: group.mealPlan
      };
      
      // Make the API request
      const response = await groupsApi.set(apiRequestData);
      
      if (response.data && response.data.success) {
        // Show success message
        setSuccessMessage(t('group_created_successfully'));
        
        // Add to context if needed (as fallback)
        addGroup({
          id: response.data.id || `temp-${Date.now()}`,
          name: group.name,
          members: 0,
          dietary: group.dietary,
          mealPlan: group.mealPlan,
          createdAt: new Date().toLocaleDateString()
        });
        
        // Refresh data
        fetchData();
      } else {
        setError(response.data?.message || 'Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      setError('An error occurred while creating the group');
    } finally {
      setLoading(false);
      setShowCreateGroupModal(false);
    }
  };
  
  // Handle view/edit group
  const handleEditGroup = (group: Group) => {
    setSelectedGroup(group)
    setShowEditGroupModal(true)
  }
  
  // Handle saving edited group
  const handleSaveEditedGroup = async (editedGroup: {
    id: string;
    name: string;
    dietary: string;
    mealPlan: string;
  }) => {
    setLoading(true);
    
    try {
      // Prepare API request data
      const apiRequestData = {
        mdl: 'groups',
        act: 'set',
        id: editedGroup.id,
        name: editedGroup.name,
        dietary_guidelines: editedGroup.dietary,
        weekly_menu: editedGroup.mealPlan
      };
      
      // Make the API request
      const response = await groupsApi.set(apiRequestData);
      
      if (response.data && response.data.success) {
        // Show success message
        setSuccessMessage(t('group_updated_successfully'));
        
        // Update in context
        updateGroup(editedGroup.id, {
          name: editedGroup.name,
          dietary: editedGroup.dietary,
          mealPlan: editedGroup.mealPlan
        });
        
        // Refresh data
        fetchData();
      } else {
        setError(response.data?.message || 'Failed to update group');
      }
    } catch (error) {
      console.error('Error updating group:', error);
      setError('An error occurred while updating the group');
    } finally {
      setLoading(false);
      setShowEditGroupModal(false);
    }
  };
  
  // Handle delete group
  const handleDeleteGroup = async (groupId: string) => {
    try {
      setLoading(true)
      const response = await groupsApi.delete(groupId)
      
      if (response.data && response.data.success) {
        // Refresh groups list
        const groupsResponse = await groupsApi.list()
        const updatedGroups = parseApiResponse<ApiGroup>(groupsResponse.data);
        if (updatedGroups.length > 0) {
          setApiGroups(updatedGroups);
        }
        
        // Also update context for fallback
        deleteGroup(groupId)
        setSuccessMessage(t('groupsPage.groupDeletedSuccess'))
      }
    } catch (err) {
      console.error('Error deleting group:', err)
      setError(t('groupsPage.errorDeletingGroup'))
      // Fall back to context only
      deleteGroup(groupId)
    } finally {
      setLoading(false)
    }
  }
  
  // Define page icon for groups page
  const groupsPageIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" fill="#636363"/>
      <path d="M3 22V17C3 16.02 3.4 15.13 4.07 14.5C4.74 13.88 5.62 13.5 6.56 13.5H11.43C12.37 13.5 13.26 13.88 13.93 14.5C14.6 15.13 15 16.02 15 17V22" fill="#636363"/>
      <path d="M16 6.25H24" stroke="#636363" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 10.75H20" stroke="#636363" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 15.25H24" stroke="#636363" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 19.75H20" stroke="#636363" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
  
  // Display loading state
  if (loading && filteredGroups.length === 0) {
  return (
      <DashboardLayout
        pageTitle={t('groupsPage.header')}
        pageIcon={groupsPageIcon}
      >
        <style jsx>{animations}</style>
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-4 border-t-[#13A753] border-r-[#13A753] border-b-transparent border-l-transparent animate-spin"></div>
              <div className="absolute inset-3 rounded-full border-2 border-t-[#13A753]/40 border-r-[#13A753]/40 border-b-transparent border-l-transparent animate-spin" style={{ animationDirection: 'reverse' }}></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">{t('groupsPage.loading')}</p>
        </div>
        </div>
      </DashboardLayout>
    )
  }
  
  return (
    <DashboardLayout
      pageTitle={t('groupsPage.header')}
      pageIcon={groupsPageIcon}
    >
      <style jsx>{animations}</style>
      
      <div className="flex flex-col animate-fade-in">
        {/* Error notification */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold mr-1">Error:</strong>
            <span className="block sm:inline">{error}</span>
              <button 
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
              </button>
            </div>
        )}
        
        {/* Success message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{successMessage}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setSuccessMessage(null)}
            >
              <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
        </div>
      )}
      
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#13A753]"></div>
        </div>
        )}
        
        {/* Header Section with Stats and Actions */}
        <div className="bg-white p-6 rounded-25 shadow-md border border-gray-100 mb-8 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
              <div className="bg-[#13A753]/10 rounded-full w-16 h-16 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" fill="#13A753"/>
                  <path d="M3 22V17C3 16.02 3.4 15.13 4.07 14.5C4.74 13.88 5.62 13.5 6.56 13.5H11.43C12.37 13.5 13.26 13.88 13.93 14.5C14.6 15.13 15 16.02 15 17V22" fill="#13A753" fillOpacity="0.6"/>
                  <path d="M16 6.25H24" stroke="#13A753" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 10.75H20" stroke="#13A753" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M20 15.25H24" stroke="#13A753" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M18 19.75H20" stroke="#13A753" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{filteredGroups.length}</h2>
                <p className="text-gray-500">{t('groupsPage.totalGroups')}</p>
              </div>
            </div>
            
            <div className="w-full md:w-auto flex flex-col md:flex-row gap-4 items-center">
              <div className="w-full md:w-80 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5 17.5L12.5001 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                  <input 
                    type="text" 
                  placeholder={t('groupsPage.searchPlaceholder')} 
                    value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-25 leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                />
                {searchQuery && (
                  <button 
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={() => setSearchQuery('')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 6L18 18" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>
              
                <button 
                  onClick={() => setShowCreateGroupModal(true)}
                className="w-full md:w-auto bg-[#13A753] text-white flex items-center justify-center gap-2 py-3 px-6 rounded-25 hover:bg-[#0F8A44] shadow-md hover:shadow-lg transition-all duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                <span className="font-medium">{t('groupsPage.createGroup')}</span>
                </button>
            </div>
          </div>
        </div>
        
        {/* Desktop View - Replace old table with GroupsTable */}
        <div className="hidden md:block">
          <div className="bg-white rounded-25 shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg">
            <GroupsTable 
              groups={filteredGroups}
              searchTerm={searchQuery}
              onViewGroup={handleEditGroup}
              onDeleteGroup={(group) => handleDeleteGroup(group.id)}
              isMobile={false}
            />
          </div>
        </div>
        
        {/* Mobile View - Replace card view with GroupsTable */}
        <div className="md:hidden">
          <div className="animate-fade-in">
              <GroupsTable 
                groups={filteredGroups}
              searchTerm={searchQuery}
              onViewGroup={handleEditGroup}
              onDeleteGroup={(group) => handleDeleteGroup(group.id)}
                isMobile={true}
              />
        </div>
      </div>
      
        {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        onCreateGroup={handleCreateGroup}
      />
      
        {/* Edit Group Modal */}
        {selectedGroup && (
      <EditGroupModal
        isOpen={showEditGroupModal}
        onClose={() => setShowEditGroupModal(false)}
        onEditGroup={handleSaveEditedGroup}
        group={selectedGroup}
      />
        )}
    </div>
    </DashboardLayout>
  )
}