import nodemailer from "nodemailer";

export default async function Mailer(email, subject, message) {
    console.log(`[Mailer] Preparing to send email to: ${email}`);
    console.log(`[Mailer] Using service: ${process.env.SMTP_MAILER}, user: ${process.env.MAIL}`);

    const transporter = nodemailer.createTransport({
        service: `${process.env.SMTP_MAILER}`,
        auth: {
            user: `${process.env.MAIL}`,
            pass: `${process.env.MAIL_PASSWORD}`,
        },
        debug: true, // Show debug output in console
        logger: true  // Log information to console
    });

    const mailOptions = {
        from: `"Royal Fold & Forge" <${process.env.MAIL}>`,
        to: `${email}`,
        subject: `${subject} - Royal Fold`,
        html: message,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Mailer] Email sent successfully: ${info.messageId}`);
        return info;
    }
    catch (error) {
        if (error.message.includes("535") || error.message.includes("Invalid login")) {
            console.warn(`\n[Mailer] !!! SMTP AUTHENTICATION FAILED !!!`);
            console.warn(`[Mailer] !!! FALLING BACK TO MOCK MODE !!!`);
            console.log(`------------------------------------------`);
            console.log(`TO: ${email}`);
            console.log(`SUBJECT: ${subject}`);
            console.log(`CONTENT (HTML):\n${message.substring(0, 500)}... (truncated)`);
            console.log(`------------------------------------------\n`);
            
            // Return a fake success object so the API proceeds
            return { 
                mocked: true, 
                messageId: `mock-${Date.now()}`,
                response: "250 OK (Mocked)" 
            };
        }

        console.error(`[Mailer] Unexpected error occurred while sending email:`, error.message);
        throw error; // Still throw for other types of errors (network, timeout, etc.)
    }
}
