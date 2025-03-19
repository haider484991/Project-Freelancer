'use client'

import { useAppContext } from '@/context/AppContext'

export default function StatsCards() {
  const { clients } = useAppContext()
  
  // Calculate statistics from real client data
  const activeClients = clients.filter(client => client.status === 'active').length
  const averageCaloricIntake = '2200 klc' // This would be calculated from actual client data
  const goalStatus = clients.length > 0 ? 
    Math.round((clients.filter(client => client.goalsMet !== undefined && client.goalsMet > 70).length / clients.length) * 100) + '%' : 
    'No Data'
  const proteinIntake = '150 g' // This would be calculated from actual client data

  const statsData = [
    {
      title: 'Total Active Clients',
      value: activeClients.toString(),
      icon: (
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.125 8.3125C9.0539 8.3125 10.625 6.7414 10.625 4.8125C10.625 2.8836 9.0539 1.3125 7.125 1.3125C5.1961 1.3125 3.625 2.8836 3.625 4.8125C3.625 6.7414 5.1961 8.3125 7.125 8.3125Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1.3125 15.4375V13.9375C1.3125 12.0086 2.8836 10.4375 4.8125 10.4375H9.4375C11.3664 10.4375 12.9375 12.0086 12.9375 13.9375V15.4375" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.7812 1.3125C14.6328 1.3125 15.4488 1.65234 16.0488 2.25234C16.6488 2.85234 16.9887 3.66836 16.9887 4.51992C16.9887 5.37148 16.6488 6.1875 16.0488 6.7875C15.4488 7.3875 14.6328 7.72734 13.7812 7.72734" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.6875 15.4375V13.9375C17.6875 13.0859 17.3477 12.2699 16.7477 11.6699C16.1477 11.0699 15.3316 10.73 14.48 10.73" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: 'Daily Caloric Intake',
      value: averageCaloricIntake,
      icon: (
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 17.0625C13.6777 17.0625 17.0625 13.6777 17.0625 9.5C17.0625 5.32233 13.6777 1.9375 9.5 1.9375C5.32233 1.9375 1.9375 5.32233 1.9375 9.5C1.9375 13.6777 5.32233 17.0625 9.5 17.0625Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.5 4.75V9.5L12.6667 11.0833" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: 'Goal Status',
      value: goalStatus,
      icon: (
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.2969 5.34375L7.125 14.5156L2.70312 10.0938" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: 'Protein Intake',
      value: proteinIntake,
      icon: (
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 17.0625C13.6777 17.0625 17.0625 13.6777 17.0625 9.5C17.0625 5.32233 13.6777 1.9375 9.5 1.9375C5.32233 1.9375 1.9375 5.32233 1.9375 9.5C1.9375 13.6777 5.32233 17.0625 9.5 17.0625Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.5 4.75V9.5L12.6667 11.0833" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ]

  return (
    <div className="grid grid-cols-4 gap-6 mb-6">
      {statsData.map((stat, index) => (
        <div 
          key={index}
          className="bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-xl p-6"
        >
          <div className="flex items-start gap-6">
            <div className="flex flex-col gap-2.5">
              <h3 className="text-[25px] font-extrabold text-white">
                {stat.value}
              </h3>
              <p className="text-[16px] font-medium text-white">
                {stat.title}
              </p>
            </div>
            <div className="w-[38px] h-[38px] rounded-full bg-white/25 flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}