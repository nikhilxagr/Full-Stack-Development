import nodemailer from "nodemailer";
import User from "@/models/userModel";
import crypto from "crypto";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: token,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
      port: Number(process.env.MAILTRAP_PORT) || 2525,
      auth: {
        user: process.env.MAILTRAP_USER || "3fd364695517df",
        pass: process.env.MAILTRAP_PASS || "7383d58fd399cf",
      },
    });

    const domain = process.env.DOMAIN || "http://localhost:3000";
    const targetLink =
      emailType === "VERIFY"
        ? `${domain}/verifyemail?token=${token}`
        : `${domain}/resetpassword?token=${token}`;
    const actionText = emailType === "VERIFY" ? "Verify your email address" : "Reset your password";
    const titleText = emailType === "VERIFY" ? "Email Verification Required" : "Password Reset Request";

    const mailOptions = {
      from: process.env.SENDER_EMAIL || "auth@nexus.app",
      to: email,
      subject: emailType === "VERIFY" ? "Verify your Auth App Account" : "Reset your Auth App Password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 40px 20px; }
            .container { max-width: 560px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 40px; text-align: center; }
            .badge { display: inline-block; padding: 6px 14px; background: rgba(99, 102, 241, 0.15); color: #818cf8; border-radius: 9999px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 24px; }
            h1 { color: #ffffff; font-size: 24px; font-weight: 700; margin-bottom: 16px; }
            p { color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 28px; }
            .btn { display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #ffffff !important; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4); margin-bottom: 28px; }
            .link-box { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 12px; font-size: 12px; color: #64748b; word-break: break-all; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="badge">Security Notification</div>
            <h1>${titleText}</h1>
            <p>Thank you for using our Authentication platform. Click the button below to complete the action for <strong>${email}</strong>.</p>
            <a href="${targetLink}" class="btn" target="_blank">${actionText}</a>
            <p style="font-size: 13px; color: #64748b;">If you did not request this email, you can safely ignore it.</p>
            <div class="link-box">Or copy and paste this link: ${targetLink}</div>
          </div>
        </body>
        </html>
      `,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};