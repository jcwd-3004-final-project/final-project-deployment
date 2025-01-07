import prisma from "../models/models";

export class InventoryService {
  /**
   * Update stock quantity di StoreProduct
   * @param storeId  ID Toko
   * @param productId ID Produk
   * @param changeQuantity (+) jika menambah stok, (-) jika mengurangi stok
   * @param reason Alasan perubahan stok
   */
  async updateStock(
    storeId: number,
    productId: number,
    changeQuantity: number,
    reason: string
  ) {
    console.log(
      `Attempting to update stock for Store ID: ${storeId}, Product ID: ${productId}`
    );

    // 1. Pastikan StoreProduct ada
    const storeProduct = await prisma.storeProduct.findFirst({
      where: {
        storeId: storeId,
        productId: productId,
      },
    });

    if (!storeProduct) {
      console.error(
        `StoreProduct with storeId=${storeId} and productId=${productId} not found.`
      );
      throw new Error("StoreProduct not found");
    }

    console.log(
      `Current stock for Store ID ${storeId}, Product ID ${productId}: ${storeProduct.stock}`
    );

    // 2. Hitung stok baru
    const newStock = storeProduct.stock + changeQuantity;
    console.log(`New stock after change: ${newStock}`);

    if (newStock < 0) {
      console.error(
        `Insufficient stock for StoreProduct storeId=${storeId}, productId=${productId}.`
      );
      throw new Error("Insufficient stock");
    }

    // 3. Update storeProduct.stock
    const updatedStoreProduct = await prisma.storeProduct.update({
      where: {
        id: storeProduct.id, // atau unique compound (storeId, productId) jika sudah di-set
      },
      data: {
        stock: newStock,
      },
    });

    console.log(
      `Stock updated for StoreProduct. New stock: ${updatedStoreProduct.stock}`
    );

    // 4. Buat log / penyesuaian stok
    //    Jika Anda menggunakan StockAdjustment:
    await prisma.stockAdjustment.create({
      data: {
        storeProductId: storeProduct.id,
        adjustmentType: changeQuantity >= 0 ? "INCREASE" : "DECREASE",
        quantity: Math.abs(changeQuantity),
        reason: reason as any,
      },
    });

    console.log(
      `Stock log (StockAdjustment) created for storeProductId=${storeProduct.id}`
    );

    return updatedStoreProduct;
  }

  /**
   * Get stock logs dari StockAdjustment (atau StockLog) untuk StoreProduct tertentu
   * @param storeId  ID Toko
   * @param productId ID Produk
   */
  async getStockLogs(storeId: number, productId: number) {
    console.log(
      `Fetching stock logs for Store ID: ${storeId}, Product ID: ${productId}`
    );

    // Pastikan storeProduct ada
    const storeProduct = await prisma.storeProduct.findFirst({
      where: {
        storeId: storeId,
        productId: productId,
      },
    });

    if (!storeProduct) {
      console.error(
        `StoreProduct with storeId=${storeId} and productId=${productId} not found.`
      );
      throw new Error("StoreProduct not found");
    }

    // Ambil semua penyesuaian stok
    const logs = await prisma.stockAdjustment.findMany({
      where: {
        storeProductId: storeProduct.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return logs;
  }
}
