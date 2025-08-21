import DbConnect from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { verifyToken , signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import Mailer from "@/lib/mailer";

async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export async function POST(request) {
  await DbConnect();
  const body = await request.json();
  const { email, password } = body;
  const subject ="Login Alert"
  const message = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e9ecef; border-radius:8px; overflow:hidden;">
        <!-- Header -->
        <div style="background-color:#0d6efd; padding:16px; text-align:center; color:#fff;">
          <h1 style="margin:0; font-size:20px;">Royal Fold & Forge</h1>
        </div>

        <!-- Body -->
        <div style="padding:20px; color:#333;">
          <p style="font-size:16px; margin:0 0 12px 0;">Hello,</p>
          <p style="font-size:15px; line-height:1.6; margin:0 0 12px 0;">
            You have been <strong>logged into the Royal Fold & Forge store</strong>.
          </p>

          <div style="margin:18px 0; text-align:center;">
            <a href="https://royalfoldforge.com/account" 
              style="display:inline-block; padding:10px 20px; border-radius:6px; text-decoration:none; font-weight:600; background-color:#0d6efd; color:#fff;">
              View Account
            </a>
          </div>

          <p style="font-size:13px; color:#666; margin:0;">
            If this wasn't you, please <a href="https://royalfoldforge.com/support" style="color:#0d6efd; text-decoration:none;">contact support</a> immediately or change your password.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color:#f8f9fa; padding:14px; text-align:center; font-size:13px; color:#666;">
          Regards,<br /><strong>Royal Fold & Forge Team</strong>
        </div>
      </div>
    `;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordCorrect = await verifyPassword(password, user.pwdhash);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    const token = signToken({ userid: user.userid});

    const response = NextResponse.json({ message: 'Login successful', user });
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
    });

    // Only for client-side detection (admin dashboard logic)
    response.cookies.set("logged_in", "true", {
      httpOnly: false,
      path: "/",
    });
    try{
      const mess = await Mailer(user.email,subject,message);
      response.message = mess;
    }catch(err){
      return NextResponse.json({ message: err.message }, { status: 500 });
    }

    return response;
  }catch (error) {
    return NextResponse.json({ message: "internal server error" }, { status: 500 });
  }

}


//PATCH to change password 
export async function PATCH(request) {
  await DbConnect();

  try {
    const cookieStore = await cookies();
    const token = cookieStore?.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 401 });
    }

    const decode = verifyToken(token);

    if (!decode?.userid) {
      return NextResponse.json({ message: 'Invalid token or user ID missing' }, { status: 401 });
    }

    const { prevpassword, newpassword } = await request.json();

    const user = await User.findOne({ userid: decode.userid });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(prevpassword, user.pwdhash);

    if (!isMatch) {
      return NextResponse.json({ message: 'Incorrect previous password' }, { status: 401 });
    }

    const newpwdhash = await bcrypt.hash(newpassword, 10);

    const updated = await User.updateOne(
      { userid: decode.userid },
      { $set: { pwdhash: newpwdhash } }
    );

    if (updated.modifiedCount === 0) {
      return NextResponse.json({ message: 'Password not updated. Try again.' }, { status: 500 });
    }
    const message = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e9ecef; border-radius:8px; overflow:hidden;">
        <!-- Header -->
        <div style="background-color:#0d6efd; padding:16px; text-align:center; color:#fff;">
          <h1 style="margin:0; font-size:20px;">Royal Fold</h1>
        </div>

        <!-- Body -->
        <div style="padding:20px; color:#333;">
          <p style="font-size:16px; margin:0 0 12px 0;">Hello,</p>
          <p style="font-size:15px; line-height:1.6; margin:0 0 12px 0;">
            Your password has been <strong>successfully changed</strong>.
          </p>

          <div style="margin:18px 0; text-align:center;">
            <a href="https://royalfold.com/account" 
              style="display:inline-block; padding:10px 20px; border-radius:6px; text-decoration:none; font-weight:600; background-color:#0d6efd; color:#fff;">
              Review Account
            </a>
          </div>

          <p style="font-size:13px; color:#666; margin:0;">
            If you did not make this change, please 
            <a href="https://royalfold.com/support" style="color:#0d6efd; text-decoration:none;">contact support</a> immediately to secure your account.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color:#f8f9fa; padding:14px; text-align:center; font-size:13px; color:#666;">
          Regards,<br /><strong>Royal Fold Team</strong>
        </div>
      </div>
    `;
    const subject ="Password Changed"
    const mess = await Mailer(user.email,subject,message);
    return NextResponse.json({ message: 'sucessfully password changed'}, { status: 200 });

  } catch (err) {
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
