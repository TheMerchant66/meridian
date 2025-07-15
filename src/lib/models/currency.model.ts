import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICurrency extends Document {
    name: string;
    walletAddress: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICurrencyWithId extends ICurrency {
    _id: string;
}

const CurrencySchema: Schema<ICurrency> = new Schema(
    {
        name: { type: String, required: true, unique: true },
        walletAddress: { type: String, required: true },
        active: { type: Boolean, default: true }
    },
    { timestamps: true }
);

export const Currency: Model<ICurrency> = mongoose.models.Currency || mongoose.model<ICurrency>('Currency', CurrencySchema);