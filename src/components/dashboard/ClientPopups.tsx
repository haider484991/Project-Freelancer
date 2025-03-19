import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from '../Modal';
import { useTranslation } from 'react-i18next';

// ==========================================================================
// Add Client Modal
// ==========================================================================
interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (client: {
    name: string;
    dietaryGoal: string;
    group: string;
  }) => void;
}

export function AddClientModal({ isOpen, onClose, onAddClient }: AddClientModalProps) {
  const [name, setName] = useState('');
  const [dietaryGoal, setDietaryGoal] = useState('');
  const [group, setGroup] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  
  const goals = ['Weight Loss', 'Muscle Gain', 'Vegan', 'Maintenance'];
  
  const { t, i18n } = useTranslation();
  const [isRtl, setIsRtl] = useState(false);
  
  // Check if current language is RTL
  useEffect(() => {
    const rtlLanguages = ['he', 'ar'];
    setIsRtl(rtlLanguages.includes(i18n.language));
  }, [i18n.language]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddClient({
      name,
      dietaryGoal,
      group,
    });
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setName('');
    setDietaryGoal('');
    setGroup('');
    setSelectedGoals([]);
  };
  
  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm md:max-w-3xl lg:max-w-4xl">
      <div className="p-5">
        <h2 className="text-center font-semibold text-xl mb-5">{t('add_client')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Name */}
          <div>
            <input
              type="text"
              placeholder={t('client_name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          
          {/* Order/Cost */}
          <div>
            <input
              type="text"
              placeholder={t('order_cost')}
              value={dietaryGoal}
              onChange={(e) => setDietaryGoal(e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          {/* Select Group */}
          <div className="relative">
            <select
              value={group}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setGroup(e.target.value);
              }}
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="" disabled>{t('select_group')}</option>
              <option value="Weight Loss">{t('weight_loss')}</option>
              <option value="Muscle Gain">{t('muscle_gain')}</option>
              <option value="Vegan">{t('vegan')}</option>
              <option value="Maintenance">{t('maintenance')}</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 9L12 16L5 9" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          {/* Goals Selection */}
          <div className="bg-[#F8F8F8] rounded-2xl p-3">
            <div className="grid grid-cols-1 gap-2">
              {goals.map(goal => (
                <div 
                  key={goal}
                  className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${
                    selectedGoals.includes(goal) ? 'bg-white font-medium' : 'text-gray-500'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleGoal(goal);
                  }}
                >
                  {t(goal)}
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-3">
            <button
              type="submit"
              className="w-full bg-[#13A753] text-white font-medium py-3 rounded-full hover:bg-[#0D8A40] transition-colors"
            >
              {t('add')}
            </button>
          </div>
        </form>
      </div>
    </Modal>
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
  };
}

export function ClientDetailsModal({ isOpen, onClose, client }: ClientDetailsModalProps) {
  const { t, i18n } = useTranslation();
  const [isRtl, setIsRtl] = useState(false);
  const [activeWeek, setActiveWeek] = useState(1);
  
  // Check if current language is RTL
  useEffect(() => {
    const rtlLanguages = ['he', 'ar'];
    setIsRtl(rtlLanguages.includes(i18n.language));
  }, [i18n.language]);
  
  if (!client) return null;
  
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
          <div className="w-[70px] h-[70px] rounded-full overflow-hidden mr-4">
            <Image
              src={client?.image || "/images/profile.jpg"}
              alt={client?.name || "Client"}
              width={70}
              height={70}
              className="object-cover w-full h-full"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">{client?.name || "Adele Dubie"}</h3>
            <p className="text-sm text-[#636363]">{client?.group || "Weight Loss"} • {client?.dietaryGoal || "Dietary Goal"}</p>
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
              {[1, 2, 3, 4].map(week => (
                <div key={week} className="flex flex-col items-center space-y-1">
                  <span className="text-xs text-[#636363]">{t('week')} {week}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    week <= 2 ? 'bg-[#13A753]' : 'bg-white border border-[#13A753]'
                  }`}>
                    {week <= 2 && (
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
            <div className="h-56 bg-[#F8F8F8] rounded-xl flex items-center justify-center">
              <span className="text-gray-400">{t('client_metrics_chart')}</span>
            </div>
          </div>
          
          <div>
            <div className="h-56 bg-[#F8F8F8] rounded-xl flex items-center justify-center">
              <span className="text-gray-400">{t('additional_info')}</span>
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
interface Client {
  id: string;
  name: string;
}

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (group: {
    name: string;
    clients: string[];
    dietary: string;
    mealPlan: string;
    dietaryGoal?: string;
  }) => void;
  availableClients: Client[];
}

export function CreateGroupModal({ 
  isOpen, 
  onClose, 
  onCreateGroup,
  availableClients = [] 
}: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [dietary, setDietary] = useState('');
  const [mealPlan, setMealPlan] = useState('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { t, i18n } = useTranslation();
  const [isRtl, setIsRtl] = useState(false);
  
  // Check if current language is RTL
  useEffect(() => {
    const rtlLanguages = ['he', 'ar'];
    setIsRtl(rtlLanguages.includes(i18n.language));
  }, [i18n.language]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    onCreateGroup({
      name,
      clients: selectedClients,
      dietary,
      mealPlan,
      dietaryGoal: dietary // Map dietary to dietaryGoal for consistency
    });
    
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setName('');
    setDietary('');
    setMealPlan('');
    setSelectedClients([]);
    setSearchTerm('');
  };
  
  const toggleClient = (clientId: string) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };
  
  const filteredClients = availableClients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="p-5">
        <h2 className="text-center font-semibold text-xl mb-5">{t('create_group')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group Name */}
          <div>
            <input
              type="text"
              placeholder={t('group_name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          
          {/* Dietary Plan */}
          <div>
            <select
              value={dietary}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDietary(e.target.value);
              }}
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
            >
              <option value="" disabled>{t('select_dietary_plan')}</option>
              <option value="Vegan">{t('vegan')}</option>
              <option value="Vegetarian">{t('vegetarian')}</option>
              <option value="Keto">{t('keto')}</option>
              <option value="Paleo">{t('paleo')}</option>
            </select>
          </div>
          
          {/* Meal Plan */}
          <div>
            <select
              value={mealPlan}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMealPlan(e.target.value);
              }}
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
            >
              <option value="" disabled>{t('select_meal_plan')}</option>
              <option value="1800 kcal/day">{t('1800_kcal_day')}</option>
              <option value="2000 kcal/day">{t('2000_kcal_day')}</option>
              <option value="2200 kcal/day">{t('2200_kcal_day')}</option>
              <option value="2500 kcal/day">{t('2500_kcal_day')}</option>
            </select>
          </div>
          
          {/* Search Clients */}
          <div>
            <input
              type="text"
              placeholder={t('search_clients')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          {/* Client List */}
          <div className="bg-[#F8F8F8] rounded-2xl p-3 max-h-48 overflow-y-auto">
            {filteredClients.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {filteredClients.map(client => (
                  <div 
                    key={client.id}
                    className={`px-3 py-2 rounded-md cursor-pointer transition-colors flex items-center ${
                      selectedClients.includes(client.id) ? 'bg-white font-medium' : 'text-gray-500'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleClient(client.id);
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedClients.includes(client.id)} 
                      onChange={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleClient(client.id);
                      }} 
                      className="mr-2" 
                    />
                    {client.name}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3 text-gray-400">{t('no_clients_found')}</div>
            )}
          </div>
          
          <div className="pt-3">
            <button
              type="submit"
              className="w-full bg-[#13A753] text-white font-medium py-3 rounded-full hover:bg-[#0D8A40] transition-colors"
            >
              {t('create_group')}
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
    clients: string[];
    dietary: string;
    mealPlan: string;
    members?: number;
    createdAt?: string;
    dietaryGoal?: string;
  }) => void;
  group?: {
    id: string;
    name: string;
    clients?: string[];
    dietary?: string;
    mealPlan?: string;
    members?: number;
    createdAt?: string;
    dietaryGoal?: string;
  };
  availableClients: Client[];
}

export function EditGroupModal({
  isOpen,
  onClose,
  onEditGroup,
  group,
  availableClients = []
}: EditGroupModalProps) {
  const [groupName, setGroupName] = useState(group?.name || '');
  const [selectedClients, setSelectedClients] = useState<string[]>(group?.clients || []);
  const [dietaryGuidelines, setDietaryGuidelines] = useState(group?.dietary || '');
  const [mealPlan, setMealPlan] = useState(group?.mealPlan || '');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { t, i18n } = useTranslation();
  const [isRtl, setIsRtl] = useState(false);
  
  // Check if current language is RTL
  useEffect(() => {
    const rtlLanguages = ['he', 'ar'];
    setIsRtl(rtlLanguages.includes(i18n.language));
  }, [i18n.language]);
  
  // Update state when group prop changes
  React.useEffect(() => {
    if (group) {
      setGroupName(group.name || '');
      setSelectedClients(group.clients || []);
      setDietaryGuidelines(group.dietary || '');
      setMealPlan(group.mealPlan || '');
    }
  }, [group]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!group || !group.id) {
      console.error('Cannot edit group: missing group ID');
      return;
    }
    
    const updatedGroup = {
      ...group, // Preserve all original properties
      id: group.id,
      name: groupName,
      clients: selectedClients,
      dietary: dietaryGuidelines,
      mealPlan,
      dietaryGoal: dietaryGuidelines // Update dietaryGoal to match dietary
    };
    
    console.log('Submitting edited group:', updatedGroup);
    onEditGroup(updatedGroup);
    onClose();
  };
  
  const toggleClient = (clientId: string) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };
  
  const filteredClients = availableClients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md md:max-w-3xl lg:max-w-5xl">
      <div className="p-5">
        <h2 className="text-center font-semibold text-xl mb-6">{t('edit_group')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group Name */}
          <div>
            <input
              type="text"
              placeholder={t('enter_group_name')}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#13A753] resize-none"
              required
            />
          </div>
          
          {/* Assign Clients */}
          <div className="relative">
            <button
              type="button"
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm text-left flex justify-between items-center"
            >
              <span className="text-[#636363]">{t('assign_clients')}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 9L12 16L5 9" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="mt-2 border border-gray-100 rounded-xl p-3">
              <div className="mb-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('search_client')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-100 rounded-full text-sm focus:outline-none"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 22L20 20" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {filteredClients.map(client => (
                  <div 
                    key={client.id}
                    className="flex items-center p-2 hover:bg-gray-50 rounded-md"
                  >
                    <input
                      type="checkbox"
                      id={`edit-client-${client.id}`}
                      checked={selectedClients.includes(client.id)}
                      onChange={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleClient(client.id);
                      }}
                      className="w-4 h-4 text-[#13A753] border-gray-300 rounded focus:ring-[#13A753]"
                    />
                    <label htmlFor={`edit-client-${client.id}`} className="ml-3 text-sm text-[#636363] cursor-pointer">
                      {client.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Dietary Guidelines */}
          <div>
            <textarea
              placeholder={t('enter_dietary_guidelines')}
              value={dietaryGuidelines}
              onChange={(e) => setDietaryGuidelines(e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#13A753] resize-none"
              rows={3}
            ></textarea>
          </div>
          
          {/* Meal Plan */}
          <div className="relative">
            <select
              value={mealPlan}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMealPlan(e.target.value);
              }}
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#13A753] appearance-none"
            >
              <option value="" disabled>{t('select_meal_plan')}</option>
              <option value="Low Carb">{t('low_carb')}</option>
              <option value="High Protein">{t('high_protein')}</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 9L12 16L5 9" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full bg-[#13A753] text-white font-medium py-3 rounded-full hover:bg-[#0D8A40] transition-colors"
            >
              {t('edit_group')}
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
  const { t, i18n } = useTranslation();
  const [isRtl, setIsRtl] = useState(false);
  
  // Check if current language is RTL
  useEffect(() => {
    const rtlLanguages = ['he', 'ar'];
    setIsRtl(rtlLanguages.includes(i18n.language));
  }, [i18n.language]);

  const weeks = [
    { id: 'Week 1', label: t('week_1') },
    { id: 'Week 2', label: t('week_2') },
    { id: 'Week 3', label: t('week_3') },
    { id: 'Week 4', label: t('week_4') },
  ];

  return (
    <div className={`flex items-center gap-2 ${isRtl ? 'rtl' : 'ltr'}`}>
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
  const { t, i18n } = useTranslation();
  const [isRtl, setIsRtl] = useState(false);
  
  // Check if current language is RTL
  useEffect(() => {
    const rtlLanguages = ['he', 'ar'];
    setIsRtl(rtlLanguages.includes(i18n.language));
  }, [i18n.language]);

  const templates = [
    { id: 'Template 1', label: t('template_1') },
    { id: 'Template 2', label: t('template_2') },
    { id: 'Template 3', label: t('template_3') },
    { id: 'Template 4', label: t('template_4') },
  ];

  return (
    <div className={`flex items-center gap-2 ${isRtl ? 'rtl' : 'ltr'}`}>
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
}

export function ClientSelector({ selectedClient, onClientChange }: ClientSelectorProps) {
  const { t, i18n } = useTranslation();
  const [isRtl, setIsRtl] = useState(false);
  
  // Check if current language is RTL
  useEffect(() => {
    const rtlLanguages = ['he', 'ar'];
    setIsRtl(rtlLanguages.includes(i18n.language));
  }, [i18n.language]);

  const clients = [
    { id: 'Client 1', label: t('client_1') },
    { id: 'Client 2', label: t('client_2') },
    { id: 'Client 3', label: t('client_3') },
    { id: 'Client 4', label: t('client_4') },
  ];

  return (
    <div className={`flex items-center gap-2 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="relative">
        <select
          value={selectedClient}
          onChange={(e) => onClientChange(e.target.value)}
          className="appearance-none bg-white border border-[#F3F7F3] rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-[#13A753] text-sm"
        >
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.label}
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