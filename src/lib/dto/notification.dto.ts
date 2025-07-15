import Joi from "joi";

export class CreateNotificationDto {
    user: string;
    message: string;
    read?: boolean;

    static validationSchema = Joi.object({
        user: Joi.string().required(),
        message: Joi.string().required(),
        read: Joi.boolean().default(false)
    });

    constructor(data: CreateNotificationDto) {
        this.user = data.user;
        this.message = data.message;
        this.read = data.read;
    }
}

export class UpdateNotificationDto {
    message?: string;
    read?: boolean;

    static validationSchema = Joi.object({
        message: Joi.string(),
        read: Joi.boolean()
    });

    constructor(data: UpdateNotificationDto) {
        this.message = data.message;
        this.read = data.read;
    }
}