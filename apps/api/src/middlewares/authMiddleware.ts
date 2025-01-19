// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import prisma from '../models/models';
import { Role } from '@prisma/client';

const authMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    // **Catatan:** Ini adalah contoh sederhana. Gunakan JWT atau metode otentikasi yang lebih aman di produksi.
    const userId = Number(token);
    if (isNaN(userId)) {
      throw new Error('Invalid token format');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    // Set `req.user` dengan data pengguna yang relevan
    req.user = {
      id: user.id,
      role: user.role,
      storeId: user.storeId || undefined,
      // Tambahkan properti lain jika diperlukan
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;
