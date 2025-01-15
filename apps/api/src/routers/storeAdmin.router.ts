import { Router } from "express";
import { StoreAdminMiddleware } from "../middlewares/storeAdmin.middleware";
import { getStoreAdminDetails } from "../controllers/storeAdmin.controller";

const router = Router();
const storeAdminMiddleware = new StoreAdminMiddleware();

// ================================
// Endpoints untuk Store Admin
// ================================

// Get Store Admin Details
router.get(
  "/details",
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware), // Middleware untuk verifikasi token
  storeAdminMiddleware
    .authorizeRole(["STORE_ADMIN"])
    .bind(storeAdminMiddleware), // Middleware untuk otorisasi role
  getStoreAdminDetails // Controller untuk mengambil detail store admin
);

export default router;
