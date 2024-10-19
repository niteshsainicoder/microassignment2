// app/api/authentication/signup/route.js (for Next.js 13 with App Router)
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConnect"; // adjust the path if needed
import User from "@/models/usermodal"; // adjust the path if needed

export async function POST(request: NextRequest) {
    await connectDB(); // Connect to the database

    const {Name, Email, Password } = await request.json();

    // Check if email already exists
    const existingUser = await User.findOne({ email: Email });
    if (existingUser) {
        return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    // Create a new user
    const newUser = new User({name: Name, email: Email, password: Password }); // Consider hashing the password before saving
  const data =   await newUser.save();
console.log(data);
    return NextResponse.json({ message: "User signed up successfully" }, { status: 201 });
}
