import express from "express";
import { InventoryController } from "../controllers/inventory.controller";

const router = express.Router();
const inventoryController = new InventoryController();

// Update stock
// POST atau PUT, tergantung preferensi Anda
router.post(
  "/stores/:storeId/products/:productId/stock",
  inventoryController.updateStock.bind(inventoryController)
);

// Get stock logs
router.get(
  "/stores/:storeId/products/:productId/logs",
  inventoryController.getStockLogs.bind(inventoryController)
);

export default router;
