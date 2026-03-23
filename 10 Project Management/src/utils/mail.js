import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const sendEmail = async (to, subject, html) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Project Management App",
            link: "https://project-management-app.com",
        },
    });

    const emailTextual = mailGenerator.generatePlaintext(Options.mailgenContent);

    const emailHtml = mailGenerator.generate(Options.mailgenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
});

    const mail = {
        from:"mail.task@project-management-app.com",
        to:options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml,
    }

    try {
        await transporter.sendMail(mail);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro:
        "Welcome to our project management app! We're excited to have you on board.",
      action: {
        instructions:
          "To verify your email address, please click the button below:",
        button: {
          color: "#22755B",
          text: "Verify your Email",
          link: verificationUrl,
        },
      },
      outro:
        "If you did not sign up for this account, please ignore this email.",
    },
  };
};

const forgotPasswordMailgenContent = (username, resetUrl) => {
  return {
    body: {
      name: username,
      intro:
        "We received a request to reset your password. If you made this request, please click the button below to reset your password.",
      action: {
        instructions: "To reset your password, please click the button below:",
        button: {
          color: "#22755B",
          text: "Reset your Password",
          link: resetUrl,
        },
      },
      outro:
        "If you did not request a password reset, please ignore this email.",
    },
  };
};

export { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail };
