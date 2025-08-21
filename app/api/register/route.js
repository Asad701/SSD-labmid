import DbConnect from "@/lib/db";
import User from "@/models/user";
import TempUser from "@/models/tu";
import { NextResponse } from "next/server";
import Mailer from "@/lib/mailer";

export async function POST(request) {
  await DbConnect();

  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required." },
        { status: 400 }
      );
    }

    const tempUser = await TempUser.findOne({ email, code });

    if (!tempUser) {
      return NextResponse.json(
        { error: "Incorrect verification code or verification expired." },
        { status: 401 }
      );
    }

    const newUser = new User({
      userid: tempUser.userid,
      fname: tempUser.fname,
      lname: tempUser.lname,
      email: tempUser.email,
      pwdhash: tempUser.pwdhash,
      country: tempUser.country,
    });

    await newUser.save();

    const subject = "Account Created Successfully";
    const userMessage = `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e9ecef; border-radius:8px; overflow:hidden;">
          <!-- Header -->
          <div style="background-color:#0d6efd; padding:16px; text-align:center; color:#fff;">
            <h1 style="margin:0; font-size:20px;">Royal Fold & Forge</h1>
          </div>

          <!-- Body -->
          <div style="padding:20px; color:#333;">
            <p style="font-size:16px; margin:0 0 12px 0;">
              Hi <strong>${tempUser.fname} ${tempUser.lname}</strong>,
            </p>
            <p style="font-size:15px; line-height:1.6; margin:0 0 12px 0;">
              🎉 Your <strong>Royal Fold & Forge</strong> account has been <strong>successfully created</strong>!  
              You can now explore our store, track orders, and enjoy member-only offers.
            </p>

            <div style="margin:18px 0; text-align:center;">
              <a href="https://royalfoldforge.com/account" 
                style="display:inline-block; padding:10px 20px; border-radius:6px; text-decoration:none; font-weight:600; background-color:#0d6efd; color:#fff;">
                Go to My Account
              </a>
            </div>

            <p style="font-size:13px; color:#666; margin:0;">
              Need help? Visit our 
              <a href="https://royalfoldforge.com/support" style="color:#0d6efd; text-decoration:none;">Support Center</a>.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color:#f8f9fa; padding:14px; text-align:center; font-size:13px; color:#666;">
            Regards,<br /><strong>Royal Fold & Forge Team</strong>
          </div>
        </div>
    `;

    const adminMessage = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e9ecef; border-radius:8px; overflow:hidden;">
        <!-- Header -->
        <div style="background-color:#198754; padding:16px; text-align:center; color:#fff;">
          <h1 style="margin:0; font-size:20px;">🎉 New User Registered!</h1>
        </div>

        <!-- Body -->
        <div style="padding:20px; color:#333;">
          <p style="font-size:15px; line-height:1.6; margin:0 0 12px 0;">
            A new user has just joined <strong>Royal Fold & Forge</strong>.
          </p>

          <table style="width:100%; border-collapse:collapse; margin:15px 0;">
            <tr>
              <td style="padding:8px; border:1px solid #e9ecef; font-weight:600;">Name</td>
              <td style="padding:8px; border:1px solid #e9ecef;">${tempUser.fname} ${tempUser.lname}</td>
            </tr>
            <tr>
              <td style="padding:8px; border:1px solid #e9ecef; font-weight:600;">Email</td>
              <td style="padding:8px; border:1px solid #e9ecef;">${tempUser.email}</td>
            </tr>
            <tr>
              <td style="padding:8px; border:1px solid #e9ecef; font-weight:600;">Country</td>
              <td style="padding:8px; border:1px solid #e9ecef;">${tempUser.country}</td>
            </tr>
          </table>

          <div style="margin-top:18px; text-align:center;">
            <a href="https://royalfoldforge.com/admin/users" 
              style="display:inline-block; padding:10px 20px; border-radius:6px; text-decoration:none; font-weight:600; background-color:#198754; color:#fff;">
              View User in Admin Panel
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color:#f8f9fa; padding:14px; text-align:center; font-size:13px; color:#666;">
          Regards,<br /><strong>Royal Fold & Forge System</strong>
        </div>
      </div>
    `;


    await Mailer(email, subject, userMessage);
    await Mailer(process.env.MAIL, subject, adminMessage);

    await TempUser.deleteOne({ email });

    return NextResponse.json({ message: "Account verified and created." });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error during verification." },
      { status: 500 }
    );
  }
}
