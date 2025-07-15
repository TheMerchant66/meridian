import mongoose, { Document, Schema, Model } from 'mongoose';
import { TransactionType, TransactionStatus } from '../enums/transactionType.enum';
import { LoanType } from '../enums/loanType.enum';
import { IUser } from './user.model';
import { ICurrency } from './currency.model';

export interface ITransaction extends Document {
    _id: string;
    user: IUser['_id'];
    type: TransactionType;
    amount: number;
    currency: ICurrency['_id'];
    accountType: 'loanAccount' | 'investmentAccount' | 'checkingAccount';
    status: TransactionStatus;
    recipient?: string;
    paymentMethod?: string;
    notes?: string;
    loanType?: LoanType;
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
    createdAt: Date;
    updatedAt: Date;
}

export interface ITransactionPopulated extends Omit<ITransaction, 'user' | 'currency'> {
    user: IUser;
    currency: ICurrency;
}

const TransactionSchema: Schema<ITransaction> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: TransactionType, required: true },
        amount: { type: Number, required: true },
        currency: { type: Schema.Types.ObjectId, ref: 'Currency', required: true },
        accountType: {
            type: String,
            enum: ['loanAccount', 'investmentAccount', 'checkingAccount'],
            required: true,
        },
        status: { type: String, enum: TransactionStatus, default: TransactionStatus.PROCESSING },
        recipient: { type: String },
        paymentMethod: { type: String },
        notes: { type: String },
        loanType: { type: String, enum: LoanType },
        chequeDetails: {
            chequeNumber: { type: String },
            date: { type: Date },
            description: { type: String },
            frontImage: { type: String },
            backImage: { type: String },
        },
        cryptoDetails: {
            network: { type: String },
            walletAddress: { type: String },
            proofOfPayment: { type: String },
        },
        transferDetails: {
            accountName: { type: String },
            accountNumber: { type: String },
            bankName: { type: String },
            country: { type: String },
            swiftCode: { type: String },
            iban: { type: String },
            bankAddress: { type: String },
            description: { type: String },
        },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const Transaction: Model<ITransaction> =
    mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);