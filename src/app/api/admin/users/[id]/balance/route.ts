import { updateAccountBalanceController } from "@/lib/controllers/admin.controller";
import { isAdmin } from "@/lib/middleware/isAdmin.middleware";
import { CustomError } from "@/lib/utils/customError.utils";
import { dbConnect } from "@/lib/utils/dbConnect.utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string; }> }) {
    try {
        await dbConnect();

        return await isAdmin(async () => {
            return await updateAccountBalanceController(req, { params });
        })(req);
    } catch (error) {
        if (error instanceof CustomError) {
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}