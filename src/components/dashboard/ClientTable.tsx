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
  isMobile?: boolean;
  searchTerm?: string;
  clients?: Client[]; // Add this prop to accept clients from parent
}

export default function ClientTable({ 
  onViewClient = () => {}, 
  onTogglePush = () => {},
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
  
  // State for filter
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Filter clients based on search term and status filter
  const filteredClients = clientsToUse.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (client.phone && client.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Handle tab change
  const handleTabChange = (e: React.MouseEvent, tab: string) => {
    e.preventDefault();
    e.stopPropagation();
    setStatusFilter(tab);
  };
  
  // Handle view client details
  const handleViewClient = (e: React.MouseEvent, client: Client) => {
    e.preventDefault();
    e.stopPropagation();
    onViewClient(client);
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
      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-gray-100">
        <button
          className={`pb-3 px-1 font-medium ${
            statusFilter === 'all' 
              ? 'text-[#13A753] border-b-2 border-[#13A753]' 
              : 'text-[#636363]'
          }`}
          onClick={(e) => handleTabChange(e, 'all')}
        >
          {t('clientTable.all_clients')}
        </button>
        <button
          className={`pb-3 px-1 font-medium ${
            statusFilter === 'active' 
              ? 'text-[#13A753] border-b-2 border-[#13A753]' 
              : 'text-[#636363]'
          }`}
          onClick={(e) => handleTabChange(e, 'active')}
        >
          {t('clientTable.active_clients')}
        </button>
        <button
          className={`pb-3 px-1 font-medium ${
            statusFilter === 'inactive' 
              ? 'text-[#13A753] border-b-2 border-[#13A753]' 
              : 'text-[#636363]'
          }`}
          onClick={(e) => handleTabChange(e, 'inactive')}
        >
          {t('clientTable.inactive_clients')}
        </button>
      </div>
      
      {/* Total client count */}
      <div className="mb-4">
        <p className="text-gray-600">{t('clientTable.total_count', { count: filteredClients.length })}</p>
      </div>
      
      {!isMobile ? (
        // Desktop table
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 px-4 font-medium text-[#1E1E1E]">{t('clientTable.client_name')}</th>
              <th className="text-left py-4 px-4 font-medium text-[#1E1E1E]">{t('clientTable.phone')}</th>
              <th className="text-left py-4 px-4 font-medium text-[#1E1E1E]">{t('clientTable.email')}</th>
              <th className="text-left py-4 px-4 font-medium text-[#1E1E1E]">{t('clientTable.gender')}</th>
              <th className="text-left py-4 px-4 font-medium text-[#1E1E1E]">{t('clientTable.group')}</th>
              <th className="text-left py-4 px-4 font-medium text-[#1E1E1E]">{t('clientTable.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-gray-100">
                  <td className="py-4 px-4">
                    <div 
                      className="font-medium text-[#1E1E1E] hover:text-primary cursor-pointer"
                      onClick={(e) => handleViewClient(e, client)}
                    >
                      {client.name}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#636363]">{client.phone || '-'}</td>
                  <td className="py-4 px-4 text-[#636363]">{client.email || '-'}</td>
                  <td className="py-4 px-4 text-[#636363]">{getGenderText(client.gender)}</td>
                  <td className="py-4 px-4 text-[#636363]">{client.group || '-'}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={(e) => handleViewClient(e, client)}
                        className="text-[#13A753] hover:text-[#0D8443]"
                      >
                        {t('clientTable.view')}
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          alert('Delete function')
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        {t('clientTable.delete')}
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      alert('Delete client');
                    }}
                    className="text-red-500 text-sm"
                  >
                    {t('clientTable.delete')}
                  </button>
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