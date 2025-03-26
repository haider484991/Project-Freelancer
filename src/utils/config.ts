// Configuration settings

/**
 * Test mode configuration
 * - When true, uses mock data instead of making API calls
 * - Useful for development when API is unavailable or for testing UI
 */
export const USE_MOCK_DATA = process.env.NODE_ENV === 'development';

/**
 * Debug mode configuration
 * - When true, logs additional information to the console
 */
export const DEBUG_MODE = process.env.NODE_ENV === 'development'; 