import { Notification } from "@/lib/models/notification.model";
import { LoanService } from "../loan.service";
import { User } from "@/lib/models/user.model";
import { CustomError } from "@/lib/utils/customError.utils";
import { ILoan, Loan } from "@/lib/models/loan.model";
import { AddTransactionDto } from "@/lib/dto/transaction.dto";
import { TransactionStatus, TransactionType } from "@/lib/enums/transactionType.enum";
import { Transaction } from "@/lib/models/transaction.model";

export class LoanServiceImpl implements LoanService {
    async getUserLoans(userId: string): Promise<ILoan[]> {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError(404, "User not found");
        }
        return await Loan.find({ user: userId })
            .populate("user", "firstName lastName email userName")
            .populate("currency", "name")
            .sort({ createdAt: -1 });
    }

    async getLoanById(loanId: string): Promise<ILoan> {
        const loan = await Loan.findById(loanId)
            .populate("user", "firstName lastName email userName")
            .populate("currency", "name");
        if (!loan) {
            throw new CustomError(404, "Loan not found");
        }
        return loan;
    }

    async processLoanPayment(userId: string, loanId: string, transactionData: AddTransactionDto): Promise<ILoan> {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError(404, "User not found");
        }

        const loan = await Loan.findById(loanId);
        if (!loan) {
            throw new CustomError(404, "Loan not found");
        }

        if (transactionData.type !== TransactionType.LOAN_PAYMENT) {
            throw new CustomError(400, "Invalid transaction type for loan payment");
        }

        if (user[transactionData.accountType].balance < transactionData.amount) {
            throw new CustomError(400, `Insufficient balance in ${transactionData.accountType}`);
        }

        user[transactionData.accountType].balance -= transactionData.amount;
        loan.currentBalance -= transactionData.amount;
        loan.paymentsMade += 1;
        loan.paymentsRemaining -= 1;
        loan.progress = ((loan.originalAmount - loan.currentBalance) / loan.originalAmount) * 100;

        if (loan.currentBalance <= 0) {
            loan.status = "paid";
            loan.currentBalance = 0;
        }

        loan.recentPayments.push({
            date: new Date(),
            amount: transactionData.amount,
            status: "completed",
        });

        // Update next payment date
        const nextDate = new Date(loan.nextPaymentDate);
        nextDate.setMonth(nextDate.getMonth() + 1);
        loan.nextPaymentDate = nextDate;

        await user.save();
        await loan.save();

        const transaction = new Transaction({
            user: userId,
            type: transactionData.type,
            amount: transactionData.amount,
            currency: transactionData.currency,
            accountType: transactionData.accountType,
            status: TransactionStatus.COMPLETED,
            loanId: loan._id,
        });

        await transaction.save();

        const notification = new Notification({
            user: userId,
            message: `Loan payment of ${transactionData.amount} USD processed for ${loan.name}`,
        });
        await notification.save();

        return loan;
    }
}