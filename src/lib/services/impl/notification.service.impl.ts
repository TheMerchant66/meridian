import { CreateNotificationDto, UpdateNotificationDto } from "@/lib/dto/notification.dto";
import { NotificationService } from "../notification.service";
import { INotification, Notification } from "@/lib/models/notification.model";
import { CustomError } from "@/lib/utils/customError.utils";
import { User } from "@/lib/models/user.model";

class NotificationServiceImpl implements NotificationService {
    async createNotification(notificationData: CreateNotificationDto): Promise<INotification> {
        // Verify user exists
        const user = await User.findById(notificationData.user);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }

        const notification = new Notification(notificationData);
        await notification.save();
        return notification;
    }

    async getUserNotifications(userId: string): Promise<INotification[]> {
        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }

        return await Notification.find({ user: userId })
            .sort({ createdAt: -1 });
    }

    async getAllNotifications(): Promise<INotification[]> {
        return await Notification.find()
            .populate('user', 'firstName lastName email userName')
            .sort({ createdAt: -1 });
    }

    async markAsRead(id: string): Promise<INotification> {
        const notification = await Notification.findById(id);
        if (!notification) {
            throw new CustomError(404, 'Notification not found');
        }

        notification.read = true;
        await notification.save();
        return notification;
    }

    async getNotificationById(id: string): Promise<INotification> {
        const notification = await Notification.findById(id)
            .populate('user', 'firstName lastName email userName');

        if (!notification) {
            throw new CustomError(404, 'Notification not found');
        }

        return notification;
    }

    async updateNotification(id: string, notificationData: UpdateNotificationDto): Promise<INotification> {
        const notification = await Notification.findById(id);
        if (!notification) {
            throw new CustomError(404, 'Notification not found');
        }

        Object.assign(notification, notificationData);
        await notification.save();

        return notification.populate('user', 'firstName lastName email userName');
    }

    async deleteNotification(id: string): Promise<void> {
        const notification = await Notification.findById(id);
        if (!notification) {
            throw new CustomError(404, 'Notification not found');
        }

        await Notification.findByIdAndDelete(id);
    }
}

export default NotificationServiceImpl;