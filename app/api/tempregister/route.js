import DbConnect from "@/lib/db";
import User from "@/models/user";
import TempUser from "@/models/tu";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import Mailer from "@/lib/mailer";

// Helper function to hash passwords securely
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// POST handler for the registration API route
export async function POST(request) {
  // Establish a connection to the MongoDB database
  await DbConnect();

  try {
    // Parse the JSON request body
    const body = await request.json();
    const { fname, lname, email, password,country } = body;

    if (!fname || !lname || !email || !password || !country) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered." }, { status: 409 });
    }

    const hash = await hashPassword(password);

    const newUser = new User({
      userid: `${fname}-${uuid().split("-")[0]}`,
      fname,
      lname,
      email,
      pwdhash: hash,
      country: country,
    });

    await newUser.save();

    console.log(`[API] New user created directly: ${newUser.userid} (${email})`);

    return NextResponse.json({
      message: "Account created successfully. You can now log in.",
    });
  } catch (err) {
    console.error("Registration API error:", err);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
