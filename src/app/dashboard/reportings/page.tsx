'use client'

import { useTranslation } from 'react-i18next'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { formatDate } from '@/utils/dateFormat'
import { reportingsApi } from '@/services/fitTrackApi'
import { parseApiResponse } from '@/utils/config'

// Data structures for API responses
interface ReportItem {
  id?: string;
  report_id?: string;
  name?: string;
  report_name?: string;
  meal_name?: string;
  title?: string;
  date?: string;
  on_date?: string;
  report_date?: string;
  type?: string;
  report_type?: string;
  meal_type?: string;
  status?: string;
  protein?: number | string;
  meal_protein?: number | string;
  carbs?: number | string;
  meal_carbs?: number | string;
  fat?: number | string;
  meal_fats?: number | string;
  trainee_id?: string;
  trainee_name?: string;
  details?: {
    protein?: number | string;
    carbs?: number | string;
    fat?: number | string;
  };
  nutritional?: {
    protein?: number | string;
    carbs?: number | string;
    fat?: number | string;
  };
}

interface NestedResponse {
  reports?: ReportItem[];
  items?: ReportItem[];
  data?: ReportItem[];
  list?: ReportItem[];
  [key: string]: unknown;
}

interface Report {
  id: string;
  name: string;
  date: string;
  type: string;
  status: 'completed' | 'pending' | 'in_progress';
  protein?: number;
  carbs?: number;
  fat?: number;
  trainee_id?: string;
}

// Modify the date formatting function to better handle potential date issues
const formatDateTimeCustom = (dateString: string) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return '-';
    
    // Format as dd-mm-yyyy hh:ii
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return dateString || '-'; // Return original string if parsing fails
  }
};

export default function ReportingsPage() {
  const { t, i18n } = useTranslation()
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  
  useEffect(() => {
    async function fetchReports() {
      setIsLoading(true)
      setError(null)
      
      try {
        // Check if the API service is available
        if (!reportingsApi) {
          setError('API service not available')
          setIsLoading(false)
          return
        }
        
        // Use the reportingsApi service instead of direct fetch
        const response = await reportingsApi.list(debouncedSearchTerm)
        
        // Use the shared parsing logic for API responses
        const reportData = parseApiResponse<unknown>(response.data)
        console.log('Raw API response:', response.data)
        console.log('Parsed API data:', reportData)
        
        // Check for different possible data structures
        let dataToProcess: ReportItem[] = [];
        
        // Handle different response formats
        if (Array.isArray(reportData)) {
          // Direct array of report items
          if (reportData.length > 0 && 
              ((reportData[0] as Record<string, unknown>).id !== undefined || 
               (reportData[0] as Record<string, unknown>).name !== undefined || 
               (reportData[0] as Record<string, unknown>).date !== undefined)) {
            dataToProcess = reportData as ReportItem[];
          } 
          // Nested structure with a reports/items/data/list property
          else if (reportData.length > 0) {
            const firstItem = reportData[0] as Record<string, unknown>;
            
            // Check for nested arrays with known property names
            const possibleArrayProps = ['reports', 'items', 'data', 'list'];
            for (const prop of possibleArrayProps) {
              if (Array.isArray(firstItem[prop])) {
                console.log(`Found nested ${prop} array`);
                dataToProcess = firstItem[prop] as ReportItem[];
                break;
              }
            }
          }
        }
        
        if (dataToProcess.length > 0) {
          // Map API response to our Report interface
          const formattedReports: Report[] = dataToProcess.map((report: ReportItem) => {
            console.log('Processing report item:', report)
            
            // Handle different possible field names in the API response
            const reportItem = {
              id: report.id || report.report_id || '',
              name: report.name || report.report_name || report.meal_name || report.title || 'Untitled Report',
              date: report.date || report.on_date || report.report_date || new Date().toISOString().split('T')[0],
              type: report.type || report.report_type || report.meal_type || 'Daily Meal',
            // Ensure status is one of our valid enum values
            status: (report.status === 'completed' || report.status === 'pending' || report.status === 'in_progress') 
              ? report.status as 'completed' | 'pending' | 'in_progress'
              : 'pending', // Default fallback
              protein: Number(report.protein || report.meal_protein || (report.details?.protein) || (report.nutritional?.protein)) || undefined,
              carbs: Number(report.carbs || report.meal_carbs || (report.details?.carbs) || (report.nutritional?.carbs)) || undefined,
              fat: Number(report.fat || report.meal_fats || (report.details?.fat) || (report.nutritional?.fat)) || undefined,
              trainee_id: report.trainee_id || ''
            }
            
            console.log('Formatted report item:', reportItem)
            return reportItem
          })
          
          console.log('Formatted reports:', formattedReports)
          
          setReports(formattedReports)
        } else {
          setError('Failed to fetch reports')
          setReports([])
        }
      } catch (error) {
        console.error('Error fetching reports:', error)
        setError('An error occurred while fetching reports')
        setReports([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchReports()
  }, [debouncedSearchTerm])
  
  return (
    <DashboardLayout pageTitle={t('reportings.title', 'Reportings')}>
      <div className="px-8 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <h1 className="text-2xl font-bold">{t('reportings.title', 'Reportings')}</h1>
          
          {/* Search bar */}
          <div className="mt-4 lg:mt-0 w-full lg:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder={t('common.search', 'Search reports...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full lg:w-[300px] rounded-25 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="absolute left-3 top-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-25 p-8 shadow-md text-center">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t('common.error', 'Error')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <button 
              onClick={() => setSearchTerm('')} 
              className="mt-4 px-4 py-2 bg-primary text-white rounded-25 hover:bg-primary-dark transition-colors"
            >
              {t('common.try_again', 'Try Again')}
            </button>
          </div>
        ) : reports.length > 0 ? (
          <div className="bg-white rounded-25 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-[15%] px-6 py-4 text-start text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t('reportings.date', 'Date')}
                    </th>
                    <th className="w-[15%] px-6 py-4 text-start text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t('reportings.type', 'Type')}
                    </th>
                    {/* Nutritional values with (g) in header */}
                    <th className="w-[15%] px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t('reportings.protein', 'Protein (g)')}
                    </th>
                    <th className="w-[15%] px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t('reportings.carbs', 'Carbs (g)')}
                    </th>
                    <th className="w-[15%] px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t('reportings.fat', 'Fat (g)')}
                    </th>
                    <th className="w-[25%] px-6 py-4 text-end text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t('reportings.actions', 'Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="w-[15%] px-6 py-4 whitespace-nowrap align-top">
                        <div className="text-sm text-gray-500">{formatDateTimeCustom(report.date)}</div>
                      </td>
                      <td className="w-[15%] px-6 py-4 whitespace-nowrap align-top">
                        <div className="text-sm text-gray-500">{report.type}</div>
                      </td>
                      <td className="w-[15%] px-6 py-4 whitespace-nowrap text-center align-top">
                        <div className="text-sm text-gray-500">
                          {report.protein !== undefined ? report.protein : '-'}
                        </div>
                      </td>
                      <td className="w-[15%] px-6 py-4 whitespace-nowrap text-center align-top">
                        <div className="text-sm text-gray-500">
                          {report.carbs !== undefined ? report.carbs : '-'}
                        </div>
                      </td>
                      <td className="w-[15%] px-6 py-4 whitespace-nowrap text-center align-top">
                        <div className="text-sm text-gray-500">
                          {report.fat !== undefined ? report.fat : '-'}
                        </div>
                      </td>
                      <td className="w-[25%] px-6 py-4 whitespace-nowrap text-end text-sm font-medium align-top">
                        <div className={`flex ${i18n.dir() === 'rtl' ? 'justify-start gap-2 space-x-reverse' : 'justify-end gap-2'}`}>
                          <button 
                            onClick={() => window.location.href = `/dashboard/reportings/${report.id}`}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label={t('reportings.view', 'View')}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42001 13.98 8.42001 12C8.42001 10.02 10.02 8.42001 12 8.42001C13.98 8.42001 15.58 10.02 15.58 12Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.71997 12 3.71997C8.46997 3.71997 5.17997 5.79997 2.88997 9.39997C1.98997 10.81 1.98997 13.18 2.88997 14.59C5.17997 18.19 8.46997 20.27 12 20.27Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-25 p-8 shadow-md text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t('reportings.no_reports', 'No reports found')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 
                t('reportings.no_search_results', 'No reports match your search criteria.') : 
                t('reportings.no_reports_description', 'Get started by creating a new report or try a different search.')}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 