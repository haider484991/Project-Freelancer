'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { formatDate } from '@/utils/dateFormat'
import { parseApiResponse } from '@/utils/config'
import { reportingsApi } from '@/services/fitTrackApi'

// Define strongly typed interfaces for the meal report response
interface ReportItemDetails {
  id?: string;
  report_id?: string;
  on_date?: string;
  meal_text?: string;
  meal_protein?: number | string;
  meal_carbs?: number | string;
  meal_fats?: number | string;
  calories?: number | string;
  feedback?: string;
  trainee_name?: string;
  trainee_id?: string;
  status?: string;
  [key: string]: unknown;
}

// Define strongly typed interfaces for the meal report
interface MealReport {
  id: string;
  on_date: string;
  meal_text: string;
  meal_protein: number;
  meal_carbs: number;
  meal_fats: number;
  calories: number;
  feedback: string;
  trainee_name: string;
  trainee_id: string;
  status?: 'completed' | 'pending' | 'in_progress';
}

// Improve the date formatting function for better error handling
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

export default function ReportDetailPage() {
  const { id } = useParams()
  const { t } = useTranslation()
  const [report, setReport] = useState<MealReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function fetchReportDetail() {
      if (!id) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        // Use the fitTrackApi service instead of direct fetch
        if (!reportingsApi) {
          setError('API service not available')
          setIsLoading(false)
          return
        }
        
        const response = await reportingsApi.get(id as string)
        
        // Use the shared parsing logic for API responses
        const reportData = parseApiResponse<ReportItemDetails>(response.data)
        console.log('Raw report data:', response.data)
        console.log('Parsed report data:', reportData)
        
        if (reportData && reportData.length > 0) {
          // The first item contains our report data
          const apiReport = reportData[0]
          
          // Create a properly typed report object
          const typedReport: MealReport = {
            id: apiReport.id || apiReport.report_id || '',
            on_date: apiReport.on_date || new Date().toISOString().split('T')[0],
            meal_text: apiReport.meal_text || 'No meal description provided',
            meal_protein: Number(apiReport.meal_protein) || 0,
            meal_carbs: Number(apiReport.meal_carbs) || 0,
            meal_fats: Number(apiReport.meal_fats) || 0,
            calories: Number(apiReport.calories) || 0,
            feedback: apiReport.feedback || '',
            trainee_name: apiReport.trainee_name || 'Unknown Trainee',
            trainee_id: apiReport.trainee_id || '',
            status: (apiReport.status as 'completed' | 'pending' | 'in_progress') || 'pending'
          }
          
          console.log('Processed report:', typedReport)
          
          setReport(typedReport)
        } else {
          setError('Failed to fetch report details')
        }
      } catch (error) {
        console.error('Error fetching report details:', error)
        setError('An error occurred while fetching report details')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchReportDetail()
  }, [id])
  
  return (
    <DashboardLayout pageTitle={t('reportings.reportDetail', 'Report Detail')}>
      <div className="px-8 py-6">
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-primary hover:text-primary-dark transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('common.back', 'Back')}
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-2xl p-8 shadow-md text-center">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t('common.error', 'Error')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <button 
              onClick={() => window.history.back()} 
              className="mt-4 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
            >
              {t('common.goBack', 'Go Back')}
            </button>
          </div>
        ) : report ? (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {t('reportings.mealReport', 'Meal Report')}
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    {`${t('common.for', 'For')}: `}
                    <a 
                      href={`/dashboard/clients/${report.trainee_id}`} 
                      className="text-primary hover:underline"
                    >
                      {report.trainee_name}
                    </a>
                  </p>
                </div>
                <div className="mt-4 lg:mt-0">
                  <div className="text-sm text-gray-500">
                    {formatDateTimeCustom(report.on_date)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Meal details */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">{t('reportings.mealDetails', 'Meal Details')}</h2>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="whitespace-pre-wrap">{report.meal_text}</div>
                  </div>
                </div>
                
                {/* Nutritional information */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">{t('reportings.nutritionalInfo', 'Nutritional Information')}</h2>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <div className="text-sm text-gray-500">{t('reportings.protein', 'Protein')}</div>
                        <div className="text-xl font-semibold">{report.meal_protein}g</div>
                      </div>
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <div className="text-sm text-gray-500">{t('reportings.carbs', 'Carbs')}</div>
                        <div className="text-xl font-semibold">{report.meal_carbs}g</div>
                      </div>
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <div className="text-sm text-gray-500">{t('reportings.fat', 'Fat')}</div>
                        <div className="text-xl font-semibold">{report.meal_fats}g</div>
                      </div>
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <div className="text-sm text-gray-500">{t('reportings.calories', 'Calories')}</div>
                        <div className="text-xl font-semibold">{report.calories} kcal</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Feedback section */}
              {report.feedback && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">{t('reportings.feedback', 'Coach Feedback')}</h2>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="whitespace-pre-wrap">{report.feedback}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-md text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t('reportings.noReportFound', 'No report found')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('reportings.reportNotFoundMessage', 'The report you are looking for does not exist or has been removed.')}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 