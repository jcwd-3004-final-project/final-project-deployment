// src/routes/category.routes.ts

import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { AuthenticateJwtMiddleware } from "../middlewares/superAdmin.middleware";

const router = Router();
const categoryController = new CategoryController();
const authenticateJwt = new AuthenticateJwtMiddleware();

// Protect all routes with authentication and authorization
router.post(
  "/",
  // authenticateJwt.authenticateJwt.bind(authenticateJwt),
  // authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  categoryController.createCategory.bind(categoryController)
);

router.get(
  "/",
  //   authenticateJwt.authenticateJwt.bind(authenticateJwt),
  //   authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  categoryController.getCategories.bind(categoryController)
);

router.get(
  "/:id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  categoryController.getCategoryById.bind(categoryController)
);

router.put(
  "/:id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  categoryController.updateCategory.bind(categoryController)
);

router.delete(
  "/:id",
  // authenticateJwt.authenticateJwt.bind(authenticateJwt),
  // authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  categoryController.deleteCategory.bind(categoryController)
);

export default router;
