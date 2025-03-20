'use client'

import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface DataActivity {
  id: string
  type: string
  filename: string
  status: string
  date: string
}

interface DataImportExportProps {
  dataActivities: DataActivity[]
  setDataActivities: (activities: DataActivity[]) => void
}

const DataImportExport: React.FC<DataImportExportProps> = ({ 
  dataActivities, 
  setDataActivities 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [exportDataType, setExportDataType] = useState('')
  const [exportFormat, setExportFormat] = useState('csv')
  const { t } = useTranslation()

  // Handle file input click
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  // Handle import data
  const handleImportData = () => {
    if (!selectedFile) return

    // Add to activities
    const newActivity = {
      id: Date.now().toString(),
      type: 'Import',
      filename: selectedFile.name,
      status: 'success',
      date: new Date().toISOString().split('T')[0]
    }

    setDataActivities([newActivity, ...dataActivities])
    setSelectedFile(null)
    alert('Data imported successfully!')
  }

  // Handle export data
  const handleExportData = () => {
    if (!exportDataType) return

    // Add to activities
    const newActivity = {
      id: Date.now().toString(),
      type: 'Export',
      filename: `${exportDataType}_${new Date().toISOString().split('T')[0]}.${exportFormat}`,
      status: 'success',
      date: new Date().toISOString().split('T')[0]
    }

    setDataActivities([newActivity, ...dataActivities])
    alert(`${exportDataType} data exported as ${exportFormat.toUpperCase()}!`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Import Data Section */}
      <div className="bg-white rounded-[30px] p-6 shadow-md border border-gray-100">
        <h3 className="text-[18px] font-bold text-[#1E1E1E] mb-4">{t('Import Data')}</h3>
        <div className="bg-[#F3F7F3] rounded-[20px] p-5">
          <div className="flex justify-center items-center flex-col gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".csv,.xlsx,.json"
            />
            <button
              className="w-[74px] h-[74px] bg-white rounded-full flex items-center justify-center"
              onClick={handleImportClick}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25.6667 17.5V22.1667C25.6667 22.7855 25.4208 23.379 24.9833 23.8166C24.5457 24.2542 23.9522 24.5 23.3333 24.5H4.66667C4.04781 24.5 3.45432 24.2542 3.01674 23.8166C2.57917 23.379 2.33333 22.7855 2.33333 22.1667V17.5" stroke="#13A753" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 11.6665L14 18.6665L21 11.6665" stroke="#13A753" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 18.6667V3.5" stroke="#13A753" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="text-center">
              <p className="text-[#545454] text-sm mb-1">
                {selectedFile ? selectedFile.name : t('Click to upload your file')}
              </p>
              <p className="text-[#A3A3A3] text-xs">
                {t('Formats supported')}: CSV, XLS, JSON
              </p>
            </div>
            <button
              className="bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-[43px] py-[10px] px-[25px] text-white text-sm font-semibold w-full md:w-auto"
              onClick={handleImportData}
              disabled={!selectedFile}
            >
              {t('Import Data')}
            </button>
          </div>
        </div>
      </div>

      {/* Export Data Section */}
      <div className="bg-white rounded-[30px] p-6 shadow-md border border-gray-100">
        <h3 className="text-[18px] font-bold text-[#1E1E1E] mb-4">{t('Export Data')}</h3>
        <div className="bg-[#F3F7F3] rounded-[20px] p-5">
          <div className="space-y-4">
            <div>
              <label className="text-[#545454] text-sm block mb-2">{t('Select Data Type')}</label>
              <select
                className="w-full bg-white border border-[#E0E0E0] rounded-[10px] py-2 px-3 text-[#545454]"
                value={exportDataType}
                onChange={e => setExportDataType(e.target.value)}
              >
                <option value="">{t('Select Data Type')}</option>
                <option value="clients">{t('Clients Data')}</option>
                <option value="workouts">{t('Workouts')}</option>
                <option value="nutrition">{t('Nutrition Plans')}</option>
                <option value="progress">{t('Progress Reports')}</option>
              </select>
            </div>
            <div>
              <label className="text-[#545454] text-sm block mb-2">{t('Format')}</label>
              <div className="flex gap-3">
                {['csv', 'xlsx', 'json', 'pdf'].map(format => (
                  <div key={format} className="flex items-center">
                    <input
                      type="radio"
                      id={format}
                      name="exportFormat"
                      value={format}
                      checked={exportFormat === format}
                      onChange={e => setExportFormat(e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor={format} className="text-[#545454] text-sm uppercase">
                      {format}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="bg-gradient-to-b from-[#13A753] to-[#1E2120] rounded-[43px] py-[10px] px-[25px] text-white text-sm font-semibold w-full md:w-auto mt-4"
              onClick={handleExportData}
              disabled={!exportDataType}
            >
              {t('Export Data')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataImportExport 