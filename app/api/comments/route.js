import { cookies } from 'next/headers';
import { verifyToken } from "@/lib/auth";
import { NextResponse } from 'next/server';
import DbConnect from '@/lib/db';
import Comment from '@/models/comment';
import User from '@/models/user';
import Mailer from "@/lib/mailer";
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export function sanitizeHtml(html) {
  return DOMPurify.sanitize(html);
}

export async function POST(request) {
  try {
    await DbConnect();
    let { productid, comment, userName, userEmail } = await request.json();

    if (!comment) {
      return NextResponse.json({ message: 'Missing comment' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    let newComment;

    if (token) {
      try {
        const decoded = verifyToken(token);
        const user = await User.findOne({ userid: decoded.userid });

        if (!user) {
          return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        newComment = new Comment({
          productid:sanitizeHtml(productid),
          comment:sanitizeHtml(comment),
          userEmail: sanitizeHtml(user.email),
          userName: sanitizeHtml(`${user.fname} ${user.lname}`),
        });
      } catch (err) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }
    } else if (userName && userEmail) {
      newComment = new Comment({
        productid:sanitizeHtml(productid),
        comment:sanitizeHtml(comment),
        userEmail:sanitizeHtml(userEmail),
        userName:sanitizeHtml(userName),
      });
    } else {
      return NextResponse.json({ message: 'Please provide username and email' }, { status: 400 });
    }

    const savedComment = await newComment.save();
    const subject ="Rewiew Submittion"
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <!-- Header -->
        <div style="background-color: #0d6efd; padding: 16px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">Royal Fold & Forge</h1>
        </div>

        <!-- Body -->
        <div style="padding: 20px; color: #333;">
          <p style="font-size: 16px;">🙏 Thank You <strong>${userName}</strong> !!!</p>
          <p style="font-size: 15px; line-height: 1.6;">
            Your review has been <strong>successfully submitted</strong>.
          </p>
          <p style="font-size: 15px; line-height: 1.6;">
            We truly appreciate your feedback and look forward to serving you again.
          </p>
          <div style="margin-top: 20px; text-align: center;">
            <a href="https://royalfoldforge.com/reviews" 
              style="display: inline-block; background-color: #0d6efd; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">
              View Your Review
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 13px; color: #666;">
          Regards,<br>
          <strong>Royal Fold & Forge Team</strong>
        </div>
      </div>
    `;

    const mess = await Mailer(userEmail,subject,message);
    return NextResponse.json({ message: 'review sucessfully submitted'}, { status: 201 });

  } catch (err) {
    return NextResponse.json(
  { message: 'Error occurred. Avoid special characters or HTML tags.' },
  { status: 500 }
);

  }
}


export async function DELETE(request) {
  try {
    await DbConnect();
    const { cid } = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else if (decoded.apikey !== process.env.API_KEY) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else {
      const result = await Comment.deleteOne({ _id: cid });
      if (result.deletedCount === 0) {
        return NextResponse.json({ message: "Comment not found" }, { status: 404 });
      }
      return NextResponse.json({ message: "Comment deleted successfully" }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ message: "Failed to delete comment" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await DbConnect();
    const { searchParams } = new URL(request.url);
    const pid = searchParams.get("get");

    if (!pid) {
      const comments = await Comment.find({}).sort({createdAt:-1});
      return NextResponse.json(comments, { status: 200 });
    }
    else{
      const comments = await Comment.find({productid:pid}).sort({createdAt:-1});
      return NextResponse.json(comments, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


