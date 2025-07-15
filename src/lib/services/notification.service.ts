import { CreateNotificationDto, UpdateNotificationDto } from "../dto/notification.dto";
import { INotification } from "../models/notification.model";

export interface NotificationService {
    createNotification(notificationData: CreateNotificationDto): Promise<INotification>;
    getUserNotifications(userId: string): Promise<INotification[]>;
    getAllNotifications(): Promise<INotification[]>;
    markAsRead(id: string): Promise<INotification>;
    getNotificationById(id: string): Promise<INotification>;
    updateNotification(id: string, notificationData: UpdateNotificationDto): Promise<INotification>;
    deleteNotification(id: string): Promise<void>;
}