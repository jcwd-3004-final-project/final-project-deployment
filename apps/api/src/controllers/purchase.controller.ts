import { Request, Response } from "express";
import { PurchaseService } from "../services/purchase.services";
import jwt from "jsonwebtoken";

const purchaseService = new PurchaseService();

export class PurchaseController {
  // Utility to extract userId from JWT
  private static getUserIdFromToken(req: Request): number {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Authorization token is missing");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET as string
    ) as any;

    if (!decoded.userId) {
      throw new Error("Invalid token");
    }

    return decoded.userId;
  }

  // GET /v1/api/user/purchases?status=WAITING_FOR_PAYMENT (optional)
  static async getPurchases(req: Request, res: Response) {
    try {
      const userId = PurchaseController.getUserIdFromToken(req);
      const { status } = req.query;

      const purchases = await purchaseService.getUserPurchases(
        userId,
        status as string
      );
      return res.json({ success: true, data: purchases });
    } catch (error: any) {
      console.error("Error in getPurchases:", error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }
}