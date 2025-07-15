import { NextRequest, NextResponse } from 'next/server';
import { isLoggedIn } from '../../../lib/middleware/isLoggedIn.middleware';
import { isAdmin } from '../../../lib/middleware/isAdmin.middleware';
import { dbConnect } from '../../../lib/utils/dbConnect.utils';
import { CustomError } from '../../../lib/utils/customError.utils';
import { getAllStatementsController, getUserStatementsController, requestStatementController } from '@/lib/controllers/statement.controller';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const authResponse = await isLoggedIn(req);
        if (authResponse.status !== 200) return authResponse;

        const user = (req as any).user;
        if (user.role === 'ADMIN') {
            return await isAdmin(async (req) => {
                return await getAllStatementsController();
            })(req);
        }
        return await getUserStatementsController(req as any);
    } catch (error) {
        if (error instanceof CustomError) {
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const response = await isLoggedIn(req);
        if (response.status !== 200) return response;
        return await requestStatementController(req as any);
    } catch (error) {
        if (error instanceof CustomError) {
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}