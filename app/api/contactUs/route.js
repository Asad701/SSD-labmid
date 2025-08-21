import { NextResponse } from 'next/server';
import Mailer from "@/lib/mailer";

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const subject = "Complaint Submission";

    /** =============================
     * Email to User
     * ============================= */
    const userEmailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <div style="background-color: #0d6efd; padding: 16px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">Royal Fold & Forge</h1>
          </div>

          <!-- Body -->
          <div style="padding: 20px; color: #333;">
            <p style="font-size: 16px;">🙏 Thank You <strong>${name}</strong>.</p>
            <p style="font-size: 15px; line-height: 1.6;">
              Your message has been <strong>successfully submitted</strong>.
            </p>
            <p style="font-size: 15px; line-height: 1.6;">
              We will get back to you as soon as possible.
            </p>
            <div style="margin-top: 20px; text-align: center;">
              <a href="https://royalfoldforge.com/contact" 
                style="display: inline-block; background-color: #0d6efd; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">
                Contact Us Again
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

    await Mailer(email, subject, userEmailContent);

    /** =============================
     * Email to Admin
     * ============================= */
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <!-- Header -->
        <div style="background-color: #dc3545; padding: 16px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">Royal Fold & Forge - Admin Notification</h1>
        </div>

        <!-- Body -->
        <div style="padding: 20px; color: #333;">
          <p style="font-size: 16px;">Hi Admin,</p>
          <p style="font-size: 15px; line-height: 1.6;">
            <strong>${name}</strong> has sent you a message.
          </p>
          <pre style="margin:15px 0; padding:15px; background-color: #f8f9fa; border-left: 4px solid #0d6efd; white-space: pre-wrap; font-size: 14px; line-height: 1.5;">
      ${message}
          </pre>
          <p style="font-size: 15px; line-height: 1.6;">
            Please check the admin panel to reply or take action.
          </p>
          <div style="margin-top: 20px; text-align: center;">
            <a href="mailto:${email}" 
              style="display: inline-block; background-color: #0d6efd; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">
              Reply to ${name}
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 13px; color: #666;">
          Regards,<br>
          <strong>Royal Fold & Forge Team</strong>
        </div>
      </div>
    `;

    await Mailer(process.env.MAIL, subject, adminEmailContent);

    return NextResponse.json(
      { success: true, message: 'Message sent successfully.' },
      { status: 200 }
    );

  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
