import React, { useState, Fragment, useEffect } from 'react';
import Image from 'next/image';
import Modal from '../Modal';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '@/context/AppContext';
import { Dialog, Transition } from '@headlessui/react';
import { Client as ClientType } from './ClientTable'; // Import the Client type as ClientType to avoid conflict

// Define Group type
interface Group {
  id: string;
  name: string;
}

// ==========================================================================
// Add Client Modal
// ==========================================================================
interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: {
    name: string;
    email: string;
    phone: string;
    group_id: string;
    target_calories: string;
    target_weight: string;
    gender: string;
    is_active: string;
  }) => void;
  groups?: Group[];
}

export function AddClientModal({ isOpen, onClose, onSubmit, groups = [] }: AddClientModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    group_id: '',
    target_calories: '',
    target_weight: '',
    gender: '',
    is_active: '1'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const apiData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      group_id: formData.group_id,
      target_calories: formData.target_calories,
      target_weight: formData.target_weight,
      gender: formData.gender,
      is_active: formData.is_active
    };

    onSubmit(apiData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl mx-auto">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#13A753]/10 p-2.5 rounded-xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.41003 22C3.41003 18.13 7.26003 15 12 15C12.96 15 13.89 15.13 14.76 15.37" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 18C22 18.75 21.79 19.46 21.42 20.06C21.21 20.42 20.94 20.74 20.63 21C19.93 21.63 19.01 22 18 22C16.54 22 15.27 21.22 14.58 20.06C14.21 19.46 14 18.75 14 18C14 16.74 14.58 15.61 15.5 14.88C16.19 14.33 17.06 14 18 14C20.21 14 22 15.79 22 18Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.44 18L17.43 18.99L19.56 17.02" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">{t('clientManagementPage.add_client')}</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-5">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('clientManagementPage.basicInfo')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('clientManagementPage.name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                      required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                    placeholder={t('clientManagementPage.enterName')}
                    />
                  </div>
                  
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('clientManagementPage.email')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                    placeholder={t('clientManagementPage.enterEmail')}
                    />
                  </div>
                  
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('clientManagementPage.phone')} <span className="text-red-500">*</span>
                    </label>
                    <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                    placeholder={t('clientManagementPage.enterPhone')}
                  />
                </div>
              </div>
            </div>
                  
            {/* Training Details Section */}
            <div className="space-y-5">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('clientManagementPage.trainingDetails')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('clientManagementPage.group')} <span className="text-red-500">*</span>
                    </label>
                  <div className="relative">
                    <select 
                      name="group_id"
                      value={formData.group_id}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300 appearance-none"
                    >
                      <option value="">{t('clientManagementPage.selectGroup')}</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  </div>
                  
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('clientManagementPage.gender')} <span className="text-red-500">*</span>
                    </label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300 appearance-none"
                    >
                      <option value="">{t('clientManagementPage.selectGender')}</option>
                      <option value="male">{t('clientManagementPage.male')}</option>
                      <option value="female">{t('clientManagementPage.female')}</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Target Calories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('clientManagementPage.targetCalories')}
                  </label>
                    <input
                    type="text"
                      name="target_calories"
                      value={formData.target_calories}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                    placeholder="1800"
                    />
                  </div>
                  
                {/* Target Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('clientManagementPage.targetWeight')}
                    </label>
                    <input
                    type="text"
                      name="target_weight"
                      value={formData.target_weight}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                    placeholder="75"
                  />
                  </div>
                  
                {/* Status */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('clientManagementPage.status')}
                  </label>
              <div className="flex gap-4">
                    <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_active"
                    value="1"
                    checked={formData.is_active === '1'}
                    onChange={handleChange}
                        className="mr-2 h-4 w-4 text-[#13A753] focus:ring-[#13A753]"
                  />
                      {t('clientManagementPage.active')}
                    </label>
                    <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_active"
                    value="0"
                    checked={formData.is_active === '0'}
                    onChange={handleChange}
                        className="mr-2 h-4 w-4 text-[#13A753] focus:ring-[#13A753]"
                  />
                      {t('clientManagementPage.inactive')}
                </label>
                  </div>
                </div>
              </div>
            </div>
                  
            {/* Action Buttons */}
            <div className="pt-4 flex space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                {t('common.close')}
                    </button>
                    <button
                      type="submit"
                className="w-full bg-gradient-to-r from-[#106A02] to-[#13A753] text-white font-medium py-3 rounded-xl"
                    >
                {t('clientManagementPage.add_client')}
                    </button>
                  </div>
                </form>
          </div>
        </div>
    </div>
  );
}

// ==========================================================================
// Edit Client Modal
// ==========================================================================
interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientType | null;
  onEditClient: (updatedClient: any) => void;
  availableGroups?: Group[];
}

export function EditClientModal({ 
  isOpen, 
  onClose, 
  client, 
  onEditClient,
  availableGroups = []
}: EditClientModalProps) {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    group_id: '',
    target_calories: '',
    target_weight: '',
    gender: 'male',
    is_active: '1'
  });

  useEffect(() => {
    if (client) {
      // Extract target values from dietaryGoal if available
      let targetCalories = '';
      let targetWeight = '';
      
      if (client.dietaryGoal) {
        const parts = client.dietaryGoal.split(' ');
        if (parts.length >= 1) targetCalories = parts[0];
        if (parts.length >= 4) targetWeight = parts[3];
      }
      
      setFormData({
        id: client.id,
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        group_id: client.group?.split(' ')[0] || '', // Assuming group ID is stored in the client object
        target_calories: targetCalories,
        target_weight: targetWeight,
        gender: client.gender || 'male',
        is_active: client.status === 'active' ? '1' : '0'
      });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;
    
    try {
      setIsSubmitting(true);
      
      // Create updated client object for API
      const apiData = {
        id: formData.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        group_id: formData.group_id,
        target_calories: formData.target_calories,
        target_weight: formData.target_weight,
        gender: formData.gender,
        is_active: formData.is_active
      };
      
      await onEditClient(apiData);
      onClose();
    } catch (error) {
      console.error('Error updating client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl mx-auto">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#13A753]/10 p-2.5 rounded-xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.41003 22C3.41003 18.13 7.26003 15 12 15C12.96 15 13.89 15.13 14.76 15.37" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 18C22 18.75 21.79 19.46 21.42 20.06C21.21 20.42 20.94 20.74 20.63 21C19.93 21.63 19.01 22 18 22C16.54 22 15.27 21.22 14.58 20.06C14.21 19.46 14 18.75 14 18C14 16.74 14.58 15.61 15.5 14.88C16.19 14.33 17.06 14 18 14C20.21 14 22 15.79 22 18Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.44 18L17.43 18.99L19.56 17.02" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">{t('clientManagementPage.edit_client', 'Edit Client')}</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-5">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('clientManagementPage.basicInfo')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('clientManagementPage.name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                    placeholder={t('clientManagementPage.enterName')}
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('clientManagementPage.email')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                    placeholder={t('clientManagementPage.enterEmail')}
                  />
                </div>
                
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('clientManagementPage.phone')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                    placeholder={t('clientManagementPage.enterPhone')}
                  />
                </div>
              </div>
            </div>
            
            {/* Training Details Section */}
            <div className="space-y-5">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('clientManagementPage.trainingDetails')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('clientManagementPage.group')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      name="group_id"
                      value={formData.group_id}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300 appearance-none"
                    >
                      <option value="">{t('clientManagementPage.selectGroup')}</option>
                      {availableGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('clientManagementPage.gender')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300 appearance-none"
                    >
                      <option value="">{t('clientManagementPage.selectGender')}</option>
                      <option value="male">{t('clientManagementPage.male')}</option>
                      <option value="female">{t('clientManagementPage.female')}</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Target Calories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('clientManagementPage.targetCalories')}
                  </label>
                  <input
                    type="text"
                    name="target_calories"
                    value={formData.target_calories}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                    placeholder="1800"
                  />
                </div>
                
                {/* Target Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('clientManagementPage.targetWeight')}
                  </label>
                  <input
                    type="text"
                    name="target_weight"
                    value={formData.target_weight}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                    placeholder="75"
                  />
                </div>
                
                {/* Status */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('clientManagementPage.status')}
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="is_active"
                        value="1"
                        checked={formData.is_active === '1'}
                        onChange={handleChange}
                        className="mr-2 h-4 w-4 text-[#13A753] focus:ring-[#13A753]"
                      />
                      {t('clientManagementPage.active')}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="is_active"
                        value="0"
                        checked={formData.is_active === '0'}
                        onChange={handleChange}
                        className="mr-2 h-4 w-4 text-[#13A753] focus:ring-[#13A753]"
                      />
                      {t('clientManagementPage.inactive')}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="pt-4 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {t('common.close')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#106A02] to-[#13A753] text-white font-medium py-3 rounded-xl"
              >
                {isSubmitting ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}