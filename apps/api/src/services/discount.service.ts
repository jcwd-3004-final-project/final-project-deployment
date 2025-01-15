import { 
  PrismaClient, 
  DiscountType, 
  VoucherUsageType, 
  DiscountValueType,
} from '@prisma/client';

const prisma = new PrismaClient();

export class DiscountService {
  // ------------------ Discount CRUD Operations ------------------

  /**
   * Membuat diskon baru.
   * @param data - Data diskon (type, value, valueType, startDate, endDate, dsb.)
   */
  async createDiscount(data: any) {
    data.startDate = new Date(data.startDate);
    data.endDate = new Date(data.endDate);
  
    if (data.endDate < data.startDate) {
      throw new Error('End date cannot be earlier than start date');
    }
  
    return prisma.discount.create({
      data,
    });
  }
  

  /**
   * Mengupdate diskon berdasarkan ID.
   * @param id - ID diskon
   * @param data - Data yang akan diupdate
   */
  async updateDiscount(id: number, data: any) {
    // Validasi tanggal
    if (data.startDate && data.endDate) {
      if (new Date(data.endDate) < new Date(data.startDate)) {
        throw new Error('End date cannot be earlier than start date');
      }
    }

    return prisma.discount.update({
      where: { id },
      data,
    });
  }

  /**
   * Menghapus diskon berdasarkan ID.
   * @param id - ID diskon
   */
  async deleteDiscount(id: number) {
    return prisma.discount.delete({
      where: { id },
    });
  }

  /**
   * Mendapatkan semua diskon beserta produk-produknya.
   */
  async getDiscounts() {
    return prisma.discount.findMany({
      include: { products: true },
    });
  }

  // ------------------ Assign/Remove Discounts to/from Products ------------------

  /**
   * Mengaitkan diskon ke produk tertentu.
   * @param discountId - ID diskon
   * @param productId - ID produk
   */
  async assignDiscountToProduct(discountId: number, productId: number) {
    return prisma.discount.update({
      where: { id: discountId },
      data: {
        products: {
          connect: { id: productId },
        },
      },
    });
  }

  /**
   * Melepas diskon dari produk tertentu.
   * @param discountId - ID diskon
   * @param productId - ID produk
   */
  async removeDiscountFromProduct(discountId: number, productId: number) {
    return prisma.discount.update({
      where: { id: discountId },
      data: {
        products: {
          disconnect: { id: productId },
        },
      },
    });
  }

  // ------------------ Voucher Operations ------------------

  /**
   * Membuat voucher baru.
   * @param data - Data voucher (code, discountType, value, valueType, startDate, endDate, usageType, dsb.)
   */
  async createVoucher(data: any) {
    const existingVoucher = await prisma.voucher.findUnique({
      where: { code: data.code },
    });
    if (existingVoucher) {
      throw new Error('Voucher code already exists');
    }

    // Validasi tanggal
    if (new Date(data.endDate) < new Date(data.startDate)) {
      throw new Error('End date cannot be earlier than start date');
    }

    // expiryDate bisa disamakan dengan endDate jika Anda tidak memisahkannya
    // misalnya: if (!data.expiryDate) { data.expiryDate = data.endDate; }

    // Buat voucher
    return prisma.voucher.create({
      data,
    });
  }

  async updateVoucher(id: number, data: any) {
    // Validasi tanggal
    if (data.startDate && data.endDate) {
      if (new Date(data.endDate) < new Date(data.startDate)) {
        throw new Error('End date cannot be earlier than start date');
      }
    }

    return prisma.voucher.update({
      where: { id },
      data,
    });
  }

  async deleteVoucher(id: number) {
    return prisma.voucher.delete({
      where: { id },
    });
  }

  async getVouchers() {
    return prisma.voucher.findMany({
      include: { products: true },
    });
  }

  // ------------------ Calculate Discount ------------------
  async calculateDiscount(cartItems: any[], userId: number, shippingCost: number): Promise<any> {
    // Ambil voucher user yang masih berlaku
    const userVouchers = await prisma.userVoucher.findMany({
      where: { 
        userId, 
        isUsed: false, 
        voucher: { endDate: { gte: new Date() } } 
      },
      include: { voucher: true },
    });

    let totalDiscount = 0;
    let totalAmount = 0;

    // 1. Hitung diskon berdasarkan produk
    for (const item of cartItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { discounts: true }, // Diskon yang terhubung langsung dengan product
      });

      if (!product) {
        throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan`);
      }

      const price = product.price;
      const quantity = item.quantity;
      let productPrice = price * quantity;
      let productDiscount = 0;

      // Diskon produk
      for (const discount of product.discounts) {
        // PRODUCT_DISCOUNT
        if (discount.type === DiscountType.PRODUCT_DISCOUNT) {
          if (discount.valueType === DiscountValueType.PERCENTAGE) {
            productDiscount += (price * discount.value / 100) * quantity;
          } else if (discount.valueType === DiscountValueType.NOMINAL) {
            productDiscount += discount.value * quantity;
          }
        }
        // BUY_ONE_GET_ONE
        else if (discount.type === DiscountType.BUY_ONE_GET_ONE && quantity >= 2) {
          const freeCount = Math.floor(quantity / 2);
          productDiscount += price * freeCount;
        }
        // MIN_PURCHASE_DISCOUNT
        else if (discount.type === DiscountType.MIN_PURCHASE_DISCOUNT) {
          if (discount.minPurchase && productPrice >= discount.minPurchase) {
            if (discount.valueType === DiscountValueType.PERCENTAGE) {
              productDiscount += productPrice * discount.value / 100;
            } else if (discount.valueType === DiscountValueType.NOMINAL) {
              productDiscount += discount.value;
            }
            // Terapkan maxDiscount jika ada
            if (discount.maxDiscount) {
              productDiscount = Math.min(productDiscount, discount.maxDiscount);
            }
          }
        }
      }

      totalDiscount += productDiscount;
      totalAmount += (productPrice - productDiscount);
    }

    // 2. Hitung pemakaian voucher
    for (const userVoucher of userVouchers) {
      const voucher = userVoucher.voucher;

      // Pastikan voucher belum expired
      // (Sudah difilter, tapi jika mau double-check, boleh)
      if (new Date(voucher.endDate) < new Date()) {
        continue; // Voucher sudah kadaluarsa
      }

      // Voucher usageType
      if (voucher.usageType === VoucherUsageType.TOTAL_PURCHASE && totalAmount >= (voucher.minPurchaseAmount || 0)) {
        let voucherDiscount = 0;
        if (voucher.valueType === DiscountValueType.PERCENTAGE) {
          voucherDiscount = (totalAmount * voucher.value) / 100;
        } else if (voucher.valueType === DiscountValueType.NOMINAL) {
          voucherDiscount = voucher.value;
        }

        // Terapkan maxDiscount jika ada
        if (voucher.maxDiscount) {
          voucherDiscount = Math.min(voucherDiscount, voucher.maxDiscount);
        }

        totalDiscount += voucherDiscount;
        totalAmount -= voucherDiscount;

        // Tandai voucher sudah terpakai
        await prisma.userVoucher.update({
          where: { id: userVoucher.id },
          data: { isUsed: true, usedAt: new Date() },
        });
      }
      else if (voucher.usageType === VoucherUsageType.PRODUCT) {
        // Voucher khusus produk tertentu
        const voucherProducts = await prisma.voucher.findUnique({
          where: { id: voucher.id },
          include: { products: true },
        });

        if (voucherProducts?.products) {
          for (const item of cartItems) {
            if (voucherProducts.products.some(p => p.id === item.productId)) {
              // Kalkulasi potongan
              const productDetail = await prisma.product.findUnique({
                where: { id: item.productId },
              });
              if (!productDetail) continue;

              let voucherDiscount = 0;
              const subTotal = productDetail.price * item.quantity;

              if (voucher.valueType === DiscountValueType.PERCENTAGE) {
                voucherDiscount += (subTotal * voucher.value) / 100;
              } else if (voucher.valueType === DiscountValueType.NOMINAL) {
                voucherDiscount += voucher.value * item.quantity;
              }

              // Terapkan maxDiscount
              if (voucher.maxDiscount) {
                voucherDiscount = Math.min(voucherDiscount, voucher.maxDiscount);
              }

              totalDiscount += voucherDiscount;
              totalAmount -= voucherDiscount;

              // Tandai voucher sudah terpakai
              await prisma.userVoucher.update({
                where: { id: userVoucher.id },
                data: { isUsed: true, usedAt: new Date() },
              });
            }
          }
        }
      }
      else if (voucher.usageType === VoucherUsageType.SHIPPING) {
        // Voucher untuk ongkos kirim
        if (shippingCost > 0) {
          let shippingDiscount = 0;

          if (voucher.valueType === DiscountValueType.PERCENTAGE) {
            shippingDiscount = (shippingCost * voucher.value) / 100;
          } else if (voucher.valueType === DiscountValueType.NOMINAL) {
            shippingDiscount = voucher.value;
          }

          if (voucher.maxDiscount) {
            shippingDiscount = Math.min(shippingDiscount, voucher.maxDiscount);
          }

          totalDiscount += shippingDiscount;
          totalAmount -= shippingDiscount; // Asumsikan totalAmount mencakup shippingCost

          // Tandai voucher sudah terpakai
          await prisma.userVoucher.update({
            where: { id: userVoucher.id },
            data: { isUsed: true, usedAt: new Date() },
          });
        }
      }
    }

    // 3. Gratis ongkos kirim jika user sudah punya beberapa transaksi sebelumnya
    const userTransactionCount = await prisma.order.count({
      where: { userId, status: 'ORDER_CONFIRMED' },
    });

    if (userTransactionCount >= 5) { // Contoh syarat minimal 5 transaksi
      if (shippingCost > 0) {
        totalAmount -= shippingCost;
        totalDiscount += shippingCost;
      }
    }

    return { totalAmount, totalDiscount };
  }

  // ------------------ Helper Functions ------------------

  /**
   * Menghasilkan kode referral unik.
   */
  generateReferralCode(): string {
    return 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
