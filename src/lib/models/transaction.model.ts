import mongoose, { Document, Schema, Model } from 'mongoose';
import { IUser } from './user.model';
import { ICurrency } from './currency.model';
import { TransactionType, TransactionStatus } from '../enums/transactionType.enum';
import { LoanType } from '../enums/loanType.enum';

export interface ITransaction extends Document {
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

const TransactionSchema: Schema<ITransaction> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: Object.values(TransactionType), required: true },
        amount: { type: Number, required: true, min: 0 },
        currency: { type: Schema.Types.ObjectId, ref: 'Currency', required: true },
        accountType: {
            type: String,
            enum: ['loanAccount', 'investmentAccount', 'checkingAccount'],
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(TransactionStatus),
            required: true,
            default: TransactionStatus.COMPLETED,
        },
        recipient: { type: String },
        paymentMethod: { type: String },
        notes: { type: String },
        loanType: { type: String, enum: Object.values(LoanType) },
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
    },
    { timestamps: true }
);

// Pre-save hook to validate transaction
TransactionSchema.pre<ITransaction>('save', async function (next) {
    if (this.isNew) {
        const user = await mongoose.model('User').findById(this.user);
        if (!user) {
            throw new Error('User not found');
        }

        // For withdrawals and transfers, check sufficient balance
        if (
            (this.type === TransactionType.WITHDRAWAL || this.type === TransactionType.TRANSFER) &&
            user[this.accountType].balance < this.amount
        ) {
            throw new Error(`Insufficient balance in ${this.accountType}`);
        }
    }
    next();
});

// Post-save hook to update user balance
TransactionSchema.post<ITransaction>('save', async function (doc) {
    if (doc.status === TransactionStatus.COMPLETED) {
        await updateUserBalance(doc);
    }
});

// Post-update hook to handle balance updates when status changes
TransactionSchema.post('findOneAndUpdate', async function () {
    // Get the updated document
    const doc = await this.model.findOne(this.getQuery()) as ITransaction;
    if (doc && doc.status === TransactionStatus.COMPLETED) {
        await updateUserBalance(doc);
    }
});

TransactionSchema.post('updateOne', async function () {
    // Get the updated document
    const doc = await this.model.findOne(this.getQuery()) as ITransaction;
    if (doc && doc.status === TransactionStatus.COMPLETED) {
        await updateUserBalance(doc);
    }
});

async function updateUserBalance(transaction: ITransaction): Promise<void> {
    const UserModel = mongoose.model<IUser>('User');
    const user = await UserModel.findById(transaction.user);
    if (!user) return;

    const accountType = transaction.accountType;
    const amount = transaction.amount;

    switch (transaction.type) {
        case TransactionType.DEPOSIT:
        case TransactionType.CHEQUE_DEPOSIT:
        case TransactionType.CRYPTO_DEPOSIT:
            user[accountType].balance += amount;
            break;
        case TransactionType.WITHDRAWAL:
        case TransactionType.TRANSFER:
        case TransactionType.PAYMENT:
            user[accountType].balance -= amount;
            break;
        case TransactionType.LOAN_PAYMENT:
            if (accountType === 'loanAccount') {
                user.loanAccount.balance -= amount;
            }
            break;
    }

    await user.save();
}

export const Transaction: Model<ITransaction> =
    mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);