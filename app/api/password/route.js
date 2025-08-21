import DbConnect from "@/lib/db";
import TempCode from "@/models/tempcode";
import { NextResponse } from "next/server";

export async function POST(request) {
  await DbConnect();

  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json({ message: "Please provide email and code." }, { status: 400 });
    }

    // Find temp code for this email
    const tempcode = await TempCode.findOne({ email, code }).lean();

    if (!tempcode) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
    }

    // OPTIONAL: If you store an expiry date in TempCode, check here
    if (tempcode.expiresAt && new Date() > tempcode.expiresAt) {
      return NextResponse.json({ message: "Code has expired." }, { status: 410 }); // 410 Gone
    }

    return NextResponse.json({ message: "Verified" }, { status: 200 });
  } catch (err) {

    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
