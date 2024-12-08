import { Router } from "express";
import { SuperAdminController } from "../controllers/superAdmin.controller";
import { AuthenticateJwtMiddleware } from "../middlewares/superAdmin.middleware";

const router = Router();
const superAdminController = new SuperAdminController();
const authenticateJwt = new AuthenticateJwtMiddleware();

router.post(
  "/store",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("admin").bind(authenticateJwt),
  superAdminController.createStore.bind(superAdminController)
);

router.get(
  "/stores",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("admin").bind(authenticateJwt),
  superAdminController.getAllStores.bind(superAdminController)
);
router.get(
  "/store/:storeId",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("admin").bind(authenticateJwt),
  superAdminController.getStoreById.bind(superAdminController)
);
router.put(
  "/store/:storeId",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("admin").bind(authenticateJwt),
  superAdminController.updateStore.bind(superAdminController)
);

router.delete(
  "/store/:storeId",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("admin").bind(authenticateJwt),
  superAdminController.deleteStore.bind(superAdminController)
);

router.put(
  "/store/:storeId/admin",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("admin").bind(authenticateJwt),
  superAdminController.assignStoreAdmin.bind(superAdminController))

export default router;
