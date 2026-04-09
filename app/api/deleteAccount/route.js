import { cookies } from "next/headers";
import DbConnect from "@/lib/db";
import User from "@/models/user";
import Mailer from "@/lib/mailer"; // assumes Mailer(to, subject, html)

export async function POST(req) {
  try {
    let userid;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      userid = body.userid;
    } else {
      // Handle standard HTML form data (CSRF demo)
      const formData = await req.formData();
      userid = formData.get("userid");
    }

    if (!userid) {
      return new Response(JSON.stringify({ error: "Missing userid" }), { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await DbConnect();
    const user = await User.findOne({ userid });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Email subject + template
    const subject = "Account Deletion Request";
    const message = `
      <div style="font-family: Arial, sans-serif; max-width:500px; margin:auto; border:1px solid #e9ecef; border-radius:8px; overflow:hidden;">
        <div style="background-color:#dc3545; padding:16px; text-align:center; color:#fff;">
          <h1 style="margin:0; font-size:20px;">Account Deletion Request</h1>
        </div>
        <div style="padding:20px; color:#333;">
          <p>Hello <strong>${user.fname} ${user.lname}</strong>,</p>
          <p>We have received your request to <b>delete your account</b>. Below are your account details:</p>
          
          <table style="width:100%; margin:15px 0; border-collapse:collapse;">
            <tr>
              <td style="padding:8px; border:1px solid #ddd;"><b>User ID</b></td>
              <td style="padding:8px; border:1px solid #ddd;">${user.userid}</td>
            </tr>
            <tr>
              <td style="padding:8px; border:1px solid #ddd;"><b>First Name</b></td>
              <td style="padding:8px; border:1px solid #ddd;">${user.fname}</td>
            </tr>
            <tr>
              <td style="padding:8px; border:1px solid #ddd;"><b>Last Name</b></td>
              <td style="padding:8px; border:1px solid #ddd;">${user.lname}</td>
            </tr>
            <tr>
              <td style="padding:8px; border:1px solid #ddd;"><b>Email</b></td>
              <td style="padding:8px; border:1px solid #ddd;">${user.email}</td>
            </tr>
            <tr>
              <td style="padding:8px; border:1px solid #ddd;"><b>Country</b></td>
              <td style="padding:8px; border:1px solid #ddd;">${user.country || "Not Provided"}</td>
            </tr>
            <tr>
              <td style="padding:8px; border:1px solid #ddd;"><b>Created On</b></td>
              <td style="padding:8px; border:1px solid #ddd;">${new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          </table>

          <p style="font-size:14px; color:#666;">
            If you did not make this request, please <a href="https://royalfold.com/contactus">contact us immediately</a>.
          </p>
        </div>
        <div style="background-color:#f8f9fa; padding:14px; text-align:center; font-size:13px; color:#666;">
          Regards,<br /><strong>Royal Fold & Forge Team</strong>
        </div>
      </div>
    `;

    // 📩 Send to User
    await Mailer(user.email, subject, message);

    // 📩 Send to Admin also
    await Mailer(process.env.MAIL, `[ADMIN COPY] ${subject}`, message);

    return new Response(JSON.stringify({ success: true, message: "Emails sent" }), { status: 200 });

  } catch (err) {
    console.error("Mailer Error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
