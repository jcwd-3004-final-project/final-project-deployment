import express from "express";
import { InventoryController } from "../controllers/inventory.controller";

const router = express.Router();
const inventoryController = new InventoryController();

router.put(
  "/update-stock",
  inventoryController.updateStock.bind(inventoryController)
);
router.get(
  "/stock-logs/:productId",
  inventoryController.getStockLogs.bind(inventoryController)
);

export default router;
