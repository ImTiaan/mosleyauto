import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mark this route as dynamic to fix Vercel deployment
export const dynamic = 'force-dynamic';

/**
 * POST handler for authentication
 */
export async function POST(request) {
  try {
    // Get request body
    const body = await request.json();
    const { type, password } = body;
    
    // Validate request
    if (!type || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Handle different authentication types
    if (type === 'admin') {
      // Check admin password
      const adminPassword = process.env.ADMIN_PASSWORD || 'mosley123';
      
      if (password === adminPassword) {
        // Set admin authentication cookie
        cookies().set('adminAuth', 'true', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24, // 1 day
          path: '/'
        });
        
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 401 }
        );
      }
    } else if (type === 'secret') {
      // Check secret inventory password
      const secretPassword = process.env.SECRET_INVENTORY_PASSWORD || 'stolen123';
      
      if (password === secretPassword) {
        // Set secret inventory authentication cookie
        cookies().set('secretInventoryAuth', 'true', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24, // 1 day
          path: '/'
        });
        
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid authentication type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for logging out
 */
export async function DELETE(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    // Handle different logout types
    if (type === 'admin') {
      // Clear admin authentication cookie
      cookies().delete('adminAuth');
    } else if (type === 'secret') {
      // Clear secret inventory authentication cookie
      cookies().delete('secretInventoryAuth');
    } else {
      // Clear all authentication cookies
      cookies().delete('adminAuth');
      cookies().delete('secretInventoryAuth');
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}