import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { UserController } from "../controllers/user.controllers";
import { OrderController } from "../controllers/order.controller";
import { AuthenticateJwtMiddleware } from "../middlewares/user.middleware";


const router = Router();
const authenticateJwt = new AuthenticateJwtMiddleware();
const upload = multer({ dest: "uploads/" }); // local folder for uploads

/**
 * asyncWrap: Wraps an async function so that any thrown errors
 * are properly passed to next() for Express error handling.
 */
function asyncWrap(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

// Optional logging middleware
router.use((req: Request, res: Response, next: NextFunction) => {
  // console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

/* ---------------------------
   USER ADDRESSES ENDPOINTS
--------------------------- */
router.get(
  "/addresses",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  asyncWrap(UserController.getAddresses)
);

router.post(
  "/addresses",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  asyncWrap(UserController.addAddress)
);

router.put(
  "/addresses/:addressId",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  asyncWrap(UserController.updateAddress)
);

router.delete(
  "/addresses/:addressId",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  asyncWrap(UserController.deleteAddress)
);

/* ---------------------------
   SHIPPING ENDPOINTS
--------------------------- */
router.post(
  "/checkout/shipping",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  asyncWrap(UserController.setShippingAddress)
);

router.get(
  "/shipping-cost",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  asyncWrap(UserController.getShippingCost)
);

/* ---------------------------
   ORDER ENDPOINTS
--------------------------- */
router.post(
  "/order",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  asyncWrap(OrderController.createOrder)
);

router.post(
  "/order/upload",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  upload.single("paymentProof"), // match the form-data key
  asyncWrap(OrderController.uploadPaymentProof)
);

router.get(
  "/order/:id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
  asyncWrap(OrderController.getOrder)
);

export default router;