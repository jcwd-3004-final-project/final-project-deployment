import { Request, Response } from "express";
import { InventoryService } from "../services/inventory.service";

export class InventoryController {
  private inventoryService: InventoryService;

  constructor() {
    this.inventoryService = new InventoryService();
  }

  // Update stock quantity
  async updateStock(req: Request, res: Response) {
    console.log("updateStock called");
    const { productId, changeQuantity, reason } = req.body;

    try {
      const updatedProduct = await this.inventoryService.updateStock(
        productId,
        changeQuantity,
        reason
      );
      res.status(200).json({
        message: "Stock updated successfully",
        data: updatedProduct,
      });
    } catch (error: any) {
      console.error("Error in updateStock:", error); // Log the error
      res.status(400).json({
        message: error.message || "Failed to update stock",
      });
    }
  }

  // Get stock logs
  async getStockLogs(req: Request, res: Response) {
    const { productId } = req.params;

    try {
      const logs = await this.inventoryService.getStockLogs(Number(productId));
      res.status(200).json({
        message: "Stock logs retrieved successfully",
        data: logs,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || "Failed to retrieve stock logs",
      });
    }
  }
}
