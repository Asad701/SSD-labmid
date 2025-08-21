import DbConnect from "@/lib/db";
import User from "@/models/user";
import TempCode from "@/models/tempcode";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Mailer from "@/lib/mailer";

// Helper function to hash passwords securely
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// ================== SEND VERIFICATION CODE ==================
export async function POST(request) {
  await DbConnect();

  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: "Enter your email." }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Please enter a valid email." }, { status: 400 });
    }

    // Remove any existing temp codes for this email
    await TempCode.deleteMany({ email });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const tempcode = new TempCode({ email, code });
    await tempcode.save();

    const subject = "Your Email Verification Code for Password Reset";
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
              This code will expire in <strong>10 minutes</strong>.<br>
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
      message: "Verification code sent to email. Please verify to continue."
    });
  } catch (err) {
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}

// ================== UPDATE PASSWORD ==================
export async function PATCH(request) {
  await DbConnect();

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Please provide email and password." }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "No account found with this email." }, { status: 404 });
    }

    const hash = await hashPassword(password);
    await User.findOneAndUpdate({ email }, { pwdhash: hash });

    const subject = "Password Changed Successfully";
    const userMessage = `
      <div style="font-family: Arial, sans-serif; max-width:500px; margin:auto; border:1px solid #e9ecef; border-radius:8px; overflow:hidden;">
        <!-- Header -->
        <div style="background-color:#0d6efd; padding:16px; text-align:center; color:#fff;">
          <h1 style="margin:0; font-size:20px;">Royal Fold & Forge</h1>
        </div>

        <!-- Body -->
        <div style="padding:20px; color:#333; text-align:center;">
          <p style="font-size:16px; margin-bottom:12px;">
            ✅ Your password has been successfully changed.
          </p>
          <p style="font-size:14px; color:#666; margin-bottom:0;">
            If you did not perform this action, please 
            <a href="https://royalfold.com/contactus" style="color:#0d6efd; text-decoration:none; font-weight:500;">
              contact Royal Fold & Forge support
            </a> immediately.
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
      message: "Password changed successfully."
    });
  } catch (err) {
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
