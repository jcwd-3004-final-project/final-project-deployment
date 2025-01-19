import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OrderService } from "../services/order.service";
import {
  orderCreateSchema,
  uploadPaymentProofSchema,
} from "../validator/order.validator";

const orderService = new OrderService();

export class OrderController {
  // -------------------------------------------
  // Helper to extract userId from JWT
  // -------------------------------------------
  static getUserIdFromToken(req: Request): number {
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

  // -------------------------------------------
  // Create Order
  // -------------------------------------------
  static async createOrder(req: Request, res: Response): Promise<Response> {
    try {
      // Validate and parse incoming data
      const validatedData = orderCreateSchema.parse(req.body);

      // Get userId from JWT
      const userId = OrderController.getUserIdFromToken(req);

      const {
        storeId,
        shippingAddressId,
        shippingMethod,
        paymentMethod,
        items,
      } = validatedData;

      // Call the service
      const newOrder = await orderService.createOrder(
        userId,
        storeId,
        shippingAddressId,
        shippingMethod,
        paymentMethod,
        items
      );

      return res.json({ success: true, data: newOrder });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          success: false,
          error: "Validation Error",
          issues: error.issues,
        });
      }
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  // -------------------------------------------
  // Upload Payment Proof
  // -------------------------------------------
  static async uploadPaymentProof(req: Request, res: Response): Promise<Response> {
    try {
      // Validate and parse incoming data
      // => orderId is coerced to a number automatically
      const validatedData = uploadPaymentProofSchema.parse(req.body);

      const userId = OrderController.getUserIdFromToken(req);

      if (!req.file) {
        throw new Error("No file attached in request");
      }

      // validatedData.orderId is now guaranteed to be a number
      const updatedOrder = await orderService.uploadPaymentProof(
        userId,
        validatedData.orderId,
        req.file.path
      );

      return res.json({ success: true, data: updatedOrder });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          success: false,
          error: "Validation Error",
          issues: error.issues,
        });
      }
      return res.status(400).json({ success: false, error: error.message });
    }
  }

    // -------------------------------------------
    static async getOrder(req: Request, res: Response): Promise<Response> {
      try {
        const orderId = Number(req.params.id);
  
        const userId = OrderController.getUserIdFromToken(req);
  
        const invoice = await orderService.getOrderWithInvoice(orderId, userId);
  
        return res.json({ success: true, data: invoice });
      } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
      }
    }
}