import { getStatementByIdController } from '@/lib/controllers/statement.controller';
import { isLoggedIn } from '@/lib/middleware/isLoggedIn.middleware';
import { Statement } from '@/lib/models/statement.model';
import { CustomError } from '@/lib/utils/customError.utils';
import { dbConnect } from '@/lib/utils/dbConnect.utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const authResponse = await isLoggedIn(req);
        if (authResponse.status !== 200) return authResponse;

        const resolvedParams = await params;
        const statement = await Statement.findById(resolvedParams.id);
        if (!statement) {
            return NextResponse.json({ message: 'Statement not found' }, { status: 404 });
        }

        return await getStatementByIdController(req, { params });
    } catch (error) {
        if (error instanceof CustomError) {
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}