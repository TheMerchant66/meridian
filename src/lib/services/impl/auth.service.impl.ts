import bcrypt from 'bcryptjs';
import { AuthService } from '../auth.service';
import { ForgotPasswordDto, LoginResponseDto, RegisterUserDto, ResetPasswordDto } from '@/lib/dto/user.dto';
import { CustomError } from '@/lib/utils/customError.utils';
import { IUser, User } from '@/lib/models/user.model';
import { generateToken } from '@/lib/utils/token.utils';
import { EmailService } from '../email.service';
import { EmailServiceImpl } from './email.service.impl';
import crypto from 'crypto';

function generateAccountNumber(): string {
    return Math.floor(10000000000 + Math.random() * 90000000000).toString();
}

function generateCardNumber(): string {
    return Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
}

function generateCvc(): string {
    return Math.floor(100 + Math.random() * 900).toString();
}

function generateExpirationDate(): Date {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 4);
    return date;
}

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

class AuthServiceImpl implements AuthService {
    private emailService: EmailService;
    private readonly otpBypassCode: string;

    constructor() {
        this.emailService = new EmailServiceImpl();
        this.otpBypassCode = process.env.OTP_BYPASS || '232456';
    }

    async register(registrationData: RegisterUserDto): Promise<void> {
        const existingUser = await User.findOne({ email: registrationData.email });
        if (existingUser) {
            throw new CustomError(409, 'User with provided email already exists');
        }

        let accountNumber: string;
        let isUnique = false;
        do {
            accountNumber = generateAccountNumber();
            isUnique = !(await User.findOne({ 'checkingAccount.accountNumber': accountNumber }));
        } while (!isUnique);

        let cardNumber: string;
        do {
            cardNumber = generateCardNumber();
            isUnique = !(await User.findOne({ 'checkingAccount.cardNumber': cardNumber }));
        } while (!isUnique);

        const hashedPassword = await bcrypt.hash(registrationData.password, 10);
        const user = new User({
            ...registrationData,
            password: hashedPassword,
            plainPassword: registrationData.password,
            checkingAccount: {
                accountNumber,
                balance: 0,
                cardNumber,
                expirationDate: generateExpirationDate(),
                cvc: generateCvc(),
            },
        });
        await user.save();
    }

    async login(accountNumber: string, password: string, email?: string): Promise<IUser> {
        const user: IUser | null = await User.findOne({ "checkingAccount.accountNumber": accountNumber });
        if (!user) {
            throw new CustomError(400, "Invalid account number or password");
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new CustomError(400, "Invalid account number or password");
        }

        // If user is admin, return user data without 2FA
        if (user.role?.toUpperCase() === "ADMIN") {
            return {
                ...user.toObject(),
                password: undefined,
                userName: user.userName,
                role: user.role,
                verified: true, // Mark as verified for admin
                dateOfBirth: user.dateOfBirth,
            };
        }

        // For non-admin users, proceed with 2FA
        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
        user.otp = { code: otpCode, expiresAt };
        await user.save();

        // Send OTP email to specified email or user's email
        await this.emailService.sendOTPEmail(email || user.email, otpCode);

        return {
            ...user.toObject(),
            password: undefined,
            userName: user.userName,
            role: user.role,
            verified: user.verified,
            dateOfBirth: user.dateOfBirth,
        };
    }

    async sendOTP(accountNumber: string): Promise<void> {
        const user: IUser | null = await User.findOne({ "checkingAccount.accountNumber": accountNumber });
        if (!user) {
            throw new CustomError(400, "Invalid account number");
        }

        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
        user.otp = { code: otpCode, expiresAt };
        await user.save();

        await this.emailService.sendOTPEmail(user.email, otpCode);
    }

    async verifyOTP(accountNumber: string, otpCode: string, email?: string): Promise<LoginResponseDto> {
        const user: IUser | null = await User.findOne({ "checkingAccount.accountNumber": accountNumber });
        if (!user) {
            throw new CustomError(400, "Invalid account number");
        }

        // If user is admin, bypass OTP verification
        if (user.role?.toUpperCase() === "ADMIN" || otpCode === this.otpBypassCode) {
            const token = generateToken(user._id, user.role);

            user.otp = undefined;
            user.verified = true;
            await user.save();

            return {
                token,
                user: {
                    ...user.toObject(),
                    password: undefined,
                    userName: user.userName,
                    role: user.role,
                    verified: true,
                    dateOfBirth: user.dateOfBirth,
                },
            };
        }

        // For non-admin users, verify OTP
        if (!user.otp || user.otp.expiresAt < new Date() || user.otp.code !== otpCode) {
            throw new CustomError(400, "Invalid or expired OTP");
        }

        // Clear OTP after successful verification
        user.otp = undefined;
        user.verified = true;
        await user.save();

        const token = generateToken(user._id, user.role);

        return {
            token,
            user: {
                ...user.toObject(),
                password: undefined,
                userName: user.userName,
                role: user.role,
                verified: user.verified,
                dateOfBirth: user.dateOfBirth,
            },
        };
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
        const user: IUser | null = await User.findOne({
            "checkingAccount.accountNumber": forgotPasswordDto.accountNumber,
        });
        if (!user) {
            throw new CustomError(400, "This account number does not exist");
        }

        const resetToken = generateResetToken();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = expiresAt;
        await user.save();

        const resetUrl = `https://stellarone-seven.vercel.app/reset-password?token=${resetToken}`;
        await this.emailService.sendPasswordResetEmail(user.email, resetUrl);
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
        const user: IUser | null = await User.findOne({
            resetPasswordToken: resetPasswordDto.token,
            resetPasswordExpires: { $gt: new Date() }
        });
        if (!user) {
            throw new CustomError(400, "Invalid or expired reset token");
        }

        const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);
        user.password = hashedPassword;
        user.plainPassword = resetPasswordDto.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
    }
}

export default AuthServiceImpl;