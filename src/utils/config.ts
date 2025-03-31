// Configuration settings

/**
 * Test mode configuration
 * - When true, uses mock data instead of making API calls
 * - Useful for development when API is unavailable or for testing UI
 * - In production, this should always be false
 */
export const USE_MOCK_DATA = false; // Always use real API

/**
 * Debug mode configuration
 * - When true, logs additional information to the console
 * - Should be disabled in production
 */
export const DEBUG_MODE = process.env.NODE_ENV !== 'production'; 

/**
 * API Response Parser
 * - Handles different API response formats
 * - Extracts data from various API response structures
 * - Use this to extract arrays from any API response format
 */
export interface ApiResponse {
  result?: boolean;
  message?: unknown[] | string;
  data?: unknown[] | Record<string, unknown>;
  success?: boolean;
  [key: string]: unknown;
}

// Parse API response to extract message data
export function parseApiResponse<T>(data: unknown): T[] {
  // Check if data follows the pattern {result: true, message: [...]}
  if (data && typeof data === 'object') {
    const apiResponse = data as Record<string, unknown>;
    
    if (apiResponse.result === true && Array.isArray(apiResponse.message)) {
      return apiResponse.message as T[];
    }
    
    // Check if data follows the pattern {result: boolean, message: Object}
    if (apiResponse.result === true && typeof apiResponse.message === 'object' && !Array.isArray(apiResponse.message)) {
      return [apiResponse.message as T];
    }
  }
  
  // Default case: return empty array if we can't find data
  console.warn('API response did not match expected format:', data);
  return [];
} 