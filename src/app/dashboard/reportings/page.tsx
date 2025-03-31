'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { reportingsApi } from '@/services/fitTrackApi'
import { parseApiResponse } from '@/utils/config'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

// Define types for API responses
interface ApiReporting {
  id: string;
  trainee_id: string;
  trainee_name: string;
  report_date: string;
  meal_protein: string;
  meal_carbs: string;
  meal_fats: string;
  calories: string;
  created_at?: string;
  [key: string]: unknown;
}

export default function ReportingsPage() {
  const { t } = useTranslation()
  const [apiReportings, setApiReportings] = useState<ApiReporting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Fetch reportings from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch reportings
        const reportingsResponse = await reportingsApi.list(searchTerm)
        
        // Parse reportings using helper function
        const reportings = parseApiResponse(reportingsResponse.data);
        
        if (reportings.length > 0) {
          setApiReportings(reportings as ApiReporting[]);
        } else {
          console.warn('Could not extract reportings from response:', reportingsResponse.data);
          throw new Error('Unable to extract reporting data from API response');
        }
      } catch (err) {
        console.error('Error fetching reportings:', err);
        setError('Failed to load reportings from API. Please check your connection and try again.');
        setApiReportings([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [searchTerm]);
  
  // Format date: convert YYYY-MM-DD to local format
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  // Define page icon for reportings page
  const reportingsPageIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 10H5C3.9 10 3 9.1 3 8V5C3 3.9 3.9 3 5 3H8C9.1 3 10 3.9 10 5V8C10 9.1 9.1 10 8 10Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 10H16C14.9 10 14 9.1 14 8V5C14 3.9 14.9 3 16 3H19C20.1 3 21 3.9 21 5V8C21 9.1 20.1 10 19 10Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 21H5C3.9 21 3 20.1 3 19V16C3 14.9 3.9 14 5 14H8C9.1 14 10 14.9 10 16V19C10 20.1 9.1 21 8 21Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 15.55H15" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 19.55H15" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  
  return (
    <DashboardLayout
      pageTitle={t('reportings.title') || 'דיווחים'}
      pageIcon={reportingsPageIcon}
    >
      {/* Search bar */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-6 hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-center">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 17.5L12.5001 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder={t('reportings.searchReportings') || 'חיפוש דיווחים'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#13A753]"></div>
        </div>
      )}
      
      {/* Reportings table */}
      {!loading && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('reportings.dateTime') || 'תאריך/שעה'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('reportings.traineeName') || 'שם מתאמן'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('reportings.protein') || 'חלבון'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('reportings.carbs') || 'פחמימות'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('reportings.fats') || 'שומנים'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('reportings.calories') || 'קלוריות'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiReportings.length > 0 ? (
                  apiReportings.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(report.report_date || report.created_at || '')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.trainee_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.meal_protein}g
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.meal_carbs}g
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.meal_fats}g
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.calories}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      {t('reportings.noReportingsFound') || 'לא נמצאו דיווחים'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
} 