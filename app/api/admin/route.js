import DbConnect from "@/lib/db";
import Admin from "@/models/admin";
import { NextResponse } from "next/server";
import { signToken, verifyToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";



async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// POST LOGIN
export async function POST(request) {
  await DbConnect();
  const { searchParams } = new URL(request.url);
  const apikey = searchParams.get('apikey');
  const body = await request.json();
  const { username, password } = body;

  try {
    const user = await Admin.findOne({username:username});

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordCorrect = await verifyPassword(password, user.pwdhash);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (apikey !== process.env.API_KEY) {
        return NextResponse.json({ message: "Unauthorized: invalid API key" }, { status:401 });
      }

    const token = signToken({ apikey: apikey , username:username });

    const response = NextResponse.json({ message: 'Login successful', user },{status:200});
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      return response;

  }catch (error) {

  return NextResponse.json({ message: "internal server error" }, { status:500});
  }


}


// PATCH for password change
export async function PATCH(request) {
  await DbConnect();
  try {
    const cookieStore = await cookies();
    const token = cookieStore?.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 401 });
    }

    const decode = verifyToken(token);

    if (!decode.apikey || decode.apikey !== process.env.API_KEY) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 401 });
    }

    const { prevpassword, newpassword } = await request.json();

    const user = await Admin.findOne({ username: decode.username });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const flag = await bcrypt.compare(prevpassword, user.pwdhash); // assuming compare is used

    if (!flag) {
      return NextResponse.json({ message: 'Incorrect previous password' }, { status: 401 });
    }

    const newpwdhash = await bcrypt.hash(newpassword, 10);
    const updated = await Admin.updateOne(
      { username: decode.username },
      { $set: { pwdhash: newpwdhash } }
    );

    if (updated.modifiedCount === 0) {
      return NextResponse.json({ message: 'Password not updated. Try again.' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Password changed successfully.' }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}

// GET for verification
export async function GET(request) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('token')?.value;
  if (!tokenCookie) {
    return NextResponse.json({ message: 'No token provided' }, { status: 401 });
  }
  try{
    const decoded = verifyToken(tokenCookie);
    if (decoded.apikey === process.env.API_KEY) {
      return NextResponse.json({ message: 'Access given' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  }catch (err) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}
