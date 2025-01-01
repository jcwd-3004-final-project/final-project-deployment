// src/controllers/OrderController.ts
import { Request, Response } from 'express';
import OrderService from '../services/admin.order.service';

class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  // Mendapatkan semua pesanan
  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const storeId = req.query.storeId ? Number(req.query.storeId) : undefined;

      // Cek peran pengguna
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (user.role === 'STORE_ADMIN') {
        const orders = await this.orderService.getAllOrders(user.storeId);
        res.json(orders);
        return;
      }

      // SUPER_ADMIN dapat melihat semua pesanan atau filter berdasarkan storeId
      const orders = await this.orderService.getAllOrders(storeId);
      res.json(orders);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  // Mengonfirmasi pembayaran
  async confirmPayment(req: Request, res: Response): Promise<void> {
    try {
      const { orderId, isAccepted } = req.body;
      if (typeof orderId !== 'number' || typeof isAccepted !== 'boolean') {
        res.status(400).json({ error: 'Invalid input' });
        return;
      }

      const updatedOrder = await this.orderService.confirmPayment(orderId, isAccepted);
      res.json(updatedOrder);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  // Mengirim pesanan
  async sendOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.body;
      if (typeof orderId !== 'number') {
        res.status(400).json({ error: 'Invalid input' });
        return;
      }

      const updatedOrder = await this.orderService.sendOrder(orderId);
      res.json(updatedOrder);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  // Membatalkan pesanan
  async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.body;
      if (typeof orderId !== 'number') {
        res.status(400).json({ error: 'Invalid input' });
        return;
      }

      const user = req.user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const adminId = user.id;
      const updatedOrder = await this.orderService.cancelOrder(orderId, adminId);
      res.json(updatedOrder);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unexpected error occurred' });
      }
    }
  }
}

export default OrderController;
