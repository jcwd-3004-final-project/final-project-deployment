// src/controllers/storeAdmin.controller.ts

import { Request, Response } from "express";
import { StoreAdminServices } from "../services/storeAdmin.service";

const storeAdminServices = new StoreAdminServices();


export const getStoreAdminDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user; // user disisipkan oleh JWT middleware
    if (!user || !user.userId) {
      res.status(400).json({ message: "Invalid request: User ID is missing" });
      return;
    }

    const adminDetails = await storeAdminServices.getStoreAdminDetails(user.userId);
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


export const getStoreOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || !user.userId) {
      res.status(400).json({ message: "Invalid request: User ID is missing" });
      return;
    }
    const status = req.query.status as string | undefined;
    // Memanggil method getStoreOrders pada service yang sudah mengembalikan data dengan properti items
    const orders = await storeAdminServices.getStoreOrders(user.userId, status);
    res.status(200).json({
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to fetch orders",
    });
  }
};


export const confirmPayment = async (req: Request, res: Response): Promise<void> => {
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

    const updatedOrder = await storeAdminServices.confirmPayment(orderId, user.userId);
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


export const shipOrder = async (req: Request, res: Response): Promise<void> => {
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

    const updatedOrder = await storeAdminServices.markAsShipped(orderId, user.userId);
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
