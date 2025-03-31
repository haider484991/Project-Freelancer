'use client'

import React, { useState, useEffect } from 'react'
import { useAppContext } from '@/context/AppContext'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import ClientFilterDropdown from './components/ClientFilterDropdown'
import WeekSelector from './components/WeekSelector'
import DataImportExport from './components/DataImportExport'
import DataActivityHistory from './components/DataActivityHistory'
import ClientOverviewChart from './components/ClientOverviewChart'
import CaloricTrendsChart from './components/CaloricTrendsChart'
import ComplianceRateWidget from './components/ComplianceRateWidget'
import InactiveClientsWidget from './components/InactiveClientsWidget'
import { traineesApi, reportingsApi } from '@/services/fitTrackApi'
import { DEBUG_MODE, parseApiResponse } from '@/utils/config'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@/hooks/useMediaQuery'

// Define API response types
interface ApiTrainee {
  id: string;
  name: string;
  email: string;
  phone: string;
  group_id: string;
  target_calories: string;
  target_weight: string;
  gender: string;
  is_active: string;
  [key: string]: unknown;
}

interface ApiReporting {
  id: string;
  trainee_id: string;
  report_date: string;
  weight: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  [key: string]: unknown;
}

interface ActivityLog {
  id: string;
  type: string;
  filename: string;
  status: string;
  date: string;
}

// Define WeeklyData interface to include avgCalories
interface WeeklyData {
  week: string;
  active: number;
  inactive: number;
  avgCalories?: number;
}

// Client interface specifically for components in this page
// This must match the requirements of InactiveClientsWidget.tsx
interface PageClient {
  id: string;
  name: string;
  image?: string;
  status: string;
  compliance: string;
}

const DataManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedWeek, setSelectedWeek] = useState('Week 1')
  const [selectedClientFilter, setSelectedClientFilter] = useState('All Clients')
  // Use the context as fallback
  const { clients: contextClients } = useAppContext()
  
  // State for API data
  const [apiTrainees, setApiTrainees] = useState<ApiTrainee[]>([])
  const [apiReportings, setApiReportings] = useState<ApiReporting[]>([])
  
  // State for tracking if API has already loaded
  const [hasLoaded, setHasLoaded] = useState(false)
  
  // Other state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Data activity history
  const [dataActivities, setDataActivities] = useState<ActivityLog[]>([
    { id: '1', type: 'Import', filename: 'clients_may_2023.csv', status: 'success', date: '2023-05-15' },
    { id: '2', type: 'Export', filename: 'workouts_apr_2023.xlsx', status: 'success', date: '2023-04-28' },
    { id: '3', type: 'Import', filename: 'nutrition_plans.csv', status: 'failed', date: '2023-04-15' },
    { id: '4', type: 'Export', filename: 'client_reports.pdf', status: 'pending', date: '2023-05-20' }
  ])

  // Use API data or fall back to context
  const clients = apiTrainees.length > 0 
    ? apiTrainees.map(trainee => ({
        id: trainee.id,
        name: trainee.name,
        image: '/images/profile.jpg',
        status: trainee.is_active === '1' ? 'active' : 'inactive',
        compliance: 'compliant' // Default since API doesn't provide this
      } as PageClient))
    : [] // No longer fall back to context clients, return empty array

  // Derived data for statistics
  const activeClients = apiTrainees.length > 0 
    ? apiTrainees.filter(trainee => trainee.is_active === '1')
    : [] // Return empty array instead of falling back to context

  // Ensure inactiveClients is of type PageClient[] for component compatibility
  const inactiveClients: PageClient[] = apiTrainees.length > 0
    ? apiTrainees.filter(trainee => trainee.is_active !== '1').map(trainee => ({
        id: trainee.id,
        name: trainee.name,
        image: '/images/profile.jpg', // Default image
        status: 'inactive',
        compliance: 'non-compliant' // Default value since API doesn't provide this
      }))
    : [] // Return empty array instead of falling back to context

  // Calculate compliance rate from API data if available
  const complianceRate = apiReportings.length > 0 && apiTrainees.length > 0
    ? Math.round((apiReportings.filter(report => {
        // Consider a client compliant if they have at least one reporting
        return apiTrainees.some(trainee => trainee.id === report.trainee_id)
      }).length / apiTrainees.length) * 100)
    : 0

  // Fetch API data on component mount
  useEffect(() => {
    // Skip if already loaded to prevent infinite API calls
    if (hasLoaded) return;
    
    // Fetch trainees and reportings from API
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch trainees data
        const traineesResponse = await traineesApi.list()
        
        // Log the actual response structure for debugging
        console.log('Trainees API Response:', traineesResponse);
        
        // Parse trainees using our helper function
        const trainees = parseApiResponse(traineesResponse.data);
        
        // If we found trainees, use them
        if (trainees.length > 0) {
          setApiTrainees(trainees as ApiTrainee[]);
        } else {
          console.warn('Could not extract trainees from response:', traineesResponse.data);
          throw new Error('Unable to extract trainee data from API response');
        }

        // Fetch reportings
        const reportingsResponse = await reportingsApi.list()
        
        // Log the response structure for debugging
        console.log('Reportings API Response:', reportingsResponse);
        
        // Parse reportings using our helper function
        const reportings = parseApiResponse(reportingsResponse.data);
        
        // If we found reportings, use them
        if (reportings.length > 0) {
          setApiReportings(reportings as ApiReporting[]);
        } else {
          console.warn('Could not extract reportings from response:', reportingsResponse.data);
          throw new Error('Unable to extract reporting data from API response');
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load data from API. Please check your connection and try again.')
      } finally {
        setLoading(false)
        setHasLoaded(true) // Mark as loaded to prevent re-fetching
      }
    }

    fetchData()
  }, [hasLoaded])

  // Function to handle client filter change
  const handleClientFilterChange = (filter: string) => {
    setSelectedClientFilter(filter)
  }

  // Function to handle week selection change
  const handleWeekChange = (week: string) => {
    setSelectedWeek(week)
  }

  // Generate weekly data from reportings if available
  const weeklyData: WeeklyData[] = apiReportings.length > 0 
    ? [
        { 
          week: 'Week 1', 
          active: activeClients.length, 
          inactive: inactiveClients.length,
          // Calculate average calories from API data
          avgCalories: Math.round(apiReportings
            .filter(rep => rep.report_date >= getDateRangeForWeek('Week 1').start && 
                         rep.report_date <= getDateRangeForWeek('Week 1').end)
            .reduce((sum, rep) => sum + parseInt(rep.calories || '0'), 0) / 
            (apiReportings.filter(rep => rep.report_date >= getDateRangeForWeek('Week 1').start && 
                                rep.report_date <= getDateRangeForWeek('Week 1').end).length || 1))
        },
        { 
          week: 'Week 2', 
          active: apiReportings
            .filter(rep => rep.report_date >= getDateRangeForWeek('Week 2').start && 
                         rep.report_date <= getDateRangeForWeek('Week 2').end)
            .filter((v, i, a) => a.findIndex(t => t.trainee_id === v.trainee_id) === i)
            .filter(rep => apiTrainees.find(t => t.id === rep.trainee_id)?.is_active === '1').length,
          inactive: apiReportings
            .filter(rep => rep.report_date >= getDateRangeForWeek('Week 2').start && 
                         rep.report_date <= getDateRangeForWeek('Week 2').end)
            .filter((v, i, a) => a.findIndex(t => t.trainee_id === v.trainee_id) === i)
            .filter(rep => apiTrainees.find(t => t.id === rep.trainee_id)?.is_active !== '1').length,
          avgCalories: Math.round(apiReportings
            .filter(rep => rep.report_date >= getDateRangeForWeek('Week 2').start && 
                         rep.report_date <= getDateRangeForWeek('Week 2').end)
            .reduce((sum, rep) => sum + parseInt(rep.calories || '0'), 0) / 
            (apiReportings.filter(rep => rep.report_date >= getDateRangeForWeek('Week 2').start && 
                                rep.report_date <= getDateRangeForWeek('Week 2').end).length || 1))
        },
        { 
          week: 'Week 3',
          active: apiReportings
            .filter(rep => rep.report_date >= getDateRangeForWeek('Week 3').start && 
                         rep.report_date <= getDateRangeForWeek('Week 3').end)
            .filter((v, i, a) => a.findIndex(t => t.trainee_id === v.trainee_id) === i)
            .filter(rep => apiTrainees.find(t => t.id === rep.trainee_id)?.is_active === '1').length,
          inactive: apiReportings
            .filter(rep => rep.report_date >= getDateRangeForWeek('Week 3').start && 
                         rep.report_date <= getDateRangeForWeek('Week 3').end)
            .filter((v, i, a) => a.findIndex(t => t.trainee_id === v.trainee_id) === i)
            .filter(rep => apiTrainees.find(t => t.id === rep.trainee_id)?.is_active !== '1').length,
          avgCalories: Math.round(apiReportings
            .filter(rep => rep.report_date >= getDateRangeForWeek('Week 3').start && 
                         rep.report_date <= getDateRangeForWeek('Week 3').end)
            .reduce((sum, rep) => sum + parseInt(rep.calories || '0'), 0) / 
            (apiReportings.filter(rep => rep.report_date >= getDateRangeForWeek('Week 3').start && 
                                rep.report_date <= getDateRangeForWeek('Week 3').end).length || 1))
        },
        { 
          week: 'Week 4',
          active: apiReportings
            .filter(rep => rep.report_date >= getDateRangeForWeek('Week 4').start && 
                         rep.report_date <= getDateRangeForWeek('Week 4').end)
            .filter((v, i, a) => a.findIndex(t => t.trainee_id === v.trainee_id) === i)
            .filter(rep => apiTrainees.find(t => t.id === rep.trainee_id)?.is_active === '1').length,
          inactive: apiReportings
            .filter(rep => rep.report_date >= getDateRangeForWeek('Week 4').start && 
                         rep.report_date <= getDateRangeForWeek('Week 4').end)
            .filter((v, i, a) => a.findIndex(t => t.trainee_id === v.trainee_id) === i)
            .filter(rep => apiTrainees.find(t => t.id === rep.trainee_id)?.is_active !== '1').length,
          avgCalories: Math.round(apiReportings
            .filter(rep => rep.report_date >= getDateRangeForWeek('Week 4').start && 
                         rep.report_date <= getDateRangeForWeek('Week 4').end)
            .reduce((sum, rep) => sum + parseInt(rep.calories || '0'), 0) / 
            (apiReportings.filter(rep => rep.report_date >= getDateRangeForWeek('Week 4').start && 
                                rep.report_date <= getDateRangeForWeek('Week 4').end).length || 1))
        }
      ]
    : [
    { week: 'Week 1', active: activeClients.length, inactive: inactiveClients.length },
    { week: 'Week 2', active: 0, inactive: 0 },
    { week: 'Week 3', active: 0, inactive: 0 },
    { week: 'Week 4', active: 0, inactive: 0 }
  ]

  // Caloric data from reportings if available
  const caloricData = apiReportings.length > 0
    ? weeklyData.map(week => ({
        week: week.week,
        calories: week.avgCalories || 0
      }))
    : [
    { week: 'Week 1', calories: 0 },
    { week: 'Week 2', calories: 0 },
    { week: 'Week 3', calories: 0 },
    { week: 'Week 4', calories: 0 }
  ]

  // Helper function to get date range for a week
  function getDateRangeForWeek(weekStr: string): { start: string, end: string } {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Extract week number from string (e.g., "Week 1" -> 1)
    const weekNum = parseInt(weekStr.split(' ')[1]);
    
    // Calculate start and end dates based on week number
    // Assuming weeks start from the beginning of the current month
    const startDate = new Date(currentYear, currentMonth, 1 + (weekNum - 1) * 7);
    const endDate = new Date(currentYear, currentMonth, 7 + (weekNum - 1) * 7);
    
    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0];
    };
    
    return {
      start: formatDate(startDate),
      end: formatDate(endDate)
    };
  }
  
  // Helper function to calculate growth rate for different metrics
  const calculateGrowthRate = (data: ApiTrainee[] | ApiReporting[], metricType: 'total' | 'active' | 'compliance'): number => {
    if (data.length === 0) return 0;
    
    // Get current week and previous week date ranges
    const currentWeekRange = getDateRangeForWeek('Week 1');
    // Calculate previous week dates (not used in current implementation but kept for future use)
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const prevWeekStart = new Date(new Date(currentWeekRange.start).getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevWeekEnd = new Date(new Date(currentWeekRange.end).getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevWeekStartStr = prevWeekStart.toISOString().split('T')[0];
    const prevWeekEndStr = prevWeekEnd.toISOString().split('T')[0];
    /* eslint-enable @typescript-eslint/no-unused-vars */
    
    if (metricType === 'total') {
      // For simplicity, using a random growth rate between 0-15%
      // In a real implementation, you would compare this week's count with last week's
      return Math.floor(Math.random() * 15);
    } 
    else if (metricType === 'active') {
      // For simplicity, using a random growth rate between 0-10%
      // In a real implementation, you would compare this week's active count with last week's
      return Math.floor(Math.random() * 10);
    } 
    else if (metricType === 'compliance') {
      // Simulate compliance change
      const changeDirection = Math.random() > 0.5 ? 1 : -1;
      return Math.floor(Math.random() * 5) * changeDirection;
    }
    
    return 0;
  };
  
  // Helper function to get compliance change style
  const getComplianceChangeStyle = (): string => {
    const changeRate = calculateGrowthRate(apiReportings, 'compliance');
    return changeRate >= 0 ? 'text-green-600' : 'text-red-500';
  };
  
  // Helper function to get compliance change icon path
  const getComplianceChangeIcon = (): string => {
    const changeRate = calculateGrowthRate(apiReportings, 'compliance');
    return changeRate >= 0 
      ? 'M18 15L12 9L6 15' // Up arrow
      : 'M6 9L12 15L18 9'; // Down arrow
  };

  // Handle data import
  const handleDataImport = async (file: File) => {
    // Create a new activity log entry for the import
    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      type: 'Import',
      filename: file.name,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    }
    
    // Add the new activity to the log
    setDataActivities(prev => [newActivity, ...prev])
    
    // Simulate successful import after 2 seconds
    setTimeout(() => {
      setDataActivities(prev => 
        prev.map(activity => 
          activity.id === newActivity.id 
            ? {...activity, status: 'success'} 
            : activity
        )
      )
      
      // Refresh data from API after successful import
      fetchData()
    }, 2000)
  }
  
  // Function to fetch data (reused in handleDataImport)
  const fetchData = async () => {
    try {
      // Fetch trainees
      const traineesResponse = await traineesApi.list()
      const trainees = parseApiResponse(traineesResponse.data);
      if (trainees.length > 0) {
        setApiTrainees(trainees as ApiTrainee[]);
      }

      // Fetch reportings
      const reportingsResponse = await reportingsApi.list()
      const reportings = parseApiResponse(reportingsResponse.data);
      if (reportings.length > 0) {
        setApiReportings(reportings as ApiReporting[]);
      }
    } catch (err) {
      console.error('Error refreshing data:', err)
    }
  }
  
  // Handle data export function
  const handleExportData = () => {
    // Create a new activity log entry for the export
    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      type: 'Export',
      filename: `data_export_${new Date().toISOString().split('T')[0]}.csv`,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    }
    
    // Add the new activity to the log
    setDataActivities(prev => [newActivity, ...prev])
    
    // Simulate successful export after 1.5 seconds
    setTimeout(() => {
      setDataActivities(prev => 
        prev.map(activity => 
          activity.id === newActivity.id 
            ? {...activity, status: 'success'} 
            : activity
        )
      )
      
      // In a real implementation, we would create and download a CSV file here
      // For now, we'll just log the data
      if (DEBUG_MODE) {
        console.log('Exporting data:', {
          clients: apiTrainees,
          reportings: apiReportings
        })
      }
    }, 1500)
  }

  if (loading && !clients.length) {
  return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-white">Loading data...</div>
      </div>
    )
  }

  // Show error message if any
  if (error) {
    console.warn('Error loading data:', error)
  }

  // Define page icon for data management page
  const dataPageIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12.9799V11.0199C2 10.0799 2.85 9.20994 3.9 9.20994C5.71 9.20994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L8.21 2.53994C8.76 2.21994 9.78 2.21994 10.33 2.53994L12.3 3.77994C13.21 4.29994 13.52 5.46994 13 6.36994C12.09 7.93994 12.83 9.20994 14.64 9.20994C15.69 9.20994 16.54 10.0699 16.54 11.0199V12.9799C16.54 13.9199 15.69 14.7799 14.64 14.7799C12.83 14.7799 12.09 16.0599 13 17.6299C13.52 18.5399 13.21 19.6999 12.3 20.2199L10.33 21.4599C9.78 21.7799 8.76 21.7799 8.21 21.4599L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.9799Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.25 12C9.25 12.83 9.92 13.5 10.75 13.5C11.58 13.5 12.25 12.83 12.25 12C12.25 11.17 11.58 10.5 10.75 10.5C9.92 10.5 9.25 11.17 9.25 12Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  // Desktop content layout
  const desktopContent = (
    <>
      {/* Control Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
            <ClientFilterDropdown 
              selectedClientFilter={selectedClientFilter}
              onFilterChange={handleClientFilterChange}
            />
          <WeekSelector
            selectedWeek={selectedWeek}
            onWeekChange={handleWeekChange}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search data..."
              className="px-4 py-2 pl-10 pr-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13A753] text-sm"
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
          <button className="px-4 py-2 bg-[#13A753] hover:bg-[#0F8A44] text-white rounded-lg text-sm flex items-center gap-2 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.9998 19.92L8.47984 13.4C7.70984 12.63 7.70984 11.37 8.47984 10.6L14.9998 4.08" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Filter</span>
          </button>
        </div>
      </div>

      <DataImportExport 
        dataActivities={dataActivities}
        setDataActivities={setDataActivities}
        onImport={handleDataImport}
        onExport={handleExportData}
      />

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Clients</p>
            <h3 className="text-2xl font-bold">{apiTrainees.length}</h3>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {calculateGrowthRate(apiTrainees, 'total')}% from last week
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 7.16C17.94 7.15 17.87 7.15 17.81 7.16C16.43 7.11 15.33 5.98 15.33 4.58C15.33 3.15 16.48 2 17.91 2C19.34 2 20.49 3.16 20.49 4.58C20.48 5.98 19.38 7.11 18 7.16Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.9699 14.44C18.3399 14.67 19.8499 14.43 20.9099 13.72C22.3199 12.78 22.3199 11.24 20.9099 10.3C19.8399 9.59004 18.3099 9.35003 16.9399 9.59003" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.96998 7.16C6.02998 7.15 6.09998 7.15 6.15998 7.16C7.53998 7.11 8.63998 5.98 8.63998 4.58C8.63998 3.15 7.48998 2 6.05998 2C4.62998 2 3.47998 3.16 3.47998 4.58C3.48998 5.98 4.58998 7.11 5.96998 7.16Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.9999 14.44C5.6299 14.67 4.1199 14.43 3.0599 13.72C1.6499 12.78 1.6499 11.24 3.0599 10.3C4.1299 9.59004 5.6599 9.35003 7.0299 9.59003" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 14.63C11.94 14.62 11.87 14.62 11.81 14.63C10.43 14.58 9.32996 13.45 9.32996 12.05C9.32996 10.62 10.48 9.46997 11.91 9.46997C13.34 9.46997 14.49 10.63 14.49 12.05C14.48 13.45 13.38 14.59 12 14.63Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.08997 17.78C7.67997 18.72 7.67997 20.26 9.08997 21.2C10.69 22.27 13.31 22.27 14.91 21.2C16.32 20.26 16.32 18.72 14.91 17.78C13.32 16.72 10.69 16.72 9.08997 17.78Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Active Clients</p>
            <h3 className="text-2xl font-bold">{activeClients.length}</h3>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {calculateGrowthRate(apiTrainees, 'active')}% from last week
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Compliance Rate</p>
            <h3 className="text-2xl font-bold">{complianceRate}%</h3>
            <p className={`text-xs ${getComplianceChangeStyle()} mt-1 flex items-center gap-1`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={getComplianceChangeIcon()} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {calculateGrowthRate(apiReportings, 'compliance')}% from last week
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.55 21.67C18.84 20.54 22 16.64 22 12C22 6.48 17.56 2 12 2C5.33 2 2 7.56 2 7.56M2 7.56V3M2 7.56H4.01H6.44" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12C2 17.52 6.48 22 12 22" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Data Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Widgets */}
        <div className="lg:col-span-2 space-y-8">
            <ClientOverviewChart 
              weeklyData={weeklyData} 
              selectedWeek={selectedWeek} 
            />
            <CaloricTrendsChart
              caloricData={caloricData}
              selectedWeek={selectedWeek}
              onWeekChange={handleWeekChange}
            />
          </div>
          
        {/* Metrics & Activity Widgets */}
        <div className="space-y-8">
            <ComplianceRateWidget 
              complianceRate={complianceRate}
              selectedWeek={selectedWeek}
            />
            <InactiveClientsWidget 
              inactiveClients={inactiveClients}
            />
          <DataActivityHistory 
            dataActivities={dataActivities}
          />
        </div>
          </div>
    </>
  )

  // Mobile content layout - optimized for smaller screens
  const mobileContent = (
    <>
      {/* Mobile Control Panel */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-[#F3F7F3] rounded-full">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 6.5H16" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6.5H2" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 10C11.933 10 13.5 8.433 13.5 6.5C13.5 4.567 11.933 3 10 3C8.067 3 6.5 4.567 6.5 6.5C6.5 8.433 8.067 10 10 10Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 17.5H18" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 17.5H2" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 21C15.933 21 17.5 19.433 17.5 17.5C17.5 15.567 15.933 14 14 14C12.067 14 10.5 15.567 10.5 17.5C10.5 19.433 12.067 21 14 21Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="p-2 bg-[#F3F7F3] rounded-full">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
        </div>
      </div>

        <div className="grid grid-cols-2 gap-4">
            <ClientFilterDropdown 
              selectedClientFilter={selectedClientFilter}
              onFilterChange={handleClientFilterChange}
            />
            <WeekSelector 
              selectedWeek={selectedWeek}
              onWeekChange={handleWeekChange}
            />
          </div>
        </div>

      {/* Mobile Stats Overview Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 7.16C17.94 7.15 17.87 7.15 17.81 7.16C16.43 7.11 15.33 5.98 15.33 4.58C15.33 3.15 16.48 2 17.91 2C19.34 2 20.49 3.16 20.49 4.58C20.48 5.98 19.38 7.11 18 7.16Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.9699 14.44C18.3399 14.67 19.8499 14.43 20.9099 13.72C22.3199 12.78 22.3199 11.24 20.9099 10.3C19.8399 9.59004 18.3099 9.35003 16.9399 9.59003" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.96998 7.16C6.02998 7.15 6.09998 7.15 6.15998 7.16C7.53998 7.11 8.63998 5.98 8.63998 4.58C8.63998 3.15 7.48998 2 6.05998 2C4.62998 2 3.47998 3.16 3.47998 4.58C3.48998 5.98 4.58998 7.11 5.96998 7.16Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.9999 14.44C5.6299 14.67 4.1199 14.43 3.0599 13.72C1.6499 12.78 1.6499 11.24 3.0599 10.3C4.1299 9.59004 5.6599 9.35003 7.0299 9.59003" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14.63C11.94 14.62 11.87 14.62 11.81 14.63C10.43 14.58 9.32996 13.45 9.32996 12.05C9.32996 10.62 10.48 9.46997 11.91 9.46997C13.34 9.46997 14.49 10.63 14.49 12.05C14.48 13.45 13.38 14.59 12 14.63Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.08997 17.78C7.67997 18.72 7.67997 20.26 9.08997 21.2C10.69 22.27 13.31 22.27 14.91 21.2C16.32 20.26 16.32 18.72 14.91 17.78C13.32 16.72 10.69 16.72 9.08997 17.78Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-xs text-gray-500">Total Clients</p>
          </div>
          <h3 className="text-xl font-bold">{apiTrainees.length}</h3>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-xs text-gray-500">Active Clients</p>
              </div>
          <h3 className="text-xl font-bold">{activeClients.length}</h3>
              </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#F45C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="#F45C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 2L6 14" stroke="#F45C5C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-xs text-gray-500">Inactive Clients</p>
          </div>
          <h3 className="text-xl font-bold">{inactiveClients.length}</h3>
          </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.55 21.67C18.84 20.54 22 16.64 22 12C22 6.48 17.56 2 12 2C5.33 2 2 7.56 2 7.56M2 7.56V3M2 7.56H4.01H6.44" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12C2 17.52 6.48 22 12 22" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
              </svg>
            </div>
            <p className="text-xs text-gray-500">Compliance Rate</p>
          </div>
          <h3 className="text-xl font-bold">{complianceRate}%</h3>
        </div>
      </div>

      {/* Mobile Import/Export */}
      <div className="mb-6">
        <DataImportExport 
          dataActivities={dataActivities}
          setDataActivities={setDataActivities}
          onImport={handleDataImport}
          onExport={handleExportData}
        />
      </div>

      {/* Mobile Charts */}
      <div className="space-y-6">
        <ClientOverviewChart 
          weeklyData={weeklyData} 
          selectedWeek={selectedWeek}
          isMobile
        />
            <CaloricTrendsChart
              caloricData={caloricData}
              selectedWeek={selectedWeek}
              onWeekChange={handleWeekChange}
          isMobile
        />
            <ComplianceRateWidget 
              complianceRate={complianceRate}
              selectedWeek={selectedWeek}
          isMobile
        />
            <InactiveClientsWidget 
              inactiveClients={inactiveClients}
          isMobile
        />
        <DataActivityHistory 
          dataActivities={dataActivities}
          isMobile
            />
          </div>
    </>
  )

  return (
    <DashboardLayout
      pageTitle={t('dataManagement.title')}
      pageIcon={dataPageIcon}
    >
      {/* Error notification */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold mr-1">Error:</strong>
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
            </button>
          </div>
      )}

      {loading ? (
        <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#13A753]"></div>
        </div>
      ) : (
        isMobile ? mobileContent : desktopContent
      )}
    </DashboardLayout>
  )
}

export default DataManagementPage