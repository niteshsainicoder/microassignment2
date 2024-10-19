// app/api/authentication/login/route.js
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConnect"; // Your database connection function
import User from "@/models/usermodal"; // Your User model
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  await connectDB(); // Connect to your database

  const url = new URL(req.url);
  const Email = url.searchParams.get("Email");
  const Password = url.searchParams.get("Password");
 
  if (!Email || !Password) {
    return NextResponse.json(
      { message: "Please provide email and password" },
      { status: 400 }
    );}

  // Find user by email
  const user = await User.findOne({ email: Email });
  if (!user) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 400 }
    );
  }

  // Directly check if the password matches (make sure this is what your assignment requires)
  // Assuming user.password is the stored password
  if (user.password !== Password) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 400 }
    );
  }

  // Generate a JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d", // Token expiry
    }
  );


  // Set cookie for authentication
  const serializedCookie = `{("token",${token})`;

  const response = NextResponse.json(
    { message: "Login successful" },
    { status: 200 }
  );
  response.cookies.set("cookies", serializedCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  }); // Set the cookie in the response

  return response;
}
