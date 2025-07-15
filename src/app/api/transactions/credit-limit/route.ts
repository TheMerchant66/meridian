import { requestCreditLimitIncreaseController } from '@/lib/controllers/transaction.controller';
import { isLoggedIn } from '@/lib/middleware/isLoggedIn.middleware';
import { CustomError } from '@/lib/utils/customError.utils';
import { dbConnect } from '@/lib/utils/dbConnect.utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const response = await isLoggedIn(req);
        if (response.status !== 200) return response;
        return await requestCreditLimitIncreaseController(req);
    } catch (error) {
        if (error instanceof CustomError) {
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}