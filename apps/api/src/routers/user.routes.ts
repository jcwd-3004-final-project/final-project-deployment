import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/user.controllers";
import { AuthenticateJwtMiddleware } from "../middlewares/user.middleware";

console.log('JWT_SECRET:', process.env.JWT_ACCESS_TOKEN_SECRET);

const router = Router();
const userController = new UserController();
const authenticateJwt = new AuthenticateJwtMiddleware();

// Logging middleware for this router
router.use((req: Request, res: Response, next: NextFunction) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
//   console.log('Headers:', req.headers);
//   console.log('Body:', req.body);
  next();
});

router.get(
  "/addresses",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  UserController.getAddresses.bind(userController)
);

router.post(
  "/addresses",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  UserController.addAddress.bind(userController)
);

router.put(
  "/addresses/:addressId",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  UserController.updateAddress.bind(userController)
);

router.delete(
  "/addresses/:addressId",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  UserController.deleteAddress.bind(userController)
);

router.post(
  "/checkout/shipping",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  UserController.setShippingAddress.bind(userController)
);

router.get(
  "/shipping-cost",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  UserController.getShippingCost.bind(userController)
);

export default router;
