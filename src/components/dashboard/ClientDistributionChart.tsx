'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useAppContext } from '@/context/AppContext'
import { useMemo } from 'react'

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow-md rounded-md">
        <p className="font-semibold">{payload[0].name}</p>
        <p>{`${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

export default function ClientDistributionChart() {
  const { clients, groups } = useAppContext()
  
  // Calculate client distribution based on groups
  const clientDistribution = useMemo(() => {
    // Default colors for different group types
    const colors = {
      'Weight Loss': '#13A753',
      'Muscle Gain': '#106A02',
      'Maintenance': '#42C501',
      'Vegan': '#A5FF79',
      'Other': '#8ED1FC'
    }
    
    // Count clients in each group
    const groupCounts: Record<string, number> = {}
    let totalClients = 0
    
    clients.forEach(client => {
      // In a real app, clients would have a groupId field
      // This is a simplified example
      const clientGroups = groups.filter(group => 
        // This would be replaced with actual logic to match clients to groups
        group.name.toLowerCase().includes(client.name.split(' ')[0].toLowerCase())
      )
      
      if (clientGroups.length > 0) {
        const groupName = clientGroups[0].name
        groupCounts[groupName] = (groupCounts[groupName] || 0) + 1
        totalClients++
      }
    })
    
    // If no real data is available, use some default groups
    if (totalClients === 0) {
      return [
        { name: 'Weight Loss', value: 25, color: '#13A753' },
        { name: 'Muscle Gain', value: 10, color: '#106A02' },
        { name: 'Maintenance', value: 60, color: '#42C501' },
        { name: 'Vegan', value: 5, color: '#A5FF79' }
      ]
    }
    
    // Convert counts to percentages
    return Object.entries(groupCounts).map(([name, count]) => ({
      name,
      value: Math.round((count / totalClients) * 100),
      color: (colors as any)[name] || '#8ED1FC' // Use default color if not found
    }))
  }, [clients, groups])

  return (
    <div className="bg-[rgba(231,240,230,0.5)] rounded-[20px] p-8">
      <h3 className="text-[18px] font-bold text-[#2B180A] mb-6">
        Breakdown of Clients per Coaching Group
      </h3>
      
      <div className="flex items-center justify-center relative h-[220px]">
        {/* Pie Chart */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={clientDistribution}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = outerRadius + 20;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                
                return (
                  <text
                    x={x}
                    y={y}
                    fill="#004208"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    fontSize={14}
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {clientDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#F3F7F3" strokeWidth={3} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-[60px] mt-4">
        <div className="flex flex-col gap-5">
          {clientDistribution.slice(0, Math.ceil(clientDistribution.length / 2)).map((entry, index) => (
            <div key={`legend-1-${index}`} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[16px] text-black">{entry.name}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-5">
          {clientDistribution.slice(Math.ceil(clientDistribution.length / 2)).map((entry, index) => (
            <div key={`legend-2-${index}`} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[16px] text-black">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}