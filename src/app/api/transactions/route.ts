import { NextRequest, NextResponse } from 'next/server';
import { isLoggedIn } from '@/lib/middleware/isLoggedIn.middleware';
import { isAdmin } from '@/lib/middleware/isAdmin.middleware';
import { addTransactionByAdminController, addTransactionController, getAllTransactionsController, getUserTransactionsController } from '@/lib/controllers/transaction.controller';
import { dbConnect } from '@/lib/utils/dbConnect.utils';
import { CustomError } from '@/lib/utils/customError.utils';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        // Check if request is from admin (for all transactions) or regular user (for user's transactions)
        const url = new URL(req.url);
        const admin = url.searchParams.get('admin');

        if (admin === 'true') {
            return await isAdmin(async (req) => {
                return await getAllTransactionsController();
            })(req);
        } else {
            // For regular users, get only their transactions
            const middlewareResponse = await isLoggedIn(req);
            if (middlewareResponse.status !== 200) {
                return middlewareResponse;
            }
            return await getUserTransactionsController(req);
        }
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
        const url = new URL(req.url);
        const admin = url.searchParams.get('admin');

        if (admin === 'true') {
            return await isAdmin(async (req) => {
                return await addTransactionByAdminController(req);
            })(req);
        } else {
            // For regular users, add transaction for themselves
            const middlewareResponse = await isLoggedIn(req);
            if (middlewareResponse.status !== 200) {
                return middlewareResponse;
            }
            return await addTransactionController(req);
        }
    } catch (error) {
        if (error instanceof CustomError) {
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}