import { NextRequest, NextResponse } from "next/server";
import { CustomError } from "@/lib/utils/customError.utils";
import { validator } from "@/lib/utils/validator.utils";
import { LoanService } from "../services/loan.service";
import { LoanServiceImpl } from "../services/impl/loan.service.impl";
import { AuthRequest } from "../middleware/isLoggedIn.middleware";
import { AddTransactionDto } from "../dto/transaction.dto";

const loanService: LoanService = new LoanServiceImpl();

export async function getUserLoansController(req: AuthRequest) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            throw new CustomError(401, "Unauthorized");
        }

        const loans = await loanService.getUserLoans(userId);
        return NextResponse.json(
            { message: "Loans retrieved successfully", loans },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Internal server error" },
            { status: error.statusCode || 500 }
        );
    }
}

export async function getLoanByIdController(req: AuthRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            throw new CustomError(401, "Unauthorized");
        }

        const resolvedParams = await params;
        const loan = await loanService.getLoanById(resolvedParams.id);

        return NextResponse.json(
            { message: "Loan retrieved successfully", loan },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Internal server error" },
            { status: error.statusCode || 500 }
        );
    }
}

export async function processLoanPaymentController(req: AuthRequest, { params }: { params: Promise<{ loanId: string }> }) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            throw new CustomError(401, "Unauthorized");
        }

        const resolvedParams = await params;
        const body = await req.json();
        const transactionData = new AddTransactionDto({
            ...body,
        });

        const errors = validator(AddTransactionDto, transactionData);
        if (errors) {
            return NextResponse.json({ message: "Validation Error", errors: errors.details }, { status: 400 });
        }

        const loan = await loanService.processLoanPayment(userId, resolvedParams.loanId, transactionData);
        return NextResponse.json(
            { message: "Loan payment processed successfully", loan },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Internal server error" },
            { status: error.statusCode || 500 }
        );
    }
}