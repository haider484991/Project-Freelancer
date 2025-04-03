'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'

// Define the Client type
export interface Client {
  id: string;
  name: string;
  image?: string;
  group?: string;
  dietaryGoal?: string;
  status: 'active' | 'inactive';
  compliance?: 'compliant' | 'non-compliant';
  goalsMet?: number;
  weeklyCompliance?: boolean[];
  pushEnabled?: boolean;
  email?: string;
  phone?: string;
  gender?: string;
  apiData?: any; // API original data for operations
}

interface ClientTableProps {
  onViewClient?: (client: Client) => void;
  onTogglePush?: (clientId: string, enabled: boolean) => void;
  onEdit?: (client: Client) => void;
  isMobile?: boolean;
  searchTerm?: string;
  clients?: Client[]; // Add this prop to accept clients from parent
}

export default function ClientTable({ 
  onViewClient = () => {}, 
  onTogglePush = () => {},
  onEdit = () => {},
  isMobile = false,
  searchTerm = '',
  clients = []  // Add default empty array
}: ClientTableProps) {
  // Use clients prop if provided, otherwise fall back to context (for backward compatibility)
  const { clients: contextClients } = useAppContext();
  const clientsToUse = clients.length > 0 ? clients : contextClients;
  
  // Get translations
  const { t, i18n } = useTranslation();
  
  // RTL state
  const [isRtl, setIsRtl] = useState(false);
  
  // Check if current language is RTL
  useEffect(() => {
    const rtlLanguages = ['he', 'ar'];
    setIsRtl(rtlLanguages.includes(i18n.language));
  }, [i18n.language]);
  
  // Filter clients based on search term only - removed status filter
  const filteredClients = clientsToUse.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (client.phone && client.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });
  
  // Handle view client details
  const handleViewClient = (e: React.MouseEvent, client: Client) => {
    e.preventDefault();
    e.stopPropagation();
    onViewClient(client);
  };
  
  // Handle edit client
  const handleEditClient = (e: React.MouseEvent, client: Client) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(client);
  };
  
  // Get gender display text
  const getGenderText = (gender: string | undefined) => {
    if (!gender) return '';
    
    // Hebrew translations
    if (i18n.language === 'he') {
      return gender === 'male' ? 'זכר' : 'נקבה';
    }
    
    return gender === 'male' ? 'Male' : 'Female';
  };
  
  return (
    <div className={`w-full ${isRtl ? 'rtl' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Total client count */}
      <div className="mb-4">
        <p className="text-gray-600">{t('clientTable.total_count', { count: filteredClients.length })}</p>
      </div>
      
      {!isMobile ? (
        // Desktop table
        <table className="min-w-full table-fixed border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="w-[20%] text-start py-4 px-4 font-medium text-[#1E1E1E]">{t('clientTable.client_name')}</th>
              <th className="w-[15%] text-start py-4 px-4 font-medium text-[#1E1E1E]">{t('clientTable.phone')}</th>
              <th className="w-[25%] text-start py-4 px-4 font-medium text-[#1E1E1E]">{t('clientTable.email')}</th>
              <th className="w-[10%] text-start py-4 px-4 font-medium text-[#1E1E1E]">{t('clientTable.gender')}</th>
              <th className="w-[15%] text-start py-4 px-4 font-medium text-[#1E1E1E]">{t('clientTable.group')}</th>
              <th className="w-[15%] text-start py-4 px-4 font-medium text-[#1E1E1E]">{t('clientTable.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-gray-100">
                  <td className="w-[20%] py-4 px-4 align-top">
                    <div 
                      className="font-medium text-[#1E1E1E] hover:text-primary cursor-pointer truncate"
                      onClick={(e) => handleViewClient(e, client)}
                    >
                      {client.name}
                    </div>
                  </td>
                  <td className="w-[15%] py-4 px-4 text-[#636363] align-top truncate">{client.phone || '-'}</td>
                  <td className="w-[25%] py-4 px-4 text-[#636363] align-top truncate">{client.email || '-'}</td>
                  <td className="w-[10%] py-4 px-4 text-[#636363] align-top">{getGenderText(client.gender)}</td>
                  <td className="w-[15%] py-4 px-4 text-[#636363] align-top truncate">{client.group || '-'}</td>
                  <td className="w-[15%] py-4 px-4 align-top">
                    <div className={`flex ${isRtl ? 'gap-0 space-x-reverse space-x-2' : 'gap-2'}`}>
                      <button 
                        onClick={(e) => handleViewClient(e, client)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label={t('clientTable.view')}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42001 13.98 8.42001 12C8.42001 10.02 10.02 8.42001 12 8.42001C13.98 8.42001 15.58 10.02 15.58 12Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.71997 12 3.71997C8.46997 3.71997 5.17997 5.79997 2.88997 9.39997C1.98997 10.81 1.98997 13.18 2.88997 14.59C5.17997 18.19 8.46997 20.27 12 20.27Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => handleEditClient(e, client)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label={t('clientTable.edit')}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16.04 3.02L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96C22.34 6.6 22.98 5.02 20.98 3.02C18.98 1.02 17.4 1.66 16.04 3.02Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14.91 4.1501C15.58 6.5401 17.45 8.4101 19.85 9.0901" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          alert('Delete function')
                        }}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label={t('clientTable.delete')}
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
                <td colSpan={6} className="py-8 text-center text-[#636363]">
                  {searchTerm ? t('clientTable.no_search_results') : t('clientTable.no_clients')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        // Mobile view
        <div className="space-y-4">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <div 
                key={client.id} 
                className="bg-white rounded-25 p-4 shadow"
                onClick={(e) => handleViewClient(e, client)}
              >
                <div className="flex justify-between mb-2">
                  <div className="font-medium">{client.name}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    client.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {client.status === 'active' 
                      ? t('clientTable.active') 
                      : t('clientTable.inactive')}
                  </div>
                </div>
                <div className="text-sm text-[#636363] mb-1">{client.phone || '-'}</div>
                <div className="text-sm text-[#636363] mb-1">{client.email || '-'}</div>
                <div className="text-sm text-[#636363] mb-2">{getGenderText(client.gender)}</div>
                <div className="flex justify-between mt-2">
                  <div className="text-xs text-[#636363]">{client.group || '-'}</div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleViewClient(e, client)}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label={t('clientTable.view')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42001 13.98 8.42001 12C8.42001 10.02 10.02 8.42001 12 8.42001C13.98 8.42001 15.58 10.02 15.58 12Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.71997 12 3.71997C8.46997 3.71997 5.17997 5.79997 2.88997 9.39997C1.98997 10.81 1.98997 13.18 2.88997 14.59C5.17997 18.19 8.46997 20.27 12 20.27Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => handleEditClient(e, client)}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label={t('clientTable.edit')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16.04 3.02L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96C22.34 6.6 22.98 5.02 20.98 3.02C18.98 1.02 17.4 1.66 16.04 3.02Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14.91 4.1501C15.58 6.5401 17.45 8.4101 19.85 9.0901" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        alert('Delete client');
                      }}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label={t('clientTable.delete')}
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
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[#636363]">
              {searchTerm ? t('clientTable.no_search_results') : t('clientTable.no_clients')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}