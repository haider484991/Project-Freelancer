import React, { useState } from 'react';
import Image from 'next/image';
import Modal from '../Modal';

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
        <h2 className="text-center font-semibold text-xl mb-5">Add Client</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Name */}
          <div>
            <input
              type="text"
              placeholder="Client Name"
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
              placeholder="Enter Order/Cost"
              value={dietaryGoal}
              onChange={(e) => setDietaryGoal(e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          {/* Select Group */}
          <div className="relative">
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
            >
              <option value="" disabled>Select Group</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Vegan">Vegan</option>
              <option value="Maintenance">Maintenance</option>
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
                  onClick={() => toggleGoal(goal)}
                >
                  {goal}
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-3">
            <button
              type="submit"
              className="w-full bg-[#13A753] text-white font-medium py-3 rounded-full hover:bg-[#0D8A40] transition-colors"
            >
              Add
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
  const [activeWeek, setActiveWeek] = useState(1);
  
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
          <h4 className="text-base font-medium mb-2">Goal/Compliance</h4>
          
          <div className="bg-[#F8F8F8] rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-sm">Weekly Goals</span>
              <div className="flex space-x-1.5">
                {[1, 2, 3, 4].map(week => (
                  <button
                    key={week}
                    onClick={() => setActiveWeek(week)}
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
                  <span className="text-xs text-[#636363]">Week {week}</span>
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
        
        <div className="flex justify-center">
          <button className="bg-[#13A753] text-white py-3 px-8 rounded-full font-medium hover:bg-[#0D8A40] transition-colors">
            Chat
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
  }) => void;
  availableClients: Client[];
}

export function CreateGroupModal({ 
  isOpen, 
  onClose, 
  onCreateGroup,
  availableClients = [] 
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [dietaryGuidelines, setDietaryGuidelines] = useState('');
  const [mealPlan, setMealPlan] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateGroup({
      name: groupName,
      clients: selectedClients,
      dietary: dietaryGuidelines,
      mealPlan
    });
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setGroupName('');
    setSelectedClients([]);
    setDietaryGuidelines('');
    setMealPlan('');
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
  ) || [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'James Wilson' },
    { id: '4', name: 'Emma Brown' },
    { id: '5', name: 'Mike Johnson' },
  ];
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md md:max-w-3xl lg:max-w-5xl">
      <div className="p-5">
        <h2 className="text-center font-semibold text-xl mb-6">Create Group</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group Name */}
          <div>
            <input
              type="text"
              placeholder="Enter Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          
          {/* Assign Clients */}
          <div className="relative">
            <button
              type="button"
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm text-left flex justify-between items-center"
            >
              <span className="text-[#636363]">Assign Clients</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 9L12 16L5 9" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="mt-2 border border-gray-100 rounded-xl p-3">
              <div className="mb-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Client"
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
                      id={`client-${client.id}`}
                      checked={selectedClients.includes(client.id)}
                      onChange={() => toggleClient(client.id)}
                      className="w-4 h-4 text-[#13A753] border-gray-300 rounded focus:ring-[#13A753]"
                    />
                    <label htmlFor={`client-${client.id}`} className="ml-3 text-sm text-[#636363] cursor-pointer">
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
              placeholder="Enter dietary guidelines"
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
              onChange={(e) => setMealPlan(e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#13A753] appearance-none"
            >
              <option value="" disabled>Select Meal Plan</option>
              <option value="Low Carb">Low Carb</option>
              <option value="High Protein">High Protein</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 9L12 16L5 9" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          {/* Create Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full bg-[#13A753] text-white font-medium py-3 rounded-full hover:bg-[#0D8A40] transition-colors"
            >
              Create Group
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
    name: string;
    clients: string[];
    dietary: string;
    mealPlan: string;
  }) => void;
  group?: {
    name: string;
    clients: string[];
    dietary: string;
    mealPlan: string;
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditGroup({
      name: groupName,
      clients: selectedClients,
      dietary: dietaryGuidelines,
      mealPlan
    });
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
  ) || [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'James Wilson' },
    { id: '4', name: 'Emma Brown' },
    { id: '5', name: 'Mike Johnson' },
  ];
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md md:max-w-3xl lg:max-w-5xl">
      <div className="p-5">
        <h2 className="text-center font-semibold text-xl mb-6">Edit Group</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group Name */}
          <div>
            <input
              type="text"
              placeholder="Enter Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          
          {/* Assign Clients */}
          <div className="relative">
            <button
              type="button"
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm text-left flex justify-between items-center"
            >
              <span className="text-[#636363]">Assign Clients</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 9L12 16L5 9" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="mt-2 border border-gray-100 rounded-xl p-3">
              <div className="mb-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Client"
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
                      onChange={() => toggleClient(client.id)}
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
              placeholder="Enter dietary guidelines"
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
              onChange={(e) => setMealPlan(e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#13A753] appearance-none"
            >
              <option value="" disabled>Select Meal Plan</option>
              <option value="Low Carb">Low Carb</option>
              <option value="High Protein">High Protein</option>
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
              Edit Group
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
  selectedWeek: number;
  onWeekChange: (week: number) => void;
}

export function WeekSelector({ selectedWeek, onWeekChange }: WeekSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleSelect = (week: number) => {
    onWeekChange(week);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button 
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between bg-white border border-gray-100 rounded-full py-2 px-3 text-sm"
      >
        <span>Week {selectedWeek}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 9L12 16L5 9" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-md py-1">
          {[1, 2, 3, 4].map(week => (
            <button
              key={week}
              onClick={() => handleSelect(week)}
              className={`block w-full px-3 py-2 text-left text-sm ${
                selectedWeek === week
                  ? 'bg-[#F3F7F3] font-medium'
                  : 'hover:bg-gray-50'
              }`}
            >
              Week {week}
            </button>
          ))}
        </div>
      )}
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
  const [isOpen, setIsOpen] = useState(false);
  const templates = ['Healhty Protein', 'Weekly Check-In'];
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleSelect = (template: string) => {
    onTemplateChange(template);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button 
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between bg-white border border-gray-100 rounded-full py-2 px-3 text-sm"
      >
        <span className="truncate">{selectedTemplate}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 9L12 16L5 9" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-md py-1">
          {templates.map(template => (
            <button
              key={template}
              onClick={() => handleSelect(template)}
              className={`block w-full px-3 py-2 text-left text-sm ${
                selectedTemplate === template
                  ? 'bg-[#F3F7F3] font-medium'
                  : 'hover:bg-gray-50'
              }`}
            >
              {template}
            </button>
          ))}
        </div>
      )}
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
  const [isOpen, setIsOpen] = useState(false);
  const clients = [
    { id: '1', name: 'All Users' },
    { id: '2', name: 'AI User' },
    { id: '3', name: 'Al Group' },
  ];
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleSelect = (clientId: string) => {
    onClientChange(clientId);
    setIsOpen(false);
  };
  
  const getSelectedClientName = () => {
    const selected = clients.find(c => c.id === selectedClient);
    return selected ? selected.name : "To Client";
  };
  
  return (
    <div className="relative">
      <button 
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between bg-white border border-gray-100 rounded-full py-2 px-3 text-sm"
      >
        <span className="truncate">{getSelectedClientName()}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 9L12 16L5 9" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-md py-1">
          {clients.map(client => (
            <button
              key={client.id}
              onClick={() => handleSelect(client.id)}
              className={`block w-full px-3 py-2 text-left text-sm ${
                selectedClient === client.id
                  ? 'bg-[#F3F7F3] font-medium'
                  : 'hover:bg-gray-50'
              }`}
            >
              {client.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 