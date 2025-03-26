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
  isMobile?: boolean
  onImport?: (file: File) => void
  onExport?: () => void
}

const DataImportExport: React.FC<DataImportExportProps> = ({ 
  dataActivities, 
  setDataActivities,
  isMobile = false,
  onImport,
  onExport
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [exportDataType, setExportDataType] = useState('')
  const [exportFormat, setExportFormat] = useState('csv')
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const { t } = useTranslation()

  // Handle file input click
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
      setSuccessMessage('')
    }
  }

  // Handle import data
  const handleImportData = () => {
    if (!selectedFile) return

    setIsImporting(true)
    
    if (onImport && selectedFile) {
      onImport(selectedFile);
      setSelectedFile(null);
      setIsImporting(false);
      setSuccessMessage('Data imported successfully!');
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } else {
      // Fallback to original implementation if no onImport prop
      setTimeout(() => {
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
        setIsImporting(false)
        setSuccessMessage('Data imported successfully!')
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000)
      }, 1500)
    }
  }

  // Handle export data
  const handleExportData = () => {
    if (!exportDataType) return

    setIsExporting(true)
    
    if (onExport) {
      onExport();
      setIsExporting(false);
      setSuccessMessage(`${exportDataType} data exported as ${exportFormat.toUpperCase()}!`);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } else {
      // Fallback to original implementation if no onExport prop
      setTimeout(() => {
        // Add to activities
        const newActivity = {
          id: Date.now().toString(),
          type: 'Export',
          filename: `${exportDataType}_${new Date().toISOString().split('T')[0]}.${exportFormat}`,
          status: 'success',
          date: new Date().toISOString().split('T')[0]
        }

        setDataActivities([newActivity, ...dataActivities])
        setIsExporting(false)
        setSuccessMessage(`${exportDataType} data exported as ${exportFormat.toUpperCase()}!`)
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000)
      }, 1500)
    }
  }

  if (isMobile) {
  return (
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 space-y-4">
        {successMessage && (
          <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {successMessage}
            </span>
            <button onClick={() => setSuccessMessage('')} className="text-green-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21H7C3 21 2 20 2 16V8C2 4 3 3 7 3H17C21 3 22 4 22 8V16C22 20 21 21 17 21Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 12V15" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 8.5V9" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8.5 12H7" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 12H15.5" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14.5 14.5L13 13" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.5 14.5L11 13" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.5 9.5L11 11" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14.5 9.5L13 11" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('Data Operations')}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {/* Import Section */}
          <div className="bg-[#F3F7F3] rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-800">{t('Import Data')}</h4>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 17H15" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6V13" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 13L15 10" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 13L9 10" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".csv,.xlsx,.json"
            />
            <button
                  className="bg-white rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 border border-gray-200"
              onClick={handleImportClick}
            >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 17H15" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V13" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13L15 10" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13L9 10" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
                  {selectedFile ? truncateFilename(selectedFile.name, 15) : t('Select File')}
            </button>
            </div>
              
            <button
                className={`px-3 py-2 text-sm flex items-center gap-2 rounded-lg ${
                  isImporting ? 'bg-gray-200 text-gray-500' : 'bg-[#13A753] text-white hover:bg-[#0F8A44]'
                } transition-colors`}
              onClick={handleImportData}
                disabled={!selectedFile || isImporting}
              >
                {isImporting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    {t('Importing...')}
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 12H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 18V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {t('Import')}
                  </>
                )}
            </button>
          </div>
        </div>
          
          {/* Export Section */}
          <div className="bg-[#F3F7F3] rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-800">{t('Export Data')}</h4>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 17H15" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 13V6" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 10L12 13" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 10L12 13" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
      </div>

            <div className="flex gap-2 mb-3">
              <select
                className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
                value={exportDataType}
                onChange={e => setExportDataType(e.target.value)}
              >
                <option value="">{t('Select Data Type')}</option>
                <option value="clients">{t('Clients Data')}</option>
                <option value="workouts">{t('Workouts')}</option>
                <option value="nutrition">{t('Nutrition Plans')}</option>
                <option value="progress">{t('Progress Reports')}</option>
              </select>
              
              <select
                className="w-1/3 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
                value={exportFormat}
                      onChange={e => setExportFormat(e.target.value)}
              >
                <option value="csv">CSV</option>
                <option value="xlsx">XLSX</option>
                <option value="json">JSON</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
            
            <button
              className={`w-full px-3 py-2 text-sm flex items-center justify-center gap-2 rounded-lg ${
                isExporting || !exportDataType ? 'bg-gray-200 text-gray-500' : 'bg-[#13A753] text-white hover:bg-[#0F8A44]'
              } transition-colors`}
              onClick={handleExportData}
              disabled={!exportDataType || isExporting}
            >
              {isExporting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  {t('Exporting...')}
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 11L22 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              {t('Export Data')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      {successMessage && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center justify-between shadow-sm">
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {successMessage}
          </span>
          <button onClick={() => setSuccessMessage('')} className="text-green-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Import Data Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17H15" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6V13" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 13L15 10" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 13L9 10" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('Import Data')}
          </h3>
          <div className="bg-[#F3F7F3] rounded-2xl p-6">
            <div className="flex flex-col items-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".csv,.xlsx,.json"
              />
              
              <div 
                className={`w-[80px] h-[80px] bg-white rounded-full flex items-center justify-center cursor-pointer
                  transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 ${
                    selectedFile ? 'ring-2 ring-green-500 ring-opacity-50' : ''
                  }`}
                onClick={handleImportClick}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.44 8.8999C20.04 9.2099 21.51 11.0599 21.51 15.1099V15.2399C21.51 19.7099 19.72 21.4999 15.25 21.4999H8.73998C4.26998 21.4999 2.47998 19.7099 2.47998 15.2399V15.1099C2.47998 11.0899 3.92998 9.2399 7.46998 8.9099" stroke={selectedFile ? "#13A753" : "#636363"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15.0001V3.62012" stroke={selectedFile ? "#13A753" : "#636363"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.35 5.85L12 2.5L8.65002 5.85" stroke={selectedFile ? "#13A753" : "#636363"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <div className="text-center">
                <p className="text-gray-700 text-sm mb-1">
                  {selectedFile ? truncateFilename(selectedFile.name, 25) : t('Click to upload your file')}
                </p>
                <p className="text-gray-500 text-xs">
                  {t('Formats supported')}: CSV, XLS, JSON
                </p>
              </div>
              
              <button
                className={`rounded-xl py-3 px-6 text-white text-sm font-medium w-full transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedFile && !isImporting
                    ? 'bg-[#13A753] hover:bg-[#0F8A44] shadow-md hover:shadow-lg' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                onClick={handleImportData}
                disabled={!selectedFile || isImporting}
              >
                {isImporting ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    {t('Importing Data...')}
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 18V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {t('Import Data')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Export Data Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17H15" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 13V6" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 10L12 13" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 10L12 13" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('Export Data')}
          </h3>
          <div className="bg-[#F3F7F3] rounded-2xl p-6">
            <div className="space-y-4">
              <div>
                <label className="text-gray-700 text-sm block mb-2 font-medium">{t('Select Data Type')}</label>
                <select
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#13A753] focus:border-transparent transition-all duration-200"
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
                <label className="text-gray-700 text-sm block mb-2 font-medium">{t('Format')}</label>
                <div className="grid grid-cols-4 gap-2">
                  {['csv', 'xlsx', 'json', 'pdf'].map(format => (
                    <div 
                      key={format}
                      className={`flex items-center justify-center py-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        exportFormat === format 
                          ? 'bg-[#13A753] text-white shadow-md' 
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setExportFormat(format)}
                    >
                      <span className="text-sm font-medium uppercase">{format}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                className={`rounded-xl py-3 px-6 text-white text-sm font-medium w-full mt-6 transition-all duration-300 flex items-center justify-center gap-2 ${
                  exportDataType && !isExporting
                    ? 'bg-[#13A753] hover:bg-[#0F8A44] shadow-md hover:shadow-lg'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                onClick={handleExportData}
                disabled={!exportDataType || isExporting}
              >
                {isExporting ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    {t('Exporting Data...')}
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 11L22 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 2H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {t('Export Data')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to truncate long filenames
const truncateFilename = (filename: string, maxLength: number): string => {
  if (filename.length <= maxLength) return filename
  
  const extension = filename.split('.').pop() || ''
  const name = filename.substring(0, filename.length - extension.length - 1)
  
  if (name.length <= maxLength - 3 - extension.length) {
    return filename
  }
  
  return `${name.substring(0, maxLength - 3 - extension.length)}...${extension}`
}

export default DataImportExport 