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

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hash = await hashPassword(password);

    const tempUser = new TempUser({
      userid: `${fname}-${uuid().split("-")[0]}`,
      fname,
      lname,
      email,
      pwdhash: hash,
      country:country,
      code,
      createdAt: Date.now(),
    });

    await tempUser.save();

    const subject = "Your Email Verification Code";
    const userMessage = `
      <div style="font-family: Arial, sans-serif; max-width:500px; margin:auto; border:1px solid #e9ecef; border-radius:8px; overflow:hidden;">
        <!-- Header -->
        <div style="background-color:#0d6efd; padding:16px; text-align:center; color:#fff;">
          <h1 style="margin:0; font-size:20px;">Royal Fold & Forge</h1>
        </div>

        <!-- Body -->
        <div style="padding:20px; color:#333; text-align:center;">
          <p style="font-size:16px; margin-bottom:12px;">
            Please use the following verification code to confirm your email address:
          </p>

          <div style="font-size:28px; font-weight:bold; letter-spacing:4px; color:#0d6efd; margin:20px 0;">
            ${code}
          </div>

          <p style="font-size:14px; color:#666; margin-bottom:0;">
            This code will expire in <strong>10 minutes</strong>.<br />
            If you did not request this, please ignore this email.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color:#f8f9fa; padding:14px; text-align:center; font-size:13px; color:#666;">
          Regards,<br /><strong>Royal Fold & Forge Team</strong>
        </div>
      </div>

    `;

    await Mailer(email, subject, userMessage);

    return NextResponse.json({
      message: "Verification code sent to email. Please verify to continue.",
    });
  } catch (err) {
    console.error("Registration API error:", err);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
