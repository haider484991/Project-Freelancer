import { useState } from 'react';
import Modal from '../Modal';

// Client type
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

export default function CreateGroupModal({ 
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
      mealPlan: mealPlan
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
  );
  
  const mealPlanOptions = [
    { id: 'low-carb', label: 'Low Carb' },
    { id: 'high-protein', label: 'High Protein' },
  ];
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="p-5">
        <h2 className="text-center font-semibold text-xl mb-6">Create Group</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
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
          <div>
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
            </div>
            
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
              
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1 client-list">
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
                      className="w-4 h-4 text-primary rounded focus:ring-primary focus:ring-1"
                    />
                    <label htmlFor={`client-${client.id}`} className="ml-3 text-sm text-[#636363] cursor-pointer">
                      {client.name}
                    </label>
                  </div>
                ))}
                
                {filteredClients.length === 0 && (
                  <div className="text-center py-2 text-sm text-gray-500">
                    No clients found
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Dietary Guidelines */}
          <div>
            <textarea
              placeholder="Enter dietary guidelines"
              value={dietaryGuidelines}
              onChange={(e) => setDietaryGuidelines(e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              rows={3}
            />
          </div>
          
          {/* Meal Plan */}
          <div className="relative">
            <select
              value={mealPlan}
              onChange={(e) => setMealPlan(e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
            >
              <option value="" disabled>Select Meal Plan</option>
              {mealPlanOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
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
              className="w-full bg-gradient-to-r from-[#106A02] to-[#13A753] text-white font-medium py-3 rounded-full"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
} 