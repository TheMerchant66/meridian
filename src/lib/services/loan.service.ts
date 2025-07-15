import { ILoan } from "@/lib/models/loan.model";
import { AddTransactionDto } from "@/lib/dto/transaction.dto";

export interface LoanService {
    getUserLoans(userId: string): Promise<ILoan[]>;
    getLoanById(loanId: string): Promise<ILoan>;
    processLoanPayment(userId: string, loanId: string,  transaction: AddTransactionDto): Promise<ILoan>;
}