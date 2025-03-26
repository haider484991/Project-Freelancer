'use client'

import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'
import { useMemo } from 'react'

// Define the interface for issue items
interface IssueItem {
  name: string;
  image: string;
  issue: string;
}

interface FlaggedIssuesProps {
  inactiveClients: number;
  inactiveTraineesList?: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    is_active: string;
    [key: string]: unknown;
  }>;
}

const FlaggedIssues = ({ inactiveClients, inactiveTraineesList = [] }: FlaggedIssuesProps) => {
  const { clients } = useAppContext()
  
  // Generate flagged issues based on client data
  const flaggedIssues = useMemo(() => {
    // If we have inactive trainees from the API
    if (inactiveTraineesList && inactiveTraineesList.length > 0) {
      const issues: IssueItem[] = inactiveTraineesList.slice(0, 5).map(trainee => ({
        name: trainee.name,
        image: '/images/profile.jpg',
        issue: 'Inactive for 7 days'
      }));
      
      // Add some other placeholders for different issues if we don't have enough
      if (issues.length < 5) {
        if (issues.length < 5) issues.push({
          name: 'Client 4',
          image: '/images/profile.jpg',
          issue: 'Missed last check-in'
        });
        
        if (issues.length < 5) issues.push({
          name: 'Client 5',
          image: '/images/profile.jpg',
          issue: 'Below protein target'
        });
      }
      
      return issues;
    }
    
    // If we have inactive clients from the API but no data in context, 
    // generate some placeholder data based on the count
    if (inactiveClients > 0 && (!clients || clients.length === 0)) {
      const placeholderIssues: IssueItem[] = [];
      
      // Add some placeholder inactive clients
      for (let i = 0; i < Math.min(inactiveClients, 3); i++) {
        placeholderIssues.push({
          name: `Client ${i + 1}`,
          image: '/images/profile.jpg',
          issue: 'Inactive for 7 days'
        });
      }
      
      // Add some other placeholders for different issues
      placeholderIssues.push({
        name: 'Client 4',
        image: '/images/profile.jpg',
        issue: 'Missed last check-in'
      });
      
      placeholderIssues.push({
        name: 'Client 5',
        image: '/images/profile.jpg',
        issue: 'Below protein target'
      });
      
      return placeholderIssues;
    }
    
    // If we have clients in context, process them
    if (clients && clients.length > 0) {
      // Filter clients that might have issues
      const inactiveClientsList = clients.filter(client => client.status === 'inactive')
      const nonCompliantClients = clients.filter(client => client.compliance === 'non-compliant')
      
      // Create flagged issues array with proper typing
      const issues: IssueItem[] = []
      
      // Add inactive clients
      inactiveClientsList.forEach(client => {
        issues.push({
          name: client.name,
          image: '/images/profile.jpg', // Default image if client-specific image not available
          issue: 'Inactive for 7 days'
        })
      })
      
      // Add non-compliant clients
      nonCompliantClients.forEach(client => {
        // Skip if client is already in the issues list
        if (!issues.some(issue => issue.name === client.name)) {
          issues.push({
            name: client.name,
            image: '/images/profile.jpg', // Default image if client-specific image not available
            issue: 'Missed last check-in'
          })
        }
      })
      
      // Add clients with low goal achievement
      clients.forEach(client => {
        if (client.goalsMet !== undefined && client.goalsMet < 50 && 
            !issues.some(issue => issue.name === client.name)) {
          issues.push({
            name: client.name,
            image: '/images/profile.jpg', // Default image if client-specific image not available
            issue: 'Below protein target'
          })
        }
      })
      
      return issues;
    }
    
    // Default sample issues if no real data available
    return [
      {
        name: 'Hilton Santana',
        image: '/images/clients/hilton.jpg',
        issue: 'Inactive for 7 days'
      },
      {
        name: 'Sarah Johnson',
        image: '/images/clients/sarah.jpg',
        issue: 'Missed last check-in'
      },
      {
        name: 'Mike Chen',
        image: '/images/clients/mike.jpg',
        issue: 'No meal logs for 5 days'
      },
      {
        name: 'Emma Wilson',
        image: '/images/clients/emma.jpg',
        issue: 'Missed workout session'
      },
      {
        name: 'James Brown',
        image: '/images/clients/james.jpg',
        issue: 'Below protein target'
      },
      {
        name: 'Lisa Anderson',
        image: '/images/clients/lisa.jpg',
        issue: 'Missed weekly weigh-in'
      }
    ] as IssueItem[]
  }, [clients, inactiveClients, inactiveTraineesList])

  return (
    <div className="bg-[#F3F7F3] rounded-[20px] p-8">
      <h3 className="text-[18px] font-bold text-[#2B180A] mb-8">
        Flagged Issues
      </h3>
      <div className="space-y-3">
        {flaggedIssues.map((issue, index) => (
          <div
            key={index}
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
        ))}
      </div>
    </div>
  )
}

export default FlaggedIssues