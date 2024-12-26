// src/utils/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Membungkus fungsi handler async dan menangani error secara otomatis.
 * @param fn Fungsi handler async.
 * @returns Fungsi handler yang dibungkus.
 */
const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
