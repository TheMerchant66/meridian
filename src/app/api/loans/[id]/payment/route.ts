import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/utils/dbConnect.utils';
import { CustomError } from '@/lib/utils/customError.utils';
import { processLoanPaymentController } from '@/lib/controllers/loan.controller';
import { isLoggedIn } from '@/lib/middleware/isLoggedIn.middleware';

export async function POST(req: NextRequest, { params }: { params: Promise<{ loanId: string }> }) {
    try {
        await dbConnect();
        const middlewareResponse = await isLoggedIn(req);
        if (middlewareResponse.status !== 200) {
            return middlewareResponse;
        }
        return await processLoanPaymentController(req, { params });
    } catch (error) {
        if (error instanceof CustomError) {
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}