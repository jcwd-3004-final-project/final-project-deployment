import { Router } from "express";
import { StoreAdminMiddleware } from "../middlewares/storeAdmin.middleware";
import {
  getStoreAdminDetails,
  confirmPayment,
  shipOrder,
} from "../controllers/storeAdmin.controller";

const router = Router();
const storeAdminMiddleware = new StoreAdminMiddleware();

// Get Store Admin Details
router.get(
  "/details",
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware),
  storeAdminMiddleware
    .authorizeRole(["STORE_ADMIN"])
    .bind(storeAdminMiddleware),
  getStoreAdminDetails
);

// Konfirmasi pembayaran pesanan
router.post(
  "/orders/confirm/:orderId",
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware),
  storeAdminMiddleware
    .authorizeRole(["STORE_ADMIN"])
    .bind(storeAdminMiddleware),
  confirmPayment
);

// Tandai pesanan sebagai dikirim
router.post(
  "/orders/ship/:orderId",
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware),
  storeAdminMiddleware
    .authorizeRole(["STORE_ADMIN"])
    .bind(storeAdminMiddleware),
  shipOrder
);

export default router;
