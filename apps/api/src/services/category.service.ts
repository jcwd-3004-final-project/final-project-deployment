// src/services/category.service.ts

import prisma from "../models/models"; // Pastikan path ini sesuai dengan struktur proyek Anda
import { categorySchema } from "../validator/category.validator";
import { Category, Product } from "../models/models";

export class CategoryService {
  // Create a new category
  async createCategory(data: { name: string }): Promise<Category> {
    // Validasi data menggunakan Zod
    const validatedData = categorySchema.parse(data);

    // Buat kategori baru di database
    const newCategory = await prisma.category.create({
      data: {
        name: validatedData.name,
      },
      include: {
        products: {
          include: {
            images: true, // Sertakan gambar terkait
          },
        },
      },
    });

    // Transformasi produk untuk menyertakan images sebagai array string
    const transformedCategory: Category = {
      ...newCategory,
      products: newCategory.products.map(this.transformProduct),
    };

    return transformedCategory;
  }

  // Get all categories
  async getCategories(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          include: {
            images: true, // Sertakan gambar terkait
          },
        },
      },
    });

    // Transformasi setiap kategori
    return categories.map((category) => ({
      ...category,
      products: category.products.map(this.transformProduct),
    }));
  }

  // Get a category by ID
  async getCategoryById(id: number): Promise<Category> {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            images: true, // Sertakan gambar terkait
          },
        },
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    // Transformasi produk
    const transformedCategory: Category = {
      ...category,
      products: category.products.map(this.transformProduct),
    };

    return transformedCategory;
  }

  // Update a category
  async updateCategory(
    id: number,
    data: Partial<{
      name: string;
    }>
  ): Promise<Category> {
    // Pastikan data yang diterima valid
    const validatedData = categorySchema.partial().parse(data);

    // Periksa apakah kategori ada
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new Error("Category not found");
    }

    // Update kategori
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: validatedData.name,
      },
      include: {
        products: {
          include: {
            images: true, // Sertakan gambar terkait
          },
        },
      },
    });

    // Transformasi produk
    const transformedCategory: Category = {
      ...updatedCategory,
      products: updatedCategory.products.map(this.transformProduct),
    };

    return transformedCategory;
  }

  // Delete a category
  async deleteCategory(id: number): Promise<{ message: string }> {
    // Periksa apakah kategori ada
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true, // Sertakan produk terkait
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    // Pastikan kategori tidak memiliki produk terkait sebelum dihapus
    if (category.products.length > 0) {
      throw new Error("Cannot delete category with associated products");
    }

    // Hapus kategori
    await prisma.category.delete({
      where: { id },
    });

    return { message: "Category deleted successfully" };
  }

  // Helper function untuk mentransformasi produk
  private transformProduct(product: any): Product {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      stockQuantity: product.stockQuantity,
      images: product.images.map((image: any) => image.url), // Transformasi images
      category: product.category, // Optional, jika diperlukan
    };
  }
}
