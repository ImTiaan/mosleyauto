import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request (e.g. /, /admin, /admin/dashboard)
  const path = request.nextUrl.pathname;
  
  // If it's the admin dashboard path, check for admin authentication
  if (path.startsWith('/admin/dashboard')) {
    // This is a simplified check. In a real app, you would verify a JWT token or session cookie
    // For this demo, we'll check if the adminAuth cookie exists
    const adminAuth = request.cookies.get('adminAuth')?.value;
    
    // If not authenticated, redirect to the admin login page
    if (adminAuth !== 'true') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  // If it's the secret inventory path, check for secret inventory authentication
  if (path.startsWith('/secret-inventory')) {
    // This is a simplified check. In a real app, you would verify a JWT token or session cookie
    // For this demo, we'll check if the secretInventoryAuth cookie exists
    const secretAuth = request.cookies.get('secretInventoryAuth')?.value;
    
    // If not authenticated, redirect to the home page
    if (secretAuth !== 'true') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // Continue to the requested page
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ['/admin/dashboard/:path*', '/secret-inventory/:path*'],
};