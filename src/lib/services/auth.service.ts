import { ForgotPasswordDto, LoginResponseDto, RegisterUserDto, ResetPasswordDto } from "../dto/user.dto";
import { IUser } from "../models/user.model";

export interface AuthService {
  register(registrationData: RegisterUserDto): Promise<void>;
  login(accountNumber: string, password: string, email?: string): Promise<IUser>;
  sendOTP(accountNumber: string): Promise<void>;
  verifyOTP(accountNumber: string, otpCode: string, email?: string): Promise<LoginResponseDto>;
  forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void>;
  resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void>;
}