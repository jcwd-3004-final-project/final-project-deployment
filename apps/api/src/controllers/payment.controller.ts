import { Request, Response, NextFunction } from 'express';
import PaymentService from '../services/payment.service';

class PaymentController {
  // Use arrow function, so `this` is properly bound and
  // TypeScript sees it as a RequestHandler
  public createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.body;
      // Suppose you store user info on req.user
      const userId = (req as any).user.id;

      const paymentData = await PaymentService.createPayment(orderId, userId);

      res.status(200).json({
        success: true,
        data: paymentData,
      });
    } catch (error) {
      next(error);
    }
  };

  public handleNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = req.body;
      const result = await PaymentService.handleNotification(notification);

      // Midtrans expects an HTTP 200 if everything is OK
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

// Export a new instance of the controller
export default new PaymentController();