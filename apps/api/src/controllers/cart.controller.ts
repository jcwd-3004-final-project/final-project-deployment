import { Request, Response } from "express";
import { CartService } from "../services/cart.service";
import jwt from "jsonwebtoken";

const cartService = new CartService();

export class CartController {
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

  // GET /v1/api/user/cart
  static async getCart(req: Request, res: Response) {
    try {
      const userId = CartController.getUserIdFromToken(req);
      const cart = await cartService.getCart(userId);
      return res.json({ success: true, data: cart });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  // POST /v1/api/user/cart/items
  static async addItem(req: Request, res: Response) {
    try {
      const userId = CartController.getUserIdFromToken(req);
      const { productId, quantity } = req.body;

      const updatedCartItem = await cartService.addItemToCart(
        userId,
        productId,
        quantity
      );

      return res.json({ success: true, data: updatedCartItem });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  // PUT /v1/api/user/cart/items/remove
  static async removeItem(req: Request, res: Response) {
    try {
      const userId = CartController.getUserIdFromToken(req);
      const { productId, quantity } = req.body;

      const updatedItem = await cartService.removeItemFromCart(
        userId,
        productId,
        quantity
      );

      return res.json({ success: true, data: updatedItem });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
}