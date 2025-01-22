import prisma from "../models/models"; // Your Prisma client instance

export class PurchaseService {
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
            product: true,
          },
        },
        store: true,
        shippingAddress: true,
      },
    });

    const ordersWithFinalTotal = orders.map((order) => {
      const computedDiscount = 0; 
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
