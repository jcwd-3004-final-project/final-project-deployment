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

    // storeId & productId dari URL
    const { storeId, productId } = req.params;
    // body
    const { changeQuantity, reason } = req.body;

    try {
      const updatedStoreProduct = await this.inventoryService.updateStock(
        Number(storeId),
        Number(productId),
        Number(changeQuantity),
        reason
      );
      res.status(200).json({
        message: "Stock updated successfully",
        data: updatedStoreProduct,
      });
    } catch (error: any) {
      console.error("Error in updateStock:", error);
      res.status(400).json({
        message: error.message || "Failed to update stock",
      });
    }
  }

  // Get stock logs
  async getStockLogs(req: Request, res: Response) {
    console.log("getStockLogs called");

    // storeId & productId dari URL
    const { storeId, productId } = req.params;

    try {
      const logs = await this.inventoryService.getStockLogs(
        Number(storeId),
        Number(productId)
      );
      res.status(200).json({
        message: "Stock logs retrieved successfully",
        data: logs,
      });
    } catch (error: any) {
      console.error("Error in getStockLogs:", error);
      res.status(400).json({
        message: error.message || "Failed to retrieve stock logs",
      });
    }
  }
}
