import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export class StoreAdminMiddleware {
  private JWT_SECRET: string;

  constructor() {
    this.JWT_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET as string;
    if (!this.JWT_SECRET) {
      throw new Error("JWT secret is not defined in environment variables.");
    }
  }

  authenticateJwt(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Access token is missing or invalid" });
      return;
    }

    jwt.verify(token, this.JWT_SECRET, (err, decoded: any) => {
      if (err) {
        res.status(401).json({ message: "Invalid token" });
        return;
      }

      // Pastikan decoded token memiliki `id` dan `role`
     

      (req as any).user = decoded; // Tambahkan user ke request
      next();
    });
  }

  authorizeRole(
    roles: string[]
  ): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
      const user = (req as any).user;

     
      if (!user || !roles.includes(user.role)) {
        res.status(403).json({
          message:
            "Forbidden: You do not have permission to access this resource.",
        });
        return;
      }

      next();
    };
  }
}
