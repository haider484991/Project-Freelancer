'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import WeekSelector from './WeekSelector'

interface CaloricData {
  week: string
  calories: number
}

interface CaloricTrendsChartProps {
  caloricData: CaloricData[]
  selectedWeek: string
  onWeekChange: (week: string) => void
  isMobile?: boolean
}

const CaloricTrendsChart: React.FC<CaloricTrendsChartProps> = ({
  caloricData,
  selectedWeek,
  onWeekChange,
  isMobile = false
}) => {
  const { t } = useTranslation()
  
  if (isMobile) {
    return (
      <div className="mt-4 h-[180px] relative">
        <div className="flex h-full">
          {/* Y-Axis Labels */}
          <div className="flex flex-col justify-between h-full pr-2">
            <span className="text-[10px] text-[#636363]">2500</span>
            <span className="text-[10px] text-[#636363]">1500</span>
            <span className="text-[10px] text-[#636363]">0</span>
          </div>

          {/* Line Chart */}
          <div className="flex-1 relative">
            {/* Grid Lines */}
            <div className="absolute inset-0">
              {[0, 1, 2].map((i) => (
                <div key={`grid-cal-${i}`} className="absolute border-t border-[rgba(15,105,2,0.2)] w-full" style={{ top: `${i * 50}%` }}></div>
              ))}
            </div>

            {/* Line Chart */}
            <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
              <path
                d="M0,240 C40,200 80,220 120,200 C160,180 200,160 240,150 C280,140 320,130 360,130 C400,130 440,140 480,150"
                stroke="url(#green-gradient)"
                strokeWidth="3"
                fill="none"
              />

              {/* Define gradient for line */}
              <defs>
                <linearGradient id="green-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#13A753" />
                  <stop offset="100%" stopColor="#1E2120" />
                </linearGradient>
              </defs>

              {/* Dots */}
              {caloricData.slice(0, 3).map((data, index) => {
                const x = 200 * index + 120;
                const y = 300 - (data.calories / 2500) * 300;
                return (
                  <circle key={`dot-${index}`} cx={x} cy={y} r="6" fill="#FFFFFF" stroke="url(#green-gradient)" strokeWidth="3" />
                );
              })}
            </svg>
          </div>
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-around mt-2 text-[10px] text-[#636363]">
          {caloricData.slice(0, 3).map((data) => (
            <span key={data.week}>{data.week}</span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[30px] p-6 shadow-md border border-gray-100 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[18px] font-bold text-[#1E1E1E]">{t('Caloric Trends')}</h3>
        <WeekSelector 
          selectedWeek={selectedWeek} 
          onWeekChange={onWeekChange}
        />
      </div>

      <div className="flex">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between h-[250px] pr-4 py-2">
          <span className="text-[#636363] text-sm">2500</span>
          <span className="text-[#636363] text-sm">2000</span>
          <span className="text-[#636363] text-sm">1500</span>
          <span className="text-[#636363] text-sm">1000</span>
          <span className="text-[#636363] text-sm">500</span>
          <span className="text-[#636363] text-sm">0</span>
        </div>

        {/* Chart Area */}
        <div className="flex-1 relative">
          {/* Grid Lines */}
          <div className="absolute inset-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`grid-cal-${i}`} className="absolute border-t border-[rgba(15,105,2,0.2)] w-full" style={{ top: `${i * 20}%` }}></div>
            ))}
          </div>

          {/* Line Chart */}
          <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
            <path
              d="M0,180 C40,160 80,140 120,120 C160,100 200,90 240,100 C280,110 320,130 360,120 C400,110 440,100 480,120 C520,140 560,150 600,140 C640,130 680,110 720,90 C760,70 800,60 800,60"
              stroke="url(#green-gradient-desktop)"
              strokeWidth="3"
              fill="none"
            />

            {/* Define gradient for line */}
            <defs>
              <linearGradient id="green-gradient-desktop" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#13A753" />
                <stop offset="100%" stopColor="#1E2120" />
              </linearGradient>
            </defs>

            {/* Fill below line */}
            <path
              d="M0,180 C40,160 80,140 120,120 C160,100 200,90 240,100 C280,110 320,130 360,120 C400,110 440,100 480,120 C520,140 560,150 600,140 C640,130 680,110 720,90 C760,70 800,60 800,60 L800,300 L0,300 Z"
              fill="url(#green-gradient-fill)"
              opacity="0.1"
            />
            <defs>
              <linearGradient id="green-gradient-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#13A753" />
                <stop offset="100%" stopColor="#13A753" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Dots */}
            {caloricData.map((data, index) => {
              // Position dots evenly across the chart width
              const x = index * (800 / (caloricData.length - 1));
              // Calculate y position based on calories
              const y = 300 - (data.calories / 2500) * 300;
              return (
                <g key={`dot-group-${index}`}>
                  <circle cx={x} cy={y} r="8" fill="#FFFFFF" stroke="url(#green-gradient-desktop)" strokeWidth="3" />
                  {selectedWeek === data.week && (
                    <circle cx={x} cy={y} r="12" fill="none" stroke="#13A753" strokeWidth="2" strokeDasharray="3,2" />
                  )}
                  {/* Tooltip */}
                  <g className="opacity-0 hover:opacity-100 transition-opacity" style={{ cursor: 'pointer' }}>
                    <rect x={x - 40} y={y - 45} width="80" height="35" rx="5" fill="white" stroke="#13A753" strokeWidth="1" />
                    <text x={x} y={y - 25} textAnchor="middle" fontSize="12" fill="#1E1E1E" fontWeight="bold">{data.calories} kcal</text>
                    <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fill="#636363">{data.week}</text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between ml-10 mt-3">
        {caloricData.map((data) => (
          <div key={data.week} className="text-center">
            <span className={`block px-3 py-1 text-sm ${selectedWeek === data.week ? 'text-[#13A753] font-semibold' : 'text-[#636363]'}`}>
              {data.week}
            </span>
          </div>
        ))}
      </div>

      {/* Additional Information Box */}
      <div className="mt-5 bg-[#F3F7F3] rounded-[15px] p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-full p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z" fill="#13A753"/>
              <path d="M11 11H13V17H11V11ZM11 7H13V9H11V7Z" fill="#13A753"/>
            </svg>
          </div>
          <div>
            <h4 className="text-[15px] font-semibold text-[#1E1E1E]">{t('Weekly Average')}: 1550 kcal</h4>
            <p className="text-[13px] text-[#636363]">{t('Recommended daily intake')}: 1800-2000 kcal</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaloricTrendsChart 