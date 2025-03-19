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

const MobileFlaggedIssues = () => {
  const { clients } = useAppContext()
  
  // Generate flagged issues based on client data
  const flaggedIssues = useMemo(() => {
    // Filter clients that might have issues
    const inactiveClients = clients.filter(client => client.status === 'inactive')
    const nonCompliantClients = clients.filter(client => client.compliance === 'non-compliant')
    
    // Create flagged issues array with proper typing
    const issues: IssueItem[] = []
    
    // Add inactive clients
    inactiveClients.forEach(client => {
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
    
    // If no real issues, return default sample issues
    if (issues.length === 0) {
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
        }
      ] as IssueItem[]
    }
    
    // Limit to 3 issues for mobile view
    return issues.slice(0, 3)
  }, [clients])

  return (
    <div className="bg-[#F3F7F3] rounded-[20px] p-4">
      <h3 className="text-[18px] font-bold text-[#2B180A] mb-4">
        Flagged Issues
      </h3>
      <div className="space-y-3">
        {flaggedIssues.map((issue, index) => (
          <div
            key={index}
            className="flex justify-between items-center px-3 py-2 bg-white rounded-[110px]"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                <Image 
                  src={issue.image} 
                  alt={issue.name} 
                  width={32} 
                  height={32}
                  className="object-cover"
                />
              </div>
              <span className="text-[14px] font-medium text-[#1E1E1E]">
                {issue.name}
              </span>
            </div>
            <span className="text-[14px] font-medium text-[#D40101]">
              {issue.issue}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MobileFlaggedIssues