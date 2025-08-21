import nodemailer from "nodemailer";

export default async function Mailer(email,subject,message){
    const transporter = nodemailer.createTransport({
        service: `${process.env.SMTP_MAILER}`,
        auth: {
            user: `${process.env.MAIL}`,
            pass: `${process.env.MAIL_PASSWORD}`,
        },
        });
    const mailOptions = {
      from: `${process.env.MAIL}`,
      to: `${email}`,
      subject: `${subject} - Royal Fold`,
      html:message,
    };
    try{
        const message = await transporter.sendMail(mailOptions);
        return message;
    }
    catch(error){
        return error;
    }
}
