import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { Role } from "../enums/role.enum";
import { extractTokenFromRequest } from "../utils/token.utils";

interface Payload {
    sub: string;
    role: Role;
}

export function isAdmin(handler: (req: NextRequest & { user?: string }) => Promise<NextResponse>) {
    return async (req: NextRequest) => {
        const token = extractTokenFromRequest(req);
        if (!token) {
            return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
        }

        let decodedToken: Payload;
        try {
            decodedToken = jwtDecode<Payload>(token);
        } catch (error) {
            return NextResponse.json({ message: "Invalid token provided" }, { status: 403 });
        }

        if (decodedToken.role !== Role.ADMIN) {
            return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
        }

        (req as NextRequest & { user?: string }).user = decodedToken.sub;
        return await handler(req as NextRequest & { user?: string });
    };
}