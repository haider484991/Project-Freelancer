import axios from 'axios';
import { USE_MOCK_DATA } from '@/utils/config';
import {
  mockLoginApi,
  mockDashboardApi,
  mockSettingsApi,
  mockReportingsApi,
  mockGroupsApi,
  mockTraineesApi
} from './mockApiService';

// Create axios instance using our proxy endpoint instead of the direct API URL
const fitTrackApi = axios.create({
  baseURL: '/api/proxy', // Use relative URL to our proxy endpoint
  headers: {
    'Content-Type': 'application/json',
  },
});

// API module functions with ability to switch between real and mock APIs
export const loginApi = USE_MOCK_DATA 
  ? mockLoginApi 
  : {
    requestOtp: (phone: string) => {
      return fitTrackApi.post('', {
        mdl: 'login',
        act: 'otp',
        phone
      });
    },
    verifyOtp: (phone: string, code: string) => {
      return fitTrackApi.post('', {
        mdl: 'login',
        act: 'verify',
        phone,
        code
      });
    },
    logout: () => {
      return fitTrackApi.post('', {
        mdl: 'login',
        act: 'logout'
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
    set: (settingsData: {
      company_name?: string;
      email?: string;
      phone?: string;
      address?: string;
      logo_url?: string;
      default_target_calories?: string;
      default_protein_ratio?: string;
      default_carbs_ratio?: string;
      default_fat_ratio?: string;
      language?: string;
      theme?: string;
      notifications_enabled?: string;
      auto_save?: string;
      data_retention?: string;
      dark_mode?: string;
      [key: string]: unknown;
    }) => {
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
        mdl: 'settings',
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