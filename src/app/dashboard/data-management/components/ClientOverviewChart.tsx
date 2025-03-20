'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

interface WeeklyData {
  week: string
  active: number
  inactive: number
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
      <div className="mt-4 h-[200px] relative">
        <div className="flex h-full">
          {/* Y-Axis Labels */}
          <div className="flex flex-col justify-between h-full pr-2">
            <span className="text-[10px] text-[#636363]">{maxTotalValue}</span>
            <span className="text-[10px] text-[#636363]">{Math.round(maxTotalValue * 0.5)}</span>
            <span className="text-[10px] text-[#636363]">0</span>
          </div>
          {/* Bar Chart */}
          <div className="flex-1 relative">
            {/* Grid Lines */}
            <div className="absolute inset-0">
              {[0, 1, 2].map((i) => (
                <div key={`grid-${i}`} className="absolute border-t border-[rgba(15,105,2,0.2)] w-full" style={{ top: `${i * 50}%` }}></div>
              ))}
            </div>
            {/* Bars */}
            <div className="flex justify-around h-full items-end">
              {weeklyData.map((data, i) => (
                <div key={`week-${i + 1}`} className="flex items-end space-x-1">
                  {/* Active clients bar */}
                  <div className="w-[24px] group">
                    <div
                      className="w-full bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-t-md"
                      style={{ height: `${(data.active / maxTotalValue) * 200}px` }}
                    ></div>
                  </div>
                  {/* Inactive clients bar */}
                  <div className="w-[24px] group">
                    <div
                      className="w-full bg-[#F45C5C] rounded-t-md"
                      style={{ height: `${(data.inactive / maxTotalValue) * 200}px` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-around mt-2 text-[10px] text-[#636363]">
          {weeklyData.map((data) => (
            <span key={data.week}>{data.week}</span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 bg-white rounded-[30px] p-6 shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[18px] font-bold text-[#1E1E1E] capitalize">{t('Overview All Clients')}</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-b from-[#13A753] to-[#1E2120]"></div>
            <span className="text-[#2B180A] text-sm">{t('Total Active')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F45C5C]"></div>
            <span className="text-[#2B180A] text-sm">{t('Inactive')}</span>
          </div>
        </div>
      </div>
      <div className="flex">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between h-[250px] pr-4 py-2">
          <span className="text-[#636363] text-sm">{maxTotalValue}</span>
          <span className="text-[#636363] text-sm">{Math.round(maxTotalValue * 0.8)}</span>
          <span className="text-[#636363] text-sm">{Math.round(maxTotalValue * 0.6)}</span>
          <span className="text-[#636363] text-sm">{Math.round(maxTotalValue * 0.4)}</span>
          <span className="text-[#636363] text-sm">{Math.round(maxTotalValue * 0.2)}</span>
          <span className="text-[#636363] text-sm">0</span>
        </div>
        {/* Chart Area */}
        <div className="flex-1 relative">
          {/* Grid Lines */}
          <div className="absolute inset-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`grid-${i}`} className="absolute border-t border-[rgba(15,105,2,0.2)] w-full" style={{ top: `${i * 20}%` }}></div>
            ))}
          </div>
          {/* Bars */}
          <div className="flex justify-around h-full items-end">
            {weeklyData.map((data, i) => (
              <div key={`week-${i + 1}`} className="flex items-end space-x-4">
                {/* Active clients bar */}
                <div className="w-[60px] group relative">
                  <div
                    className="w-full bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-t-md"
                    style={{ height: `${(data.active / maxTotalValue) * 250}px` }}
                  ></div>
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md p-2 w-20 text-center z-10">
                    <p className="text-[#1E1E1E] text-xs">{t('Active')}: {data.active}</p>
                  </div>
                </div>
                {/* Inactive clients bar */}
                <div className="w-[60px] group relative">
                  <div
                    className="w-full bg-[#F45C5C] rounded-t-md"
                    style={{ height: `${(data.inactive / maxTotalValue) * 250}px` }}
                  ></div>
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md p-2 w-20 text-center z-10">
                    <p className="text-[#1E1E1E] text-xs">{t('Inactive')}: {data.inactive}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* X-Axis Labels */}
      <div className="flex justify-around ml-10 mt-3">
        {weeklyData.map((data) => (
          <div key={data.week} className="text-center">
            <span className={`block px-5 py-2 rounded-[10px] text-sm ${selectedWeek === data.week ? 'bg-[rgba(19,167,83,0.1)] text-[#13A753] font-semibold' : 'text-[#636363]'}`}>
              {data.week}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClientOverviewChart 