// // middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export function middleware(request: NextRequest) {
    // Get the cookie (you can change the cookie name as per your implementation)
    const token = request.cookies.get('cookies'); // Replace 'token' with your actual cookie name

    // Check if the request is for a public path
    // if (publicPaths.includes(request.nextUrl.pathname)) {
    //     return NextResponse.next(); // Allow access to public paths
    // }

    // If the token is not present and the user tries to access a protected route
    // if (!token) {
    //     return NextResponse.redirect(new URL('/login', request.url)); // Redirect to login page
    // }

console.log(token,"nice");    // Remove the 'Bearer ' prefix
    // If the token is present, allow the request to proceed
    return NextResponse.next();
}


  export const config = {
    matcher: '/api/:path*',
  }