import prisma from "../models/models"; // Your Prisma client instance

export class PurchaseService {
  /**
   * Fetch all purchases for a user, optionally filtered by status.
   * If status is "ALL" or not provided, returns all statuses.
   */
  async getUserPurchases(userId: number, status?: string) {
    // Construct a conditional "where" clause
    const whereClause: any = { userId };

    // Jika status disediakan (selain "ALL") maka filter berdasarkan status tersebut
    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    // Query orders dari database
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: true, // sertakan data produk yang dibutuhkan
          },
        },
        store: true,
        shippingAddress: true,
      },
    });

    // Tambahkan properti `finalTotal` ke setiap order.
    // Di sini, contoh perhitungannya sederhana, yaitu:
    // finalTotal = totalAmount - discount
    // Karena data discount (voucher/referral) tidak tersedia, kita anggap discount = 0.
    // Jika nantinya Anda ingin menghitung diskon (misal berdasarkan logika bisnis tertentu),
    // Anda dapat menyesuaikan perhitungan di bawah ini.
    const ordersWithFinalTotal = orders.map((order) => {
      const computedDiscount = 0; // Gantilah perhitungan ini jika ada logika diskon
      const finalTotal =
        order.totalAmount - computedDiscount < 0
          ? 0
          : order.totalAmount - computedDiscount;
      return {
        ...order,
        finalTotal,
      };
    });

    return ordersWithFinalTotal;
  }
}
