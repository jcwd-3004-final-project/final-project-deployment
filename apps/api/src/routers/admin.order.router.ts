// src/routes/OrderRouter.ts
import { Router } from 'express';
import OrderController from '../controllers/admin.order.controller';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();
const orderController = new OrderController();

// Middleware otentikasi untuk semua rute di bawah ini
router.use(authMiddleware);

// Rute untuk mendapatkan semua pesanan
router.get('/', (req, res) => orderController.getAllOrders(req, res));

// Rute untuk mengonfirmasi pembayaran
router.post('/confirm-payment', (req, res) => orderController.confirmPayment(req, res));

// Rute untuk mengirim pesanan
router.post('/send', (req, res) => orderController.sendOrder(req, res));

// Rute untuk membatalkan pesanan
router.post('/cancel', (req, res) => orderController.cancelOrder(req, res));

export default router;
