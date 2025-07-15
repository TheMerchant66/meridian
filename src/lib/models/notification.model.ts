import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user.model';

export interface INotification extends Document {
    user: IUser['_id'];
    message: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Notification =
    mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);