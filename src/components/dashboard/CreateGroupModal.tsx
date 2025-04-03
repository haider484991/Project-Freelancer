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
  const [dietaryGuidelines, setDietaryGuidelines] = useState('');
  const [mealPlan, setMealPlan] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateGroup({
      name: groupName,
      clients: [], // Empty array since we're removing client selection
      dietary: dietaryGuidelines,
      mealPlan: mealPlan
    });
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setGroupName('');
    setDietaryGuidelines('');
    setMealPlan('');
  };
  
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
              className="w-full px-4 py-3 border border-gray-100 rounded-25 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          
          {/* Dietary Guidelines */}
          <div>
            <textarea
              placeholder="Enter dietary guidelines"
              value={dietaryGuidelines}
              onChange={(e) => setDietaryGuidelines(e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-25 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              rows={3}
            />
          </div>
          
          {/* Meal Plan */}
          <div className="relative">
            <select
              value={mealPlan}
              onChange={(e) => setMealPlan(e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-25 text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
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
          
          {/* Action Buttons */}
          <div className="pt-3 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-25 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#106A02] to-[#13A753] text-white font-medium py-3 rounded-25"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
} 