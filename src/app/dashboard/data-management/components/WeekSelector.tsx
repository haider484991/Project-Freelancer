'use client'

import React, { useState } from 'react'

interface WeekSelectorProps {
  selectedWeek: string
  onWeekChange: (week: string) => void
  isMobile?: boolean
}

const WeekSelector: React.FC<WeekSelectorProps> = ({
  selectedWeek,
  onWeekChange,
  isMobile = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const availableWeeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4']

  if (isMobile) {
    return (
      <div className="relative">
        <div
          className="flex items-center bg-[#F3F7F3] rounded-[60px] py-1 px-2 gap-1 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-xs font-semibold text-primary">{selectedWeek}</span>
          <svg
            width="8"
            height="5"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          >
            <path d="M1 1L5 5L9 1" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg z-10 py-2 min-w-[100px]">
            {availableWeeks.map(week => (
              <div
                key={week}
                className={`px-3 py-1 text-xs hover:bg-[#F3F7F3] cursor-pointer ${selectedWeek === week ? 'bg-[#F3F7F3] text-primary' : ''}`}
                onClick={() => {
                  onWeekChange(week)
                  setIsOpen(false)
                }}
              >
                {week}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        className="flex items-center bg-[#F3F7F3] rounded-[60px] py-2 px-4 gap-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-semibold text-primary">{selectedWeek}</span>
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        >
          <path d="M1 1L5 5L9 1" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg z-10 py-2 min-w-[120px]">
          {availableWeeks.map(week => (
            <div
              key={week}
              className={`px-4 py-2 hover:bg-[#F3F7F3] cursor-pointer ${selectedWeek === week ? 'bg-[#F3F7F3] text-primary' : ''}`}
              onClick={() => {
                onWeekChange(week)
                setIsOpen(false)
              }}
            >
              {week}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WeekSelector 