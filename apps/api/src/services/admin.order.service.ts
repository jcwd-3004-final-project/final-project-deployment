// src/services/OrderService.ts
import prisma from '../models/models';
import { OrderStatus } from '@prisma/client';

class OrderService {
  // Mendapatkan semua pesanan dengan opsi filter berdasarkan storeId
  async getAllOrders(storeId?: number) {
    const where = storeId ? { storeId } : {};
    return prisma.order.findMany({
      where,
      include: {
        user: true,
        store: true,
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });
  }

  // Mendapatkan pesanan berdasarkan ID
  async getOrderById(orderId: number) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        store: true,
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });
  }

  // Mengonfirmasi pembayaran
  async confirmPayment(orderId: number, isAccepted: boolean) {
    const order = await this.getOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (isAccepted) {
      return prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.PROCESSING,
          updatedAt: new Date(),
        },
      });
    } else {
      return prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.WAITING_FOR_PAYMENT,
          updatedAt: new Date(),
        },
      });
    }
  }

  // Mengubah status pesanan menjadi Dikirim
  async sendOrder(orderId: number) {
    // Pastikan pesanan dalam status yang dapat dikirim
    const order = await this.getOrderById(orderId);
    if (!order) throw new Error('Order not found');
    if (order.status !== OrderStatus.PROCESSING) {
      throw new Error('Order cannot be shipped at this status');
    }

    // Logika untuk memastikan kesiapan barang dan stok
    // (Simplifikasi: diasumsikan stok sudah cukup)

    return prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.SHIPPED,
        updatedAt: new Date(),
      },
    });
  }

  // Membatalkan pesanan
  async cancelOrder(orderId: number, adminId: number) {
    const order = await this.getOrderById(orderId);
    if (!order) throw new Error('Order not found');
    if (
      order.status === OrderStatus.SHIPPED ||
      order.status === OrderStatus.ORDER_CONFIRMED
    ) {
      throw new Error('Cannot cancel order at this status');
    }

    // Kembalikan stok
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: { increment: item.quantity },
        },
      });

      // Catat perubahan stok di StockLog
      await prisma.stockLog.create({
        data: {
          productId: item.productId,
          changeQuantity: item.quantity,
          reason: 'CORRECTION',
        },
      });
    }

    // Update status pesanan
    return prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
        updatedAt: new Date(),
      },
    });
  }
}

export default OrderService;
