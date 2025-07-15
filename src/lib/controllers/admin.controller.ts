import { NextRequest, NextResponse } from "next/server";
import { UpdateBalanceDto, UpdateUserDto } from "../dto/admin.dto";
import { validator } from "../utils/validator.utils";
import { UserService } from "../services/user.service";
import UserServiceImpl from "../services/impl/user.service.impl";
import { isAdmin } from "../middleware/isAdmin.middleware";

const userService: UserService = new UserServiceImpl();

export async function getAllUsersController() {
    try {
        const users = await userService.getAllUsers();
        return NextResponse.json({ message: 'All users retrieved successfully', users }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}

export async function getUserByIdController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const user = await userService.getUserById(resolvedParams.id);
        return NextResponse.json({ message: 'User retrieved successfully', user }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}

export async function updateUserController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const body = await req.json();
        const updateUserDto = new UpdateUserDto(body);

        const errors = validator(UpdateUserDto, updateUserDto);
        if (errors) {
            return NextResponse.json({ message: 'Validation Error', errors: errors.details }, { status: 400 });
        }

        const user = await userService.updateUser(resolvedParams.id, updateUserDto);
        return NextResponse.json({ message: 'User updated successfully', user }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}

export async function getUserAccountsController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const accounts = await userService.getUserAccounts(resolvedParams.id);
        return NextResponse.json({ message: 'User accounts retrieved successfully', accounts }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}

export async function getUserLastThreeTransactionsController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const transactions = await userService.getUserLastThreeTransactions(resolvedParams.id);
        return NextResponse.json({ message: 'Last three transactions retrieved successfully', transactions }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}

export async function updateAccountBalanceController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const body = await req.json();
        const updateBalanceDto = new UpdateBalanceDto(body);

        const errors = validator(UpdateBalanceDto, updateBalanceDto);
        if (errors) {
            return NextResponse.json({ message: 'Validation Error', errors: errors.details }, { status: 400 });
        }

        const user = await userService.updateAccountBalance(resolvedParams.id, updateBalanceDto.accountType, updateBalanceDto.balance);
        return NextResponse.json({ message: 'Account balance updated successfully', user }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}

export async function toggleTransactionStatusController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        return await isAdmin(async (req) => {
            const resolvedParams = await params;
            const { allowTransfer } = await req.json();

            if (typeof allowTransfer !== 'boolean') {
                return NextResponse.json({ message: 'Invalid allowTransfer value' }, { status: 400 });
            }

            const user = await userService.toggleTransactionStatus(resolvedParams.id, allowTransfer);
            return NextResponse.json({
                message: `Transfers ${allowTransfer ? 'enabled' : 'disabled'} successfully`,
                user
            }, { status: 200 });
        })(req);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}