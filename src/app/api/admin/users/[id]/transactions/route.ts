import { getUserLastThreeTransactionsController } from "@/lib/controllers/admin.controller";
import { addTransactionByAdminController } from "@/lib/controllers/transaction.controller";
import { isAdmin } from "@/lib/middleware/isAdmin.middleware";
import { CustomError } from "@/lib/utils/customError.utils";
import { dbConnect } from "@/lib/utils/dbConnect.utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        return await isAdmin(async (req) => {
            return await addTransactionByAdminController(req);
        })(req);
    } catch (error) {
        if (error instanceof CustomError) {
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();

        return await isAdmin(async () => {
            return await getUserLastThreeTransactionsController(req, { params });
        })(req);
    } catch (error) {
        if (error instanceof CustomError) {
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}