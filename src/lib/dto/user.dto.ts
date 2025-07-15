import Joi from 'joi';
import { IUser } from '../models/user.model';

export class RegisterUserDto {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    dateOfBirth: Date;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;

    static validationSchema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        userName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        dateOfBirth: Joi.date().required(),
        phoneNumber: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        postalCode: Joi.string().required(),
        country: Joi.string().required(),
    });

    constructor(data: RegisterUserDto) {
        this.firstName = data.firstName!;
        this.lastName = data.lastName!;
        this.userName = data.userName!;
        this.email = data.email!;
        this.password = data.password!;
        this.dateOfBirth = data.dateOfBirth!;
        this.phoneNumber = data.phoneNumber!;
        this.address = data.address!;
        this.city = data.city!;
        this.state = data.state!;
        this.postalCode = data.postalCode!;
        this.country = data.country!;
    }
}

export interface LoginResponseDto {
    token: string;
    user: IUser;
}

export class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;

    static validationSchema = Joi.object({
        currentPassword: Joi.string().min(6).required(),
        newPassword: Joi.string().min(6).required(),
    });

    constructor(data: ChangePasswordDto) {
        this.currentPassword = data.currentPassword!;
        this.newPassword = data.newPassword!;
    }
}

export class VerifyOtpDto {
    accountNumber: string;
    otpCode: string;

    static validationSchema = Joi.object({
        accountNumber: Joi.string().required(),
        otpCode: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
    });

    constructor(data: VerifyOtpDto) {
        this.accountNumber = data.accountNumber!;
        this.otpCode = data.otpCode!;
    }
}

export class ForgotPasswordDto {
    accountNumber: string;

    static validationSchema = Joi.object({
        accountNumber: Joi.string().required(),
    });

    constructor(data: ForgotPasswordDto) {
        this.accountNumber = data.accountNumber!;
    }
}

export class ResetPasswordDto {
    password: string;
    token: string;

    static validationSchema = Joi.object({
        password: Joi.string().min(6).required(),
        token: Joi.string().required(),
    });

    constructor(data: ResetPasswordDto) {
        this.password = data.password!;
        this.token = data.token!;
    }
}