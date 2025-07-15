import Joi from 'joi';

export class CreateCurrencyDto {
    name: string;
    walletAddress: string;
    active?: boolean;

    static validationSchema = Joi.object({
        name: Joi.string().required(),
        walletAddress: Joi.string().required(),
        active: Joi.boolean().default(true)
    });

    constructor(data: CreateCurrencyDto) {
        this.name = data.name;
        this.walletAddress = data.walletAddress;
        this.active = data.active;
    }
}

export class UpdateCurrencyDto {
    name?: string;
    walletAddress?: string;
    active?: boolean;

    static validationSchema = Joi.object({
        name: Joi.string(),
        walletAddress: Joi.string(),
        active: Joi.boolean()
    });

    constructor(data: UpdateCurrencyDto) {
        this.name = data.name;
        this.walletAddress = data.walletAddress;
        this.active = data.active;
    }
}