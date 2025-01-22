// src/services/storeAdmin.service.ts

import { PrismaClient, Role, OrderStatus } from "@prisma/client";

export class StoreAdminServices {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }


  async getStoreAdminDetails(adminId: number) {
    if (!adminId) {
      throw new Error("Admin ID is required");
    }
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      include: {
        store: true,
      },
    });

    if (!admin) {
      throw new Error("Admin not found");
    }
    if (admin.role !== Role.STORE_ADMIN) {
      throw new Error("User is not a store admin");
    }

    return {
      id: admin.id,
      firstName: admin.first_name,
      lastName: admin.last_name,
      email: admin.email,
      store: admin.store || null,
    };
  }


  async getStoreOrders(adminId: number, status?: string) {
    // Cari user admin beserta store-nya
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      include: { store: true },
    });
    if (!admin) {
      throw new Error("Admin not found");
    }
    if (!admin.store) {
      throw new Error("This admin does not have a store");
    }

    const whereCondition: any = {
      storeId: admin.store.store_id,
    };
    if (status) {
      whereCondition.status = status;
    }

    // Ambil order beserta items-nya (dan sertakan nama produk dari Product)
    const orders = await this.prisma.order.findMany({
      where: whereCondition,
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Karena model Order ga ada field "orderId", jadi mapping dengan mengonversi id menjadi string.
    const mapped = orders.map((o) => ({
      id: o.id,
      orderId: o.id.toString(), 
      status: o.status,
      paymentProofUrl: o.paymentProof,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      items: o.items.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
      })),
    }));

    return mapped;
  }

  async confirmPayment(orderId: number, adminId: number) {
    let order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== OrderStatus.WAITING_FOR_PAYMENT_CONFIRMATION) {
      throw new Error(
        `Order is not waiting for payment confirmation. Current status: ${order.status}`
      );
    }


    order = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.PROCESSING,
      },
    });
    return order;
  }


  async markAsShipped(orderId: number, adminId: number) {
    let order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === OrderStatus.WAITING_FOR_PAYMENT_CONFIRMATION) {
      order = await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PROCESSING },
      });
    }

    if (order.status !== OrderStatus.PROCESSING) {
      throw new Error(
        `Order is not in PROCESSING state. Current status: ${order.status}`
      );
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.SHIPPED },
    });
    return updated;
  }
}
