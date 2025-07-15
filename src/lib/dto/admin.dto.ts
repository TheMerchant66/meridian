import Joi from "joi";
import { AccountLevel, Role } from "../enums/role.enum";
import { AccountStatus } from "../enums/accountStatus.enum";

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

    constructor(data: UpdateUserDto) {
        Object.assign(this, data);
    }
}

export class UpdateBalanceDto {
    accountType: 'loanAccount' | 'investmentAccount' | 'checkingAccount';
    balance: number;

    static validationSchema = Joi.object({
        accountType: Joi.string().valid('loanAccount', 'investmentAccount', 'checkingAccount').required(),
        balance: Joi.number().required(),
    });

    constructor(data: UpdateBalanceDto) {
        this.accountType = data.accountType;
        this.balance = data.balance;
    }
}