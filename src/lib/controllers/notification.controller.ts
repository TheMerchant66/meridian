import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '../services/notification.service';
import NotificationServiceImpl from '../services/impl/notification.service.impl';
import { validator } from '../utils/validator.utils';
import { CreateNotificationDto, UpdateNotificationDto } from '../dto/notification.dto';
import { AuthRequest } from '../middleware/isLoggedIn.middleware';
import { CustomError } from '../utils/customError.utils';

const notificationService: NotificationService = new NotificationServiceImpl();

export async function createNotificationController(req: NextRequest) {
    try {
        const body = await req.json();
        const createNotificationDto = new CreateNotificationDto(body);

        const errors = validator(CreateNotificationDto, createNotificationDto);
        if (errors) {
            return NextResponse.json({ message: 'Validation Error', errors: errors.details }, { status: 400 });
        }

        const notification = await notificationService.createNotification(createNotificationDto);
        return NextResponse.json({ message: 'Notification created successfully', notification }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}

export async function getUserNotificationsController(req: AuthRequest) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            throw new CustomError(401, 'Unauthorized');
        }

        const notifications = await notificationService.getUserNotifications(userId);
        return NextResponse.json({ message: 'Notifications retrieved successfully', notifications }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}

export async function getAllNotificationsController() {
    try {
        const notifications = await notificationService.getAllNotifications();
        return NextResponse.json({ message: 'All notifications retrieved successfully', notifications }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}

export async function markNotificationAsReadController(req: AuthRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const userId = req.user?.sub;
        if (!userId) {
            throw new CustomError(401, 'Unauthorized');
        }

        const notification = await notificationService.getNotificationById(resolvedParams.id);

        // Only allow users to mark their own notifications as read
        if (notification.user?.toString() !== userId) {
            throw new CustomError(403, 'Forbidden: You can only mark your own notifications as read');
        }

        const updatedNotification = await notificationService.markAsRead(resolvedParams.id);
        return NextResponse.json({ message: 'Notification marked as read', notification: updatedNotification }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}

export async function getNotificationByIdController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const notification = await notificationService.getNotificationById(resolvedParams.id);
        return NextResponse.json({ message: 'Notification retrieved successfully', notification }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}

export async function updateNotificationController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const body = await req.json();
        const updateNotificationDto = new UpdateNotificationDto(body);

        const errors = validator(UpdateNotificationDto, updateNotificationDto);
        if (errors) {
            return NextResponse.json({ message: 'Validation Error', errors: errors.details }, { status: 400 });
        }

        const notification = await notificationService.updateNotification(resolvedParams.id, updateNotificationDto);
        return NextResponse.json({ message: 'Notification updated successfully', notification }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}

export async function deleteNotificationController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        await notificationService.deleteNotification(resolvedParams.id);
        return NextResponse.json({ message: 'Notification deleted successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}