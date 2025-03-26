import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Get the API URL from environment variables or use default
    const apiUrl = process.env.REACT_APP_API_URL || 'https://app.fit-track.net/api/';
    
    // Get the request body
    const body = await req.json();
    
    // Get cookies for authentication if present
    const cookies = req.cookies;
    const authToken = cookies.get('auth_token')?.value;
    
    // Headers with conditional authentication
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token exists
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    // Forward the request to the FitTrack API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      // Add timeout for production reliability
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    // Handle API errors with proper status codes
    if (!response.ok) {
      return NextResponse.json(
        { error: `API responded with status: ${response.status}` },
        { status: response.status }
      );
    }
    
    // Get the response data
    const data = await response.json();
    
    // Return the response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    
    // Return appropriate error based on type
    if (error instanceof TypeError && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'API request timed out' },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch data from API' },
      { status: 500 }
    );
  }
} 