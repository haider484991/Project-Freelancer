import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Get the API URL from environment variables or use default
    let apiUrl = process.env.REACT_APP_API_URL || 'https://bot.fit-track.net/api/';
    
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
    
    // Headers with conditional authentication
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': new URL(req.url).origin,
    };
    
    // Add authorization header if token exists
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    // Log the outgoing request (without sensitive data)
    console.log(`[Proxy] Outgoing request to API: ${apiUrl}`, {
      method: 'POST',
      moduleAction: `${body.mdl}/${body.act}`,
      hasAuthToken: !!authToken
    });
    
    // Attempt to forward the request to the FitTrack API
    let apiResponse;
    try {
      apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        // Add timeout for production reliability
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });
    } catch (fetchError) {
      console.error('[Proxy] Fetch error:', fetchError);
      
      // Network-level error
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error';
      
      // Check if it's a DNS or connection error
      if (errorMessage.includes('getaddrinfo') || 
          errorMessage.includes('ENOTFOUND') || 
          errorMessage.includes('ECONNREFUSED')) {
        return NextResponse.json(
          { 
            error: `Cannot connect to API server at ${apiUrl}. Please check your network connection and API configuration.`,
            detail: errorMessage,
            timestamp: new Date().toISOString(),
            statusCode: 503
          },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to connect to API server',
          detail: errorMessage,
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
      console.log(`[Proxy] Successfully received response for ${body.mdl}/${body.act}`);
      
      // Handle authentication responses
      if (body.mdl === 'login' && body.act === 'verify' && data.token) {
        console.log('[Proxy] Received authentication token');
        
        // For login success, create a Response object to set cookies
        const jsonResponse = NextResponse.json(data);
        
        // Set auth token cookie (secure in production, httpOnly for security)
        jsonResponse.cookies.set({
          name: 'auth_token',
          value: data.token,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/',
        });
        
        return jsonResponse;
      }
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

    // Add CORS headers for the response
    const clientResponse = NextResponse.json(data);
    // Use the request origin instead of wildcard for credentials to work
    const origin = req.headers.get('origin') || 'https://bot.fit-track.net';
    clientResponse.headers.set('Access-Control-Allow-Origin', origin);
    clientResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    clientResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    clientResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    
    // Return the response
    return clientResponse;
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
  const origin = req.headers.get('origin') || 'https://bot.fit-track.net';
  corsResponse.headers.set('Access-Control-Allow-Origin', origin);
  corsResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  corsResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  corsResponse.headers.set('Access-Control-Allow-Credentials', 'true');
  corsResponse.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  
  return corsResponse;
} 