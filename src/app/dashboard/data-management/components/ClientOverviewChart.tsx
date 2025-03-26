'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

interface WeeklyData {
  week: string
  active: number
  inactive: number
  avgCalories?: number
}

interface ClientOverviewChartProps {
  weeklyData: WeeklyData[]
  selectedWeek: string
  isMobile?: boolean
}

const ClientOverviewChart: React.FC<ClientOverviewChartProps> = ({
  weeklyData,
  selectedWeek,
  isMobile = false
}) => {
  const { t } = useTranslation()

  // Calculate max values for scaling the chart
  const maxTotalValue = Math.max(...weeklyData.map(data => data.active + data.inactive), 1)

  if (isMobile) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{t('Overview All Clients')}</h3>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-b from-[#13A753] to-[#1E2120]"></div>
            <span className="text-xs text-gray-700">{t('Total Active')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F45C5C]"></div>
            <span className="text-xs text-gray-700">{t('Inactive')}</span>
          </div>
        </div>
        
        <div className="mt-4 h-[200px] relative">
          <div className="flex h-full">
            {/* Y-Axis Labels */}
            <div className="flex flex-col justify-between h-full pr-2">
              <span className="text-[10px] text-gray-500">{maxTotalValue}</span>
              <span className="text-[10px] text-gray-500">{Math.round(maxTotalValue * 0.5)}</span>
              <span className="text-[10px] text-gray-500">0</span>
            </div>
            {/* Bar Chart */}
            <div className="flex-1 relative">
              {/* Grid Lines */}
              <div className="absolute inset-0">
                {[0, 1, 2].map((i) => (
                  <div key={`grid-${i}`} className="absolute border-t border-gray-200 w-full" style={{ top: `${i * 50}%` }}></div>
                ))}
              </div>
              {/* Bars */}
              <div className="flex justify-around h-full items-end">
                {weeklyData.map((data, i) => (
                  <div key={`week-${i + 1}`} className="flex items-end space-x-1">
                    {/* Active clients bar */}
                    <div className="w-[22px] group relative">
                      <div
                        className={`w-full bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-t-md transition-all duration-500 ease-in-out transform hover:opacity-90 hover:-translate-y-1 ${
                          selectedWeek === data.week ? 'ring-2 ring-green-300 ring-opacity-50' : ''
                        }`}
                        style={{ 
                          height: `${(data.active / maxTotalValue) * 200}px`,
                          animationName: 'growUp',
                          animationDuration: '1s',
                          animationFillMode: 'both'
                        }}
                      ></div>
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md p-1 w-16 text-center z-10 text-[10px] pointer-events-none">
                        {data.active}
                      </div>
                    </div>
                    {/* Inactive clients bar */}
                    <div className="w-[22px] group relative">
                      <div
                        className={`w-full bg-[#F45C5C] rounded-t-md transition-all duration-500 ease-in-out transform hover:opacity-90 hover:-translate-y-1 ${
                          selectedWeek === data.week ? 'ring-2 ring-red-300 ring-opacity-50' : ''
                        }`}
                        style={{ 
                          height: `${(data.inactive / maxTotalValue) * 200}px`,
                          animationName: 'growUp',
                          animationDuration: '1s',
                          animationFillMode: 'both'
                        }}
                      ></div>
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md p-1 w-16 text-center z-10 text-[10px] pointer-events-none">
                        {data.inactive}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-around mt-2 text-[10px] text-gray-600">
            {weeklyData.map((data) => (
              <span key={data.week} className={`${selectedWeek === data.week ? 'font-bold text-[#13A753]' : ''}`}>
                {data.week}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-gray-800 capitalize flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 22H14C19 22 21 20 21 15V9C21 4 19 2 14 2H10C5 2 3 4 3 9V15C3 20 5 22 10 22Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.5 7.58008V6.43008C16.5 4.43008 15.37 3.58008 13.6 3.58008H10.4C8.63 3.58008 7.5 4.43008 7.5 6.43008V7.58008" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 14.0001V17.0001" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 9.5V14.5" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 17.4999V17.4999" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.5 9.5V9.5" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.5 12.5V17.5" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('Overview All Clients')}
        </h3>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-b from-[#13A753] to-[#1E2120]"></div>
            <span className="text-gray-700 text-sm">{t('Total Active')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F45C5C]"></div>
            <span className="text-gray-700 text-sm">{t('Inactive')}</span>
          </div>
        </div>
      </div>
      <div className="flex">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between h-[280px] pr-4 py-2">
          <span className="text-gray-500 text-sm">{maxTotalValue}</span>
          <span className="text-gray-500 text-sm">{Math.round(maxTotalValue * 0.8)}</span>
          <span className="text-gray-500 text-sm">{Math.round(maxTotalValue * 0.6)}</span>
          <span className="text-gray-500 text-sm">{Math.round(maxTotalValue * 0.4)}</span>
          <span className="text-gray-500 text-sm">{Math.round(maxTotalValue * 0.2)}</span>
          <span className="text-gray-500 text-sm">0</span>
        </div>
        {/* Chart Area */}
        <div className="flex-1 relative">
          {/* Grid Lines */}
          <div className="absolute inset-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`grid-${i}`} className="absolute border-t border-gray-200 w-full" style={{ 
                top: `${i * 20}%`,
                opacity: i === 0 ? 0.9 : i === 5 ? 0.9 : 0.5
              }}></div>
            ))}
          </div>
          {/* Bars */}
          <div className="flex justify-around h-full items-end">
            {weeklyData.map((data, i) => (
              <div key={`week-${i + 1}`} className="flex items-end space-x-4">
                {/* Active clients bar */}
                <div className="w-[60px] group relative">
                  <div
                    className={`w-full bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-t-md transition-all duration-300 ease-in-out shadow-md transform hover:scale-105 ${
                      selectedWeek === data.week ? 'ring-2 ring-green-300 ring-opacity-50' : ''
                    }`}
                    style={{ 
                      height: `${(data.active / maxTotalValue) * 280}px`,
                      animationName: 'growUp',
                      animationDuration: '1.2s',
                      animationFillMode: 'both',
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-14 left-1/2 transform -translate-x-1/2 bg-white shadow-xl rounded-lg p-2 w-28 text-center z-10 pointer-events-none">
                    <div className="text-xs font-semibold text-gray-800">{t('Active')}</div>
                    <div className="text-lg font-bold text-[#13A753]">{data.active}</div>
                  </div>
                </div>
                {/* Inactive clients bar */}
                <div className="w-[60px] group relative">
                  <div
                    className={`w-full bg-[#F45C5C] rounded-t-md transition-all duration-300 ease-in-out shadow-md transform hover:scale-105 ${
                      selectedWeek === data.week ? 'ring-2 ring-red-300 ring-opacity-50' : ''
                    }`}
                    style={{ 
                      height: `${(data.inactive / maxTotalValue) * 280}px`,
                      animationName: 'growUp',
                      animationDuration: '1.2s',
                      animationFillMode: 'both',
                      animationDelay: `${i * 0.1 + 0.2}s`
                    }}
                  ></div>
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-14 left-1/2 transform -translate-x-1/2 bg-white shadow-xl rounded-lg p-2 w-28 text-center z-10 pointer-events-none">
                    <div className="text-xs font-semibold text-gray-800">{t('Inactive')}</div>
                    <div className="text-lg font-bold text-[#F45C5C]">{data.inactive}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* X-Axis Labels */}
      <div className="flex justify-around ml-10 mt-5">
        {weeklyData.map((data) => (
          <div key={data.week} className="text-center">
            <span 
              className={`block px-5 py-2 rounded-lg text-sm transition-all duration-200 ${
                selectedWeek === data.week 
                  ? 'bg-[rgba(19,167,83,0.1)] text-[#13A753] font-semibold' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {data.week}
            </span>
          </div>
        ))}
      </div>
      
      {/* Custom Animation Keyframes */}
      <style jsx>{`
        @keyframes growUp {
          0% {
            height: 0;
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default ClientOverviewChart 