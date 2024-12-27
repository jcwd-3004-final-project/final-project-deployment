import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { AuthenticateJwtMiddleware } from "../middlewares/superAdmin.middleware";

const router = Router();
const productController = new ProductController();
const authenticateJwt = new AuthenticateJwtMiddleware();

router.post(
  "/",
  // authenticateJwt.authenticateJwt.bind(authenticateJwt),
  // authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  productController.createProduct.bind(productController)
);
router.get("/", productController.getProducts.bind(productController));

router.put(
  "/:id",
  // authenticateJwt.authenticateJwt.bind(authenticateJwt),
  // authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  productController.updateProduct.bind(productController)
);
router.delete("/:id", productController.deleteProduct.bind(productController));

export default router;
