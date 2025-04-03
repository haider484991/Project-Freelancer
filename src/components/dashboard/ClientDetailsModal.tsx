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
    status?: string;
    gender?: string;
    email?: string;
    phone?: string;
  };
  onEdit?: (client: any) => void;
  onDelete?: (client: any) => void;
}

export default function ClientDetailsModal({ isOpen, onClose, client, onEdit, onDelete }: ClientDetailsModalProps) {
  const [selectedWeek, setSelectedWeek] = useState(1);
  
  if (!client) return null;
  
  // Sample compliance data
  const weeksData = [
    { week: 1, compliant: true },
    { week: 2, compliant: true },
    { week: 3, compliant: true },
    { week: 4, compliant: true },
  ];

  const handleEdit = () => {
    if (onEdit && client) {
      onEdit(client);
    }
  };

  const handleDelete = () => {
    if (onDelete && client) {
      onDelete(client);
    }
  };
  
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
        
        <div className="mt-6 flex justify-between">
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={handleEdit}
                className="bg-[#F3F7F3] hover:bg-[#E5F0E5] text-[#13A753] font-medium py-2 px-4 rounded-full flex items-center gap-2 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.04 3.02L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96C22.34 6.6 22.98 5.02 20.98 3.02C18.98 1.02 17.4 1.66 16.04 3.02Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14.91 4.1501C15.58 6.5401 17.45 8.4101 19.85 9.0901" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={handleDelete}
                className="bg-[#FFF5F5] hover:bg-[#FFE5E5] text-[#FF5C5C] font-medium py-2 px-4 rounded-full flex items-center gap-2 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.33 16.5H13.66" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.5 12.5H14.5" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Delete
              </button>
            )}
          </div>
          
          <button
            className="bg-gradient-to-r from-[#106A02] to-[#13A753] text-white font-medium py-2 px-6 rounded-full"
          >
            Chat
          </button>
        </div>
      </div>
    </Modal>
  );
} 