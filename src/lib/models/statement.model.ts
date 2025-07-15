import mongoose, { Document, Schema, Model } from 'mongoose';
import { IUser } from './user.model';

export interface IStatement extends Document {
    _id: string;
    user: IUser['_id'];
    accountType: 'loanAccount' | 'investmentAccount' | 'checkingAccount';
    startDate: Date;
    endDate: Date;
    format: 'PDF' | 'CSV' | 'OFX';
    createdAt: Date;
    updatedAt: Date;
}

const StatementSchema: Schema<IStatement> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        accountType: {
            type: String,
            enum: ['loanAccount', 'investmentAccount', 'checkingAccount'],
            required: true,
        },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        format: { type: String, enum: ['PDF', 'CSV', 'OFX'], required: true },
    },
    { timestamps: true }
);

export const Statement: Model<IStatement> =
    mongoose.models.Statement || mongoose.model<IStatement>('Statement', StatementSchema);