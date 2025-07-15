import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/middleware/isAdmin.middleware';
import { getAllUsersController } from '@/lib/controllers/admin.controller';
import { dbConnect } from '@/lib/utils/dbConnect.utils';
import { CustomError } from '@/lib/utils/customError.utils';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        return await isAdmin(async (req) => {
            return await getAllUsersController();
        })(req);
    } catch (error) {
        if (error instanceof CustomError) {
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}