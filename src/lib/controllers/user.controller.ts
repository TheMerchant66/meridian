import { NextResponse } from 'next/server';
import { UserService } from '../services/user.service';
import UserServiceImpl from '../services/impl/user.service.impl';
import { validator } from '../utils/validator.utils';
import { ChangePasswordDto, UpdateProfileDto, UpdateProfilePictureDto } from '../dto/user.dto';
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

export async function updateProfileController(req: AuthRequest) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            throw new CustomError(401, 'Unauthorized');
        }

        const body = await req.json();
        const profileData = new UpdateProfileDto(body);

        const errors = validator(UpdateProfileDto, profileData);
        if (errors) {
            return NextResponse.json({ 
                message: 'Validation Error', 
                errors: errors.details 
            }, { status: 400 });
        }

        const updatedUser = await userService.updateProfile(userId, profileData);
        return NextResponse.json({ 
            message: 'Profile updated successfully', 
            user: updatedUser 
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ 
            message: error.message || 'Internal server error' 
        }, { status: error.statusCode || 500 });
    }
}

export async function updateProfilePictureController(req: AuthRequest) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            throw new CustomError(401, 'Unauthorized');
        }

        const body = await req.json();
        const pictureData = new UpdateProfilePictureDto(body);

        const errors = validator(UpdateProfilePictureDto, pictureData);
        if (errors) {
            return NextResponse.json({ 
                message: 'Validation Error', 
                errors: errors.details 
            }, { status: 400 });
        }

        const updatedUser = await userService.updateProfilePicture(userId, pictureData);
        return NextResponse.json({ 
            message: 'Profile picture updated successfully', 
            user: updatedUser 
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ 
            message: error.message || 'Internal server error' 
        }, { status: error.statusCode || 500 });
    }
}

export async function removeProfilePictureController(req: AuthRequest) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            throw new CustomError(401, 'Unauthorized');
        }

        const updatedUser = await userService.removeProfilePicture(userId);
        return NextResponse.json({ 
            message: 'Profile picture removed successfully', 
            user: updatedUser 
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ 
            message: error.message || 'Internal server error' 
        }, { status: error.statusCode || 500 });
    }
}