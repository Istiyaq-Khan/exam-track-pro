import { NextResponse } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes = {
  '/admin': ['admin'],
  '/advanced': ['advanced', 'admin'],
  '/student': ['student', 'advanced', 'admin']
};

// Define public routes that don't need authentication
const publicRoutes = ['/', '/about', '/blogs', '/books', '/motivational'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
    pathname.startsWith(route)
  );
  
  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/blogs/') || pathname.startsWith('/books/')
  );
  
  // Allow public routes and API routes
  if (isPublicRoute || pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }
  
  // For protected routes, we need to check authentication
  if (isProtectedRoute) {
    try {
      // Get the Firebase ID token from cookies
      const token = request.cookies.get('firebase-token')?.value;
      
      if (!token) {
        // No token, redirect to unauthorized
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      // Verify the token and get user data
      const userResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!userResponse.ok) {
        // Invalid token, redirect to unauthorized
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      const userData = await userResponse.json();
      
      // Check if user has the required role for this route
      const requiredRoles = protectedRoutes[Object.keys(protectedRoutes).find(route => 
        pathname.startsWith(route)
      )];
      
      if (!requiredRoles.includes(userData.role)) {
        // User doesn't have required role, redirect to unauthorized
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      // User is authenticated and has required role, allow access
      return NextResponse.next();
      
    } catch (error) {
      console.error('Middleware error:', error);
      // Error occurred, redirect to unauthorized
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  // For all other routes, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 