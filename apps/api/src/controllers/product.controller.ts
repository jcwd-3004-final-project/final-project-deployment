import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  // Create product
  async createProduct(req: Request, res: Response) {
    const { name, description, price, categoryId, images, stockQuantity } =
      req.body;

    try {
      const newProduct = await this.productService.createProduct({
        name,
        description,
        price,
        categoryId,
        images,
        stockQuantity,
      });
      res.status(201).json({
        message: "Product created successfully",
        data: newProduct,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all products
  async getProducts(req: Request, res: Response) {
    try {
      const products = await this.productService.getProducts();
      res.status(200).json({
        message: "Products retrieved successfully",
        data: products,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get product by ID
  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Validasi ID
      const productId = parseInt(id, 10);
      if (isNaN(productId) || productId <= 0) {
        return res.status(400).json({
          message: "Invalid product ID. It must be a positive integer.",
        });
      }

      // Ambil data produk dari service
      const product = await this.productService.getProductById(productId);

      if (!product) {
        return res.status(404).json({
          message: `Product with ID ${productId} not found.`,
        });
      }

      // Kirim respons sukses
      res.status(200).json({
        message: "Product retrieved successfully",
        data: product,
      });
    } catch (error: any) {
      console.error("Error fetching product by ID:", error.message);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Update product
  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const updates = req.body;

    try {
      const updatedProduct = await this.productService.updateProduct(
        Number(id),
        updates
      );
      res.status(200).json({
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete product
  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const deleted = await this.productService.deleteProduct(Number(id));
      res
        .status(200)
        .json({ data: deleted, message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(400).json({ error: "Failed to delete product" });
    }
  }
}
