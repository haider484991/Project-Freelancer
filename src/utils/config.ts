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
    
    // Check if response indicates an error
    if (apiResponse.result === false && apiResponse.error) {
      const errorMessage = apiResponse.error as string;
      console.warn(`API error: ${errorMessage}`);
      
      // Handle coach not found errors by triggering re-login
      if (errorMessage.includes('coach not found') || errorMessage.includes('re-login')) {
        console.error('Coach not found error detected - redirecting to login');
        
        // Only redirect if in browser context
        if (typeof window !== 'undefined') {
          // Clear auth data
          localStorage.removeItem('is_logged_in');
          localStorage.removeItem('user_phone');
          localStorage.removeItem('user_id');
          localStorage.removeItem('access_token');
          
          // Clear cookies
          document.cookie = "is_logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "user_phone=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "PHPSESSID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          
          // Redirect to login (after a short delay to let the console messages complete)
          setTimeout(() => {
            window.location.href = '/login?error=coach_not_found&message=' + encodeURIComponent(errorMessage);
          }, 500);
        }
      }
      
      return [];
    }
    
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