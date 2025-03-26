'use client'

import { useState, useEffect } from 'react'
import { Group } from '@/components/dashboard/GroupsTable'
import { 
  CreateGroupModal, 
  EditGroupModal
} from '@/components/dashboard/ClientPopups'
import { useAppContext } from '@/context/AppContext'
import { useTranslation } from 'react-i18next'
import { groupsApi } from '@/services/fitTrackApi'
import { DEBUG_MODE } from '@/utils/config'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import GroupsTable from '@/components/dashboard/GroupsTable'

// Define group type for API responses
interface ApiGroup {
  id: string;
  name: string;
  dietary_guidelines: string;
  weekly_menu: string;
  [key: string]: unknown;
}

// Map API group to UI Group format
const mapApiGroupToGroup = (apiGroup: ApiGroup, membersCount = 0): Group => {
  return {
    id: apiGroup.id,
    name: apiGroup.name,
    members: membersCount,
    dietary: apiGroup.dietary_guidelines,
    mealPlan: apiGroup.weekly_menu,
    dietaryGoal: apiGroup.dietary_guidelines,
    createdAt: new Date().toISOString(),
    clients: []
  }
}

// Convert API groups to UI Group array
const convertApiGroupsToGroups = (apiGroups: ApiGroup[]): Group[] => {
  return apiGroups.map(group => mapApiGroupToGroup(group))
}

// Define a more specific type matching the API's expectations
interface GroupApiInput {
  name: string;
  dietary_guidelines: string;
  weekly_menu: string;
  id?: string;
}

// Update the API response type to avoid using 'any'
interface GroupApiResponse {
  data?: {
    success?: boolean;
    group_id?: string;
    [key: string]: unknown;
  };
}

// Function that adapts our Group data to the API format with proper return type
const callGroupsApi = (groupData: {
  name: string;
  dietary: string;
  mealPlan: string;
  id?: string;
}): Promise<GroupApiResponse> => {
  // Map to the format expected by the API with proper type
  const apiData: GroupApiInput = {
    name: groupData.name,
    dietary_guidelines: groupData.dietary || '',
    weekly_menu: groupData.mealPlan || '',
  };
  
  // Add id only if it exists
  if (groupData.id) {
    apiData.id = groupData.id;
  }
  
  return groupsApi.set(apiData);
};

export default function CoachingGroupsPage() {
  const { groups: contextGroups, addGroup, updateGroup, deleteGroup } = useAppContext()
  const { t } = useTranslation()
  
  // API data states
  const [apiGroups, setApiGroups] = useState<ApiGroup[]>([])
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
  
  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [successMessage])
  
  // Fetch groups from API
  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true)
      try {
        const response = await groupsApi.list()
        if (response.data && response.data.groups) {
          setApiGroups(response.data.groups)
          if (DEBUG_MODE) {
            console.log('Fetched groups:', response.data.groups)
          }
        }
      } catch (err) {
        console.error('Error fetching groups:', err)
        setError('Failed to load groups')
        // Fall back to context groups
        setApiGroups([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchGroups()
  }, [])
  
  // Update filtered groups when apiGroups, contextGroups, or searchQuery changes
  useEffect(() => {
    // Use API groups if available, otherwise fall back to context groups
    const groupsToDisplay = apiGroups.length > 0 
      ? convertApiGroupsToGroups(apiGroups)
      : contextGroups
    
    // Filter groups based on search query
    const filtered = searchQuery
      ? groupsToDisplay.filter(group => 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (group.dietary && group.dietary.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      : groupsToDisplay
    
      setFilteredGroups(filtered)
  }, [apiGroups, contextGroups, searchQuery])
  
  // Handle create group
  const handleCreateGroup = async (group: {
    name: string;
    clients: string[];
    dietary: string;
    mealPlan: string;
    dietaryGoal?: string;
  }) => {
    try {
      setLoading(true)
      
      // Use the adapter function instead of direct API call
      const response = await callGroupsApi({
        name: group.name,
        dietary: group.dietary,
        mealPlan: group.mealPlan
      });
      
      if (response.data && response.data.success) {
        // Refresh groups list
        const updatedGroups = await groupsApi.list()
        if (updatedGroups.data && updatedGroups.data.groups) {
          setApiGroups(updatedGroups.data.groups)
        }
        
        // Fix: only pass properties that are in Omit<Group, 'id' | 'members' | 'createdAt'>
        // These properties are automatically added by the addGroup function
        addGroup({
          name: group.name,
          dietary: group.dietary,
          mealPlan: group.mealPlan,
          clients: group.clients
        })
        
        setSuccessMessage(t('groupsPage.groupCreatedSuccess'))
      }
    } catch (err) {
      console.error('Error creating group:', err)
      setError(t('groupsPage.errorCreatingGroup'))
      // Fix: only pass properties that are in Omit<Group, 'id' | 'members' | 'createdAt'>
      // These properties are automatically added by the addGroup function
      addGroup({
        name: group.name,
        dietary: group.dietary,
        mealPlan: group.mealPlan,
        clients: group.clients
      })
    } finally {
      setLoading(false)
    setShowCreateGroupModal(false)
    }
  }
  
  // Handle edit group
  const handleEditGroup = (group: Group) => {
    // Look first in API groups
    const apiGroup = apiGroups.find(g => g.id === group.id)
    
    if (apiGroup) {
      // Convert API group to Group format
      setSelectedGroup({
        id: apiGroup.id,
        name: apiGroup.name,
        dietary: apiGroup.dietary_guidelines,
        mealPlan: apiGroup.weekly_menu,
        members: 0,
        createdAt: new Date().toISOString()
      })
    } else {
      // Fall back to context
      setSelectedGroup(group)
    }
    
    setShowEditGroupModal(true)
  }
  
  // Handle save edited group
  const handleSaveEditedGroup = async (group: {
    id: string;
    name: string;
    clients: string[];
    dietary: string;
    mealPlan: string;
    members?: number;
    createdAt?: string;
    dietaryGoal?: string;
  }) => {
    try {
      setLoading(true)
      
      // Use the adapter function 
      const response = await callGroupsApi({
        id: group.id,
        name: group.name,
        dietary: group.dietary,
        mealPlan: group.mealPlan
      });
      
      if (response.data && response.data.success) {
        // Refresh groups list
        const updatedGroups = await groupsApi.list()
        if (updatedGroups.data && updatedGroups.data.groups) {
          setApiGroups(updatedGroups.data.groups)
        }
        
        // Also update context for fallback
        updateGroup(group as Group)
        setSuccessMessage(t('groupsPage.groupUpdatedSuccess'))
      }
    } catch (err) {
      console.error('Error updating group:', err)
      setError(t('groupsPage.errorUpdatingGroup'))
      // Fall back to context only
      updateGroup(group as Group)
    } finally {
      setLoading(false)
      setShowEditGroupModal(false)
    }
  }
  
  // Handle delete group
  const handleDeleteGroup = async (groupId: string) => {
    try {
      setLoading(true)
      const response = await groupsApi.delete(groupId)
      
      if (response.data && response.data.success) {
        // Refresh groups list
        const updatedGroups = await groupsApi.list()
        if (updatedGroups.data && updatedGroups.data.groups) {
          setApiGroups(updatedGroups.data.groups)
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
  
  // CSS Animations
  const animations = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes growWidth {
      from { width: 0; }
      to { width: 100%; }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes shimmer {
      0% { background-position: -468px 0; }
      100% { background-position: 468px 0; }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    
    .animate-slide-in {
      animation: slideIn 0.3s ease-out forwards;
    }
    
    .animate-grow-width {
      animation: growWidth 0.5s ease-out forwards;
    }
    
    .animate-pulse {
      animation: pulse 2s infinite;
    }
    
    .animate-shimmer {
      background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
      background-size: 800px 104px;
      animation: shimmer 1.5s infinite linear;
    }
    
    .staggered-item:nth-child(1) { animation-delay: 0.1s; }
    .staggered-item:nth-child(2) { animation-delay: 0.2s; }
    .staggered-item:nth-child(3) { animation-delay: 0.3s; }
    .staggered-item:nth-child(4) { animation-delay: 0.4s; }
    .staggered-item:nth-child(5) { animation-delay: 0.5s; }
  `;
  
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
        {/* Error/Success Messages */}
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
        
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-sm animate-fade-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}
        
        {/* Header Section with Stats and Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-8 hover:shadow-lg transition-all duration-300">
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
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
                className="w-full md:w-auto bg-[#13A753] text-white flex items-center justify-center gap-2 py-3 px-6 rounded-xl hover:bg-[#0F8A44] shadow-md hover:shadow-lg transition-all duration-200"
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
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg">
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
          availableClients={[]}
      />
      
        {/* Edit Group Modal */}
        {selectedGroup && (
      <EditGroupModal
        isOpen={showEditGroupModal}
        onClose={() => setShowEditGroupModal(false)}
            onEditGroup={handleSaveEditedGroup}
        group={selectedGroup}
            availableClients={[]}
      />
        )}
    </div>
    </DashboardLayout>
  )
}