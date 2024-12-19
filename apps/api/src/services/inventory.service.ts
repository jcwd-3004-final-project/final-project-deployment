import prisma from "../models/models";

export class InventoryService {
  // Update stock quantity
  async updateStock(productId: number, changeQuantity: number, reason: string) {
    // Fetch the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Calculate new stock
    const newStock = product.stockQuantity + changeQuantity;

    if (newStock < 0) {
      throw new Error("Insufficient stock");
    }

    // Update the product stock
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { stockQuantity: newStock },
    });

    // Create a stock log entry
    await prisma.stockLog.create({
      data: {
        productId,
        changeQuantity,
        reason,
      },
    });

    return updatedProduct;
  }

  // Get stock logs
  async getStockLogs(productId: number) {
    const logs = await prisma.stockLog.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
    });

    return logs;
  }
}
