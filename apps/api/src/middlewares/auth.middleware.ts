// auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client'; // Import User type
const prisma = new PrismaClient();

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'your_access_token_secret';

export interface AuthenticatedRequest extends Request {
  user?: User; // Use User type from Prisma here
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload: any = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user; // req.user is now typed as User
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired access token' });
  }
};
