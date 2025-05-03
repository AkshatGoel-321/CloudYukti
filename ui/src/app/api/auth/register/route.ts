// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
// app/api/auth/register/route.ts
import User from "@/models/User";  // Note the capital 'U'
export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
}