import { Request, Response, NextFunction } from "express";
import { SuperAdminServices } from "../services/superAdmin.service";

export class SuperAdminController {
  private SuperAdminServices: SuperAdminServices;

  constructor() {
    this.SuperAdminServices = new SuperAdminServices();
  }

  async createStore(req: Request, res: Response) {
    try {
      const store = await this.SuperAdminServices.createStore(req.body);
      res.status(201).json(store);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating store" });
    }
  }

  async getAllStores(req: Request, res: Response) {
    const store = await this.SuperAdminServices.getAllStores();
    if (store) {
      res.status(200).send({
        data: store,
        status: res.statusCode,
      });
    } else {
      res.status(404).send({
        message: "Store not found",
        status: res.statusCode,
      });
    }
  }

  async getStoreById(req: Request, res: Response) {
    const storeId = parseInt(req.params.storeId);
    const store = await this.SuperAdminServices.getStoreById(storeId);
    if (store) {
      res.status(200).send({
        message: `Store with id ${storeId} was succesfully retrieved`,
        data: store,
        status: res.statusCode,
      });
    } else {
      res.status(404).send({
        message: `Store with id ${storeId} not found`,
        status: res.statusCode,
      });
    }
  }

  async updateStore(req: Request, res: Response) {
    const storeId = parseInt(req.params.storeId);
    const store = await this.SuperAdminServices.updateStore(storeId, req.body);
    if (store) {
      res.status(200).send({
        message: `Store with id ${storeId} was updated successfully`,
        data: store,
        status: res.statusCode,
      });
    } else {
      res.status(404).send({
        message: `Store with id ${storeId} not found`,
        status: res.statusCode,
      });
    }
  }

  async deleteStore(req: Request, res: Response) {
    const storeId = parseInt(req.params.storeId);
    const store = await this.SuperAdminServices.deleteStore(storeId);
    if (store) {
      res.status(200).send({
        message: `Store with id ${storeId} was deleted successfully`,
        status: res.statusCode,
      });
    } else {
      res.status(404).send({
        message: `Store with id ${storeId} not found`,
        status: res.statusCode,
      });
    }
  }

  async assignStoreAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      // Mengambil storeId dari params dan userId dari body
      const storeId = parseInt(req.params.storeId, 10);
      const userId = parseInt(req.body.userId, 10);

      // Debugging: Memastikan nilai yang diterima
      console.log("Store ID:", storeId);
      console.log("User ID:", userId);
      console.log("Request Body:", req.body);

      // Validasi storeId dan userId
      if (isNaN(storeId)) {
        throw new Error("Invalid storeId");
      }
      if (isNaN(userId)) {
        throw new Error("Invalid userId");
      }

      // Memanggil service untuk menetapkan admin toko
      await this.SuperAdminServices.assignStoreAdmin(storeId, userId);

      // Mengirim respons sukses
      res.status(200).send({
        message: `Store admin was assigned to store with id ${storeId} successfully`,
        status: res.statusCode,
      });
    } catch (error) {
      next(error); // Mengirim error ke middleware error handler
    }
  }

  /**
   * Method untuk menambahkan produk (beserta stok) ke dalam store tertentu
   * URL Endpoint (contoh): POST /api/superadmin/store/:storeId/add-product
   */
  async addStoreProduct(req: Request, res: Response) {
    try {
      const storeId = parseInt(req.params.storeId, 10);
      const { productId, stock } = req.body;

      // Panggil service untuk menambahkan record di tabel storeProduct
      const storeProduct = await this.SuperAdminServices.addStoreProduct(
        storeId,
        productId,
        stock
      );

      res.status(201).json({
        message: `Product with ID ${productId} was added to store with ID ${storeId} successfully`,
        data: storeProduct,
        status: res.statusCode,
      });
    } catch (error) {
      console.error("Error adding product to store:", error);
      res.status(500).json({ message: "Error adding product to store" });
    }
  }
}
