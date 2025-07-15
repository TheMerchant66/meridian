import mongoose, { Document, Schema, Model } from "mongoose";
import { LoanType } from "@/lib/enums/loanType.enum";
import { IUser } from "@/lib/models/user.model";
import { ICurrency } from "@/lib/models/currency.model";

export interface ILoan extends Document {
    _id: string;
    user: IUser["_id"];
    name: string;
    type: LoanType;
    originalAmount: number;
    currentBalance: number;
    interestRate: number;
    monthlyPayment: number;
    nextPaymentDate: Date;
    nextPaymentAmount: number;
    startDate: Date;
    endDate: Date;
    term: number;
    status: "current" | "delinquent" | "paid";
    progress: number;
    paymentsMade: number;
    paymentsRemaining: number;
    lender: string;
    accountNumber: string;
    recentPayments: Array<{
        date: Date;
        amount: number;
        status: "completed" | "pending" | "failed";
    }>;
    currency: ICurrency["_id"];
    createdAt: Date;
    updatedAt: Date;
}

const LoanSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        type: { type: String, enum: Object.values(LoanType), required: true },
        originalAmount: { type: Number, required: true },
        currentBalance: { type: Number, required: true },
        interestRate: { type: Number, required: true },
        monthlyPayment: { type: Number, required: true },
        nextPaymentDate: { type: Date, required: true },
        nextPaymentAmount: { type: Number, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        term: { type: Number, required: true },
        status: { type: String, enum: ["current", "delinquent", "paid"], default: "current" },
        progress: { type: Number, required: true },
        paymentsMade: { type: Number, required: true },
        paymentsRemaining: { type: Number, required: true },
        lender: { type: String, required: true },
        accountNumber: { type: String, required: true },
        recentPayments: [{
            date: { type: Date, required: true },
            amount: { type: Number, required: true },
            status: { type: String, enum: ["completed", "pending", "failed"], required: true },
        }],
        currency: { type: Schema.Types.ObjectId, ref: "Currency", required: true },
    },
    { timestamps: true }
);

export const Loan: Model<ILoan> = mongoose.models.Loan || mongoose.model<ILoan>("Loan", LoanSchema);