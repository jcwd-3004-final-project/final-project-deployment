import { PrismaClient, Role } from "@prisma/client";

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
        store: true, // Sertakan store yang terkait dengan admin
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

  /**
   * Mengonfirmasi pembayaran pesanan.
   * Mengubah status pesanan dari WAITING_FOR_PAYMENT_CONFIRMATION menjadi PROCESSING.
   */
  async confirmPayment(orderId: number, adminId: number) {
    // Validasi: Pastikan pesanan ada dan status-nya sesuai
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "WAITING_FOR_PAYMENT_CONFIRMATION") {
      throw new Error(
        "Order is not waiting for payment confirmation. Current status: " +
          order.status
      );
    }

    // (Opsional) Validasi: Pastikan pesanan tersebut merupakan pesanan dari store yang dikelola oleh admin.
    // Misalnya: bandingkan order.storeId dengan admin.store.store_id

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: "PROCESSING" },
    });

    return updatedOrder;
  }

  /**
   * Menandai pesanan sebagai dikirim.
   * Jika pesanan masih berstatus WAITING_FOR_PAYMENT_CONFIRMATION, maka
   * secara otomatis akan mengubah statusnya menjadi PROCESSING terlebih dahulu.
   * Selanjutnya, pesanan akan diubah menjadi SHIPPED.
   */
  async markAsShipped(orderId: number, adminId: number) {
    let order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Jika order masih WAITING_FOR_PAYMENT_CONFIRMATION, maka otomatis konfirmasi pembayarannya
    if (order.status === "WAITING_FOR_PAYMENT_CONFIRMATION") {
      order = await this.prisma.order.update({
        where: { id: orderId },
        data: { status: "PROCESSING" },
      });
    }

    if (order.status !== "PROCESSING") {
      throw new Error(
        "Order is not in processing state. Current status: " + order.status
      );
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: "SHIPPED" },
    });

    return updatedOrder;
  }
}
