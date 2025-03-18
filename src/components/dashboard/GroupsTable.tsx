import React from 'react';
import Image from 'next/image';

// Define the Group type
export interface Group {
  id: string;
  name: string;
  members: number;
  dietaryGoal: string;
  createdAt: string;
}

// Mock data for groups
export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Weight Loss',
    members: 12,
    dietaryGoal: 'Low Carb',
    createdAt: '12/02/2023',
  },
  {
    id: '2',
    name: 'Muscle Gain',
    members: 8,
    dietaryGoal: 'High Protein',
    createdAt: '05/03/2023',
  },
  {
    id: '3',
    name: 'Vegan',
    members: 6,
    dietaryGoal: 'Plant Based',
    createdAt: '20/01/2023',
  },
  {
    id: '4',
    name: 'Maintenance',
    members: 15,
    dietaryGoal: 'Balanced',
    createdAt: '10/12/2022',
  },
];

interface GroupsTableProps {
  groups?: Group[];
  isMobile?: boolean;
  onViewGroup?: (group: Group) => void;
}

export default function GroupsTable({ 
  groups = mockGroups, 
  isMobile = false,
  onViewGroup = () => {} 
}: GroupsTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      {!isMobile ? (
        // Desktop table
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 px-4 font-medium text-[#1E1E1E]">Group Name</th>
              <th className="text-left py-4 px-4 font-medium text-[#1E1E1E]">Members</th>
              <th className="text-left py-4 px-4 font-medium text-[#1E1E1E]">Dietary Goal</th>
              <th className="text-left py-4 px-4 font-medium text-[#1E1E1E]">Created At</th>
              <th className="text-left py-4 px-4 font-medium text-[#1E1E1E]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id} className="border-b border-gray-100">
                <td className="py-4 px-4">
                  <div className="font-medium text-[#1E1E1E]">{group.name}</div>
                </td>
                <td className="py-4 px-4 text-[#636363]">{group.members}</td>
                <td className="py-4 px-4 text-[#636363]">{group.dietaryGoal}</td>
                <td className="py-4 px-4 text-[#636363]">{group.createdAt}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
              <button 
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      onClick={() => onViewGroup(group)}
              >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.26 3.59997L5.04997 12.29C4.73997 12.62 4.43997 13.27 4.37997 13.72L4.00997 16.96C3.87997 18.13 4.71997 18.93 5.87997 18.73L9.09997 18.18C9.54997 18.1 10.18 17.77 10.49 17.43L18.7 8.73997C20.12 7.23997 20.76 5.52997 18.55 3.43997C16.35 1.36997 14.68 2.09997 13.26 3.59997Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.33 16.5H13.66" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.5 12.5H14.5" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-[#1E1E1E]">{group.name}</h3>
                <div className="flex items-center gap-1">
                  <button 
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={() => onViewGroup(group)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.26 3.59997L5.04997 12.29C4.73997 12.62 4.43997 13.27 4.37997 13.72L4.00997 16.96C3.87997 18.13 4.71997 18.93 5.87997 18.73L9.09997 18.18C9.54997 18.1 10.18 17.77 10.49 17.43L18.7 8.73997C20.12 7.23997 20.76 5.52997 18.55 3.43997C16.35 1.36997 14.68 2.09997 13.26 3.59997Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.33 16.5H13.66" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.5 12.5H14.5" stroke="#FF5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
      </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div className="text-[#636363] mb-1">Members</div>
                  <div className="font-medium">{group.members}</div>
                </div>
                <div>
                  <div className="text-[#636363] mb-1">Dietary Goal</div>
                  <div className="font-medium">{group.dietaryGoal}</div>
              </div>
                <div>
                  <div className="text-[#636363] mb-1">Created</div>
                  <div className="font-medium">{group.createdAt}</div>
              </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 