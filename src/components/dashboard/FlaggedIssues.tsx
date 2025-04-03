'use client'

import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

// Define the interface for issue items
interface IssueItem {
  id: string;
  name: string;
  image: string;
  issue: string;
  daysInactive?: number;
}

interface FlaggedIssuesProps {
  _inactiveClients: number;
  inactiveTraineesList?: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    is_active: string;
    last_activity?: string;
    image?: string;
    [key: string]: unknown;
  }>;
}

const FlaggedIssues = ({ _inactiveClients, inactiveTraineesList = [] }: FlaggedIssuesProps) => {
  const { clients: _clients } = useAppContext()
  const { t } = useTranslation()
  
  // Generate flagged issues based on client data
  const flaggedIssues = useMemo(() => {
    // If we have inactive trainees from the API
    if (inactiveTraineesList && inactiveTraineesList.length > 0) {
      const issues: IssueItem[] = inactiveTraineesList.slice(0, 5).map(trainee => {
        // Calculate days inactive based on last activity if available
        let daysInactive = 7; // Default value
        if (trainee.last_activity) {
          try {
            const lastActivity = new Date(trainee.last_activity);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
            daysInactive = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          } catch (e) {
            console.warn('Error calculating days inactive:', e);
          }
        }
        
        return {
          id: trainee.id,
          name: trainee.name,
          image: trainee.image || '/images/profile.jpg',
          issue: `Inactive for ${daysInactive} days`,
          daysInactive
        };
      });
      
      // Sort by most days inactive
      issues.sort((a, b) => (b.daysInactive || 0) - (a.daysInactive || 0));
      
      return issues.slice(0, 6); // Return top 6 issues
    }
    
    // If no data available from API
    return [];
  }, [inactiveTraineesList]);
  
  return (
    <div className="bg-[#F3F7F3] rounded-[20px] p-8">
      <h3 className="text-[18px] font-bold text-[#2B180A] mb-8">
        {t('flagged_issues', 'Flagged Issues')}
      </h3>
      <div className="space-y-3">
        {flaggedIssues.length > 0 ? (
          flaggedIssues.map((issue, index) => (
            <div
              key={issue.id || index}
              className="flex justify-between items-center px-[18px] py-2 bg-white rounded-[110px]"
            >
              <div className="flex items-center gap-[15px]">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  <Image 
                    src={issue.image} 
                    alt={issue.name} 
                    width={40} 
                    height={40}
                    className="object-cover"
                  />
                </div>
                <span className="text-[16px] font-medium text-[#1E1E1E]">
                  {issue.name}
                </span>
              </div>
              <span className="text-[16px] font-medium text-[#D40101]">
                {issue.issue}
              </span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-[20px]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.75 11.9999L10.58 14.8299L16.25 9.16992" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-[#1E1E1E] font-medium mt-2">{t('no_issues_detected', 'No issues detected')}</p>
            <p className="text-[#636363] text-sm">{t('all_clients_active', 'All your clients are currently active')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FlaggedIssues