'use client'

import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useAppContext } from '@/context/AppContext'
import { useTranslation } from 'react-i18next'
import { reportingsApi, traineesApi } from '@/services/fitTrackApi'
import { DEBUG_MODE } from '@/utils/config'
import { useUser } from '@/context/UserContext'

// Define message types
type MessageStatus = 'sent' | 'schedule'
type RecipientType = 'individual' | 'group'

interface Message {
  id: string;
  recipient: string;
  recipientId: string;
  type: RecipientType;
  message: string;
  status: MessageStatus;
  timestamp: string;
}

// API types
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

// Update api response types to include potential error property
interface ApiResponse<T> {
  data?: T;
  error?: string;
  success?: boolean;
}

// Define client interface for consistent access
interface Client {
  id: string;
  name: string;
  [key: string]: unknown;
}

// Define group interface for consistent access
interface Group {
  id: string;
  name: string;
  [key: string]: unknown;
}

// Define message template interface
interface MessageTemplate {
  id: string;
  name: string;
  content: string;
}

export default function WhatsAppAutomationPage() {
  // Get clients and groups from context
  const { clients, groups } = useAppContext()
  const { t } = useTranslation()
  const { profile } = useUser()
  
  // Local state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedRecipient, setSelectedRecipient] = useState('')
  const [selectedRecipientType, setSelectedRecipientType] = useState<RecipientType>('individual')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [messagePreview, setMessagePreview] = useState('')
  
  // Message templates (mock data)
  const messageTemplates: MessageTemplate[] = [
    { id: '1', name: 'Weekly Update', content: 'Hi [CLIENT_NAME], here is your weekly nutrition update. Your progress is great, keep it up!' },
    { id: '2', name: 'Reminder', content: 'Hi [CLIENT_NAME], this is a reminder to update your food diary for today.' },
    { id: '3', name: 'Schedule Change', content: 'Hi [CLIENT_NAME], please note that your next session has been rescheduled to [DATE].' },
    { id: '4', name: 'New Program', content: 'Hi [CLIENT_NAME], your new nutrition program is now available. Please check your dashboard.' }
  ]
  
  // API-related states
  const [apiClients, setApiClients] = useState<ApiTrainee[]>([])
  
  // Helper to get recipient name from ID - moved to top and wrapped in useCallback
  const getRecipientName = useCallback((id: string): string => {
    const client = apiClients.find(c => c.id === id)
    return client ? client.name : 'Unknown'
  }, [apiClients])
  
  // Fetch clients and groups data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch trainees data
        const traineesResponse = await traineesApi.list() as ApiResponse<{trainees: ApiTrainee[]}>
        
        if (traineesResponse && traineesResponse.data?.trainees) {
          setApiClients(traineesResponse.data.trainees)
        } else if (DEBUG_MODE) {
          console.error('Failed to fetch trainees:', traineesResponse?.error || 'Unknown error')
        }
        
        // Fetch reporting data (messages)
        const reportingsResponse = await reportingsApi.list() as ApiResponse<{reportings: ApiReporting[]}>
        
        if (reportingsResponse && reportingsResponse.data?.reportings) {
          // Convert to message format
          const messageData: Message[] = reportingsResponse.data.reportings.map((report: ApiReporting) => ({
            id: report.id,
            recipient: getRecipientName(report.trainee_id),
            recipientId: report.trainee_id,
            type: 'individual',
            message: `Calories: ${report.calories}, Protein: ${report.protein}g, Carbs: ${report.carbs}g, Fat: ${report.fat}g`,
            status: 'sent',
            timestamp: new Date(report.report_date).toLocaleString()
          }))
          
          setMessages(messageData)
        } else if (DEBUG_MODE) {
          console.error('Failed to fetch reportings:', reportingsResponse?.error || 'Unknown error')
          
          // Set empty messages array for now
          setMessages([])
        }
        
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch data')
        setLoading(false)
        if (DEBUG_MODE) {
          console.error('Error fetching data:', err)
        }
      }
    }
    
    fetchData()
  }, [getRecipientName])
  
  // Handle recipient change
  const handleRecipientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (!value) {
      setSelectedRecipient('')
      setSelectedRecipientType('individual')
      return
    }
    
    const [type, id] = value.split(':')
    setSelectedRecipientType(type as RecipientType)
    setSelectedRecipient(id)
    
    // Update message preview with recipient name
    updateMessagePreviewWithRecipient(type as RecipientType, id)
  }
  
  // Update message preview with recipient info
  const updateMessagePreviewWithRecipient = (type: RecipientType, id: string) => {
    let recipientName = ''
    
    if (type === 'individual') {
      // First check the API clients
      const apiClient = apiClients.find(c => c.id === id)
      if (apiClient) {
        recipientName = apiClient.name
      } else {
        // Fall back to context clients
        const contextClient = clients.find(c => c.id === id) as Client | undefined
        if (contextClient) {
          recipientName = contextClient.name
        }
      }
    } else {
      const group = groups.find(g => g.id === id) as Group | undefined
      if (group) {
        recipientName = group.name
      }
    }
    
    updateMessagePreview(recipientName)
  }
  
  // Handle template change
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value
    setSelectedTemplate(templateId)
    
    // Update message preview
    const template = messageTemplates.find(t => t.id === templateId)
    
    if (template && selectedRecipient) {
      updateMessagePreviewWithRecipient(selectedRecipientType, selectedRecipient)
    }
  }
  
  // Update message preview text
  const updateMessagePreview = (recipientName: string) => {
    const template = messageTemplates.find(t => t.id === selectedTemplate)
    if (template) {
      const previewText = template.content.replace('[CLIENT_NAME]', recipientName)
      setMessagePreview(previewText)
    }
  }
  
  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
  }
  
  // Handle sending message now
  const handleSendNow = () => {
    if (!validateForm()) return
    
    // Create new message
    const newMessage = createMessage('sent')
    
    // Add to messages
    setMessages([newMessage, ...messages])
    
    // Reset form
    resetForm()
    
    // Show success
    setError(null)
  }
  
  // Handle scheduling message
  const handleScheduleMessage = () => {
    if (!validateForm()) return
    if (!selectedDate) {
      setError('Please select a date to schedule the message')
      return
    }
    
    // Create new message
    const newMessage = createMessage('schedule')
    
    // Add to messages
    setMessages([newMessage, ...messages])
    
    // Reset form
    resetForm()
    
    // Show success
    setError(null)
  }
  
  // Create message object
  const createMessage = (status: MessageStatus): Message => {
    const template = messageTemplates.find(t => t.id === selectedTemplate)
    let recipientName = ''
    
    if (selectedRecipientType === 'individual') {
      const client = clients.find(c => c.id === selectedRecipient) as Client | undefined
      if (client) {
        recipientName = client.name
      }
    } else {
      const group = groups.find(g => g.id === selectedRecipient) as Group | undefined
      if (group) {
        recipientName = group.name
      }
    }
    
    return {
      id: `msg-${Date.now()}`,
      recipient: recipientName,
      recipientId: selectedRecipient,
      type: selectedRecipientType,
      message: messagePreview || (template?.content || ''),
      status,
      timestamp: status === 'sent' 
        ? new Date().toLocaleString() 
        : new Date(selectedDate).toLocaleString()
    }
  }
  
  // Validate form
  const validateForm = () => {
    if (!selectedRecipient) {
      setError('Please select a recipient')
      return false
    }
    
    if (!selectedTemplate) {
      setError('Please select a message template')
      return false
    }
    
    return true
  }
  
  // Reset form
  const resetForm = () => {
    setSelectedRecipient('')
    setSelectedTemplate('')
    setSelectedDate('')
    setMessagePreview('')
    setSelectedRecipientType('individual')
  }
  
  // Handle creating a template
  const handleCreateTemplate = () => {
    console.log('Create template modal should open')
  }
  
  // Filter messages based on search term
  const filteredMessages = messages.filter(message => 
    message.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Automation page icon 
  const automationIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 2.43994V12.4199C17 14.3899 15.59 15.1599 13.86 14.1199L12.54 13.3299C12.24 13.1499 11.76 13.1499 11.46 13.3299L10.14 14.1199C8.41 15.1499 7 14.3899 7 12.4199V2.43994" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 2.43994V12.4199C17 14.3899 15.59 15.1599 13.86 14.1199L12.54 13.3299C12.24 13.1499 11.76 13.1499 11.46 13.3299L10.14 14.1199C8.41 15.1499 7 14.3899 7 12.4199V2.43994" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  // WhatsApp Content Grid
  const whatsAppContentGrid = (
    <>
      {/* Message Form */}
      <div>
        <div className="bg-white p-6 rounded-[20px] shadow">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 10V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H14" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.5 7C20.8807 7 22 5.88071 22 4.5C22 3.11929 20.8807 2 19.5 2C18.1193 2 17 3.11929 17 4.5C17 5.88071 18.1193 7 19.5 7Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.9965 11H16.0054" stroke="#13A753" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.9955 11H12.0045" stroke="#13A753" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.99451 11H8.00349" stroke="#13A753" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('automation.newMessage')}
          </h2>
          
          {/* Recipient Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('automation.recipient')}</label>
            <select 
              value={selectedRecipient ? `${selectedRecipientType}:${selectedRecipient}` : ''}
              onChange={handleRecipientChange}
              className="w-full p-3 border border-gray-300 rounded-[10px] focus:ring-[#13A753] focus:border-[#13A753] shadow-sm"
            >
              <option value="">{t('automation.selectRecipient')}</option>
              <optgroup label={t('automation.individuals')}>
                {apiClients.length > 0 
                  ? apiClients.map(client => (
                      <option key={`individual-${client.id}`} value={`individual:${client.id}`}>
                        {client.name}
                      </option>
                    ))
                  : clients.map(client => (
                      <option key={`individual-${client.id}`} value={`individual:${client.id}`}>
                        {client.name}
                      </option>
                    ))}
              </optgroup>
              <optgroup label={t('automation.groups')}>
                {groups.map(group => (
                  <option key={`group-${group.id}`} value={`group:${group.id}`}>
                    {group.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          
          {/* Template Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('automation.template')}</label>
            <select 
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="w-full p-3 border border-gray-300 rounded-[10px] focus:ring-[#13A753] focus:border-[#13A753] shadow-sm"
            >
              <option value="">{t('automation.selectTemplate')}</option>
              {messageTemplates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Message Preview */}
          {messagePreview && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('automation.messagePreview')}</label>
              <div className="bg-gray-50 p-4 rounded-[10px] border border-gray-200 min-h-[100px]">
                {messagePreview}
              </div>
            </div>
          )}
          
          {/* Schedule Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('automation.scheduleDate')}</label>
            <input 
              type="datetime-local" 
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full p-3 border border-gray-300 rounded-[10px] focus:ring-[#13A753] focus:border-[#13A753] shadow-sm"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSendNow}
              className="flex-1 bg-[#13A753] text-white py-3 px-4 rounded-[10px] hover:bg-[#0F8A44] flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.51002 4.23001L18.07 8.51001C21.91 10.43 21.91 13.57 18.07 15.49L9.51002 19.77C3.75002 22.65 1.40002 20.29 4.28002 14.54L5.15002 12.81C5.37002 12.37 5.37002 11.64 5.15002 11.2L4.28002 9.46001C1.40002 3.71001 3.76002 1.35001 9.51002 4.23001Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.44 12H10.84" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('automation.sendNow')}
            </button>
            <button
              onClick={handleScheduleMessage}
              className="flex-1 bg-white border border-[#13A753] text-[#13A753] py-3 px-4 rounded-[10px] hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V5" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V5" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 9.09H20.5" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.6947 13.7H15.7037" stroke="#13A753" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.6947 16.7H15.7037" stroke="#13A753" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9955 13.7H12.0045" stroke="#13A753" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9955 16.7H12.0045" stroke="#13A753" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.29431 13.7H8.30329" stroke="#13A753" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.29431 16.7H8.30329" stroke="#13A753" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('automation.schedule')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Message History */}
      <div className="lg:col-span-2">
        <div className="bg-white p-6 rounded-[20px] shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.7399V4.66994C22 3.46994 21.02 2.57994 19.83 2.67994H19.77C17.67 2.85994 14.48 3.92994 12.7 5.04994L12.53 5.15994C12.24 5.33994 11.76 5.33994 11.47 5.15994L11.22 5.00994C9.44 3.89994 6.26 2.83994 4.16 2.66994C2.97 2.56994 2 3.46994 2 4.65994V16.7399C2 17.6999 2.78 18.5999 3.74 18.7199L4.03 18.7599C6.2 19.0499 9.55 20.1499 11.47 21.1999L11.51 21.2199C11.78 21.3699 12.21 21.3699 12.47 21.2199C14.39 20.1599 17.75 19.0499 19.93 18.7599L20.26 18.7199C21.22 18.5999 22 17.6999 22 16.7399Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5.48999V20.49" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.75 8.48999H5.5" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.5 11.49H5.5" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('automation.messageHistory')}
            </h2>
            
            <div className="flex items-center">
              <button className="text-sm text-[#13A753] hover:underline flex items-center gap-1 mr-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 13V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H13" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.7504 16.8H20.7004" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M18.7344 18.8V14.8" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10.4902 2.23L14.8402 6.58" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.4902 6.58V2.23" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t('automation.bulkActions')}
              </button>
              
              <button className="text-sm text-[#13A753] hover:underline flex items-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 12.05C2 13.06 2.42 13.98 3.13 14.68L4.96 16.51C6.67 18.22 8.67 19.63 10.83 20.59L11.59 20.95C12.76 21.48 14.11 21.48 15.28 20.95L16.04 20.59C18.2 19.62 20.2 18.22 21.91 16.51L23.74 14.68C24.45 13.97 24.87 13.06 24.87 12.05C24.87 11.04 24.45 10.12 23.74 9.42L21.91 7.59C20.2 5.88 18.2 4.47 16.04 3.52L15.28 3.16C14.11 2.63 12.76 2.63 11.59 3.16L10.83 3.52C8.67 4.48 6.67 5.89 4.96 7.59L3.13 9.42C2.42 10.13 2 11.04 2 12.05Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.5 12H15.5" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15.5V8.5" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Message List */}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 2.43994V12.4199C17 14.3899 15.59 15.1599 13.86 14.1199L12.54 13.3299C12.24 13.1499 11.76 13.1499 11.46 13.3299L10.14 14.1199C8.41 15.1499 7 14.3899 7 12.4199V2.43994" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="mt-2">{t('automation.noMessages')}</p>
            </div>
          ) : (
            <>
              {/* Status Filter Pills */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2 flex-wrap">
                <button className="px-3 py-1 bg-[#13A753] text-white rounded-full text-sm">
                  {t('automation.selectAll')}
                </button>
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {t('automation.sent')}
                </button>
                <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                  {t('automation.scheduled')}
                </button>
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {t('automation.delivered')}
                </button>
                <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {t('automation.read')}
                </button>
                <button className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  {t('automation.failed')}
                </button>
              </div>
              
              {/* Messages Table */}
              <div className="overflow-hidden border border-gray-200 rounded-[10px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 bg-gray-50 p-4 font-medium text-gray-700 border-b">
                  <div className="col-span-4">{t('automation.recipient')}</div>
                  <div className="col-span-4">{t('automation.message')}</div>
                  <div className="col-span-2">{t('automation.status')}</div>
                  <div className="col-span-2">{t('automation.timestamp')}</div>
                </div>
                
                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {messages.map(message => (
                    <div key={message.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors items-center">
                      <div className="col-span-4 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#F3F7F3] flex items-center justify-center mr-2">
                          {message.type === 'individual' ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#13A753"/>
                              <path d="M12 22C16.4183 22 20 21 20 17C20 13 16.4183 12 12 12C7.58172 12 4 13 4 17C4 21 7.58172 22 12 22Z" fill="#13A753"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z" fill="#13A753"/>
                              <path d="M24 20.5C24 24.09 18.09 24 12 24C5.91 24 0 24.09 0 20.5C0 16.91 5.91 17 12 17C18.09 17 24 16.91 24 20.5Z" fill="#13A753"/>
                            </svg>
                          )}
                        </div>
                        <span className="text-sm font-medium">{message.recipient}</span>
                      </div>
                      <div className="col-span-4 text-sm overflow-hidden line-clamp-2">{message.message}</div>
                      <div className="col-span-2">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          message.status === 'sent' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {message.status}
                        </span>
                      </div>
                      <div className="col-span-2 text-xs text-gray-500">{message.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )

  // Mobile content
  const mobileContent = (
    <>
      {/* Error message if any */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded relative text-sm">
          <span className="block">{error}</span>
        </div>
      )}
      
      {/* Mobile search */}
      <div className="mb-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5 17.5L12.5001 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <input 
            type="text" 
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-[10px] leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder={t('automation.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Mobile actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleCreateTemplate}
          className="flex-1 bg-white flex items-center justify-center gap-1 py-2 px-3 rounded-[10px] text-[#636363] text-sm hover:bg-gray-100"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2V5" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 2V5" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.5 9.09H20.5" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{t('automation.createTemplate')}</span>
        </button>
        
        <button
          className="flex-1 bg-[#13A753] text-white flex items-center justify-center gap-1 py-2 px-3 rounded-[10px] text-sm hover:bg-[#0F8A44]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 10V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H14" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.5 7C20.8807 7 22 5.88071 22 4.5C22 3.11929 20.8807 2 19.5 2C18.1193 2 17 3.11929 17 4.5C17 5.88071 18.1193 7 19.5 7Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{t('automation.newMessage')}</span>
        </button>
      </div>
      
      {/* Message Form - Mobile */}
      <div className="bg-white p-4 rounded-[15px] shadow mb-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 10V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H14" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.5 7C20.8807 7 22 5.88071 22 4.5C22 3.11929 20.8807 2 19.5 2C18.1193 2 17 3.11929 17 4.5C17 5.88071 18.1193 7 19.5 7Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('automation.newMessage')}
        </h2>
        
        {/* Recipient Selection */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('automation.recipient')}</label>
          <select 
            value={selectedRecipient ? `${selectedRecipientType}:${selectedRecipient}` : ''}
            onChange={handleRecipientChange}
            className="w-full p-2.5 border border-gray-300 rounded-[10px] text-sm focus:ring-[#13A753] focus:border-[#13A753] shadow-sm"
          >
            <option value="">{t('automation.selectRecipient')}</option>
            <optgroup label={t('automation.individuals')}>
              {apiClients.length > 0 
                ? apiClients.map(client => (
                    <option key={`individual-${client.id}`} value={`individual:${client.id}`}>
                      {client.name}
                    </option>
                  ))
                : clients.map(client => (
                    <option key={`individual-${client.id}`} value={`individual:${client.id}`}>
                      {client.name}
                    </option>
                  ))}
            </optgroup>
            <optgroup label={t('automation.groups')}>
              {groups.map(group => (
                <option key={`group-${group.id}`} value={`group:${group.id}`}>
                  {group.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
        
        {/* Template Selection */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('automation.template')}</label>
          <select 
            value={selectedTemplate}
            onChange={handleTemplateChange}
            className="w-full p-2.5 border border-gray-300 rounded-[10px] text-sm focus:ring-[#13A753] focus:border-[#13A753] shadow-sm"
          >
            <option value="">{t('automation.selectTemplate')}</option>
            {messageTemplates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Message Preview */}
        {messagePreview && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('automation.messagePreview')}</label>
            <div className="bg-gray-50 p-3 rounded-[10px] border border-gray-200 text-sm min-h-[80px]">
              {messagePreview}
            </div>
          </div>
        )}
        
        {/* Schedule Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('automation.scheduleDate')}</label>
          <input 
            type="datetime-local" 
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full p-2.5 border border-gray-300 rounded-[10px] text-sm focus:ring-[#13A753] focus:border-[#13A753] shadow-sm"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleSendNow}
            className="flex-1 bg-[#13A753] text-white py-2.5 px-3 rounded-[10px] text-sm flex items-center justify-center gap-1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.51002 4.23001L18.07 8.51001C21.91 10.43 21.91 13.57 18.07 15.49L9.51002 19.77C3.75002 22.65 1.40002 20.29 4.28002 14.54L5.15002 12.81C5.37002 12.37 5.37002 11.64 5.15002 11.2L4.28002 9.46001C1.40002 3.71001 3.76002 1.35001 9.51002 4.23001Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.44 12H10.84" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('automation.sendNow')}
          </button>
          <button
            onClick={handleScheduleMessage}
            className="flex-1 bg-white border border-[#13A753] text-[#13A753] py-2.5 px-3 rounded-[10px] text-sm flex items-center justify-center gap-1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V5" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 2V5" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.5 9.09H20.5" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#13A753" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('automation.schedule')}
          </button>
        </div>
      </div>
      
      {/* Message History - Mobile */}
      <div className="bg-white p-4 rounded-[15px] shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-1.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.7399V4.66994C22 3.46994 21.02 2.57994 19.83 2.67994H19.77C17.67 2.85994 14.48 3.92994 12.7 5.04994L12.53 5.15994C12.24 5.33994 11.76 5.33994 11.47 5.15994L11.22 5.00994C9.44 3.89994 6.26 2.83994 4.16 2.66994C2.97 2.56994 2 3.46994 2 4.65994V16.7399C2 17.6999 2.78 18.5999 3.74 18.7199L4.03 18.7599C6.2 19.0499 9.55 20.1499 11.47 21.1999L11.51 21.2199C11.78 21.3699 12.21 21.3699 12.47 21.2199C14.39 20.1599 17.75 19.0499 19.93 18.7599L20.26 18.7199C21.22 18.5999 22 17.6999 22 16.7399Z" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 5.48999V20.49" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.75 8.48999H5.5" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.5 11.49H5.5" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('automation.messageHistory')}
          </h2>
          
          <button className="text-sm text-[#13A753] flex items-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 13V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H13" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.7504 16.8H20.7004" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M18.7344 18.8V14.8" stroke="#13A753" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        
        {/* Status Filter Pills - Mobile */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-2 -mx-1 px-1">
          <button className="px-2 py-1 bg-[#13A753] text-white rounded-full text-xs flex-shrink-0">
            {t('automation.selectAll')}
          </button>
          <button className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex-shrink-0">
            {t('automation.sent')}
          </button>
          <button className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs flex-shrink-0">
            {t('automation.scheduled')}
          </button>
        </div>
        
        {/* Message List */}
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 2.43994V12.4199C17 14.3899 15.59 15.1599 13.86 14.1199L12.54 13.3299C12.24 13.1499 11.76 13.1499 11.46 13.3299L10.14 14.1199C8.41 15.1499 7 14.3899 7 12.4199V2.43994" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="mt-2 text-sm">{t('automation.noMessages')}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 -mx-4 border-t border-gray-200">
            {filteredMessages.map(message => (
              <div key={message.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="w-7 h-7 rounded-full bg-[#F3F7F3] flex items-center justify-center mr-2">
                      {message.type === 'individual' ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#13A753"/>
                          <path d="M12 22C16.4183 22 20 21 20 17C20 13 16.4183 12 12 12C7.58172 12 4 13 4 17C4 21 7.58172 22 12 22Z" fill="#13A753"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z" fill="#13A753"/>
                          <path d="M24 20.5C24 24.09 18.09 24 12 24C5.91 24 0 24.09 0 20.5C0 16.91 5.91 17 12 17C18.09 17 24 16.91 24 20.5Z" fill="#13A753"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium">{message.recipient}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    message.status === 'sent' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {message.status}
                  </span>
                </div>
                <div className="mt-2 text-sm pl-9 line-clamp-2">{message.message}</div>
                <div className="mt-1 text-xs text-gray-500 pl-9">{message.timestamp}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )

  // If loading, show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-white">Loading data...</div>
      </div>
    )
  }

  return (
    <DashboardLayout
      pageTitle={t('automation.header')}
      pageIcon={automationIcon}
      profileName={profile.name || "Alex Dube"}
      profileRole="admin"
      notificationCount={3}
    >
      {/* Desktop View */}
      <div className="hidden lg:block">
        {whatsAppContentGrid}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        {mobileContent}
      </div>
    </DashboardLayout>
  )
}