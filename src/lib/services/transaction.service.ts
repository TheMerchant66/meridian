import { AddTransactionDto, UpdateTransactionDto } from '../dto/transaction.dto';
import { ITransaction } from '../models/transaction.model';

export interface TransactionService {
    addTransaction(userId: string, transactionData: AddTransactionDto): Promise<ITransaction>;
    getUserTransactions(userId: string): Promise<ITransaction[]>;

    // Admin Methods
    getAllTransactions(): Promise<ITransaction[]>;
    getTransactionById(id: string): Promise<ITransaction>;
    updateTransaction(id: string, transactionData: UpdateTransactionDto): Promise<ITransaction>;
    deleteTransaction(id: string): Promise<void>;
    addTransactionByAdmin(transactionData: AddTransactionDto, userId: string): Promise<ITransaction>;
    requestCreditLimitIncrease(
        userId: string,
        amount: number,
        reason: string,
        details?: string
    ): Promise<ITransaction>;
}