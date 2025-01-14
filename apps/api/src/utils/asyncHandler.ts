// src/utils/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Membungkus fungsi handler async dan menangani error secara otomatis.
 * Fungsi ini dibuat generic agar dapat menerima Request yang telah di-extend, seperti AuthenticatedRequest.
 *
 * @param fn Fungsi handler async dengan tipe Request khusus.
 * @returns Fungsi handler yang dibungkus sebagai RequestHandler.
 */
const asyncHandler = <Req extends Request = Request>(
  fn: (req: Req, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as Req, res, next)).catch(next);
  };
};

export default asyncHandler;
