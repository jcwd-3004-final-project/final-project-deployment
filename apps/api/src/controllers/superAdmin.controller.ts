import { Request, Response, NextFunction } from "express";
import { SuperAdminServices } from "../services/superAdmin.service";

export class SuperAdminController {
  private superAdminServices: SuperAdminServices;

  constructor() {
    this.superAdminServices = new SuperAdminServices();
  }

  // ===============================
  // Methods untuk _Store_
  // ===============================

  async createStore(req: Request, res: Response, next: NextFunction) {
    try {
      const store = await this.superAdminServices.createStore(req.body);
      res.status(201).json({
        message: "Store created successfully",
        data: store,
        status: res.statusCode,
      });
    } catch (error) {
      console.error("Error creating store:", error);
      next(error);
    }
  }

  async getAllStores(req: Request, res: Response, next: NextFunction) {
    try {
      const stores = await this.superAdminServices.getAllStores();
      res.status(200).json({
        message: "Stores fetched successfully",
        data: stores,
        status: res.statusCode,
      });
    } catch (error) {
      console.error("Error fetching stores:", error);
      next(error);
    }
  }

  async getStoreById(req: Request, res: Response, next: NextFunction) {
    try {
      const storeId = parseInt(req.params.storeId, 10);
      const store = await this.superAdminServices.getStoreById(storeId);
      if (store) {
        res.status(200).json({
          message: `Store with id ${storeId} was successfully retrieved`,
          data: store,
          status: res.statusCode,
        });
      } else {
        res.status(404).json({
          message: `Store with id ${storeId} not found`,
          status: res.statusCode,
        });
      }
    } catch (error) {
      console.error("Error fetching store by id:", error);
      next(error);
    }
  }

  async updateStore(req: Request, res: Response, next: NextFunction) {
    try {
      const storeId = parseInt(req.params.storeId, 10);
      const store = await this.superAdminServices.updateStore(
        storeId,
        req.body
      );
      if (store) {
        res.status(200).json({
          message: `Store with id ${storeId} was updated successfully`,
          data: store,
          status: res.statusCode,
        });
      } else {
        res.status(404).json({
          message: `Store with id ${storeId} not found`,
          status: res.statusCode,
        });
      }
    } catch (error) {
      console.error("Error updating store:", error);
      next(error);
    }
  }

  async deleteStore(req: Request, res: Response, next: NextFunction) {
    try {
      const storeId = parseInt(req.params.storeId, 10);
      const store = await this.superAdminServices.deleteStore(storeId);
      if (store) {
        res.status(200).json({
          message: `Store with id ${storeId} was deleted successfully`,
          status: res.statusCode,
        });
      } else {
        res.status(404).json({
          message: `Store with id ${storeId} not found`,
          status: res.statusCode,
        });
      }
    } catch (error) {
      console.error("Error deleting store:", error);
      next(error);
    }
  }

  // ===============================
  // Methods untuk _User_ dengan role STORE_ADMIN
  // ===============================

  /**
   * Membuat user baru dengan role STORE_ADMIN.
   * Endpoint (contoh): POST /api/superadmin/store-admin
   */
  async createStoreAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { first_name, last_name, email, password, storeId } = req.body;
      const storeAdmin = await this.superAdminServices.createStoreAdmin({
        first_name,
        last_name,
        email,
        password,
        storeId,
      });
      res.status(201).json({
        message: "Store admin created successfully",
        data: storeAdmin,
        status: res.statusCode,
      });
    } catch (error) {
      console.error("Error creating store admin:", error);
      next(error);
    }
  }

  /**
   * Memperbarui data user dengan role STORE_ADMIN.
   * Endpoint (contoh): PUT /api/superadmin/store-admin/:userId
   *
   * Catatan: Pada contoh ini, kita mengharuskan input update untuk store admin
   * menggunakan field `first_name` dan `last_name`. Jika Anda ingin
   * menerima input berupa satu field `name`, lakukan parsing terlebih dahulu.
   */
  async updateStoreAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId, 10);
      // Misal di sini kita menerima first_name dan last_name secara terpisah
      const { first_name, last_name, email, password, storeId } = req.body;
      const updatePayload: Partial<{
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        storeId: number;
      }> = {};

      if (first_name) updatePayload.first_name = first_name;
      if (last_name) updatePayload.last_name = last_name;
      if (email) updatePayload.email = email;
      if (password) updatePayload.password = password;
      if (storeId !== undefined) updatePayload.storeId = storeId;

      const updatedUser = await this.superAdminServices.updateStoreAdmin(
        userId,
        updatePayload
      );

      res.status(200).json({
        message: `Store admin with id ${userId} was updated successfully`,
        data: updatedUser,
        status: res.statusCode,
      });
    } catch (error) {
      console.error("Error updating store admin:", error);
      next(error);
    }
  }

  /**
   * Menghapus user dengan role STORE_ADMIN.
   * Endpoint (contoh): DELETE /api/superadmin/store-admin/:userId
   */
  async deleteStoreAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const deletedUser =
        await this.superAdminServices.deleteStoreAdmin(userId);
      res.status(200).json({
        message: `Store admin with id ${userId} was deleted successfully`,
        status: res.statusCode,
      });
    } catch (error) {
      console.error("Error deleting store admin:", error);
      next(error);
    }
  }

  /**
   * Meng-assign user menjadi store admin dengan mengaitkannya ke suatu store.
   * Endpoint (contoh): POST /api/superadmin/store/:storeId/assign-admin
   */
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
      await this.superAdminServices.assignStoreAdmin(storeId, userId);

      // Mengirim respons sukses
      res.status(200).json({
        message: `Store admin was assigned to store with id ${storeId} successfully`,
        status: res.statusCode,
      });
    } catch (error) {
      console.error("Error assigning store admin:", error);
      next(error); // Mengirim error ke middleware error handler
    }
  }

  // ===============================
  // Methods tambahan lainnya
  // ===============================

  /**
   * Menambahkan produk (beserta stok) ke dalam store tertentu
   * Endpoint (contoh): POST /api/superadmin/store/:storeId/add-product
   */
  async addStoreProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const storeId = parseInt(req.params.storeId, 10);
      const { productId, stock } = req.body;
      const storeProduct = await this.superAdminServices.addStoreProduct(
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
      next(error);
    }
  }

  /**
   * Mengambil semua data user (digunakan oleh Super Admin)
   * Endpoint (contoh): GET /api/superadmin/users
   */
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.superAdminServices.getAllUsers();
      res.status(200).json({
        message: "Users fetched successfully",
        data: users,
        status: res.statusCode,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      next(error);
    }
  }
}
