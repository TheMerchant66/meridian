export interface EmailService {
    sendOTPEmail(to: string, otpCode: string): Promise<void>;
    sendPasswordResetEmail(to: string, resetUrl: string): Promise<void>;
}