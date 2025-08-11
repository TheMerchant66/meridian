import Joi from 'joi';
import { IUser } from '../models/user.model';
import { AccountLevel, Role } from '../enums/role.enum';
import { AccountStatus } from '../enums/accountStatus.enum';

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

export class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    userName?: string;
    email?: string;
    dateOfBirth?: Date;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    profilePicture?: string;
    role?: Role;
    accountLevel?: AccountLevel;
    accountStatus?: AccountStatus;
    allowTransfer?: boolean;
    verified?: boolean;
    checkingAccount?: {
        accountNumber?: string;
        balance?: number;
        cardNumber?: string;
        expirationDate?: Date;
        cvc?: string;
    };

    static validationSchema = Joi.object({
        firstName: Joi.string(),
        lastName: Joi.string(),
        userName: Joi.string(),
        email: Joi.string().email(),
        dateOfBirth: Joi.date(),
        phoneNumber: Joi.string(),
        address: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        postalCode: Joi.string(),
        country: Joi.string(),
        profilePicture: Joi.string().uri().optional(),
        role: Joi.string().valid(...Object.values(Role)),
        accountLevel: Joi.string().valid(...Object.values(AccountLevel)),
        accountStatus: Joi.string().valid(...Object.values(AccountStatus)),
        allowTransfer: Joi.boolean(),
        verified: Joi.boolean(),
        checkingAccount: Joi.object({
            accountNumber: Joi.string(),
            balance: Joi.number(),
            cardNumber: Joi.string(),
            expirationDate: Joi.date(),
            cvc: Joi.string().min(3).max(4),
        }),
    });
}

export class UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;

    static validationSchema = Joi.object({
        firstName: Joi.string().min(2).max(50),
        lastName: Joi.string().min(2).max(50),
        phoneNumber: Joi.string(),
        address: Joi.string().max(200),
        city: Joi.string().max(50),
        state: Joi.string().max(50),
        postalCode: Joi.string().max(20),
        country: Joi.string().max(50),
    });

    constructor(data: UpdateProfileDto) {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.phoneNumber = data.phoneNumber;
        this.address = data.address;
        this.city = data.city;
        this.state = data.state;
        this.postalCode = data.postalCode;
        this.country = data.country;
    }
}

export class UpdateProfilePictureDto {
    url: string;
    publicId?: string;

    static validationSchema = Joi.object({
        url: Joi.string().uri().required(),
        publicId: Joi.string(),
    });

    constructor(data: UpdateProfilePictureDto) {
        this.url = data.url;
        this.publicId = data.publicId;
    }
}