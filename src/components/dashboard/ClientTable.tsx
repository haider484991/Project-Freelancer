'use client'

import Image from 'next/image'
import { useState } from 'react'
import ProfileAvatar from './ProfileAvatar'

// Define the Client type
export interface Client {
  id: string;
  name: string;
  image?: string;
  group: string;
  goalsMet: number;
  dietaryGoal: string;
  status: 'active' | 'inactive';
  compliance?: 'compliant' | 'non-compliant';
  pushEnabled?: boolean;
}

// Mock data for clients
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Alex Dube',
    image: '/images/profile.jpg',
    group: 'Weight Loss',
    goalsMet: 75,
    dietaryGoal: '1800 kcal/day',
    status: 'active',
    compliance: 'compliant',
    pushEnabled: true,
  },
  {
    id: '2',
    name: 'Tanisha dude',
    image: '/images/profile.jpg',
    group: 'Muscle Gain',
    goalsMet: 90,
    dietaryGoal: '1800 kcal/day',
    status: 'active',
    compliance: 'non-compliant',
    pushEnabled: false,
  },
  {
    id: '3',
    name: 'Rudi Filip',
    image: '/images/clients/sarah.jpg',
    group: 'Vegan',
    goalsMet: 60,
    dietaryGoal: '1800 kcal/day',
    status: 'active',
    compliance: 'compliant',
    pushEnabled: true,
  },
  {
    id: '4',
    name: 'Rony Dude',
    image: '/images/clients/emma.jpg',
    group: 'Maintenance',
    goalsMet: 85,
    dietaryGoal: '1800 kcal/day',
    status: 'inactive',
    compliance: 'compliant',
    pushEnabled: false,
  },
  {
    id: '5',
    name: 'Ronald Jones',
    image: '/images/clients/mike.jpg',
    group: 'Muscle Gain',
    goalsMet: 80,
    dietaryGoal: '1800 kcal/day',
    status: 'active',
    compliance: 'compliant',
    pushEnabled: true,
  },
  {
    id: '6',
    name: 'Jivan Piter',
    image: '/images/clients/james.jpg',
    group: 'Weight Loss',
    goalsMet: 45,
    dietaryGoal: '1800 kcal/day',
    status: 'active',
    compliance: 'non-compliant',
    pushEnabled: true,
  },
  {
    id: '7',
    name: 'Babita Mode',
    image: '/images/clients/lisa.jpg',
    group: 'Vegan',
    goalsMet: 92,
    dietaryGoal: '1800 kcal/day',
    status: 'active',
    compliance: 'compliant',
    pushEnabled: true,
  },
];

interface ClientTableProps {
  clients?: Client[];
  isMobile?: boolean;
  onViewClient?: (client: Client) => void;
  onTogglePush?: (clientId: string, enabled: boolean) => void;
}

export default function ClientTable({ 
  clients = mockClients, 
  isMobile = false,
  onViewClient = () => {},
  onTogglePush = () => {}
}: ClientTableProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Filter clients based on active tab
  const filteredClients = clients.filter(client => {
    if (activeTab === 'all') return true;
    return client.status === activeTab;
  });
  
      return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-gray-100">
        <button
          className={`pb-3 px-1 font-medium ${
            activeTab === 'all' 
              ? 'text-[#13A753] border-b-2 border-[#13A753]' 
              : 'text-[#636363]'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All Clients
        </button>
        <button
          className={`pb-3 px-1 font-medium ${
            activeTab === 'active' 
              ? 'text-[#13A753] border-b-2 border-[#13A753]' 
              : 'text-[#636363]'
          }`}
          onClick={() => setActiveTab('active')}
        >
          Active
        </button>
        <button
          className={`pb-3 px-1 font-medium ${
            activeTab === 'inactive' 
              ? 'text-[#13A753] border-b-2 border-[#13A753]' 
              : 'text-[#636363]'
          }`}
          onClick={() => setActiveTab('inactive')}
        >
          Inactive
        </button>
        </div>
      
      {!isMobile ? (
        // Desktop table
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 px-4 font-medium text-[#1E1E1E]">CLIENT NAME</th>
              <th className="text-left py-4 px-4 font-medium text-[#1E1E1E]">GROUP</th>
              <th className="text-left py-4 px-4 font-medium text-[#1E1E1E]">DIETARY GOAL</th>
              <th className="text-left py-4 px-4 font-medium text-[#1E1E1E]">COMPLIANCE</th>
              <th className="text-left py-4 px-4 font-medium text-[#1E1E1E]">PUSH</th>
              <th className="text-left py-4 px-4 font-medium text-[#1E1E1E]">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id} className="border-b border-gray-100">
                <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image 
                        src={client.image || "/images/profile.jpg"} 
                      alt={client.name}
                        width={40} 
                        height={40}
                        className="object-cover"
                    />
                    </div>
                    <div className="font-medium text-[#1E1E1E]">{client.name}</div>
                  </div>
                </td>
                <td className="py-4 px-4 text-[#636363]">{client.group}</td>
                <td className="py-4 px-4 text-[#636363]">{client.dietaryGoal}</td>
                <td className="py-4 px-4">
                  {client.compliance === 'compliant' ? (
                    <div className="w-8 h-8 rounded-full bg-[#F3F7F3] flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#FFEBEB] flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 9L9 15" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 9L15 15" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
              </div>
            )}
                </td>
                <td className="py-4 px-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={client.pushEnabled} 
                      onChange={() => onTogglePush(client.id, !client.pushEnabled)} 
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13A753]"></div>
                  </label>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      onClick={() => onViewClient(client)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42001 13.98 8.42001 12C8.42001 10.02 10.02 8.42001 12 8.42001C13.98 8.42001 15.58 10.02 15.58 12Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.71997 12 3.71997C8.46997 3.71997 5.17997 5.79997 2.88997 9.39997C1.98997 10.81 1.98997 13.18 2.88997 14.59C5.17997 18.19 8.46997 20.27 12 20.27Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        // Mobile table alternative
        <div className="space-y-4">
          {filteredClients.map((client) => (
            <div key={client.id} className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image 
                      src={client.image || "/images/profile.jpg"} 
                      alt={client.name} 
                      width={40} 
                      height={40}
                      className="object-cover"
                    />
                </div>
                  <div>
                    <div className="font-medium text-[#1E1E1E]">{client.name}</div>
                    <div className="text-sm text-[#636363]">{client.group}</div>
                  </div>
                    </div>
                
                {/* Compliance indicator */}
                {client.compliance === 'compliant' ? (
                  <div className="w-8 h-8 rounded-full bg-[#F3F7F3] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#FFEBEB] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 9L9 15" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 9L15 15" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs text-[#636363] mb-1">Dietary Goal</div>
                  <div className="text-sm font-medium">{client.dietaryGoal}</div>
                </div>
                
                <div>
                  <div className="text-xs text-[#636363] mb-1">Push Notifications</div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={client.pushEnabled} 
                      onChange={() => onTogglePush(client.id, !client.pushEnabled)} 
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13A753]"></div>
                  </label>
                </div>
      </div>
      
              <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
                  <button 
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={() => onViewClient(client)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42001 13.98 8.42001 12C8.42001 10.02 10.02 8.42001 12 8.42001C13.98 8.42001 15.58 10.02 15.58 12Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.71997 12 3.71997C8.46997 3.71997 5.17997 5.79997 2.88997 9.39997C1.98997 10.81 1.98997 13.18 2.88997 14.59C5.17997 18.19 8.46997 20.27 12 20.27Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
          ))}
        </div>
      )}
    </div>
  );
} 