import Joi from 'joi';
import { TransactionType, TransactionStatus } from '../enums/transactionType.enum';
import { LoanType } from '../enums/loanType.enum';

export class AddTransactionDto {
    type: TransactionType;
    amount: number;
    currency: string;
    accountType: 'loanAccount' | 'investmentAccount' | 'checkingAccount';
    status?: TransactionStatus;
    recipient?: string;
    paymentMethod?: string;
    notes?: string;
    loanType?: LoanType;
    password?: string;
    chequeDetails?: {
        chequeNumber: string;
        date: Date;
        description: string;
        frontImage: string;
        backImage: string;
    };
    cryptoDetails?: {
        network: string;
        walletAddress: string;
        proofOfPayment?: string;
    };
    transferDetails?: {
        accountName: string;
        accountNumber: string;
        bankName: string;
        country: string;
        swiftCode: string;
        iban?: string;
        bankAddress: string;
        description?: string;
    };
    createdAt?: Date;

    static validationSchema = Joi.object({
        type: Joi.string()
            .valid(...Object.values(TransactionType))
            .required(),
        amount: Joi.number().positive().required(),
        currency: Joi.string().required(),
        accountType: Joi.string()
            .valid('loanAccount', 'investmentAccount', 'checkingAccount')
            .required(),
        status: Joi.string().valid(...Object.values(TransactionStatus)),
        recipient: Joi.string(),
        paymentMethod: Joi.string(),
        notes: Joi.string(),
        loanType: Joi.string().valid(...Object.values(LoanType)),
        password: Joi.string().allow(''),
        chequeDetails: Joi.object({
            chequeNumber: Joi.string(),
            date: Joi.date(),
            description: Joi.string(),
            frontImage: Joi.string(),
            backImage: Joi.string(),
        }),
        cryptoDetails: Joi.object({
            network: Joi.string(),
            walletAddress: Joi.string(),
            proofOfPayment: Joi.string(),
        }),
        transferDetails: Joi.object({
            accountName: Joi.string(),
            accountNumber: Joi.string(),
            bankName: Joi.string(),
            country: Joi.string(),
            swiftCode: Joi.string(),
            iban: Joi.string().allow(''),
            bankAddress: Joi.string(),
            description: Joi.string().allow(''),
        }),
        createdAt: Joi.date().optional(),
    });

    constructor(data: {
        type: TransactionType;
        amount: number;
        currency: string;
        accountType: 'loanAccount' | 'investmentAccount' | 'checkingAccount';
        status?: TransactionStatus;
        recipient?: string;
        paymentMethod?: string;
        notes?: string;
        loanType?: LoanType;
        password?: string;
        chequeDetails?: {
            chequeNumber: string;
            date: Date;
            description: string;
            frontImage: string;
            backImage: string;
        };
        cryptoDetails?: {
            network: string;
            walletAddress: string;
            proofOfPayment?: string;
        };
        transferDetails?: {
            accountName: string;
            accountNumber: string;
            bankName: string;
            country: string;
            swiftCode: string;
            iban?: string;
            bankAddress: string;
            description?: string;
        };
        createdAt?: Date;
    }) {
        this.type = data.type;
        this.amount = data.amount;
        this.currency = data.currency;
        this.accountType = data.accountType;
        this.status = data.status;
        this.recipient = data.recipient;
        this.paymentMethod = data.paymentMethod;
        this.notes = data.notes;
        this.loanType = data.loanType;
        this.password = data.password;
        this.chequeDetails = data.chequeDetails;
        this.cryptoDetails = data.cryptoDetails;
        this.transferDetails = data.transferDetails;
        this.createdAt = data.createdAt;
    }
}

export class UpdateTransactionDto {
    type?: TransactionType;
    amount?: number;
    currency?: string;
    accountType?: 'loanAccount' | 'investmentAccount' | 'checkingAccount';
    status?: TransactionStatus;
    recipient?: string;
    paymentMethod?: string;
    notes?: string;
    loanType?: LoanType;
    chequeDetails?: {
        chequeNumber?: string;
        date?: Date | string; // allow string from client
        description?: string;
        frontImage?: string;
        backImage?: string;
    };
    cryptoDetails?: {
        network?: string;
        walletAddress?: string;
        proofOfPayment?: string;
    };
    transferDetails?: {
        accountName?: string;
        accountNumber?: string;
        bankName?: string;
        country?: string;
        swiftCode?: string;
        iban?: string;
        bankAddress?: string;
        description?: string;
    };

    static validationSchema = Joi.object({
        type: Joi.string().valid(...Object.values(TransactionType)),
        amount: Joi.number().positive(),
        currency: Joi.string(),
        accountType: Joi.string().valid('loanAccount', 'investmentAccount', 'checkingAccount'),
        status: Joi.string().valid(...Object.values(TransactionStatus)),
        recipient: Joi.string().max(100),
        paymentMethod: Joi.string().max(50),
        notes: Joi.string().max(500),
        loanType: Joi.string().valid(...Object.values(LoanType)),
        chequeDetails: Joi.object({
            chequeNumber: Joi.string(),
            date: Joi.alternatives().try(Joi.date().iso(), Joi.string().isoDate()),
            description: Joi.string(),
            frontImage: Joi.string().uri(),
            backImage: Joi.string().uri(),
        }),
        cryptoDetails: Joi.object({
            network: Joi.string(),
            walletAddress: Joi.string(),
            proofOfPayment: Joi.string().uri(),
        }),
        transferDetails: Joi.object({
            accountName: Joi.string(),
            accountNumber: Joi.string(),
            bankName: Joi.string(),
            country: Joi.string(),
            swiftCode: Joi.string(),
            iban: Joi.string().allow(''),
            bankAddress: Joi.string(),
            description: Joi.string().allow(''),
        }),
    }).options({
        abortEarly: false,
        stripUnknown: true,
        convert: true, // convert strings to Date/Number where applicable
    });

    constructor(data: Partial<UpdateTransactionDto> = {}) {
        // Only assign keys that were actually provided
        const assignIfPresent = <K extends keyof UpdateTransactionDto>(key: K) => {
            if (data[key] !== undefined) (this as any)[key] = data[key];
        };

        assignIfPresent('type');
        assignIfPresent('amount');
        assignIfPresent('currency');
        assignIfPresent('accountType');
        assignIfPresent('status');
        assignIfPresent('recipient');
        assignIfPresent('paymentMethod');
        assignIfPresent('notes');
        assignIfPresent('loanType');

        // Nested
        assignIfPresent('chequeDetails');
        assignIfPresent('cryptoDetails');
        assignIfPresent('transferDetails');
    }
}

export class CreditLimitIncreaseRequestDto {
    requestedLimit: number;
    reason: string;
    additionalInfo?: string;

    static validationSchema = Joi.object({
        requestedLimit: Joi.number().positive().min(1000).required(),
        reason: Joi.string().min(1).required(),
        additionalInfo: Joi.string().allow("").optional(),
    }).options({ stripUnknown: true });

    constructor(data: {
        requestedLimit: number;
        reason: string;
        additionalInfo?: string;
    }) {
        this.requestedLimit = data.requestedLimit;
        this.reason = data.reason;
        this.additionalInfo = data.additionalInfo;
    }
}