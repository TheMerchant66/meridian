import mongoose, { Document, Schema, Model } from 'mongoose';
import { AccountLevel, Role } from '../enums/role.enum';
import { AccountStatus } from '../enums/accountStatus.enum';

export interface IProfilePicture {
    url: string;
    publicId?: string;
    uploadedAt: Date;
}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    plainPassword?: string;
    dateOfBirth: Date;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    profilePicture?: IProfilePicture | null;
    role: Role;
    accountLevel: AccountLevel;
    accountStatus: AccountStatus;
    allowTransfer: boolean;
    verified: boolean;
    twoFactorEnabled: boolean;
    lastLogin?: Date;
    loanAccount: { balance: number; creditLimit: number };
    investmentAccount: { balance: number };
    checkingAccount: {
        accountNumber: string;
        balance: number;
        cardNumber: string;
        expirationDate: Date;
        cvc: string;
    };
    otp?: {
        code: string;
        expiresAt: Date;
    };
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserWithId extends IUser {
    _id: string;
}

const ProfilePictureSchema = new Schema({
    url: { type: String, required: true },
    publicId: { type: String },
    uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const UserSchema: Schema<IUser> = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        userName: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minLength: 6 },
        plainPassword: { type: String, minLength: 6 },
        dateOfBirth: { type: Date, required: true },
        phoneNumber: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        profilePicture: {
            type: ProfilePictureSchema,
            default: null
        },
        role: { type: String, enum: Role, required: true, default: Role.USER },
        accountLevel: { type: String, enum: AccountLevel, required: true, default: AccountLevel.REGULAR },
        accountStatus: { type: String, enum: AccountStatus, required: true, default: AccountStatus.ACTIVE },
        allowTransfer: { type: Boolean, required: true, default: true },
        verified: { type: Boolean, default: false },
        twoFactorEnabled: { type: Boolean, default: false },
        lastLogin: { type: Date },
        loanAccount: {
            balance: { type: Number, default: 0 },
            creditLimit: { type: Number, default: 5000 },
        },
        investmentAccount: {
            balance: { type: Number, default: 0 },
        },
        checkingAccount: {
            accountNumber: { type: String, required: true, unique: true },
            balance: { type: Number, default: 0 },
            cardNumber: { type: String, required: true, unique: true },
            expirationDate: { type: Date, required: true },
            cvc: { type: String, required: true, minLength: 3, maxLength: 4 },
        },
        otp: {
            code: { type: String },
            expiresAt: { type: Date },
        },
        resetPasswordToken: { type: String, required: false },
        resetPasswordExpires: { type: Date, required: false },
    },
    { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
