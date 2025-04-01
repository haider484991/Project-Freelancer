import axios from 'axios';
import { USE_MOCK_DATA } from '@/utils/config';
// Fix mock imports - comment these out if mock services don't exist
// or create a mock directory and files if needed
/*
import {
  mockLoginApi,
  mockDashboardApi,
  mockSettingsApi,
  mockReportingsApi,
  mockGroupsApi,
  mockTraineesApi
} from './mockApiService';
*/

// Create axios instance using our proxy endpoint instead of the direct API URL
const fitTrackApi = axios.create({
  baseURL: '/api/proxy', // Use relative URL to our proxy endpoint
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Ensure cookies are sent with all requests
  // Add timeout for all requests
  timeout: 15000, // 15 seconds
});

// Add request interceptor for logging
fitTrackApi.interceptors.request.use(
  (config) => {
    // Get user data from localStorage if available
    const userPhone = typeof window !== 'undefined' ? 
      localStorage.getItem('user_phone') : null;
    const userId = typeof window !== 'undefined' ? 
      localStorage.getItem('user_id') : null;
    const userType = typeof window !== 'undefined' ?
      localStorage.getItem('user_type') || 'coach' : 'coach';
    const isLoggedIn = typeof window !== 'undefined' ? 
      localStorage.getItem('is_logged_in') === 'true' : false;
    
    // Try to get access token from multiple sources for reliability
    let accessToken = null;
    
    // First try localStorage
    if (typeof window !== 'undefined') {
      accessToken = localStorage.getItem('access_token');
    }
    
    // If not in localStorage, try cookies
    if (!accessToken && typeof document !== 'undefined') {
      const matches = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
      if (matches) {
        accessToken = matches[2];
        // If found in cookie but not in localStorage, store it there too
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', accessToken);
        }
      }
    }
    
    // Add access token to authorization header if available
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
      console.log('[API Client] Added access token to authorization header');
    } else if (isLoggedIn) {
      console.warn('[API Client] No access token found for request');
    }
    
    // Add user data to request if it's a POST request with data
    if (config.method === 'post' && config.data) {
      try {
        const data = typeof config.data === 'string' ? 
          JSON.parse(config.data) : config.data;
        
        // The user_type is critical for all requests to this API
        if (!data.user_type) {
          data.user_type = userType;
          console.log('[API Client] Added user_type to request:', userType);
        }
          
        // Add access token for all requests except login
        if (data.mdl !== 'login') {
          if (accessToken) {
            data.access_token = accessToken;
            console.log('[API Client] Added access token to request:', accessToken);
          } else if (isLoggedIn) {
            console.warn('[API Client] No access token found for request');
          }
        }
        
        // Add phone if not already included - ESSENTIAL for this API
        if (userPhone && !data.phone) {
          data.phone = userPhone.trim();
        }
        
        // Add user_id if not already included
        if (userId && !data.user_id) {
          data.user_id = userId;
        } else if (userPhone && !data.user_id) {
          // Use phone as user_id if none provided
          data.user_id = userPhone.trim();
        }
        
        // Add session indicator
        data.session_active = true;

        // Handle id parameter based on action type
        if (!data.id) {
          if (data.act === 'list') {
            // List operations don't need an id
            data.id = undefined;
          } else if (data.act === 'get') {
            // Get operations need 'all' as id
            data.id = 'all';
          } else if (data.act === 'del') {
            // Delete operations need an id
            data.id = '1'; // Default ID for delete
          } else {
            // Other operations (like set) don't need an id
            data.id = undefined;
          }
        }
        
        config.data = typeof config.data === 'string' ? 
          JSON.stringify(data) : data;
          
        console.log('[API Client] Request data:', {
          hasAccessToken: !!data.access_token,
          hasPhone: !!data.phone,
          hasUserId: !!data.user_id,
          isLoggedIn,
          mdl: data.mdl,
          act: data.act
        });
      } catch (e) {
        console.error('[API Client] Error handling request data:', e);
      }
    }
    
    // Log outgoing requests (without sensitive data)
    if (process.env.NODE_ENV !== 'production') {
      console.log('[API Client] Request:', {
        url: config.url,
        method: config.method,
        hasSessionCookie: !!document.cookie.match(/PHPSESSID=/),
        hasAccessToken: !!accessToken,
        hasPhone: !!userPhone,
        hasUserId: !!userId,
        isLoggedIn
      });
    }
    
    return config;
  },
  (error) => {
    console.error('[API Client] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
fitTrackApi.interceptors.response.use(
  (response) => {
    // Log successful responses
    if (process.env.NODE_ENV !== 'production') {
      console.log('[API Client] Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        hasSessionCookie: !!document.cookie.match(/PHPSESSID=/),
        data: response.data
      });
    }
    
    // Handle specific coach not found error
    if (response.data?.error === 'coach not found. please re-login' || 
        (response.data?.result === false && response.data?.error === 'coach not found. please re-login')) {
      console.error('[API Client] Coach not found error detected');
      
      // Don't automatically clear login state here - let config.ts handle the redirect
      // This prevents loops and duplicate redirects
      return response;
    }
    
    // Don't automatically redirect on login required errors
    // Just log them for debugging purposes
    if (response.data?.error === 'login required' || 
        (response.data?.result === false && response.data?.error === 'login required')) {
      console.log('[API Client] Authentication warning: Login required');
      
      // Check if we have credentials before deciding to clear login state
      const accessToken = localStorage.getItem('access_token');
      const userPhone = localStorage.getItem('user_phone');
      
      // Only clear login state and redirect if we don't have credentials
      // This prevents unnecessary logouts during normal operation
      if (!accessToken && !userPhone) {
        console.error('[API Client] No credentials found - clearing login state');
        
        // Clear login state
        if (typeof window !== 'undefined') {
          localStorage.removeItem('is_logged_in');
          localStorage.removeItem('user_phone');
          localStorage.removeItem('user_id');
        }
        
        // Redirect to login page if not already there
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          console.error('[API Client] Redirecting to login');
          window.location.href = '/login';
        }
      } else {
        console.log('[API Client] Credentials exist - not clearing login state');
      }
    }
    
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('[API Client] Response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('[API Client] Network error:', {
        message: 'No response received',
        url: error.config?.url,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('[API Client] Error:', error.message);
    }

    // Propagate error with additional context
    return Promise.reject(error);
  }
);

// Create mock API services if USE_MOCK_DATA is true
const mockLoginApi = USE_MOCK_DATA ? {
  requestOtp: () => Promise.resolve({ data: { result: true, message: "OTP sent" } }),
  verifyOtp: () => Promise.resolve({ data: { result: true, user_id: "123", access_token: "mock_token" } }),
  logout: () => Promise.resolve({ data: { result: true } })
} : null;

const mockDashboardApi = USE_MOCK_DATA ? {
  get: () => Promise.resolve({ data: { result: true, message: "Dashboard data" } })
} : null;

const mockSettingsApi = USE_MOCK_DATA ? {
  get: () => Promise.resolve({ data: { result: true, message: [] } }),
  getUserSettings: () => Promise.resolve({ data: { result: true, message: [] } }),
  set: () => Promise.resolve({ data: { result: true } }),
  changePassword: () => Promise.resolve({ data: { result: true } })
} : null;

const mockReportingsApi = USE_MOCK_DATA ? {
  list: () => Promise.resolve({ data: { result: true, message: [] } }),
  get: () => Promise.resolve({ data: { result: true, message: [] } })
} : null;

const mockGroupsApi = USE_MOCK_DATA ? {
  list: () => Promise.resolve({ data: { result: true, message: [] } }),
  get: () => Promise.resolve({ data: { result: true, message: [] } }),
  set: () => Promise.resolve({ data: { result: true } }),
  delete: () => Promise.resolve({ data: { result: true } })
} : null;

const mockTraineesApi = USE_MOCK_DATA ? {
  list: () => Promise.resolve({ data: { result: true, message: [] } }),
  get: () => Promise.resolve({ data: { result: true, message: [] } }),
  set: () => Promise.resolve({ data: { result: true } }),
  delete: () => Promise.resolve({ data: { result: true } })
} : null;

// API module functions with ability to switch between real and mock APIs
export const loginApi = USE_MOCK_DATA 
  ? mockLoginApi 
  : {
    requestOtp: (phone: string) => {
      return fitTrackApi.post('', {
        mdl: 'login',
        act: 'otp',
        phone,
        id: 'all',
        user_type: 'coach'
      });
    },
    verifyOtp: async (phone: string, code: string) => {
      try {
        const response = await fitTrackApi.post('', {
          mdl: 'login',
          act: 'verify',
          phone,
          code,
          id: 'all',
          user_type: 'coach'
        });
        
        // Store access token in multiple places if verification was successful
        if (response.data?.result === true) {
          if (response.data?.access_token) {
            console.log('Storing access token from verification response');
            localStorage.setItem('access_token', response.data.access_token);
            
            // Also store in a cookie for redundancy
            document.cookie = `access_token=${response.data.access_token}; path=/; max-age=2592000; SameSite=Lax`;
          } else {
            console.warn('No access token in verification response');
          }
        }
        
        return response;
      } catch (error) {
        console.error('Error during OTP verification:', error);
        throw error;
      }
    },
    logout: () => {
      // Clear access token on logout
      localStorage.removeItem('access_token');
      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return fitTrackApi.post('', {
        mdl: 'login',
        act: 'logout',
        id: 'all'
      });
    }
  };

export const dashboardApi = USE_MOCK_DATA 
  ? mockDashboardApi 
  : {
    get: () => {
      return fitTrackApi.post('', {
        mdl: 'dashboard',
        act: 'get'
      });
    }
  };

export const settingsApi = USE_MOCK_DATA 
  ? mockSettingsApi 
  : {
    get: () => {
      return fitTrackApi.post('', {
        mdl: 'settings',
        act: 'get'
      });
    },
    getUserSettings: () => {
      return fitTrackApi.post('', {
        mdl: 'users',
        act: 'get_settings'
      });
    },
    set: (settingsData: Record<string, string>) => {
      return fitTrackApi.post('', {
        mdl: 'settings',
        act: 'set',
        ...settingsData
      });
    },
    changePassword: (passwordData: {
      current_password: string;
      new_password: string;
    }) => {
      return fitTrackApi.post('', {
        mdl: 'users',
        act: 'change_password',
        ...passwordData
      });
    }
  };

export const reportingsApi = USE_MOCK_DATA 
  ? mockReportingsApi 
  : {
    list: (search = '') => {
      return fitTrackApi.post('', {
        mdl: 'reportings',
        act: 'list',
        search
      });
    },
    get: (id: string) => {
      // Pass through the id parameter
      return fitTrackApi.post('', {
        mdl: 'reportings',
        act: 'get',
        id
      });
    }
  };

export const groupsApi = USE_MOCK_DATA 
  ? mockGroupsApi 
  : {
    list: (search = '') => {
      return fitTrackApi.post('', {
        mdl: 'groups',
        act: 'list',
        search
      });
    },
    get: (id: string) => {
      // Pass through the id parameter
      return fitTrackApi.post('', {
        mdl: 'groups',
        act: 'get',
        id
      });
    },
    set: (groupData: {
      name: string,
      dietary_guidelines: string,
      weekly_menu: string,
      id?: string
    }) => {
      return fitTrackApi.post('', {
        mdl: 'groups',
        act: 'set',
        ...groupData
      });
    },
    delete: (id: string) => {
      return fitTrackApi.post('', {
        mdl: 'groups',
        act: 'del',
        id
      });
    }
  };

export const traineesApi = USE_MOCK_DATA 
  ? mockTraineesApi 
  : {
    list: (search = '') => {
      return fitTrackApi.post('', {
        mdl: 'trainees',
        act: 'list',
        search
      });
    },
    get: (id: string) => {
      // Pass through the id parameter
      return fitTrackApi.post('', {
        mdl: 'trainees',
        act: 'get',
        id
      });
    },
    set: (traineeData: {
      name: string,
      email: string,
      phone: string,
      group_id: string,
      target_calories: string,
      target_weight: string,
      gender: string,
      is_active: string,
      id?: string
    }) => {
      return fitTrackApi.post('', {
        mdl: 'trainees',
        act: 'set',
        ...traineeData
      });
    },
    delete: (id: string) => {
      return fitTrackApi.post('', {
        mdl: 'trainees',
        act: 'del',
        id
      });
    }
  };

// Instead of anonymous default export, assign to a variable first
const fitTrackApiExports = {
  login: loginApi,
  dashboard: dashboardApi,
  settings: settingsApi,
  reportings: reportingsApi,
  groups: groupsApi,
  trainees: traineesApi
};

export default fitTrackApiExports; 