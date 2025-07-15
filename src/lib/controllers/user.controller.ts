import { NextResponse } from 'next/server';
import { UserService } from '../services/user.service';
import UserServiceImpl from '../services/impl/user.service.impl';
import { validator } from '../utils/validator.utils';
import { ChangePasswordDto } from '../dto/user.dto';
import { AuthRequest } from '../middleware/isLoggedIn.middleware';
import { CustomError } from '../utils/customError.utils';

const userService: UserService = new UserServiceImpl();

export async function getUserDetailsController(req: AuthRequest) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            throw new CustomError(401, 'Unauthorized');
        }

        const userDetails = await userService.getUserDetails(userId);
        return NextResponse.json({ message: 'User details retrieved successfully', user: userDetails }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}

export async function changePasswordController(req: AuthRequest) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            throw new CustomError(401, 'Unauthorized');
        }

        const body = await req.json();
        const changePasswordDto = new ChangePasswordDto(body);

        const errors = validator(ChangePasswordDto, changePasswordDto);
        if (errors) {
            return NextResponse.json({ message: 'Validation Error', errors: errors.details }, { status: 400 });
        }

        await userService.changePassword(userId, changePasswordDto);
        return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}

