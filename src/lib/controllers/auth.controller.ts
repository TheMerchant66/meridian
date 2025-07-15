import { NextRequest, NextResponse } from 'next/server';
import { validator } from '../utils/validator.utils';
import { ForgotPasswordDto, RegisterUserDto, ResetPasswordDto, VerifyOtpDto } from '../dto/user.dto';
import { AuthService } from '../services/auth.service';
import AuthServiceImpl from '../services/impl/auth.service.impl';

const authService: AuthService = new AuthServiceImpl();

export async function registerController(req: NextRequest) {
    const body = await req.json();
    const registerUserDto = new RegisterUserDto(body);
    const errors = validator(RegisterUserDto, registerUserDto);
    if (errors) {
        return NextResponse.json({ message: 'Validation Error', errors: errors.details }, { status: 400 });
    }

    await authService.register(registerUserDto);
    return NextResponse.json({ message: 'Registration successful' }, { status: 201 });
}

export async function loginController(req: NextRequest) {
    const { accountNumber, password } = await req.json();
    const response = await authService.login(accountNumber, password);
    return NextResponse.json({ message: 'Login successful', ...response }, { status: 200 });
}

export async function verifyOTPController(req: NextRequest) {
    const body = await req.json();
    const verifyOtpDto = new VerifyOtpDto(body);
    const errors = validator(VerifyOtpDto, verifyOtpDto);
    if (errors) {
        return NextResponse.json({ message: 'Validation Error', errors: errors.details }, { status: 400 });
    }

    const response = await authService.verifyOTP(verifyOtpDto.accountNumber, verifyOtpDto.otpCode);
    return NextResponse.json({ message: 'OTP verified successfully', ...response }, { status: 200 });
}

export async function forgotPasswordController(req: NextRequest) {
    const body = await req.json();
    const forgotPasswordDto = new ForgotPasswordDto(body);
    const errors = validator(ForgotPasswordDto, forgotPasswordDto);
    if (errors) {
        return NextResponse.json({ message: 'Validation Error', errors: errors.details }, { status: 400 });
    }

    await authService.forgotPassword(forgotPasswordDto);
    return NextResponse.json({ message: 'Password reset instructions sent to your email' }, { status: 200 });
}

export async function resetPasswordController(req: NextRequest) {
    const body = await req.json();
    const resetPasswordDto = new ResetPasswordDto(body);
    const errors = validator(ResetPasswordDto, resetPasswordDto);
    if (errors) {
        return NextResponse.json({ message: 'Validation Error', errors: errors.details }, { status: 400 });
    }

    await authService.resetPassword(resetPasswordDto);
    return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
}