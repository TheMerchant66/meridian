import { NextRequest, NextResponse } from 'next/server';
import { AuthRequest } from '../middleware/isLoggedIn.middleware';
import { CustomError } from '../utils/customError.utils';
import { StatementService } from '../services/statement.service';
import StatementServiceImpl from '../services/impl/statement.service.impl';
import { RequestStatementDto } from '../dto/statement.dto';
import { validator } from '../utils/validator.utils';

const statementService: StatementService = new StatementServiceImpl();

/**
 * Controller to handle requesting a new statement
 */
export async function requestStatementController(req: AuthRequest) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            throw new CustomError(401, 'Unauthorized');
        }

        const body = await req.json();
        const requestStatementDto = new RequestStatementDto({
            ...body,
            user: userId,
        });

        const errors = validator(RequestStatementDto, requestStatementDto);
        if (errors) {
            return NextResponse.json(
                { message: 'Validation Error', errors: errors.details },
                { status: 400 }
            );
        }

        const statement = await statementService.requestStatement(requestStatementDto);
        return NextResponse.json(
            { message: 'Statement requested successfully', statement },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: error.statusCode || 500 }
        );
    }
}

/**
 * Controller to get all statements for a specific user
 */
export async function getUserStatementsController(req: AuthRequest) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            throw new CustomError(401, 'Unauthorized');
        }

        const statements = await statementService.getUserStatements(userId);
        return NextResponse.json(
            { message: 'User statements retrieved successfully', statements },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: error.statusCode || 500 }
        );
    }
}

/**
 * Controller to get all statements (admin only)
 */
export async function getAllStatementsController() {
    try {
        const statements = await statementService.getAllStatements();
        return NextResponse.json(
            { message: 'All statements retrieved successfully', statements },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: error.statusCode || 500 }
        );
    }
}

/**
 * Controller to get a specific statement by ID with transactions
 */
export async function getStatementByIdController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const statement = await statementService.getStatementById(resolvedParams.id);
        return NextResponse.json(
            { message: 'Statement retrieved successfully', statement },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: error.statusCode || 500 }
        );
    }
}