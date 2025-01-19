import prisma from "../models/models";

export class InventoryService {
  async updateStock(
    storeId: number,
    productId: number,
    changeQuantity: number,
    reason: string // <- param reason tetap ada, tapi akan diabaikan, atau dipakai logika tertentu
  ) {
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

    // 4. Buat log / penyesuaian stok (StockAdjustment)
    //    Tentukan reason enum:
    const adjustmentType = changeQuantity >= 0 ? "INCREASE" : "DECREASE";

    // Misal logic: kalau stok bertambah -> RESTOCK, stok berkurang -> SALE
    const stockAdjustmentReason = changeQuantity >= 0 ? "PURCHASE" : "SALE";

    await prisma.stockAdjustment.create({
      data: {
        storeProductId: storeProduct.id,
        adjustmentType, // "INCREASE" / "DECREASE"
        quantity: Math.abs(changeQuantity),
        reason: stockAdjustmentReason, // enum valid
      },
    });

    return updatedStoreProduct;
  }

  /**
   * Get stock logs dari StockAdjustment (atau StockLog) untuk StoreProduct tertentu
   * @param storeId  ID Toko
   * @param productId ID Produk
   */
  async getStockLogs(storeId: number, productId: number) {
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
