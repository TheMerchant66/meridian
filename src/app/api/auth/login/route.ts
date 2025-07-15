import { NextRequest, NextResponse } from 'next/server';
import { loginController } from '../../../../lib/controllers/auth.controller';
import { CustomError } from '../../../../lib/utils/customError.utils';
import { dbConnect } from '@/lib/utils/dbConnect.utils';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        return await loginController(req);
    } catch (error) {
        console.log("This is the error", error);
        if (error instanceof CustomError) {
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}