import prisma from "../models/models";

export class InventoryService {
  // Update stock quantity
  async updateStock(id: number, changeQuantity: number, reason: string) {
    console.log(`Attempting to update stock for Product ID: ${id}`);

    // Fetch the product
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      console.error(`Product with ID ${id} not found.`);
      throw new Error("Product not found");
    }

    console.log(`Current stock for Product ID ${id}: ${product.stockQuantity}`);

    // Calculate new stock
    const newStock = product.stockQuantity + changeQuantity;
    console.log(`New stock after change: ${newStock}`);

    if (newStock < 0) {
      console.error(
        `Insufficient stock for Product ID ${id}. Requested change: ${changeQuantity}`
      );
      throw new Error("Insufficient stock");
    }

    // Update the product stock
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { stockQuantity: newStock },
    });

    console.log(
      `Stock updated for Product ID ${id}: ${updatedProduct.stockQuantity}`
    );

    // Create a stock log entry
    await prisma.stockLog.create({
      data: {
        productId: id, // Pastikan ini sesuai dengan skema Prisma Anda
        changeQuantity,
        reason,
      },
    });

    console.log(`Stock log created for Product ID ${id}`);

    return updatedProduct;
  }

  // Get stock logs
  async getStockLogs(id: number) {
    console.log(`Fetching stock logs for Product ID: ${id}`);
    const logs = await prisma.stockLog.findMany({
      where: { productId: id }, // Pastikan ini sesuai dengan skema Prisma Anda
      orderBy: { createdAt: "desc" },
    });

    return logs;
  }
}
