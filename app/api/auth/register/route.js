import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

connectDB();

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role  } = body;

    // Debugging
    console.log(name, email, password, role);

    if (!name || !email || !password || !role) {
      return new NextResponse("Missing or invalid fields", { status: 400 });
    }

    // Check if the user already exists
    const exist = await User.findOne({ email });
    if (exist) {
      return new NextResponse("Email already exists", { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    // Save user
    const newUser = new User(userData);
    const savedUser = await newUser.save();

    console.log("User saved:", savedUser);
    return NextResponse.json({
      message: "User registered successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error saving user:", error);
    return new NextResponse("Error saving user", { status: 500 });
  }
}
