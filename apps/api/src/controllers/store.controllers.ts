// src/controllers/StoreController.ts
import { Request, Response } from "express";
import StoreService from "../services/store.services";

class StoreController {
  private storeService: StoreService;

  constructor() {
    this.storeService = new StoreService();

    // Bind metode untuk memastikan konteks `this` tetap benar saat digunakan sebagai callback
    this.getAllStores = this.getAllStores.bind(this);
    this.getStoreById = this.getStoreById.bind(this);
    this.createStore = this.createStore.bind(this);
    this.updateStore = this.updateStore.bind(this);
    this.deleteStore = this.deleteStore.bind(this);
    this.assignStoreAdmin = this.assignStoreAdmin.bind(this);
  }

  /**
   * Mendapatkan semua store
   * @param req - Request object dari Express
   * @param res - Response object dari Express
   */
  public async getAllStores(req: Request, res: Response): Promise<void> {
    try {
      const stores = await this.storeService.getAllStores();
      res.status(200).json(stores);
    } catch (error) {
      console.error("Error fetching stores:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Mendapatkan store berdasarkan ID
   * @param req - Request object dari Express
   * @param res - Response object dari Express
   */
  public async getStoreById(req: Request, res: Response): Promise<void> {
    try {
      const storeId = parseInt(req.params.id, 10);
      const store = await this.storeService.getStoreById(storeId);

      if (!store) {
        res.status(404).json({ message: "Store not found" });
        return;
      }
      res.status(200).json(store);
    } catch (error) {
      console.error("Error fetching store by ID:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Membuat store baru
   * @param req - Request object dari Express
   * @param res - Response object dari Express
   */
  public async createStore(req: Request, res: Response): Promise<void> {
    try {
      const newStore = await this.storeService.createStore(req.body);
      res.status(201).json(newStore);
    } catch (error) {
      console.error("Error creating store:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Memperbarui store yang ada
   * @param req - Request object dari Express
   * @param res - Response object dari Express
   */
  public async updateStore(req: Request, res: Response): Promise<void> {
    try {
      const storeId = parseInt(req.params.id, 10);
      const updatedStore = await this.storeService.updateStore(storeId, req.body);
      res.status(200).json(updatedStore);
    } catch (error) {
      console.error("Error updating store:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Menghapus store berdasarkan ID
   * @param req - Request object dari Express
   * @param res - Response object dari Express
   */
  public async deleteStore(req: Request, res: Response): Promise<void> {
    try {
      const storeId = parseInt(req.params.id, 10);
      await this.storeService.deleteStore(storeId);
      res.status(200).json({ message: "Store deleted successfully" });
    } catch (error) {
      console.error("Error deleting store:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Menetapkan admin ke store tertentu
   * @param req - Request object dari Express
   * @param res - Response object dari Express
   */
  public async assignStoreAdmin(req: Request, res: Response): Promise<void> {
    try {
      const storeId = parseInt(req.params.id, 10);
      const { adminUserId } = req.body; 
      const store = await this.storeService.assignStoreAdmin(storeId, adminUserId);
      res.status(200).json(store); // Pastikan mengembalikan Response tanpa `return`
    } catch (error) {
      console.error("Error assigning admin:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Tutup koneksi Prisma saat controller tidak lagi digunakan
   */
  public async disconnectService(): Promise<void> {
    await this.storeService.disconnect();
  }
}

export default StoreController;
