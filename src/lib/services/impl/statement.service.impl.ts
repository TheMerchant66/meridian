import { RequestStatementDto, StatementResponseDto } from '../../dto/statement.dto';
import { StatementService } from '../statement.service';
import { Statement, IStatement } from '../../models/statement.model';
import { IUser, User } from '../../models/user.model';
import { CustomError } from '../../utils/customError.utils';
import { Notification } from '../../models/notification.model';
import { ITransactionPopulated, Transaction } from '@/lib/models/transaction.model';
import { TransactionStatus, TransactionType } from '@/lib/enums/transactionType.enum';
import { ICurrency } from '@/lib/models/currency.model';

class StatementServiceImpl implements StatementService {
    async requestStatement(statementData: RequestStatementDto): Promise<IStatement> {
        const user = await User.findById(statementData.user);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }

        if (statementData.startDate > statementData.endDate) {
            throw new CustomError(400, 'Start date must be before end date');
        }

        const statement = new Statement({
            user: statementData.user,
            accountType: statementData.accountType,
            startDate: statementData.startDate,
            endDate: statementData.endDate,
            format: statementData.format,
        });

        await statement.save();

        const notification = new Notification({
            user: statementData.user,
            message: `Statement for ${statementData.accountType} from ${statementData.startDate} to ${statementData.endDate} requested`,
        });
        await notification.save();

        return statement.populate('user', 'firstName lastName email userName');
    }

    async getUserStatements(userId: string): Promise<IStatement[]> {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }

        return await Statement.find({ user: userId })
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 });
    }

    async getAllStatements(): Promise<IStatement[]> {
        return await Statement.find()
            .populate('user', 'firstName lastName email userName')
            .sort({ createdAt: -1 });
    }

    async getStatementById(id: string): Promise<StatementResponseDto> {
        // Fetch statement with populated user
        const statement = await Statement.findById(id).populate<{ user: IUser }>(
            'user',
            'firstName lastName email userName'
        );
        if (!statement) {
            throw new CustomError(404, 'Statement not found');
        }

        // Fetch COMPLETED and CANCELLED transactions matching user, accountType, and date range
        const transactions = await Transaction.find({
            user: statement.user,
            accountType: statement.accountType,
            status: { $in: [TransactionStatus.COMPLETED, TransactionStatus.CANCELLED] },
            createdAt: { $gte: statement.startDate, $lte: statement.endDate },
        })
            .populate<{ user: IUser; currency: ICurrency }>([
                { path: 'user', select: 'firstName lastName email userName' },
                { path: 'currency', select: 'name' },
            ])
            .sort({ createdAt: 1 }) as ITransactionPopulated[];

        // Calculate starting and ending balance using only COMPLETED transactions
        const completedTransactions = transactions.filter(
            (tx) => tx.status === TransactionStatus.COMPLETED
        );
        const currency = completedTransactions.length > 0 ? completedTransactions[0].currency.name : 'USD';

        const populatedUser = statement.user as IUser & { _id: string };
        const startingBalance = await this.calculateStartingBalance(
            populatedUser._id.toString(),
            statement.accountType,
            statement.startDate,
            currency
        );
        const endingBalance = this.calculateEndingBalance(startingBalance, completedTransactions);

        return new StatementResponseDto(
            statement,
            transactions, // Include both COMPLETED and CANCELLED transactions
            {
                firstName: statement.user.firstName,
                lastName: statement.user.lastName,
                email: statement.user.email,
                userName: statement.user.userName,
            },
            startingBalance,
            endingBalance,
            currency
        );
    }

    private async calculateStartingBalance(
        userId: string,
        accountType: string,
        startDate: Date,
        currency: string
    ): Promise<number> {
        // Find all COMPLETED transactions before the start date
        const priorTransactions = await Transaction.find({
            user: userId,
            accountType,
            status: TransactionStatus.COMPLETED,
            createdAt: { $lt: startDate },
        }).populate<{ currency: ICurrency }>('currency', 'name');

        // Calculate balance from prior COMPLETED transactions
        let balance = 0;
        for (const tx of priorTransactions) {
            if (tx.currency.name !== currency) continue; // Skip transactions in different currencies
            if (
                tx.type === TransactionType.DEPOSIT ||
                tx.type === TransactionType.CHEQUE_DEPOSIT ||
                tx.type === TransactionType.CRYPTO_DEPOSIT
            ) {
                balance += tx.amount;
            } else if (
                tx.type === TransactionType.WITHDRAWAL ||
                tx.type === TransactionType.TRANSFER ||
                tx.type === TransactionType.PAYMENT
            ) {
                balance -= tx.amount;
            } else if (tx.type === TransactionType.LOAN_PAYMENT && accountType === 'loanAccount') {
                balance -= tx.amount;
            }
        }

        return balance;
    }

    private calculateEndingBalance(startingBalance: number, transactions: ITransactionPopulated[]): number {
        let balance = startingBalance;
        for (const tx of transactions) {
            // Only COMPLETED transactions affect the balance
            if (tx.status !== TransactionStatus.COMPLETED) continue;
            if (
                tx.type === TransactionType.DEPOSIT ||
                tx.type === TransactionType.CHEQUE_DEPOSIT ||
                tx.type === TransactionType.CRYPTO_DEPOSIT
            ) {
                balance += tx.amount;
            } else if (
                tx.type === TransactionType.WITHDRAWAL ||
                tx.type === TransactionType.TRANSFER ||
                tx.type === TransactionType.PAYMENT
            ) {
                balance -= tx.amount;
            } else if (tx.type === TransactionType.LOAN_PAYMENT && tx.accountType === 'loanAccount') {
                balance -= tx.amount;
            }
        }
        return balance;
    }
}

export default StatementServiceImpl;