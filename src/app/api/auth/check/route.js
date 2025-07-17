import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mark this route as dynamic to fix Vercel deployment
export const dynamic = 'force-dynamic';

/**
 * GET handler for checking authentication status
 */
export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    // Validate request
    if (!type) {
      return NextResponse.json(
        { error: 'Missing authentication type' },
        { status: 400 }
      );
    }
    
    // Handle different authentication types
    if (type === 'admin') {
      // Check admin authentication cookie
      const adminAuth = cookies().get('adminAuth')?.value;
      
      return NextResponse.json({
        authenticated: adminAuth === 'true'
      });
    } else if (type === 'secret') {
      // Check secret inventory authentication cookie
      const secretAuth = cookies().get('secretInventoryAuth')?.value;
      
      return NextResponse.json({
        authenticated: secretAuth === 'true'
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid authentication type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    return NextResponse.json(
      { error: 'Authentication check failed' },
      { status: 500 }
    );
  }
}