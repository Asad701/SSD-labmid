import { NextResponse } from "next/server";
import DbConnect from "@/lib/db";
import User from "@/models/user";
import Mailer from "@/lib/mailer";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
export async function DELETE(request) {
  try {
    await DbConnect();
    const { uid } = await request.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ==========================================
    // IDOR PROTECTION (TOGGLE VERSIONS)
    // ==========================================

    // --- VERSION 1: PREVENT ATTACK (Secure) ---
    /*
    if (decoded.userid !== uid && decoded.role !== 'admin') {
      console.warn(`[SECURITY] Blocked unauthorized deletion attempt by ${decoded.userid} on user ${uid}`);
      return NextResponse.json({ message: "Forbidden: You cannot delete other users." }, { status: 403 });
    }
    */

    // --- VERSION 2: DO ATTACK (Vulnerable) ---
    // (Active: Allows any user to delete any UID for demonstration)

    // ✅ Find user before deleting
    const user = await User.findOne({ userid: uid });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Save details before deletion
    const userEmail = user.email;
    const userName = user.name || "User";

    // ✅ Delete user
    await User.deleteOne({ userid: uid });

    // ✅ Prepare email
    const subject = "Account Deletion";
    const message = `
      <div style="font-family: Arial, sans-serif; max-width:550px; margin:auto; border:1px solid #e9ecef; border-radius:8px; overflow:hidden;">
        <!-- Header -->
        <div style="background-color:#dc3545; padding:16px; text-align:center; color:#fff;">
          <h1 style="margin:0; font-size:20px;">Goodbye from Royal Fold & Forge</h1>
        </div>
        <!-- Body -->
        <div style="padding:20px; color:#333;">
          <p style="font-size:16px; margin:0 0 12px 0;">
            Goodbye <strong>${userName}</strong> 👋
          </p>
          <p style="font-size:15px; line-height:1.6; margin:0 0 12px 0;">
            Your account has been <strong>successfully deleted</strong>.
            We’re sad to see you go, but we truly appreciate the time you spent with us.
          </p>
          <p style="font-size:14px; color:#666; margin:0 0 12px 0;">
            If you ever change your mind, you’ll always be welcome back at
            <a href="https://royalfoldforge.com" style="color:#0d6efd; text-decoration:none;">Royal Fold & Forge</a>.
          </p>
        </div>
        <!-- Footer -->
        <div style="background-color:#f8f9fa; padding:14px; text-align:center; font-size:13px; color:#666;">
          Regards,<br /><strong>Royal Fold & Forge Team</strong>
        </div>
      </div>
    `;

    // ✅ Send email after deletion
    await Mailer(userEmail, subject, message);

    return NextResponse.json(
      { message: "User data deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /api/user error:", err);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}


export async function GET(request) {
  try {
    await DbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.apikey !== process.env.API_KEY) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json(users, { status: 200 });

  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    await DbConnect();
    const { searchId } = await request.json();

    if (!searchId) {
      return NextResponse.json({ message: "Missing searchId" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (decoded.apikey !== process.env.API_KEY) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.find({ userid: searchId }).sort({ createdAt: -1 });
    return NextResponse.json(user, { status: 200 });

  } catch (err) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

