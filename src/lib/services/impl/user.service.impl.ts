import { IUser, User } from '@/lib/models/user.model';
import { UserService } from '../user.service';
import bcrypt from 'bcryptjs';
import { CustomError } from '@/lib/utils/customError.utils';
import { ChangePasswordDto } from '@/lib/dto/user.dto';
import { UpdateUserDto } from '@/lib/dto/admin.dto';
import { AccountStatus } from '@/lib/enums/accountStatus.enum';
import { Transaction } from '@/lib/models/transaction.model';

class UserServiceImpl implements UserService {
    async getUserDetails(userId: string): Promise<IUser> {
        const user: IUser | null = await User.findById(userId).select('-password');
        if (!user) {
            throw new CustomError(404, 'User not found');
        }

        return {
            ...user.toObject(),
            password: undefined,
            userName: user.userName,
            role: user.role,
            verified: user.verified,
            dateOfBirth: user.dateOfBirth,
        };
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
        const user: IUser | null = await User.findById(userId);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }

        const isValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
        if (!isValid) {
            throw new CustomError(400, 'Current password is incorrect');
        }

        if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
            throw new CustomError(400, 'New password must be different from current password');
        }

        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        user.password = hashedPassword;
        await user.save();
    }

    async getAllUsers(): Promise<IUser[]> {
        return await User.find().select('-password').sort({ createdAt: -1 });
    }

    async getUserById(id: string): Promise<IUser> {
        const user = await User.findById(id).select('-password');
        if (!user) {
            throw new CustomError(404, 'User not found');
        }
        return user;
    }

    async updateUser(id: string, userData: UpdateUserDto): Promise<IUser> {
        const user = await User.findById(id);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }

        if (userData.email && userData.email !== user.email) {
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                throw new CustomError(409, 'User with this email already exists');
            }
        }

        if (userData.userName && userData.userName !== user.userName) {
            const existingUser = await User.findOne({ userName: userData.userName });
            if (existingUser) {
                throw new CustomError(409, 'User with this username already exists');
            }
        }

        Object.assign(user, userData);
        await user.save();

        return user;
    }

    async getUserAccounts(userId: string): Promise<any> {
        const user = await User.findById(userId).select('loanAccount investmentAccount checkingAccount');
        if (!user) {
            throw new CustomError(404, 'User not found');
        }
        return {
            loanAccount: user.loanAccount,
            investmentAccount: user.investmentAccount,
            checkingAccount: user.checkingAccount
        };
    }

    async getUserLastThreeTransactions(userId: string): Promise<any[]> {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }

        return await Transaction.find({ user: userId })
            .populate('user', 'firstName lastName email')
            .populate('currency', 'name')
            .sort({ createdAt: -1 })
            .limit(3);
    }

    async updateAccountBalance(userId: string, accountType: string, balance: number): Promise<IUser> {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }

        if (!['loanAccount', 'investmentAccount', 'checkingAccount'].includes(accountType)) {
            throw new CustomError(400, 'Invalid account type');
        }

        if (accountType === 'loanAccount') {
            user.loanAccount.balance = balance;
        } else if (accountType === 'investmentAccount') {
            user.investmentAccount.balance = balance;
        } else if (accountType === 'checkingAccount') {
            user.checkingAccount.balance = balance;
        }

        await user.save();
        return user;
    }

    async toggleTransactionStatus(userId: string, allowTransfer: boolean): Promise<IUser> {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }

        user.allowTransfer = allowTransfer;
        if (!allowTransfer) {
            user.accountStatus = AccountStatus.SUSPENDED;
        } else if (user.accountStatus === AccountStatus.SUSPENDED) {
            user.accountStatus = AccountStatus.ACTIVE;
        }

        await user.save();
        return user;
    }
}

export default UserServiceImpl;