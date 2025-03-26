// Configuration settings

/**
 * Test mode configuration
 * - When true, uses mock data instead of making API calls
 * - Useful for development when API is unavailable or for testing UI
 * - In production, this should always be false
 */
export const USE_MOCK_DATA = process.env.NODE_ENV !== 'production';

/**
 * Debug mode configuration
 * - When true, logs additional information to the console
 * - Should be disabled in production
 */
export const DEBUG_MODE = process.env.NODE_ENV !== 'production'; 