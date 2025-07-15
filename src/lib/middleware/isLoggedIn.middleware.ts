import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '../utils/token.utils';
import { JwtPayload } from 'jsonwebtoken';
import { CustomError } from '../utils/customError.utils';
// Extend NextRequest to include user property
export interface AuthRequest extends NextRequest {
  user?: JwtPayload;
}

export async function isLoggedIn(req: NextRequest) {
  try {
    const token = extractTokenFromRequest(req);
    const decodedUser = verifyToken(token);

    // Attach user to request for downstream use
    (req as AuthRequest).user = decodedUser as JwtPayload;

    return NextResponse.next();
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}