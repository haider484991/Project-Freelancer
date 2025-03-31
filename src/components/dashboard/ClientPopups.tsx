import React, { useState, Fragment } from 'react';
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
  onAddClient: (client: {
    name: string;
    dietaryGoal: string;
    group: string;
    status: 'active' | 'inactive';
    email: string;
    phone: string;
    gender: string;
  }) => void;
  availableGroups?: { id: string; name: string }[];
}

export function AddClientModal({ 
  isOpen, 
  onClose, 
  onAddClient,
  availableGroups = []
}: AddClientModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [dietaryGoal, setDietaryGoal] = useState('');
  const [status, setStatus] = useState('active');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('male');
  const { groups } = useAppContext() as { groups: Group[] };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onAddClient({
      name,
      group,
      dietaryGoal,
      status,
      email,
      phone,
      gender
    });

    // Reset form
    setName('');
    setGroup('');
    setDietaryGoal('');
    setStatus('active');
    setEmail('');
    setPhone('');
    setGender('male');
  };
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {t('clientManagementPage.addNewClient')}
                </Dialog.Title>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('clientManagementPage.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#13A753] focus:border-[#13A753]"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#13A753] focus:border-[#13A753]"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="123456789"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#13A753] focus:border-[#13A753]"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('clientManagementPage.group')}
                    </label>
                    <select 
                      id="group"
                      value={group}
                      onChange={(e) => setGroup(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#13A753] focus:border-[#13A753]"
                    >
                      <option value="">Select a group</option>
                      {groups.map(g => (
                        <option key={g.id} value={g.name}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="dietaryGoal" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('clientManagementPage.dietaryGoal')}
                    </label>
                    <input
                      type="text"
                      id="dietaryGoal"
                      value={dietaryGoal}
                      onChange={(e) => setDietaryGoal(e.target.value)}
                      placeholder="2000 calories / 70 kg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#13A753] focus:border-[#13A753]"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select 
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#13A753] focus:border-[#13A753]"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('clientManagementPage.status')}
                    </label>
                    <select 
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#13A753] focus:border-[#13A753]"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#13A753]"
                      onClick={onClose}
                    >
                      {t('general.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-[#13A753] hover:bg-[#0F8A44] rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#13A753]"
                    >
                      {t('general.save')}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
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
    clients: string[];
    dietary: string;
    mealPlan: string;
    dietaryGoal?: string;
  }) => void;
  availableClients: ClientType[];
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
  
  const { t } = useTranslation();
  
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
  
  // Filter clients based on search term
  const filteredClients = availableClients.length > 0 
    ? availableClients.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
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
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#13A753]"
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
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#13A753] appearance-none"
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
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#13A753] appearance-none"
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
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#13A753]"
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
              <div className="text-center py-3 text-gray-400">
                {availableClients.length > 0 
                  ? t('no_clients_found')
                  : t('no_clients_available')}
              </div>
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
  availableClients: ClientType[];
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
  
  const { t } = useTranslation();
  
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

export function EditClientModal({ 
  isOpen, 
  onClose, 
  client, 
  onEditClient,
  availableGroups = []
}: EditClientModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ClientType | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Update formData when client changes
  React.useEffect(() => {
    if (client) {
      setFormData({...client});
    } else {
      setFormData(null);
    }
  }, [client]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDietaryGoalChange = (targetCalories: string, targetWeight: string) => {
    // Format dietary goal as "targetCalories cal | targetWeight kg"
    const combinedDietaryGoal = `${targetCalories || '0'} cal | ${targetWeight || '0'} kg`;
    setFormData({
      ...formData,
      dietaryGoal: combinedDietaryGoal
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    try {
      setLoading(true);
      setNotification(null);
      
      // Call the edit function
      await onEditClient(formData);
      setNotification({type: 'success', message: t('clientManagementPage.clientUpdated')});
      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
        setNotification(null);
      }, 1500);
    } catch (error) {
      setNotification({type: 'error', message: t('clientManagementPage.errorUpdatingClient')});
    } finally {
      setLoading(false);
    }
  };

  // Extract dietary goal values
  let targetCalories = '0';
  let targetWeight = '0';
  
  if (formData.dietaryGoal) {
    const parts = formData.dietaryGoal.split('|');
    if (parts.length >= 1) {
      const calParts = parts[0].trim().split(' ');
      if (calParts.length >= 1) {
        targetCalories = calParts[0];
      }
    }
    if (parts.length >= 2) {
      const weightParts = parts[1].trim().split(' ');
      if (weightParts.length >= 1) {
        targetWeight = weightParts[0];
      }
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-gray-900 flex items-center"
                  >
                    <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {t('clientManagementPage.editClient')}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 6L18 18" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {notification && (
                  <div className={`mb-4 p-3 rounded-lg ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {notification.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Client Name */}
                    <div className="col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('clientManagementPage.clientName')} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-[#13A753] focus:border-[#13A753] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div className="col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('clientManagementPage.email')} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-[#13A753] focus:border-[#13A753] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Phone */}
                    <div className="col-span-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('clientManagementPage.phone')}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-[#13A753] focus:border-[#13A753] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Group */}
                    <div className="col-span-2">
                      <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('clientManagementPage.group')}
                      </label>
                      <div className="relative">
                        <select
                          name="group"
                          id="group"
                          value={formData.group || ''}
                          onChange={handleChange}
                          className="appearance-none w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-[#13A753] focus:border-[#13A753] focus:outline-none transition-colors pr-10"
                        >
                          <option value="">{t('clientManagementPage.selectGroup')}</option>
                          {availableGroups.map(group => (
                            <option key={group.id} value={group.name}>
                              {group.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9L12 15L18 9" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Dietary Goals */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('clientManagementPage.dietaryGoals')}
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="targetCalories" className="block text-xs text-gray-600 mb-1">
                            {t('clientManagementPage.targetCalories')}
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              id="targetCalories"
                              value={targetCalories}
                              onChange={(e) => handleDietaryGoalChange(e.target.value, targetWeight)}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-[#13A753] focus:border-[#13A753] focus:outline-none transition-colors pr-12"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500 text-sm">
                              cal
                            </div>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="targetWeight" className="block text-xs text-gray-600 mb-1">
                            {t('clientManagementPage.targetWeight')}
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              id="targetWeight"
                              value={targetWeight}
                              onChange={(e) => handleDietaryGoalChange(targetCalories, e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-[#13A753] focus:border-[#13A753] focus:outline-none transition-colors pr-12"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500 text-sm">
                              kg
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('clientManagementPage.status')}
                      </label>
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <input
                            id="status-active"
                            name="status"
                            type="radio"
                            value="active"
                            checked={formData.status === 'active'}
                            onChange={handleChange}
                            className="h-4 w-4 text-[#13A753] focus:ring-[#13A753] border-gray-300"
                          />
                          <label htmlFor="status-active" className="ml-2 block text-sm text-gray-700">
                            {t('clientManagementPage.active')}
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="status-inactive"
                            name="status"
                            type="radio"
                            value="inactive"
                            checked={formData.status === 'inactive'}
                            onChange={handleChange}
                            className="h-4 w-4 text-[#13A753] focus:ring-[#13A753] border-gray-300"
                          />
                          <label htmlFor="status-inactive" className="ml-2 block text-sm text-gray-700">
                            {t('clientManagementPage.inactive')}
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('clientManagementPage.gender')}
                      </label>
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <input
                            id="gender-male"
                            name="gender"
                            type="radio"
                            value="male"
                            checked={formData.gender === 'male'}
                            onChange={handleChange}
                            className="h-4 w-4 text-[#13A753] focus:ring-[#13A753] border-gray-300"
                          />
                          <label htmlFor="gender-male" className="ml-2 block text-sm text-gray-700">
                            {t('clientManagementPage.male')}
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="gender-female"
                            name="gender"
                            type="radio"
                            value="female"
                            checked={formData.gender === 'female'}
                            onChange={handleChange}
                            className="h-4 w-4 text-[#13A753] focus:ring-[#13A753] border-gray-300"
                          />
                          <label htmlFor="gender-female" className="ml-2 block text-sm text-gray-700">
                            {t('clientManagementPage.female')}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#13A753] text-white font-medium py-2.5 rounded-full hover:bg-[#0D8A40] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('clientManagementPage.updating')}
                        </>
                      ) : (
                        t('clientManagementPage.updateClient')
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}