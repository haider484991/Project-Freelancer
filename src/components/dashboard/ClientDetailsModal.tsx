import { useState } from 'react';
import Image from 'next/image';
import Modal from '../Modal';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: {
    id: string;
    name: string;
    group: string;
    dietaryGoal: string;
    image?: string;
    workoutGoal?: string;
  };
}

export default function ClientDetailsModal({ isOpen, onClose, client }: ClientDetailsModalProps) {
  const [selectedWeek, setSelectedWeek] = useState(1);
  
  if (!client) return null;
  
  // Sample compliance data
  const weeksData = [
    { week: 1, compliant: true },
    { week: 2, compliant: true },
    { week: 3, compliant: true },
    { week: 4, compliant: true },
  ];
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="px-5 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image 
                src={client.image || "/images/profile.jpg"} 
                alt={client.name} 
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1E1E1E]">{client.name}</h2>
              <p className="text-[#636363] text-sm">
                {client.group} • {client.dietaryGoal}
                {client.workoutGoal && ` • ${client.workoutGoal}`}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="mt-6">
          <div className="text-[#1E1E1E] font-medium mb-3">Goal/Compliance</div>
          
          <div className="bg-[#F3F7F3] rounded-lg p-3">
            <div className="flex justify-between items-center mb-4">
              <div className="text-[#1E1E1E] font-medium text-sm">Weekly Goals</div>
              <div className="flex gap-1.5">
                {weeksData.map(weekData => (
                  <button 
                    key={weekData.week}
                    onClick={() => setSelectedWeek(weekData.week)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      selectedWeek === weekData.week 
                        ? 'bg-primary text-white' 
                        : 'bg-white text-[#1E1E1E]'
                    }`}
                  >
                    {weekData.week}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              {weeksData.map(weekData => (
                <div 
                  key={weekData.week} 
                  className="flex-1 flex flex-col items-center"
                >
                  <div className="text-sm text-[#636363] mb-1">Week {weekData.week}</div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    weekData.compliant ? 'bg-primary' : 'bg-white border border-primary'
                  }`}>
                    {weekData.compliant && (
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <button
            className="bg-gradient-to-r from-[#106A02] to-[#13A753] text-white font-medium py-3 px-10 rounded-full"
          >
            Chat
          </button>
        </div>
      </div>
    </Modal>
  );
} 