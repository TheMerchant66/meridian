import { Transaction, ITransaction } from '../../models/transaction.model';
import { IUser, User } from '../../models/user.model';
import { Currency } from '../../models/currency.model';
import { TransactionService } from '../transaction.service';
import { AddTransactionDto, UpdateTransactionDto } from '../../dto/transaction.dto';
import { CustomError } from '../../utils/customError.utils';
import { TransactionStatus, TransactionType } from '../../enums/transactionType.enum';
import { Notification } from '../../models/notification.model';
import { AccountLevel, AccountType } from '@/lib/enums/role.enum';
import bcrypt from 'bcryptjs';

class TransactionServiceImpl implements TransactionService {
    private isValidAccountType(accountType: string): accountType is AccountType {
        return ['loanAccount', 'investmentAccount', 'checkingAccount'].includes(accountType);
    }

    async addTransaction(userId: string, transactionData: AddTransactionDto): Promise<ITransaction> {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }

        if (transactionData.password) {
            const isValid = await bcrypt.compare(transactionData.password, user.password);
            if (!isValid) {
                throw new CustomError(400, 'Invalid password, confirm and try again');
            }
        }

        const currency = await Currency.findById(transactionData.currency);
        if (!currency) {
            throw new CustomError(404, 'Currency not found');
        }

        if (!this.isValidAccountType(transactionData.accountType)) {
            throw new CustomError(400, `Invalid account type: ${transactionData.accountType}`);
        }

        if (
            transactionData.type === TransactionType.TRANSFER &&
            user[transactionData.accountType].balance < transactionData.amount
        ) {
            throw new CustomError(400, `Insufficient balance in ${transactionData.accountType}`);
        }

        const transaction = new Transaction({
            user: userId,
            type: transactionData.type,
            amount: transactionData.amount,
            currency: transactionData.currency,
            accountType: transactionData.accountType,
            status: transactionData.status || TransactionStatus.PROCESSING,
            recipient: transactionData.recipient,
            paymentMethod: transactionData.paymentMethod,
            notes: transactionData.notes,
            loanType: transactionData.loanType,
            chequeDetails: transactionData.chequeDetails,
            cryptoDetails: transactionData.cryptoDetails,
        });

        if (transactionData.type === TransactionType.TRANSFER) {
            const session = await User.startSession();
            try {
                await session.withTransaction(async () => {
                    if (transactionData.status === TransactionStatus.COMPLETED) {
                        await this.updateAccountBalance(user, transactionData);
                    }
                    await transaction.save({ session });
                    await user.save({ session });
                });
                await session.endSession();
            } catch (error) {
                await session.endSession();
                throw new CustomError(500, 'Failed to process transfer transaction');
            }
        } else {
            if (transactionData.status === TransactionStatus.COMPLETED) {
                await this.updateAccountBalance(user, transactionData);
            }
            await transaction.save();
        }

        const notification = new Notification({
            user: userId,
            message: `New ${transactionData.type} transaction of ${transactionData.amount} ${currency.name} initiated on ${transactionData.accountType}`,
        });
        await notification.save();

        return transaction.populate([
            { path: 'user', select: 'firstName lastName email userName' },
            { path: 'currency', select: 'name' },
        ]);
    }

    async getUserTransactions(userId: string): Promise<ITransaction[]> {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }

        return await Transaction.find({ user: userId })
            .populate('user', 'firstName lastName email')
            .populate('currency', 'name')
            .sort({ createdAt: -1 });
    }

    async getAllTransactions(): Promise<ITransaction[]> {
        return await Transaction.find()
            .populate('user', 'firstName lastName email userName')
            .populate('currency', 'name')
            .sort({ createdAt: -1 });
    }

    async getTransactionById(id: string): Promise<ITransaction> {
        const transaction = await Transaction.findById(id)
            .populate('user', 'firstName lastName email userName')
            .populate('currency', 'name');
        if (!transaction) {
            throw new CustomError(404, 'Transaction not found');
        }
        return transaction;
    }

    async updateTransaction(id: string, transactionData: UpdateTransactionDto): Promise<ITransaction> {
        const transaction = await Transaction.findById(id).populate('user');
        if (!transaction) {
            throw new CustomError(404, 'Transaction not found');
        }

        if (transactionData.currency) {
            const currency = await Currency.findById(transactionData.currency);
            if (!currency) {
                throw new CustomError(404, 'Currency not found');
            }
        }

        const user = await User.findById(transaction.user);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }

        if (
            transactionData.status === TransactionStatus.COMPLETED &&
            transaction.status !== TransactionStatus.COMPLETED
        ) {
            await this.updateAccountBalance(user, transactionData, transaction);
        }

        Object.assign(transaction, transactionData);
        await transaction.save();

        const notification = new Notification({
            user: user._id,
            message: `Transaction ${transaction._id} updated to ${transactionData.status || transaction.status}`,
        });
        await notification.save();

        return transaction.populate([
            { path: 'user', select: 'firstName lastName email userName' },
            { path: 'currency', select: 'name' },
        ]);
    }

    async deleteTransaction(id: string): Promise<void> {
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
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }

        const currency = await Currency.findById(transactionData.currency);
        if (!currency) {
            throw new CustomError(404, 'Currency not found');
        }

        const transaction = new Transaction({
            user: userId,
            type: transactionData.type,
            amount: transactionData.amount,
            currency: transactionData.currency,
            accountType: transactionData.accountType,
            status: transactionData.status || TransactionStatus.PROCESSING,
            recipient: transactionData.recipient,
            paymentMethod: transactionData.paymentMethod,
            notes: transactionData.notes,
            loanType: transactionData.loanType,
            chequeDetails: transactionData.chequeDetails,
            cryptoDetails: transactionData.cryptoDetails,
            transferDetails: transactionData.transferDetails,
            createdAt: transactionData.createdAt || new Date(),
        });

        if (transactionData.status === TransactionStatus.COMPLETED) {
            await this.updateAccountBalance(user, transactionData);
        }

        await transaction.save();

        const notification = new Notification({
            user: userId,
            message: `Admin added ${transactionData.type} transaction of ${transactionData.amount} ${currency.name} on ${transactionData.accountType}`,
        });
        await notification.save();

        return transaction.populate([
            { path: 'user', select: 'firstName lastName email userName' },
            { path: 'currency', select: 'name' },
        ]);
    }

    async requestCreditLimitIncrease(
        userId: string,
        amount: number,
        reason: string,
        details?: string
    ): Promise<ITransaction> {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }

        const currency = await Currency.findOne({ name: 'USD' });
        if (!currency) {
            throw new CustomError(404, 'Currency not found');
        }

        const maxCreditLimit = {
            [AccountLevel.PLATINUM]: 100000,
            [AccountLevel.GOLD]: 75000,
            [AccountLevel.RUBY]: 50000,
            [AccountLevel.REGULAR]: 25000,
        };

        if (user.loanAccount.creditLimit + amount > maxCreditLimit[user.accountLevel]) {
            throw new CustomError(400, `Credit limit increase exceeds maximum for ${user.accountLevel} account`);
        }

        const transaction = new Transaction({
            user: userId,
            type: TransactionType.PAYMENT,
            amount,
            currency: currency._id,
            accountType: 'loanAccount',
            status: TransactionStatus.PROCESSING,
            notes: `Credit limit increase request: ${reason}. ${details || ''}`,
        });

        await transaction.save();

        const notification = new Notification({
            user: userId,
            message: `Credit limit increase request of ${amount} USD submitted`,
        });
        await notification.save();

        return transaction.populate([
            { path: 'user', select: 'firstName lastName email userName' },
            { path: 'currency', select: 'name' },
        ]);
    }

    private async updateAccountBalance(
        user: IUser,
        transactionData: AddTransactionDto | UpdateTransactionDto,
        existingTransaction?: ITransaction
    ): Promise<void> {
        const amount = transactionData.amount || (existingTransaction?.amount as number);
        const accountType = transactionData.accountType || (existingTransaction?.accountType as string);
        const type = transactionData.type || (existingTransaction?.type as TransactionType);

        if (!this.isValidAccountType(accountType)) {
            throw new CustomError(400, `Invalid account type: ${accountType}`);
        }

        if (
            type === TransactionType.DEPOSIT ||
            type === TransactionType.CHEQUE_DEPOSIT ||
            type === TransactionType.CRYPTO_DEPOSIT
        ) {
            user[accountType].balance += amount;
        } else if (
            type === TransactionType.WITHDRAWAL ||
            type === TransactionType.TRANSFER ||
            type === TransactionType.PAYMENT
        ) {
            if (user[accountType].balance < amount) {
                throw new CustomError(400, `Insufficient balance in ${accountType}`);
            }
            user[accountType].balance -= amount;
        } else if (type === TransactionType.LOAN_PAYMENT && accountType === 'loanAccount') {
            user.loanAccount.balance -= amount;
        }

        await user.save();
    }
}

export default TransactionServiceImpl;