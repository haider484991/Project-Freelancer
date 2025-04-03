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
// Client Details Modal
// ==========================================================================
interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: {
    name: string;
    group: string;
    dietaryGoal: string;
    image?: string;
    weeklyCompliance?: boolean[];
    reportData?: {
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
      weight?: number;
      [key: string]: any;
    };
  };
}

export function ClientDetailsModal({ isOpen, onClose, client }: ClientDetailsModalProps) {
  const { t } = useTranslation();
  const [activeWeek, setActiveWeek] = useState(1);
  
  if (!client) return null;
  
  // Default compliance if not provided (prepare array of 4 weeks)
  const weeklyCompliance = client.weeklyCompliance || [false, false, false, false];
  
  const handleWeekChange = (e: React.MouseEvent, week: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveWeek(week);
  };
  
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md md:max-w-3xl lg:max-w-5xl">
      <div className="p-5">
        <div className="flex items-center mb-6">
          <div className="w-[70px] h-[70px] rounded-full overflow-hidden mr-4 bg-gray-200">
            <Image
              src={client?.image || "/images/profile.jpg"}
              alt={client?.name || "Client"}
              width={70}
              height={70}
              className="object-cover w-full h-full"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">{client?.name || "Client Name"}</h3>
            <p className="text-sm text-[#636363]">{client?.group || "Group"} • {client?.dietaryGoal || "Dietary Goal"}</p>
          </div>
        </div>
        
        <div className="mb-5">
          <h4 className="text-base font-medium mb-2">{t('goal_compliance')}</h4>
          
          <div className="bg-[#F8F8F8] rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-sm">{t('weekly_goals')}</span>
              <div className="flex space-x-1.5">
                {[1, 2, 3, 4].map(week => (
                  <button
                    key={week}
                    onClick={(e) => handleWeekChange(e, week)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      activeWeek === week 
                        ? 'bg-[#13A753] text-white' 
                        : 'bg-white text-black'
                    }`}
                  >
                    {week}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              {[0, 1, 2, 3].map(weekIndex => (
                <div key={weekIndex} className="flex flex-col items-center space-y-1">
                  <span className="text-xs text-[#636363]">{t('week')} {weekIndex + 1}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    weeklyCompliance[weekIndex] ? 'bg-[#13A753]' : 'bg-white border border-[#13A753]'
                  }`}>
                    {weeklyCompliance[weekIndex] && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="h-56 bg-[#F8F8F8] rounded-xl p-4">
              <h4 className="text-base font-medium mb-3">{t('client_metrics')}</h4>
              {client.reportData ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-sm text-gray-500">{t('calories')}</div>
                    <div className="text-lg font-semibold">{client.reportData.calories || 0} kcal</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-sm text-gray-500">{t('protein')}</div>
                    <div className="text-lg font-semibold">{client.reportData.protein || 0} g</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-sm text-gray-500">{t('carbs')}</div>
                    <div className="text-lg font-semibold">{client.reportData.carbs || 0} g</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-sm text-gray-500">{t('fat')}</div>
                    <div className="text-lg font-semibold">{client.reportData.fat || 0} g</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <span className="text-gray-400">{t('no_metrics_available')}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="h-56 bg-[#F8F8F8] rounded-xl p-4">
              <h4 className="text-base font-medium mb-3">{t('additional_info')}</h4>
              {client.reportData && client.reportData.weight ? (
                <div className="bg-white p-3 rounded-lg mb-3">
                  <div className="text-sm text-gray-500">{t('current_weight')}</div>
                  <div className="text-lg font-semibold">{client.reportData.weight} kg</div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <span className="text-gray-400">{t('no_additional_info')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleClose}
            className="bg-[#13A753] text-white font-medium py-2 px-6 rounded-full hover:bg-[#0D8A40] transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ==========================================================================
// Create Group Modal
// ==========================================================================
interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (group: {
    name: string;
    dietary: string;
    mealPlan: string;
  }) => void;
}

export function CreateGroupModal({ 
  isOpen, 
  onClose, 
  onCreateGroup
}: CreateGroupModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    dietary: '',
    mealPlan: ''
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateGroup({
      name: formData.name,
      dietary: formData.dietary,
      mealPlan: formData.mealPlan
    });
    resetForm();
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      dietary: '',
      mealPlan: ''
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#13A753]/10 p-2.5 rounded-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.16 10.87C9.06 10.86 8.94 10.86 8.83 10.87C6.45 10.79 4.56 8.84 4.56 6.44C4.56 3.99 6.54 2 9 2C11.45 2 13.44 3.99 13.44 6.44C13.43 8.84 11.54 10.79 9.16 10.87Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.41 4C18.35 4 19.91 5.57 19.91 7.5C19.91 9.39 18.41 10.93 16.54 11C16.46 10.99 16.37 10.99 16.28 11" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.16 14.56C1.74 16.18 1.74 18.82 4.16 20.43C6.91 22.27 11.42 22.27 14.17 20.43C16.59 18.81 16.59 16.17 14.17 14.56C11.43 12.73 6.92 12.73 4.16 14.56Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.34 20C19.06 19.85 19.74 19.56 20.3 19.13C21.86 17.96 21.86 16.03 20.3 14.86C19.75 14.44 19.08 14.16 18.37 14" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">{t('group.create', 'Create Group')}</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-5">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('group.basicInfo', 'Basic Information')}</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('group.name', 'Group Name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                  placeholder={t('group.enterName', 'Enter group name')}
                />
              </div>
          
              {/* Dietary Guidelines */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('group.dietary_guidelines', 'Dietary Guidelines')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dietary"
                  value={formData.dietary}
                  onChange={(e) => setFormData({...formData, dietary: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                  placeholder={t('group.enterDietary', 'Enter dietary guidelines')}
                />
              </div>
          
              {/* Meal Plan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('group.weekly_menu', 'Weekly Menu')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="mealPlan"
                  value={formData.mealPlan}
                  onChange={(e) => setFormData({...formData, mealPlan: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                  placeholder={t('group.enterMealPlan', 'Enter weekly menu')}
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#106A02] to-[#13A753] text-white font-medium py-3 rounded-xl"
            >
              {t('common.create', 'Create')}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

// ==========================================================================
// Edit Group Modal
// ==========================================================================
interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditGroup: (group: {
    id: string;
    name: string;
    dietary: string;
    mealPlan: string;
  }) => void;
  group?: {
    id: string;
    name: string;
    dietary?: string;
    mealPlan?: string;
    dietaryGoal?: string;
  };
}

export function EditGroupModal({
  isOpen,
  onClose,
  onEditGroup,
  group
}: EditGroupModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    id: group?.id || '',
    name: group?.name || '',
    dietary: group?.dietary || group?.dietaryGoal || '',
    mealPlan: group?.mealPlan || ''
  });
  
  // Update form data when group changes
  useEffect(() => {
    if (group) {
      setFormData({
        id: group.id || '',
        name: group.name || '',
        dietary: group.dietary || group.dietaryGoal || '',
        mealPlan: group.mealPlan || ''
      });
    }
  }, [group]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditGroup({
      id: formData.id,
      name: formData.name,
      dietary: formData.dietary,
      mealPlan: formData.mealPlan
    });
  };
  
  if (!isOpen || !group) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#13A753]/10 p-2.5 rounded-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.16 10.87C9.06 10.86 8.94 10.86 8.83 10.87C6.45 10.79 4.56 8.84 4.56 6.44C4.56 3.99 6.54 2 9 2C11.45 2 13.44 3.99 13.44 6.44C13.43 8.84 11.54 10.79 9.16 10.87Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.41 4C18.35 4 19.91 5.57 19.91 7.5C19.91 9.39 18.41 10.93 16.54 11C16.46 10.99 16.37 10.99 16.28 11" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.16 14.56C1.74 16.18 1.74 18.82 4.16 20.43C6.91 22.27 11.42 22.27 14.17 20.43C16.59 18.81 16.59 16.17 14.17 14.56C11.43 12.73 6.92 12.73 4.16 14.56Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.34 20C19.06 19.85 19.74 19.56 20.3 19.13C21.86 17.96 21.86 16.03 20.3 14.86C19.75 14.44 19.08 14.16 18.37 14" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">{t('group.edit', 'Edit Group')}</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-5">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('group.basicInfo', 'Basic Information')}</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('group.name', 'Group Name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                  placeholder={t('group.enterName', 'Enter group name')}
                />
              </div>
              
              {/* Dietary Guidelines */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('group.dietary_guidelines', 'Dietary Guidelines')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dietary"
                  value={formData.dietary}
                  onChange={(e) => setFormData({...formData, dietary: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                  placeholder={t('group.enterDietary', 'Enter dietary guidelines')}
                />
              </div>
          
              {/* Meal Plan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('group.weekly_menu', 'Weekly Menu')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="mealPlan"
                  value={formData.mealPlan}
                  onChange={(e) => setFormData({...formData, mealPlan: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                  placeholder={t('group.enterMealPlan', 'Enter weekly menu')}
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#106A02] to-[#13A753] text-white font-medium py-3 rounded-xl"
            >
              {t('common.save', 'Save')}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

// ==========================================================================
// Week Selector Component
// ==========================================================================
interface WeekSelectorProps {
  selectedWeek: string;
  onWeekChange: (week: string) => void;
}

export function WeekSelector({ selectedWeek, onWeekChange }: WeekSelectorProps) {
  const { t } = useTranslation();

  const weeks = [
    { id: 'Week 1', label: t('week_1') },
    { id: 'Week 2', label: t('week_2') },
    { id: 'Week 3', label: t('week_3') },
    { id: 'Week 4', label: t('week_4') },
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          value={selectedWeek}
          onChange={(e) => onWeekChange(e.target.value)}
          className="appearance-none bg-white border border-[#F3F7F3] rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-[#13A753] text-sm"
        >
          {weeks.map((week) => (
            <option key={week.id} value={week.id}>
              {week.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 9L12 16L5 9" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ==========================================================================
// Template Selector Component
// ==========================================================================
interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  const { t } = useTranslation();

  const templates = [
    { id: 'Template 1', label: t('template_1') },
    { id: 'Template 2', label: t('template_2') },
    { id: 'Template 3', label: t('template_3') },
    { id: 'Template 4', label: t('template_4') },
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          value={selectedTemplate}
          onChange={(e) => onTemplateChange(e.target.value)}
          className="appearance-none bg-white border border-[#F3F7F3] rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-[#13A753] text-sm"
        >
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 9L12 16L5 9" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ==========================================================================
// Client Selector Component
// ==========================================================================
interface ClientSelectorProps {
  selectedClient: string;
  onClientChange: (client: string) => void;
  availableClients?: Array<{ id: string; name: string }>;
}

export function ClientSelector({ 
  selectedClient, 
  onClientChange,
  availableClients = []
}: ClientSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          value={selectedClient}
          onChange={(e) => onClientChange(e.target.value)}
          className="appearance-none bg-white border border-[#F3F7F3] rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-[#13A753] text-sm"
        >
          <option value="">{t('select_client')}</option>
          {availableClients.length > 0 ? (
            // Use API clients if available
            availableClients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))
          ) : (
            // Fallback to hardcoded samples if no clients available
            [
              { id: 'client_1', label: t('client_1') },
              { id: 'client_2', label: t('client_2') },
              { id: 'client_3', label: t('client_3') },
              { id: 'client_4', label: t('client_4') }
            ].map((client) => (
              <option key={client.id} value={client.id}>
                {client.label}
              </option>
            ))
          )}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 9L12 16L5 9" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
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
  onEditClient: (updatedClient: ClientType) => void;
  availableGroups?: Group[];
}

// First, add an extended client type for the form data
interface ExtendedClientType extends ClientType {
  target_calories?: string;
  target_weight?: string;
  group_id?: string;
  is_active?: string;
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
  const [formData, setFormData] = useState<ExtendedClientType | null>(null);

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
        ...client,
        target_calories: targetCalories,
        target_weight: targetWeight,
        group_id: client.group_id || '',
        is_active: client.status === 'active' ? '1' : '0'
      });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleDietaryGoalChange = (targetCalories: string, targetWeight: string) => {
    if (formData) {
      setFormData({
        ...formData,
        target_calories: targetCalories,
        target_weight: targetWeight
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;
    
    try {
      setIsSubmitting(true);
      
      // Create updated client object
      const updatedClient: ClientType = {
        ...formData,
        dietaryGoal: `${formData.target_calories || ''} calories / ${formData.target_weight || ''} kg`,
        status: formData.is_active === '1' ? 'active' : 'inactive',
        // Make sure required fields are present
        id: formData.id,
        name: formData.name,
        // Ensure other required fields have defaults if missing
        group: formData.group || '',
        compliance: formData.compliance || 'compliant',
        image: formData.image || '/images/profile.jpg'
      };
      
      await onEditClient(updatedClient);
      onClose();
    } catch (error) {
      console.error('Error updating client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get gender text based on language
  const getMaleText = () => {
    return i18n.language === 'he' ? 'זכר' : 'Male';
  };
  
  const getFemaleText = () => {
    return i18n.language === 'he' ? 'נקבה' : 'Female';
  };
  
  if (!isOpen) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
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
            <h2 className="text-2xl font-semibold text-gray-800">{t('edit_client.title', 'Edit Client')}</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-5">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {t('edit_client.basic_info', 'Basic Information')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('client.name', 'Name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData?.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                  placeholder={t('client.enter_name', 'Enter client name')}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('client.email', 'Email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData?.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                  placeholder={t('client.enter_email', 'Enter email address')}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('client.phone', 'Phone')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData?.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                  placeholder={t('client.enter_phone', 'Enter phone number')}
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
                  {t('client.group', 'Group')}
                </label>
                <div className="relative">
                  <select
                    name="group_id"
                    value={formData?.group_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300 appearance-none"
                  >
                    <option value="">{t('client.select_group', 'Select group')}</option>
                    {availableGroups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
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
                  {t('client.gender', 'Gender')}
                </label>
                <div className="relative">
                  <select
                    name="gender"
                    value={formData?.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300 appearance-none"
                  >
                    <option value="male">{getMaleText()}</option>
                    <option value="female">{getFemaleText()}</option>
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
                  {t('client.target_calories', 'Target Calories')}
                </label>
                <input
                  type="text"
                  name="target_calories"
                  value={formData?.target_calories}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                  placeholder={t('client.enter_calories', 'Enter target calories')}
                />
              </div>
              
              {/* Target Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('client.target_weight', 'Target Weight (kg)')}
                </label>
                <input
                  type="text"
                  name="target_weight"
                  value={formData?.target_weight}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#13A753]/20 focus:border-[#13A753] transition-colors hover:border-gray-300"
                  placeholder={t('client.enter_weight', 'Enter target weight')}
                />
              </div>
              
              {/* Status */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('client.status', 'Status')}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="is_active"
                      value="1"
                      checked={formData?.is_active === '1'}
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
                      checked={formData?.is_active === '0'}
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
    </Modal>
  );
}