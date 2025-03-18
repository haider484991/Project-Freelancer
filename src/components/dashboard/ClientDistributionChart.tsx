'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Weight Loss', value: 25, color: '#13A753' },
  { name: 'Muscle Gain', value: 10, color: '#106A02' },
  { name: 'Maintenance', value: 60, color: '#42C501' },
  { name: 'Vegan', value: 5, color: '#A5FF79' }
]

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
              data={data}
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
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#F3F7F3" strokeWidth={3} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-[60px] mt-4">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#13A753]" />
            <span className="text-[16px] text-black">Weight Loss</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#42C501]" />
            <span className="text-[16px] text-black">Maintenance</span>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#106A02]" />
            <span className="text-[16px] text-black">Muscle Gain</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#A5FF79]" />
            <span className="text-[16px] text-black">Vegan</span>
          </div>
        </div>
      </div>
    </div>
  )
} 