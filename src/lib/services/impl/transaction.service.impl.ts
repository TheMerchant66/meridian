import { Transaction, ITransaction } from '../../models/transaction.model';
import { IUser, User } from '../../models/user.model';
import { Currency, ICurrency } from '../../models/currency.model';
import { TransactionService } from '../transaction.service';
import { AddTransactionDto, UpdateTransactionDto } from '../../dto/transaction.dto';
import { CustomError } from '../../utils/customError.utils';
import { TransactionStatus, TransactionType } from '../../enums/transactionType.enum';
import { Notification } from '../../models/notification.model';
import { AccountLevel, AccountType } from '@/lib/enums/role.enum';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Define populated transaction interfaces for type safety
interface ITransactionWithUser extends Omit<ITransaction, 'user'> {
    user: IUser;
}

interface ITransactionWithCurrency extends Omit<ITransaction, 'currency'> {
    currency: ICurrency;
}

interface IPopulatedTransaction extends Omit<ITransaction, 'user' | 'currency'> {
    user: IUser;
    currency: ICurrency;
}

class TransactionServiceImpl implements TransactionService {
    private isValidAccountType(accountType: string): accountType is AccountType {
        return ['loanAccount', 'investmentAccount', 'checkingAccount'].includes(accountType);
    }

    private async validateUser(userId: string): Promise<IUser> {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }
        return user;
    }

    private async validateCurrency(currencyId: string): Promise<ICurrency> {
        const currency = await Currency.findById(currencyId);
        if (!currency) {
            throw new CustomError(404, 'Currency not found');
        }
        return currency;
    }

    private async verifyPassword(password: string, hashedPassword: string): Promise<void> {
        const isValid = await bcrypt.compare(password, hashedPassword);
        if (!isValid) {
            throw new CustomError(400, 'Invalid password, confirm and try again');
        }
    }

    private async createNotification(userId: string, message: string): Promise<void> {
        const notification = new Notification({
            user: userId,
            message,
        });
        await notification.save();
    }

    private async populateTransaction(transaction: ITransaction): Promise<IPopulatedTransaction> {
        return await transaction.populate([
            { path: 'user', select: 'firstName lastName email userName' },
            { path: 'currency', select: 'name' },
        ]) as IPopulatedTransaction;
    }

    async addTransaction(userId: string, transactionData: AddTransactionDto): Promise<ITransaction> {
        try {
            const user = await this.validateUser(userId);
            const currency = await this.validateCurrency(transactionData.currency);

            if (transactionData.password) {
                await this.verifyPassword(transactionData.password, user.password);
            }

            if (!this.isValidAccountType(transactionData.accountType)) {
                throw new CustomError(400, `Invalid account type: ${transactionData.accountType}`);
            }

            const transactionPayload = {
                user: userId,
                type: transactionData.type,
                amount: transactionData.amount,
                currency: transactionData.currency,
                accountType: transactionData.accountType,
                status: TransactionStatus.COMPLETED,
                recipient: transactionData.recipient,
                paymentMethod: transactionData.paymentMethod,
                notes: transactionData.notes,
                loanType: transactionData.loanType,
                chequeDetails: transactionData.chequeDetails,
                cryptoDetails: transactionData.cryptoDetails,
                transferDetails: transactionData.transferDetails,
            };

            let transaction: ITransaction;

            // Handle transfers with database transaction for atomicity
            if (transactionData.type === TransactionType.TRANSFER) {
                const session = await mongoose.startSession();
                try {
                    const result = await session.withTransaction(async () => {
                        const newTransaction = new Transaction(transactionPayload);
                        return await newTransaction.save({ session });
                    });
                    transaction = result;
                } catch (error) {
                    throw new CustomError(500, 'Failed to process transfer transaction');
                } finally {
                    await session.endSession();
                }
            } else {
                transaction = new Transaction(transactionPayload);
                await transaction.save();
            }

            // Create notification
            await this.createNotification(
                userId,
                `New ${transactionData.type} transaction of ${transactionData.amount} ${currency.name} completed on ${transactionData.accountType}`
            );

            return await this.populateTransaction(transaction);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(500, 'Failed to create transaction');
        }
    }

    async getUserTransactions(userId: string): Promise<ITransaction[]> {
        await this.validateUser(userId);

        return await Transaction.find({ user: userId })
            .populate('user', 'firstName lastName email')
            .populate('currency', 'name')
            .sort({ createdAt: -1 })
            .lean();
    }

    async getAllTransactions(): Promise<ITransaction[]> {
        return await Transaction.find()
            .populate('user', 'firstName lastName email userName')
            .populate('currency', 'name')
            .sort({ createdAt: -1 })
            .lean();
    }

    async getTransactionById(id: string): Promise<ITransaction> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new CustomError(400, 'Invalid transaction ID');
        }

        const transaction = await Transaction.findById(id)
            .populate('user', 'firstName lastName email userName')
            .populate('currency', 'name');

        if (!transaction) {
            throw new CustomError(404, 'Transaction not found');
        }

        return transaction;
    }

    async updateTransaction(id: string, transactionData: UpdateTransactionDto): Promise<ITransaction> {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new CustomError(400, 'Invalid transaction ID');
            }

            const transaction = await Transaction.findById(id);
            if (!transaction) {
                throw new CustomError(404, 'Transaction not found');
            }

            // Validate currency if provided
            if (transactionData.currency) {
                await this.validateCurrency(transactionData.currency);
            }

            // Validate account type if provided
            if (transactionData.accountType && !this.isValidAccountType(transactionData.accountType)) {
                throw new CustomError(400, `Invalid account type: ${transactionData.accountType}`);
            }

            // Update transaction fields
            Object.assign(transaction, transactionData);

            await transaction.save();

            return await this.populateTransaction(transaction);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(500, 'Failed to update transaction');
        }
    }

    async deleteTransaction(id: string): Promise<void> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new CustomError(400, 'Invalid transaction ID');
        }

        const transaction = await Transaction.findById(id);
        if (!transaction) {
            throw new CustomError(404, 'Transaction not found');
        }

        if (transaction.status === TransactionStatus.COMPLETED) {
            throw new CustomError(400, 'Cannot delete completed transactions');
        }

        await Transaction.findByIdAndDelete(id);
    }

    async addTransactionByAdmin(transactionData: AddTransactionDto, userId: string): Promise<ITransaction> {
        try {
            const user = await this.validateUser(userId);
            const currency = await this.validateCurrency(transactionData.currency);

            if (!this.isValidAccountType(transactionData.accountType)) {
                throw new CustomError(400, `Invalid account type: ${transactionData.accountType}`);
            }

            const transaction = new Transaction({
                user: userId,
                type: transactionData.type,
                amount: transactionData.amount,
                currency: transactionData.currency,
                accountType: transactionData.accountType,
                status: TransactionStatus.COMPLETED,
                recipient: transactionData.recipient,
                paymentMethod: transactionData.paymentMethod,
                notes: transactionData.notes,
                loanType: transactionData.loanType,
                chequeDetails: transactionData.chequeDetails,
                cryptoDetails: transactionData.cryptoDetails,
                transferDetails: transactionData.transferDetails,
                createdAt: transactionData.createdAt || new Date(),
            });

            await transaction.save();

            await this.createNotification(
                userId,
                `Admin added ${transactionData.type} transaction of ${transactionData.amount} ${currency.name} on ${transactionData.accountType}`
            );

            return await this.populateTransaction(transaction);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(500, 'Failed to create admin transaction');
        }
    }

    async requestCreditLimitIncrease(
        userId: string,
        amount: number,
        reason: string,
        details?: string
    ): Promise<ITransaction> {
        try {
            const user = await this.validateUser(userId);

            const currency = await Currency.findOne({ name: 'USD' });
            if (!currency) {
                throw new CustomError(404, 'USD currency not found');
            }

            const maxCreditLimit = {
                [AccountLevel.PLATINUM]: 100000,
                [AccountLevel.GOLD]: 75000,
                [AccountLevel.RUBY]: 50000,
                [AccountLevel.REGULAR]: 25000,
            };

            const currentLimit = user.loanAccount?.creditLimit || 0;
            const maxAllowed = maxCreditLimit[user.accountLevel];

            if (currentLimit + amount > maxAllowed) {
                throw new CustomError(
                    400,
                    `Credit limit increase exceeds maximum for ${user.accountLevel} account. Current: ${currentLimit}, Requested: ${amount}, Max allowed: ${maxAllowed}`
                );
            }

            const transaction = new Transaction({
                user: userId,
                type: TransactionType.PAYMENT,
                amount,
                currency: currency._id,
                accountType: 'loanAccount',
                status: TransactionStatus.PROCESSING,
                notes: `Credit limit increase request: ${reason}${details ? `. ${details}` : ''}`,
            });

            await transaction.save();

            await this.createNotification(
                userId,
                `Credit limit increase request of ${amount} USD submitted and is under review`
            );

            return await this.populateTransaction(transaction);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(500, 'Failed to process credit limit increase request');
        }
    }
}

export default TransactionServiceImpl;