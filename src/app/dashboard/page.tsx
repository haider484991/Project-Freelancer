'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { dashboardApi, traineesApi } from '@/services/fitTrackApi'
import { mockDashboardData } from '@/services/mockData'
import { DEBUG_MODE } from '@/utils/config'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useUser } from '@/context/UserContext'
import Image from 'next/image'

// Define the dashboard data interface
interface DashboardData {
  inactive_trainees_count: number;
  trainees_count: number;
  weekly_data: {
    day: string;
    count: number;
  }[];
  groups_distribution: {
    name: string;
    trainees_count: number;
  }[];
  [key: string]: unknown;
}

// Define trainee interface
interface Trainee {
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

// Define activity interface
interface Activity {
  id: string;
  name: string;
  action: string;
  time: string;
  image: string;
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const { profile } = useUser()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [inactiveTrainees, setInactiveTrainees] = useState<Trainee[]>([])
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Fetch main dashboard data
        const dashboardResponse = await dashboardApi.get()
        if (DEBUG_MODE) {
          console.log('Dashboard API response:', dashboardResponse.data)
        }
        setDashboardData(dashboardResponse.data)
        
        // Fetch inactive trainees for the FlaggedIssues component
        const traineesResponse = await traineesApi.list()
        if (traineesResponse.data && traineesResponse.data.trainees) {
          const inactive = traineesResponse.data.trainees.filter(
            (trainee: Trainee) => trainee.is_active === "0"
          )
          setInactiveTrainees(inactive)
          
          // Create recent activity from trainee data (this would ideally come from a dedicated API endpoint)
          const recent = traineesResponse.data.trainees.slice(0, 5).map((trainee: Trainee) => ({
            id: trainee.id,
            name: trainee.name,
            action: 'updated profile',
            time: '2 hours ago',
            image: '/images/profile.jpg'
          }))
          setRecentActivity(recent)
          
          if (DEBUG_MODE) {
            console.log('Fetched inactive trainees:', inactive)
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        // Use mock data as fallback if API request fails
        console.log('Using mock data as fallback')
        setDashboardData(mockDashboardData)
        setError(null) // Clear any error since we're using fallback data
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  // CSS animations for the dashboard
  const animations = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes grow {
      from { transform: scale(0.97); }
      to { transform: scale(1); }
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(19, 167, 83, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(19, 167, 83, 0); }
      100% { box-shadow: 0 0 0 0 rgba(19, 167, 83, 0); }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
    
    .animate-slide-in {
      animation: slideIn 0.5s ease-out forwards;
    }
    
    .animate-grow {
      animation: grow 0.3s ease-out forwards;
    }
    
    .animate-pulse {
      animation: pulse 2s infinite;
    }
    
    .staggered-delay-1 { animation-delay: 0.1s; }
    .staggered-delay-2 { animation-delay: 0.2s; }
    .staggered-delay-3 { animation-delay: 0.3s; }
    .staggered-delay-4 { animation-delay: 0.4s; }
  `;

  // Display loading state with improved UI
  if (loading) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#13A753] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600 font-medium">{t('general.loading')}</div>
        </div>
      </div>
    )
  }

  // Display error state with improved UI
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V14" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 17.5V18" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#EF4444" strokeWidth="2"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#13A753] text-white py-2 px-6 rounded-lg hover:bg-[#0F8A44] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Dashboard icon
  const dashboardIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="9" height="9" rx="2" fill="#13A753"/>
      <rect x="2" y="13" width="9" height="9" rx="2" fill="#13A753" fillOpacity="0.7"/>
      <rect x="13" y="2" width="9" height="9" rx="2" fill="#13A753" fillOpacity="0.7"/>
      <rect x="13" y="13" width="9" height="9" rx="2" fill="#13A753" fillOpacity="0.5"/>
    </svg>
  )

  // Calculate stats data
  const totalClients = dashboardData?.trainees_count || 0
  const inactiveClientsCount = dashboardData?.inactive_trainees_count || 0
  const activeClientsCount = totalClients - inactiveClientsCount
  const complianceRate = Math.round((activeClientsCount / (totalClients || 1)) * 100)

  // Desktop content with modernized UI
  const desktopContent = (
    <>
      <style jsx>{animations}</style>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 staggered-delay-1">
          <div className="flex items-center gap-4">
            <div className="bg-[#13A753]/10 p-3 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" fill="#13A753"/>
                <path d="M16.3598 3.08C16.7398 3.02 17.1298 3 17.5098 3C19.9898 3 21.9998 5.01 21.9998 7.5C21.9998 9.99 19.9898 12 17.5098 12C16.2598 12 15.1198 11.5 14.2998 10.68" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17C2 14.79 3.79 13 6 13H12C14.21 13 16 14.79 16 17V20C16 20.55 15.55 21 15 21H3C2.45 21 2 20.55 2 20V17Z" fill="#13A753" fillOpacity="0.6"/>
                <path d="M17.5 21H20.5C21.05 21 21.5 20.55 21.5 20V17C21.5 14.79 19.71 13 17.5 13C16.53 13 15.63 13.33 14.96 13.88" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{totalClients}</h3>
              <p className="text-gray-500">{t('dashboard.totalClients')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 staggered-delay-2">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.75 12L10.58 14.83L16.25 9.17004" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{activeClientsCount}</h3>
              <p className="text-gray-500">{t('dashboard.activeClients')}</p>
            </div>
              </div>
                </div>
                
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 staggered-delay-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V13" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9945 16H12.0035" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{inactiveClientsCount}</h3>
              <p className="text-gray-500">{t('dashboard.inactiveClients')}</p>
                  </div>
                </div>
              </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 staggered-delay-4">
          <div className="flex items-center gap-4">
            <div className="bg-purple-50 p-3 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V5" stroke="#8B5CF6" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V5" stroke="#8B5CF6" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 9.09H20.5" stroke="#8B5CF6" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#8B5CF6" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.6947 13.7H15.7037" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.6947 16.7H15.7037" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9955 13.7H12.0045" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9955 16.7H12.0045" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.29431 13.7H8.30329" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.29431 16.7H8.30329" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{`${complianceRate}%`}</h3>
              <p className="text-gray-500">{t('dashboard.complianceRate')}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts and Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Client Distribution Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-gray-100 animate-fade-in animate-grow">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Weekly Activity
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardData?.weekly_data || []}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" name="Clients" fill="#13A753" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Client Distribution by Group */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 animate-fade-in animate-grow">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Client Distribution
          </h3>
          <div className="h-60 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData?.groups_distribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="trainees_count"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {dashboardData?.groups_distribution?.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={['#13A753', '#4285F4', '#F59E0B', '#8B5CF6', '#EC4899'][index % 5]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Inactive Client Alerts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flagged Issues / Inactive Clients */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-gray-100 animate-fade-in animate-grow">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Flagged Issues
          </h3>
          
          {inactiveTrainees.length > 0 ? (
            <div className="space-y-4">
              {inactiveTrainees.map(trainee => (
                <div key={trainee.id} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                  <div className="bg-amber-50 p-2 rounded-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 8V13" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M11.9945 16H12.0035" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{trainee.name}</h4>
                    <p className="text-sm text-gray-500">Inactive client account</p>
                  </div>
                  <button className="text-[#13A753] hover:text-[#0F8A44] font-medium text-sm transition-colors">
                    Contact
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No flagged issues at this time</p>
            </div>
          )}
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 animate-fade-in animate-grow">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Recent Activity
          </h3>
          
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-start gap-3 border-b border-gray-100 pb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                    <Image 
                      src={activity.image} 
                      alt={activity.name} 
                      width={32} 
                      height={32}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium text-gray-800">{activity.name}</span>
                      <span className="text-gray-500"> {activity.action}</span>
                    </p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </>
  )

  // Mobile content with optimized layout for smaller screens
  const mobileContent = (
    <>
      <style jsx>{animations}</style>
      
      {/* Mobile Stats Widgets - Scrollable horizontally */}
      <div className="flex overflow-x-auto gap-3 pb-2 mb-5 hide-scrollbar">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 min-w-[160px] animate-fade-in staggered-delay-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-[#13A753]/10 p-2 rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" fill="#13A753"/>
                <path d="M2 17C2 14.79 3.79 13 6 13H12C14.21 13 16 14.79 16 17V20C16 20.55 15.55 21 15 21H3C2.45 21 2 20.55 2 20V17Z" fill="#13A753" fillOpacity="0.6"/>
              </svg>
            </div>
            <span className="text-xs text-gray-500">{t('dashboard.totalClients')}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">{totalClients}</h3>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 min-w-[160px] animate-fade-in staggered-delay-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-blue-50 p-2 rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.75 12L10.58 14.83L16.25 9.17004" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xs text-gray-500">{t('dashboard.activeClients')}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">{activeClientsCount}</h3>
          </div>
          
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 min-w-[160px] animate-fade-in staggered-delay-3">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-amber-50 p-2 rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V13" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9945 16H12.0035" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              </div>
            <span className="text-xs text-gray-500">{t('dashboard.inactiveClients')}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">{inactiveClientsCount}</h3>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 min-w-[160px] animate-fade-in staggered-delay-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-purple-50 p-2 rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V5" stroke="#8B5CF6" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V5" stroke="#8B5CF6" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 9.09H20.5" stroke="#8B5CF6" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#8B5CF6" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <span className="text-xs text-gray-500">{t('dashboard.complianceRate')}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">{`${complianceRate}%`}</h3>
        </div>
      </div>
      
      {/* Weekly Activity Chart */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-4 animate-fade-in">
        <h3 className="text-base font-bold text-gray-800 mb-3">
          Weekly Activity
        </h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dashboardData?.weekly_data || []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Bar dataKey="count" name="Clients" fill="#13A753" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Client Distribution Pie */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-4 animate-fade-in">
        <h3 className="text-base font-bold text-gray-800 mb-3">
          Client Distribution
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dashboardData?.groups_distribution || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                fill="#8884d8"
                dataKey="trainees_count"
                nameKey="name"
              >
                {dashboardData?.groups_distribution?.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={['#13A753', '#4285F4', '#F59E0B', '#8B5CF6', '#EC4899'][index % 5]} 
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Flagged Issues Section */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-4 animate-fade-in">
        <h3 className="text-base font-bold text-gray-800 mb-3">
          Flagged Issues
        </h3>
        
        {inactiveTrainees.length > 0 ? (
          <div className="space-y-3">
            {inactiveTrainees.slice(0, 3).map(trainee => (
              <div key={trainee.id} className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="bg-amber-50 p-1.5 rounded-full">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8V13" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.9945 16H12.0035" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-800">{trainee.name}</h4>
                  <p className="text-xs text-gray-500">Inactive client account</p>
                </div>
                <button className="text-xs text-[#13A753] font-medium">
                  Contact
                </button>
              </div>
            ))}
            
            {inactiveTrainees.length > 3 && (
              <button className="w-full text-center text-sm text-[#13A753] font-medium py-2">
                View All Issues ({inactiveTrainees.length})
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-20 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">No flagged issues</p>
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="flex gap-2 mb-4 animate-fade-in">
        <button className="flex-1 bg-[#13A753] text-white font-medium text-sm py-3 px-4 rounded-xl">
          Add New Client
        </button>
        <button className="flex-1 border border-gray-200 bg-white text-gray-700 font-medium text-sm py-3 px-4 rounded-xl">
          Export Reports
        </button>
        </div>
    </>
  )

  // Add custom CSS for mobile styling
  const mobileStyles = `
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `;

  return (
    <DashboardLayout
      pageTitle={t('dashboard.welcomeMessage', { name: profile?.name || 'Coach' })}
      pageIcon={dashboardIcon}
    >
      <style jsx global>{mobileStyles}</style>
      
      {/* Desktop View */}
      <div className="hidden lg:block">
        {desktopContent}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        {mobileContent}
    </div>
    </DashboardLayout>
  )
}