import { 
  mockDashboardData, 
  mockGroupsData, 
  mockTraineesData, 
  mockReportingsData, 
  mockSettingsData 
} from './mockData';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service - mimics the same interface as the real API
export const mockLoginApi = {
  requestOtp: async (phone: string) => {
    await delay(500); // Simulate network delay
    return { data: { success: true, message: 'OTP sent successfully' } };
  },
  verifyOtp: async (phone: string, code: string) => {
    await delay(500);
    return { data: { success: true, token: 'mock_token_12345' } };
  },
  logout: async () => {
    await delay(300);
    return { data: { success: true } };
  }
};

export const mockDashboardApi = {
  get: async () => {
    await delay(800);
    return { data: mockDashboardData };
  }
};

export const mockSettingsApi = {
  get: async () => {
    await delay(600);
    return { data: mockSettingsData };
  },
  set: async (settingsData: any) => {
    await delay(800);
    
    // Simulate saving settings
    return { 
      data: { 
        success: true, 
        message: 'Settings updated successfully',
        settings: {
          ...mockSettingsData.settings,
          ...settingsData
        }
      }
    };
  },
  changePassword: async (passwordData: any) => {
    await delay(700);
    
    // Simple validation
    if (!passwordData.current_password || !passwordData.new_password) {
      return { 
        data: { 
          success: false, 
          message: 'Missing required password fields'
        }
      };
    }
    
    // Simulate successful password change
    return { 
      data: { 
        success: true, 
        message: 'Password changed successfully'
      }
    };
  }
};

export const mockReportingsApi = {
  list: async (search = '') => {
    await delay(700);
    
    // If search provided, filter reports
    if (search) {
      const filteredReports = mockReportingsData.reportings.filter(report => 
        report.trainee_id.includes(search)
      );
      return { data: { reportings: filteredReports } };
    }
    
    return { data: mockReportingsData };
  },
  get: async (id: string) => {
    await delay(500);
    
    const report = mockReportingsData.reportings.find(r => r.id === id);
    
    if (report) {
      return { data: { reporting: report } };
    }
    
    return { 
      data: { 
        error: 'Report not found',
        success: false
      }
    };
  }
};

export const mockGroupsApi = {
  list: async (search = '') => {
    await delay(600);
    
    // If search provided, filter groups
    if (search) {
      const filteredGroups = mockGroupsData.groups.filter(group => 
        group.name.toLowerCase().includes(search.toLowerCase())
      );
      return { data: { groups: filteredGroups } };
    }
    
    return { data: mockGroupsData };
  },
  get: async (id: string) => {
    await delay(500);
    
    const group = mockGroupsData.groups.find(g => g.id === id);
    
    if (group) {
      return { data: { group } };
    }
    
    return { 
      data: { 
        error: 'Group not found',
        success: false
      }
    };
  },
  set: async (groupData: any) => {
    await delay(800);
    
    if (groupData.id) {
      // Update existing group (simulate)
      return { 
        data: { 
          success: true, 
          message: 'Group updated successfully',
          group_id: groupData.id
        }
      };
    } else {
      // Create new group (simulate)
      return { 
        data: { 
          success: true, 
          message: 'Group created successfully',
          group_id: (mockGroupsData.groups.length + 1).toString()
        }
      };
    }
  },
  delete: async (id: string) => {
    await delay(700);
    
    return { 
      data: { 
        success: true, 
        message: 'Group deleted successfully'
      }
    };
  }
};

export const mockTraineesApi = {
  list: async (search = '') => {
    await delay(700);
    
    // If search provided, filter trainees
    if (search) {
      const filteredTrainees = mockTraineesData.trainees.filter(trainee => 
        trainee.name.toLowerCase().includes(search.toLowerCase()) ||
        trainee.email.toLowerCase().includes(search.toLowerCase()) ||
        trainee.phone.includes(search)
      );
      return { data: { trainees: filteredTrainees } };
    }
    
    return { data: mockTraineesData };
  },
  get: async (id: string) => {
    await delay(500);
    
    const trainee = mockTraineesData.trainees.find(t => t.id === id);
    
    if (trainee) {
      return { data: { trainee } };
    }
    
    return { 
      data: { 
        error: 'Trainee not found',
        success: false
      }
    };
  },
  set: async (traineeData: any) => {
    await delay(800);
    
    if (traineeData.id) {
      // Update existing trainee (simulate)
      return { 
        data: { 
          success: true, 
          message: 'Trainee updated successfully',
          trainee_id: traineeData.id
        }
      };
    } else {
      // Create new trainee (simulate)
      return { 
        data: { 
          success: true, 
          message: 'Trainee created successfully',
          trainee_id: (mockTraineesData.trainees.length + 1).toString()
        }
      };
    }
  },
  delete: async (id: string) => {
    await delay(700);
    
    return { 
      data: { 
        success: true, 
        message: 'Trainee deleted successfully'
      }
    };
  }
};

export default {
  login: mockLoginApi,
  dashboard: mockDashboardApi,
  settings: mockSettingsApi,
  reportings: mockReportingsApi,
  groups: mockGroupsApi,
  trainees: mockTraineesApi
}; 