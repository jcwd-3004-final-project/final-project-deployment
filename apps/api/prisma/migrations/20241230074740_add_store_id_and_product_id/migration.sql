/*
  Warnings:

  - A unique constraint covering the columns `[storeId,productId]` on the table `StoreProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StoreProduct_storeId_productId_key" ON "StoreProduct"("storeId", "productId");
