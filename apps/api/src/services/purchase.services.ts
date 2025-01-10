import prisma from "../models/models"; // Your Prisma client instance

export class PurchaseService {
  /**
   * Fetch all purchases for a user, optionally filtered by status.
   * If status is "ALL" or not provided, returns all statuses.
   */
  async getUserPurchases(userId: number, status?: string) {
    // Construct a conditional "where" clause
    const whereClause: any = { userId };

    // If status was provided (and not "ALL"), filter by that status
    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    // Query Orders from the database
    return prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: true, // or specific fields you want
          },
        },
        store: true,
        shippingAddress: true,
      },
    });
  }
}