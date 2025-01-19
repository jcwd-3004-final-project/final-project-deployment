import { Router } from "express";
import { SuperAdminController } from "../controllers/superAdmin.controller";
import { AuthenticateJwtMiddleware } from "../middlewares/superAdmin.middleware";

const router = Router();
const superAdminController = new SuperAdminController();
const authenticateJwt = new AuthenticateJwtMiddleware();

// ================================
// Endpoints untuk Store
// ================================

// Create Store
router.post(
  "/store",
  // Uncomment middleware JWT jika diperlukan
  // authenticateJwt.authenticateJwt.bind(authenticateJwt),
  // authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.createStore.bind(superAdminController)
);

// Get all stores
router.get(
  "/stores",
  //Uncomment middleware JWT jika diperlukan



  // authenticateJwt.authenticateJwt.bind(authenticateJwt),
  // authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),

  superAdminController.getAllStores.bind(superAdminController)
);

// Get store by ID
router.get(
  "/store/:storeId",
  //Uncomment middleware JWT jika diperlukan
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.getStoreById.bind(superAdminController)
);

// Update store
router.put(
  "/store/:storeId",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.updateStore.bind(superAdminController)
);

// Delete store
router.delete(
  "/store/:storeId",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.deleteStore.bind(superAdminController)
);

// Add product to store
router.post(
  "/:storeId/products",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.addStoreProduct.bind(superAdminController)
);

// Assign store admin
router.put(
  "/store/:storeId/admin",
  // Uncomment middleware JWT jika diperlukan
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.assignStoreAdmin.bind(superAdminController)
);

// ================================
// Endpoints untuk Store Admin (User dengan role STORE_ADMIN)
// ================================

// Create Store Admin
router.post(
  "/store-admin",
  // Uncomment middleware JWT jika diperlukan
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.createStoreAdmin.bind(superAdminController)
);

// Update Store Admin
router.put(
  "/store-admin/:userId",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.updateStoreAdmin.bind(superAdminController)
);

// Delete Store Admin
router.delete(
  "/store-admin/:userId",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.deleteStoreAdmin.bind(superAdminController)
);

// ================================
// Endpoint untuk mengambil semua data user (Super Admin)
// ================================
router.get(
  "/users",
  // Uncomment middleware JWT jika diperlukan
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.getAllUsers.bind(superAdminController)
);

export default router;
