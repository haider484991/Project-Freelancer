import { useState } from 'react';
import Modal from '../Modal';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (client: {
    name: string;
    cost: string;
    group: string;
    goals: string[];
  }) => void;
}

export default function AddClientModal({ isOpen, onClose, onAddClient }: AddClientModalProps) {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [group, setGroup] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  
  const goals = ['Weight Loss', 'Muscle Gain', 'Vegan', 'Maintenance'];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddClient({
      name,
      cost,
      group,
      goals: selectedGoals,
    });
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setName('');
    setCost('');
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
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="p-4">
        <h2 className="text-center font-semibold text-xl mb-6">Add Client</h2>
        
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
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          {/* Select Group */}
          <div className="relative">
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="w-full px-4 py-3 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
              required
            >
              <option value="" disabled>Select Group</option>
              <option value="Group A">Group A</option>
              <option value="Group B">Group B</option>
              <option value="Group C">Group C</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 9L12 16L5 9" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          {/* Goals Selection */}
          <div className="bg-[#F3F7F3] rounded-2xl p-3">
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
              className="w-full bg-gradient-to-r from-[#106A02] to-[#13A753] text-white font-medium py-3 rounded-full"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
} 