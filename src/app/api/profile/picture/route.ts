import { NextRequest, NextResponse } from 'next/server';
import { CustomError } from '@/lib/utils/customError.utils';
import { isLoggedIn } from '@/lib/middleware/isLoggedIn.middleware';
import { updateProfilePictureController, removeProfilePictureController } from '@/lib/controllers/user.controller';
import { dbConnect } from '@/lib/utils/dbConnect.utils';

export async function PATCH(req: NextRequest) {
    try {
        await dbConnect();
        const middlewareResponse = await isLoggedIn(req);
        if (middlewareResponse.status !== 200) {
            return middlewareResponse;
        }

        return await updateProfilePictureController(req);
    } catch (error) {
        if (error instanceof CustomError) {
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();
        const middlewareResponse = await isLoggedIn(req);
        if (middlewareResponse.status !== 200) {
            return middlewareResponse;
        }

        return await removeProfilePictureController(req);
    } catch (error) {
        if (error instanceof CustomError) {
            return NextResponse.json({ message: error.message }, { status: error.statusCode });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}