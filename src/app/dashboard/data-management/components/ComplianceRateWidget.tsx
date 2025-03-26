'use client'

import React, { useEffect, useState } from 'react'
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
  const [animatedRate, setAnimatedRate] = useState(0)
  
  // Animate the compliance rate on mount and when it changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedRate(0)
      let start = 0
      const duration = 1500
      const end = complianceRate
      const increment = end / (duration / 16)
      const startTime = performance.now()
      
      const animateValue = (timestamp: number) => {
        const runtime = timestamp - startTime
        
        start = Math.min(start + increment, end)
        setAnimatedRate(Math.floor(start))
        
        if (runtime < duration) {
          requestAnimationFrame(animateValue)
        } else {
          setAnimatedRate(end)
        }
      }
      
      requestAnimationFrame(animateValue)
    }, 200)
    
    return () => clearTimeout(timer)
  }, [complianceRate])
  
  // Determine color based on compliance rate
  const getColor = () => {
    if (complianceRate >= 75) return '#13A753' // Green
    if (complianceRate >= 50) return '#FFA500' // Orange
    return '#F45C5C' // Red
  }
  
  // Get message based on compliance rate
  const getMessage = () => {
    if (complianceRate < 50) 
      return t('Compliance is low. Proactive outreach needed.')
    if (complianceRate < 80)
      return t('Moderate compliance. Consider routine check-ins.')
    return t('Great compliance rate! Keep up the good work.')
  }

  if (isMobile) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{t('Compliance Rate')}</h3>
        
        <div className="flex justify-center items-center">
          <div className="relative w-[120px] h-[120px]">
            {/* Background Circle */}
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="white" stroke="#F3F7F3" strokeWidth="3.5"></circle>
              {/* Progress Circle */}
              <circle
                cx="18" cy="18" r="16"
                fill="none"
                stroke={getColor()}
                strokeWidth="3.5"
                strokeDasharray="100.5"
                strokeDashoffset={100.5 - (animatedRate / 100) * 100.5}
                transform="rotate(-90 18 18)"
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
              ></circle>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[12px] text-gray-500">{t('Rate')}</span>
              <span className="text-[22px] font-bold text-gray-800">{animatedRate}%</span>
              <span className="text-[10px] text-gray-500">{selectedWeek}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 bg-[#F3F7F3] rounded-xl p-3 flex items-center gap-2">
          <div className="bg-white rounded-full p-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z" fill={getColor()}/>
              <path d="M11 11H13V17H11V11ZM11 7H13V9H11V7Z" fill={getColor()}/>
            </svg>
          </div>
          <p className="text-[11px] text-gray-600">
            {getMessage()}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.55 21.67C18.84 20.54 22 16.64 22 12C22 6.48 17.56 2 12 2C5.33 2 2 7.56 2 7.56M2 7.56V3M2 7.56H4.01H6.44" stroke={getColor()} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12C2 17.52 6.48 22 12 22" stroke={getColor()} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
        </svg>
        {t('Compliance Rate')}
      </h3>
      
      <div className="flex flex-col md:flex-row justify-around items-center mb-4">
        <div className="relative w-[180px] h-[180px] flex-shrink-0">
          {/* Background Circle */}
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="white" stroke="#F3F7F3" strokeWidth="3.5"></circle>
            {/* Progress Circle with gradient */}
            <circle
              cx="18" cy="18" r="16"
              fill="none"
              stroke={`url(#compliance-gradient-${complianceRate >= 75 ? 'green' : complianceRate >= 50 ? 'orange' : 'red'})`}
              strokeWidth="3.5"
              strokeDasharray="100.5"
              strokeDashoffset={100.5 - (animatedRate / 100) * 100.5}
              transform="rotate(-90 18 18)"
              style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            ></circle>
            
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="compliance-gradient-green" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#13A753" />
                <stop offset="100%" stopColor="#0C7A3D" />
              </linearGradient>
              <linearGradient id="compliance-gradient-orange" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFA500" />
                <stop offset="100%" stopColor="#FF7800" />
              </linearGradient>
              <linearGradient id="compliance-gradient-red" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F45C5C" />
                <stop offset="100%" stopColor="#D14141" />
              </linearGradient>
            </defs>
            
            {/* Small circle indicators around the chart */}
            <circle cx="18" cy="2" r="1.5" fill={complianceRate >= 95 ? getColor() : "#DADADA"} className="transition-colors duration-500" />
            <circle cx="27.5" cy="6.5" r="1.5" fill={complianceRate >= 75 ? getColor() : "#DADADA"} className="transition-colors duration-500" />
            <circle cx="32.38" cy="18" r="1.5" fill={complianceRate >= 50 ? getColor() : "#DADADA"} className="transition-colors duration-500" />
            <circle cx="27.5" cy="29.5" r="1.5" fill={complianceRate >= 25 ? getColor() : "#DADADA"} className="transition-colors duration-500" />
            <circle cx="18" cy="34" r="1.5" fill={complianceRate > 0 ? getColor() : "#DADADA"} className="transition-colors duration-500" />
            <circle cx="8.5" cy="29.5" r="1.5" fill={complianceRate > 0 ? getColor() : "#DADADA"} className="transition-colors duration-500" />
            <circle cx="3.62" cy="18" r="1.5" fill={complianceRate > 0 ? getColor() : "#DADADA"} className="transition-colors duration-500" />
            <circle cx="8.5" cy="6.5" r="1.5" fill={complianceRate > 0 ? getColor() : "#DADADA"} className="transition-colors duration-500" />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[15px] text-gray-500">{t('Rate')}</span>
            <span className="text-[36px] font-bold text-gray-800" style={{ color: getColor() }}>{animatedRate}%</span>
            <span className="text-[13px] text-gray-500">{t('For')} {selectedWeek}</span>
          </div>
        </div>
        
        <div className="md:ml-6 mt-6 md:mt-0 flex-1">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">{t('Compliance Status')}</h4>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${complianceRate >= 75 ? 'bg-[#13A753]' : 'bg-gray-300'}`}></div>
              <span className={`text-sm ${complianceRate >= 75 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                {t('Excellent')} (75-100%)
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${complianceRate >= 50 && complianceRate < 75 ? 'bg-[#FFA500]' : 'bg-gray-300'}`}></div>
              <span className={`text-sm ${complianceRate >= 50 && complianceRate < 75 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                {t('Good')} (50-74%)
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${complianceRate < 50 ? 'bg-[#F45C5C]' : 'bg-gray-300'}`}></div>
              <span className={`text-sm ${complianceRate < 50 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                {t('Needs Improvement')} (0-49%)
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommendation Box */}
      <div className="mt-6 bg-[#F3F7F3] rounded-xl p-4 flex items-start gap-3 border-l-4" style={{ borderColor: getColor() }}>
        <div className="bg-white rounded-full p-2 mt-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20Z" fill={getColor()}/>
            <path d="M11 11H13V17H11V11ZM11 7H13V9H11V7Z" fill={getColor()}/>
          </svg>
        </div>
        <div>
          <h5 className="font-medium text-gray-800 mb-1">{t('Recommendation')}</h5>
          <p className="text-sm text-gray-700">
            {getMessage()}
          </p>
          <button className="mt-2 text-sm font-medium" style={{ color: getColor() }}>
            {t('View Detailed Report')} →
          </button>
        </div>
      </div>
    </div>
  )
}

export default ComplianceRateWidget 