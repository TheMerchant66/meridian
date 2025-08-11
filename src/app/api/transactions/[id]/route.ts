import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/middleware/isAdmin.middleware';
import { getTransactionByIdController, updateTransactionController, deleteTransactionController } from '@/lib/controllers/transaction.controller';
import { dbConnect } from '@/lib/utils/dbConnect.utils';
import { CustomError } from '@/lib/utils/customError.utils';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        return await isAdmin(async (req) => {
            return await getTransactionByIdController(req, { params });
        })(req);
    } catch (error) {
        if (error instanceof CustomError) {
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        return await isAdmin(async (req) => updateTransactionController(req, { params }))(req);
    } catch (error) {
        if (error instanceof CustomError) {
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        return await isAdmin(async (req) => {
            return await deleteTransactionController(req, { params });
        })(req);
    } catch (error) {
        if (error instanceof CustomError) {
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}