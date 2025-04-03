import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

export async function POST(req: NextRequest) {
  try {
    // Get the API URL from environment variables or use default
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://bot.fit-track.net/api/';
    
    // DEBUG: Log environment variables for debugging
    console.log('[Proxy] Environment variables:', {
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
    
    // Create HTTPS agent to disable SSL verification for local development
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false // Disable SSL certificate verification
    });
    
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
      
      // Always include user_type for login requests
      if (!body.user_type) {
        body.user_type = 'coach';
        console.log('[Proxy] Added user_type=coach to login request');
      }
      
      // For OTP and verification, ensure phone number is in correct format
      if ((body.act === 'otp' || body.act === 'verify') && body.phone) {
        // Log without the actual number for security
        console.log(`[Proxy] Processing authentication request:`, {
          action: body.act,
          hasPhone: !!body.phone,
          hasCode: !!body.code,
          userType: body.user_type,
          headers: Object.fromEntries(req.headers.entries())
        });
      }
    }
    
    // Get cookies for authentication if present
    const cookies = req.cookies;
    const isLoggedIn = cookies.get('is_logged_in')?.value === 'true';
    const sessionId = cookies.get('PHPSESSID')?.value;
    const userPhone = cookies.get('user_phone')?.value;
    const accessToken = cookies.get('access_token')?.value;
    const userType = cookies.get('user_type')?.value || 'coach';
    
    // Log authentication details
    console.log('[Proxy] Authentication details:', {
      hasSessionCookie: !!sessionId,
      hasUserPhone: !!userPhone,
      hasAccessToken: !!accessToken,
      isLoggedIn: isLoggedIn,
      userType,
      headers: Object.fromEntries(req.headers.entries())
    });
    
    // Headers with conditional authentication
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': new URL(req.url).origin,
      'User-Agent': 'FitTrack-Web/1.0', // Add a consistent user agent
    };
    
    // Add session cookie if present - format it properly for the API
    if (sessionId) {
      // Format cookie properly without extra attributes
      headers['Cookie'] = `PHPSESSID=${sessionId}`;
      console.log('[Proxy] Added session cookie to request');
    } else {
      console.log('[Proxy] No session cookie found');
    }
    
    // Add Authorization header if access token is present
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      console.log('[Proxy] Added access token to Authorization header');
    }
    
    // Also check for Authorization header in the incoming request
    const authHeader = req.headers.get('Authorization');
    if (authHeader && !headers['Authorization']) {
      headers['Authorization'] = authHeader;
      console.log('[Proxy] Forwarded Authorization header from client request');
    }
    
    // Add user credentials if available and not already in the request
    if (userPhone && isLoggedIn && body.mdl !== 'login') {
      console.log('[Proxy] Adding user credentials to request');
      // Ensure the phone is trimmed to avoid spaces
      body.phone = userPhone.trim();
      
      // Add user type - required by this API
      body.user_type = userType;
      
      // The API requires the user's phone for authentication
      // Add the user_id parameter which may be required by the API
      if (!body.user_id) {
        body.user_id = userPhone.trim();
      }

      // Handle id parameter based on action type
      if (!body.id) {
        if (body.act === 'list') {
          // List operations don't need an id
          body.id = undefined;
        } else if (body.act === 'get') {
          // Get operations need 'all' as id
          body.id = 'all';
        } else if (body.act === 'del') {
          // Delete operations need an id
          body.id = '1'; // Default ID for delete
        } else {
          // Other operations (like set) don't need an id
          body.id = undefined;
        }
      }
    }
    
    // Add clear debugging for headers going to the API
    console.log('[Proxy] Request headers sent to API:', headers);
    
    // Log the outgoing request (without sensitive data)
    console.log(`[Proxy] Outgoing request to API: ${apiUrl}`, {
      method: 'POST',
      moduleAction: `${body.mdl}/${body.act}`,
      hasSession: !!sessionId,
      body: {
        ...body,
        phone: body.phone ? '***' : undefined,
        code: body.code ? '***' : undefined,
        id: body.id // Log the id parameter
      }
    });

    // ------------------------
    // VERCEL PREVIEW MODE
    // ------------------------
    const isVercelBot = req.headers.get('x-vercel-internal-bot-check') === 'pass' || 
                        req.headers.get('user-agent')?.includes('vercel-screenshot');
    
    // Don't use mock automatically, let the user choose
    if (isVercelBot) {
      console.log('[Proxy] Detected Vercel bot/preview - returning mock response');
      return mockResponseForRequest(body);
    }
    
    // Send the request to the real API
    let apiResponse;
    try {
      // For dashboard, settings, and other authenticated endpoints, try a direct URL approach
      if (body.mdl !== 'login' && isLoggedIn && userPhone) {
        // Create a copy of the body to modify for authentication
        const authBody = { ...body };
        
        // Add authentication parameters that the API expects
        // IMPORTANT: For this specific API, the phone number is the primary auth method
        authBody.phone = userPhone.trim();
        
        // Set user_id from phone if not already set
        if (!authBody.user_id) {
          authBody.user_id = userPhone.trim();
        }

        // Add access_token parameter for authentication
        const authToken = cookies.get('access_token')?.value;
        if (authToken) {
          authBody.access_token = authToken;
          console.log('[Proxy] Added access token to request');
          
          // Also add to headers for APIs that use header-based auth
          headers['Authorization'] = `Bearer ${authToken}`;
        }

        // Only add id if it's not already set and it's not a list action
        if (!authBody.id && authBody.act !== 'list' && authBody.act !== 'get') {
          authBody.id = '1';
        }
        
        console.log(`[Proxy] Using authenticated body:`, {
          moduleAction: `${authBody.mdl}/${authBody.act}`,
          hasPhone: !!authBody.phone,
          hasUserId: !!authBody.user_id,
          hasId: !!authBody.id,
          id: authBody.id
        });
        
        // Send request with auth data and the HTTPS agent to disable SSL verification
        apiResponse = await fetch(apiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(authBody),
          credentials: 'include',
          // @ts-expect-error - Agent isn't in standard fetch types but works in Node.js
          agent: httpsAgent
        });
      } else {
        // Standard request for login endpoints
        apiResponse = await fetch(apiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
          credentials: 'include',
          // @ts-expect-error - Agent isn't in standard fetch types but works in Node.js
          agent: httpsAgent
        });
      }
      
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
      console.log(`[Proxy] Successfully received response for ${body.mdl}/${body.act}:`, {
        status: apiResponse.status,
        data: data,
        setCookieHeader: apiResponse.headers.get('set-cookie'),
        headers: Object.fromEntries(apiResponse.headers.entries())
      });
      
      // Create response object
      const jsonResponse = NextResponse.json(data);
      
      // For login verification, ensure we set the session cookie
      if (body.mdl === 'login' && body.act === 'verify' && data.result === true) {
        console.log('[Proxy] Login successful, processing session cookie');
        
        // Store user credentials for subsequent requests - ensure phone is trimmed
        const phoneValue = body.phone.toString().trim();
        jsonResponse.cookies.set({
          name: 'user_phone',
          value: phoneValue,
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        
        // Set login state
        jsonResponse.cookies.set({
          name: 'is_logged_in',
          value: 'true',
          httpOnly: false, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        // Store access token if provided in the API response
        if (data.access_token) {
          console.log('[Proxy] Setting access token from response');
          jsonResponse.cookies.set({
            name: 'access_token',
            value: data.access_token,
            httpOnly: false, // Set to false so JavaScript can access it
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
          });
        }

        // Get the PHPSESSID from the API response
        const setCookieHeader = apiResponse.headers.get('set-cookie');
        if (setCookieHeader) {
          console.log('[Proxy] Processing API set-cookie header:', setCookieHeader);
          
          // Extract PHPSESSID from the Set-Cookie header
          const phpSessionIdMatch = setCookieHeader.match(/PHPSESSID=([^;]+)/);
          if (phpSessionIdMatch && phpSessionIdMatch[1]) {
            const sessionId = phpSessionIdMatch[1];
            console.log(`[Proxy] Extracted PHPSESSID: ${sessionId}`);
            
            // Set PHPSESSID cookie with proper attributes
            jsonResponse.cookies.set({
              name: 'PHPSESSID',
              value: sessionId,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 60 * 24 * 7, // 1 week
            });
          }
        } else {
          // If no PHPSESSID in response, try to get it from the request
          const requestSessionId = req.cookies.get('PHPSESSID')?.value;
          if (requestSessionId) {
            console.log(`[Proxy] Using existing PHPSESSID from request: ${requestSessionId}`);
            jsonResponse.cookies.set({
              name: 'PHPSESSID',
              value: requestSessionId,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 60 * 24 * 7, // 1 week
            });
          } else {
            console.log('[Proxy] No PHPSESSID found in response or request');
          }
        }
      } else {
        // For non-login requests, ensure we preserve the PHPSESSID
        const requestSessionId = req.cookies.get('PHPSESSID')?.value;
        if (requestSessionId) {
          console.log(`[Proxy] Preserving PHPSESSID for non-login request: ${requestSessionId}`);
          jsonResponse.cookies.set({
            name: 'PHPSESSID',
            value: requestSessionId,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
          });
        }
      }
      
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
  const origin = req.headers.get('origin') || 'http://localhost:3000';
  corsResponse.headers.set('Access-Control-Allow-Origin', origin);
  corsResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  corsResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Cookie');
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