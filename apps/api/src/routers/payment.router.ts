import { Router, Request, Response, NextFunction } from "express";
import PaymentController from '../controllers/payment.controller';
import { AuthenticateJwtMiddleware } from "../middlewares/user.middleware";


const router = Router();
const authenticateJwt = new AuthenticateJwtMiddleware();

/**
 * POST /v1/api/payments/create
 * - Expects { orderId } in the body
 * - Returns Snap token and redirect URL
 */
router.post('/create', 
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    PaymentController.createPayment);

/**
 * POST /v1/api/payments/notification
 * - Midtrans Notification Endpoint
 * - Midtrans will POST updates to this endpoint
 */
router.post('/notification', PaymentController.handleNotification);

export default router;