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

        // Pre-validate balance for immediate completion transactions
        if (transactionData.status === TransactionStatus.COMPLETED) {
            await this.validateTransactionBalance(user, transactionData);
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

        // Use database transaction for consistency
        const session = await User.startSession();
        try {
            await session.withTransaction(async () => {
                if (transactionData.status === TransactionStatus.COMPLETED) {
                    await this.processAccountBalanceUpdate(user, transactionData, session);
                }
                await transaction.save({ session });
                await user.save({ session });
            });
        } catch (error: any) {
            throw new CustomError(500, `Failed to process transaction: ${error.message}`);
        } finally {
            await session.endSession();
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

        // Check if status is being changed to COMPLETED
        const isStatusChangingToCompleted =
            transactionData.status === TransactionStatus.COMPLETED &&
            transaction.status !== TransactionStatus.COMPLETED;

        // Check if status is being changed from COMPLETED to something else
        const isStatusChangingFromCompleted =
            transaction.status === TransactionStatus.COMPLETED &&
            transactionData.status &&
            transactionData.status !== TransactionStatus.COMPLETED;

        // Prevent changing completed transactions unless explicitly allowed
        if (transaction.status === TransactionStatus.COMPLETED && !isStatusChangingFromCompleted) {
            // Allow minor updates to completed transactions (like notes, recipient)
            const allowedUpdates: (keyof UpdateTransactionDto)[] = ['notes', 'recipient', 'paymentMethod'];
            const updateKeys = Object.keys(transactionData) as (keyof UpdateTransactionDto)[];

            const hasDisallowedUpdates = updateKeys.some(
                key => !allowedUpdates.includes(key) &&
                    transactionData[key] !== undefined &&
                    transactionData[key] !== null
            );

            if (hasDisallowedUpdates) {
                const disallowedFields = updateKeys.filter(
                    key => !allowedUpdates.includes(key) &&
                        transactionData[key] !== undefined &&
                        transactionData[key] !== null
                );
                throw new CustomError(
                    400,
                    `Cannot modify critical details of completed transactions. Attempted to modify: ${disallowedFields.join(', ')}`
                );
            }
        }

        // Use database transaction for consistency
        const session = await User.startSession();
        try {
            await session.withTransaction(async () => {
                // Handle status change to COMPLETED
                if (isStatusChangingToCompleted) {
                    const transactionForBalance = {
                        ...transactionData,
                        amount: transactionData.amount || transaction.amount,
                        type: transactionData.type || transaction.type,
                        accountType: transactionData.accountType || transaction.accountType
                    };

                    await this.validateTransactionBalance(user, transactionForBalance);
                    await this.processAccountBalanceUpdate(user, transactionForBalance, session);
                }

                // Handle status change from COMPLETED (reversal)
                if (isStatusChangingFromCompleted) {
                    await this.reverseAccountBalanceUpdate(user, transaction, session);
                }

                // Update transaction with new data
                Object.assign(transaction, transactionData);
                await transaction.save({ session });
                await user.save({ session });
            });
        } catch (error: any) {
            throw new CustomError(500, `Failed to update transaction: ${error.message}`);
        } finally {
            await session.endSession();
        }

        // Create notification based on the status change
        let notificationMessage = `Transaction ${transaction._id} updated`;
        if (isStatusChangingToCompleted) {
            notificationMessage = `Transaction ${transaction._id} completed successfully. Account balance updated.`;
        } else if (isStatusChangingFromCompleted) {
            notificationMessage = `Transaction ${transaction._id} status changed from completed. Account balance reversed.`;
        } else if (transactionData.status) {
            notificationMessage = `Transaction ${transaction._id} status updated to ${transactionData.status}`;
        }

        const notification = new Notification({
            user: user._id,
            message: notificationMessage,
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
            throw new CustomError(400, 'Cannot delete completed transactions. Please reverse the transaction instead.');
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

        const session = await User.startSession();
        try {
            await session.withTransaction(async () => {
                if (transactionData.status === TransactionStatus.COMPLETED) {
                    await this.validateTransactionBalance(user, transactionData);
                    await this.processAccountBalanceUpdate(user, transactionData, session);
                }
                await transaction.save({ session });
                await user.save({ session });
            });
        } catch (error: any) {
            throw new CustomError(500, `Failed to process admin transaction: ${error.message}`);
        } finally {
            await session.endSession();
        }

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

    /**
     * Validates if the transaction can be processed based on account balance
     */
    private async validateTransactionBalance(
        user: IUser,
        transactionData: AddTransactionDto | UpdateTransactionDto | any
    ): Promise<void> {
        const { amount, accountType, type } = transactionData;

        if (!this.isValidAccountType(accountType)) {
            throw new CustomError(400, `Invalid account type: ${accountType}`);
        }

        const account = user[accountType];
        const currentBalance = account.balance;

        // Check balance for debit transactions
        const isDebitTransaction = [
            TransactionType.WITHDRAWAL,
            TransactionType.TRANSFER,
            TransactionType.PAYMENT
        ].includes(type);

        if (isDebitTransaction && currentBalance < amount) {
            throw new CustomError(400, `Insufficient balance in ${accountType}. Available: ${currentBalance}, Required: ${amount}`);
        }

        // Special validation for loan account
        if (accountType === 'loanAccount' && type === TransactionType.LOAN_PAYMENT) {
            if (user.loanAccount.balance < amount) {
                throw new CustomError(400, `Loan payment amount exceeds outstanding balance. Outstanding: ${user.loanAccount.balance}, Payment: ${amount}`);
            }
        }
    }

    /**
     * Processes account balance updates for completed transactions
     */
    private async processAccountBalanceUpdate(
        user: IUser,
        transactionData: AddTransactionDto | UpdateTransactionDto | any,
        session?: any
    ): Promise<void> {
        const { amount, accountType, type } = transactionData;

        if (!this.isValidAccountType(accountType)) {
            throw new CustomError(400, `Invalid account type: ${accountType}`);
        }

        const account = user[accountType];

        switch (type) {
            case TransactionType.DEPOSIT:
            case TransactionType.CHEQUE_DEPOSIT:
            case TransactionType.CRYPTO_DEPOSIT:
                // Credit the account
                account.balance += amount;
                break;

            case TransactionType.WITHDRAWAL:
            case TransactionType.TRANSFER:
            case TransactionType.PAYMENT:
                // Debit the account
                if (account.balance < amount) {
                    throw new CustomError(400, `Insufficient balance in ${accountType}`);
                }
                account.balance -= amount;
                break;

            case TransactionType.LOAN_PAYMENT:
                if (accountType === 'loanAccount') {
                    // Reduce loan balance (outstanding debt)
                    if (user.loanAccount.balance < amount) {
                        throw new CustomError(400, `Loan payment exceeds outstanding balance`);
                    }
                    user.loanAccount.balance -= amount;
                } else {
                    // If paying from another account, debit that account
                    if (account.balance < amount) {
                        throw new CustomError(400, `Insufficient balance in ${accountType}`);
                    }
                    account.balance -= amount;
                }
                break;

            default:
                throw new CustomError(400, `Unsupported transaction type: ${type}`);
        }

        // Ensure balance doesn't go negative (additional safety check)
        if (account.balance < 0) {
            throw new CustomError(400, `Transaction would result in negative balance for ${accountType}`);
        }
    }

    /**
     * Reverses account balance updates when a transaction status changes from COMPLETED
     */
    private async reverseAccountBalanceUpdate(
        user: IUser,
        transaction: ITransaction,
        session?: any
    ): Promise<void> {
        const { amount, accountType, type } = transaction;

        if (!this.isValidAccountType(accountType)) {
            throw new CustomError(400, `Invalid account type: ${accountType}`);
        }

        const account = user[accountType];

        switch (type) {
            case TransactionType.DEPOSIT:
            case TransactionType.CHEQUE_DEPOSIT:
            case TransactionType.CRYPTO_DEPOSIT:
                // Reverse credit (debit the account)
                if (account.balance < amount) {
                    throw new CustomError(400, `Cannot reverse transaction: insufficient balance in ${accountType}`);
                }
                account.balance -= amount;
                break;

            case TransactionType.WITHDRAWAL:
            case TransactionType.TRANSFER:
            case TransactionType.PAYMENT:
                // Reverse debit (credit the account)
                account.balance += amount;
                break;

            case TransactionType.LOAN_PAYMENT:
                if (accountType === 'loanAccount') {
                    // Restore loan balance (increase outstanding debt)
                    user.loanAccount.balance += amount;
                } else {
                    // Restore balance to the account that was debited
                    account.balance += amount;
                }
                break;

            default:
                throw new CustomError(400, `Cannot reverse unsupported transaction type: ${type}`);
        }
    }

    /**
     * Legacy method maintained for backward compatibility
     * @deprecated Use processAccountBalanceUpdate instead
     */
    private async updateAccountBalance(
        user: IUser,
        transactionData: AddTransactionDto | UpdateTransactionDto,
        existingTransaction?: ITransaction
    ): Promise<void> {
        const amount = transactionData.amount || (existingTransaction?.amount as number);
        const accountType = transactionData.accountType || (existingTransaction?.accountType as string);
        const type = transactionData.type || (existingTransaction?.type as TransactionType);

        await this.processAccountBalanceUpdate(user, { amount, accountType, type });
        await user.save();
    }
}

export default TransactionServiceImpl;