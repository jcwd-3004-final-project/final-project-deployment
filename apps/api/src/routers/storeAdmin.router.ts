// src/routes/storeAdmin.routes.ts

import { Router } from "express";
import { StoreAdminMiddleware } from "../middlewares/storeAdmin.middleware";
import {
  getStoreAdminDetails,
  getStoreOrders,
  confirmPayment,
  shipOrder,
} from "../controllers/storeAdmin.controller";

const router = Router();
const storeAdminMiddleware = new StoreAdminMiddleware();

// GET Store Admin Details
router.get(
  "/details",
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware),
  storeAdminMiddleware.authorizeRole(["STORE_ADMIN"]).bind(storeAdminMiddleware),
  getStoreAdminDetails
);

// GET Orders (opsional ?status=WAITING_FOR_PAYMENT_CONFIRMATION)
router.get(
  "/orders",
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware),
  storeAdminMiddleware.authorizeRole(["STORE_ADMIN"]).bind(storeAdminMiddleware),
  getStoreOrders
);

// POST confirm payment
router.post(
  "/orders/confirm/:orderId",
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware),
  storeAdminMiddleware.authorizeRole(["STORE_ADMIN"]).bind(storeAdminMiddleware),
  confirmPayment
);

// POST ship order
router.post(
  "/orders/ship/:orderId",
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware),
  storeAdminMiddleware.authorizeRole(["STORE_ADMIN"]).bind(storeAdminMiddleware),
  shipOrder
);

export default router;
