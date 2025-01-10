import prisma from "../models/models";
import { productSchema } from "../validator/product.validator";

export class ProductService {
  // Create a new product
  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    images: string[]; // Array URL gambar
    stockQuantity: number;
  }) {
    const validatedData = productSchema.parse(data);
    const newProduct = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        categoryId: validatedData.categoryId,
        stockQuantity: validatedData.stockQuantity,
        images: {
          create: validatedData.images.map((url) => ({ url })),
        },
      },
      include: {
        images: true,
      },
    });
    return newProduct;
  }

  // Get all products
  async getProducts() {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: {
          select: { url: true },
        },
      },
    });
    // Transformasi images menjadi array string URL
    return products.map((product) => ({
      ...product,
      images: product.images.map((images) => images.url),
    }));
  }

  async getProductById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true, // Menyertakan data kategori produk
        images: true, // Menyertakan gambar produk
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  async updateProduct(
    id: number,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      categoryId: number;
      stockQuantity: number;
      images: string[]; // Array URL gambar
    }>
  ) {
    // Validasi apakah produk ada
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Validasi apakah categoryId valid
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new Error("Invalid categoryId");
      }
    }

    // Update produk
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        stockQuantity: data.stockQuantity,
      },
    });

    // Update gambar jika ada
    if (data.images) {
      // Hapus gambar lama
      await prisma.image.deleteMany({
        where: { productId: id },
      });

      // Tambahkan gambar baru
      await prisma.image.createMany({
        data: data.images.map((url) => ({
          url,
          productId: id,
        })),
      });
    }

    // Sertakan gambar yang telah diperbarui
    const productWithImages = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    return productWithImages;
  }

  // Delete a product
  async deleteProduct(id: number) {
    try {
      // Mulai transaksi
      const deletedProduct = await prisma.$transaction(async (tx) => {
        // Hapus entri terkait di StoreProduct
        await tx.storeProduct.deleteMany({
          where: { productId: id },
        });

        // Hapus entri terkait di Image
        await tx.image.deleteMany({
          where: { productId: id },
        });

        // Hapus entri terkait di CartItem
        await tx.cartItem.deleteMany({
          where: { productId: id },
        });

        // Hapus entri terkait di OrderItem
        await tx.orderItem.deleteMany({
          where: { productId: id },
        });

        // Hapus entri terkait di Voucher
        await tx.voucher.deleteMany({
          where: {
            products: {
              some: {
                id: id,
              },
            },
          },
        });

        // Hapus entri terkait di StockLog
        await tx.stockLog.deleteMany({
          where: { productId: id },
        });

        // Hapus produk
        const deleted = await tx.product.delete({
          where: { id: id },
        });

        return deleted;
      });

      return deletedProduct;
    } catch (error) {
      throw error;
    }
  }
}
