'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

interface ComplianceRateWidgetProps {
  complianceRate: number
  selectedWeek: string
  isMobile?: boolean
}

const ComplianceRateWidget: React.FC<ComplianceRateWidgetProps> = ({
  complianceRate,
  selectedWeek,
  isMobile = false
}) => {
  const { t } = useTranslation()

  if (isMobile) {
    return (
      <div className="flex justify-center mt-3">
        <div className="relative w-[100px] h-[100px]">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="white"></circle>
            <circle
              cx="18" cy="18" r="16"
              fill="none"
              stroke="#13A753"
              strokeWidth="3"
              strokeDasharray="100.5"
              strokeDashoffset={100.5 - (complianceRate / 100) * 100.5}
              transform="rotate(-90 18 18)"
            ></circle>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] text-[#636363]">{t('Rate')}</span>
            <span className="text-[18px] font-bold text-[#1E1E1E]">{complianceRate}%</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[30px] p-6 shadow-md border border-gray-100 mb-6">
      <h3 className="text-[18px] font-bold text-[#1E1E1E] mb-5">{t('Compliance Rate')}</h3>
      
      <div className="flex justify-center items-center">
        <div className="relative w-[180px] h-[180px]">
          {/* Background Circle */}
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="white" stroke="#F3F7F3" strokeWidth="3.5"></circle>
            {/* Progress Circle */}
            <circle
              cx="18" cy="18" r="16"
              fill="none"
              stroke="url(#compliance-gradient)"
              strokeWidth="3.5"
              strokeDasharray="100.5"
              strokeDashoffset={100.5 - (complianceRate / 100) * 100.5}
              transform="rotate(-90 18 18)"
            ></circle>
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="compliance-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#13A753" />
                <stop offset="100%" stopColor="#1E2120" />
              </linearGradient>
            </defs>
            
            {/* Small circle indicators at 0%, 25%, 50%, 75%, 100% */}
            <circle cx="18" cy="2" r="1.5" fill="#DADADA" />
            <circle cx="32.38" cy="12" r="1.5" fill="#DADADA" />
            <circle cx="28.14" cy="28.14" r="1.5" fill="#DADADA" />
            <circle cx="7.86" cy="28.14" r="1.5" fill="#DADADA" />
            <circle cx="3.62" cy="12" r="1.5" fill="#DADADA" />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[15px] text-[#636363]">{t('Rate')}</span>
            <span className="text-[32px] font-bold text-[#1E1E1E]">{complianceRate}%</span>
            <span className="text-[13px] text-[#636363]">{t('For')} {selectedWeek}</span>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-5 bg-[#F3F7F3] rounded-[15px] p-4 flex items-center gap-3">
        <div className="bg-white rounded-full p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z" fill="#13A753"/>
            <path d="M11 11H13V17H11V11ZM11 7H13V9H11V7Z" fill="#13A753"/>
          </svg>
        </div>
        <div>
          <p className="text-[13px] text-[#636363]">
            {complianceRate < 50 
              ? t('Compliance is low. Proactive outreach needed.')
              : complianceRate < 80
                ? t('Moderate compliance. Consider routine check-ins.')
                : t('Great compliance rate! Keep up the good work.')
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default ComplianceRateWidget 