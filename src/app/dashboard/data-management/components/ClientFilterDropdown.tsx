'use client'

import React, { useState } from 'react'

interface ClientFilterDropdownProps {
  selectedClientFilter: string
  onFilterChange: (filter: string) => void
  isMobile?: boolean
}

const ClientFilterDropdown: React.FC<ClientFilterDropdownProps> = ({
  selectedClientFilter,
  onFilterChange,
  isMobile = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const filterOptions = ['All Clients', 'Active Clients', 'Inactive Clients']

  if (isMobile) {
    return (
      <div className="relative">
        <div
          className="flex items-center gap-1 bg-[rgba(16,106,2,0.1)] rounded-[20px] py-2 px-3 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-[#545454] text-xs font-normal">{selectedClientFilter}</span>
          <svg
            width="8"
            height="5"
            viewBox="0 0 8 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          >
            <path d="M1 1L4 4L7 1" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg z-10 py-2 min-w-[120px]">
            {filterOptions.map(option => (
              <div
                key={option}
                className={`px-3 py-1 text-xs hover:bg-[#F3F7F3] cursor-pointer ${selectedClientFilter === option ? 'bg-[#F3F7F3] text-primary' : ''}`}
                onClick={() => {
                  onFilterChange(option)
                  setIsOpen(false)
                }}
              >
                {option}
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
        className="flex items-center gap-2 bg-[rgba(16,106,2,0.1)] rounded-[43px] py-3 px-6 cursor-pointer relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[#545454] text-sm font-normal">{selectedClientFilter}</span>
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
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg z-10 py-2 min-w-[150px]">
          {filterOptions.map(option => (
            <div
              key={option}
              className={`px-4 py-2 hover:bg-[#F3F7F3] cursor-pointer ${selectedClientFilter === option ? 'bg-[#F3F7F3] text-primary' : ''}`}
              onClick={() => {
                onFilterChange(option)
                setIsOpen(false)
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ClientFilterDropdown 