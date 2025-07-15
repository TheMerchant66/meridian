import nodemailer, { SendMailOptions } from "nodemailer";
import { EmailService } from "../email.service";
import { CustomError } from "@/lib/utils/customError.utils";

export class EmailServiceImpl implements EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: parseInt(process.env.EMAIL_PORT || "465", 10),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOTPEmail(to: string, otpCode: string): Promise<void> {
    console.log("Email User:", process.env.EMAIL_USER);
    console.log("Email Pass:", process.env.EMAIL_PASS);

    try {
      const mailOptions: SendMailOptions = {
        from: '"Stellarone Holdings" <no-reply@meridianprivateholdings.com>',
        to,
        subject: "Your One-Time Password (OTP) for Stellarone Holdings",
        html: this.getOTPEmailTemplate(otpCode),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("OTP Email sent successfully:", {
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected,
      });

      if (info.rejected.length > 0) {
        throw new CustomError(500, "Failed to send OTP email");
      }
    } catch (error) {
      console.error("Error sending OTP email:", error);
      throw new CustomError(500, "Failed to send OTP email");
    }
  }

  private getOTPEmailTemplate(otpCode: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <div style="background: #ffffff; padding: 28px 24px; border-radius: 16px 16px 0 0; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: 20px; left: 20px; width: 32px; height: 32px; background: rgba(96, 165, 250, 0.2); border-radius: 50%; animation: pulse 2s infinite;"></div>
          <div style="position: absolute; bottom: 20px; right: 20px; width: 24px; height: 24px; background: rgba(192, 132, 252, 0.2); border-radius: 50%; animation: pulse 2s infinite 1s;"></div>
          <img src="https://meridianprivateholdings.com/images/logo-black.png" alt="Stellarone Holdings" style="height: 40px; width: auto; margin: 0;" />
        </div>
        <!-- Content -->
        <div style="background: #ffffff; padding: 32px 24px; border-radius: 0 0 16px 16px;">
          <h2 style="color: #18181b; font-size: 24px; font-weight: 600; margin-bottom: 16px;">Your One-Time Password</h2>
          <p style="color: #52525b; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
            Use the following code to complete your login. This code will expire in 10 minutes.
          </p>
          <div style="background: linear-gradient(to right, #18181b, #27272a, #18181b); border-radius: 10px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <div style="font-size: 32px; font-weight: bold; color: #ffffff; letter-spacing: 8px; font-family: monospace;">
              ${otpCode}
            </div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 16px; margin-bottom: 24px;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              <strong style="color: #b91c1c;">Security Tip:</strong> Never share this code with anyone, including SecureBank staff. We will never ask for your OTP via phone or email.
            </p>
          </div>
          <p style="color: #71717a; font-size: 14px; line-height: 1.5;">
            If you didn't request this code, please ignore this email or contact our support team immediately.
          </p>
          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #a1a1aa; font-size: 12px; text-align: center;">
              Stellarone Holdings | 123 Banking Street, Finance City, FC 12345
              <br />
              This is an automated message, please do not reply.
            </p>
          </div>
        </div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `;
  }

  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    try {
      const mailOptions: SendMailOptions = {
        from: '"Stellarone Holdings" <no-reply@meridianprivateholdings.com>',
        to,
        subject: "Password Reset Request for Stellarone Holdings",
        html: this.getPasswordResetEmailTemplate(resetUrl),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Password Reset Email sent successfully:", {
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected,
      });

      if (info.rejected.length > 0) {
        throw new CustomError(500, "Failed to send password reset email");
      }
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw new CustomError(500, "Failed to send password reset email");
    }
  }

  private getPasswordResetEmailTemplate(resetUrl: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <div style="background: #ffffff; padding: 28px 24px; border-radius: 16px 16px 0 0; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: 20px; left: 20px; width: 32px; height: 32px; background: rgba(96, 165, 250, 0.2); border-radius: 50%; animation: pulse 2s infinite;"></div>
          <div style="position: absolute; bottom: 20px; right: 20px; width: 24px; height: 24px; background: rgba(192, 132, 252, 0.2); border-radius: 50%; animation: pulse 2s infinite 1s;"></div>
          <img src="https://meridianprivateholdings.com/images/logo-black.png" alt="Stellarone Holdings" style="height: 40px; width: auto; margin: 0;" />
        </div>
        <!-- Content -->
        <div style="background: #ffffff; padding: 32px 24px; border-radius: 0 0 16px 16px;">
          <h2 style="color: #18181b; font-size: 24px; font-weight: 600; margin-bottom: 16px;">Reset Your Password</h2>
          <p style="color: #52525b; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
            You requested to reset your password for your Stellarone Holdings account. Click the button below to create a new password. This link will expire in 1 hour.
          </p>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(to right, #18181b, #27272a); color: #ffffff; font-size: 16px; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
              Reset Password
            </a>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 16px; margin-bottom: 24px;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              <strong style="color: #b91c1c;">Security Tip:</strong> If you didn't request a password reset, please ignore this email or contact our support team immediately.
            </p>
          </div>
          <p style="color: #71717a; font-size: 14px; line-height: 1.5;">
            For security reasons, do not share this link with anyone.
          </p>
          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #a1a1aa; font-size: 12px; text-align: center;">
              Stellarone Holdings | 123 Banking Street, Finance City, FC 12345
              <br />
              This is an automated message, please do not reply.
            </p>
          </div>
        </div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `;
  }
}
