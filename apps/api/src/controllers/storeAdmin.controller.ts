import { Request, Response } from "express";
import { StoreAdminServices } from "../services/storeAdmin.service";

const storeAdminServices = new StoreAdminServices();

/**
 * Controller untuk mendapatkan detail store admin.
 */
export const getStoreAdminDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;

    if (!user || !user.userId) {
      res.status(400).json({
        message: "Invalid request: User ID is missing",
      });
      return;
    }

    const adminDetails = await storeAdminServices.getStoreAdminDetails(
      user.userId
    );

    res.status(200).json({
      message: "Store admin details fetched successfully",
      data: adminDetails,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to fetch store admin details",
    });
  }
};

/**
 * Controller untuk mengonfirmasi pembayaran pesanan.
 */
export const confirmPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.userId) {
      res.status(400).json({ message: "Invalid request: User ID is missing" });
      return;
    }

    const orderId = Number(req.params.orderId);
    if (!orderId) {
      res.status(400).json({ message: "Order ID is missing or invalid" });
      return;
    }

    const updatedOrder = await storeAdminServices.confirmPayment(
      orderId,
      user.userId
    );

    res.status(200).json({
      message: "Order payment confirmed. Status changed to PROCESSING.",
      data: updatedOrder,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to confirm payment",
    });
  }
};

/**
 * Controller untuk menandai pesanan sebagai dikirim.
 */
export const shipOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.userId) {
      res.status(400).json({ message: "Invalid request: User ID is missing" });
      return;
    }

    const orderId = Number(req.params.orderId);
    if (!orderId) {
      res.status(400).json({ message: "Order ID is missing or invalid" });
      return;
    }

    const updatedOrder = await storeAdminServices.markAsShipped(
      orderId,
      user.userId
    );

    res.status(200).json({
      message: "Order marked as shipped. Status changed to SHIPPED.",
      data: updatedOrder,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to mark order as shipped",
    });
  }
};
