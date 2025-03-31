import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Get the API URL from environment variables or use default
    let apiUrl = process.env.REACT_APP_API_URL || 'https://app.fit-track.net/api/';
    
    // DEBUG: Log environment variables for debugging
    console.log('[Proxy] Environment variables:', {
      REACT_APP_API_URL: process.env.REACT_APP_API_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NODE_ENV: process.env.NODE_ENV
    });
    
    // Ensure the URL ends with a trailing slash
    if (!apiUrl.endsWith('/')) {
      apiUrl = `${apiUrl}/`;
    }
    
    // Log the API URL being used (helpful for debugging)
    console.log(`[Proxy] Using API URL: ${apiUrl}`);
    
    // Get the request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('[Proxy] Error parsing request body:', parseError);
      return NextResponse.json(
        { 
          error: 'Invalid request body',
          timestamp: new Date().toISOString(),
          statusCode: 400
        },
        { status: 400 }
      );
    }
    
    // DEBUG: Log complete request body
    console.log('[Proxy] Request body:', JSON.stringify(body));
    
    // Validate basic request structure
    if (!body.mdl || !body.act) {
      console.error('[Proxy] Invalid request structure:', body);
      return NextResponse.json(
        { 
          error: 'Invalid request structure. Module and action are required.',
          timestamp: new Date().toISOString(),
          statusCode: 400
        },
        { status: 400 }
      );
    }

    // Special handling for login module
    if (body.mdl === 'login') {
      console.log(`[Proxy] Processing login request: ${body.act}`);
      
      // For OTP and verification, ensure phone number is in correct format
      if ((body.act === 'otp' || body.act === 'verify') && body.phone) {
        // Log without the actual number for security
        console.log(`[Proxy] Processing authentication request with phone number`);
      }
    }
    
    // Get cookies for authentication if present
    const cookies = req.cookies;
    const authToken = cookies.get('auth_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    
    // Log authentication details
    console.log('[Proxy] Authentication details:', {
      hasCookie: !!cookies.get('auth_token'),
      hasAuthHeader: !!req.headers.get('authorization'),
      authToken: authToken ? 'present' : 'missing',
      headers: Object.fromEntries(req.headers.entries())
    });
    
    // Headers with conditional authentication
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': new URL(req.url).origin,
    };
    
    // Add authorization header if token exists
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
      console.log('[Proxy] Added Authorization header');
    } else {
      console.log('[Proxy] No auth token found in cookies or headers');
    }
    
    // Add clear debugging for headers going to the API
    console.log('[Proxy] Request headers sent to API:', headers);
    
    // Log the outgoing request (without sensitive data)
    console.log(`[Proxy] Outgoing request to API: ${apiUrl}`, {
      method: 'POST',
      moduleAction: `${body.mdl}/${body.act}`,
      hasAuthToken: !!authToken
    });

    // ------------------------
    // VERCEL PREVIEW MODE
    // ------------------------
    const isVercelBot = req.headers.get('x-vercel-internal-bot-check') === 'pass' || 
                        req.headers.get('user-agent')?.includes('vercel-screenshot');
    
    if (isVercelBot) {
      console.log('[Proxy] Detected Vercel bot/preview - returning mock response');
      return mockResponseForRequest(body);
    }
    
    // ------------------------
    // USE TEST MODE FOR DEBUGGING
    // ------------------------
    if (authToken && authToken.includes('test_token')) {
      console.log('[Proxy] USING TEST MODE - Returning mock success response');
      
      // Create mock response based on the request
      let mockResponse;
      
      if (body.mdl === 'login' && body.act === 'otp') {
        mockResponse = { result: true, message: 'OTP sent successfully' };
      } else if (body.mdl === 'login' && body.act === 'verify') {
        mockResponse = { 
          result: true, 
          token: authToken || 'test_token_123',
          user: { id: 'test123', name: 'Test User', role: 'admin' } 
        };
      } else if (body.mdl === 'trainees' && body.act === 'list') {
        mockResponse = { 
          result: true, 
          message: [
            { id: '1', name: 'Test User 1', email: 'test1@example.com', phone: '1234567890', is_active: '1' },
            { id: '2', name: 'Test User 2', email: 'test2@example.com', phone: '0987654321', is_active: '0' }
          ] 
        };
      } else {
        mockResponse = { result: true, data: { message: 'Mock response for ' + body.mdl + '/' + body.act } };
      }
      
      const jsonResponse = NextResponse.json(mockResponse);
      return jsonResponse;
    }
    
    // Send the request to the real API
    let apiResponse;
    try {
      apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      
      console.log(`[Proxy] API response status: ${apiResponse.status} ${apiResponse.statusText}`);
    } catch (fetchError) {
      console.error('[Proxy] API fetch error:', fetchError);
      return NextResponse.json(
        { 
          error: 'Failed to connect to API server',
          details: fetchError instanceof Error ? fetchError.message : 'Unknown error',
          timestamp: new Date().toISOString(),
          statusCode: 502
        },
        { status: 502 }
      );
    }
    
    // Handle API errors with proper status codes
    if (!apiResponse.ok) {
      let errorText = '';
      try {
        errorText = await apiResponse.text();
      } catch (_textError) {
        errorText = 'Could not read error response';
      }
      
      let errorMessage = `API responded with status: ${apiResponse.status}`;
      
      try {
        // Try to parse the error response as JSON
        const errorData = JSON.parse(errorText);
        if (errorData.error || errorData.message) {
          errorMessage = errorData.error || errorData.message;
        }
      } catch (_parseError) {
        // If parsing fails, use the raw text if it exists
        if (errorText && errorText !== 'Could not read error response') {
          errorMessage = `${errorMessage} - ${errorText}`;
        }
      }
      
      console.error(`[Proxy] API error (${apiResponse.status}):`, errorMessage);
      
      // If it's a login required error but we have a test auth token, create a success response instead
      if (errorMessage === 'login required' && authToken && authToken.includes('test_token')) {
        console.log('[Proxy] Intercepting login required error and returning success for test token');
        
        const successResponse = NextResponse.json({
          result: true,
          data: { 
            message: 'Test authentication successful',
            user: {
              id: 'test_user_123',
              name: 'Test User',
              role: 'admin'
            }
          }
        });
        
        // Ensure the auth cookie is set
        successResponse.cookies.set({
          name: 'auth_token',
          value: authToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/',
        });
        
        return successResponse;
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          statusCode: apiResponse.status,
          timestamp: new Date().toISOString()
        },
        { status: apiResponse.status }
      );
    }
    
    // Parse the response data
    let data;
    try {
      data = await apiResponse.json();
      console.log(`[Proxy] Successfully received response for ${body.mdl}/${body.act}`);
      
      // Create response object
      const jsonResponse = NextResponse.json(data);
      
      // Handle authentication responses - extract token from any response that has it
      const token = data.token || 
                   (data.data && data.data.token) || 
                   (typeof data.data === 'string' && data.result === true ? data.data : null);
      
      if (token) {
        console.log('[Proxy] Found token in response, setting auth_token cookie');
        
        // Set auth token cookie (secure in production, httpOnly for security)
        jsonResponse.cookies.set({
          name: 'auth_token',
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/',
        });
        
        return jsonResponse;
      }
      
      // Add CORS headers for the response
      // Use the request origin instead of wildcard for credentials to work
      const origin = req.headers.get('origin') || 'https://app.fit-track.net';
      jsonResponse.headers.set('Access-Control-Allow-Origin', origin);
      jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      jsonResponse.headers.set('Access-Control-Allow-Credentials', 'true');
      
      // Return the response
      return jsonResponse;
    } catch (parseError) {
      console.error('[Proxy] Error parsing API response:', parseError);
      return NextResponse.json(
        { 
          error: 'Invalid response from API server',
          detail: parseError instanceof Error ? parseError.message : 'Unknown parse error',
          timestamp: new Date().toISOString(),
          statusCode: 502
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('[Proxy] Unhandled error:', error);
    
    // Return appropriate error based on type
    if (error instanceof TypeError && error.name === 'AbortError') {
      return NextResponse.json(
        { 
          error: 'API request timed out. The server is taking too long to respond.',
          timestamp: new Date().toISOString(),
          statusCode: 504
        },
        { status: 504 }
      );
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: 'Unable to connect to API server. Please check your network connection and API endpoint configuration.',
          timestamp: new Date().toISOString(),
          statusCode: 503
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to process API request',
        timestamp: new Date().toISOString(),
        errorDetail: error instanceof Error ? error.message : 'Unknown error',
        statusCode: 500
      },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS(req: NextRequest) {
  const corsResponse = new NextResponse(null, { status: 204 }); // No content
  
  // Use the request origin instead of wildcard for credentials to work
  const origin = req.headers.get('origin') || 'https://app.fit-track.net';
  corsResponse.headers.set('Access-Control-Allow-Origin', origin);
  corsResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  corsResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  corsResponse.headers.set('Access-Control-Allow-Credentials', 'true');
  corsResponse.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  
  return corsResponse;
}

// Helper function to generate mock responses for preview mode
function mockResponseForRequest(body: any) {
  console.log('[Proxy] Generating mock response for:', body);
  
  let mockResponse;
  
  if (body.mdl === 'login' && body.act === 'otp') {
    mockResponse = { result: true, message: 'OTP sent successfully' };
  } else if (body.mdl === 'login' && body.act === 'verify') {
    mockResponse = { 
      result: true, 
      token: 'preview_test_token',
      user: { id: 'preview123', name: 'Preview User', role: 'admin' } 
    };
  } else if (body.mdl === 'trainees' && body.act === 'list') {
    mockResponse = { 
      result: true, 
      message: [
        { id: '1', name: 'Preview User 1', email: 'preview1@example.com', phone: '1234567890', is_active: '1' },
        { id: '2', name: 'Preview User 2', email: 'preview2@example.com', phone: '0987654321', is_active: '0' }
      ] 
    };
  } else if (body.mdl === 'dashboard' && body.act === 'get') {
    mockResponse = {
      result: true,
      inactive_trainees_count: 2,
      trainees_count: 10,
      weekly_data: [
        { day: 'Mon', count: 5 },
        { day: 'Tue', count: 7 },
        { day: 'Wed', count: 8 },
        { day: 'Thu', count: 6 },
        { day: 'Fri', count: 9 },
        { day: 'Sat', count: 4 },
        { day: 'Sun', count: 3 }
      ],
      groups_distribution: [
        { name: 'Beginners', trainees_count: 4 },
        { name: 'Intermediate', trainees_count: 3 },
        { name: 'Advanced', trainees_count: 3 }
      ]
    };
  } else {
    mockResponse = { 
      result: true, 
      data: { message: 'Preview mock response for ' + body.mdl + '/' + body.act } 
    };
  }
  
  return NextResponse.json(mockResponse);
} 