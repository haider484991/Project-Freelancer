'use client'

import React from 'react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

interface Client {
  id: string
  name: string
  image?: string
  status: string
  compliance: string
}

interface InactiveClientsWidgetProps {
  inactiveClients: Client[]
  isMobile?: boolean
}

const InactiveClientsWidget: React.FC<InactiveClientsWidgetProps> = ({
  inactiveClients,
  isMobile = false
}) => {
  const { t } = useTranslation()

  if (isMobile) {
    return (
      <div className="space-y-2">
        {inactiveClients.length > 0 ? (
          inactiveClients.slice(0, 3).map((client, i) => (
            <div
              key={`inactive-mobile-${i}`}
              className="flex justify-between items-center bg-[rgba(252,0,0,0.1)] rounded-[10px] py-2 px-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden">
                  <Image
                    src={client.image || "/images/profile.jpg"}
                    alt="Profile"
                    width={28}
                    height={28}
                    className="object-cover"
                  />
                </div>
                <span className="text-[#1E1E1E] font-medium text-[13px]">{client.name}</span>
              </div>
              <span className="text-[#D40101] font-medium text-[11px]">
                {Math.floor(Math.random() * 10) + 5} {t('days')}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-3 text-gray-500 text-[12px]">{t('No inactive clients')}</div>
        )}

        {inactiveClients.length > 3 && (
          <div className="text-center mt-2">
            <button className="text-[12px] text-primary font-medium">
              {t('View All')}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[30px] p-6 shadow-md border border-gray-100 mb-6">
      <h3 className="text-[18px] font-bold text-[#1E1E1E] mb-4">{t('Inactive Clients')}</h3>
      
      {inactiveClients.length > 0 ? (
        <div className="space-y-3">
          {inactiveClients.slice(0, 5).map((client, i) => (
            <div
              key={`inactive-${i}`}
              className="flex justify-between items-center bg-[rgba(252,0,0,0.1)] rounded-[20px] py-3 px-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={client.image || "/images/profile.jpg"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <span className="text-[#1E1E1E] font-medium">{client.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#D40101] font-medium">
                  {Math.floor(Math.random() * 10) + 5} {t('days inactive')}
                </span>
                <button className="bg-white rounded-full p-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.33341 13.3333C10.6487 13.3333 13.3334 10.6486 13.3334 7.33329C13.3334 4.01796 10.6487 1.33329 7.33341 1.33329C4.01808 1.33329 1.33341 4.01796 1.33341 7.33329C1.33341 10.6486 4.01808 13.3333 7.33341 13.3333Z" stroke="#D40101" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.6667 14.6667L12 12" stroke="#D40101" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
          
          {inactiveClients.length > 5 && (
            <div className="text-center mt-3">
              <button className="text-primary text-sm font-semibold">
                {t('View All Inactive Clients')}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-[#F3F7F3] rounded-[20px]">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.75 11.9999L10.58 14.8299L16.25 9.16992" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-[#1E1E1E] font-medium mt-2">{t('No inactive clients at the moment')}</p>
          <p className="text-[#636363] text-sm">{t('All your clients are actively engaged')}</p>
        </div>
      )}
    </div>
  )
}

export default InactiveClientsWidget 