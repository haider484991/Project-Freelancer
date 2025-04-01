import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear all auth-related storage
    const response = NextResponse.json({ success: true });
    
    // Clear cookies
    response.cookies.delete('user_phone');
    response.cookies.delete('is_logged_in');
    response.cookies.delete('PHPSESSID');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: false, error: 'Logout failed' }, { status: 500 });
  }
} 