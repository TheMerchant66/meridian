import { NextRequest, NextResponse } from 'next/server';
import { TransactionService } from '../services/transaction.service';
import { AuthRequest } from '../middleware/isLoggedIn.middleware';
import { CustomError } from '../utils/customError.utils';
import TransactionServiceImpl from '../services/impl/transaction.service.impl';
import { AddTransactionDto, UpdateTransactionDto } from '../dto/transaction.dto';
import { validator } from '../utils/validator.utils';

const transactionService: TransactionService = new TransactionServiceImpl();

export async function addTransactionController(req: AuthRequest) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            throw new CustomError(401, 'Unauthorized');
        }

        const body = await req.json();
        const addTransactionDto = new AddTransactionDto(body);

        const errors = validator(AddTransactionDto, addTransactionDto);
        if (errors) {
            return NextResponse.json({ message: 'Validation Error', errors: errors.details }, { status: 400 });
        }

        const transaction = await transactionService.addTransaction(userId, addTransactionDto);
        return NextResponse.json(
            { message: 'Transaction added successfully', transaction },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: error.statusCode || 500 }
        );
    }
}

export async function getUserTransactionsController(req: AuthRequest) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            throw new CustomError(401, 'Unauthorized');
        }

        const transactions = await transactionService.getUserTransactions(userId);
        return NextResponse.json(
            { message: 'Transactions retrieved successfully', transactions },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: error.statusCode || 500 }
        );
    }
}

export async function getAllTransactionsController() {
    try {
        const transactions = await transactionService.getAllTransactions();
        return NextResponse.json(
            { message: 'All transactions retrieved successfully', transactions },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: error.statusCode || 500 }
        );
    }
}

export async function getTransactionByIdController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const transaction = await transactionService.getTransactionById(resolvedParams.id);
        return NextResponse.json(
            { message: 'Transaction retrieved successfully', transaction },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: error.statusCode || 500 }
        );
    }
}

export async function updateTransactionController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const body = await req.json();
        const updateTransactionDto = new UpdateTransactionDto(body);

        const errors = validator(UpdateTransactionDto, updateTransactionDto);
        if (errors) {
            return NextResponse.json({ message: 'Validation Error', errors: errors.details }, { status: 400 });
        }

        const transaction = await transactionService.updateTransaction(resolvedParams.id, updateTransactionDto);
        return NextResponse.json(
            { message: 'Transaction updated successfully', transaction },
            { status: 200 }
        );
    } catch (error: any) {
        console.log("This is the error", error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: error.statusCode || 500 }
        );
    }
}

export async function deleteTransactionController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        await transactionService.deleteTransaction(resolvedParams.id);
        return NextResponse.json(
            { message: 'Transaction deleted successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: error.statusCode || 500 }
        );
    }
}

export async function addTransactionByAdminController(req: NextRequest) {
    try {
        const { userId, ...transactionData } = await req.json();

        if (!userId) {
            throw new CustomError(400, 'User ID is required');
        }

        const addTransactionDto = new AddTransactionDto(transactionData);

        const errors = validator(AddTransactionDto, addTransactionDto);
        if (errors) {
            return NextResponse.json({ message: 'Validation Error', errors: errors.details }, { status: 400 });
        }

        const transaction = await transactionService.addTransactionByAdmin(addTransactionDto, userId);
        return NextResponse.json(
            { message: 'Transaction added successfully for user', transaction },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: error.statusCode || 500 }
        );
    }
}

export async function requestCreditLimitIncreaseController(req: AuthRequest) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            throw new CustomError(401, 'Unauthorized');
        }

        const body = await req.json();
        console.log("This is the body", body)
        const { requestedLimit, reason, details } = body;

        if (!requestedLimit || !reason) {
            throw new CustomError(400, 'Amount and reason are required');
        }

        const transaction = await transactionService.requestCreditLimitIncrease(userId, requestedLimit, reason, details);
        return NextResponse.json(
            { message: 'Credit limit increase request submitted successfully', transaction },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: error.statusCode || 500 }
        );
    }
}