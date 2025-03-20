'use client'

import React, { useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import DataPageLayout from './components/DataPageLayout'
import ClientFilterDropdown from './components/ClientFilterDropdown'
import WeekSelector from './components/WeekSelector'
import DataImportExport from './components/DataImportExport'
import DataActivityHistory from './components/DataActivityHistory'
import ClientOverviewChart from './components/ClientOverviewChart'
import CaloricTrendsChart from './components/CaloricTrendsChart'
import ComplianceRateWidget from './components/ComplianceRateWidget'
import InactiveClientsWidget from './components/InactiveClientsWidget'

const DataManagementPage: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState('Week 1')
  const [selectedClientFilter, setSelectedClientFilter] = useState('All Clients')
  // Use the context instead of mock data
  const { clients } = useAppContext()
  
  // Data activity history
  const [dataActivities, setDataActivities] = useState([
    { id: '1', type: 'Import', filename: 'clients_may_2023.csv', status: 'success', date: '2023-05-15' },
    { id: '2', type: 'Export', filename: 'workouts_apr_2023.xlsx', status: 'success', date: '2023-04-28' },
    { id: '3', type: 'Import', filename: 'nutrition_plans.csv', status: 'failed', date: '2023-04-15' },
    { id: '4', type: 'Export', filename: 'client_reports.pdf', status: 'pending', date: '2023-05-20' }
  ])

  // Function to handle client filter change
  const handleClientFilterChange = (filter: string) => {
    setSelectedClientFilter(filter)
  }

  // Function to handle week selection change
  const handleWeekChange = (week: string) => {
    setSelectedWeek(week)
  }

  // Derived data for statistics
  const activeClients = clients.filter(client => client.status === 'active')
  const inactiveClients = clients.filter(client => client.status === 'inactive') as {
    id: string;
    name: string;
    image?: string;
    status: string;
    compliance: string;
  }[]
  const complianceRate = clients.length > 0
    ? Math.round((clients.filter(client => client.compliance === 'compliant').length / clients.length) * 100)
    : 0

  // Data for charts
  const weeklyData = [
    { week: 'Week 1', active: activeClients.length, inactive: inactiveClients.length },
    { week: 'Week 2', active: Math.round(activeClients.length * 0.9), inactive: Math.round(inactiveClients.length * 1.1) },
    { week: 'Week 3', active: Math.round(activeClients.length * 1.1), inactive: Math.round(inactiveClients.length * 0.9) },
    { week: 'Week 4', active: Math.round(activeClients.length * 1.2), inactive: Math.round(inactiveClients.length * 0.8) }
  ]

  // Caloric data
  const caloricData = [
    { week: 'Week 1', calories: 1800 },
    { week: 'Week 2', calories: 1600 },
    { week: 'Week 3', calories: 1300 },
    { week: 'Week 4', calories: 1500 }
  ]

  return (
    <DataPageLayout>
      {/* Desktop content */}
      <div className="hidden lg:block">
        {/* Top filter section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <ClientFilterDropdown 
              selectedClientFilter={selectedClientFilter}
              onFilterChange={handleClientFilterChange}
            />
          </div>
          <button
            className="flex items-center gap-3 bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-[60px] py-3 px-6 text-white"
            onClick={() => {}} // This will be handled by the DataImportExport component
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.3334 8.6665V12.6665H4.08342V8.6665H3.3334V12.6665C3.3334 13.3998 3.93341 13.9998 4.08342 13.9998H11.3334C12.0667 13.9998 12.6667 13.3998 12.6667 12.6665V8.6665H11.3334ZM10.6667 7.99984L9.72008 7.05317L8.66675 8.1065V3.33317H7.33341V8.1065L6.28008 7.05317L5.33341 7.99984L8.00008 10.6665L10.6667 7.99984Z" fill="white" />
            </svg>
            <span className="text-white text-sm font-semibold">Export</span>
          </button>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left column - charts */}
          <div className="col-span-2">
            <ClientOverviewChart 
              weeklyData={weeklyData} 
              selectedWeek={selectedWeek} 
            />
            
            <CaloricTrendsChart
              caloricData={caloricData}
              selectedWeek={selectedWeek}
              onWeekChange={handleWeekChange}
            />
            
            <DataImportExport 
              dataActivities={dataActivities}
              setDataActivities={setDataActivities}
            />
            
            <DataActivityHistory 
              dataActivities={dataActivities} 
            />
          </div>
          
          {/* Right column - widgets */}
          <div className="col-span-1">
            <ComplianceRateWidget 
              complianceRate={complianceRate}
              selectedWeek={selectedWeek}
            />
            
            <InactiveClientsWidget 
              inactiveClients={inactiveClients}
            />
          </div>
        </div>
      </div>

      {/* Mobile content */}
      <div className="lg:hidden">
        <div className="mb-5">
          <h2 className="text-xl font-bold mb-4">Data Management</h2>
          <div className="flex justify-between items-center">
            <ClientFilterDropdown 
              selectedClientFilter={selectedClientFilter}
              onFilterChange={handleClientFilterChange}
              isMobile={true}
            />
            <WeekSelector 
              selectedWeek={selectedWeek}
              onWeekChange={handleWeekChange}
              isMobile={true}
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Client Overview */}
          <div className="bg-[#F9F9F9] rounded-[15px] p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[16px] font-semibold text-[#1E1E1E]">Client Overview</h3>
            </div>
            <ClientOverviewChart 
              weeklyData={weeklyData} 
              selectedWeek={selectedWeek}
              isMobile={true}
            />

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 justify-center">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gradient-to-b from-[#13A753] to-[#1E2120]"></div>
                <span className="text-[12px] text-[#2B180A]">Active</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#F45C5C]"></div>
                <span className="text-[12px] text-[#2B180A]">Inactive</span>
              </div>
            </div>
          </div>

          {/* Caloric Trends */}
          <div className="bg-[#F9F9F9] rounded-[15px] p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[16px] font-semibold text-[#1E1E1E]">Caloric Trends</h3>
            </div>
            <CaloricTrendsChart
              caloricData={caloricData}
              selectedWeek={selectedWeek}
              onWeekChange={handleWeekChange}
              isMobile={true}
            />
          </div>

          {/* Compliance Rate */}
          <div className="bg-[#F9F9F9] rounded-[15px] p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[16px] font-semibold text-[#1E1E1E]">Compliance Rate</h3>
            </div>
            <ComplianceRateWidget 
              complianceRate={complianceRate}
              selectedWeek={selectedWeek}
              isMobile={true}
            />
            <div className="bg-[#DAEEDA] w-full py-2 rounded-[10px] text-center mt-3">
              <p className="text-[12px] text-[#636363]">For {selectedWeek}</p>
            </div>
          </div>

          {/* Inactive Clients */}
          <div className="bg-[#F9F9F9] rounded-[15px] p-4">
            <h3 className="text-[16px] font-semibold text-[#1E1E1E] mb-3">Inactive Clients</h3>
            <InactiveClientsWidget 
              inactiveClients={inactiveClients}
              isMobile={true}
            />
          </div>

          {/* Import/Export Data - Only buttons visible on mobile */}
          <div className="flex flex-col gap-3">
            <button className="w-full py-3 bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-[15px] text-white font-medium text-sm">
              Import Data
            </button>
            <button className="w-full py-3 bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-[15px] text-white font-medium text-sm">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </DataPageLayout>
  )
}

export default DataManagementPage