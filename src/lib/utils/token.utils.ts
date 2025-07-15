import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { Role } from '../enums/role.enum';
import { CustomError } from './customError.utils';
import { IUser } from '../models/user.model';

export const generateToken = (userId: IUser["_id"], role: Role): string => {
    return jwt.sign({ sub: userId, role }, process.env.JWT_KEY as string, { expiresIn: "1d" });
};

export const extractTokenFromRequest = (req: NextRequest) => {
    const header = req.headers.get('authorization'); 
    if (!header) {
        throw new CustomError(401, "Token not provided");
    }
    return header.split(" ")[1]; 
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_KEY as string);
    } catch (error: any) {
        throw new CustomError(401, "Invalid or expired token");
    }
}