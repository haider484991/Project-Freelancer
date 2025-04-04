'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { formatDate } from '@/utils/dateFormat'

// Define the Group type
export interface Group {
  id: string;
  name: string;
  members: number;
  dietary_guidelines?: string;
  weekly_menu?: string;
  createdAt: string;
  dietaryGoal?: string; // Legacy field
  dietary?: string; // Legacy field
  mealPlan?: string; // Legacy field
}

interface GroupsTableProps {
  groups: Group[]; // New prop to accept groups from parent
  isMobile?: boolean;
  onViewGroup?: (group: Group) => void;
  onDeleteGroup?: (group: Group) => void;
  searchTerm?: string;
}

export default function GroupsTable({ 
  groups = [], // Default to empty array
  isMobile = false,
  onViewGroup = () => {},
  onDeleteGroup = () => {},
  searchTerm = ''
}: GroupsTableProps) {
  // Get translations
  const { t, i18n } = useTranslation();

  // Filter groups based on search term
  const filteredGroups = groups.filter(group => 
    searchTerm ? group.name.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );
  
  // Handle edit/view group
  const handleViewGroup = (e: React.MouseEvent, group: Group) => {
    e.preventDefault();
    e.stopPropagation();
    onViewGroup(group);
  };
  
  // Handle delete group
  const handleDeleteGroup = (e: React.MouseEvent, group: Group) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Show confirmation dialog
    if (window.confirm(t('Are you sure you want to delete the group "{{name}}"?', { name: group.name }))) {
      console.log(`Deleting group: ${group.name} (${group.id})`);
      onDeleteGroup(group);
    }
  };

  // Get the dietary guidelines value
  const getDietaryGuidelines = (group: Group) => {
    return group.dietary_guidelines || group.dietaryGoal || group.dietary || t('N/A');
  };

  // Get the weekly menu value
  const getWeeklyMenu = (group: Group) => {
    return group.weekly_menu || group.mealPlan || t('N/A');
  };
  
  return (
    <div className={`w-full overflow-x-auto ${i18n.dir() === 'rtl' ? 'rtl' : ''}`}>
      {!isMobile ? (
        // Desktop table
        <table className="w-full min-w-[600px] table-fixed border-collapse">
          <thead>
            <tr className="text-left text-[#636363] border-b border-gray-100">
              <th className="w-[20%] py-4 px-4 font-medium text-start">{t('groups.group_name', 'Group Name')}</th>
              <th className="w-[10%] py-4 px-4 font-medium text-start">{t('groupsTable.Members', 'Members')}</th>
              <th className="w-[25%] py-4 px-4 font-medium text-start">{t('group.dietary_guidelines', 'Dietary Guidelines')}</th>
              <th className="w-[25%] py-4 px-4 font-medium text-start">{t('group.weekly_menu', 'Weekly Menu')}</th>
              <th className="w-[15%] py-4 px-4 font-medium text-start">{t('groupsTable.Created At', 'Created At')}</th>
              <th className="w-[10%] py-4 px-4 font-medium text-start">{t('common.actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <tr key={group.id} className="border-b border-gray-100">
                  <td className="w-[20%] py-4 px-4 align-top">
                    <div className="font-medium text-[#1E1E1E] truncate">{group.name}</div>
                  </td>
                  <td className="w-[10%] py-4 px-4 text-[#636363] align-top">{group.members}</td>
                  <td className="w-[25%] py-4 px-4 text-[#636363] align-top truncate">{getDietaryGuidelines(group)}</td>
                  <td className="w-[25%] py-4 px-4 text-[#636363] align-top truncate">{getWeeklyMenu(group)}</td>
                  <td className="w-[15%] py-4 px-4 text-[#636363] align-top">{formatDate(group.createdAt)}</td>
                  <td className="w-[10%] py-4 px-4 align-top">
                    <div className={`flex ${i18n.dir() === 'rtl' ? 'gap-0 space-x-reverse space-x-2' : 'gap-2'}`}>
                      <button 
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={(e) => handleViewGroup(e, group)}
                        aria-label={t('groupsTable.View/Edit Group', 'View/Edit Group')}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42001 13.98 8.42001 12C8.42001 10.02 10.02 8.42001 12 8.42001C13.98 8.42001 15.58 10.02 15.58 12Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.71997 12 3.71997C8.46997 3.71997 5.17997 5.79997 2.88997 9.39997C1.98997 10.81 1.98997 13.18 2.88997 14.59C5.17997 18.19 8.46997 20.27 12 20.27Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button 
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={(e) => handleDeleteGroup(e, group)}
                        aria-label={t('groupsTable.Delete Group', 'Delete Group')}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10.33 16.5H13.66" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9.5 12.5H14.5" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  {searchTerm ? t('groupsTable.No groups found matching your search.', 'No groups found matching your search.') : t('groupsTable.No groups available.', 'No groups available.')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        // Mobile cards
        <div className="space-y-4">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <div key={group.id} className="bg-white p-4 rounded-[25px] shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-[#1E1E1E]">{group.name}</h3>
                    <p className="text-sm text-[#636363]">{t('group.members', 'Members')}: {group.members}</p>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                      onClick={(e) => handleViewGroup(e, group)}
                      aria-label={t('groupsTable.View/Edit Group', 'View/Edit Group')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42001 13.98 8.42001 12C8.42001 10.02 10.02 8.42001 12 8.42001C13.98 8.42001 15.58 10.02 15.58 12Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.71997 12 3.71997C8.46997 3.71997 5.17997 5.79997 2.88997 9.39997C1.98997 10.81 1.98997 13.18 2.88997 14.59C5.17997 18.19 8.46997 20.27 12 20.27Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                      onClick={(e) => handleDeleteGroup(e, group)}
                      aria-label={t('groupsTable.Delete Group', 'Delete Group')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.33 16.5H13.66" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.5 12.5H14.5" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="text-[#636363]">{t('group.dietary_guidelines', 'Dietary Guidelines')}:</span>
                    <p>{getDietaryGuidelines(group)}</p>
                  </div>
                  <div>
                    <span className="text-[#636363]">{t('group.weekly_menu', 'Weekly Menu')}:</span>
                    <p>{getWeeklyMenu(group)}</p>
                  </div>
                  <div>
                    <span className="text-[#636363]">{t('group.created_at', 'Created At')}:</span>
                    <p>{formatDate(group.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              {searchTerm ? t('groupsTable.No groups found matching your search.', 'No groups found matching your search.') : t('groupsTable.No groups available.', 'No groups available.')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}