import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export class AuthenticateJwtMiddleware {
  public authenticateJwt(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('Authorization header is missing or invalid.');
        res.status(401).json({ success: false, error: 'Missing or invalid Authorization header' });
        return;
      }

      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_ACCESS_TOKEN_SECRET;

      if (!secret) {
        console.error('JWT_ACCESS_TOKEN_SECRET is not set in environment variables.');
        res.status(500).json({ success: false, error: 'Internal server error: Missing JWT secret' });
        return;
      }

      const decoded = jwt.verify(token, secret);
      if (!decoded) {
        console.error('Token verification failed.');
        res.status(401).json({ success: false, error: 'Invalid token' });
        return;
      }

      // Attach user information to the request
      (req as any).user = decoded;
      next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error during token verification:', error.message);
        res.status(401).json({ success: false, error: error.message });
      } else {
        console.error('Unexpected error during token verification.');
        res.status(401).json({ success: false, error: 'Unable to authenticate user' });
      }
    }
  }

  public authorizeRole(expectedRole: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user;
      if (!user || user.role !== expectedRole) {
        console.error(`Access denied for role: ${user?.role}`);
        res.status(403).json({ success: false, error: 'Access denied' });
        return;
      }
      next();
    };
  }
}
