import prisma from "../models/models";

export class InventoryService {
  async updateStock(
    storeId: number,
    productId: number,
    changeQuantity: number,
    reason: string // <- param reason tetap ada, tapi akan diabaikan, atau dipakai logika tertentu
  ) {
    console.log(
      `Attempting to update stock for Store ID: ${storeId}, Product ID: ${productId}`
    );

    // 1. Cek StoreProduct
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
      `Current stock: ${storeProduct.stock} (storeId=${storeId}, productId=${productId})`
    );

    // 2. Hitung stok baru
    const newStock = storeProduct.stock + changeQuantity;
    if (newStock < 0) {
      console.error(
        `Insufficient stock for storeId=${storeId}, productId=${productId}.`
      );
      throw new Error("Insufficient stock");
    }

    // 3. Update storeProduct
    const updatedStoreProduct = await prisma.storeProduct.update({
      where: {
        id: storeProduct.id,
      },
      data: {
        stock: newStock,
      },
    });
    console.log(`Stock updated to: ${updatedStoreProduct.stock}`);

    // 4. Buat log / penyesuaian stok (StockAdjustment)
    //    Tentukan reason enum:
    const adjustmentType = changeQuantity >= 0 ? "INCREASE" : "DECREASE";

    // Misal logic: kalau stok berkurang -> SALE, stok bertambah -> PURCHASE
    const stockAdjustmentReason = changeQuantity >= 0 ? "PURCHASE" : "SALE";

    await prisma.stockAdjustment.create({
      data: {
        storeProductId: storeProduct.id,
        adjustmentType, // "INCREASE" / "DECREASE"
        quantity: Math.abs(changeQuantity),
        reason: stockAdjustmentReason, // enum valid
      },
    });

    console.log(
      `Stock log created (StockAdjustment) for storeProductId=${storeProduct.id}`
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
