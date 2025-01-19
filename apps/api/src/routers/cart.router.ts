import { Router, Request, Response, NextFunction } from "express";
import { CartController } from "../controllers/cart.controller";
import { AuthenticateJwtMiddleware } from "../middlewares/user.middleware";

const router = Router();
const authenticateJwt = new AuthenticateJwtMiddleware();

/**
 * asyncWrap: Wraps an async function so that any thrown errors
 * are properly passed to next() for Express error handling.
 */
function asyncWrap(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

// OPTIONAL: Logging middleware
router.use((req: Request, res: Response, next: NextFunction) => {
  
  next();
});

// ---------------------------
// CART ENDPOINTS
// ---------------------------
router.get(
  "/",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  asyncWrap(CartController.getCart)
);

router.post(
  "/items",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  asyncWrap(CartController.addItem)
);

router.put(
  "/items/remove",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  asyncWrap(CartController.removeItem)
);

router.delete(
  "/items/:id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  asyncWrap(CartController.deleteItem) // <= Pastikan ada method deleteItem di CartController
);

export default router;
