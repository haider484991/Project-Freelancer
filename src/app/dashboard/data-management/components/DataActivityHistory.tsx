'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

interface DataActivity {
  id: string
  type: string
  filename: string
  status: string
  date: string
}

interface DataActivityHistoryProps {
  dataActivities: DataActivity[]
}

const DataActivityHistory: React.FC<DataActivityHistoryProps> = ({ dataActivities }) => {
  const { t } = useTranslation()

  return (
    <div className="bg-white rounded-[30px] p-6 shadow-md border border-gray-100 mb-6">
      <h3 className="text-[18px] font-bold text-[#1E1E1E] mb-4">{t('Data Activity History')}</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E0E0E0]">
              <th className="px-4 py-3 text-left text-sm text-[#636363]">{t('Type')}</th>
              <th className="px-4 py-3 text-left text-sm text-[#636363]">{t('Filename')}</th>
              <th className="px-4 py-3 text-left text-sm text-[#636363]">{t('Status')}</th>
              <th className="px-4 py-3 text-left text-sm text-[#636363]">{t('Date')}</th>
            </tr>
          </thead>
          <tbody>
            {dataActivities.map(activity => (
              <tr key={activity.id} className="border-b border-[#E0E0E0] hover:bg-[#F9F9F9]">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${activity.type === 'Import' ? 'bg-[rgba(19,167,83,0.1)]' : 'bg-[rgba(244,92,92,0.1)]'}`}>
                      {activity.type === 'Import' ? (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.16675 9.91671V11.0834C1.16675 11.3926 1.29212 11.6892 1.51404 11.9111C1.73596 12.133 2.03256 12.2584 2.34175 12.2584H11.6667C11.9759 12.2584 12.2725 12.133 12.4945 11.9111C12.7164 11.6892 12.8417 11.3926 12.8417 11.0834V9.91671" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M3.5 5.83337L7 2.33337L10.5 5.83337" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M7 2.33337V9.33337" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.16675 9.91663V11.0833C1.16675 11.3925 1.29212 11.6891 1.51404 11.911C1.73596 12.1329 2.03256 12.2583 2.34175 12.2583H11.6667C11.9759 12.2583 12.2725 12.1329 12.4945 11.911C12.7164 11.6891 12.8417 11.3925 12.8417 11.0833V9.91663" stroke="#F45C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#F45C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M7 8.75V1.75" stroke="#F45C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm text-[#1E1E1E]">{activity.type}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[#1E1E1E]">{activity.filename}</td>
                <td className="px-4 py-3">
                  <span 
                    className={`
                      text-sm py-1 px-3 rounded-full
                      ${activity.status === 'success' ? 'bg-[rgba(19,167,83,0.1)] text-[#13A753]' : 
                        activity.status === 'pending' ? 'bg-[rgba(255,193,7,0.1)] text-[#FFC107]' : 
                          'bg-[rgba(244,67,54,0.1)] text-[#F44336]'}
                    `}
                  >
                    {t(activity.status === 'success' ? 'Successful' : 
                        activity.status === 'pending' ? 'Pending' : 'Failed')}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[#1E1E1E]">{activity.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="lg:hidden space-y-4 mt-4">
        {dataActivities.map(activity => (
          <div key={activity.id} className="bg-[#F9F9F9] rounded-[15px] p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${activity.type === 'Import' ? 'bg-[rgba(19,167,83,0.1)]' : 'bg-[rgba(244,92,92,0.1)]'}`}>
                  {activity.type === 'Import' ? (
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.16675 9.91671V11.0834C1.16675 11.3926 1.29212 11.6892 1.51404 11.9111C1.73596 12.133 2.03256 12.2584 2.34175 12.2584H11.6667C11.9759 12.2584 12.2725 12.133 12.4945 11.9111C12.7164 11.6892 12.8417 11.3926 12.8417 11.0834V9.91671" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3.5 5.83337L7 2.33337L10.5 5.83337" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7 2.33337V9.33337" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.16675 9.91663V11.0833C1.16675 11.3925 1.29212 11.6891 1.51404 11.911C1.73596 12.1329 2.03256 12.2583 2.34175 12.2583H11.6667C11.9759 12.2583 12.2725 12.1329 12.4945 11.911C12.7164 11.6891 12.8417 11.3925 12.8417 11.0833V9.91663" stroke="#F45C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#F45C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7 8.75V1.75" stroke="#F45C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="text-sm font-medium text-[#1E1E1E]">{activity.type}</span>
              </div>
              <span className="text-xs text-[#636363]">{activity.date}</span>
            </div>
            <p className="text-sm text-[#1E1E1E] mb-2">{activity.filename}</p>
            <div>
              <span 
                className={`
                  text-xs py-1 px-2 rounded-full
                  ${activity.status === 'success' ? 'bg-[rgba(19,167,83,0.1)] text-[#13A753]' : 
                    activity.status === 'pending' ? 'bg-[rgba(255,193,7,0.1)] text-[#FFC107]' : 
                      'bg-[rgba(244,67,54,0.1)] text-[#F44336]'}
                `}
              >
                {t(activity.status === 'success' ? 'Successful' : 
                    activity.status === 'pending' ? 'Pending' : 'Failed')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DataActivityHistory 