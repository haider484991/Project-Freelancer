import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Modal from '../Modal';

interface ClientModalProps {
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
    compliance?: string;
    calories?: number;
    weight?: number;
    targetCalories?: number;
  };
}

export default function ClientModal({ isOpen, onClose, client }: ClientModalProps) {
  const { t, i18n } = useTranslation();
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [activeTab, setActiveTab] = useState('goal_compliance');
  
  if (!client) return null;
  
  // Sample compliance data
  const weeksData = [
    { week: 1, compliant: true },
    { week: 2, compliant: true },
    { week: 3, compliant: true },
    { week: 4, compliant: true },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="p-6">
        {/* Client Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100">
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
                {client.calories && client.weight ? `calories / ${client.weight} kg ${client.targetCalories || 2000}` : ''}
                {client.group && ` • ${client.group}`}
                {client.dietaryGoal && ` • ${client.dietaryGoal}`}
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
        
        {/* Tab Navigation */}
        <div className="flex justify-center gap-8 mb-6">
          <button 
            className={`text-lg font-medium ${activeTab === 'goal_compliance' ? 'text-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('goal_compliance')}
          >
            {t('goal_compliance')}
          </button>
          <button 
            className={`text-lg font-medium ${activeTab === 'additional_info' ? 'text-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('additional_info')}
          >
            {t('additional_info')}
          </button>
          <button 
            className={`text-lg font-medium ${activeTab === 'client_metrics' ? 'text-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('client_metrics')}
          >
            {t('client_metrics')}
          </button>
        </div>
        
        {/* Goal Compliance Content */}
        {activeTab === 'goal_compliance' && (
          <div>
            <h3 className="text-center text-lg font-medium mb-6">{t('weekly_goals')}</h3>
            
            {/* Week Pills */}
            <div className="flex justify-center gap-4 mb-8">
              {[1, 2, 3, 4].map(week => (
                <button
                  key={week}
                  onClick={() => setSelectedWeek(week)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedWeek === week 
                      ? 'bg-primary text-white' 
                      : 'border border-gray-300 bg-white'
                  }`}
                >
                  {week}
                </button>
              ))}
            </div>
            
            {/* Week Status Circles */}
            <div className="flex justify-between items-center px-6 mb-4">
              {weeksData.map(weekData => (
                <div key={weekData.week} className="flex flex-col items-center">
                  <div className="text-sm text-gray-500 mb-3">week {weekData.week}</div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    weekData.compliant 
                      ? 'bg-primary' 
                      : 'border border-primary'
                  }`}>
                    {weekData.compliant && (
                      <svg width="16" height="12" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Additional Info Content */}
        {activeTab === 'additional_info' && (
          <div className="min-h-[200px] flex justify-center items-center">
            <div className="text-gray-500">{t('no_additional_info')}</div>
          </div>
        )}
        
        {/* Client Metrics Content */}
        {activeTab === 'client_metrics' && (
          <div className="min-h-[200px] flex justify-center items-center">
            <div className="text-gray-500">{t('no_metrics_available')}</div>
          </div>
        )}
        
        {/* Footer Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="bg-primary text-white font-medium py-2 px-8 rounded-full"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </Modal>
  );
} 