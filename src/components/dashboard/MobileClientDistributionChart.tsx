'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

type ChartData = {
  name: string;
  value: number;
  color: string;
};

const data: ChartData[] = [
  { name: 'Weight Loss', value: 25, color: '#13A753' },
  { name: 'Muscle Gain', value: 10, color: '#106A02' },
  { name: 'Maintenance', value: 60, color: '#42C501' },
  { name: 'Vegan', value: 5, color: '#A5FF79' }
]

// Define a proper type for tooltip props
type TooltipProps = {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: ChartData;
  }>;
};

const CustomTooltip = ({ active, payload }: TooltipProps) => {
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

export default function MobileClientDistributionChart() {
  return (
    <div className="bg-[rgba(231,240,230,0.5)] rounded-[20px] p-4">
      <h3 className="text-[18px] font-bold text-[#2B180A] mb-4">
        Breakdown of Clients per Coaching Group
      </h3>
      
      <div className="flex flex-col items-center">
        {/* Pie Chart */}
        <div className="relative w-full h-[180px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={60}
                paddingAngle={0}
                dataKey="value"
                label={({
                  cx,
                  cy,
                  midAngle,
                  outerRadius,
                  percent,
                }: {
                  cx: number;
                  cy: number;
                  midAngle: number;
                  outerRadius: number;
                  percent: number;
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 15;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#004208"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      fontSize={12}
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
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[14px] text-black">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 