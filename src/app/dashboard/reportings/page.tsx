'use client'

import { useTranslation } from 'react-i18next'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { formatDate } from '@/utils/dateFormat'

interface Report {
  id: string;
  name: string;
  date: string;
  type: string;
  status: 'completed' | 'pending' | 'in_progress';
  protein?: number; // Values now expected to be numbers only
  carbs?: number;
  fat?: number;
}

// API response interface
interface ApiResponse {
  success: boolean;
  message?: string;
  reports?: {
    id: string;
    name: string;
    date: string;
    type: string;
    status: string;
    protein?: number;
    carbs?: number;
    fat?: number;
  }[];
}

export default function ReportingsPage() {
  const { t } = useTranslation()
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
        const response = await fetch('https://app.fit-track.net/api/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mdl: 'reportings',
            act: 'list',
            search: debouncedSearchTerm
          }),
          credentials: 'include' // Include cookies for authentication
        })
        
        const data: ApiResponse = await response.json()
        
        if (data.success && data.reports) {
          // Map API response to our Report interface
          const formattedReports: Report[] = data.reports.map(report => ({
            id: report.id,
            name: report.name,
            date: report.date,
            type: report.type,
            // Ensure status is one of our valid enum values
            status: (report.status === 'completed' || report.status === 'pending' || report.status === 'in_progress') 
              ? report.status as 'completed' | 'pending' | 'in_progress'
              : 'pending', // Default fallback
            protein: report.protein,
            carbs: report.carbs,
            fat: report.fat
          }))
          
          setReports(formattedReports)
        } else {
          setError(data.message || 'Failed to fetch reports')
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
                className="pl-10 pr-4 py-2 w-full lg:w-[300px] rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
          <div className="bg-red-50 rounded-2xl p-8 shadow-sm text-center">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t('common.error', 'Error')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <button 
              onClick={() => setSearchTerm('')} 
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              {t('common.try_again', 'Try Again')}
            </button>
          </div>
        ) : reports.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t('reportings.name', 'Report Name')}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t('reportings.date', 'Date')}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t('reportings.type', 'Type')}
                    </th>
                    {/* Nutritional values with (g) in header */}
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t('reportings.protein', 'Protein (g)')}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t('reportings.carbs', 'Carbs (g)')}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t('reportings.fat', 'Fat (g)')}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t('reportings.status', 'Status')}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t('reportings.actions', 'Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(report.date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{report.type}</div>
                      </td>
                      {/* Values without 'g' suffix */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">{report.protein !== undefined ? report.protein : '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">{report.carbs !== undefined ? report.carbs : '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">{report.fat !== undefined ? report.fat : '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${report.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            report.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {report.status === 'completed' ? t('reportings.status_completed', 'Completed') :
                           report.status === 'in_progress' ? t('reportings.status_in_progress', 'In Progress') :
                           t('reportings.status_pending', 'Pending')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => window.location.href = `/dashboard/reportings/${report.id}`}
                            className="text-primary hover:text-primary-dark"
                          >
                            {t('reportings.view', 'View')}
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            {t('common.cancel', 'Cancel')}
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
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
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