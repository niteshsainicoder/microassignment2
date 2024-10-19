import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    // Log the incoming request headers, especially the Cookie header
    const cookie = request.headers.get('Cookie');
    
if (!cookie) {
    return NextResponse.json({ message: "No cookie found" }, { status: 400 });
}
    // Create a response and delete the cookie
    const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
    
    // Delete the cookie by specifying the name of the cookie
    response.cookies.delete('cookies'); // Replace 'cookie' with the actual name of your cookie

    return response; // Return the response with the cookie deletion
}
